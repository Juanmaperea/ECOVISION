from unittest.mock import patch

from app.modules.visual_processing.service import (
    VisualProcessingService
)


@patch(
    "app.modules.visual_processing.detector.Detector.detect"
)
def test_detection(mock_detect):

    mock_detect.return_value = {

        "detected_object": "Bottle",

        "confidence": 0.93

    }

    result = VisualProcessingService.detect(
        b"fake image"
    )

    assert result["detected_object"] == "Bottle"

    assert result["confidence"] == 0.93