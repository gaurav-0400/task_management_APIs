from datetime import date, timedelta

from app.database import SessionLocal
from app.models.comment import Comment
from app.models.task import Task
from app.models.user import User


def seed_database():
    db = SessionLocal()

    try:
        # --------------------------------
        # Users
        # --------------------------------
        existing_users = db.query(User).count()

        if existing_users == 0:
            users = [
                User(
                    name="Rahul Sharma",
                    email="rahul@example.com",
                    role="Developer",
                ),
                User(
                    name="Priya Singh",
                    email="priya@example.com",
                    role="Designer",
                ),
                User(
                    name="Aman Kumar",
                    email="aman@example.com",
                    role="Manager",
                ),
            ]

            db.add_all(users)
            db.commit()

        # Get users after insert
        users = db.query(User).order_by(User.id).all()

        if len(users) < 3:
            print("At least 3 users are required for seed data.")
            return

        # --------------------------------
        # Tasks
        # --------------------------------
        existing_tasks = db.query(Task).count()

        if existing_tasks == 0:
            today = date.today()

            tasks = [
                Task(
                    title="Fix login issue",
                    description="Resolve login issue on mobile devices.",
                    status="pending",
                    priority="high",
                    assigned_to=users[0].id,
                    due_date=today + timedelta(days=3),
                ),
                Task(
                    title="Update landing page",
                    description="Update hero section and CTA content.",
                    status="in_progress",
                    priority="medium",
                    assigned_to=users[1].id,
                    due_date=today + timedelta(days=5),
                ),
                Task(
                    title="Prepare monthly report",
                    description="Prepare the monthly performance report.",
                    status="completed",
                    priority="low",
                    assigned_to=users[2].id,
                    due_date=today - timedelta(days=2),
                ),
                Task(
                    title="Fix payment integration",
                    description="Resolve failed payment webhook handling.",
                    status="blocked",
                    priority="urgent",
                    assigned_to=users[0].id,
                    due_date=today - timedelta(days=1),
                ),
            ]

            db.add_all(tasks)
            db.commit()

        # --------------------------------
        # Comments
        # --------------------------------
        existing_comments = db.query(Comment).count()

        if existing_comments == 0:
            tasks = db.query(Task).order_by(Task.id).all()

            if tasks:
                comments = [
                    Comment(
                        task_id=tasks[0].id,
                        user_id=users[0].id,
                        comment="I have started working on this task.",
                    ),
                    Comment(
                        task_id=tasks[1].id,
                        user_id=users[1].id,
                        comment="The first version is ready for review.",
                    ),
                ]

                db.add_all(comments)
                db.commit()

        print("Database seeded successfully.")

    except Exception as exc:
        db.rollback()
        print(f"Seeding failed: {exc}")

    finally:
        db.close()


if __name__ == "__main__":
    seed_database()