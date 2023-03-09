import {timer} from "./config.js";
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const codeInput = document.getElementById('code');
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const userForm = document.getElementById('userForm');
const stopButton = document.getElementById('stopButton');
const startButton = document.getElementById('submit');
const testDiv = document.getElementById('test');
const error = document.getElementById('err');

canvas.style.display = 'none';
video.style.display = "none";
stopButton.style.display = "none";
testDiv.style.display = "none";
error.style.display = "none";
let intervalId;

function startCamera() {
    navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
        const video = document.getElementById('video');
        video.srcObject = stream;
        video.autoplay = true;
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function takePicture() {
  const context = canvas.getContext('2d');
  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;
  context.drawImage(video, 0, 0, width, height);
  return canvas.toDataURL('image/png');
}

async function sendPicture(data) {
  try{
    const picture = await takePicture();
    const imageData = {
      picture: picture,
      code : data.code,
      timestamp: new Date().toISOString()
    };
    const response = await fetch('http://localhost:5000/add-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(imageData)
    })
    const responseData = response.json();
    if(responseData.status == 500 || responseData.status == 204){
      error.innerHTML = responseData.message;
      error.style.display = "block";
    } else {
      error.style.display = "none";
    }
  } catch(err) {
      error.innerHTML = data.message;
      error.style.display = "block";
  }
}

function handleInputChange(event) {
  const target = event.target;
  const value = target.value;
  const name = target.name;

  if (name === 'name') {
    setName(value);
  } else if (name === 'email') {
    setEmail(value);
  } else if (name === 'code') {
    setCode(value);
  }
}

function handleSubmit(event) {
  event.preventDefault();

  const data = {
    name: nameInput.value,
    email: emailInput.value,
    code: codeInput.value
  };

  fetch('http://localhost:5000/add-user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
    return data;
  })
  .then(data => {
    if(data.message != "Invalid Person" && data.status != 500){
      startCamera();
    }
    return data;
  })
  .then(data => {
    if(data.message == "Invalid Person" || data.status == 500){
      error.innerHTML = data.message;
      error.style.display = "block";
    } else {
      error.style.display = "none";
      stopButton.style.display = "block";
      testDiv.style.display = "block";
      userForm.reset();
      userForm.style.display = "none";
      startButton.style.display = "none";
      intervalId = setInterval(() => {
        sendPicture(data);
      }, timer*1000*60);
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

const handleExit = async() => {
  clearInterval(intervalId);
  const mediaStream = video.srcObject;
  const tracks = mediaStream.getTracks();
  tracks.forEach(track => track.stop());
  userForm.style.display = "block";
  startButton.style.display = "block";
  stopButton.style.display = "none";
  testDiv.style.display = "none";
}

userForm.addEventListener('submit', handleSubmit);
stopButton.addEventListener('click',handleExit);