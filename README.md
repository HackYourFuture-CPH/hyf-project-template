# Project Name : LeafNotes

LeafNotes is a web application designed to help users track their reading journey by recording details for each book they read. With this app, users can save important information such as the book's title, author, reading date, favorite quotes, and personal notes. This enables users to maintain a meaningful and organized reading history that they can revisit at any time.

# Features

    Track the books you've read with title, author, and personal notes.
    Save favorite quotes for each book.
    Take notes while reading a book and save for future reference . So no need to read the fullbook again
    View and update your reading history.
    Integration with Google Books API to fetch book details.
    Secure authentication using JWT tokens.

# Architecture

This project consists of two primary packages:

    API (Backend): A Node.js project using Express.js, Knex.js for the API and MySQL database for data storage.
    App (Frontend): A Next.js project using React to build the web app interface.

# Technologies Used:

    Backend: Node.js, Express.js, Knex.js, MySQL
    Frontend: React.js, Next.js, Material-UI
    Authentication: JWT (JSON Web Tokens)
    API Requests: Axios, Fetch
    Environment Variables: dotenv for managing environment-specific variables

# Installation

git clone https://github.com/Saikiruthiga/LeafNotes.git

# Backend setup

cd LeafNotes/api

# Install dependencies:

npm install

# Set up the environment variables:

Create a .env.local file in the api directory and add the following content:

NODE_ENV=development
PORT=3001

# Database Configuration

DB_CLIENT=mysql2
DB_HOST=<your-database-host>
DB_PORT=3306
DB_USER=<your-database-user>
DB_PASSWORD=<your-database-password>
DB_DATABASE_NAME=<your-database-name>
DB_USE_SSL=true

# Google Books API Key

GOOGLE_BOOKS_API_KEY=<your-google-books-api-key>

# JWT Authentication Token Secret

JWT_SECRET_KEY=<your-jwt-secret-key>

# Frontend URL (for development)

FRONTEND_URL=http://localhost:3000

# Backend URL (for development)

BACKEND_URL=http://localhost:3001

# Start the server

npm run dev
Your backend will be running at http://localhost:3001.

# Frontend Setup

Navigate to the frontend directory:
cd LeafNotes/app

# Install dependencies:

npm install

# Set up the environment variables:

Create a .env.local file in the app directory and add the following content:

NEXT_PUBLIC_API_BASE_URL=http://localhost:3001

# Start the server:

npm run dev
Your frontend will be available at http://localhost:3000.

# Production Setup

For production, the environment variables need to be updated accordingly.

# Backend (Production)

Create a .env.production file in the api directory with the following content:

NODE_ENV=production
FRONTEND_URL=https://leafnotes-1.onrender.com
BACKEND_URL=https://leafnotes.onrender.com

# Frontend (Production)

Create a .env.production file in the app directory with the following content:

NEXT_PUBLIC_API_BASE_URL=https://leafnotes.onrender.com

# Scripts

Frontend

    dev: Start the Next.js development server.
    build: Build the Next.js application for production.
    start: Start the Next.js application in production mode.

Backend

    dev: Start the backend development server using nodemon.
    start: Start the backend server in production mode.
    format: Format the backend code using Prettier.
    check: Run ESLint checks on the backend code.

# Deployment

Backend
The backend is deployed using Render.com. The deployed backend URL is:

https://leafnotes.onrender.com

Frontend
The frontend is also deployed using Render.com. The deployed frontend URL is:

https://leafnotes-1.onrender.com
