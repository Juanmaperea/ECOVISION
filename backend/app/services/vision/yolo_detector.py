from app.schemas.detection import VisionDetection


def detect_waste_from_image(image_bytes: bytes) -> VisionDetection:
    """Placeholder for YOLOv8 inference.

    Next step: load an Ultralytics YOLO model once at startup and run inference
    over decoded OpenCV frames.
    """
    return VisionDetection(
        object_name="unknown",
        confidence=0.0,
        bounding_box=None,
    )
