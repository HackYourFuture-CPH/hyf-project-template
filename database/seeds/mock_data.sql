-- =================================================================
--  Enhanced & Schema-Compatible Mock Data for Better Travel DB
-- =================================================================
--  Author: Gemini AI
--  Date: September 15, 2025
--  Notes: This script is updated to be compatible with the latest schema.
--         It includes realistic, detailed content and populates all new tables.
-- =================================================================

-- Set messages to a minimum to reduce noise during seeding
SET client_min_messages TO WARNING;

-- ==========
-- 1) Currencies
-- ==========
INSERT INTO
    currencies (code, name, symbol)
VALUES (
        'USD',
        'United States Dollar',
        '$'
    ),
    ('EUR', 'Euro', '€'),
    ('GBP', 'British Pound', '£'),
    ('JPY', 'Japanese Yen', '¥'),
    (
        'AUD',
        'Australian Dollar',
        '$'
    ),
    ('CAD', 'Canadian Dollar', '$'),
    ('INR', 'Indian Rupee', '₹'),
    ('CNY', 'Chinese Yuan', '¥'),
    (
        'NZD',
        'New Zealand Dollar',
        '$'
    ) ON CONFLICT (code) DO NOTHING;

-- ==========
-- 2) Users
--    - 50 synthetic users with varied roles.
--    - Includes a default, known admin user.
-- ==========
INSERT INTO 
    users (id, username, email, password, first_name, last_name, mobile, profile_image, role, is_active, email_verified_at)
SELECT
  gen_random_uuid(),
  ('user' || g) AS username,
  ('user' || g || '@example.com') AS email,
  '$2b$10$placeholderHashForUser' AS password, -- placeholder bcrypt hash
  ('First' || g) AS first_name,
  ('Last' || g) AS last_name,
  ('+1' || lpad((1000000000 + g)::text, 10, '0')) AS mobile,
  ('/images/user_profiles/u' || (g % 20 + 1) || '.jpg') AS profile_image,
  CASE WHEN g <= 2 THEN 'admin' WHEN g <= 4 THEN 'moderator' ELSE 'user' END as role,
  true,
  NOW() - (g || ' days')::interval
FROM generate_series(1, 50) AS s(g);

-- Insert a known admin user for easy access
INSERT INTO
    users (
        first_name,
        last_name,
        email,
        username,
        password,
        mobile,
        role,
        is_active,
        email_verified_at
    )
VALUES (
        'Admin',
        'User',
        'admin@example.com',
        'admin',
        '$2a$12$.mbqwDuqyUdJAtc1ixCsP.SPPKXnry2gojRzQck56wzbdvLxT8zjS',
        '555-0000-ADMIN',
        'admin',
        true,
        NOW()
    ) ON CONFLICT (username) DO NOTHING;

-- ==========
-- 3) Travel Plans (Official Tours)
--    - Rich, detailed descriptions for a better user experience.
-- ==========
INSERT INTO
    travel_plans (
        id,
        name,
        description,
        start_date,
        duration_days,
        price_minor,
        currency_code,
        capacity,
        cover_image_url,
        owner_id,
        plan_type,
        rating,
        rating_count
    )
VALUES (
        gen_random_uuid (),
        'African Safari Expedition',
        'A thrilling 10-day journey through Kenya''s Maasai Mara and Tanzania''s Serengeti. Witness the Great Migration, enjoy daily game drives with expert guides, and stay in luxurious tented camps under the stars. This is a dream trip for wildlife photographers and nature lovers.',
        '2026-02-01',
        10,
        2499000,
        'USD',
        12,
        '/images/tours/african_safari_expedition.jpg',
        NULL,
        'tour',
        4.8,
        128
    ),
    (
        gen_random_uuid (),
        'Canadian Rockies by Rail',
        'Experience the majestic Canadian Rockies on an 8-day scenic train journey. Travel from Vancouver through snow-capped peaks to Banff and Jasper. Enjoy gourmet meals onboard, off-train excursions for hiking, and breathtaking photo opportunities at every turn.',
        '2026-06-15',
        8,
        1999000,
        'CAD',
        30,
        '/images/tours/canadian_rockies_by_rail.jpg',
        NULL,
        'tour',
        4.7,
        92
    ),
    (
        gen_random_uuid (),
        'Coastal Croatia & Slovenia',
        'Discover the gems of the Adriatic on this 7-day coastal tour. Explore the medieval walls of Dubrovnik, the vibrant streets of Split, and the charming seaside town of Piran in Slovenia. Includes boat trips to idyllic islands and wine tasting at local vineyards.',
        '2026-05-10',
        7,
        1399000,
        'EUR',
        20,
        '/images/tours/coastal_croatia_slovenia.jpg',
        NULL,
        'tour',
        4.6,
        63
    ),
    (
        gen_random_uuid (),
        'Flavors of Spain - Culinary Tour',
        'A 9-day gastronomic adventure through Spain. From the pintxos bars of San Sebastián to the bustling markets of Madrid and the traditional tapas of Seville, this tour is a feast for the senses. Includes hands-on cooking classes and visits to renowned wineries.',
        '2026-04-12',
        9,
        1299000,
        'EUR',
        16,
        '/images/tours/flavors_of_spain_a_culinary_tour.jpg',
        NULL,
        'tour',
        4.9,
        210
    ),
    (
        gen_random_uuid (),
        'Greek Islands Cruise',
        'Set sail on a 10-day small-ship cruise through the Cyclades. Wake up to stunning views of whitewashed villages in Mykonos, watch the sunset in Santorini, and swim in the crystal-clear waters of hidden bays in Naxos. A perfect blend of relaxation and discovery.',
        '2026-07-05',
        10,
        1499000,
        'EUR',
        40,
        '/images/tours/greek_islands_cruise.jpg',
        NULL,
        'tour',
        4.5,
        54
    ),
    (
        gen_random_uuid (),
        'Italian Renaissance Journey',
        'Immerse yourself in art, history, and culture on this 9-day journey through Italy. Marvel at Michelangelo''s David in Florence, walk through the ancient Colosseum in Rome, and glide through the canals of Venice. This tour is a masterpiece of cultural exploration.',
        '2026-09-01',
        9,
        1599000,
        'EUR',
        18,
        '/images/tours/italian_renaissance_journey.jpg',
        NULL,
        'tour',
        4.9,
        176
    ),
    (
        gen_random_uuid (),
        'New Zealand Adventure Quest',
        'An action-packed 12-day tour across both islands of New Zealand. Hike the Tongariro Alpine Crossing, cruise through the majestic Milford Sound, and experience the geothermal wonders of Rotorua. Perfect for thrill-seekers and nature enthusiasts.',
        '2026-11-10',
        12,
        2399000,
        'NZD',
        12,
        '/images/tours/new_zealand_adventure_quest.jpg',
        NULL,
        'tour',
        4.9,
        143
    ),
    (
        gen_random_uuid (),
        'Peru - Land of the Incas',
        'Embark on a 9-day historical expedition to the heart of the Inca Empire. Explore the vibrant markets of Cusco, hike a portion of the Inca Trail, and greet the sunrise over the mystical ruins of Machu Picchu. A journey back in time.',
        '2026-06-01',
        9,
        1399000,
        'USD',
        16,
        '/images/tours/peru_land_of_the_incas.jpg',
        NULL,
        'tour',
        4.6,
        101
    );

-- ==========
-- 4) Travel Plans (User-Created Trips)
--    - Personal, user-owned trips to populate trip planning features.
-- ==========
INSERT INTO
    travel_plans (
        id,
        name,
        description,
        owner_id,
        plan_type
    )
VALUES (
        gen_random_uuid (),
        'Summer Backpacking in Europe',
        'My 3-week solo trip across Europe! Starting in Lisbon, heading to Madrid, then flying to Rome and finishing in Berlin. Open to suggestions for hostels and must-see spots!',
        (
            SELECT id
            FROM users
            WHERE
                username = 'user5'
        ),
        'user'
    ),
    (
        gen_random_uuid (),
        'Smith Family Vacation to Hawaii',
        'Annual family trip for 2026! Planning 8 days between Oahu and Maui. Looking for family-friendly activities, good restaurants, and maybe a luau.',
        (
            SELECT id
            FROM users
            WHERE
                username = 'user12'
        ),
        'user'
    ),
    (
        gen_random_uuid (),
        'Japan Cherry Blossom Tour 2027',
        'A photography-focused trip to capture the sakura season. Planning to visit Tokyo, Kyoto, and Hiroshima over 10 days. Collaborating with Sarah on the itinerary.',
        (
            SELECT id
            FROM users
            WHERE
                username = 'user22'
        ),
        'user'
    ),
    (
        gen_random_uuid (),
        'Anniversary Trip to Paris',
        'A romantic 5-day getaway for our 10th anniversary. We want to visit the classic sites, enjoy some amazing food, and maybe take a day trip to Versailles.',
        (
            SELECT id
            FROM users
            WHERE
                username = 'user8'
        ),
        'user'
    ),
    (
        gen_random_uuid (),
        'Road Trip Through California',
        'Driving from San Francisco to Los Angeles along the Pacific Coast Highway. Planning stops in Monterey, Big Sur, and Santa Barbara. All about the views and vibes!',
        (
            SELECT id
            FROM users
            WHERE
                username = 'user30'
        ),
        'user'
    );

-- ==========
-- 5) Tour Destinations
--    - Linking cities to the official tours.
-- ==========
INSERT INTO
    tour_destinations (
        id,
        tour_id,
        city_name,
        country_name,
        stop_order,
        duration_days
    )
VALUES (
        gen_random_uuid (),
        (
            SELECT id
            FROM travel_plans
            WHERE
                name = 'African Safari Expedition'
        ),
        'Maasai Mara',
        'Kenya',
        1,
        3
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM travel_plans
            WHERE
                name = 'African Safari Expedition'
        ),
        'Serengeti',
        'Tanzania',
        2,
        4
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM travel_plans
            WHERE
                name = 'African Safari Expedition'
        ),
        'Ngorongoro Crater',
        'Tanzania',
        3,
        3
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM travel_plans
            WHERE
                name = 'Canadian Rockies by Rail'
        ),
        'Vancouver',
        'Canada',
        1,
        2
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM travel_plans
            WHERE
                name = 'Canadian Rockies by Rail'
        ),
        'Banff',
        'Canada',
        2,
        3
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM travel_plans
            WHERE
                name = 'Canadian Rockies by Rail'
        ),
        'Jasper',
        'Canada',
        3,
        3
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM travel_plans
            WHERE
                name = 'Coastal Croatia & Slovenia'
        ),
        'Dubrovnik',
        'Croatia',
        1,
        2
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM travel_plans
            WHERE
                name = 'Coastal Croatia & Slovenia'
        ),
        'Split',
        'Croatia',
        2,
        2
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM travel_plans
            WHERE
                name = 'Coastal Croatia & Slovenia'
        ),
        'Piran',
        'Slovenia',
        3,
        3
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM travel_plans
            WHERE
                name = 'Flavors of Spain - Culinary Tour'
        ),
        'San Sebastián',
        'Spain',
        1,
        3
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM travel_plans
            WHERE
                name = 'Flavors of Spain - Culinary Tour'
        ),
        'Madrid',
        'Spain',
        2,
        3
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM travel_plans
            WHERE
                name = 'Flavors of Spain - Culinary Tour'
        ),
        'Seville',
        'Spain',
        3,
        3
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM travel_plans
            WHERE
                name = 'Greek Islands Cruise'
        ),
        'Mykonos',
        'Greece',
        1,
        2
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM travel_plans
            WHERE
                name = 'Greek Islands Cruise'
        ),
        'Santorini',
        'Greece',
        2,
        3
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM travel_plans
            WHERE
                name = 'Greek Islands Cruise'
        ),
        'Naxos',
        'Greece',
        3,
        3
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM travel_plans
            WHERE
                name = 'Italian Renaissance Journey'
        ),
        'Florence',
        'Italy',
        1,
        3
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM travel_plans
            WHERE
                name = 'Italian Renaissance Journey'
        ),
        'Rome',
        'Italy',
        2,
        3
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM travel_plans
            WHERE
                name = 'Italian Renaissance Journey'
        ),
        'Venice',
        'Italy',
        3,
        3
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM travel_plans
            WHERE
                name = 'New Zealand Adventure Quest'
        ),
        'Queenstown',
        'New Zealand',
        1,
        4
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM travel_plans
            WHERE
                name = 'New Zealand Adventure Quest'
        ),
        'Milford Sound',
        'New Zealand',
        2,
        3
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM travel_plans
            WHERE
                name = 'New Zealand Adventure Quest'
        ),
        'Rotorua',
        'New Zealand',
        3,
        3
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM travel_plans
            WHERE
                name = 'Peru - Land of the Incas'
        ),
        'Lima',
        'Peru',
        1,
        2
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM travel_plans
            WHERE
                name = 'Peru - Land of the Incas'
        ),
        'Cusco',
        'Peru',
        2,
        3
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM travel_plans
            WHERE
                name = 'Peru - Land of the Incas'
        ),
        'Machu Picchu',
        'Peru',
        3,
        2
    );

-- ==========
-- 6) Attraction Posts & Photos
--    - Detailed content for attractions to make pages look full.
-- ==========
INSERT INTO
    attraction_posts (
        id,
        title,
        content,
        location,
        category
    )
VALUES (
        gen_random_uuid (),
        'A Day at the Louvre Museum',
        'Home to masterpieces like the Mona Lisa and Venus de Milo, the Louvre is the world''s largest art museum. Plan to spend a full day here and still only scratch the surface. Tip: Buy tickets online in advance to avoid long queues. The Richelieu wing is often less crowded and contains stunning collections.',
        'Paris, France',
        'Museum'
    ),
    (
        gen_random_uuid (),
        'Christ the Redeemer at Sunrise',
        'Standing atop Corcovado mountain, this iconic statue of Jesus Christ overlooks Rio de Janeiro. Taking the first train up in the morning allows you to witness a breathtaking sunrise and enjoy the panoramic views with fewer crowds. It''s a truly spiritual and unforgettable experience.',
        'Rio de Janeiro, Brazil',
        'Landmark'
    ),
    (
        gen_random_uuid (),
        'Exploring the Acropolis of Athens',
        'A symbol of Western civilization, the Acropolis is a must-see. Walk among ancient temples like the Parthenon and the Erechtheion. The view of Athens from the top is spectacular. Wear comfortable shoes, as the marble paths can be slippery. Visiting late in the afternoon offers cooler temperatures and golden light for photos.',
        'Athens, Greece',
        'Historic'
    ),
    (
        gen_random_uuid (),
        'Temples of Angkor Wat',
        'This vast temple complex is a marvel of human ingenuity and a spiritual heart of Cambodia. Exploring the intricate carvings and towering spires at dawn is a bucket-list experience. Consider a multi-day pass to explore not just Angkor Wat but also nearby temples like Bayon and Ta Prohm (the "Tomb Raider" temple).',
        'Siem Reap, Cambodia',
        'Historic'
    ),
    (
        gen_random_uuid (),
        'Hiking the Great Wall of China',
        'Stretching for thousands of miles, the Great Wall is an awe-inspiring feat of engineering. The Mutianyu section is beautifully restored and offers stunning views with fewer crowds than Badaling. You can take a cable car up and a thrilling toboggan ride down.',
        'Beijing, China',
        'Hiking'
    ),
    (
        gen_random_uuid (),
        'Sunrise over Machu Picchu',
        'This ancient Incan citadel set high in the Andes Mountains is a place of incredible beauty and mystery. An early morning visit rewards you with misty, atmospheric views as the sun rises over the peaks. The hike up Huayna Picchu offers a stunning bird''s-eye view of the entire complex, but tickets must be booked months in advance.',
        'Machu Picchu, Peru',
        'Historic'
    );

-- Link one photo per attraction
INSERT INTO
    attraction_post_photos (post_id, image_url, caption)
VALUES (
        (
            SELECT id
            FROM attraction_posts
            WHERE
                title = 'A Day at the Louvre Museum'
        ),
        'https://3ob6vy266n.ufs.sh/f/Gabd92PWznj00D3fjS8vrjHILszJxUWbk0h9BE57yM6OfC4X',
        'The iconic glass pyramid entrance to the Louvre Museum.'
    ),
    (
        (
            SELECT id
            FROM attraction_posts
            WHERE
                title = 'Christ the Redeemer at Sunrise'
        ),
        'https://3ob6vy266n.ufs.sh/f/Gabd92PWznj09in6U6pe2Iju8KpdLsDhGA3lQb0XEcJqarPw',
        'A breathtaking view of the statue with the rising sun over Rio.'
    ),
    (
        (
            SELECT id
            FROM attraction_posts
            WHERE
                title = 'Exploring the Acropolis of Athens'
        ),
        'https://3ob6vy266n.ufs.sh/f/Gabd92PWznj09mYAkupe2Iju8KpdLsDhGA3lQb0XEcJqarPw',
        'The majestic Parthenon standing tall against a brilliant blue sky.'
    ),
    (
        (
            SELECT id
            FROM attraction_posts
            WHERE
                title = 'Temples of Angkor Wat'
        ),
        'https://3ob6vy266n.ufs.sh/f/Gabd92PWznj0WlygB7seVEcbGpMlTg43ioAS9XC2Z6PLBNtn',
        'The iconic silhouette of Angkor Wat reflected in the lotus pond at sunrise.'
    ),
    (
        (
            SELECT id
            FROM attraction_posts
            WHERE
                title = 'Hiking the Great Wall of China'
        ),
        'https://3ob6vy266n.ufs.sh/f/Gabd92PWznj0VRxYhNQ4e0LUG6WZy93PdIiAFbvfNaQsrKRp',
        'A winding section of the Great Wall snaking over green hills.'
    ),
    (
        (
            SELECT id
            FROM attraction_posts
            WHERE
                title = 'Sunrise over Machu Picchu'
        ),
        'https://3ob6vy266n.ufs.sh/f/Gabd92PWznj0j5ZbNhI3wS0HKTeOFA4qrugX65UbRliCaohy',
        'Morning mist clearing to reveal the stunning ancient city.'
    );

-- ==========
-- 7) User Posts & Photos
--    - Unique, realistic blog posts with varied statuses.
-- ==========
INSERT INTO
    user_posts (
        user_id,
        title,
        content,
        category,
        status
    )
VALUES (
        (
            SELECT id
            FROM users
            WHERE
                username = 'user18'
        ),
        'My Solo Trip Through Vietnam: A Woman''s Perspective',
        'Traveling solo through Vietnam was one of the most empowering experiences of my life. From the chaotic energy of Hanoi''s Old Quarter to the serene beauty of Ha Long Bay, every day was an adventure. I learned to ride a scooter, haggled at local markets, and ate some of the best food I''ve ever had. To any women considering a solo trip here: do it! It''s safe, affordable, and incredibly rewarding.',
        'Adventure',
        'published'
    ),
    (
        (
            SELECT id
            FROM users
            WHERE
                username = 'user25'
        ),
        'A Food Lover''s Guide to Italy',
        'Forget the diet! Italy is a country you experience with your taste buds. This post is my love letter to Italian food. We''ll cover the best pizza in Naples, the perfect cacio e pepe in Rome, and the most delicate gelato in Florence. I''ve included a list of my favorite restaurants and the one dish you absolutely must order at each.',
        'Food',
        'published'
    ),
    (
        (
            SELECT id
            FROM users
            WHERE
                username = 'user3'
        ),
        'Chasing the Northern Lights in Iceland',
        'Seeing the Aurora Borealis has been on my bucket list forever. This past winter, I finally made it happen. Standing under a sky dancing with green and purple lights is indescribable. This guide covers the best time of year to go, recommended tour operators, and tips for photographing the lights. It takes patience, but the payoff is a memory that will last a lifetime.',
        'Nature',
        'published'
    ),
    (
        (
            SELECT id
            FROM users
            WHERE
                username = 'user41'
        ),
        'How to Pack for a Year of Travel in One Carry-On',
        'It sounds impossible, but I did it. For a full year of travel across four continents, I lived out of a single carry-on bag. The key is merino wool, packing cubes, and a ruthless "does this bring me joy?" attitude towards every item. Here''s my complete packing list and the strategies I used to make it work.',
        'Tips',
        'published'
    ),
    (
        (
            SELECT id
            FROM users
            WHERE
                username = 'user11'
        ),
        'Trekking to Everest Base Camp: A Photo Diary',
        'The two-week trek to Everest Base Camp was the most physically and mentally challenging thing I''ve ever done. The altitude is no joke, but the views of the Himalayas are otherworldly. This post is a day-by-day photo diary of the journey, from the thrilling flight into Lukla to the emotional arrival at Base Camp.',
        'Hiking',
        'inactive'
    );

-- Link photos to the new user posts
INSERT INTO
    user_post_photos (post_id, image_url, caption)
VALUES (
        (
            SELECT id
            FROM user_posts
            WHERE
                title = 'My Solo Trip Through Vietnam: A Woman''s Perspective'
        ),
        'https://3ob6vy266n.ufs.sh/f/Gabd92PWznj0rmcw8tMWspB8Ti3SIXkzMvPKcmgG9EwRujOL',
        'A vibrant street scene in Hoi An, with lanterns lighting up the evening.'
    ),
    (
        (
            SELECT id
            FROM user_posts
            WHERE
                title = 'A Food Lover''s Guide to Italy'
        ),
        'https://3ob6vy266n.ufs.sh/f/Gabd92PWznj0dsLpMh5TYxVdEPOHJ8sb9p21g3CBmQU6L4ZG',
        'A close-up of a delicious, authentic Neapolitan pizza.'
    ),
    (
        (
            SELECT id
            FROM user_posts
            WHERE
                title = 'Chasing the Northern Lights in Iceland'
        ),
        'https://3ob6vy266n.ufs.sh/f/Gabd92PWznj0CHcziJ7hlFE0vRXQqM1tunOcerYbofySxH9D',
        'The magical green glow of the Northern Lights over a snowy Icelandic landscape.'
    ),
    (
        (
            SELECT id
            FROM user_posts
            WHERE
                title = 'How to Pack for a Year of Travel in One Carry-On'
        ),
        'https://3ob6vy266n.ufs.sh/f/Gabd92PWznj00rg6i68vrjHILszJxUWbk0h9BE57yM6OfC4X',
        'A neatly organized carry-on backpack using packing cubes.'
    ),
    (
        (
            SELECT id
            FROM user_posts
            WHERE
                title = 'Trekking to Everest Base Camp: A Photo Diary'
        ),
        'https://3ob6vy266n.ufs.sh/f/Gabd92PWznj0swq6DWJRiPREdWQemAxpCHnMrkalFu39t2Zc',
        'A stunning view of Ama Dablam peak on the trail to Everest.'
    );

-- ==========
-- 8) Tour Reviews
--    - Reviews with varied ratings, content, and moderation statuses.
-- ==========
INSERT INTO
    tour_reviews (
        user_id,
        tour_id,
        rating,
        content,
        status
    )
VALUES (
        (
            SELECT id
            FROM users
            WHERE
                username = 'user7'
        ),
        (
            SELECT id
            FROM travel_plans
            WHERE
                name = 'Italian Renaissance Journey'
        ),
        5,
        'Absolutely incredible tour. Our guide, Marco, was so knowledgeable and passionate. We saw so much but never felt rushed. The hotels were fantastic and the food was to die for. Worth every penny!',
        'approved'
    ),
    (
        (
            SELECT id
            FROM users
            WHERE
                username = 'user15'
        ),
        (
            SELECT id
            FROM travel_plans
            WHERE
                name = 'Italian Renaissance Journey'
        ),
        4,
        'A really great trip. My only complaint is that the day in Venice felt a bit short. Otherwise, it was well-organized and we learned a lot. Florence was the highlight for me.',
        'approved'
    ),
    (
        (
            SELECT id
            FROM users
            WHERE
                username = 'user23'
        ),
        (
            SELECT id
            FROM travel_plans
            WHERE
                name = 'African Safari Expedition'
        ),
        5,
        'The experience of a lifetime! We saw the "Big Five" within the first three days. The guides were amazing at spotting animals and the camps were surprisingly luxurious. I have over 2,000 photos!',
        'approved'
    ),
    (
        (
            SELECT id
            FROM users
            WHERE
                username = 'user31'
        ),
        (
            SELECT id
            FROM travel_plans
            WHERE
                name = 'African Safari Expedition'
        ),
        2,
        'The wildlife was amazing but the logistics were a mess. Our jeep broke down twice and we missed a full afternoon game drive. For the price, I expected better reliability.',
        'pending'
    ),
    (
        (
            SELECT id
            FROM users
            WHERE
                username = 'user40'
        ),
        (
            SELECT id
            FROM travel_plans
            WHERE
                name = 'Peru - Land of the Incas'
        ),
        5,
        'Machu Picchu at sunrise is something I will never forget. This tour was perfectly paced to help us acclimatize to the altitude. Our guide was from a local village and shared so much about his culture. Highly recommend.',
        'approved'
    ),
    (
        (
            SELECT id
            FROM users
            WHERE
                username = 'user2'
        ),
        (
            SELECT id
            FROM travel_plans
            WHERE
                name = 'Peru - Land of the Incas'
        ),
        1,
        'This is spam.',
        'rejected'
    );

-- ==========
-- 9) Comments (Unified Table)
--    - Polymorphic comments on both User Posts and Attraction Posts with varied statuses.
-- ==========
-- Comments on User Posts
INSERT INTO
    comments (
        user_id,
        content,
        commentable_id,
        commentable_type,
        status
    )
VALUES (
        (
            SELECT id
            FROM users
            WHERE
                username = 'user29'
        ),
        'This is such an inspiring post! Vietnam is next on my list. Thanks for the great tips.',
        (
            SELECT id
            FROM user_posts
            WHERE
                title = 'My Solo Trip Through Vietnam: A Woman''s Perspective'
        ),
        'post',
        'approved'
    ),
    (
        (
            SELECT id
            FROM users
            WHERE
                username = 'user33'
        ),
        'I completely agree about merino wool! It''s a game-changer for long-term travel.',
        (
            SELECT id
            FROM user_posts
            WHERE
                title = 'How to Pack for a Year of Travel in One Carry-On'
        ),
        'post',
        'approved'
    ),
    (
        (
            SELECT id
            FROM users
            WHERE
                username = 'user9'
        ),
        'Your photos are stunning! What kind of camera did you use?',
        (
            SELECT id
            FROM user_posts
            WHERE
                title = 'Chasing the Northern Lights in Iceland'
        ),
        'post',
        'pending'
    ),
    (
        (
            SELECT id
            FROM users
            WHERE
                username = 'user16'
        ),
        'This is just an ad for a different website.',
        (
            SELECT id
            FROM user_posts
            WHERE
                title = 'A Food Lover''s Guide to Italy'
        ),
        'post',
        'rejected'
    );

-- Comments on Attraction Posts
INSERT INTO
    comments (
        user_id,
        content,
        commentable_id,
        commentable_type,
        status
    )
VALUES (
        (
            SELECT id
            FROM users
            WHERE
                username = 'user44'
        ),
        'Great advice about buying tickets online for the Louvre. It saved us hours!',
        (
            SELECT id
            FROM attraction_posts
            WHERE
                title = 'A Day at the Louvre Museum'
        ),
        'attraction',
        'approved'
    ),
    (
        (
            SELECT id
            FROM users
            WHERE
                username = 'user19'
        ),
        'Is it difficult to get a taxi back down from Christ the Redeemer in the afternoon?',
        (
            SELECT id
            FROM attraction_posts
            WHERE
                title = 'Christ the Redeemer at Sunrise'
        ),
        'attraction',
        'approved'
    ),
    (
        (
            SELECT id
            FROM users
            WHERE
                username = 'user6'
        ),
        'We did the toboggan ride down from the Great Wall and it was SO much fun! The kids loved it.',
        (
            SELECT id
            FROM attraction_posts
            WHERE
                title = 'Hiking the Great Wall of China'
        ),
        'attraction',
        'approved'
    );

-- ==========
-- 10) Custom Trip Bookings
--     - Bookings for the user-created trips.
-- ==========
INSERT INTO
    custom_trip_bookings (
        user_id,
        trip_id,
        num_travelers,
        total_price_minor,
        booking_status
    )
VALUES (
        (
            SELECT id
            FROM users
            WHERE
                username = 'user12'
        ),
        (
            SELECT id
            FROM travel_plans
            WHERE
                name = 'Smith Family Vacation to Hawaii'
        ),
        4,
        650000,
        'confirmed'
    ),
    (
        (
            SELECT id
            FROM users
            WHERE
                username = 'user8'
        ),
        (
            SELECT id
            FROM travel_plans
            WHERE
                name = 'Anniversary Trip to Paris'
        ),
        2,
        320000,
        'confirmed'
    );

-- ==========
-- 11) Trip Collaborators
--     - Adding users to collaborate on user-created trips.
-- ==========
INSERT INTO
    trip_collaborators (
        trip_id,
        user_id,
        permission_level
    )
VALUES (
        (
            SELECT id
            FROM travel_plans
            WHERE
                name = 'Japan Cherry Blossom Tour 2027'
        ),
        (
            SELECT id
            FROM users
            WHERE
                username = 'user10'
        ),
        'editor'
    ),
    (
        (
            SELECT id
            FROM travel_plans
            WHERE
                name = 'Road Trip Through California'
        ),
        (
            SELECT id
            FROM users
            WHERE
                username = 'user28'
        ),
        'viewer'
    );

-- ==========
-- 12) Trip Invitations
--     - Shareable links for trip collaboration.
-- ==========
INSERT INTO
    trip_invitations (
        trip_id,
        created_by_user_id,
        token,
        expires_at
    )
VALUES (
        (
            SELECT id
            FROM travel_plans
            WHERE
                name = 'Summer Backpacking in Europe'
        ),
        (
            SELECT id
            FROM users
            WHERE
                username = 'user5'
        ),
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0cmlwSWQiOiJzb21lLXV1aWQiLCJleHAiOjE3NjIxODg4MDB9.fake_token_string_1',
        NOW() + INTERVAL '7 days'
    ),
    (
        (
            SELECT id
            FROM travel_plans
            WHERE
                name = 'Japan Cherry Blossom Tour 2027'
        ),
        (
            SELECT id
            FROM users
            WHERE
                username = 'user22'
        ),
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0cmlwSWQiOiJhbm90aGVyLXV1aWQiLCJleHAiOjE3NjIxODg4MDB9.fake_token_string_2',
        NOW() + INTERVAL '7 days'
    );

-- ==========
-- 13) Master Lists for Flights and Accommodations
--     - Populating the master lists for the trip planner feature.
-- ==========


-- ==========
-- PATCH: Replace local image paths with hosted UploadThing URLs
-- This section ensures that image URLs point to live, hosted assets.
-- ==========
UPDATE travel_plans
SET
    cover_image_url = 'https://3ob6vy266n.ufs.sh/f/Gabd92PWznj0XrkY1048czo0FnJgbLQ4u7TIiB2MsPNkAx5K'
WHERE
    cover_image_url = '/images/tours/journey_through_the_holy_land.jpg';

UPDATE travel_plans
SET
    cover_image_url = 'https://3ob6vy266n.ufs.sh/f/Gabd92PWznj0LZLBrhq43jEt8qsiycWUKSabYIPoBkrnFdx2'
WHERE
    cover_image_url = '/images/tours/the_silk_road_odyssey.jpg';

UPDATE travel_plans
SET
    cover_image_url = 'https://3ob6vy266n.ufs.sh/f/Gabd92PWznj0XJmAMZY48czo0FnJgbLQ4u7TIiB2MsPNkAx5'
WHERE
    cover_image_url = '/images/tours/canadian_rockies_by_rail.jpg';

-- ==========
-- 14. NEW: MASTER LISTS FOR FLIGHTS AND ACCOMMODATIONS
-- ==========

-- Seed a master list of available accommodations
INSERT INTO
    accommodations (
        id,
        name,
        city,
        type,
        capacity_per_room,
        rating,
        price_per_night_minor,
        currency_code
    )
VALUES (
        gen_random_uuid (),
        'Grand Hotel Paris',
        'Paris',
        'hotel',
        2,
        4.5,
        25000,
        'EUR'
    ),
    (
        gen_random_uuid (),
        'Rome City Center B&B',
        'Rome',
        'guesthouse',
        2,
        4.2,
        12000,
        'EUR'
    ),
    (
        gen_random_uuid (),
        'Tokyo Central Hostel',
        'Tokyo',
        'hostel',
        4,
        4.0,
        4500,
        'JPY'
    ),
    (
        gen_random_uuid (),
        'The Londoner',
        'London',
        'hotel',
        3,
        4.8,
        35000,
        'GBP'
    ),
    (
        gen_random_uuid (),
        'Sydney Harbour View',
        'Sydney',
        'hotel',
        2,
        4.6,
        28000,
        'AUD'
    ),
    (
        gen_random_uuid (),
        'Cairo Pyramids Hotel',
        'Cairo',
        'hotel',
        4,
        4.1,
        15000,
        'USD'
    ),
    (
        gen_random_uuid (),
        'Rio Beachside Hostel',
        'Rio de Janeiro',
        'hostel',
        6,
        3.9,
        3000,
        'USD'
    ),
    (
        gen_random_uuid (),
        'Kyoto Garden Ryokan',
        'Kyoto',
        'guesthouse',
        2,
        4.9,
        22000,
        'JPY'
    ),
    (
        gen_random_uuid (),
        'The Dubliner Inn',
        'Dublin',
        'guesthouse',
        3,
        4.3,
        11000,
        'EUR'
    ),
    (
        gen_random_uuid (),
        'Vancouver Downtown Suites',
        'Vancouver',
        'hotel',
        4,
        4.4,
        21000,
        'CAD'
    );

-- Seed a master list of available flights
INSERT INTO
    flights (
        id,
        airline,
        flight_number,
        departure_city,
        arrival_city,
        departure_timestamp,
        arrival_timestamp,
        available_seats,
        price_minor,
        currency_code
    )
VALUES (
        gen_random_uuid (),
        'Global Airways',
        'GA201',
        'London',
        'Paris',
        NOW() + interval '30 days',
        NOW() + interval '30 days 2 hours',
        50,
        12000,
        'EUR'
    ),
    (
        gen_random_uuid (),
        'Horizon Jet',
        'HJ550',
        'New York',
        'London',
        NOW() + interval '45 days',
        NOW() + interval '45 days 8 hours',
        120,
        45000,
        'USD'
    ),
    (
        gen_random_uuid (),
        'SkyLink Airlines',
        'SL891',
        'Tokyo',
        'Sydney',
        NOW() + interval '60 days',
        NOW() + interval '60 days 9 hours',
        80,
        65000,
        'AUD'
    ),
    (
        gen_random_uuid (),
        'Continental Connect',
        'CC303',
        'Paris',
        'Rome',
        NOW() + interval '32 days',
        NOW() + interval '32 days 2 hours',
        30,
        9000,
        'EUR'
    ),
    (
        gen_random_uuid (),
        'Transoceanic Flights',
        'TF112',
        'Sydney',
        'Los Angeles',
        NOW() + interval '50 days',
        NOW() + interval '50 days 14 hours',
        150,
        75000,
        'USD'
    ),
    (
        gen_random_uuid (),
        'Apex Air',
        'AX404',
        'Los Angeles',
        'Tokyo',
        NOW() + interval '55 days',
        NOW() + interval '55 days 11 hours',
        100,
        82000,
        'JPY'
    ),
    (
        gen_random_uuid (),
        'Global Airways',
        'GA310',
        'Rome',
        'Athens',
        NOW() + interval '35 days',
        NOW() + interval '35 days 1.5 hours',
        40,
        11000,
        'EUR'
    ),
    (
        gen_random_uuid (),
        'Horizon Jet',
        'HJ721',
        'Cairo',
        'Rome',
        NOW() + interval '65 days',
        NOW() + interval '65 days 4 hours',
        60,
        18000,
        'EUR'
    ),
    (
        gen_random_uuid (),
        'SkyLink Airlines',
        'SL902',
        'Rio de Janeiro',
        'Lisbon',
        NOW() + interval '70 days',
        NOW() + interval '70 days 10 hours',
        90,
        55000,
        'EUR'
    ),
    (
        gen_random_uuid (),
        'Continental Connect',
        'CC601',
        'Lisbon',
        'Madrid',
        NOW() + interval '40 days',
        NOW() + interval '40 days 1 hour',
        25,
        7000,
        'EUR'
    );

UPDATE travel_plans
SET
    cover_image_url = 'https://3ob6vy266n.ufs.sh/f/Gabd92PWznj0rYqLIpWspB8Ti3SIXkzMvPKcmgG9EwRujOLY'
WHERE
    cover_image_url = '/images/tours/coastal_croatia_slovenia.jpg';

UPDATE travel_plans
SET
    cover_image_url = 'https://3ob6vy266n.ufs.sh/f/Gabd92PWznj0swElwaLRiPREdWQemAxpCHnMrkalFu39t2Zc'
WHERE
    cover_image_url = '/images/tours/rainforests_ruins_of_central_america.jpg';

UPDATE travel_plans
SET
    cover_image_url = 'https://3ob6vy266n.ufs.sh/f/Gabd92PWznj0l1qrbYtoyrEG0cOjZ4sLVYR3ztldFAe75qHC'
WHERE
    cover_image_url = '/images/tours/italian_renaissance_journey.jpg';

INSERT INTO
    users (
        first_name,
        last_name,
        email,
        username,
        password,
        mobile,
        role,
        is_active,
        email_verified_at
    )
VALUES (
        'Admin',
        'User',
        'admin@example.com',
        'admin',
        '$2a$12$.mbqwDuqyUdJAtc1ixCsP.SPPKXnry2gojRzQck56wzbdvLxT8zjS',
        '555-0000-ADMIN',
        'admin',
        true,
        NOW()
    ) ON CONFLICT (username) DO NOTHING;

-- ==========
-- PATCH: Replace local image paths with hosted UploadThing URLs
-- ==========

UPDATE travel_plans
SET
    cover_image_url = 'https://3ob6vy266n.ufs.sh/f/Gabd92PWznj0XrkY1048czo0FnJgbLQ4u7TIiB2MsPNkAx5K'
WHERE
    cover_image_url = '/images/tours/journey_through_the_holy_land.jpg';

UPDATE travel_plans
SET
    cover_image_url = 'https://3ob6vy266n.ufs.sh/f/Gabd92PWznj0LZLBrhq43jEt8qsiycWUKSabYIPoBkrnFdx2'
WHERE
    cover_image_url = '/images/tours/the_silk_road_odyssey.jpg';

UPDATE travel_plans
SET
    cover_image_url = 'https://3ob6vy266n.ufs.sh/f/Gabd92PWznj0XJmAMZY48czo0FnJgbLQ4u7TIiB2MsPNkAx5'
WHERE
    cover_image_url = '/images/tours/canadian_rockies_by_rail.jpg';

UPDATE travel_plans
SET
    cover_image_url = 'https://3ob6vy266n.ufs.sh/f/Gabd92PWznj0rYqLIpWspB8Ti3SIXkzMvPKcmgG9EwRujOLY'
WHERE
    cover_image_url = '/images/tours/coastal_croatia_slovenia.jpg';

UPDATE travel_plans
SET
    cover_image_url = 'https://3ob6vy266n.ufs.sh/f/Gabd92PWznj0swElwaLRiPREdWQemAxpCHnMrkalFu39t2Zc'
WHERE
    cover_image_url = '/images/tours/rainforests_ruins_of_central_america.jpg';

UPDATE travel_plans
SET
    cover_image_url = 'https://3ob6vy266n.ufs.sh/f/Gabd92PWznj0l1qrbYtoyrEG0cOjZ4sLVYR3ztldFAe75qHC'
WHERE
    cover_image_url = '/images/tours/italian_renaissance_journey.jpg';
UPDATE travel_plans
SET
    cover_image_url = 'https://3ob6vy266n.ufs.sh/f/Gabd92PWznj0wbI6k7L6TGQynxq0jLsk21FBzhvI9SRfM8at'
WHERE
    cover_image_url = '/images/tours/trans_siberian_railway_adventure.jpg';

UPDATE travel_plans
SET
    cover_image_url = 'https://3ob6vy266n.ufs.sh/f/Gabd92PWznj0FrVLLpVAr1eIs9uElLyK7nqoCzGXPVHU46fF'
WHERE
    cover_image_url = '/images/tours/patagonian_wilderness_trek.jpg';

UPDATE travel_plans
SET
    cover_image_url = 'https://3ob6vy266n.ufs.sh/f/Gabd92PWznj0SHFC1ZobY4WEZ5s1IknvpUBoSQuTjNf28gwK'
WHERE
    cover_image_url = '/images/tours/wonders_of_ancient_egypt.jpg';

UPDATE travel_plans
SET
    cover_image_url = 'https://3ob6vy266n.ufs.sh/f/Gabd92PWznj0WnyGmyeVEcbGpMlTg43ioAS9XC2Z6PLBNtnx'
WHERE
    cover_image_url = '/images/tours/india_s_golden_triangle.jpg';

UPDATE travel_plans
SET
    cover_image_url = 'https://3ob6vy266n.ufs.sh/f/Gabd92PWznj0cUbIEbVcA6s7aPVF5zieXKBH4Qwx1yCJZmYr'
WHERE
    cover_image_url = '/images/tours/southeast_asian_adventure.jpg';

UPDATE travel_plans
SET
    cover_image_url = 'https://3ob6vy266n.ufs.sh/f/Gabd92PWznj0gDy5C1G2dKY945Am8lSuVoyqnJjfLxObRkXH'
WHERE
    cover_image_url = '/images/tours/vietnam_cambodia_discovery.jpg';

UPDATE travel_plans
SET
    cover_image_url = 'https://3ob6vy266n.ufs.sh/f/Gabd92PWznj0VkPKJjQ4e0LUG6WZy93PdIiAFbvfNaQsrKRp'
WHERE
    cover_image_url = '/images/tours/african_safari_expedition.jpg';

UPDATE travel_plans
SET
    cover_image_url = 'https://3ob6vy266n.ufs.sh/f/Gabd92PWznj0Q7jyMvSP7oTIXmufLOFqr1VRHS2YWsQaDjZB'
WHERE
    cover_image_url = '/images/tours/the_baltics_lithuania_latvia_estonia.jpg';

UPDATE travel_plans
SET
    cover_image_url = 'https://3ob6vy266n.ufs.sh/f/Gabd92PWznj0yDFu91hkfYdmDLIvAWg3b9VRlFn2q0uJ1rPi'
WHERE
    cover_image_url = '/images/tours/moroccan_kasbahs_deserts.jpg';

UPDATE travel_plans
SET
    cover_image_url = 'https://3ob6vy266n.ufs.sh/f/Gabd92PWznj0y9LbKbhkfYdmDLIvAWg3b9VRlFn2q0uJ1rPi'
WHERE
    cover_image_url = '/images/tours/the_best_of_portugal_lisbon_porto_algarve.jpg';

UPDATE travel_plans
SET
    cover_image_url = 'https://3ob6vy266n.ufs.sh/f/Gabd92PWznj0dqHhdNTYxVdEPOHJ8sb9p21g3CBmQU6L4ZGq'
WHERE
    cover_image_url = '/images/tours/new_zealand_adventure_quest.jpg';

UPDATE travel_plans
SET
    cover_image_url = 'https://3ob6vy266n.ufs.sh/f/Gabd92PWznj0EPdJkawMX7fJdCPGmizO6Dr1ZWhpSAgYoLab'
WHERE
    cover_image_url = '/images/tours/scandinavian_dreams.jpg';

UPDATE travel_plans
SET
    cover_image_url = 'https://3ob6vy266n.ufs.sh/f/Gabd92PWznj0i3hjk8rHntQMbqG9vIxSZXBz3jKVPr17RDhd'
WHERE
    cover_image_url = '/images/tours/peru_land_of_the_incas.jpg';

UPDATE travel_plans
SET
    cover_image_url = 'https://3ob6vy266n.ufs.sh/f/Gabd92PWznj0ySNYk4hkfYdmDLIvAWg3b9VRlFn2q0uJ1rPi'
WHERE
    cover_image_url = '/images/tours/highlights_of_ireland.jpg';

UPDATE travel_plans
SET
    cover_image_url = 'https://3ob6vy266n.ufs.sh/f/Gabd92PWznj0XxaxZI48czo0FnJgbLQ4u7TIiB2MsPNkAx5K'
WHERE
    cover_image_url = '/images/tours/wild_alaska_expedition_cruise.jpg';

UPDATE travel_plans
SET
    cover_image_url = 'https://3ob6vy266n.ufs.sh/f/Gabd92PWznj0RJldf7EeNkojxWcdsn1F6VT82U50LR7B4brZ'
WHERE
    cover_image_url = '/images/tours/greek_islands_cruise.jpg';

UPDATE travel_plans
SET
    cover_image_url = 'https://3ob6vy266n.ufs.sh/f/Gabd92PWznj0NvgWwhlxHTAjerMmZ8XFxRfO2t61vip7CIn0'
WHERE
    cover_image_url = '/images/tours/mysteries_of_ancient_japan.jpg';

UPDATE travel_plans
SET
    cover_image_url = 'https://3ob6vy266n.ufs.sh/f/Gabd92PWznj06lTsrEzQiACnzreZafc7qOV0XxblLW5tNhyd'
WHERE
    cover_image_url = '/images/tours/flavors_of_spain_a_culinary_tour.jpg';

UPDATE travel_plans
SET
    cover_image_url = 'https://3ob6vy266n.ufs.sh/f/Gabd92PWznj0DIazEkFB4UVJTSYWvGr5Is6yaAeQgq8bKztw'
WHERE
    cover_image_url = '/images/tours/iceland_s_ring_road_adventure.jpg';

-- End of script.
