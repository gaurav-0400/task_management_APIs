from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.repositories.dashboard_repository import DashboardRepository
from app.repositories.user_repository import UserRepository


class DashboardService:

    @staticmethod
    def get_dashboard(
        db: Session,
        user_id: int,
    ):

        user = UserRepository.get_by_id(
            db,
            user_id,
        )

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found.",
            )

        return {
            "total_tasks": DashboardRepository.get_total_tasks(db),
            "pending_tasks": DashboardRepository.get_pending_tasks(db),
            "in_progress_tasks": DashboardRepository.get_in_progress_tasks(db),
            "completed_tasks": DashboardRepository.get_completed_tasks(db),
            "overdue_tasks": DashboardRepository.get_overdue_tasks(db),
            "my_tasks": DashboardRepository.get_user_tasks(db, user_id),
        }