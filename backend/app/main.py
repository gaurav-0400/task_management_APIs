from fastapi import FastAPI
from sqlalchemy import text
from app.database import engine
from app.routes.user_routes import router as user_router
from app.routes.task_routes import router as task_router
from app.routes.comment_routes import router as comment_router
from app.routes.dashboard_routes import router  as dashboard_router
from app.routes.external_routes import router as external_router

from fastapi.middleware.cors import CORSMiddleware   

app = FastAPI()

app.add_middleware(
    CORSMiddleware,   ### ALLOW react frontend origin 
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



app.include_router(user_router)
app.include_router(task_router)
app.include_router(comment_router)
app.include_router(dashboard_router)
app.include_router(external_router)



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