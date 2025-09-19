# Better Travel - Full Stack Travel Platform

A comprehensive travel platform built with Next.js frontend and Node.js backend, featuring tour management, user authentication, blog posts, and attractions.

## Project Overview

Better Travel is a modern travel platform that allows users to discover tours, read travel blogs, explore attractions, and manage their travel experiences. The platform consists of a responsive Next.js frontend and a robust Node.js API backend with PostgreSQL database.

## Architecture

The project follows a full-stack architecture with clear separation of concerns:

- **Frontend**: Next.js 15 with React 19, CSS Modules for styling
- **Backend**: Node.js with Express.js, PostgreSQL database with Knex.js ORM
- **Authentication**: JWT-based authentication system
- **Database**: PostgreSQL with Docker containerization
- **API**: RESTful API with comprehensive CRUD operations

## Project Structure

```
hyf-final-project-name/
├── api/                    # Backend API server
│   ├── src/
│   │   ├── routers/       # API route handlers
│   │   ├── middleware/    # Authentication and error handling
│   │   ├── migrations/    # Database migrations
│   │   ├── validation/    # Input validation schemas
│   │   └── db/           # Database configuration
│   └── package.json
├── app-next/              # Next.js frontend application
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   ├── assets/          # Static assets
│   └── public/          # Public files
├── database/             # Database schemas and seeds
├── docs/                # Technical documentation
└── docker-compose.yml   # Docker configuration
```

## Backend Development

### Core Contributors: Ali Sharifi & Ehsan Karkooti

The backend development was primarily handled by **Ali Sharifi** and **Ehsan Karkooti**, who built a comprehensive API system with the following features:

#### Ali Sharifi's Contributions
- **Authentication System**: Complete JWT-based authentication with registration and login endpoints
- **Tours API**: Full CRUD operations for tours with advanced search, filtering, and pagination
- **API Documentation**: Comprehensive documentation for all tour endpoints
- **Database Integration**: PostgreSQL setup with Knex.js ORM

#### Ehsan Karkooti's Contributions
- **Database Architecture**: Complete database schema design and migrations
- **Middleware Development**: Error handling, logging, and authentication middleware
- **Reviews & Comments System**: Full implementation of review and comment functionality
- **User Management**: Advanced user management with role-based access control
- **Docker Configuration**: Database containerization and setup scripts

### Backend Features

#### Authentication & User Management
- JWT-based authentication with 24-hour token expiration
- Multiple login methods (email, username, mobile)
- Role-based access control (User, Moderator, Admin)
- Password hashing with bcrypt (12 salt rounds)
- Account activation/deactivation
- Login history tracking

#### Tours Management
- Complete CRUD operations for tours
- Advanced search across tour names, descriptions, cities, and countries
- Multiple sorting options (price, duration, rating, creation date)
- Pagination support for large datasets
- Price and duration filtering
- Currency support

#### Reviews & Comments
- Tour review system with ratings
- Comment functionality for tours
- User-generated content management
- Content moderation capabilities

#### Database Features
- PostgreSQL with comprehensive schema
- Migration system for database versioning
- Seed data for development and testing
- Docker containerization for easy setup

## Frontend Development

### Core Contributors: Mateus Britto & Niger Afroze

The frontend development was primarily handled by **Mateus Britto** and **Niger Afroze**, who created a modern, responsive user interface:

#### Mateus Britto's Contributions
- **Homepage Layout**: Hero section with image transitions and search functionality
- **Authentication Pages**: Login and registration forms with backend integration
- **Tours Page**: Complete tours listing with search, filtering, and sorting
- **Navigation System**: Responsive navigation with smooth scrolling
- **UI Components**: Card components, form handling, and responsive design
- **API Integration**: Frontend-backend connectivity for authentication and data fetching

#### Niger Afroze's Contributions
- **Header & Footer**: Complete header and footer components with responsive design
- **Travel Cards**: Tour card components with rating display and styling
- **Blog Posts Section**: User blog posts display and management
- **Attractions Section**: Attractions display and detail pages
- **Mobile Responsiveness**: Burger menu, mobile navigation, and responsive layouts
- **Styling & Design**: CSS modules, animations, and visual enhancements

### Frontend Features

#### User Interface
- Modern, responsive design with CSS Modules
- Smooth scrolling navigation
- Image carousel in hero section
- Mobile-first responsive design
- Interactive search and filtering

#### Pages & Components
- **Homepage**: Hero section, tours preview, blog posts, attractions
- **Tours Page**: Complete tours listing with advanced filtering
- **Login/Register**: Toggle forms with backend integration
- **Tour Details**: Individual tour pages with reviews and comments
- **Attractions**: Attraction listings and detail pages

#### User Experience
- Real-time search functionality
- Loading states and error handling
- Form validation and user feedback
- Smooth transitions and animations
- Accessible design with proper ARIA labels

## Database Schema

The database includes the following main tables:

- **Users**: User accounts with authentication data
- **Travel Plans**: Tour information and details
- **Reviews**: User reviews for tours
- **Comments**: User comments on tours
- **Attractions**: Tourist attractions data
- **Blog Posts**: User-generated blog content

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Tours
- `GET /api/tours` - Get all tours with search, filtering, and pagination
- `GET /api/tours/:id` - Get specific tour details
- `POST /api/tours` - Create new tour (authenticated)
- `PUT /api/tours/:id` - Update tour (authenticated)
- `DELETE /api/tours/:id` - Delete tour (authenticated)

### Reviews & Comments
- `GET /api/reviews` - Get tour reviews
- `POST /api/reviews` - Create review (authenticated)
- `GET /api/comments` - Get tour comments
- `POST /api/comments` - Create comment (authenticated)

### Users
- `GET /api/users/profile` - Get user profile (authenticated)
- `PUT /api/users/profile` - Update user profile (authenticated)

## Docker & Database Setup

The project uses Docker for database containerization, making it easy to set up and manage the PostgreSQL database across different environments.

### Docker Configuration

The project includes a `docker-compose.yml` file that sets up a PostgreSQL 14 Alpine container:

```yaml
services:
  postgres:
    image: postgres:14-alpine
    container_name: better_travel_db_container
    restart: always
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    ports:
      - "${DB_PORT:-5432}:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data

volumes:
  postgres-data:
```

### Database Schema

The database includes a comprehensive schema with the following main tables:

- **users**: User accounts with authentication and profile data
- **travel_plans**: Tour templates and user-created trips
- **tour_destinations**: Individual stops/destinations for multi-destination tours
- **attraction_posts**: Admin-created content about specific attractions
- **user_posts**: Community blog posts written by users
- **tour_reviews**: User reviews for tours with ratings
- **user_post_comments**: Comments on user blog posts
- **tour_flights**: Flight details associated with tours
- **tour_accommodations**: Accommodation details for tour destinations
- **currencies**: Currency information and exchange rates
- **user_favorites**: User favorites for tours, posts, and attractions
- **ai_requests**: AI-generated trip requests
- **trip_itineraries**: AI-generated itinerary data

### Database Initialization

The project includes an automated database setup script (`api/scripts/db-init.js`) that:
- Waits for the database container to be ready
- Applies the complete database schema
- Seeds the database with mock data for development
- Handles errors gracefully with proper logging

## Development Setup

### Prerequisites
- Node.js 20.12.1 or higher
- npm 10.5.0 or higher
- Docker and Docker Compose
- PostgreSQL (via Docker)

### Backend Setup

1. Navigate to the API directory:
```bash
cd api
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
PORT=3000
DB_CLIENT=pg
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_username
DB_PASSWORD=your_password
DB_DATABASE_NAME=your_database_name
JWT_SECRET=your_super_secret_jwt_key_here
```

5. Start the database with Docker:
```bash
npm run db:start
```

6. Initialize the database (applies schema and seeds data):
```bash
npm run db:reset
```

7. Start the development server:
```bash
npm run dev
```

### Available Database Commands

The project includes several npm scripts for database management:

- `npm run db:start` - Start the PostgreSQL Docker container
- `npm run db:stop` - Stop the PostgreSQL Docker container
- `npm run db:clean` - Stop and remove the container and volumes
- `npm run db:reset` - Clean, start, and initialize the database
- `npm run db:setup` - Complete database setup (clean + start + reset)
- `npm run migrate` - Run Knex.js migrations
- `npm run migrate:rollback` - Rollback the last migration

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd app-next
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## Technology Stack

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **PostgreSQL**: Database
- **Knex.js**: SQL query builder
- **JWT**: Authentication
- **bcryptjs**: Password hashing
- **Zod**: Input validation
- **Morgan**: HTTP request logger
- **CORS**: Cross-origin resource sharing

### Frontend
- **Next.js 15**: React framework
- **React 19**: UI library
- **CSS Modules**: Styling
- **React Icons**: Icon library
- **React Scroll**: Smooth scrolling

### Development Tools
- **Docker**: Containerization
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Nodemon**: Development server

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- SQL injection protection
- CORS configuration
- Rate limiting
- Role-based access control

## Contributing

This project was developed as a collaborative effort with clear role distribution:

- **Backend Development**: Ali Sharifi & Ehsan Karkooti
- **Frontend Development**: Mateus Britto & Niger Afroze
- **Project Management**: Team collaboration through GitHub

## License

This project is developed as part of the Hack Your Future curriculum.

## Contact

For questions or contributions, please contact the development team through the project repository.