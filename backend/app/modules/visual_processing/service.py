from app.modules.visual_processing.detector import Detector


class VisualProcessingService:

    @staticmethod
    def detect(image_bytes: bytes):

        return Detector.detect(image_bytes)