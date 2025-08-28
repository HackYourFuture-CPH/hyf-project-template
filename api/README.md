# CRUD API with PostgreSQL and JWT Authentication

A complete REST API with comprehensive user authentication and CRUD operations for posts.

## Features

- **Advanced User Authentication**: Register and login with JWT tokens
- **Comprehensive Registration**: First name, last name, email, username, password, mobile
- **Password Confirmation**: Secure password validation with confirmation
- **Multiple Login Methods**: Login with email, username, or mobile
- **User Profile Management**: Update profile, change password
- **Role-Based Access Control**: User, admin, and moderator roles
- **CRUD Operations**: Create, Read, Update, Delete posts
- **PostgreSQL Database**: Using Knex.js as query builder
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt for secure password storage
- **Zod Validation**: Comprehensive input validation with friendly error messages
- **Friendly User Messages**: Clear, helpful success and error messages
- **Account Management**: Activate/deactivate accounts, track login history

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=3000

# Database Configuration (PostgreSQL)
DB_CLIENT=pg
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_username
DB_PASSWORD=your_password
DB_DATABASE_NAME=your_database_name
DB_USE_SSL=false

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
```

### 3. Database Setup

1. Create a PostgreSQL database
2. Run migrations to create tables:

```bash
npm run migrate
```

### 4. Start the Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user (with email, username, or mobile)

### User Management (Requires Authentication)

- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/change-password` - Change password
- `GET /api/users` - Get all users (Admin only)
- `PUT /api/users/:id/status` - Activate/deactivate user (Admin only)

### Posts (Requires Authentication)

- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

## Registration Fields & Validation

### Required Fields:
- **first_name**: User's first name (2-50 characters, letters and spaces only)
- **last_name**: User's last name (2-50 characters, letters and spaces only)
- **email**: Valid email address (unique, max 100 characters)
- **username**: 3-20 characters, alphanumeric and underscore only (unique, cannot start/end with underscore)
- **password**: Minimum 8 characters with uppercase, lowercase, and number
- **password_confirmation**: Must match password exactly
- **mobile**: Phone number (10-15 digits, unique, supports country codes)

### Validation Rules:
- **Email**: Must be valid email format
- **Username**: 3-20 characters, letters, numbers, underscores only (no leading/trailing underscores)
- **Password**: At least 8 characters with uppercase, lowercase, and number
- **Mobile**: 10-15 digits with optional country code and formatting
- **Names**: 2-50 characters, letters and spaces only

## Usage Examples

### Register a User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "username": "johndoe",
    "password": "SecurePass123",
    "password_confirmation": "SecurePass123",
    "mobile": "+1234567890"
  }'
```

**Success Response:**
```json
{
  "message": "Welcome John! Your account has been created successfully.",
  "user": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "username": "johndoe",
    "mobile": "+1234567890",
    "full_name": "John Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Login (with email, username, or mobile)

```bash
# Login with email
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "login_identifier": "john.doe@example.com",
    "password": "SecurePass123"
  }'
```

**Success Response:**
```json
{
  "message": "Welcome back, John! You have successfully logged in with your email.",
  "user": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "username": "johndoe",
    "mobile": "+1234567890",
    "full_name": "John Doe",
    "role": "user",
    "is_active": true
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response Examples:**
```json
{
  "error": "Login failed",
  "message": "We couldn't find an account with those credentials. Please check your email/username/mobile and try again.",
  "details": [
    {
      "field": "login_identifier",
      "message": "No account found with this email, username, or mobile number."
    }
  ]
}
```

```json
{
  "error": "Login failed",
  "message": "The password you entered is incorrect. Please try again.",
  "details": [
    {
      "field": "password",
      "message": "Incorrect password. Please check your password and try again."
    }
  ]
}
```

### Get User Profile

```bash
curl -X GET http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Update Profile

```bash
curl -X PUT http://localhost:3000/api/users/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "first_name": "John",
    "last_name": "Smith",
    "mobile": "+1987654321",
    "profile_image": "https://example.com/avatar.jpg"
  }'
```

### Change Password

```bash
curl -X PUT http://localhost:3000/api/users/change-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "current_password": "SecurePass123",
    "new_password": "NewSecurePass456",
    "new_password_confirmation": "NewSecurePass456"
  }'
```

### Create a Post (with JWT token)

```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "My First Post",
    "content": "This is the content of my first post."
  }'
```

## Database Schema

### Users Table
- `id` (Primary Key)
- `first_name` (String)
- `last_name` (String)
- `email` (String, Unique)
- `username` (String, Unique)
- `password` (String, Hashed)
- `mobile` (String, Unique)
- `profile_image` (String, Nullable)
- `is_active` (Boolean, Default: true)
- `role` (Enum: user, admin, moderator, Default: user)
- `email_verified_at` (Timestamp, Nullable)
- `last_login_at` (Timestamp, Nullable)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### Posts Table
- `id` (Primary Key)
- `title` (String)
- `content` (Text)
- `user_id` (Foreign Key to users.id)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

## Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run migrate` - Run database migrations
- `npm run migrate:rollback` - Rollback last migration
- `npm run migrate:make` - Create new migration file
- `npm run format` - Format code with Prettier
- `npm run check` - Run ESLint

## Security Features

- Password hashing with bcrypt (12 salt rounds)
- JWT token authentication (24h expiration)
- Password strength validation
- Input validation and sanitization with Zod
- SQL injection protection (via Knex.js)
- CORS enabled
- Role-based access control
- Account activation/deactivation
- Login history tracking
- Unique constraints on email, username, and mobile

## Error Responses

All endpoints return consistent error responses with friendly messages:

```json
{
  "error": "Error type",
  "message": "User-friendly error message",
  "details": [
    {
      "field": "field_name",
      "message": "Specific field error message"
    }
  ]
}
```

## Success Responses

Successful operations return friendly messages:

```json
{
  "message": "User-friendly success message",
  "data": { /* response data */ }
}
```

## Additional Features

### Role-Based Access Control
- **User**: Basic access to own posts and profile
- **Moderator**: Can manage posts and moderate content
- **Admin**: Full access to all features including user management

### Account Management
- Account activation/deactivation
- Login history tracking
- Email verification support (structure ready)
- Profile image support

### Login Flexibility
- Login with email, username, or mobile number
- Secure password validation
- Account status checking
- Last login tracking

### Validation System
- **Zod Schema Validation**: Comprehensive input validation
- **Friendly Error Messages**: Clear, helpful error descriptions
- **Field-Specific Errors**: Detailed feedback for each field
- **Real-time Validation**: Immediate feedback on form inputs
