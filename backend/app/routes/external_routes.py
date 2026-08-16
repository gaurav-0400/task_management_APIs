from fastapi import APIRouter

from app.services.external_service import fetch_external_users


router = APIRouter(
    prefix="/api/external",
    tags=["External API"],
)


@router.get("/users")
async def get_external_users():
    return await fetch_external_users()