from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.task import Task
from app.repositories.task_repository import TaskRepository
from app.repositories.user_repository import UserRepository
from app.schemas.task import TaskCreate, TaskUpdate
import math


class TaskService:

    @staticmethod
    def create_task(
        db: Session,
        task_data: TaskCreate,
    ) -> Task:

        if task_data.assigned_to is not None:
            user = UserRepository.get_by_id(
                db,
                task_data.assigned_to,
            )

            if not user:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Assigned user not found.",
                )

        task = Task(
            title=task_data.title,
            description=task_data.description,
            status=task_data.status.value,
            priority=task_data.priority.value,
            assigned_to=task_data.assigned_to,
            due_date=task_data.due_date,
        )

        return TaskRepository.create(db, task)

    @staticmethod
    def get_tasks(db: Session) -> list[Task]:
        return TaskRepository.get_all(db)

    @staticmethod
    def get_task(
        db: Session,
        task_id: int,
    ) -> Task:

        task = TaskRepository.get_by_id(
            db,
            task_id,
        )

        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found.",
            )

        return task

    @staticmethod
    def update_task(
        db: Session,
        task_id: int,
        task_data: TaskUpdate,
    ) -> Task:

        task = TaskRepository.get_by_id(
            db,
            task_id,
        )

        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found.",
            )

        if task_data.assigned_to is not None:
            user = UserRepository.get_by_id(
                db,
                task_data.assigned_to,
            )

            if not user:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Assigned user not found.",
                )

        update_data = task_data.model_dump(
            exclude_unset=True,
        )

        if "status" in update_data:
            update_data["status"] = update_data["status"].value

        if "priority" in update_data:
            update_data["priority"] = update_data["priority"].value

        for field, value in update_data.items():
            setattr(task, field, value)

        return TaskRepository.update(db, task)

    @staticmethod
    def delete_task(
        db: Session,
        task_id: int,
    ) -> None:

        task = TaskRepository.get_by_id(
            db,
            task_id,
        )

        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found.",
            )

        TaskRepository.delete(db, task)