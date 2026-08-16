from datetime import date

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.task import Task


class DashboardRepository:

    @staticmethod
    def get_total_tasks(db: Session) -> int:
        return db.query(func.count(Task.id)).scalar() or 0

    @staticmethod
    def get_pending_tasks(db: Session) -> int:
        return (
            db.query(func.count(Task.id))
            .filter(Task.status == "pending")
            .scalar()
            or 0
        )

    @staticmethod
    def get_in_progress_tasks(db: Session) -> int:
        return (
            db.query(func.count(Task.id))
            .filter(Task.status == "in_progress")
            .scalar()
            or 0
        )

    @staticmethod
    def get_completed_tasks(db: Session) -> int:
        return (
            db.query(func.count(Task.id))
            .filter(Task.status == "completed")
            .scalar()
            or 0
        )

    @staticmethod
    def get_overdue_tasks(db: Session) -> int:
        return (
            db.query(func.count(Task.id))
            .filter(
                Task.due_date < date.today(),
                Task.status != "completed",
            )
            .scalar()
            or 0
        )

    @staticmethod
    def get_user_tasks(
        db: Session,
        user_id: int,
    ) -> int:
        return (
            db.query(func.count(Task.id))
            .filter(Task.assigned_to == user_id)
            .scalar()
            or 0
        )