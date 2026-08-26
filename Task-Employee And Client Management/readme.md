# Task, Employee & Client Management

A full-stack web application for managing client work end to end: an employee
takes in client requests, assigns the resulting jobs to the workers under them,
and tracks each job through to completion — all behind JWT-secured, role-based
access.

Built with a React + TypeScript frontend and a Django REST backend, and deployed
to a live hosting environment. *(Also maintained as a rebuilt version named
CallNote.)*

## What it does

- **Client requests to jobs.** An employee receives client requests and turns them
  into trackable jobs.
- **Job assignment.** The employee assigns jobs to the workers under them.
- **Status tracking.** Each job is tracked from assignment through to completion.
- **Role-based access.** Only the employee and their workers can see and act on
  their jobs — outside access is blocked.
- **JWT authentication.** All access is secured with JSON Web Tokens.

## Tech stack

| Layer     | Tech                              |
| --------- | --------------------------------- |
| Frontend  | React / Vite / TypeScript         |
| Backend   | Django / Django REST Framework    |
| Auth      | JWT (JSON Web Tokens)             |
| Deploy    | Static build + migrations script  |

## Project structure

```
.
├── client/           # React + Vite + TypeScript frontend
├── server/           # Django REST API + JWT auth
├── build.sh          # Deployment build (install, collectstatic, migrate)
└── requirements.txt
```

## Running locally

**Backend (Django API):**

```bash
cd server
python -m venv venv && source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

**Frontend (Vite dev server):**

```bash
cd client
npm install
npm run dev        # http://localhost:5173
```

## Deployment

The backend is deployment-ready via a build script that installs dependencies,
collects static assets, and applies outstanding migrations:

```bash
pip install -r requirements.txt
python manage.py collectstatic --no-input
python manage.py migrate
```

## Notes

- Roles: an **employee** manages incoming client work and assigns it to the
  **workers** under them; access is scoped per role.
- Configuration (database, Django `SECRET_KEY`, JWT settings) is read from
  environment variables and is not committed to the repository.

---

Built by [Hari Sahar Ravi Kumar](https://github.com/HariSahar).
