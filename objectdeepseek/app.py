import os
import cv2
from flask import Flask, render_template, Response

# --- FIX FOR PYTHON 3.14 / PYTORCH ---
os.environ["TORCH_FORCE_NO_WEIGHTS_ONLY_LOAD"] = "1"
from ultralytics import YOLO

app = Flask(__name__)
model = YOLO("yolov8n.pt") # Loads the small, fast AI model

def gen_frames():
    # Open the webcam
    cap = cv2.VideoCapture(0)
    
    # Optional: Set camera properties for better performance
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
    cap.set(cv2.CAP_PROP_FPS, 30)
    
    while True:
        success, frame = cap.read()
        if not success:
            break
        else:
            # FIX: Mirror the frame horizontally to fix inverted camera
            # This makes the camera act like a mirror (what you expect)
            frame = cv2.flip(frame, 1)
            
            # Run YOLO detection on the frame
            results = model(frame, stream=True)
            
            # Annotate the frame with boxes and labels
            for r in results:
                frame = r.plot()

            # Encode the frame into JPEG format for the web
            ret, buffer = cv2.imencode('.jpg', frame)
            frame_bytes = buffer.tobytes()

            # Yield the output in a format the browser understands
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

@app.route('/')
def index():
    # This sends the user to the HTML page we created
    return render_template('index.html')

@app.route('/video_feed')
def video_feed():
    # This is the "source" for our <img> tag in HTML
    return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False, threaded=True)
