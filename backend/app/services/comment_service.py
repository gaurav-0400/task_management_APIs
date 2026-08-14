from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.comment import Comment
from app.repositories.comment_repository import CommentRepository
from app.repositories.task_repository import TaskRepository
from app.repositories.user_repository import UserRepository
from app.schemas.comment import CommentCreate


class CommentService:

    @staticmethod
    def create_comment(
        db: Session,
        task_id: int,
        comment_data: CommentCreate,
    ) -> Comment:

        # Check task
        task = TaskRepository.get_by_id(
            db,
            task_id,
        )

        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found.",
            )

        # Check user
        user = UserRepository.get_by_id(
            db,
            comment_data.user_id,
        )

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found.",
            )

        comment = Comment(
            task_id=task_id,
            user_id=comment_data.user_id,
            comment=comment_data.comment,
        )

        return CommentRepository.create(
            db,
            comment,
        )

    @staticmethod
    def get_comments(
        db: Session,
        task_id: int,
    ) -> list[Comment]:

        task = TaskRepository.get_by_id(
            db,
            task_id,
        )

        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found.",
            )

        return CommentRepository.get_by_task_id(
            db,
            task_id,
        )