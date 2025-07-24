# Full-Stack-Engineer-Take-Home-Assessment

# Task Management App

A full-stack Task Manager application built using:

- **Frontend:** React, Axios
- **Backend:** Node.js, Express, PostgreSQL
- **Database:** PostgreSQL
- **Testing:** Jest, React Testing Library

---

##  Features

- Create, view, and complete tasks
- Persistent storage with PostgreSQL
- Responsive UI
- Unit and integration tests
- Error handling and status feedback

---

##  Project Structure

/react-postgres-my-frontend # React frontend
/react-postgres-my-backend # Node.js backend
/src/db # PostgreSQL connection pool
/src/services # Business logic
/src/controllers # Route handlers
/_tests_ # Unit  tests
/src/routes #has the specific url routes


---

## Prerequisites

Make sure you have the following installed:

- **Node.js** (v16+)
- **PostgreSQL** (v13+)
- **Yarn** or **npm**
- **Git**

## Setup the database

CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'incomplete',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

## Update server/db/pool.js with your PostgreSQL credentials.

## Backend setup
cd react-postgres-my-backend
npm install
npm start

Server will start on http://localhost:5000

## Frontend Setup
cd react-postgres-my-frontend
npm install
npm start

## running tests
cd react-postgres-my-backend
npm test

cd react-postgres-my-frontend
npm test

## running docker containers
## start
docker-compose up --build
## shutdown
docker-compose down
