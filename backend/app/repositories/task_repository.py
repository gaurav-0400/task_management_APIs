from sqlalchemy.orm import Session

from app.models.task import Task
from sqlalchemy import or_  


# class TaskRepository:

#     @staticmethod
#     def create(db: Session, task: Task) -> Task:
#         db.add(task)
#         db.commit()
#         db.refresh(task)

#         return task

#     @staticmethod
#     def get_all(db: Session) -> list[Task]:
#         return db.query(Task).order_by(Task.id.desc()).all()

#     @staticmethod
#     def get_by_id(db: Session, task_id: int) -> Task | None:
#         return db.query(Task).filter(Task.id == task_id).first()

#     @staticmethod
#     def update(db: Session, task: Task) -> Task:
#         db.commit()
#         db.refresh(task)

#         return task

#     @staticmethod
#     def delete(db: Session, task: Task) -> None:
#         db.delete(task)
#         db.commit()




class TaskRepository:

    @staticmethod
    def create(db: Session, task: Task) -> Task:
        db.add(task)
        db.commit()
        db.refresh(task)
        return task

    @staticmethod
    def get_by_id(
        db: Session,
        task_id: int,
    ) -> Task | None:
        return (
            db.query(Task)
            .filter(Task.id == task_id)
            .first()
        )

    @staticmethod
    def update(
        db: Session,
        task: Task,
    ) -> Task:
        db.commit()
        db.refresh(task)
        return task

    @staticmethod
    def delete(
        db: Session,
        task: Task,
    ) -> None:
        db.delete(task)
        db.commit()

    @staticmethod
    def get_filtered_tasks(
        db: Session,
        *,
        search: str | None = None,
        status: str | None = None,
        priority: str | None = None,
        assignee: int | None = None,
        sort_by: str = "created_at",
        order: str = "desc",
        page: int = 1,
        limit: int = 10,
    ) -> tuple[list[Task], int]:

        query = db.query(Task)

        # Search
        if search:
            search_term = f"%{search}%"

            query = query.filter(
                or_(
                    Task.title.ilike(search_term),
                    Task.description.ilike(search_term),
                )
            )

        # Status filter
        if status:
            query = query.filter(
                Task.status == status
            )

        # Priority filter
        if priority:
            query = query.filter(
                Task.priority == priority
            )

        # Assignee filter
        if assignee is not None:
            query = query.filter(
                Task.assigned_to == assignee
            )

        # Total records before pagination
        total = query.count()

        # Sorting
        sort_column = getattr(
            Task,
            sort_by,
            Task.created_at,
        )

        if order == "asc":
            query = query.order_by(sort_column.asc())
        else:
            query = query.order_by(sort_column.desc())

        # Pagination
        offset = (page - 1) * limit

        tasks = (
            query
            .offset(offset)
            .limit(limit)
            .all()
        )

        return tasks, total
    