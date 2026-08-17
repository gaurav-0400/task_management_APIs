# TaskFlow — Internal Task & Management Dashboard

## 1. Project Overview

TaskFlow is a full-stack internal task and management dashboard built to help teams create, assign, track, and manage tasks from a central application.

The application provides a dashboard for monitoring team workload, a complete task management system, task search and filtering, pagination, task details, comments, user management, and an external API integration.

This project was developed as a full-stack interview assignment using:

* React
* Vite
* Tailwind CSS
* FastAPI
* SQLAlchemy
* PostgreSQL

The project follows a layered architecture so that frontend components, API routes, business logic, database access, and validation are separated and reusable.

---

# 2. Main Features

## Dashboard

The dashboard provides a quick overview of the team's current workload.

It displays:

* Total Tasks
* Pending Tasks
* In Progress Tasks
* Completed Tasks
* Overdue Tasks
* Tasks assigned to the current user
* External Team Directory

Dashboard information is retrieved from the FastAPI backend instead of being hardcoded.

The dashboard API calculates task counts directly from PostgreSQL.

---

## Task Management

Users can:

* Create a task
* View a task
* Edit a task
* Delete a task
* Assign a task to a team member
* Set task priority
* Set task status
* Set a due date
* Add a task description
* Add comments or notes

### Task Statuses

The application supports:

* Pending
* In Progress
* Completed
* Blocked

### Task Priorities

The application supports:

* Low
* Medium
* High
* Urgent

---

## Task List

The task management page provides:

* Task name
* Assigned user
* Priority
* Status
* Due date
* Created date
* Last updated date

The page also supports:

* Search
* Status filtering
* Priority filtering
* Assignee filtering
* Sorting
* Pagination

Search, filtering, sorting, and pagination are handled by the backend API.

For example:

```text
/api/tasks?search=shopify
/api/tasks?status=in_progress
/api/tasks?priority=high
/api/tasks?assignee=1
/api/tasks?page=1&limit=10
/api/tasks?sort_by=created_at&order=desc
```

Multiple parameters can also be combined.

---

## Task Details

Clicking a task opens its detailed view.

The task details page displays:

* Task title
* Description
* Current status
* Priority
* Assigned user
* Due date
* Created date
* Last updated date
* Comments

Users can also:

* Edit the task
* Update its status
* Change priority
* Change assignee
* Change due date
* Add comments
* Delete the task

Deleting a task requires confirmation before the operation is performed.

---

## User Management

The application provides a users page where team members can be viewed and created.

Users contain:

* Name
* Email
* Role
* Created date

Users can then be assigned to tasks.

---

## Comments / Notes

Each task can contain multiple comments.

A comment stores:

* User
* Task
* Comment content
* Created date

Comments are displayed on the task details page and can be added without reloading the entire application.

---

## External API Integration

The project includes an external API integration using JSONPlaceholder.

External data is requested by the FastAPI backend, processed, and then exposed to the frontend through:

```http
GET /api/external/users
```

The integration demonstrates:

* External HTTP requests
* Timeout handling
* HTTP error handling
* Response processing
* Data transformation
* Frontend rendering of external data

The external data is displayed in the dashboard under the External Team Directory section.

---

# 3. Development Approach

The project was developed in separate frontend and backend layers.

```text
React + Vite + Tailwind
          │
          │ HTTP / JSON
          ▼
       FastAPI
          │
     ┌────┴────┐
     │         │
 Services   Repositories
     │         │
     └────┬────┘
          │
      SQLAlchemy
          │
          ▼
      PostgreSQL
```

The backend follows a layered structure:

```text
Routes
   ↓
Services
   ↓
Repositories
   ↓
SQLAlchemy Models
   ↓
PostgreSQL
```

This keeps responsibilities separated and makes the application easier to maintain and extend.

The frontend also uses reusable components and separate API service files so that API calls and UI elements can be reused across pages.

---

# 4. Project Structure

```text
task_management_APIs/
│
├── backend/
│   │
│   ├── app/
│   │   ├── models/
│   │   │   ├── user.py
│   │   │   ├── task.py
│   │   │   └── comment.py
│   │   │
│   │   ├── schemas/
│   │   │
│   │   ├── routes/
│   │   │
│   │   ├── services/
│   │   │
│   │   ├── repositories/
│   │   │
│   │   ├── utils/
│   │   │
│   │   ├── database.py
│   │   └── main.py
│   │
│   ├── alembic/
│   │   └── versions/
│   │
│   ├── seed.py
│   ├── alembic.ini
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   │
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── .env.example
│
├── README.md
└── .gitignore
```

---

# 5. Frontend Structure

The frontend is built using React and Vite.

### Pages

```text
Dashboard
Tasks
Task Details
Users
```

### Reusable Components

```text
Button
Modal
Input
Select
StatCard
StatusBadge
PriorityBadge
```

### Services

The frontend communicates with the backend through separate service files.

```text
api.js
taskService.js
userService.js
commentService.js
dashboardService.js
externalService.js
```

Axios is used for API communication.

---

# 6. Backend Structure

The backend is built with FastAPI.

### Models

Database models:

```text
User
Task
Comment
```

### Schemas

Pydantic schemas are used for:

* Request validation
* Response validation
* Structured API payloads

### Routes

Routes handle HTTP requests and connect the API layer to services.

### Services

Services contain business logic such as:

* Validating assigned users
* Creating and updating tasks
* Calculating dashboard statistics
* Creating comments
* Calling external APIs

### Repositories

Repositories handle database queries and keep database access separate from business logic.

---

# 7. Database Design

PostgreSQL is used as the primary database.

The application contains three main tables.

## Users

```text
id
name
email
role
created_at
```

## Tasks

```text
id
title
description
status
priority
assigned_to
due_date
created_at
updated_at
```

## Comments

```text
id
task_id
user_id
comment
created_at
```

### Relationships

```text
Users
  │
  ├───────────────┐
  │               │
  ▼               ▼
Tasks          Comments
  │               ▲
  └───────────────┘
```

Relationships:

* One user can be assigned multiple tasks.
* One user can create multiple comments.
* One task can have multiple comments.
* `tasks.assigned_to` references `users.id`.
* `comments.task_id` references `tasks.id`.
* `comments.user_id` references `users.id`.

---

# 8. Database Migrations

Alembic is used to manage database migrations.

Migration flow:

```text
SQLAlchemy Models
       ↓
Alembic Migration
       ↓
PostgreSQL Schema
```

To apply migrations:

```bash
alembic upgrade head
```

This creates or updates the required database tables.

---

# 9. Seed Data

The project includes a `seed.py` script to create sample:

* Users
* Tasks
* Comments

Run:

```bash
python seed.py
```

This makes it easy to populate a fresh local database with demo data.

---

# 10. API Endpoints

## Users

```http
GET    /api/users
POST   /api/users
GET    /api/users/{id}
```

## Tasks

```http
GET    /api/tasks
POST   /api/tasks
GET    /api/tasks/{id}
PUT    /api/tasks/{id}
DELETE /api/tasks/{id}
```

## Task Search, Filters, Sorting and Pagination

```http
GET /api/tasks?search=shopify
GET /api/tasks?status=in_progress
GET /api/tasks?priority=high
GET /api/tasks?assignee=1
GET /api/tasks?page=1&limit=10
GET /api/tasks?sort_by=created_at&order=desc
```

Combined example:

```http
GET /api/tasks?status=pending&priority=high&assignee=1&page=1&limit=10
```

## Comments

```http
GET  /api/tasks/{task_id}/comments
POST /api/tasks/{task_id}/comments
```

## Dashboard

```http
GET /api/dashboard?user_id=1
```

## External API

```http
GET /api/external/users
```

---

# 11. API Validation and Error Handling

FastAPI and Pydantic are used for request validation.

The API handles common HTTP scenarios including:

```text
200 OK
201 Created
204 No Content
404 Not Found
409 Conflict
422 Validation Error
502 Bad Gateway
503 Service Unavailable
504 Gateway Timeout
```

Examples include:

* Invalid request data
* Invalid email format
* Invalid status
* Invalid priority
* Missing user
* Missing task
* Duplicate user email
* External API timeout
* External API failure

---

# 12. UI/UX Features

The application was designed as a real internal business tool rather than a simple CRUD demo.

The UI includes:

* Clean sidebar navigation
* Responsive layout
* Consistent spacing
* Reusable UI components
* Clear task status indicators
* Priority badges
* Loading states
* Empty states
* Error states
* Confirmation before task deletion
* Responsive task tables and forms
* Mobile-friendly navigation

---

# 13. Environment Configuration

The backend uses a PostgreSQL connection configured through an environment variable.

Backend configuration:

```env
DATABASE_URL=postgresql://postgres:<password>@localhost:5432/task_management_db
```

Frontend configuration:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

Example environment files are provided in the project:

```text
backend/.env.example
frontend/.env.example
```

---

# 14. How to Run the Project

## Prerequisites

Install the following before running the project:

* Python 3.13+
* Node.js
* npm
* PostgreSQL
* Git

---

## Step 1 — Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd task_management_APIs
```

---

## Step 2 — Configure PostgreSQL

Create a PostgreSQL database:

```text
task_management_db
```

The default local configuration is:

```text
Host: localhost
Port: 5432
User: postgres
```

Configure the backend database connection using the project environment configuration.

---

## Step 3 — Backend Setup

Open a terminal in the project folder and run:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

Install the backend dependencies:

```bash
pip install -r requirements.txt
```

---

## Step 4 — Run Database Migrations

From the `backend` directory:

```bash
alembic upgrade head
```

---

## Step 5 — Load Seed Data

From the `backend` directory:

```bash
python seed.py
```

---

## Step 6 — Start the FastAPI Backend

Run:

```bash
python -m uvicorn app.main:app --reload
```

The backend will be available at:

```text
http://127.0.0.1:8000
```

Swagger documentation:

```text
http://127.0.0.1:8000/docs
```

---

## Step 7 — Start the React Frontend

Open a second terminal.

From the project root:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

The frontend will be available at:

```text
http://localhost:5173
```

---

## Step 8 — Running Both Applications

Two terminals are used during local development.

### Terminal 1 — Backend

```bash
cd backend
venv\Scripts\activate
python -m uvicorn app.main:app --reload
```

### Terminal 2 — Frontend

```bash
cd frontend
npm run dev
```

Then open:

```text
http://localhost:5173
```

---

# 15. Application Flow

The main application flow is:

```text
Dashboard
    │
    ├── View task statistics
    │
    ▼
Tasks
    │
    ├── Search
    ├── Filter
    ├── Sort
    ├── Pagination
    └── Create Task
             │
             ▼
       Task Details
             │
       ┌─────┼──────────────┐
       │     │              │
       ▼     ▼              ▼
      Edit  Comments       Delete
       │     │              │
       └─────┴──────────────┘
```

Users can also be created from the Users page and assigned to tasks.

---

# 16. Assignment Requirement Coverage

The application covers the core requirements of the assignment.

### Dashboard

* Total Tasks
* Pending Tasks
* In Progress Tasks
* Completed Tasks
* Overdue Tasks
* Current User Tasks

### Task Management

* Create
* Read
* Update
* Delete
* Assign user
* Priority
* Status
* Due date
* Description
* Comments

### Task List

* Search
* Status filter
* Priority filter
* Assignee filter
* Sorting
* Pagination
* Backend-side filtering and pagination

### Backend API

* REST APIs
* Request validation
* Error handling
* Proper status codes
* Database integration
* Search
* Filtering
* Sorting
* Pagination

### Database

* Users
* Tasks
* Comments
* Foreign-key relationships
* Alembic migrations
* Seed data

### Reusable Architecture

Frontend:

```text
Components
Services
Pages
Layouts
Hooks
Utilities
```

Backend:

```text
Routes
Services
Repositories
Schemas
Models
Utilities
```

### External Integration

* Public external API
* Timeout handling
* Error handling
* Response transformation
* Frontend display

---

# 17. Assumptions

The following assumptions were made during implementation:

* Authentication and login were treated as bonus features and were not included in the core implementation.
* A fixed user ID is currently used to represent the current user for dashboard and comment operations.
* PostgreSQL is used as the local development database.
* Task search, filtering, sorting, and pagination are handled on the backend.
* JSONPlaceholder is used as the external public API because it does not require authentication.
* The application is designed primarily for an internal team-management use case.

---

# 18. Future Improvements

Possible future improvements include:

* JWT authentication
* Role-based access control
* Kanban task board
* Drag-and-drop task management
* Task activity history
* File attachments
* Notifications
* WebSocket-based live updates
* Automated tests
* Docker setup
* Audit logs
* Production deployment

---
