# Face Detection During Exam

This project is a Chrome extension frontend with a backend server created using NodeJS with Express, a Flask app using OpenCV to detect faces and objects, an admin dashboard created using React, and MongoDB used as backend.

## Chrome Extension Frontend

The Chrome extension frontend is built using HTML, CSS, and JavaScript. There is a manifest.json file that includes a background.js file as the service worker and scriptContent.js file as the script content. 

```
Note

There are some issues with the Chrome extension that may prevent it from working correctly. As an alternative, I have created a simple webpage that can be used to achieve the same functionality. You can access the webpage by following the below steps.

If you still want to try the Chrome extension, please note that it may not work as expected. I am working on resolving the issues and will update the extension as soon as possible.

Due to some technical limitations with the Chrome browser, the service worker and media devices functionality is not working as intended. This may cause the extension to not work properly on some devices or browsers. Therefore, instead of the extension, a simple webpage has been created to showcase the main functionality.

```

Run the Chrome extension 

```bash
cd frontend/chrome-extension
python -m http.server 5501
```
Open Your Web browser and type
```
http://localhost:5501/
```
This will load the index.html file in your browser. You can then interact with your HTML, CSS, and JS code as you normally would.

Once you are done, you can stop the server by pressing Ctrl + C in your terminal/command prompt.

There are screenshots of the UI attached for reference.

<img src="./uploads/extension.png">

## Admin Dashboard

The admin dashboard is built using React and can be started by running the following command in the terminal:

```bash
cd frontend/dashboard
npm intsall
npm start
```

The UI of the dashboard is intuitive and easy to use. Screenshots of the UI are attached for reference.

<img src="./uploads/testlist.png">
<img src="./uploads/search.png">
<img src="./uploads/TestResults.png">

## Backend Server

The backend server is built using NodeJS and Express. I have used Cloudinary to store images. Cloudinary is a cloud service that provides storage facility. To install the dependencies, run the following command in the terminal:

```bash
cd backend
npm install
npm start
```

A .env file is required to run the server. The file should contain the following credentials:

```js
MONGOURI=mongodb+srv://sample:password@cluster0.6spjihr.mongodb.net/user
PORT=5000
CLOUD_NAME=Cloud_File
API_KEY=123456789321645
API_SECRET=randomText
```

Make sure to place the .env file in the backend folder.

## Flask App

The Flask app uses OpenCV to detect faces and objects, and there is just one post request. The NodeJS server calls the Flask app.

To get started :

```bash
cd flaskBackend
pip install opencv-python
pip install Flask
pip install numpy
```

Now download the files and save it in the flaskBackend Folder :

1. [coco.names](https://github.com/pjreddie/darknet/blob/master/data/coco.names)
2. [yolov3.cfg](https://github.com/pjreddie/darknet/blob/master/cfg/yolov3.cfg)
3. [yolov3.weights](https://pjreddie.com/media/files/yolov3.weights
)

Run the python file :

```bash
python app.py
```