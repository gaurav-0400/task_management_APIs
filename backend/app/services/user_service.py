from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.user import UserCreate


class UserService:

    @staticmethod
    def create_user(db: Session, user_data: UserCreate) -> User:

        existing_user = UserRepository.get_by_email(
            db,
            user_data.email,
        )

        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="A user with this email already exists.",
            )

        user = User(
            name=user_data.name,
            email=user_data.email,
            role=user_data.role,
        )

        return UserRepository.create(db, user)



    @staticmethod
    def get_users(db: Session) -> list[User]:
        return UserRepository.get_all(db)

    @staticmethod
    def get_user(db: Session, user_id: int) -> User:

        user = UserRepository.get_by_id(db, user_id)

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found.",
            )

        return user