-- =================================================================
--  Better travel Database Schema
-- =================================================================

-- Drop existing tables in reverse order of dependency to avoid errors
DROP TABLE IF EXISTS user_favorites CASCADE;

DROP TABLE IF EXISTS trip_itineraries CASCADE;

DROP TABLE IF EXISTS ai_requests CASCADE;

DROP TABLE IF EXISTS comments CASCADE;

DROP TABLE IF EXISTS tour_reviews CASCADE;

DROP TABLE IF EXISTS tour_accommodations CASCADE;

DROP TABLE IF EXISTS tour_flights CASCADE;

DROP TABLE IF EXISTS user_post_photos CASCADE;

DROP TABLE IF EXISTS attraction_post_photos CASCADE;

DROP TABLE IF EXISTS user_posts CASCADE;

DROP TABLE IF EXISTS attraction_posts CASCADE;

DROP TABLE IF EXISTS tour_destinations CASCADE;

DROP TABLE IF EXISTS tour_bookings CASCADE;

DROP TABLE IF EXISTS custom_trip_bookings CASCADE;

DROP TABLE IF EXISTS travel_plans CASCADE;

DROP TABLE IF EXISTS flights CASCADE;

DROP TABLE IF EXISTS accommodations CASCADE;

DROP TABLE IF EXISTS currencies CASCADE;

DROP TABLE IF EXISTS users CASCADE;

-- Enable the pgcrypto extension for gen_random_uuid() function if it doesn't exist.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Stores currency information.
CREATE TABLE currencies (
    code CHAR(3) PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    symbol VARCHAR(5)
);

-- Stores user account information and roles for access control.
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    mobile VARCHAR(20) UNIQUE NOT NULL,
    profile_image VARCHAR(255),
    role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (
        role IN ('user', 'admin', 'moderator')
    ),
    is_active BOOLEAN NOT NULL DEFAULT true,
    email_verified_at TIMESTAMP
    WITH
        TIME ZONE,
        last_login_at TIMESTAMP
    WITH
        TIME ZONE,
        created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW()
);

-- Stores tour templates and user-created trips.
CREATE TABLE travel_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    start_date DATE,
    duration_days INTEGER,
    price_minor BIGINT,
    currency_code CHAR(3) REFERENCES currencies (code),
    capacity INTEGER,
    cover_image_url VARCHAR(255),
    owner_id UUID REFERENCES users (id) ON DELETE SET NULL, -- Null for official tours
    plan_type VARCHAR(20) NOT NULL CHECK (plan_type IN ('user', 'tour')),
    rating NUMERIC(3, 2) DEFAULT 0.00,
    rating_count INTEGER DEFAULT 0,
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW()
);

-- This table is for booking PRE-DEFINED tours.
CREATE TABLE tour_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    tour_id UUID NOT NULL REFERENCES travel_plans (id) ON DELETE CASCADE,
    num_travelers INTEGER NOT NULL CHECK (num_travelers > 0),
    total_price_minor BIGINT NOT NULL,
    booking_status VARCHAR(20) NOT NULL DEFAULT 'confirmed' CHECK (
        booking_status IN (
            'confirmed',
            'pending',
            'cancelled'
        )
    ),
    booked_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW(),
        UNIQUE (user_id, tour_id)
);

-- Stores the individual stops/destinations for a multi-destination trip.
CREATE TABLE tour_destinations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    tour_id UUID NOT NULL REFERENCES travel_plans (id) ON DELETE CASCADE,
    city_name VARCHAR(100) NOT NULL,
    country_name VARCHAR(100) NOT NULL,
    stop_order INTEGER NOT NULL,
    duration_days INTEGER NOT NULL,
    UNIQUE (tour_id, stop_order)
);

-- Stores admin-created content about specific attractions.
CREATE TABLE attraction_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    location VARCHAR(100),
    category VARCHAR(50),
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW()
);

-- Stores community blog posts written by users.
CREATE TABLE user_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    trip_id UUID REFERENCES travel_plans (id) ON DELETE SET NULL, -- Link to a user's trip
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50),
    status VARCHAR(20) NOT NULL DEFAULT 'published' CHECK (
        status IN ('published', 'inactive')
    ),
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW()
);

-- Stores photos for attraction posts.
CREATE TABLE attraction_post_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    post_id UUID NOT NULL REFERENCES attraction_posts (id) ON DELETE CASCADE,
    image_url VARCHAR(255) NOT NULL,
    caption VARCHAR(255),
    uploaded_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW()
);

-- Stores photos for user-created blog posts.
CREATE TABLE user_post_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    post_id UUID NOT NULL REFERENCES user_posts (id) ON DELETE CASCADE,
    image_url VARCHAR(255) NOT NULL,
    caption VARCHAR(255),
    uploaded_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW()
);

CREATE TABLE tour_flights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    tour_id UUID NOT NULL REFERENCES travel_plans (id) ON DELETE CASCADE,
    departs_from_destination_id UUID NOT NULL REFERENCES tour_destinations (id) ON DELETE CASCADE,
    arrives_at_destination_id UUID NOT NULL REFERENCES tour_destinations (id) ON DELETE CASCADE,
    airline VARCHAR(100),
    flight_number VARCHAR(50),
    price_minor BIGINT,
    currency_code CHAR(3) REFERENCES currencies (code)
);

CREATE TABLE tour_accommodations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    tour_id UUID NOT NULL REFERENCES travel_plans (id) ON DELETE CASCADE,
    destination_id UUID NOT NULL REFERENCES tour_destinations (id) ON DELETE CASCADE,
    name VARCHAR(100),
    type VARCHAR(50) CHECK (
        type IN (
            'hotel',
            'hostel',
            'guesthouse'
        )
    ),
    rating NUMERIC(2, 1),
    price_minor BIGINT,
    currency_code CHAR(3) REFERENCES currencies (code)
);

-- Stores user reviews for tours.
CREATE TABLE tour_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    tour_id UUID NOT NULL REFERENCES travel_plans (id) ON DELETE CASCADE,
    rating INTEGER CHECK (
        rating >= 1
        AND rating <= 5
    ),
    content TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'approved' CHECK (
        status IN (
            'pending',
            'approved',
            'rejected'
        )
    ),
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW(),
        UNIQUE (user_id, tour_id)
);

-- Stores comments.
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    commentable_id UUID NOT NULL,
    commentable_type VARCHAR(50) NOT NULL, -- e.g., 'post', 'attraction'
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW(),
        status VARCHAR(20) NOT NULL DEFAULT 'approved' CHECK (
            status IN (
                'pending',
                'approved',
                'rejected'
            )
        )
);
-- This table links users to the trips they are collaborating on.
CREATE TABLE trip_collaborators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    trip_id UUID NOT NULL REFERENCES travel_plans (id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    permission_level VARCHAR(20) NOT NULL DEFAULT 'editor' CHECK (
        permission_level IN ('viewer', 'editor')
    ),
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW(),
        UNIQUE (trip_id, user_id)
);

-- stores the secure, one-time-use tokens for shareable links.
CREATE TABLE trip_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    trip_id UUID NOT NULL REFERENCES travel_plans (id) ON DELETE CASCADE,
    created_by_user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    token TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMP
    WITH
        TIME ZONE NOT NULL
);

-- Stores AI-generated trip requests.
CREATE TABLE ai_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    request_text TEXT NOT NULL,
    travel_plan_id UUID NOT NULL REFERENCES travel_plans (id) ON DELETE CASCADE,
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW()
);

-- Stores AI-generated itinerary data.
CREATE TABLE trip_itineraries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    travel_plan_id UUID NOT NULL REFERENCES travel_plans (id) ON DELETE CASCADE,
    itinerary_data JSONB NOT NULL,
    generated_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW()
);

-- Stores user favorites.
CREATE TABLE user_favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    item_id UUID NOT NULL,
    item_type VARCHAR(20) NOT NULL CHECK (
        item_type IN ('tour', 'post', 'attraction')
    ),
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW(),
        UNIQUE (user_id, item_id, item_type)
);

-- Stores all available flights for users to choose from.
CREATE TABLE flights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    airline VARCHAR(100) NOT NULL,
    flight_number VARCHAR(50) NOT NULL,
    departure_city VARCHAR(100) NOT NULL,
    arrival_city VARCHAR(100) NOT NULL,
    departure_timestamp TIMESTAMP
    WITH
        TIME ZONE, -- New
        arrival_timestamp TIMESTAMP
    WITH
        TIME ZONE, -- New
        available_seats INTEGER, -- New
        price_minor BIGINT,
        currency_code CHAR(3) REFERENCES currencies (code),
        UNIQUE (airline, flight_number)
);

-- Stores all available accommodations for users to choose from.
CREATE TABLE accommodations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    name VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    type VARCHAR(50) CHECK (
        type IN (
            'hotel',
            'hostel',
            'guesthouse'
        )
    ),
    capacity_per_room INTEGER, -- New
    rating NUMERIC(2, 1),
    price_per_night_minor BIGINT,
    currency_code CHAR(3) REFERENCES currencies (code)
);

-- Stores bookings for user-created custom trips.
CREATE TABLE custom_trip_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    trip_id UUID NOT NULL REFERENCES travel_plans (id) ON DELETE CASCADE,
    num_travelers INTEGER NOT NULL,
    total_price_minor BIGINT NOT NULL,
    booking_status VARCHAR(20) NOT NULL DEFAULT 'confirmed',
    booked_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW(),
        UNIQUE (user_id, trip_id)
);