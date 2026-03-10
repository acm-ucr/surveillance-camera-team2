from flask import Flask, render_template, Response
import cv2
from ultralytics import YOLO
import paho.mqtt.client as mqtt
import base64
import time

app = Flask(__name__)

model = YOLO("/Users/taito/Downloads/bestV2.pt")

cap = cv2.VideoCapture('http://172.20.10.3:81/stream')

broker = "broker.emqx.io"
port = 1883
topic = "taito/yolo/video/demo123"  

mqtt_client = mqtt.Client()
mqtt_client.connect(broker, port, 60)
mqtt_client.loop_start()  # important for async networking

def generate_frames():
    while True:
        success, frame = cap.read()
        if not success:
            break

        results = model(frame, conf=0.4)
        annotated_frame = results[0].plot()

        ret, buffer = cv2.imencode('.jpg', annotated_frame)
        frame_bytes = buffer.tobytes()

        jpg_as_text = base64.b64encode(frame_bytes).decode('utf-8')
        mqtt_client.publish(topic, jpg_as_text)

        yield (b'--frame\r\nContent-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

@app.route('/')
def index():
    return '''
        <img src="/video">
    '''

@app.route('/video')
def video():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)