require('dotenv').config()
const User = require("../model/user");
const cloudinary = require('cloudinary').v2;
const axios = require('axios')

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

var Canvas = require("canvas");
global.Image = Canvas.Image;

exports.addUser = (req,res) => {
    const data = req.body;
    User
    .findOne({code : data.code})
    .then(userData => {
        if(userData){
            if(userData.name == data.name && userData.email == data.email){
                res.status(200).json({
                    code : data.code,
                    message : "Test Already Exists"
                })
            } else {
                res.status(200).json({
                    message : "Test Code is Registered But Invalid Candidate"
                })
            }
        } else {
            const newImages = [];
            const userData = new User({
                name: data.name,
                email : data.email,
                code : data.code,
                images : newImages,
            })
            userData
            .save()
            .then(data => {
                res.status(201).json({
                    code : data.code,
                    message : "Data Saved"
                });
            })
            .catch(err => {
                res.status(500).json({
                    message : err
                });
            })
        }
    })
    .catch(err => {
        res.status(500).json({
            message : err
        })
    })
}

exports.addImage = async (req,res) => {
    const imageString = req.body.picture;
    User.findOne({code : req.body.code})
    .then(userData => {
        if(userData){
            cloudinary.uploader.upload(imageString, { 
                folder: 'Images',
                use_filename: true,
                unique_filename: true,
                overwrite: false,
                resource_type: 'image',
                type: 'private',
                access_mode: 'authenticated',
                data_uri: true
            })
            .then(data => {
                return data.secure_url;
            })
            .then(data => {
                axios.get(`http://localhost:8000/getImageData?url=${data}`)
                .then(responseData => {
                    const newObjectArray = [...responseData.data.objects]
                    userData.images.push({
                        url : data,
                        timeStamp : req.body.timestamp,
                        objects : newObjectArray,
                        facesDetected : responseData.data.faceNumbers
                    })
                    userData
                    .save()
                    .then(data => {
                        res.status(201).json({
                            message : "Image Succesfully Captured and saved"
                        })
                    })
                    .catch(err => {
                        res.status(500).json({
                            message : "Couldn't Save Image"
                        })
                    })
                })
                .catch(err => {
                    res.status(500).json({
                        message : "Cannot Reach Python Server"
                    })
                })
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({ message: "Error uploading image to Cloudinary" });
            })
        } else {
            res.status(204).json({
                message : "Such Exam Code Doesn't Exist"
            })
        }
    })
    .catch(err => {
        res.status(500).json({
            message : "Cannot Find The Test Code"
        })
    })
}

exports.getAllUserData = (req,res) => {
    User.find()
    .then(data =>{
        const newData = data.map(items => {
            return {name : items.name,email : items.email,code : items.code};
        })
        res.status(200).send({
            data : newData,
            message : "Successfully Retrieved"
        })
    })
    .catch(err => {
        res.status(500).send({
            message : "internal Server Error"
        })
    })
}

exports.getImagesByCode = (req,res) => {
    User.findOne({code : req.query.code})
    .then(data => {
        const total = data.images.length;
        const startingIndex = (parseInt(req.query.pageNum) - 1) * 10;
        const endingIndex = Math.min(total-1,startingIndex+9);
        res.status(200).json({
            totalLength : total,
            arrayList : data.images.slice(startingIndex,endingIndex+1),
            message : "SuccessFully Parsed"
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).send({
            message : "internal Server Error"
        })
    })
}