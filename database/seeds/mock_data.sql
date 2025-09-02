-- =================================================================
--  Simplified, Comprehensive Mock Data Seed Script (V1)
-- =================================================================
-- This script populates the simplified schema with 200+ rows of diverse,
-- realistic data for robust development and testing.
-- =================================================================

DO $$
DECLARE
    -- Expanded arrays for more realistic and diverse data
    first_names TEXT[] := ARRAY['Liam', 'Olivia', 'Noah', 'Emma', 'Oliver', 'Charlotte', 'Elijah', 'Amelia', 'James', 'Ava', 'William', 'Sophia', 'Benjamin', 'Isabella', 'Lucas', 'Mia', 'Henry', 'Evelyn', 'Theodore', 'Harper', 'Alexander', 'Camila', 'Sebastian', 'Gianna', 'Daniel', 'Luna', 'Mateo', 'Avery', 'Jack', 'Sofia', 'Owen', 'Eleanor', 'Caleb', 'Hazel', 'Wyatt', 'Aurora', 'Leo', 'Violet', 'Isaac', 'Nova', 'Gabriel', 'Penelope', 'Julian', 'Scarlett', 'Aaron', 'Victoria', 'Eli', 'Madison', 'Christian', 'Chloe'];
    last_names TEXT[] := ARRAY['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts'];
    tour_names TEXT[] := ARRAY['Grand European Tour', 'Asian Capitals Explorer', 'South American Adventure', 'Mediterranean Wonders', 'Best of North America', 'African Safari Expedition', 'Secrets of the Silk Road', 'Australian Outback Journey', 'Scandinavian Dreams', 'Flavors of Southeast Asia', 'Central European Highlights', 'Wonders of Ancient Egypt', 'Canadian Rockies Discovery', 'Mysteries of Japan', 'The Inca Trail Expedition'];
    destinations TEXT[] := ARRAY['Paris,France', 'Rome,Italy', 'Madrid,Spain', 'London,UK', 'Berlin,Germany', 'Tokyo,Japan', 'Beijing,China', 'Bangkok,Thailand', 'Seoul,South Korea', 'Singapore,Singapore', 'Lima,Peru', 'Buenos Aires,Argentina', 'Rio de Janeiro,Brazil', 'Santiago,Chile', 'Bogota,Colombia', 'New York,USA', 'Toronto,Canada', 'Mexico City,Mexico', 'Cairo,Egypt', 'Nairobi,Kenya', 'Cape Town,South Africa', 'Sydney,Australia', 'Auckland,New Zealand', 'Moscow,Russia', 'Istanbul,Turkey'];
    attraction_titles TEXT[] := ARRAY['The Eiffel Tower', 'The Colosseum', 'The Great Wall', 'Machu Picchu', 'The Pyramids of Giza', 'The Acropolis', 'Statue of Liberty', 'Christ the Redeemer', 'Angkor Wat', 'Petra', 'The Louvre Museum', 'The British Museum', 'The Grand Canyon', 'Niagara Falls', 'The Sydney Opera House'];
    user_post_titles TEXT[] := ARRAY['My Journey Through the Alps', 'A Culinary Tour of Tokyo', 'Backpacking Across Southeast Asia', 'Finding Paradise in the Philippines', 'What I Learned in South America', 'The Ultimate Guide to Paris', 'How to Travel Europe on a Budget', 'An Unforgettable African Safari', 'Chasing the Northern Lights', 'Getting Lost in the Streets of Rome'];
    review_contents TEXT[] := ARRAY['An absolutely unforgettable experience! The guide was fantastic.', 'Well-organized tour with a perfect itinerary. Highly recommended!', 'A fantastic trip. The accommodations were excellent and everything ran smoothly.', 'I would recommend this tour to anyone. It exceeded all my expectations.', 'Good value for the price. We covered a lot of ground.', 'The trip of a lifetime! Every detail was perfectly planned.', 'Our tour guide was the best, full of interesting stories and local knowledge.', 'A truly immersive cultural experience. Loved every minute of it.'];
    comment_contents TEXT[] := ARRAY['Great post, this is so helpful for planning my trip!', 'Your photos are stunning! Looks like you had an amazing time.', 'Thanks for sharing these tips. I''ll definitely keep them in mind.', 'This makes me want to book a flight right now!', 'I had a similar experience when I visited. Such a beautiful place.', 'Amazing write-up! I felt like I was there with you.'];
    hotel_names TEXT[] := ARRAY['Grand', 'Plaza', 'Royal', 'City Center', 'Park View', 'Riverside', 'Central', 'Imperial', 'Metropolitan'];
    hotel_types TEXT[] := ARRAY['hotel', 'hostel', 'guesthouse'];
    airlines TEXT[] := ARRAY['Global Airways', 'Horizon Jet', 'SkyLink Airlines', 'Continental Connect', 'Transoceanic Flights'];

    -- Helper variables
    fname TEXT; lname TEXT; tour_id_temp UUID; user_id_temp UUID; post_id_temp UUID; item_id_temp UUID; item_type_temp TEXT;
    dest_text TEXT; dest_parts TEXT[]; num_stops INTEGER; stop_counter INTEGER;
    dep_dest_id UUID; arr_dest_id UUID;
BEGIN
    -- Temp tables to hold generated IDs for relationships
    CREATE TEMP TABLE temp_user_ids (id UUID) ON COMMIT DROP;
    CREATE TEMP TABLE temp_tour_ids (id UUID) ON COMMIT DROP;
    CREATE TEMP TABLE temp_attraction_post_ids (id UUID) ON COMMIT DROP;
    CREATE TEMP TABLE temp_user_post_ids (id UUID) ON COMMIT DROP;
    CREATE TEMP TABLE temp_currency_codes (code CHAR(3)) ON COMMIT DROP;
    CREATE TEMP TABLE temp_all_favoritable_items (id UUID, type TEXT) ON COMMIT DROP;

    -- 1. Seed Currencies
    INSERT INTO currencies (code, name, symbol) VALUES
        ('USD', 'US Dollar', '$'),
        ('EUR', 'Euro', '€'),
        ('GBP', 'British Pound', '£'),
        ('JPY', 'Japanese Yen', '¥')
    ON CONFLICT (code) DO NOTHING;
    INSERT INTO temp_currency_codes SELECT code FROM currencies;

    -- 2. Seed Users (200)
    FOR i IN 1..200 LOOP
        fname := first_names[floor(random() * array_length(first_names, 1)) + 1];
        lname := last_names[floor(random() * array_length(last_names, 1)) + 1];
        INSERT INTO users (username, email, password_hash, first_name, last_name, phone_number, role)
        VALUES (
            LOWER(fname || lname || i),
            LOWER(fname || '.' || lname || i) || '@example.com',
            'hash', fname, lname, '555-010' || i,
            CASE WHEN i % 20 = 0 THEN 'admin' ELSE 'user' END
        );
    END LOOP;
    INSERT INTO temp_user_ids SELECT id FROM users;

    -- 3. Seed Travel Plans (Tours) (20)
    FOR i IN 1..20 LOOP
        INSERT INTO travel_plans (name, description, start_date, duration_days, price_minor, currency_code, capacity, cover_image_url, plan_type)
        VALUES (
            tour_names[floor(random() * array_length(tour_names, 1)) + 1],
            'An unforgettable ' || (floor(random()*10)+5) || '-day adventure across the globe.',
            '2026-01-15'::date + (i * 20 || ' days')::interval,
            (floor(random()*10)+5),
            (floor(random() * 5000) + 2000) * 100,
            (SELECT code FROM temp_currency_codes ORDER BY random() LIMIT 1),
            floor(random() * 20) + 10,
            '/images/tours/tour' || i || '.jpg',
            'tour'
        );
    END LOOP;
    INSERT INTO temp_tour_ids SELECT id FROM travel_plans WHERE plan_type = 'tour';

    -- 4. Seed Tour Destinations (2-5 per tour) and associated Accommodations/Flights
    FOR tour_id_temp IN (SELECT id FROM temp_tour_ids) LOOP
        num_stops := floor(random() * 4) + 2;
        FOR stop_counter IN 1..num_stops LOOP
            dest_text := destinations[floor(random() * array_length(destinations, 1)) + 1];
            dest_parts := string_to_array(dest_text, ',');
            
            INSERT INTO tour_destinations (tour_id, city_name, country_name, stop_order, duration_days)
            VALUES (tour_id_temp, dest_parts[1], dest_parts[2], stop_counter, floor(random() * 3) + 2)
            RETURNING id INTO dep_dest_id;
            
            INSERT INTO tour_accommodations (tour_id, destination_id, name, type, rating, price_minor, currency_code)
            VALUES (tour_id_temp, dep_dest_id, 'The ' || hotel_names[floor(random() * array_length(hotel_names, 1)) + 1] || ' ' || dest_parts[1], hotel_types[floor(random() * array_length(hotel_types, 1)) + 1], ROUND((random() * 2 + 3)::numeric, 1), (floor(random() * 200) + 80) * 100, (SELECT code FROM temp_currency_codes ORDER BY random() LIMIT 1));

            IF stop_counter > 1 THEN
                SELECT id INTO arr_dest_id FROM tour_destinations WHERE tour_id = tour_id_temp AND stop_order = stop_counter - 1;
                INSERT INTO tour_flights (tour_id, departs_from_destination_id, arrives_at_destination_id, airline, flight_number, price_minor, currency_code)
                VALUES (tour_id_temp, arr_dest_id, dep_dest_id, airlines[floor(random() * array_length(airlines, 1)) + 1], 'FL' || (1000 + floor(random()*9000))::text, (floor(random()*300)+150)*100, (SELECT code FROM temp_currency_codes ORDER BY random() LIMIT 1));
            END IF;
        END LOOP;
    END LOOP;

    -- 5. Seed Attraction Posts (200)
    FOR i IN 1..200 LOOP
        dest_text := destinations[floor(random() * array_length(destinations, 1)) + 1];
        dest_parts := string_to_array(dest_text, ',');
        WITH inserted AS (
            INSERT INTO attraction_posts(title, content, location)
            VALUES (attraction_titles[floor(random() * array_length(attraction_titles, 1)) + 1], 'A must-visit landmark offering a unique glimpse into local history and culture.', dest_parts[1])
            RETURNING id
        )
        INSERT INTO temp_attraction_post_ids(id) SELECT id FROM inserted;
    END LOOP;
    INSERT INTO attraction_post_photos(post_id, image_url, caption) SELECT id, '/images/attractions/attraction.jpg', 'A beautiful shot.' FROM temp_attraction_post_ids;

    -- 6. Seed User Posts (200)
    FOR i IN 1..200 LOOP
        WITH inserted AS (
            INSERT INTO user_posts(user_id, title, content, category)
            VALUES ((SELECT id FROM temp_user_ids ORDER BY random() LIMIT 1), user_post_titles[floor(random() * array_length(user_post_titles, 1)) + 1], 'This is a recap of my latest adventure. It was an experience I''ll never forget!', 'Adventure')
            RETURNING id
        )
        INSERT INTO temp_user_post_ids(id) SELECT id FROM inserted;
    END LOOP;
    INSERT INTO user_post_photos(post_id, image_url, caption) SELECT id, '/images/posts/user_post.jpg', 'A photo from my trip!' FROM temp_user_post_ids;

    -- 7. Seed Tour Reviews (200)
    FOR i IN 1..200 LOOP
        INSERT INTO tour_reviews(user_id, tour_id, rating, content)
        VALUES ((SELECT id FROM temp_user_ids ORDER BY random() LIMIT 1), (SELECT id FROM temp_tour_ids ORDER BY random() LIMIT 1), (floor(random() * 3) + 3)::int, review_contents[floor(random() * array_length(review_contents, 1)) + 1])
        ON CONFLICT (user_id, tour_id) DO NOTHING;
    END LOOP;

    -- 8. Seed User Post Comments (200)
    FOR i IN 1..200 LOOP
        INSERT INTO user_post_comments(user_id, post_id, content)
        VALUES ((SELECT id FROM temp_user_ids ORDER BY random() LIMIT 1), (SELECT id FROM temp_user_post_ids ORDER BY random() LIMIT 1), comment_contents[floor(random() * array_length(comment_contents, 1)) + 1]);
    END LOOP;

    -- 9. Seed User Favorites (200)
    INSERT INTO temp_all_favoritable_items (id, type) SELECT id, 'tour' FROM temp_tour_ids;
    INSERT INTO temp_all_favoritable_items (id, type) SELECT id, 'post' FROM temp_user_post_ids;
    INSERT INTO temp_all_favoritable_items (id, type) SELECT id, 'attraction' FROM temp_attraction_post_ids;

    FOR i IN 1..200 LOOP
        SELECT id, type INTO item_id_temp, item_type_temp FROM temp_all_favoritable_items ORDER BY random() LIMIT 1;
        INSERT INTO user_favorites (user_id, item_id, item_type)
        VALUES ((SELECT id FROM temp_user_ids ORDER BY random() LIMIT 1), item_id_temp, item_type_temp)
        ON CONFLICT (user_id, item_id, item_type) DO NOTHING;
    END LOOP;

    RAISE NOTICE 'Mock data seeded successfully! All tables are populated.';

END $$;

