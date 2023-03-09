const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true},
  email: { type: String, required: true,},
  code : {type : String, required: true, unique : true , match: [/^\d{7}$/, 'Please enter a 7-digit number']},
  images : [{
    url : {type : String},
    timeStamp : {type : Date, default: Date.now },
    objects : Array,
    facesDetected : Number
  }]
});

module.exports = mongoose.model('User', UserSchema);