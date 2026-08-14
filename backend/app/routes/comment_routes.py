from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.comment import CommentCreate, CommentResponse
from app.services.comment_service import CommentService


router = APIRouter(
    prefix="/api/tasks/{task_id}/comments",
    tags=["Comments"],
)


@router.post(
    "",
    response_model=CommentResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_comment(
    task_id: int,
    comment_data: CommentCreate,
    db: Session = Depends(get_db),
):
    return CommentService.create_comment(
        db,
        task_id,
        comment_data,
    )


@router.get(
    "",
    response_model=list[CommentResponse],
)
def get_comments(
    task_id: int,
    db: Session = Depends(get_db),
):
    return CommentService.get_comments(
        db,
        task_id,
    )