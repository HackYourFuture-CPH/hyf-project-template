# Better Travel API Documentation

This document provides a complete guide to using the Better Travel API. It covers authentication, available resources, and all the endpoints for interacting with the platform.

## Base URL

All API endpoints are relative to the following base URL:
`http://localhost:3001/api`

## Authentication

Most endpoints in this API require authentication. The API uses **JWT (JSON Web Tokens)** for authenticating requests.

1.  **Get a Token**: First, register a new user or log in an existing user using the `/auth/register` or `/auth/login` endpoints. A successful response will include a `token`.
2.  **Use the Token**: To make an authenticated request, include the token in the `Authorization` header with the `Bearer` scheme.

**Header Example**:
`Authorization: Bearer <your_jwt_token>`

Endpoints that are public or have optional authentication are noted explicitly. Routes under `/api/admin/` require a token from a user with the `admin` role.

---

## Health Check

Endpoints for monitoring the API's status.

### **Ping API and Check DB**

Checks the server and database connection status.

- **Endpoint**: `GET /health/health`
- **Authentication**: Not required.
- **Success Response**: `200 OK`
  ```json
  {
      "users": [
          { "id": "...", "username": "testuser_abc", ... },
          { "id": "...", "username": "admin", ... }
      ],
      "travel_plans": [ ... ],
      // ... and a sample of 2 rows from each database table
  }
  ```

---

## Authentication

Endpoints for user registration and session management.

### **Register a New User**

Creates a new user account.

- **Endpoint**: `POST /auth/register`
- **Authentication**: Not required.
- **Request Body**:
  ```json
  {
    "first_name": "Jane",
    "last_name": "Doe",
    "email": "jane.doe@example.com",
    "username": "janedoe",
    "password": "SecurePassword123",
    "password_confirmation": "SecurePassword123",
    "mobile": "1234567890"
  }
  ```
- **Success Response**: `201 Created`
  ```json
  {
    "message": "Welcome Jane! Your account has been created successfully.",
    "user": {
      "id": "...",
      "first_name": "Jane"
    },
    "token": "ey..."
  }
  ```

### **Login User**

Authenticates a user and returns a JWT.

- **Endpoint**: `POST /auth/login`
- **Authentication**: Not required.
- **Request Body**:
  ```json
  {
    "login_identifier": "janedoe",
    "password": "SecurePassword123"
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
      "message": "Welcome back, Jane! You have successfully logged in with your username.",
      "user": { ... },
      "token": "ey..."
  }
  ```

---

## Public Resources

These endpoints are generally available and do not require admin privileges.

### **Tours**

Endpoints for retrieving information about pre-defined tours.

#### Get All Tours

Retrieves a paginated list of all tours, with extensive filtering and sorting options.

- **Endpoint**: `GET /tours`
- **Authentication**: Optional.
- **Query Parameters**:
  - `search` (string): Search term for tour name and description.
  - `sort` (string): Sort order (e.g., `price_minor-asc`, `rating-desc`).
  - `minPrice` (integer): Minimum price in minor units (e.g., cents).
  - `maxPrice` (integer): Maximum price in minor units.
  - `minDuration` (integer): Minimum duration in days.
  - `maxDuration` (integer): Maximum duration in days.
  - `page` / `limit` (integer): For pagination.

#### Get a Single Tour

Retrieves detailed information for a single tour, including its destinations and reviews.

- **Endpoint**: `GET /tours/:id`
- **Authentication**: Optional.

#### Manage Tour Reviews

- `GET /tours/:id/reviews`: Get all reviews for a tour.
- `POST /tours/:id/reviews`: Add a new review (Authentication required).
- `PUT /tours/:id/reviews/:reviewId`: Update your own review (Authentication required).
- `DELETE /tours/:id/reviews/:reviewId`: Delete your own review (Authentication required).

### **Blogposts**

Endpoints for user-generated content.

#### Get All Blogposts

Retrieves a paginated list of all user-created blog posts, with filtering and sorting.

- **Endpoint**: `GET /blogposts`
- **Authentication**: Optional.
- **Query Parameters**:
  - `search` (string): Search term for title and content.
  - `category` (string): Filter by a specific category.
  - `sort` (string): Sort order (e.g., `created_at-desc`).
  - `page` / `limit` (integer): For pagination.

#### Manage Blogposts (Authenticated)

- `GET /blogposts/my-posts`: Get all posts created by the authenticated user.
- `POST /blogposts`: Create a new blog post.
- `PUT /blogposts/:id`: Update a blog post you own.
- `DELETE /blogposts/:id`: Delete a blog post you own.
- `POST /blogposts/:id/photos`: Add a photo URL to a post you own.
- `DELETE /blogposts/:id/photos/:photoId`: Delete a photo from a post you own.

### **Trips (User-Created)**

Endpoints for users to create and manage their own custom travel plans. All endpoints require authentication.

#### Build a Complete Custom Trip

Creates a new trip, including its destinations and linked flights/accommodations, in a single request.

- **Endpoint**: `POST /trips/build`
- **Request Body**:
  ```json
  {
    "name": "My Custom European Adventure",
    "description": "A 10-day trip through Paris and Rome.",
    "destinations": [
      {
        "city_name": "Paris",
        "country_name": "France",
        "stop_order": 1,
        "duration_days": 5,
        "accommodation_ids": ["..."],
        "flight_ids": ["..."]
      }
    ]
  }
  ```

#### Manage Individual Trip Components

- `POST /trips/:tripId/destinations`: Add a single destination to an existing trip.
- `DELETE /trips/:tripId/destinations/:destinationId`: Remove a destination from a trip.
- (Similar `POST` and `DELETE` endpoints exist for `/accommodations` and `/flights` nested under a trip).

---

## Admin API

These endpoints are for administrative use only and require an `admin` role. All are prefixed with `/api/admin`.

### **Get Dashboard Statistics**

Retrieves aggregate counts of key platform data.

- **Endpoint**: `GET /stats`
- **Success Response**: `200 OK`
  ```json
  {
    "message": "Admin dashboard statistics retrieved successfully.",
    "data": {
      "total_users": 150,
      "total_tours": 25,
      "total_posts": 450,
      "total_reviews": 800
    }
  }
  ```

### **Manage Users**

- `GET /users`: Get a paginated list of all users, with search and sort capabilities.
- `PUT /users/:id`: Update a user's role or active status. Body: `{ "role": "moderator", "is_active": false }`.
- `DELETE /users/:id`: Permanently delete a user.

### **Manage Tours**

- `POST /tours`: Create a new pre-defined tour, with the option to include nested destinations.
- (Full `GET`, `PUT`, `DELETE` and nested management for destinations, accommodations, and flights are also available for admins).

### **Manage Posts**

- `POST /posts/:id/photos`: Add a photo to a blog post.
  - **Request Type**: `multipart/form-data`
  - **Request Body**: A form field with the key `postImage` and the value as an uploaded file.

### **Manage Attractions**

- `POST /attractions/:id/photos`: Add a photo to an attraction post.
  - **Request Type**: `application/json`
  - **Request Body**: `{ "image_url": "https://...", "caption": "..." }`
