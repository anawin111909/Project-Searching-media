Searching Open-License Media Web App

A full-stack web application that allows users to search and view open-license media from the Openverse API. The system supports user authentication, search history tracking, and clean integration of modern software engineering practices such as testing and containerisation.

---

Features

- User login and registration (with JWT authentication)
- Search for open-license images from Openverse
- Save and view search history per user
- Option to delete search history
- Full testing setup (frontend and backend)
- Dockerised for consistent deployment

---

Technologies Used

Frontend : React + Vite, Tailwind, Router   
Backend  : FastAPI, Pydantic, SQLAlchemy    
Database : PostgreSQL                       
Testing  : Vitest, React Testing Library, Pytest 
DevOps   : Docker, Docker Compose           

---

Installation & Usage

Requirements

- Docker
- Docker Compose

Running the App

```bash
docker-compose up --build
