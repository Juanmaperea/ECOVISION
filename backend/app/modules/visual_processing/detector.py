import tempfile

from ultralytics.engine.results import Results

from app.modules.visual_processing.yolo_model import YOLOModel


class Detector:

    @staticmethod
    def detect(image_bytes: bytes):

        with tempfile.NamedTemporaryFile(
            suffix=".jpg",
            delete=True
        ) as temp:

            temp.write(image_bytes)

            temp.flush()

            model = YOLOModel.get_model()

            results = model(temp.name)

        if len(results) == 0:

            return {
                "detected_object": "Unknown",
                "confidence": 0.0
            }

        result: Results = results[0]

        if len(result.boxes) == 0:

            return {
                "detected_object": "Unknown",
                "confidence": 0.0
            }

        box = result.boxes[0]

        class_id = int(box.cls[0])

        confidence = float(box.conf[0])

        label = result.names[class_id]

        return {
            "detected_object": label,
            "confidence": round(confidence, 3)
        }