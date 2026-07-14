from ultralytics import YOLO

from app.core.config import settings


class YOLOModel:

    _model = None

    @classmethod
    def get_model(cls):

        if cls._model is None:

            cls._model = YOLO(settings.YOLO_MODEL)

        return cls._model