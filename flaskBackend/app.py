import cv2 as cv
import numpy as np
import urllib.request
from flask import Flask,request,jsonify

app = Flask(__name__)

@app.route('/getImageData', methods = ['GET'])
def getData():

    # Load pre-trained model for object detection
    objectCascade = cv.CascadeClassifier(cv.data.haarcascades + 'haarcascade_frontalface_alt2.xml')

    # Load pre-trained model for object classification
    classNames = []
    with open('coco.names', 'r') as f:
        classNames = f.read().splitlines()
    net = cv.dnn.readNetFromDarknet('yolov3.cfg', 'yolov3.weights')
    net.setPreferableBackend(cv.dnn.DNN_BACKEND_OPENCV)
    net.setPreferableTarget(cv.dnn.DNN_TARGET_CPU)

    # Load image to detect objects from
    url = request.args.get("url")

    # Download the image from the URL
    req = urllib.request.urlopen(url)
    arr = np.asarray(bytearray(req.read()), dtype=np.uint8)

    # Read the image from memory
    img = cv.imdecode(arr, cv.IMREAD_UNCHANGED)

    # Convert image to 3-channel format
    if img.shape[2] == 4:
        img = cv.cvtColor(img, cv.COLOR_BGRA2BGR)

    # Detect objects in the image using the object detection model
    gray = cv.cvtColor(img, cv.COLOR_BGR2GRAY)
    objects = objectCascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=4)

    # Classify the detected objects using the classification model
    detected_objects = []
    for i, (x,y,w,h) in enumerate(objects):
        roi = img[y:y+h, x:x+w]
        blob = cv.dnn.blobFromImage(roi, 1/255, (416,416), (0,0,0), swapRB=True, crop=False)
        net.setInput(blob)
        output_layers_names = net.getUnconnectedOutLayersNames()
        layerOutputs = net.forward(output_layers_names)
        boxes = []
        confidences = []
        class_ids = []
        for output in layerOutputs:
            for detection in output:
                scores = detection[5:]
                class_id = np.argmax(scores)
                confidence = scores[class_id]
                if confidence > 0.5:
                    center_x = int(detection[0] * w)
                    center_y = int(detection[1] * h)
                    width = int(detection[2] * w)
                    height = int(detection[3] * h)
                    left = int(center_x - width/2)
                    top = int(center_y - height/2)
                    boxes.append([left, top, width, height])
                    confidences.append(float(confidence))
                    class_ids.append(class_id)

        # Add the names of the detected objects to a list
        for j in range(len(boxes)):
            if j in cv.dnn.NMSBoxes(boxes, confidences, 0.5, 0.4):
                detected_objects.append(classNames[class_ids[j]])

    # Convert the image to grayscale
    gray = cv.cvtColor(img, cv.COLOR_BGR2GRAY)

    # Load the pre-trained Haar Cascade classifier for face detection
    faceCascade = cv.CascadeClassifier(cv.data.haarcascades + 'haarcascade_frontalface_default.xml')

    # Detect the faces in the image
    faces = faceCascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

    data = {"objects" : detected_objects, "faceNumbers" : len(faces)}

    return jsonify(data)


if __name__ == '__main__':
    app.run(host="localhost", port=8000,debug="True")