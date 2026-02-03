import cv2
from ultralytics import YOLO

model = YOLO("/Users/taito/Downloads/best.pt")
print(model.names)

cap = cv2.VideoCapture(0)

while cap.isOpened():
    success, frame = cap.read()
    if not success:
        break

    results = model.track(
        frame,
        conf=0.4,
        imgsz=640,
        tracker="bytetrack.yaml",
        persist=True
    )

    count = len(results[0].boxes) if results[0].boxes is not None else 0
    cv2.putText(
        frame,
        f"Total: {count}",
        (50, 50),
        cv2.FONT_HERSHEY_SIMPLEX,
        1,
        (0, 0, 255),
        2
    )

    cv2.imshow("YOLO Webcam", results[0].plot())

    if cv2.waitKey(1) == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()


