from fastapi import APIRouter, Depends, Response, status,Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.task import TaskCreate, TaskResponse, TaskUpdate,TaskListResponse
from app.services.task_service import TaskService


router = APIRouter(
    prefix="/api/tasks",
    tags=["Tasks"],
)


@router.post(
    "",
    response_model=TaskResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_task(
    task_data: TaskCreate,
    db: Session = Depends(get_db),
):
    return TaskService.create_task(
        db,
        task_data,
    )


# @router.get(
#     "",
#     response_model=list[TaskResponse],
# )
# def get_tasks(
#     db: Session = Depends(get_db),
# ):
#     return TaskService.get_tasks(db)

@router.get(
    "",
    response_model=TaskListResponse,
)
def get_tasks(
    search: str | None = Query(
        default=None,
        min_length=1,
    ),
    status_filter: str | None = Query(
        default=None,
        alias="status",
    ),
    priority: str | None = None,
    assignee: int | None = None,
    sort_by: str = Query(
        default="created_at",
        pattern="^(created_at|updated_at|due_date|title)$",
    ),
    order: str = Query(
        default="desc",
        pattern="^(asc|desc)$",
    ),
    page: int = Query(
        default=1,
        ge=1,
    ),
    limit: int = Query(
        default=10,
        ge=1,
        le=100,
    ),
    db: Session = Depends(get_db),
):
    return TaskService.get_filtered_tasks(
        db,
        search=search,
        status=status_filter,
        priority=priority,
        assignee=assignee,
        sort_by=sort_by,
        order=order,
        page=page,
        limit=limit,
    )


@router.get(
    "/{task_id}",
    response_model=TaskResponse,
)
def get_task(
    task_id: int,
    db: Session = Depends(get_db),
):
    return TaskService.get_task(
        db,
        task_id,
    )


@router.put(
    "/{task_id}",
    response_model=TaskResponse,
)
def update_task(
    task_id: int,
    task_data: TaskUpdate,
    db: Session = Depends(get_db),
):
    return TaskService.update_task(
        db,
        task_id,
        task_data,
    )


@router.delete(
    "/{task_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
):
    TaskService.delete_task(
        db,
        task_id,
    )

    return Response(status_code=status.HTTP_204_NO_CONTENT)