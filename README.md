# Task Scheduler Application

The Task Scheduler is a web application designed to manage tasks and their execution schedules. It consists of a frontend built with React and TypeScript and a backend using TypeScript, Node.js, Express, and PostgreSQL. This guide will walk you through setting up and running the application using Docker containers.

## Prerequisites

Before starting, ensure you have the following installed on your machine:

- Docker: Install Docker
- Docker Compose: Install Docker Compose

## Project Structure

```
Task_Scheduler/
│
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── app.ts
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── ...
│
└── frontend/
    ├── Dockerfile
    ├── package.json
    ├── public/
    ├── src/
    └── ...
```

- backend/: Contains the Node.js backend server.
- frontend/: Contains the React frontend application.

## Backend Setup

1.  Configure Environment Variables
    Create a .env file in the backend/ directory with the following environment variables:

```
PORT=3000
APP_SECRET=your_app_secret_here
NODE_ENV=production
PROD_PORT=5432
PROD_NAME=task_scheduler_db
PROD_USERNAME=postgres
PROD_HOST=db
PROD_PASSWORD=postgres_password
```

Replace your_app_secret_here and postgres_password with your actual values.

2. Database Configuration

Ensure your PostgreSQL database is configured with the following:

- Database Name: task_scheduler_db
- User: postgres
- Password: postgres_password

3. Build and Run Backend Docker Container

Navigate to the backend/ directory and run:

`docker-compose up --build`

This command will build the Docker image and start the backend server container.

## Frontend Setup

1. Build and Run Frontend Docker Container

Navigate to the frontend/ directory and run:

`docker-compose up --build`

This command will build the Docker image and start the frontend application container.

2.  Accessing the Frontend

The frontend should now be accessible on http://localhost:4173.

## Usage

- Open your web browser and go to http://localhost:4173 to access the Task Scheduler application.

- Use the application to manage tasks, schedule executions, and view logs.

## Stopping the Application

To stop the application and remove the containers:

`docker-compose down`

This will stop and remove both the backend and frontend containers.
