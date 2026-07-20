from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.core.dependencies import get_db

from app.modules.history.service import HistoryService

from app.schemas.history import (
    HistoryCreate,
    HistoryResponse
)

router = APIRouter(
    prefix="/history",
    tags=["History"]
)


@router.post(
    "",
    response_model=HistoryResponse
)
def create_history(
    request: HistoryCreate,
    db: Session = Depends(get_db)
):

    return HistoryService.create(
        db,
        request
    )


@router.get(
    "",
    response_model=list[HistoryResponse]
)
def get_history(
    db: Session = Depends(get_db)
):

    return HistoryService.get_all(db)


@router.get(
    "/{history_id}",
    response_model=HistoryResponse
)
def get_history_by_id(
    history_id: int,
    db: Session = Depends(get_db)
):

    history = HistoryService.get_by_id(
        db,
        history_id
    )

    if history is None:

        raise HTTPException(
            status_code=404,
            detail="Registro no encontrado"
        )

    return history