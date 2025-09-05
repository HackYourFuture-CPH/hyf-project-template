-- =================================================================
--  Comprehensive Mock Data Seed Script (V0 - 100 Rows)
-- =================================================================
-- This script populates all tables with a large, diverse, and realistic
-- set of sample data (100+ rows per entity) for development and testing.
-- =================================================================

-- Create temporary tables to hold the IDs of our newly created entities
CREATE TEMP TABLE temp_user_ids (id UUID, username VARCHAR);
CREATE TEMP TABLE temp_tour_ids (id UUID);
CREATE TEMP TABLE temp_user_trip_ids (id UUID);
CREATE TEMP TABLE temp_attraction_post_ids (id UUID);
CREATE TEMP TABLE temp_user_post_ids (id UUID);

-- Insert 100 Users with more varied names
INSERT INTO users (username, email, password_hash, first_name, last_name, phone_number, role)
SELECT
    LOWER(first_name || last_name || (100 + i)),
    LOWER(first_name || '.' || last_name || (100 + i)) || '@example.com',
    '$2b$10$fakedhashplaceholderfortesting', -- Example bcrypt hash
    first_name,
    last_name,
    '555-02' || (100 + i),
    CASE WHEN i <= 10 THEN 'admin' ELSE 'user' END
FROM (
    SELECT
        (ARRAY['Liam', 'Olivia', 'Noah', 'Emma', 'Oliver', 'Charlotte', 'Elijah', 'Amelia', 'James', 'Ava', 'William', 'Sophia', 'Benjamin', 'Isabella', 'Lucas', 'Mia', 'Henry', 'Evelyn', 'Theodore', 'Harper', 'Jack', 'Camila', 'Levi', 'Gianna', 'Alexander', 'Abigail', 'Jackson', 'Luna', 'Mateo', 'Ella', 'Daniel', 'Elizabeth', 'Michael', 'Avery', 'Mason', 'Sofia', 'Sebastian', 'Emily', 'Ethan', 'Aria', 'Logan', 'Scarlett', 'Owen', 'Grace', 'Samuel', 'Chloe', 'Jacob', 'Victoria', 'Asher', 'Madison', 'Leo', 'Riley', 'Joseph', 'Zoey', 'David', 'Nora', 'Gabriel', 'Lily', 'Carter', 'Hannah', 'Anthony', 'Lillian', 'John', 'Addison', 'Luke', 'Eleanor', 'Dylan', 'Natalie', 'Isaac', 'Zoe', 'Caleb', 'Leah', 'Muhammad', 'Hazel', 'Christopher', 'Violet', 'Andrew', 'Aurora', 'Joshua', 'Savannah', 'Wyatt', 'Brooklyn', 'Matthew', 'Bella', 'Ryan', 'Claire', 'Jaxon', 'Skylar', 'Nathan', 'Lucy', 'Aaron', 'Paisley', 'Eli', 'Everly', 'Jonathan', 'Anna', 'Isaiah', 'Caroline', 'Christian', 'Nova'])[floor(random() * 100) + 1] AS first_name,
        (ARRAY['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts', 'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker', 'Cruz', 'Edwards', 'Collins', 'Reyes', 'Stewart', 'Morris', 'Morales', 'Murphy', 'Cook', 'Rogers', 'Gutierrez', 'Ortiz', 'Morgan', 'Cooper', 'Peterson', 'Bailey', 'Reed', 'Kelly', 'Howard', 'Ramos', 'Kim', 'Cox', 'Ward', 'Richardson', 'Watson', 'Brooks', 'Chavez', 'Wood', 'James', 'Bennett', 'Gray', 'Mendoza', 'Ruiz', 'Hughes', 'Price', 'Alvarez', 'Castillo', 'Sanders'])[floor(random() * 100) + 1] AS last_name,
        generate_series(1, 100) AS i
) AS names;

-- Store all user IDs for later use
INSERT INTO temp_user_ids (id, username)
SELECT id, username FROM users;


-- Insert 100 Pre-defined Tours with realistic data
INSERT INTO travel_plans (name, destination, start_date, end_date, duration_days, price_usd, description, cover_image_url, owner_id, plan_type)
SELECT
    name,
    destination,
    start_date,
    start_date + (duration || ' days')::interval,
    duration,
    price,
    description,
    '/images/tours/tour' || row_num || '.jpg',
    NULL,
    'tour'
FROM (
    SELECT
        row_number() OVER () as row_num,
        (ARRAY[
            'Grand Italian Discovery', 'Secrets of Ancient Egypt', 'Tokyo & Kyoto Highlights', 'Best of the American West', 'Thailand Island Hopping', 'Machu Picchu & the Sacred Valley', 'Essence of Spain & Portugal', 'Canadian Rockies Explorer', 'Icelandic Northern Lights', 'Taste of Vietnam & Cambodia',
            'Classic Greek Islands Cruise', 'New Zealand Adventure', 'Safari in the Serengeti', 'Parisian Art & Culture', 'Castles of Scotland', 'Australian Coastal Journey', 'Wonders of Morocco', 'Flavors of Mexico City', 'Patagonia Wilderness Trek', 'Best of Ireland',
            'Croatian Coastal Adventure', 'Alpine Peaks of Switzerland', 'Highlights of South Africa', 'Costa Rican Rainforest Escape', 'Vibrant India: Golden Triangle', 'The Silk Road: Uzbekistan', 'Norwegian Fjords Cruise', 'Historic Journey Through Japan', 'Berlin & Prague Discovery', 'The Great American Road Trip',
            'Ultimate Brazil: Rio & Iguazu', 'Mystical Bali Retreat', 'Galapagos Islands Expedition', 'The Best of Eastern Europe', 'Antarctica: The White Continent', 'Jordan''s Ancient Wonders', 'Exploring the Amazon', 'Cultural Gems of South Korea', 'Highlights of the Philippines', 'The Ultimate Canadian Winter',
            'Volcanoes & Beaches of Hawaii', 'Tango & Glaciers in Argentina', 'Turkish Delights: Istanbul & Cappadocia', 'The Best of the Baltic States', 'Cuban Rhythms & Colonial Cities', 'Sri Lankan Tea Trails', 'The Majestic Andes', 'A Journey Through the Holy Land', 'Islands of Indonesia', 'Wild Alaska Adventure',
            'Ancient Empires: Rome & Greece', 'Borneo Rainforest Safari', 'Trans-Siberian Railway Adventure', 'Best of Scandinavia', 'The Route of the Maya', 'Journey to the End of the World', 'Hiking the Tour du Mont Blanc', 'The Golden Ring of Russia', 'Epic Iceland Ring Road', 'Exploring the Balkans',
            'Ultimate Australian Outback', 'The Heart of the Silk Road', 'A Taste of Tuscany', 'The Scottish Highlands & Islands', 'The Best of Peru', 'Vietnam by Motorbike', 'The Trans-Mongolian Express', 'The Ultimate Egypt & Jordan', 'The Inca Trail Express', 'The Best of the Baltic Sea',
            'The Wilds of Madagascar', 'The Wonders of Northern India', 'The Best of the West Coast USA', 'The National Parks of Utah', 'The Blues Highway: Memphis to New Orleans', 'The Best of New England in the Fall', 'The California Dream Road Trip', 'The Alaskan Explorer Cruise', 'The Ultimate Hawaiian Escape', 'The Best of the Yucatan Peninsula',
            'The Charms of Southern Spain', 'The Romantic Rhine River Cruise', 'The Imperial Cities of Morocco', 'The Jewels of the Adriatic', 'The Classic Safari in Kenya', 'The Gorilla Trek in Rwanda', 'The Victoria Falls Experience', 'The Cape Town & Wine Route', 'The Best of Japan in Two Weeks', 'The Cherry Blossom Spectacle'
        ])[floor(random() * 100) + 1] AS name,
        (ARRAY[
            'Rome, Italy', 'Cairo, Egypt', 'Tokyo, Japan', 'Las Vegas, USA', 'Phuket, Thailand', 'Cusco, Peru', 'Madrid, Spain', 'Banff, Canada', 'Reykjavik, Iceland', 'Hanoi, Vietnam',
            'Athens, Greece', 'Queenstown, New Zealand', 'Arusha, Tanzania', 'Paris, France', 'Edinburgh, Scotland', 'Sydney, Australia', 'Marrakech, Morocco', 'Mexico City, Mexico', 'El Calafate, Argentina', 'Dublin, Ireland',
            'Dubrovnik, Croatia', 'Interlaken, Switzerland', 'Cape Town, South Africa', 'San Jose, Costa Rica', 'New Delhi, India', 'Tashkent, Uzbekistan', 'Bergen, Norway', 'Kyoto, Japan', 'Berlin, Germany', 'Chicago, USA',
            'Rio de Janeiro, Brazil', 'Ubud, Bali', 'Baltra, Ecuador', 'Budapest, Hungary', 'Ushuaia, Argentina', 'Amman, Jordan', 'Manaus, Brazil', 'Seoul, South Korea', 'Cebu, Philippines', 'Calgary, Canada',
            'Honolulu, USA', 'Buenos Aires, Argentina', 'Istanbul, Turkey', 'Tallinn, Estonia', 'Havana, Cuba', 'Colombo, Sri Lanka', 'Quito, Ecuador', 'Jerusalem, Israel', 'Jakarta, Indonesia', 'Anchorage, USA',
            'Rome, Italy', 'Kota Kinabalu, Malaysia', 'Moscow, Russia', 'Copenhagen, Denmark', 'Cancun, Mexico', 'Ushuaia, Argentina', 'Chamonix, France', 'Moscow, Russia', 'Reykjavik, Iceland', 'Sarajevo, Bosnia',
            'Alice Springs, Australia', 'Samarkand, Uzbekistan', 'Florence, Italy', 'Inverness, Scotland', 'Lima, Peru', 'Ho Chi Minh City, Vietnam', 'Ulaanbaatar, Mongolia', 'Cairo, Egypt', 'Cusco, Peru', 'Helsinki, Finland',
            'Antananarivo, Madagascar', 'Jaipur, India', 'Los Angeles, USA', 'Zion National Park, USA', 'Memphis, USA', 'Boston, USA', 'San Francisco, USA', 'Juneau, USA', 'Maui, USA', 'Tulum, Mexico',
            'Seville, Spain', 'Cologne, Germany', 'Fes, Morocco', 'Split, Croatia', 'Nairobi, Kenya', 'Kigali, Rwanda', 'Livingstone, Zambia', 'Stellenbosch, South Africa', 'Osaka, Japan', 'Tokyo, Japan'
        ])[floor(random() * 100) + 1] AS destination,
        (floor(random() * 10) + 7)::int AS duration,
        (floor(random() * 4500) + 1500)::int AS price,
        '2025-10-01'::date + (row_number() OVER () * 2 || ' days')::interval AS start_date,
        'A comprehensive tour designed to provide an unforgettable experience.' AS description
    FROM generate_series(1, 100)
) AS tours
RETURNING id INTO temp_tour_ids;


-- Insert 100 User-created Trips
INSERT INTO travel_plans (name, destination, start_date, end_date, duration_days, description, cover_image_url, owner_id, plan_type)
SELECT
    'Our ' || destination || ' Adventure',
    destination,
    start_date,
    start_date + (duration || ' days')::interval,
    duration,
    'Our personal trip to explore the amazing ' || destination,
    '/images/trips/trip' || row_num || '.jpg',
    (SELECT id FROM temp_user_ids ORDER BY random() LIMIT 1),
    'user'
FROM (
    SELECT
        row_number() OVER () as row_num,
        (ARRAY[
            'Lisbon', 'Prague', 'Vienna', 'Amsterdam', 'Stockholm', 'Copenhagen', 'Helsinki', 'Oslo', 'Warsaw', 'Krakow', 'Montreal', 'Vancouver', 'Toronto', 'Quebec City', 'Halifax', 'Seoul', 'Busan', 'Jeju Island', 'Singapore', 'Kuala Lumpur',
            'Bangkok', 'Chiang Mai', 'Hoi An', 'Siem Reap', 'Luang Prabang', 'Melbourne', 'Auckland', 'Wellington', 'Christchurch', 'Fiji', 'Bora Bora', 'Tahiti', 'Moorea', 'Honolulu', 'Maui', 'Kauai', 'Big Island', 'Mexico City', 'Cancun', 'Tulum',
            'Oaxaca', 'Guadalajara', 'Bogota', 'Medellin', 'Cartagena', 'Lima', 'Cusco', 'Santiago', 'Mendoza', 'Bariloche', 'San Pedro de Atacama', 'Ushuaia', 'El Chaltén', 'Puerto Varas', 'Valparaiso', 'La Paz', 'Sucre', 'Salar de Uyuni', 'Galapagos', 'Quito',
            'Guayaquil', 'Baños', 'Arequipa', 'Huaraz', 'Iquitos', 'São Paulo', 'Salvador', 'Florianópolis', 'Manaus', 'Jericoacoara', 'Marrakech', 'Fes', 'Chefchaouen', 'Essaouira', 'Merzouga', 'Cairo', 'Luxor', 'Aswan', 'Dahab', 'Siwa',
            'Nairobi', 'Mombasa', 'Maasai Mara', 'Amboseli', 'Lake Nakuru', 'Cape Town', 'Johannesburg', 'Kruger National Park', 'Durban', 'Garden Route'
        ])[floor(random() * 100) + 1] AS destination,
        (floor(random() * 12) + 4)::int AS duration,
        '2026-05-01'::date + (row_number() OVER () * 3 || ' days')::interval AS start_date
    FROM generate_series(1, 100)
) AS user_trips
RETURNING id INTO temp_user_trip_ids;


-- Insert 100 Attraction Posts
INSERT INTO attraction_posts (title, content, location)
SELECT
    title,
    'A must-visit landmark, this attraction offers a unique glimpse into the local history and culture. Plan to spend at least a few hours exploring.',
    location
FROM (
    SELECT
        (ARRAY[
            'Eiffel Tower', 'Colosseum', 'Statue of Liberty', 'Machu Picchu', 'Acropolis of Athens', 'The Great Wall of China', 'Taj Mahal', 'Pyramids of Giza', 'Angkor Wat', 'Petra', 'Christ the Redeemer', 'Sydney Opera House', 'Burj Khalifa', 'The Louvre Museum', 'Niagara Falls',
            'Grand Canyon', 'Stonehenge', 'Victoria Falls', 'Iguazu Falls', 'Mount Fuji', 'Santorini Caldera', 'Neuschwanstein Castle', 'Sagrada Familia', 'St. Peter''s Basilica', 'The Kremlin', 'Ha Long Bay', 'Fushimi Inari-taisha', 'Yellowstone National Park', 'Galapagos Islands', 'Serengeti National Park',
            'Banff National Park', 'Plitvice Lakes National Park', 'Cinque Terre', 'The Grand Palace', 'Chichen Itza', 'The Alhambra', 'Versailles Palace', 'Prague Castle', 'Schönbrunn Palace', 'Topkapi Palace', 'Mount Rushmore', 'Hoover Dam', 'Alcatraz Island', 'Golden Gate Bridge', 'CN Tower',
            'Brandenburg Gate', 'Reichstag Building', 'Charles Bridge', 'St. Mark''s Basilica', 'Tower of London', 'Sistine Chapel', 'Uffizi Gallery', 'Rijksmuseum', 'Van Gogh Museum', 'The British Museum', 'Metropolitan Museum of Art', 'MoMA', 'Art Institute of Chicago', 'Guggenheim Museum Bilbao', 'Prado Museum',
            'Hermitage Museum', 'Acropolis Museum', 'Teotihuacan', 'Palenque', 'Tikal', 'Copan', 'Pompeii', 'Herculaneum', 'The Roman Forum', 'Hadrian''s Wall', 'Skara Brae', 'Newgrange', 'Cliffs of Moher', 'Giant''s Causeway', 'Loch Ness',
            'Table Mountain', 'Robben Island', 'Kruger National Park', 'Blyde River Canyon', 'Victoria & Alfred Waterfront', 'Borobudur', 'Prambanan', 'Mount Bromo', 'Komodo National Park', 'Tanah Lot', 'Uluru', 'The Great Barrier Reef', 'Twelve Apostles', 'Kakadu National Park', 'Fraser Island'
        ])[floor(random() * 100) + 1] AS title,
        (ARRAY[
            'Paris', 'Rome', 'New York', 'Cusco', 'Athens', 'Beijing', 'Agra', 'Cairo', 'Siem Reap', 'Wadi Musa', 'Rio de Janeiro', 'Sydney', 'Dubai', 'Paris', 'Ontario', 'Arizona', 'Wiltshire', 'Livingstone', 'Foz do Iguaçu', 'Honshu',
            'Santorini', 'Bavaria', 'Barcelona', 'Vatican City', 'Moscow', 'Quang Ninh', 'Kyoto', 'Wyoming', 'Ecuador', 'Tanzania', 'Alberta', 'Croatia', 'Liguria', 'Bangkok', 'Yucatan', 'Granada', 'Versailles', 'Prague', 'Vienna', 'Istanbul',
            'South Dakota', 'Nevada', 'San Francisco', 'San Francisco', 'Toronto', 'Berlin', 'Berlin', 'Prague', 'Venice', 'London', 'Vatican City', 'Florence', 'Amsterdam', 'Amsterdam', 'London', 'New York', 'New York', 'Chicago', 'Bilbao', 'Madrid',
            'St. Petersburg', 'Athens', 'Mexico City', 'Chiapas', 'Peten', 'Honduras', 'Naples', 'Naples', 'Rome', 'Cumbria', 'Orkney', 'Meath', 'Clare', 'Antrim', 'Highlands', 'Cape Town', 'Cape Town', 'Mpumalanga', 'Mpumalanga', 'Cape Town',
            'Java', 'Java', 'Java', 'Nusa Tenggara', 'Bali', 'Northern Territory', 'Queensland', 'Victoria', 'Northern Territory', 'Queensland'
        ])[floor(random() * 100) + 1] AS location
    FROM generate_series(1, 100)
) AS attractions;
INSERT INTO temp_attraction_post_ids (id) SELECT id FROM attraction_posts;


-- Insert 100 User Posts
INSERT INTO user_posts (user_id, trip_id, title, content, category)
SELECT
    (SELECT id FROM temp_user_ids ORDER BY random() LIMIT 1),
    CASE WHEN random() > 0.7 THEN (SELECT id FROM temp_user_trip_ids ORDER BY random() LIMIT 1) ELSE NULL END,
    title,
    'This is a recap of my latest adventure. From the bustling markets to the serene landscapes, it was an experience I''ll never forget. Here are some of my highlights.',
    category
FROM (
    SELECT
        (ARRAY[
            'A Culinary Journey Through Rome', 'Hiking the Inca Trail: A Guide', '10 Things You Must Do in Tokyo', 'My Solo Trip Across Southeast Asia', 'Finding the Best Street Food in Bangkok', 'Navigating the Souks of Marrakech', 'A Week in the Scottish Highlands', 'Exploring the Art Scene in Paris', 'How to Spend 48 Hours in New York', 'Family Fun in Costa Rica',
            'The Ultimate Guide to Island Hopping in Greece', 'Road Tripping Through California''s National Parks', 'What I Learned Backpacking in Vietnam', 'The Most Beautiful Beaches in Thailand', 'A Food Lover''s Guide to Mexico City', 'Chasing Waterfalls in Iceland', 'An Unforgettable Safari in Kenya', 'Getting Lost in the Streets of Venice', 'The Best Photo Spots in Kyoto', 'Surviving the Crowds at the Grand Canyon',
            'Budget Travel Tips for Eastern Europe', 'Luxury for Less in Bali', 'A Guide to New Zealand''s Great Walks', 'The Perfect Itinerary for a Week in Spain', 'Discovering the Hidden Gems of Portugal', 'My Favorite Cafes in Copenhagen', 'How to See the Best of London in 3 Days', 'A Winter Wonderland in the Canadian Rockies', 'The Cultural Richness of India''s Golden Triangle', 'What to Pack for a Trip to Egypt',
            'The Thrill of Patagonia: A Hiker''s Diary', 'Relaxing on the Amalfi Coast', 'The Ancient Wonders of Jordan', 'A Weekend Getaway to Dublin', 'My Experience on a Norwegian Fjord Cruise', 'The Magic of Cherry Blossom Season in Japan', 'Volunteering with Elephants in Thailand', 'The Best Museums in Berlin', 'A Backpacker''s Guide to South America', 'How to Plan the Perfect Honeymoon in the Maldives',
            'Exploring the History of Athens', 'A Guide to the Christmas Markets in Germany', 'The Most Instagrammable Spots in Morocco', 'My First Time Visiting Africa', 'The Colors of Cuba', 'A Surfer''s Paradise in the Philippines', 'The Underrated Beauty of Sri Lanka', 'A Train Journey Across Switzerland', 'The Ultimate Food Tour of Seoul', 'Why Australia Should Be Your Next Destination',
            'Trekking to Everest Base Camp', 'A Week of Silence: Vipassana in India', 'The Best Dive Spots in the Red Sea', 'Sailing the Whitsunday Islands', 'How to Travel Japan on a Budget', 'Exploring the Ancient City of Petra', 'My Top 5 Experiences in South Africa', 'The Magic of the Galapagos Islands', 'A Guide to Eating Your Way Through Italy', 'Van Life in the American West',
            'The Most Epic Hikes in Switzerland', 'What No One Tells You About Visiting the Pyramids', 'A Digital Nomad''s Guide to Lisbon', 'The Best Rooftop Bars in Bangkok', 'How to Survive a Long-Haul Flight', 'The Ultimate Packing List for Backpackers', 'The Beauty of the Scottish NC500 Route', 'A First-Timer''s Guide to New Orleans', 'The Best Day Trips from Amsterdam', 'Why You Should Visit Colombia Now',
            'A Journey on the Trans-Siberian Railway', 'The Street Art of Melbourne', 'The Best Wineries to Visit in Tuscany', 'A Guide to the Isle of Skye', 'What to See and Do in Budapest', 'The Perfect Weekend in Edinburgh', 'A Foodie''s Guide to San Sebastian', 'The Northern Lights: A Photographer''s Dream', 'Exploring the Temples of Angkor Wat', 'How to Spend a Layover in Dubai'
        ])[floor(random() * 100) + 1] as title,
        (ARRAY[
            'Food', 'Adventure', 'Travel Tips', 'Adventure', 'Food', 'Culture', 'Nature', 'Art', 'Travel Tips', 'Family', 'Travel Tips', 'Nature', 'Adventure', 'Nature', 'Food', 'Nature', 'Adventure', 'Culture', 'Travel Tips', 'Nature', 'Travel Tips', 'Luxury', 'Adventure', 'Travel Tips', 'Culture', 'Food', 'Travel Tips', 'Nature', 'Culture', 'Travel Tips',
            'Adventure', 'Relaxation', 'History', 'Culture', 'Nature', 'History', 'Adventure', 'Art', 'Adventure', 'Luxury', 'History', 'Culture', 'Travel Tips', 'Adventure', 'Culture', 'Nature', 'Nature', 'Nature', 'Food', 'Travel Tips', 'Adventure', 'Wellness', 'Adventure', 'Nature', 'Travel Tips', 'History', 'Travel Tips', 'Nature', 'Food', 'Adventure',
            'Nature', 'Travel Tips', 'Travel Tips', 'Food', 'Travel Tips', 'Travel Tips', 'Nature', 'Travel Tips', 'Travel Tips', 'Travel Tips', 'Adventure', 'Art', 'Food', 'Nature', 'Travel Tips', 'Culture', 'Food', 'Nature', 'History', 'Travel Tips'
        ])[floor(random() * 100) + 1] as category
    FROM generate_series(1, 100)
) AS user_posts;
INSERT INTO temp_user_post_ids (id) SELECT id FROM user_posts;


-- Insert Photos for each Attraction Post (1 per post)
INSERT INTO attraction_post_photos (post_id, image_url, caption)
SELECT
    id,
    '/images/attractions/attraction_post' || (ROW_NUMBER() OVER (ORDER BY id)) || '.jpg',
    'A beautiful shot of the landmark.'
FROM temp_attraction_post_ids;


-- Insert Photos for each User Post (1 per post)
INSERT INTO user_post_photos (post_id, image_url, caption)
SELECT
    id,
    '/images/posts/user_post' || (ROW_NUMBER() OVER (ORDER BY id)) || '.jpg',
    'A photo from my trip!'
FROM temp_user_post_ids;


-- Insert Flights for each Tour (1 to 3 per tour)
INSERT INTO tour_flights (tour_id, airline, flight_number, price_usd, departure_airport, arrival_airport)
SELECT
    id,
    'Global Airways',
    'GA' || (1000 + (ROW_NUMBER() OVER (ORDER BY id)) * 2),
    450.00,
    'JFK',
    'LHR'
FROM temp_tour_ids
UNION ALL
SELECT
    id,
    'Horizon Jet',
    'HJ' || (2000 + (ROW_NUMBER() OVER (ORDER BY id)) * 2),
    500.00,
    'LHR',
    'JFK'
FROM temp_tour_ids;


-- Insert Accommodations for each Tour (1 to 2 per tour)
INSERT INTO tour_accommodations (tour_id, name, type, rating, price_per_night_usd, address)
SELECT
    id,
    'The ' || (ARRAY['Grand', 'Plaza', 'Royal', 'City Center', 'Park View'])[floor(random() * 5) + 1] || ' Hotel',
    'hotel',
    ROUND((random() * 2 + 3)::numeric, 1),
    (floor(random() * 200) + 150)::numeric,
    (100 + floor(random() * 900))::text || ' Main Street, Big City'
FROM temp_tour_ids
UNION ALL
SELECT
    id,
    'The Cozy ' || (ARRAY['Inn', 'Guesthouse', 'Lodge', 'B&B', 'Hostel'])[floor(random() * 5) + 1],
    (ARRAY['guesthouse', 'hostel'])[floor(random() * 2) + 1],
    ROUND((random() * 1.5 + 3)::numeric, 1),
    (floor(random() * 80) + 70)::numeric,
    (200 + floor(random() * 800))::text || ' River Road, Old Town'
FROM temp_tour_ids WHERE random() > 0.5;


-- Insert 100 Tour Reviews
INSERT INTO tour_reviews (user_id, tour_id, rating, content)
SELECT
    (SELECT id FROM temp_user_ids ORDER BY random() LIMIT 1),
    (SELECT id FROM temp_tour_ids ORDER BY random() LIMIT 1),
    (floor(random() * 3) + 3)::int,
    (ARRAY[
        'An absolutely unforgettable experience! The guide was knowledgeable and friendly.', 'Well-organized tour with a great itinerary. Saw everything we wanted to and more.', 'A fantastic trip. The accommodations were excellent and everything ran smoothly.', 'I would highly recommend this tour to anyone. It exceeded all my expectations.', 'Good value for the price. The pacing was a bit fast, but we covered a lot of ground.',
        'The trip of a lifetime! Every detail was perfectly planned.', 'Our tour guide was the best, full of interesting stories and facts.', 'A truly immersive cultural experience. Loved every minute of it.', 'This tour is a must-do. The sights were breathtaking.', 'A bit disorganized at times, but the destinations made it worth it.'
    ])[floor(random() * 10) + 1]
FROM generate_series(1, 100);


-- Insert 100 User Post Comments
INSERT INTO user_post_comments (user_id, post_id, content)
SELECT
    (SELECT id FROM temp_user_ids ORDER BY random() LIMIT 1),
    (SELECT id FROM temp_user_post_ids ORDER BY random() LIMIT 1),
    (ARRAY[
        'Great post, this is so helpful for planning my own trip!', 'Your photos are stunning! Looks like you had an amazing time.', 'Thanks for sharing these tips. I''ll definitely keep them in mind.', 'This makes me want to book a flight right now!', 'I had a similar experience when I visited. Such a beautiful place.',
        'Amazing write-up! I felt like I was there with you.', 'I''m adding this to my bucket list immediately.', 'This is some of the best travel advice I''ve read. Thank you!', 'Wow, what an adventure! Thanks for the inspiration.', 'Could you share more about your budget for this trip?'
    ])[floor(random() * 10) + 1]
FROM generate_series(1, 100);


-- Insert 100 User Favorites (randomly across tours, posts, attractions)
INSERT INTO user_favorites (user_id, item_id, item_type)
SELECT
    (SELECT id FROM temp_user_ids ORDER BY random() LIMIT 1),
    item_id,
    item_type
FROM (
    SELECT id AS item_id, 'tour' AS item_type FROM temp_tour_ids
    UNION ALL
    SELECT id AS item_id, 'post' AS item_type FROM temp_user_post_ids
    UNION ALL
    SELECT id AS item_id, 'attraction' AS item_type FROM temp_attraction_post_ids
) AS all_items
ORDER BY random()
LIMIT 100;


-- Clean up temp tables
DROP TABLE temp_user_ids;
DROP TABLE temp_tour_ids;
DROP TABLE temp_user_trip_ids;
DROP TABLE temp_attraction_post_ids;
DROP TABLE temp_user_post_ids;

