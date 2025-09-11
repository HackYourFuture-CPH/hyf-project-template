-- =================================================================
--  AI-Enhanced, Comprehensive Mock Data (200+ Rows per Table)
-- =================================================================
-- This script populates the database with realistic, interconnected data,
-- ensuring all tables have at least 200 rows where applicable.
-- It now includes a dedicated admin user and mock data for all tables.
-- =================================================================

DO $$
DECLARE
    -- Richer thematic content for tours and posts
    tour_themes TEXT[][] := ARRAY[
        ['Italian Renaissance Journey', 'Embark on a captivating journey through the heart of the Renaissance. Discover the artistic treasures of Florence, the ancient wonders of Rome, and the romantic canals of Venice. A perfect blend of history, art, and culinary delights awaits.'],
        ['Scandinavian Dreams', 'Experience the breathtaking beauty of Scandinavia. From the vibrant city of Copenhagen to the stunning fjords of Norway and the chic design of Stockholm, this tour is a visual and cultural feast.'],
        ['Southeast Asian Adventure', 'Dive into the vibrant cultures of Southeast Asia. Explore ancient temples in Cambodia, bustling markets in Thailand, and the futuristic skyline of Singapore. A journey of unforgettable flavors and sights.'],
        ['African Safari Expedition', 'Witness the majestic wildlife of Africa on an unforgettable safari. Track the "Big Five" in Kenya, marvel at the vast plains of the Serengeti, and experience the raw beauty of the African bush.'],
        ['Mysteries of Japan', 'Discover the unique blend of ancient tradition and modern innovation in Japan. Explore serene temples in Kyoto, the bustling metropolis of Tokyo, and the historic sites of Hiroshima.']
    ];
    destinations_by_theme JSONB := '{
        "Italian Renaissance Journey": ["Rome,Italy", "Florence,Italy", "Venice,Italy", "Pisa,Italy"],
        "Scandinavian Dreams": ["Copenhagen,Denmark", "Oslo,Norway", "Stockholm,Sweden", "Bergen,Norway"],
        "Southeast Asian Adventure": ["Bangkok,Thailand", "Siem Reap,Cambodia", "Singapore,Singapore", "Chiang Mai,Thailand"],
        "African Safari Expedition": ["Nairobi,Kenya", "Maasai Mara,Kenya", "Serengeti,Tanzania", "Ngorongoro Crater,Tanzania"],
        "Mysteries of Japan": ["Tokyo,Japan", "Kyoto,Japan", "Hiroshima,Japan", "Osaka,Japan"]
    }';

    -- Expanded and more varied text arrays
    first_names TEXT[] := ARRAY['Liam', 'Olivia', 'Noah', 'Emma', 'Oliver', 'Charlotte', 'Elijah', 'Amelia', 'James', 'Ava', 'William', 'Sophia', 'Benjamin', 'Isabella', 'Lucas', 'Mia', 'Henry', 'Evelyn', 'Theodore', 'Harper', 'Alexander', 'Camila', 'Sebastian', 'Gianna', 'Daniel', 'Luna', 'Mateo', 'Avery', 'Jack', 'Sofia', 'Owen', 'Eleanor', 'Caleb', 'Hazel', 'Wyatt', 'Aurora', 'Leo', 'Violet', 'Isaac', 'Nova', 'Gabriel', 'Penelope', 'Julian', 'Scarlett', 'Aaron', 'Victoria', 'Eli', 'Madison', 'Christian', 'Chloe'];
    last_names TEXT[] := ARRAY['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts'];
    attraction_titles JSONB := '{
        "Art & Culture": ["The Majestic Eiffel Tower", "A Day at The Louvre Museum", "Highlights of The British Museum", "Sydney Opera House Backstage Tour"],
        "History": ["The Ancient Colosseum", "The Great Wall of China Walk", "Secrets of Machu Picchu", "The Grand Pyramids of Giza Tour", "The Acropolis of Athens", "Statue of Liberty & Ellis Island", "Exploring Angkor Wat", "The Lost City of Petra by Night", "Tokyo''s Hidden Shrines"],
        "Nature": ["Christ the Redeemer at Sunrise", "Grand Canyon Helicopter Tour", "Niagara Falls Boat Experience"],
        "Food": ["Local Market Food Tasting in Athens", "Street Food Tour of Berlin"]
    }';
    user_post_titles TEXT[] := ARRAY['My Unforgettable Journey Through the Alps', 'A Culinary Tour of Tokyo''s Best Kept Secrets', 'Backpacking Across Southeast Asia on a Budget', 'Finding Paradise: A Guide to the Philippines', 'What I Learned from a Month in South America', 'The Ultimate Guide to Paris for First-Timers', 'How to Travel Europe Without Breaking the Bank', 'An Unforgettable African Safari Experience', 'Chasing the Northern Lights in Iceland', 'Getting Lost in the Ancient Streets of Rome', 'A Food Lover''s Guide to Italy', 'The Most Beautiful Beaches in Thailand'];
    review_contents TEXT[] := ARRAY['An absolutely unforgettable experience! The guide was fantastic, knowledgeable, and made the trip special.', 'A well-organized tour with a perfect itinerary. Everything ran like clockwork. Highly recommended!', 'A fantastic trip from start to finish. The accommodations were excellent and the sights were breathtaking.', 'I would recommend this tour to anyone looking for adventure. It exceeded all my expectations.', 'Good value for the price. We covered a lot of ground and saw so many incredible places.', 'The trip of a lifetime! Every single detail was perfectly planned and executed.', 'Our tour guide was the best, full of interesting stories and local knowledge that you can''t get from a book.', 'A truly immersive cultural experience. I loved every minute of it and learned so much.'];
    comment_contents TEXT[] := ARRAY['Great post, this is so helpful for planning my own trip!', 'Your photos are absolutely stunning! Looks like you had an amazing and unforgettable time.', 'Thanks for sharing these tips and insights. I''ll definitely keep them in mind for my future travels.', 'This makes me want to book a flight right now! So inspiring.', 'I had a similar experience when I visited last year. Such a beautiful and magical place.', 'Amazing write-up! I felt like I was there with you every step of the way.', 'Incredible detail here. Thank you for taking the time to share this!'];
    hotel_names TEXT[] := ARRAY['Grand', 'Plaza', 'Royal', 'City Center', 'Park View', 'Riverside', 'Central', 'Imperial', 'Metropolitan', 'Harbor', 'Summit'];
    hotel_types TEXT[] := ARRAY['hotel', 'hostel', 'guesthouse'];
    airlines TEXT[] := ARRAY['Global Airways', 'Horizon Jet', 'SkyLink Airlines', 'Continental Connect', 'Transoceanic Flights', 'Apex Air'];

    -- Helper variables
    fname TEXT; lname TEXT; tour_id_temp UUID; user_id_temp UUID; post_id_temp UUID; item_id_temp UUID; item_type_temp TEXT;
    dest_text TEXT; dest_parts TEXT[]; dest_array TEXT[]; num_stops INTEGER; stop_counter INTEGER;
    dep_dest_id UUID; arr_dest_id UUID; theme_index INTEGER;
    attraction_category TEXT; attraction_titles_for_category TEXT[];
BEGIN
    -- Temp tables to hold generated IDs for efficient relationship creation
    CREATE TEMP TABLE temp_user_ids (id UUID) ON COMMIT DROP;
    CREATE TEMP TABLE temp_tour_ids (id UUID) ON COMMIT DROP;
    CREATE TEMP TABLE temp_attraction_post_ids (id UUID) ON COMMIT DROP;
    CREATE TEMP TABLE temp_user_post_ids (id UUID) ON COMMIT DROP;
    CREATE TEMP TABLE temp_currency_codes (code CHAR(3)) ON COMMIT DROP;
    CREATE TEMP TABLE temp_all_favoritable_items (id UUID, type TEXT) ON COMMIT DROP;


    -- =================================================================
    --  1. SEED STATIC & ESSENTIAL DATA
    -- =================================================================
    -- Seed Currencies
    INSERT INTO currencies (code, name, symbol) VALUES
        ('USD', 'US Dollar', '$'), ('EUR', 'Euro', '€'), ('GBP', 'British Pound', '£'), ('JPY', 'Japanese Yen', '¥')
    ON CONFLICT (code) DO NOTHING;
    INSERT INTO temp_currency_codes SELECT code FROM currencies;

    -- Create dedicated Admin User for easy login
    INSERT INTO users (first_name, last_name, email, username, password, mobile, role, is_active, email_verified_at)
    VALUES (
        'Admin', 'User', 'admin@example.com', 'admin',
        '$2a$12$.mbqwDuqyUdJAtc1ixCsP.SPPKXnry2gojRzQck56wzbdvLxT8zjS', -- Hash for 'AdminPass123!'
        '555-0000-ADMIN', 'admin', true, NOW()
    ) ON CONFLICT (username) DO NOTHING;


    -- =================================================================
    --  2. SEED USERS (200+)
    -- =================================================================
    FOR i IN 1..250 LOOP
        fname := first_names[floor(random() * array_length(first_names, 1)) + 1];
        lname := last_names[floor(random() * array_length(last_names, 1)) + 1];
        INSERT INTO users (username, email, password, first_name, last_name, mobile, role, is_active, email_verified_at, last_login_at)
        VALUES (
            LOWER(fname || lname || i),
            LOWER(fname || '.' || lname || i) || '@example.com',
            'bcrypt_hashed_password', -- Use a static password for all mock users for simplicity
            fname, lname, '555-' || LPAD(i::text, 7, '0'),
            CASE WHEN i % 50 = 0 THEN 'moderator' ELSE 'user' END,
            (random() > 0.1),
            CASE WHEN random() > 0.3 THEN NOW() - (random() * 300 || ' days')::interval ELSE NULL END,
            NOW() - (random() * 60 || ' days')::interval
        );
    END LOOP;
    INSERT INTO temp_user_ids SELECT id FROM users;


    -- =================================================================
    --  3. SEED THEMATIC TOURS AND RELATED DATA (DESTINATIONS, FLIGHTS, HOTELS)
    -- =================================================================
    FOR i IN 1..200 LOOP
        theme_index := floor(random() * array_length(tour_themes, 1)) + 1;
        dest_array := ARRAY(SELECT jsonb_array_elements_text(destinations_by_theme -> tour_themes[theme_index][1]));

        INSERT INTO travel_plans (name, description, start_date, duration_days, price_minor, currency_code, capacity, cover_image_url, plan_type)
        VALUES (
            tour_themes[theme_index][1], tour_themes[theme_index][2], '2026-01-15'::date + (i * 10 || ' days')::interval,
            (array_length(dest_array, 1) * 3) + 2, (floor(random() * 5000) + 2000) * 100, (SELECT code FROM temp_currency_codes ORDER BY random() LIMIT 1),
            floor(random() * 20) + 10, '/images/tours/tour' || theme_index || '.jpg', 'tour'
        ) RETURNING id INTO tour_id_temp;
        INSERT INTO temp_tour_ids VALUES(tour_id_temp);

        num_stops := array_length(dest_array, 1);
        FOR stop_counter IN 1..num_stops LOOP
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
    --  4. SEED ATTRACTION POSTS & PHOTOS (200+)
    -- =================================================================
    FOR i IN 1..200 LOOP
        attraction_category := (SELECT jsonb_object_keys FROM jsonb_object_keys(attraction_titles) ORDER BY random() LIMIT 1);
        attraction_titles_for_category := ARRAY(SELECT jsonb_array_elements_text(attraction_titles -> attraction_category));
        dest_text := (SELECT city_name || ',' || country_name FROM tour_destinations ORDER BY random() LIMIT 1);
        dest_parts := string_to_array(dest_text, ',');

        WITH inserted AS (
            INSERT INTO attraction_posts(title, content, location, category)
            VALUES (
                attraction_titles_for_category[floor(random() * array_length(attraction_titles_for_category, 1)) + 1],
                'A must-visit landmark in ' || dest_parts[1] || ' offering a unique glimpse into local history and culture.',
                dest_parts[1],
                attraction_category
            )
            RETURNING id
        )
        INSERT INTO temp_attraction_post_ids(id) SELECT id FROM inserted;
    END LOOP;
    INSERT INTO attraction_post_photos(post_id, image_url, caption) SELECT id, '/images/attractions/attraction.jpg', 'A beautiful shot of this must-see attraction.' FROM temp_attraction_post_ids;


    -- =================================================================
    --  5. SEED USER POSTS & PHOTOS (200+)
    -- =================================================================
    FOR i IN 1..250 LOOP
        WITH inserted AS (
            INSERT INTO user_posts(user_id, title, content, category)
            VALUES ((SELECT id FROM temp_user_ids ORDER BY random() LIMIT 1), user_post_titles[floor(random() * array_length(user_post_titles, 1)) + 1], 'This is a detailed recap of my latest adventure. It was an experience I''ll never forget, full of amazing sights and sounds!', CASE WHEN random() > 0.5 THEN 'Adventure' ELSE 'Culinary' END)
            RETURNING id
        )
        INSERT INTO temp_user_post_ids(id) SELECT id FROM inserted;
    END LOOP;
    INSERT INTO user_post_photos(post_id, image_url, caption) SELECT id, '/images/posts/user_post.jpg', 'A photo from my trip!' FROM temp_user_post_ids;


    -- =================================================================
    --  6. SEED TOUR REVIEWS (300+) & UPDATE TOUR RATINGS
    -- =================================================================
    FOR i IN 1..300 LOOP
        user_id_temp := (SELECT id FROM temp_user_ids ORDER BY random() LIMIT 1);
        tour_id_temp := (SELECT id FROM temp_tour_ids ORDER BY random() LIMIT 1);
        INSERT INTO tour_reviews(user_id, tour_id, rating, content)
        VALUES (user_id_temp, tour_id_temp, (floor(random() * 3) + 3)::int, review_contents[floor(random() * array_length(review_contents, 1)) + 1])
        ON CONFLICT (user_id, tour_id) DO NOTHING;
    END LOOP;

    -- Update all tour ratings in a single query for efficiency
    UPDATE travel_plans
    SET
        rating_count = sub.count,
        rating = sub.avg_rating
    FROM (
        SELECT tour_id, COUNT(*) as count, AVG(rating) as avg_rating
        FROM tour_reviews
        GROUP BY tour_id
    ) AS sub
    WHERE id = sub.tour_id;


    -- =================================================================
    --  7. SEED USER POST COMMENTS (300+)
    -- =================================================================
    FOR i IN 1..300 LOOP
        INSERT INTO user_post_comments(user_id, post_id, content)
        VALUES ((SELECT id FROM temp_user_ids ORDER BY random() LIMIT 1), (SELECT id FROM temp_user_post_ids ORDER BY random() LIMIT 1), comment_contents[floor(random() * array_length(comment_contents, 1)) + 1]);
    END LOOP;


    -- =================================================================
    --  8. SEED ATTRACTION POST COMMENTS (200+)
    -- =================================================================
    FOR i IN 1..200 LOOP
        INSERT INTO attraction_post_comments(user_id, post_id, content)
        VALUES ((SELECT id FROM temp_user_ids ORDER BY random() LIMIT 1), (SELECT id FROM temp_attraction_post_ids ORDER BY random() LIMIT 1), comment_contents[floor(random() * array_length(comment_contents, 1)) + 1]);
    END LOOP;


    -- =================================================================
    --  9. SEED USER FAVORITES (400+)
    -- =================================================================
    INSERT INTO temp_all_favoritable_items (id, type) SELECT id, 'tour' FROM temp_tour_ids;
    INSERT INTO temp_all_favoritable_items (id, type) SELECT id, 'post' FROM temp_user_post_ids;
    INSERT INTO temp_all_favoritable_items (id, type) SELECT id, 'attraction' FROM temp_attraction_post_ids;

    FOR i IN 1..400 LOOP
        SELECT id, type INTO item_id_temp, item_type_temp FROM temp_all_favoritable_items ORDER BY random() LIMIT 1;
        INSERT INTO user_favorites (user_id, item_id, item_type)
        VALUES ((SELECT id FROM temp_user_ids ORDER BY random() LIMIT 1), item_id_temp, item_type_temp)
        ON CONFLICT (user_id, item_id, item_type) DO NOTHING;
    END LOOP;

    RAISE NOTICE 'Mock data seeding completed successfully! All tables are populated.';

END $$;