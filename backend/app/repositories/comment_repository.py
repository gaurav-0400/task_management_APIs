from sqlalchemy.orm import Session

from app.models.comment import Comment


class CommentRepository:

    @staticmethod
    def create(
        db: Session,
        comment: Comment,
    ) -> Comment:
        db.add(comment)
        db.commit()
        db.refresh(comment)

        return comment

    @staticmethod
    def get_by_task_id(
        db: Session,
        task_id: int,
    ) -> list[Comment]:
        return (
            db.query(Comment)
            .filter(Comment.task_id == task_id)
            .order_by(Comment.created_at.asc())
            .all()
        )