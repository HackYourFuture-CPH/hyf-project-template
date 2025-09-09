-- =================================================================
--  AI-Enhanced, Comprehensive Mock Data (200+ Rows Per Table)
-- =================================================================
-- This script populates the database schema with over 200 rows per table,
-- using diverse, realistic, and thematically-grouped data. It now
-- includes AI-generated user trips and a dedicated admin user.
-- Version 3: Fixes null constraint violation on travel_plans.name
-- =================================================================

DO $$
DECLARE
    -- Expanded AI-Generated Thematic Tour Packages
    tour_themes TEXT[][] := ARRAY[
        ['Italian Renaissance Journey', 'Immerse yourself in the art, history, and culinary delights of Italy. From ancient Rome to the masterpieces of Florence and romantic Venice.', 'Rome,Italy|Florence,Italy|Venice,Italy'],
        ['Amazon Rainforest Expedition', 'Venture deep into the heart of the Amazon. Discover unique wildlife, navigate winding rivers, and learn about the world''s largest tropical rainforest.', 'Manaus,Brazil|Iquitos,Peru|Leticia,Colombia'],
        ['Japanese Culinary Discovery', 'A gastronomic adventure through Japan. Savor authentic sushi in Tokyo, enjoy traditional kaiseki in Kyoto, and learn the art of ramen in Fukuoka.', 'Tokyo,Japan|Kyoto,Japan|Osaka,Japan|Fukuoka,Japan'],
        ['Scandinavian Fjords Cruise', 'Witness the breathtaking beauty of the Norwegian fjords. Sail through majestic landscapes, visit charming coastal villages, and chase the northern lights.', 'Bergen,Norway|Geiranger,Norway|Trondheim,Norway|Tromsø,Norway'],
        ['Ancient Wonders of Egypt', 'Travel back in time along the Nile River. Explore the legendary Pyramids of Giza, uncover Tutankhamun''s treasures, and marvel at the temples of Luxor.', 'Cairo,Egypt|Luxor,Egypt|Aswan,Egypt'],
        ['Southeast Asian Backpacking Trail', 'A classic adventure through vibrant Southeast Asia. Explore bustling markets in Bangkok, ancient temples in Cambodia, and stunning landscapes in Vietnam.', 'Bangkok,Thailand|Siem Reap,Cambodia|Hanoi,Vietnam|Ho Chi Minh City,Vietnam'],
        ['Canadian Rockies by Rail', 'Experience the grandeur of the Canadian Rockies. Journey through stunning national parks, witness turquoise lakes, and see majestic glaciers from a scenic train.', 'Vancouver,Canada|Jasper,Canada|Banff,Canada|Calgary,Canada'],
        ['Mysteries of the Inca Empire', 'Follow the footsteps of the Incas in Peru. Hike the legendary trail to Machu Picchu, explore the Sacred Valley, and discover the historic city of Cusco.', 'Lima,Peru|Cusco,Peru|Aguas Calientes,Peru|Puno,Peru'],
        ['Greek Isles Odyssey', 'Sail the crystal-clear waters of the Aegean Sea. Discover the iconic white-washed villages of Santorini, the vibrant nightlife of Mykonos, and the ancient history of Crete.', 'Athens,Greece|Mykonos,Greece|Santorini,Greece|Crete,Greece'],
        ['Australian Outback Adventure', 'Explore the rugged heart of Australia. Witness the sacred Uluru at sunset, hike through Kings Canyon, and learn about Aboriginal culture in the Red Centre.', 'Alice Springs,Australia|Uluru,Australia|Kings Canyon,Australia|Darwin,Australia']
    ];
    ai_request_prompts TEXT[] := ARRAY[
        'Plan a 7-day romantic getaway to Paris for two, focusing on museums and fine dining.',
        'I need a 10-day family-friendly trip to Costa Rica. We love wildlife and adventure activities like zip-lining.',
        'Create a 2-week solo backpacking itinerary for Vietnam, from Hanoi to Ho Chi Minh City, on a budget.',
        'What is the ultimate 5-day itinerary for exploring New York City for the first time?',
        'I want a 14-day luxury tour of Japan during cherry blossom season, including high-speed trains and top-rated hotels.'
    ];

    -- Expanded & Varied Content Arrays
    first_names TEXT[] := ARRAY['Liam', 'Olivia', 'Noah', 'Emma', 'Oliver', 'Charlotte', 'Elijah', 'Amelia', 'James', 'Ava', 'William', 'Sophia', 'Benjamin', 'Isabella', 'Lucas', 'Mia', 'Henry', 'Evelyn'];
    last_names TEXT[] := ARRAY['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas'];
    attraction_titles TEXT[] := ARRAY['Historic Old Town Walking Tour', 'National Art Museum Entry', 'Sunset Cruise on the River', 'Local Market Food Tasting', 'Architectural Wonders Tour', 'Hidden Gems of the City', 'Day Trip to the Countryside', 'Botanical Gardens Exploration'];
    user_post_titles TEXT[] := ARRAY['My Unforgettable Journey Through...', 'A Food Lover''s Guide to...', 'Backpacking on a Budget in...', 'Finding Paradise: My Trip to...', '10 Things I Learned While Traveling in...', 'The Ultimate Itinerary for...', 'How to Navigate Public Transit in...'];
    review_contents TEXT[] := ARRAY[
        'An absolutely unforgettable experience! Our guide was knowledgeable and passionate, making every moment special. Highly recommended!', 
        'This was a well-organized tour with a perfect itinerary. The accommodations exceeded our expectations, and the pacing was just right.', 
        'A fantastic trip that was worth every penny. Everything ran smoothly, and the sights were breathtaking. I would do it again in a heartbeat.', 
        'I would recommend this tour to anyone looking for a deep cultural immersion. It exceeded all my expectations, and I made memories that will last a lifetime.'
    ];
    comment_contents TEXT[] := ARRAY[
        'Great post, this is so helpful for planning my own trip! Thanks for the detailed information.', 
        'Your photos are absolutely stunning! It looks like you had an amazing and transformative time.', 
        'Thanks for sharing these practical tips. I''ll definitely keep them in mind for my visit next year.', 
        'This article makes me want to book a flight right now! So inspiring.'
    ];
    hotel_names TEXT[] := ARRAY['Grand', 'Plaza', 'Royal', 'City Center', 'Park View', 'Riverside', 'Central', 'Imperial', 'Metropolitan', 'Harbor', 'Heritage', 'Palace'];
    hotel_types TEXT[] := ARRAY['hotel', 'hostel', 'guesthouse'];
    airlines TEXT[] := ARRAY['Global Airways', 'Horizon Jet', 'SkyLink Airlines', 'Continental Connect', 'Transoceanic Flights', 'Apex Air'];

    -- Helper variables
    fname TEXT; lname TEXT; tour_id_temp UUID; user_id_temp UUID; post_id_temp UUID; item_id_temp UUID; item_type_temp TEXT; plan_id_temp UUID;
    theme_index INTEGER; tour_name TEXT; tour_desc TEXT; tour_destinations_text TEXT;
    dest_array TEXT[]; dest_text TEXT; dest_parts TEXT[];
    stop_counter INTEGER; dep_dest_id UUID; arr_dest_id UUID;
BEGIN
    -- Temp tables to hold generated IDs for relationships
    CREATE TEMP TABLE temp_user_ids (id UUID) ON COMMIT DROP;
    CREATE TEMP TABLE temp_tour_ids (id UUID) ON COMMIT DROP;
    CREATE TEMP TABLE temp_attraction_post_ids (id UUID) ON COMMIT DROP;
    CREATE TEMP TABLE temp_user_post_ids (id UUID) ON COMMIT DROP;
    CREATE TEMP TABLE temp_currency_codes (code CHAR(3)) ON COMMIT DROP;
    CREATE TEMP TABLE temp_all_favoritable_items (id UUID, type TEXT) ON COMMIT DROP;

    -- =================================================================
    --  1. Seed Core Data (Admin, Currencies)
    -- =================================================================
    -- Add a dedicated, static admin user for easy login and testing.
    -- Username: admin
    -- Password: AdminPass123!
    INSERT INTO users (first_name, last_name, email, username, password, mobile, role, is_active)
    VALUES (
        'Admin', 'User', 'admin@example.com', 'admin', 
        '$2a$12$.mbqwDuqyUdJAtc1ixCsP.SPPKXnry2gojRzQck56wzbdvLxT8zjS', -- This is the bcrypt hash for 'AdminPass123!'
        '555-ADMIN', 'admin', true
    ) ON CONFLICT (username) DO NOTHING;

    INSERT INTO currencies (code, name, symbol) VALUES ('USD', 'US Dollar', '$'), ('EUR', 'Euro', '€'), ('GBP', 'British Pound', '£'), ('JPY', 'Japanese Yen', '¥')
    ON CONFLICT (code) DO NOTHING;
    INSERT INTO temp_currency_codes SELECT code FROM currencies;

    -- =================================================================
    --  2. Seed Users (250)
    -- =================================================================
    FOR i IN 1..250 LOOP
        fname := first_names[floor(random() * array_length(first_names, 1)) + 1];
        lname := last_names[floor(random() * array_length(last_names, 1)) + 1];
        INSERT INTO users (username, email, password, first_name, last_name, mobile, profile_image, role, is_active, email_verified_at, last_login_at)
        VALUES (
            LOWER(fname || lname || i), LOWER(fname || '.' || lname || i) || '@example.com', 'hashed_password', fname, lname, 
            '555-' || LPAD(i::text, 4, '0'), '/images/profiles/default.png',
            CASE WHEN i % 25 = 0 THEN 'admin' WHEN i % 10 = 0 THEN 'moderator' ELSE 'user' END,
            (random() > 0.1),
            CASE WHEN random() > 0.3 THEN NOW() - (random() * 300 || ' days')::interval ELSE NULL END,
            NOW() - (random() * 60 || ' days')::interval
        );
    END LOOP;
    INSERT INTO temp_user_ids SELECT id FROM users WHERE email != 'admin@example.com';

    -- =================================================================
    --  3. Seed Thematic Travel Plans (Tours - 100) & Associated Data
    -- =================================================================
    RAISE NOTICE 'Seeding 100 Thematic Tours...';
    FOR i IN 1..100 LOOP
        theme_index := floor(random() * array_length(tour_themes, 1)) + 1;
        -- FIX: Directly access array elements to prevent nulls from incorrect slicing
        tour_name := tour_themes[theme_index][1];
        tour_desc := tour_themes[theme_index][2];
        tour_destinations_text := tour_themes[theme_index][3];
        dest_array := string_to_array(tour_destinations_text, '|');

        INSERT INTO travel_plans (name, description, start_date, duration_days, price_minor, currency_code, capacity, cover_image_url, plan_type)
        VALUES (
            tour_name, tour_desc, '2026-01-15'::date + (i * 10 || ' days')::interval,
            (array_length(dest_array, 1) * 3) + 2, (floor(random() * 5000) + 2000) * 100, (SELECT code FROM temp_currency_codes ORDER BY random() LIMIT 1),
            floor(random() * 20) + 10, '/images/tours/tour' || theme_index || '.jpg', 'tour'
        ) RETURNING id INTO tour_id_temp;
        
        INSERT INTO temp_tour_ids VALUES (tour_id_temp);

        FOR stop_counter IN 1..array_length(dest_array, 1) LOOP
            dest_text := dest_array[stop_counter];
            dest_parts := string_to_array(dest_text, ',');
            INSERT INTO tour_destinations (tour_id, city_name, country_name, stop_order, duration_days)
            VALUES (tour_id_temp, dest_parts[1], dest_parts[2], stop_counter, floor(random() * 2) + 2)
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

    -- =================================================================
    --  4. Seed AI-Generated User Travel Plans (200)
    -- =================================================================
    RAISE NOTICE 'Seeding 200 AI-Generated User Trips...';
    FOR i IN 1..200 LOOP
        user_id_temp := (SELECT id FROM temp_user_ids ORDER BY random() LIMIT 1);
        
        INSERT INTO travel_plans (name, description, owner_id, plan_type, duration_days)
        VALUES (
            'My Trip ' || i, 'An AI-generated itinerary based on my request.', user_id_temp, 'user', floor(random() * 10) + 5
        ) RETURNING id INTO plan_id_temp;

        INSERT INTO ai_requests(user_id, request_text, travel_plan_id)
        VALUES (user_id_temp, ai_request_prompts[floor(random() * array_length(ai_request_prompts, 1)) + 1], plan_id_temp);

        INSERT INTO trip_itineraries(travel_plan_id, itinerary_data)
        VALUES (plan_id_temp, '{ "days": [{ "day": 1, "city": "Paris", "activities": ["Eiffel Tower", "Louvre Museum"] }, { "day": 2, "city": "Paris", "activities": ["Notre Dame", "Seine River Cruise"] }] }'::jsonb);
    END LOOP;

    -- =================================================================
    --  5. Seed Content (Attraction & User Posts)
    -- =================================================================
    RAISE NOTICE 'Seeding 200 Attraction Posts...';
    FOR i IN 1..200 LOOP
        -- FIX: Select a random theme inside this loop to ensure destinations are varied
        theme_index := floor(random() * array_length(tour_themes, 1)) + 1;
        tour_destinations_text := tour_themes[theme_index][3];
        dest_array := string_to_array(tour_destinations_text, '|');
        dest_text := dest_array[floor(random() * array_length(dest_array, 1)) + 1];
        dest_parts := string_to_array(dest_text, ',');

        WITH inserted AS (
            INSERT INTO attraction_posts(title, content, location)
            VALUES (attraction_titles[floor(random() * array_length(attraction_titles, 1)) + 1] || ' in ' || dest_parts[1], 'A must-visit landmark in ' || dest_parts[1] || ' offering a unique glimpse into local history and culture.', dest_parts[1]) 
            RETURNING id
        ) INSERT INTO temp_attraction_post_ids(id) SELECT id FROM inserted;
    END LOOP;
    INSERT INTO attraction_post_photos(post_id, image_url, caption) SELECT id, '/images/attractions/attraction.jpg', 'A beautiful shot.' FROM temp_attraction_post_ids;

    RAISE NOTICE 'Seeding 250 User Posts...';
    FOR i IN 1..250 LOOP
        WITH inserted AS (
            INSERT INTO user_posts(user_id, title, content, category)
            VALUES ((SELECT id FROM temp_user_ids ORDER BY random() LIMIT 1), user_post_titles[floor(random() * array_length(user_post_titles, 1)) + 1], 'This is a recap of my latest adventure. It was an experience I will never forget!', 'Adventure') 
            RETURNING id
        ) INSERT INTO temp_user_post_ids(id) SELECT id FROM inserted;
    END LOOP;
    INSERT INTO user_post_photos(post_id, image_url, caption) SELECT id, '/images/posts/user_post.jpg', 'A photo from my trip!' FROM temp_user_post_ids;

    -- =================================================================
    --  6. Seed Social Interactions (Reviews, Comments, Favorites)
    -- =================================================================
    RAISE NOTICE 'Seeding 400 Reviews and Social Interactions...';
    FOR i IN 1..400 LOOP
        INSERT INTO tour_reviews(user_id, tour_id, rating, content)
        VALUES ((SELECT id FROM temp_user_ids ORDER BY random() LIMIT 1), (SELECT id FROM temp_tour_ids ORDER BY random() LIMIT 1), (floor(random() * 3) + 3)::int, review_contents[floor(random() * array_length(review_contents, 1)) + 1])
        ON CONFLICT (user_id, tour_id) DO NOTHING;
    END LOOP;

    FOR tour_id_temp IN (SELECT id FROM temp_tour_ids) LOOP
        UPDATE travel_plans SET rating_count = (SELECT COUNT(*) FROM tour_reviews WHERE tour_id = tour_id_temp), rating = COALESCE((SELECT AVG(rating) FROM tour_reviews WHERE tour_id = tour_id_temp), 0)
        WHERE id = tour_id_temp;
    END LOOP;
    
    RAISE NOTICE 'Seeding 500 User Post Comments...';
    FOR i IN 1..500 LOOP
        INSERT INTO user_post_comments(user_id, post_id, content)
        VALUES ((SELECT id FROM temp_user_ids ORDER BY random() LIMIT 1), (SELECT id FROM temp_user_post_ids ORDER BY random() LIMIT 1), comment_contents[floor(random() * array_length(comment_contents, 1)) + 1]);
    END LOOP;

    RAISE NOTICE 'Seeding 500 User Favorites...';
    INSERT INTO temp_all_favoritable_items (id, type) SELECT id, 'tour' FROM temp_tour_ids;
    INSERT INTO temp_all_favoritable_items (id, type) SELECT id, 'post' FROM temp_user_post_ids;
    INSERT INTO temp_all_favoritable_items (id, type) SELECT id, 'attraction' FROM temp_attraction_post_ids;

    FOR i IN 1..500 LOOP
        SELECT id, type INTO item_id_temp, item_type_temp FROM temp_all_favoritable_items ORDER BY random() LIMIT 1;
        INSERT INTO user_favorites (user_id, item_id, item_type)
        VALUES ((SELECT id FROM temp_user_ids ORDER BY random() LIMIT 1), item_id_temp, item_type_temp)
        ON CONFLICT (user_id, item_id, item_type) DO NOTHING;
    END LOOP;

    RAISE NOTICE 'Mock data seeded successfully! All tables are populated with comprehensive data.';

END $$;