from fastapi import FastAPI
from sqlalchemy import text
from app.database import engine
from app.routes.user_routes import router as user_router

app = FastAPI()

app.include_router(user_router)


@app.get("/")
def root():
    return {"message": "Task Management API is running"}


@app.get("/test-db")
def test_database():
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        return {
            "database": result.scalar()
        }