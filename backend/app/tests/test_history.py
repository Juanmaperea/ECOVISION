from unittest.mock import MagicMock

from app.modules.history.service import HistoryService

from app.schemas.history import HistoryCreate


def test_create_history():

    db = MagicMock()

    request = HistoryCreate(

        detected_object="Bottle",

        confidence=0.94,

        recommendation="Contenedor blanco",

        explanation="Plástico reciclable"

    )

    result = HistoryService.create(

        db,

        request

    )

    assert result.detected_object == "Bottle"

    assert result.confidence == 0.94