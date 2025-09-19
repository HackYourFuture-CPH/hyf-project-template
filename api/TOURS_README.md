# Tours API Documentation

## Overview

This document describes the complete Tours API implementation with full CRUD operations, search, filtering, sorting, and pagination capabilities.

## Features

- **Search & Filter**: Advanced search across tour names, descriptions, cities, and countries
- **Sorting**: Multiple sorting options for various tour attributes
- **Pagination**: Efficient data pagination for large datasets
- **CRUD Operations**: Complete Create, Read, Update, Delete functionality
- **Data Integrity**: Transaction support for complex operations
- **Validation**: Comprehensive input validation and error handling

## API Endpoints

### 1. Get All Tours

**Endpoint:** `GET /api/tours`

**Query Parameters:**
- `search` (optional): Search term for tour names, descriptions, cities, or countries
- `sort` (optional): Sorting field and direction (default: `name-asc`)
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of items per page (default: 9)
- `minPrice` (optional): Minimum price filter
- `maxPrice` (optional): Maximum price filter
- `minDuration` (optional): Minimum duration filter (days)
- `maxDuration` (optional): Maximum duration filter (days)
- `currency` (optional): Currency code filter (default: USD)

**Sort Options:**
- `name-asc` / `name-desc`: Sort by tour name
- `price_minor-asc` / `price_minor-desc`: Sort by price
- `duration_days-asc` / `duration_days-desc`: Sort by duration
- `rating-asc` / `rating-desc`: Sort by rating
- `created_at-asc` / `created_at-desc`: Sort by creation date

**Example Request:**
```bash
GET /api/tours?search=europe&sort=price_minor-desc&page=1&limit=5&minDuration=7&maxDuration=14
```

**Response:**
```json
{
  "totalItems": 25,
  "totalPages": 5,
  "currentPage": 1,
  "tours": [
    {
      "id": "uuid",
      "name": "European Adventure",
      "destination": "Explore the best of Europe",
      "price_usd": "150000",
      "duration_days": 10,
      "cover_image_url": "/images/tours/europe.jpg",
      "average_rating": "4.5",
      "currency_code": "USD",
      "currency_symbol": "$",
      "capacity": 25
    }
  ]
}
```

### 2. Get Tour Details

**Endpoint:** `GET /api/tours/:id`

**Example Request:**
```bash
GET /api/tours/3bf0235f-f43d-4e28-afce-3681dfd744c5
```

**Response:**
```json
{
  "id": "uuid",
  "name": "Tour Name",
  "description": "Tour description",
  "start_date": "2027-01-15",
  "duration_days": 10,
  "price_minor": "150000",
  "currency_code": "USD",
  "capacity": 25,
  "cover_image_url": "/images/tour.jpg",
  "rating": "4.5",
  "rating_count": 12,
  "currency_symbol": "$",
  "destinations": [
    {
      "id": "uuid",
      "city_name": "Paris",
      "country_name": "France",
      "stop_order": 1,
      "duration_days": 3
    }
  ],
  "accommodations": [...],
  "flights": [...],
  "reviews": [...]
}
```

### 3. Create New Tour

**Endpoint:** `POST /api/tours`

**Required Fields:**
- `name`: Tour name (string)
- `description`: Tour description (string)
- `duration_days`: Tour duration in days (integer)
- `price_minor`: Price in minor units (integer)
- `currency_code`: Currency code (string, must exist in currencies table)
- `capacity`: Maximum number of participants (integer)

**Optional Fields:**
- `start_date`: Tour start date (ISO date string)
- `cover_image_url`: Cover image URL (string)
- `destinations`: Array of destination objects

**Destination Object Structure:**
```json
{
  "city_name": "Paris",
  "country_name": "France",
  "duration_days": 3
}
```

**Example Request:**
```bash
POST /api/tours
Content-Type: application/json

{
  "name": "Mediterranean Cruise",
  "description": "Explore the beautiful Mediterranean coast",
  "duration_days": 7,
  "price_minor": 200000,
  "currency_code": "USD",
  "capacity": 30,
  "destinations": [
    {
      "city_name": "Barcelona",
      "country_name": "Spain",
      "duration_days": 2
    },
    {
      "city_name": "Rome",
      "country_name": "Italy",
      "duration_days": 3
    }
  ]
}
```

**Response:**
```json
{
  "message": "Tour created successfully",
  "tour": {
    "id": "uuid",
    "name": "Mediterranean Cruise",
    "destination": "Explore the beautiful Mediterranean coast",
    "price_usd": "200000",
    "duration_days": 7,
    "cover_image_url": null,
    "average_rating": "0",
    "currency_code": "USD",
    "currency_symbol": "$",
    "capacity": 30
  }
}
```

### 4. Update Tour

**Endpoint:** `PUT /api/tours/:id`

**Fields:** All fields are optional for updates

**Example Request:**
```bash
PUT /api/tours/3bf0235f-f43d-4e28-afce-3681dfd744c5
Content-Type: application/json

{
  "name": "Updated Tour Name",
  "price_minor": 250000,
  "destinations": [
    {
      "city_name": "New York",
      "country_name": "USA",
      "duration_days": 5
    }
  ]
}
```

**Response:**
```json
{
  "message": "Tour updated successfully",
  "tour": {
    "id": "uuid",
    "name": "Updated Tour Name",
    "destination": "Tour description",
    "price_usd": "250000",
    "duration_days": 5,
    "cover_image_url": "/images/tour.jpg",
    "average_rating": "4.5",
    "currency_code": "USD",
    "currency_symbol": "$",
    "capacity": 25
  }
}
```

### 5. Delete Tour

**Endpoint:** `DELETE /api/tours/:id`

**Example Request:**
```bash
DELETE /api/tours/3bf0235f-f43d-4e28-afce-3681dfd744c5
```

**Response:**
```json
{
  "message": "Tour deleted successfully"
}
```

## Database Schema

### Tables Used

1. **travel_plans**: Main tour information
2. **tour_destinations**: Tour stops and destinations
3. **tour_accommodations**: Accommodation details
4. **tour_flights**: Flight information
5. **tour_reviews**: User reviews and ratings
6. **currencies**: Currency information
7. **users**: User information for reviews

### Key Relationships

- Tours are stored in `travel_plans` with `plan_type = 'tour'`
- Destinations are linked via `tour_id` foreign key
- Accommodations and flights reference destinations
- Reviews are linked to tours and users

## Error Handling

### Common Error Responses

**400 Bad Request:**
```json
{
  "error": "Missing required fields",
  "message": "Name, description, duration_days, price_minor, currency_code, and capacity are required"
}
```

**404 Not Found:**
```json
{
  "error": "Tour not found",
  "message": "The requested tour does not exist"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal server error",
  "message": "Failed to create tour"
}
```

## Usage Examples

### Search Tours by Location
```bash
curl "http://localhost:3001/api/tours?search=paris&limit=5"
```

### Get Tours by Price Range
```bash
curl "http://localhost:3001/api/tours?minPrice=100000&maxPrice=500000&sort=price_minor-asc"
```

### Get Tours by Duration
```bash
curl "http://localhost:3001/api/tours?minDuration=7&maxDuration=14&sort=duration_days-asc"
```

### Create a New Tour
```bash
curl -X POST "http://localhost:3001/api/tours" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Asian Adventure",
    "description": "Explore Asia",
    "duration_days": 12,
    "price_minor": 300000,
    "currency_code": "USD",
    "capacity": 20
  }'
```

## Implementation Details

### Transaction Support
All create, update, and delete operations use database transactions to ensure data integrity.

### Validation
- Required field validation
- Currency existence validation
- Data type validation
- Business logic validation

### Performance
- Efficient database queries with proper joins
- Pagination support for large datasets
- Indexed fields for fast searches

## Testing

To test the API endpoints:

1. Start the server: `npm start`
2. Ensure database is running
3. Use the provided curl examples
4. Check response status codes and data

## Dependencies

- Express.js for routing
- Knex.js for database operations
- PostgreSQL as database
- Transaction support for data integrity

## Notes

- All prices are stored in minor units (cents for USD)
- Dates are stored in ISO format
- UUIDs are used for all primary keys
- Foreign key constraints ensure data consistency
- Soft deletes are not implemented (hard deletes)
