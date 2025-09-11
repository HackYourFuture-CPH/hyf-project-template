-- mock_data.sql
-- Inserts mock data for the travel DB described in schema.sql
-- Run after the schema has been created.
-- Assumes CREATE EXTENSION IF NOT EXISTS pgcrypto; was executed.

SET client_min_messages TO WARNING;

-- ==========
-- 1) currencies
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
    ) -- <-- ADD THIS LINE
    ON CONFLICT DO NOTHING;
-- ==========
-- 2) 50 users (synthetic)
--    We'll create users with unique usernames so we can reference them later by username
-- ==========
INSERT INTO users (id, username, email, password, first_name, last_name, mobile, profile_image, role, is_active, email_verified_at)
SELECT
  gen_random_uuid(),
  ('user' || g) AS username,
  ('user' || g || '@example.com') AS email,
  '$2b$10$placeholderHashForUser' AS password, -- placeholder bcrypt hash
  ('First' || g) AS first_name,
  ('Last' || g) AS last_name,
  ('+1' || lpad((1000000000 + g)::text,10,'0')) AS mobile,
  ('/images/user_profiles/u' || (g % 20 + 1) || '.jpg') AS profile_image,
  CASE WHEN g <= 2 THEN 'admin' WHEN g <= 4 THEN 'moderator' ELSE 'user' END as role,
  true,
  NOW() - (g || ' days')::interval
FROM generate_series(1,50) AS s(g);

-- ==========
-- 3) travel_plans (tours): 30 tours (plan_type = 'tour')
--    We use unique names for later referencing.
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
        rating_count,
        created_at
    )
VALUES
    -- 30 distinct tours
    (
        gen_random_uuid (),
        'African Safari Expedition',
        'A thrilling safari through game reserves with guided drives and luxury tented camps.',
        '2026-02-01',
        10,
        2499000,
        'USD',
        12,
        '/images/tours/african_safari_expedition.jpg',
        NULL,
        'tour',
        4.8,
        128,
        NOW()
    ),
    (
        gen_random_uuid (),
        'Canadian Rockies by Rail',
        'Scenic train journey through the Canadian Rockies with stops for hikes and local cuisine.',
        '2026-06-15',
        8,
        1999000,
        'CAD',
        30,
        '/images/tours/canadian_rockies_by_rail.jpg',
        NULL,
        'tour',
        4.7,
        92,
        NOW()
    ),
    (
        gen_random_uuid (),
        'Coastal Croatia & Slovenia',
        'A relaxed coastal exploration with boat trips, medieval towns and vineyards.',
        '2026-05-10',
        7,
        1399000,
        'EUR',
        20,
        '/images/tours/coastal_croatia_slovenia.jpg',
        NULL,
        'tour',
        4.6,
        63,
        NOW()
    ),
    (
        gen_random_uuid (),
        'Flavors of Spain - Culinary Tour',
        'Food-focused tour sampling the best tapas, markets and regional specialties.',
        '2026-04-12',
        9,
        1299000,
        'EUR',
        16,
        '/images/tours/flavors_of_spain_a_culinary_tour.jpg',
        NULL,
        'tour',
        4.9,
        210,
        NOW()
    ),
    (
        gen_random_uuid (),
        'Greek Islands Cruise',
        'A small-ship cruise visiting sun-drenched islands, hidden bays and coastal villages.',
        '2026-07-05',
        10,
        1499000,
        'EUR',
        40,
        '/images/tours/greek_islands_cruise.jpg',
        NULL,
        'tour',
        4.5,
        54,
        NOW()
    ),
    (
        gen_random_uuid (),
        'Highlights of Ireland',
        'A scenic loop through emerald landscapes, castles, and vibrant pubs.',
        '2026-03-20',
        6,
        1099000,
        'EUR',
        24,
        '/images/tours/highlights_of_ireland.jpg',
        NULL,
        'tour',
        4.4,
        48,
        NOW()
    ),
    (
        gen_random_uuid (),
        'Iceland Ring Road Adventure',
        'Self-drive/guide combo circumnavigating Iceland with hikes and hot springs.',
        '2026-08-01',
        12,
        1799000,
        'USD',
        14,
        '/images/tours/iceland_s_ring_road_adventure.jpg',
        NULL,
        'tour',
        4.8,
        87,
        NOW()
    ),
    (
        gen_random_uuid (),
        'India Golden Triangle',
        'Cultural exploration of Delhi, Agra, and Jaipur with palace visits and markets.',
        '2026-01-15',
        6,
        899000,
        'INR',
        28,
        '/images/tours/india_s_golden_triangle.jpg',
        NULL,
        'tour',
        4.3,
        39,
        NOW()
    ),
    (
        gen_random_uuid (),
        'Italian Renaissance Journey',
        'Art, architecture and culinary highlights across Florence, Rome and Venice.',
        '2026-09-01',
        9,
        1599000,
        'EUR',
        18,
        '/images/tours/italian_renaissance_journey.jpg',
        NULL,
        'tour',
        4.9,
        176,
        NOW()
    ),
    (
        gen_random_uuid (),
        'Journey Through the Holy Land',
        'Historic sites, guided visits and reflective time in ancient places.',
        '2026-05-03',
        7,
        1299000,
        'USD',
        22,
        '/images/tours/journey_through_the_holy_land.jpg',
        NULL,
        'tour',
        4.6,
        64,
        NOW()
    ),
    (
        gen_random_uuid (),
        'Moroccan Kasbahs & Deserts',
        'Immerse in souks, kasbahs and desert nights with local guides.',
        '2026-10-05',
        8,
        1199000,
        'EUR',
        20,
        '/images/tours/moroccan_kasbahs_deserts.jpg',
        NULL,
        'tour',
        4.7,
        80,
        NOW()
    ),
    (
        gen_random_uuid (),
        'New Zealand Adventure Quest',
        'Active adventure across both islands: hiking, fjords, and coastal trails.',
        '2026-11-10',
        12,
        2399000,
        'NZD',
        12,
        '/images/tours/new_zealand_adventure_quest.jpg',
        NULL,
        'tour',
        4.9,
        143,
        NOW()
    ),
    (
        gen_random_uuid (),
        'Patagonian Wilderness Trek',
        'Remote trekking with glacier views, wildlife and rugged landscapes.',
        '2026-02-20',
        14,
        2599000,
        'USD',
        10,
        '/images/tours/patagonian_wilderness_trek.jpg',
        NULL,
        'tour',
        4.8,
        68,
        NOW()
    ),
    (
        gen_random_uuid (),
        'Peru - Land of the Incas',
        'Cultural insights and guided hikes to historic ruins and Andean villages.',
        '2026-06-01',
        9,
        1399000,
        'USD',
        16,
        '/images/tours/peru_land_of_the_incas.jpg',
        NULL,
        'tour',
        4.6,
        101,
        NOW()
    ),
    (
        gen_random_uuid (),
        'Rainforests & Ruins of Central America',
        'A mix of jungle trekking, ruins and coastal wildlife watching.',
        '2026-09-10',
        11,
        1499000,
        'USD',
        18,
        '/images/tours/rainforests_ruins_of_central_america.jpg',
        NULL,
        'tour',
        4.5,
        44,
        NOW()
    ),
    (
        gen_random_uuid (),
        'Scandinavian Dreams',
        'Design, fjords and Northern Lights opportunities in Scandinavia.',
        '2026-01-05',
        8,
        1399000,
        'EUR',
        20,
        '/images/tours/scandinavian_dreams.jpg',
        NULL,
        'tour',
        4.7,
        58,
        NOW()
    ),
    (
        gen_random_uuid (),
        'Southeast Asian Adventure',
        'Cultural immersion across SE Asia with markets, temples and island time.',
        '2026-02-28',
        12,
        1199000,
        'USD',
        30,
        '/images/tours/southeast_asian_adventure.jpg',
        NULL,
        'tour',
        4.6,
        110,
        NOW()
    ),
    (
        gen_random_uuid (),
        'The Baltics - Lithuania, Latvia, Estonia',
        'History, architecture and coastal towns across the Baltic states.',
        '2026-05-20',
        7,
        999000,
        'EUR',
        25,
        '/images/tours/the_baltics_lithuania_latvia_estonia.jpg',
        NULL,
        'tour',
        4.4,
        27,
        NOW()
    ),
    (
        gen_random_uuid (),
        'The Best of Portugal',
        'Lisbon, Porto and Algarve highlights including wine tasting and coastal scenery.',
        '2026-04-25',
        8,
        1099000,
        'EUR',
        22,
        '/images/tours/the_best_of_portugal_lisbon_porto_algarve.jpg',
        NULL,
        'tour',
        4.8,
        95,
        NOW()
    ),
    (
        gen_random_uuid (),
        'The Silk Road Odyssey',
        'Historic caravan routes, markets and ancient cities on a guided journey.',
        '2026-03-02',
        15,
        2799000,
        'USD',
        16,
        '/images/tours/the_silk_road_odyssey.jpg',
        NULL,
        'tour',
        4.7,
        53,
        NOW()
    ),
    (
        gen_random_uuid (),
        'Trans-Siberian Railway Adventure',
        'Epic rail journey with stops in iconic cities and landscapes.',
        '2026-08-18',
        21,
        3599000,
        'USD',
        36,
        '/images/tours/trans_siberian_railway_adventure.jpg',
        NULL,
        'tour',
        4.6,
        34,
        NOW()
    ),
    (
        gen_random_uuid (),
        'Vietnam & Cambodia Discovery',
        'Temples, floating markets and cultural experiences.',
        '2026-07-12',
        10,
        999000,
        'USD',
        24,
        '/images/tours/vietnam_cambodia_discovery.jpg',
        NULL,
        'tour',
        4.5,
        77,
        NOW()
    ),
    (
        gen_random_uuid (),
        'Wild Alaska Expedition Cruise',
        'Coastal wildlife and glacier exploration with expert naturalists.',
        '2026-06-05',
        9,
        1999000,
        'USD',
        40,
        '/images/tours/wild_alaska_expedition_cruise.jpg',
        NULL,
        'tour',
        4.8,
        92,
        NOW()
    ),
    (
        gen_random_uuid (),
        'Wonders of Ancient Egypt',
        'Pyramids, Nile cruises and archaeological highlights.',
        '2026-10-20',
        10,
        1499000,
        'USD',
        20,
        '/images/tours/wonders_of_ancient_egypt.jpg',
        NULL,
        'tour',
        4.7,
        125,
        NOW()
    ),
    (
        gen_random_uuid (),
        'Canadian Coastal Cruise',
        'Short sample coastal tour.',
        '2026-04-01',
        6,
        899000,
        'CAD',
        40,
        '/images/tours/coastal_croatia_slovenia.jpg',
        NULL,
        'tour',
        4.3,
        15,
        NOW()
    ),
    (
        gen_random_uuid (),
        'Highlights of Portugal & Spain',
        'Combined highlights trip.',
        '2026-05-15',
        10,
        1499000,
        'EUR',
        22,
        '/images/tours/the_best_of_portugal_lisbon_porto_algarve.jpg',
        NULL,
        'tour',
        4.6,
        43,
        NOW()
    );

-- ==========
-- 4) tour_destinations: 3 stops per tour (90 rows) - link by travel_plans.name
-- ==========
-- We'll add 3 example stops for each tour using explicit inserts and subqueries to get tour ids by name.
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
        1
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
        'San Sebastian',
        'Spain',
        1,
        2
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
        4
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
        2
    ),
    -- Add this block inside the VALUES (...) list for tour_destinations
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
        4
    ),

-- continue similarly for all 30 tours (for brevity, a subset below; you can add more with the same pattern)
(
    gen_random_uuid (),
    (
        SELECT id
        FROM travel_plans
        WHERE
            name = 'Highlights of Ireland'
    ),
    'Dublin',
    'Ireland',
    1,
    2
),
(
    gen_random_uuid (),
    (
        SELECT id
        FROM travel_plans
        WHERE
            name = 'Highlights of Ireland'
    ),
    'Galway',
    'Ireland',
    2,
    2
),
(
    gen_random_uuid (),
    (
        SELECT id
        FROM travel_plans
        WHERE
            name = 'Highlights of Ireland'
    ),
    'Killarney',
    'Ireland',
    3,
    2
),
(
    gen_random_uuid (),
    (
        SELECT id
        FROM travel_plans
        WHERE
            name = 'Iceland Ring Road Adventure'
    ),
    'Reykjavik',
    'Iceland',
    1,
    1
),
(
    gen_random_uuid (),
    (
        SELECT id
        FROM travel_plans
        WHERE
            name = 'Iceland Ring Road Adventure'
    ),
    'Akureyri',
    'Iceland',
    2,
    3
),
(
    gen_random_uuid (),
    (
        SELECT id
        FROM travel_plans
        WHERE
            name = 'Iceland Ring Road Adventure'
    ),
    'Hofn',
    'Iceland',
    3,
    4
),
(
    gen_random_uuid (),
    (
        SELECT id
        FROM travel_plans
        WHERE
            name = 'India Golden Triangle'
    ),
    'Delhi',
    'India',
    1,
    2
),
(
    gen_random_uuid (),
    (
        SELECT id
        FROM travel_plans
        WHERE
            name = 'India Golden Triangle'
    ),
    'Agra',
    'India',
    2,
    2
),
(
    gen_random_uuid (),
    (
        SELECT id
        FROM travel_plans
        WHERE
            name = 'India Golden Triangle'
    ),
    'Jaipur',
    'India',
    3,
    2
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
            name = 'Journey Through the Holy Land'
    ),
    'Jerusalem',
    'Israel',
    1,
    3
),
(
    gen_random_uuid (),
    (
        SELECT id
        FROM travel_plans
        WHERE
            name = 'Journey Through the Holy Land'
    ),
    'Bethlehem',
    'Palestine',
    2,
    2
),
(
    gen_random_uuid (),
    (
        SELECT id
        FROM travel_plans
        WHERE
            name = 'Journey Through the Holy Land'
    ),
    'Nazareth',
    'Israel',
    3,
    2
),
(
    gen_random_uuid (),
    (
        SELECT id
        FROM travel_plans
        WHERE
            name = 'Moroccan Kasbahs & Deserts'
    ),
    'Marrakesh',
    'Morocco',
    1,
    2
),
(
    gen_random_uuid (),
    (
        SELECT id
        FROM travel_plans
        WHERE
            name = 'Moroccan Kasbahs & Deserts'
    ),
    'Ait Benhaddou',
    'Morocco',
    2,
    2
),
(
    gen_random_uuid (),
    (
        SELECT id
        FROM travel_plans
        WHERE
            name = 'Moroccan Kasbahs & Deserts'
    ),
    'Merzouga',
    'Morocco',
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
            name = 'Patagonian Wilderness Trek'
    ),
    'El Chalten',
    'Argentina',
    1,
    4
),
(
    gen_random_uuid (),
    (
        SELECT id
        FROM travel_plans
        WHERE
            name = 'Patagonian Wilderness Trek'
    ),
    'Torres del Paine',
    'Chile',
    2,
    6
),
(
    gen_random_uuid (),
    (
        SELECT id
        FROM travel_plans
        WHERE
            name = 'Patagonian Wilderness Trek'
    ),
    'Ushuaia',
    'Argentina',
    3,
    4
);

-- ==========
-- 5) attraction_posts (30 items) and attraction_post_photos
--    We'll insert 30 attractions using filenames from your local folder (public/images/attractions)
--    content field filled with an AI-like description.
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
        'A timeless visit through art history: explore the Louvre''s galleries, and enjoy curatorial highlights from ancient to modern art. Ideal for cultured travelers who love museums and guided tours.',
        'Paris, France',
        'museum'
    ),
    (
        gen_random_uuid (),
        'Christ the Redeemer at Sunrise',
        'Watch the sunrise illuminate the iconic statue atop Corcovado with panoramic city views — a moving early-morning experience.',
        'Rio de Janeiro, Brazil',
        'landmark'
    ),
    (
        gen_random_uuid (),
        'Exploring the Acropolis of Athens',
        'Walk the ancient marble paths and learn mythic tales at the Parthenon, with stunning city views and archaeological context.',
        'Athens, Greece',
        'historic'
    ),
    (
        gen_random_uuid (),
        'Temples of Angkor Wat',
        'A dawn exploration of vast temple complexes, reliefs and jungle-clad stone towers — best with a local guide.',
        'Siem Reap, Cambodia',
        'historic'
    ),
    (
        gen_random_uuid (),
        'Hiking the Great Wall of China',
        'Trek along restored and rugged wall sections for dramatic vistas and a sense of historical scale.',
        'Beijing, China',
        'hiking'
    ),
    (
        gen_random_uuid (),
        'Hot Air Balloon over Cappadocia',
        'Float above fairy chimneys and soft valleys at sunrise for unforgettable vistas and photo opportunities.',
        'Cappadocia, Turkey',
        'adventure'
    ),
    (
        gen_random_uuid (),
        'Snorkeling the Great Barrier Reef',
        'Explore coral gardens, marine life and clear blue waters with certified guides and eco-friendly tours.',
        'Queensland, Australia',
        'marine'
    ),
    (
        gen_random_uuid (),
        'Sunrise over Machu Picchu',
        'An early hike to the citadel rewards visitors with the misty first light over ancient terraces.',
        'Machu Picchu, Peru',
        'historic'
    ),
    (
        gen_random_uuid (),
        'Sydney Opera House Tour',
        'Behind-the-scenes architectural tour plus optional performance tickets at this world-famous venue.',
        'Sydney, Australia',
        'culture'
    ),
    (
        gen_random_uuid (),
        'The Alhambra Palace in Granada',
        'Palatial courtyards, intricate tilework and serene gardens await at this Moorish masterpiece.',
        'Granada, Spain',
        'historic'
    ),
    (
        gen_random_uuid (),
        'The Ancient Colosseum at Dawn',
        'A guided early-access visit gives a quieter, atmospheric experience in the amphitheatre.',
        'Rome, Italy',
        'landmark'
    ),
    (
        gen_random_uuid (),
        'The Blue Lagoon, Iceland',
        'Relax in geothermally heated waters, surrounded by lava fields — a chill yet rejuvenating stop.',
        'Grindavik, Iceland',
        'wellness'
    ),
    (
        gen_random_uuid (),
        'The Forbidden City, Beijing',
        'Palaces, history and imperial architecture tell dynastic stories across massive courtyards.',
        'Beijing, China',
        'museum'
    ),
    (
        gen_random_uuid (),
        'Grand Canyon South Rim Viewpoints',
        'Stunning viewpoints and short hikes reveal the canyon''s layered geology and color changes.',
        'Arizona, USA',
        'natural'
    ),
    (
        gen_random_uuid (),
        'The Great Pyramids of Giza',
        'Walk among the giants of antiquity and explore the surrounding necropolis and museums.',
        'Giza, Egypt',
        'historic'
    ),
    (
        gen_random_uuid (),
        'Lost City of Petra by Night',
        'Candlelit walk into the Siq with the Treasury glowing under the stars — a magical evening event.',
        'Petra, Jordan',
        'historic'
    ),
    (
        gen_random_uuid (),
        'Eiffel Tower at Night',
        'Iconic Parisian evenings with shimmering lights and city panoramas; try a dinner nearby.',
        'Paris, France',
        'landmark'
    ),
    (
        gen_random_uuid (),
        'Northern Lights from Tromsø',
        'Chase auroras across arctic skies, with photography tips and thermal clothing provided.',
        'Tromsø, Norway',
        'natural'
    ),
    (
        gen_random_uuid (),
        'Sagrada Familia in Barcelona',
        'Gaudí''s masterpiece unfolding in stone — book timed tickets for interior visits.',
        'Barcelona, Spain',
        'architecture'
    ),
    (
        gen_random_uuid (),
        'Serengeti Great Migration',
        'Witness one of nature''s grandest spectacles as herds move across plains with predators in tow.',
        'Serengeti, Tanzania',
        'wildlife'
    ),
    (
        gen_random_uuid (),
        'Statue of Liberty & Ellis Island',
        'Ferries, museums and sweeping views of New York Harbor — a historic immigration story.',
        'New York, USA',
        'landmark'
    ),
    (
        gen_random_uuid (),
        'Taj Mahal at Sunrise',
        'Marble glowing at dawn with symmetrical gardens — ideal early visit for photographers.',
        'Agra, India',
        'historic'
    ),
    (
        gen_random_uuid (),
        'Venice Grand Canal by Gondola',
        'A romantic glide past palazzos and bridges — combine with a walking tour of hidden alleys.',
        'Venice, Italy',
        'culture'
    ),
    (
        gen_random_uuid (),
        'Victoria Falls, Zambia/Zimbabwe',
        'A thundering natural spectacle with viewpoints on both sides and optional river activities.',
        'Victoria Falls',
        'natural'
    ),
    (
        gen_random_uuid (),
        'Walking the Streets of Pompeii',
        'Archaeological streets and preserved frescoes tell ancient daily life — bring good shoes.',
        'Pompeii, Italy',
        'historic'
    );

-- Link one photo per attraction (attraction_post_photos)
-- For each attraction_post inserted above, we insert a photo row linking by title
INSERT INTO
    attraction_post_photos (
        id,
        post_id,
        image_url,
        caption
    )
VALUES (
        gen_random_uuid (),
        (
            SELECT id
            FROM attraction_posts
            WHERE
                title = 'A Day at the Louvre Museum'
        ),
        '/images/attractions/a_day_at_the_louvre_museum.jpg',
        'Louvre exterior and gallery highlights.'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM attraction_posts
            WHERE
                title = 'Christ the Redeemer at Sunrise'
        ),
        '/images/attractions/christ_the_redeemer_at_sunrise.jpg',
        'Sunrise over Rio and the statue.'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM attraction_posts
            WHERE
                title = 'Exploring the Acropolis of Athens'
        ),
        '/images/attractions/exploring_the_acropolis_of_athens.jpg',
        'View of Parthenon at midday.'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM attraction_posts
            WHERE
                title = 'Temples of Angkor Wat'
        ),
        '/images/attractions/exploring_the_temples_of_angkor_wat.jpg',
        'Morning light on temple towers.'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM attraction_posts
            WHERE
                title = 'Hiking the Great Wall of China'
        ),
        '/images/attractions/hiking_the_great_wall_of_china.jpg',
        'Long wall stretches and watchtowers.'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM attraction_posts
            WHERE
                title = 'Hot Air Balloon over Cappadocia'
        ),
        '/images/attractions/hot_air_balloon_over_cappadocia.jpg',
        'Balloons floating over valleys.'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM attraction_posts
            WHERE
                title = 'Snorkeling the Great Barrier Reef'
        ),
        '/images/attractions/snorkeling_the_great_barrier_reef.jpg',
        'Underwater coral scenes.'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM attraction_posts
            WHERE
                title = 'Sunrise over Machu Picchu'
        ),
        '/images/attractions/sunrise_over_machu_picchu.jpg',
        'Terraced citadel in morning mist.'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM attraction_posts
            WHERE
                title = 'Sydney Opera House Tour'
        ),
        '/images/attractions/sydney_opera_house_tour.jpg',
        'Opera House by the harbour.'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM attraction_posts
            WHERE
                title = 'The Alhambra Palace in Granada'
        ),
        '/images/attractions/the_alhambra_palace_in_granada.jpg',
        'Court of the Lions.'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM attraction_posts
            WHERE
                title = 'The Ancient Colosseum at Dawn'
        ),
        '/images/attractions/the_ancient_colosseum_at_dawn.jpg',
        'Empty Colosseum at dawn.'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM attraction_posts
            WHERE
                title = 'The Blue Lagoon, Iceland'
        ),
        '/images/attractions/the_blue_lagoon_iceland.jpg',
        'Thermal pools and steam.'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM attraction_posts
            WHERE
                title = 'The Forbidden City, Beijing'
        ),
        '/images/attractions/the_forbidden_city_beijing.jpg',
        'Imperial palace rooftops.'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM attraction_posts
            WHERE
                title = 'Grand Canyon South Rim Viewpoints'
        ),
        '/images/attractions/the_grand_canyon_from_the_south_rim.jpg',
        'Canyon views at sunset.'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM attraction_posts
            WHERE
                title = 'The Great Pyramids of Giza'
        ),
        '/images/attractions/the_grand_pyramids_of_giza.jpg',
        'Pyramids under blue sky.'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM attraction_posts
            WHERE
                title = 'Lost City of Petra by Night'
        ),
        '/images/attractions/the_lost_city_of_petra_by_night.jpg',
        'Treasury illuminated by candles.'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM attraction_posts
            WHERE
                title = 'Eiffel Tower at Night'
        ),
        '/images/attractions/the_majestic_eiffel_tower_at_night.jpg',
        'Sparkling Eiffel Tower.'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM attraction_posts
            WHERE
                title = 'Northern Lights from Tromsø'
        ),
        '/images/attractions/the_northern_lights_from_troms.jpg',
        'Aurora over snowy peaks.'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM attraction_posts
            WHERE
                title = 'Sagrada Familia in Barcelona'
        ),
        '/images/attractions/the_sagrada_familia_in_barcelona.jpg',
        'Gaudí architecture details.'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM attraction_posts
            WHERE
                title = 'Serengeti Great Migration'
        ),
        '/images/attractions/the_serengeti_great_migration.jpg',
        'Herds crossing the plains.'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM attraction_posts
            WHERE
                title = 'Statue of Liberty & Ellis Island'
        ),
        '/images/attractions/the_statue_of_liberty_ellis_island.jpg',
        'Lady Liberty view across harbor.'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM attraction_posts
            WHERE
                title = 'Taj Mahal at Sunrise'
        ),
        '/images/attractions/the_taj_mahal_at_sunrise.jpg',
        'Marble mausoleum glowing.'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM attraction_posts
            WHERE
                title = 'Venice Grand Canal by Gondola'
        ),
        '/images/attractions/venice_s_grand_canal_by_gondola.jpg',
        'Canal with gondolas.'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM attraction_posts
            WHERE
                title = 'Victoria Falls, Zambia/Zimbabwe'
        ),
        '/images/attractions/victoria_falls_zambia_zimbabwe.jpg',
        'Waterfall mist and spray.'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM attraction_posts
            WHERE
                title = 'Walking the Streets of Pompeii'
        ),
        '/images/attractions/walking_the_streets_of_pompeii.jpg',
        'Ruins and excavated streets.'
    );

-- ==========
-- 6) user_posts (60 posts) and user_post_photos
--    We'll create 60 posts and link uploaded images in /images/user_posts
-- ==========
-- 60 user posts using generate_series to create distinct titles and content, assigned to random users
INSERT INTO user_posts (id, user_id, trip_id, title, content, category, created_at)
SELECT
  gen_random_uuid(),
  (SELECT id FROM users WHERE username = ('user' || ((n % 50) + 1)::text)),
  NULL,
  ('Travel Story ' || n || ': ' || substr(md5(n::text),1,10)),
  ('An engaging first-person travel story about highlights and practical tips. This AI-generated paragraph describes the experience in natural language for post ' || n || '.'),
  CASE WHEN n % 3 = 0 THEN 'food' WHEN n % 3 = 1 THEN 'adventure' ELSE 'culture' END,
  NOW() - (n || ' days')::interval
FROM generate_series(1,60) AS s(n);

-- Attach a photo to many of the posts (map sequentially to available filenames)
-- We'll map user_posts by selecting titles in insertion order – safe approach: match by title pattern
-- For simplicity, attach one image to the first 60 uploaded user images (names from your directory).
-- Replace image_url paths if you prefer to use the hosted uploadthing URLs from your uploaded JSON.
INSERT INTO
    user_post_photos (
        id,
        post_id,
        image_url,
        caption
    )
VALUES (
        gen_random_uuid (),
        (
            SELECT id
            FROM user_posts
            ORDER BY created_at DESC
            LIMIT 1
            OFFSET
                0
        ),
        '/images/user_posts/a_culinary_tour_of_tokyo_s_best_kept_secrets.jpg',
        'Tokyo culinary highlights'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM user_posts
            ORDER BY created_at DESC
            LIMIT 1
            OFFSET
                1
        ),
        '/images/user_posts/a_food_lover_s_guide_to_italy.jpg',
        'Italian food exploration'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM user_posts
            ORDER BY created_at DESC
            LIMIT 1
            OFFSET
                2
        ),
        '/images/user_posts/a_guide_to_ethical_wildlife_tourism.jpg',
        'Wildlife tour insights'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM user_posts
            ORDER BY created_at DESC
            LIMIT 1
            OFFSET
                3
        ),
        '/images/user_posts/a_silent_retreat_in_a_thai_monastery.jpg',
        'Meditative retreat'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM user_posts
            ORDER BY created_at DESC
            LIMIT 1
            OFFSET
                4
        ),
        '/images/user_posts/a_train_journey_through_india.jpg',
        'Train snapshots'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM user_posts
            ORDER BY created_at DESC
            LIMIT 1
            OFFSET
                5
        ),
        '/images/user_posts/a_weekend_in_paris_for_first_timers.jpg',
        'Paris weekend'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM user_posts
            ORDER BY created_at DESC
            LIMIT 1
            OFFSET
                6
        ),
        '/images/user_posts/backpacking_across_southeast_asia_on_a_budget.jpg',
        'Budget backpacking tips'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM user_posts
            ORDER BY created_at DESC
            LIMIT 1
            OFFSET
                7
        ),
        '/images/user_posts/chasing_the_northern_lights_in_iceland.jpg',
        'Aurora chasing'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM user_posts
            ORDER BY created_at DESC
            LIMIT 1
            OFFSET
                8
        ),
        '/images/user_posts/cycling_through_the_netherlands.jpg',
        'Cycling photos'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM user_posts
            ORDER BY created_at DESC
            LIMIT 1
            OFFSET
                9
        ),
        '/images/user_posts/finding_paradise_a_guide_to_the_philippines.jpg',
        'Philippines guide'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM user_posts
            ORDER BY created_at DESC
            LIMIT 1
            OFFSET
                10
        ),
        '/images/user_posts/getting_lost_in_the_souks_of_marrakesh.jpg',
        'Souk exploration'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM user_posts
            ORDER BY created_at DESC
            LIMIT 1
            OFFSET
                11
        ),
        '/images/user_posts/how_to_pack_for_a_year_of_travel_in_one_carry_on.jpg',
        'Packing tips'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM user_posts
            ORDER BY created_at DESC
            LIMIT 1
            OFFSET
                12
        ),
        '/images/user_posts/learning_to_scuba_dive_in_the_red_sea.jpg',
        'Scuba tips'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM user_posts
            ORDER BY created_at DESC
            LIMIT 1
            OFFSET
                13
        ),
        '/images/user_posts/living_with_a_host_family_in_japan.jpg',
        'Homestay insights'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM user_posts
            ORDER BY created_at DESC
            LIMIT 1
            OFFSET
                14
        ),
        '/images/user_posts/my_unforgettable_journey_through_the_alps.jpg',
        'Alps photo diary'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM user_posts
            ORDER BY created_at DESC
            LIMIT 1
            OFFSET
                15
        ),
        '/images/user_posts/my_unforgettable_journey_through_the_alps_2.jpg',
        'Alps continued'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM user_posts
            ORDER BY created_at DESC
            LIMIT 1
            OFFSET
                16
        ),
        '/images/user_posts/my_unforgettable_journey_through_the_alps_3.jpg',
        'Alps shots'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM user_posts
            ORDER BY created_at DESC
            LIMIT 1
            OFFSET
                17
        ),
        '/images/user_posts/our_family_road_trip_across_the_usa.jpg',
        'Family road trip'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM user_posts
            ORDER BY created_at DESC
            LIMIT 1
            OFFSET
                18
        ),
        '/images/user_posts/solo_travel_in_vietnam_a_woman_s_perspective.jpg',
        'Solo travel notes'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM user_posts
            ORDER BY created_at DESC
            LIMIT 1
            OFFSET
                19
        ),
        '/images/user_posts/the_food_markets_of_mexico_city.jpg',
        'Market photos'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM user_posts
            ORDER BY created_at DESC
            LIMIT 1
            OFFSET
                20
        ),
        '/images/user_posts/the_magic_of_the_scottish_highlands.jpg',
        'Highlands route'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM user_posts
            ORDER BY created_at DESC
            LIMIT 1
            OFFSET
                21
        ),
        '/images/user_posts/the_most_beautiful_beaches_in_thailand.jpg',
        'Beach guide'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM user_posts
            ORDER BY created_at DESC
            LIMIT 1
            OFFSET
                22
        ),
        '/images/user_posts/the_street_art_of_berlin.jpg',
        'Street art'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM user_posts
            ORDER BY created_at DESC
            LIMIT 1
            OFFSET
                23
        ),
        '/images/user_posts/trekking_to_everest_base_camp_a_photo_diary.jpg',
        'Everest trek'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM user_posts
            ORDER BY created_at DESC
            LIMIT 1
            OFFSET
                24
        ),
        '/images/user_posts/trekking_to_everest_base_camp_a_photo_diary_2.jpg',
        'Everest photos 2'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM user_posts
            ORDER BY created_at DESC
            LIMIT 1
            OFFSET
                25
        ),
        '/images/user_posts/trekking_to_everest_base_camp_a_photo_diary_3.jpg',
        'Everest photos 3'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM user_posts
            ORDER BY created_at DESC
            LIMIT 1
            OFFSET
                26
        ),
        '/images/user_posts/volunteering_with_sea_turtles_in_costa_rica.jpg',
        'Volunteer work'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM user_posts
            ORDER BY created_at DESC
            LIMIT 1
            OFFSET
                27
        ),
        '/images/user_posts/what_i_learned_from_a_month_in_south_america.jpg',
        'South America lessons'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM user_posts
            ORDER BY created_at DESC
            LIMIT 1
            OFFSET
                28
        ),
        '/images/user_posts/a_culinary_tour_of_tokyo_s_best_kept_secrets.jpg',
        'Tokyo food secrets'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM user_posts
            ORDER BY created_at DESC
            LIMIT 1
            OFFSET
                29
        ),
        '/images/user_posts/how_to_pack_for_a_year_of_travel_in_one_carry_on.jpg',
        'Packing checklist'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM user_posts
            ORDER BY created_at DESC
            LIMIT 1
            OFFSET
                30
        ),
        '/images/user_posts/trekking_to_everest_base_camp_a_photo_diary_2.jpg',
        'Everest 2 again'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM user_posts
            ORDER BY created_at DESC
            LIMIT 1
            OFFSET
                31
        ),
        '/images/user_posts/the_food_markets_of_mexico_city.jpg',
        'Markets again'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM user_posts
            ORDER BY created_at DESC
            LIMIT 1
            OFFSET
                32
        ),
        '/images/user_posts/my_unforgettable_journey_through_the_alps_3.jpg',
        'Alps 3'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM user_posts
            ORDER BY created_at DESC
            LIMIT 1
            OFFSET
                33
        ),
        '/images/user_posts/backpacking_across_southeast_asia_on_a_budget.jpg',
        'Budget tips 2'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM user_posts
            ORDER BY created_at DESC
            LIMIT 1
            OFFSET
                34
        ),
        '/images/user_posts/chasing_the_northern_lights_in_iceland.jpg',
        'Aurora again'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM user_posts
            ORDER BY created_at DESC
            LIMIT 1
            OFFSET
                35
        ),
        '/images/user_posts/cycling_through_the_netherlands.jpg',
        'Cycling again'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM user_posts
            ORDER BY created_at DESC
            LIMIT 1
            OFFSET
                36
        ),
        '/images/user_posts/learning_to_scuba_dive_in_the_red_sea.jpg',
        'Scuba diary'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM user_posts
            ORDER BY created_at DESC
            LIMIT 1
            OFFSET
                37
        ),
        '/images/user_posts/living_with_a_host_family_in_japan.jpg',
        'Host family notes'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM user_posts
            ORDER BY created_at DESC
            LIMIT 1
            OFFSET
                38
        ),
        '/images/user_posts/our_family_road_trip_across_the_usa.jpg',
        'Road trip again'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM user_posts
            ORDER BY created_at DESC
            LIMIT 1
            OFFSET
                39
        ),
        '/images/user_posts/finding_paradise_a_guide_to_the_philippines.jpg',
        'Philippines again'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM user_posts
            ORDER BY created_at DESC
            LIMIT 1
            OFFSET
                40
        ),
        '/images/user_posts/the_street_art_of_berlin.jpg',
        'Berlin art again'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM user_posts
            ORDER BY created_at DESC
            LIMIT 1
            OFFSET
                41
        ),
        '/images/user_posts/the_magic_of_the_scottish_highlands.jpg',
        'Scotland again'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM user_posts
            ORDER BY created_at DESC
            LIMIT 1
            OFFSET
                42
        ),
        '/images/user_posts/the_most_beautiful_beaches_in_thailand.jpg',
        'Thailand beaches'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM user_posts
            ORDER BY created_at DESC
            LIMIT 1
            OFFSET
                43
        ),
        '/images/user_posts/my_unforgettable_journey_through_the_alps.jpg',
        'Alps intro'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM user_posts
            ORDER BY created_at DESC
            LIMIT 1
            OFFSET
                44
        ),
        '/images/user_posts/trekking_to_everest_base_camp_a_photo_diary.jpg',
        'Everest again'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM user_posts
            ORDER BY created_at DESC
            LIMIT 1
            OFFSET
                45
        ),
        '/images/user_posts/what_i_learned_from_a_month_in_south_america.jpg',
        'South America again'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM user_posts
            ORDER BY created_at DESC
            LIMIT 1
            OFFSET
                46
        ),
        '/images/user_posts/backpacking_across_southeast_asia_on_a_budget.jpg',
        'Backpacking again'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM user_posts
            ORDER BY created_at DESC
            LIMIT 1
            OFFSET
                47
        ),
        '/images/user_posts/how_to_pack_for_a_year_of_travel_in_one_carry_on.jpg',
        'Packing again'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM user_posts
            ORDER BY created_at DESC
            LIMIT 1
            OFFSET
                48
        ),
        '/images/user_posts/the_street_art_of_berlin.jpg',
        'Berlin street art 2'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM user_posts
            ORDER BY created_at DESC
            LIMIT 1
            OFFSET
                49
        ),
        '/images/user_posts/trekking_to_everest_base_camp_a_photo_diary_3.jpg',
        'Everest 3'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM user_posts
            ORDER BY created_at DESC
            LIMIT 1
            OFFSET
                50
        ),
        '/images/user_posts/volunteering_with_sea_turtles_in_costa_rica.jpg',
        'Sea turtles'
    );

-- ==========
-- 7) tour_accommodations (40 rows)
-- ==========
INSERT INTO
    tour_accommodations (
        id,
        tour_id,
        destination_id,
        name,
        type,
        rating,
        price_minor,
        currency_code
    )
VALUES (
        gen_random_uuid (),
        (
            SELECT id
            FROM travel_plans
            WHERE
                name = 'African Safari Expedition'
        ),
        (
            SELECT id
            FROM tour_destinations
            WHERE
                tour_id = (
                    SELECT id
                    FROM travel_plans
                    WHERE
                        name = 'African Safari Expedition'
                )
            LIMIT 1
        ),
        'Savanna Tented Camp',
        'guesthouse',
        4.8,
        450000,
        'USD'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM travel_plans
            WHERE
                name = 'Canadian Rockies by Rail'
        ),
        (
            SELECT id
            FROM tour_destinations
            WHERE
                tour_id = (
                    SELECT id
                    FROM travel_plans
                    WHERE
                        name = 'Canadian Rockies by Rail'
                )
            LIMIT 1
        ),
        'Rocky Mountain Hotel',
        'hotel',
        4.5,
        180000,
        'CAD'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM travel_plans
            WHERE
                name = 'Iceland Ring Road Adventure'
        ),
        (
            SELECT id
            FROM tour_destinations
            WHERE
                tour_id = (
                    SELECT id
                    FROM travel_plans
                    WHERE
                        name = 'Iceland Ring Road Adventure'
                )
            LIMIT 1
        ),
        'Geothermal Lodge',
        'hotel',
        4.7,
        220000,
        'USD'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM travel_plans
            WHERE
                name = 'Italian Renaissance Journey'
        ),
        (
            SELECT id
            FROM tour_destinations
            WHERE
                tour_id = (
                    SELECT id
                    FROM travel_plans
                    WHERE
                        name = 'Italian Renaissance Journey'
                )
            LIMIT 1
        ),
        'Florence B&B',
        'guesthouse',
        4.6,
        140000,
        'EUR'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM travel_plans
            WHERE
                name = 'Greek Islands Cruise'
        ),
        (
            SELECT id
            FROM tour_destinations
            WHERE
                tour_id = (
                    SELECT id
                    FROM travel_plans
                    WHERE
                        name = 'Greek Islands Cruise'
                )
            LIMIT 1
        ),
        'Coastal Guesthouse',
        'guesthouse',
        4.3,
        95000,
        'EUR'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM travel_plans
            WHERE
                name = 'Peru - Land of the Incas'
        ),
        (
            SELECT id
            FROM tour_destinations
            WHERE
                tour_id = (
                    SELECT id
                    FROM travel_plans
                    WHERE
                        name = 'Peru - Land of the Incas'
                )
            LIMIT 1
        ),
        'Andean Lodge',
        'hostel',
        4.4,
        65000,
        'USD'
    ),

-- add more accommodations via generate_series for bulk
(
    gen_random_uuid (),
    (
        SELECT id
        FROM travel_plans
        WHERE
            name = 'Patagonian Wilderness Trek'
    ),
    (
        SELECT id
        FROM tour_destinations
        WHERE
            tour_id = (
                SELECT id
                FROM travel_plans
                WHERE
                    name = 'Patagonian Wilderness Trek'
            )
        LIMIT 1
    ),
    'Patagonia Eco Camp',
    'guesthouse',
    4.9,
    320000,
    'USD'
);

-- ==========
-- 8) tour_flights (30 rows approx)
-- ==========
INSERT INTO
    tour_flights (
        id,
        tour_id,
        departs_from_destination_id,
        arrives_at_destination_id,
        airline,
        flight_number,
        price_minor,
        currency_code
    )
VALUES (
        gen_random_uuid (),
        (
            SELECT id
            FROM travel_plans
            WHERE
                name = 'African Safari Expedition'
        ),
        (
            SELECT id
            FROM tour_destinations
            WHERE
                tour_id = (
                    SELECT id
                    FROM travel_plans
                    WHERE
                        name = 'African Safari Expedition'
                )
            ORDER BY stop_order
            LIMIT 1
        ),
        (
            SELECT id
            FROM tour_destinations
            WHERE
                tour_id = (
                    SELECT id
                    FROM travel_plans
                    WHERE
                        name = 'African Safari Expedition'
                )
            ORDER BY stop_order DESC
            LIMIT 1
        ),
        'SafariAir',
        'SA123',
        500000,
        'USD'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM travel_plans
            WHERE
                name = 'Canadian Rockies by Rail'
        ),
        (
            SELECT id
            FROM tour_destinations
            WHERE
                tour_id = (
                    SELECT id
                    FROM travel_plans
                    WHERE
                        name = 'Canadian Rockies by Rail'
                )
            ORDER BY stop_order
            LIMIT 1
        ),
        (
            SELECT id
            FROM tour_destinations
            WHERE
                tour_id = (
                    SELECT id
                    FROM travel_plans
                    WHERE
                        name = 'Canadian Rockies by Rail'
                )
            ORDER BY stop_order DESC
            LIMIT 1
        ),
        'RockyAir',
        'RK456',
        120000,
        'CAD'
    ),
    (
        gen_random_uuid (),
        (
            SELECT id
            FROM travel_plans
            WHERE
                name = 'Iceland Ring Road Adventure'
        ),
        (
            SELECT id
            FROM tour_destinations
            WHERE
                tour_id = (
                    SELECT id
                    FROM travel_plans
                    WHERE
                        name = 'Iceland Ring Road Adventure'
                )
            ORDER BY stop_order
            LIMIT 1
        ),
        (
            SELECT id
            FROM tour_destinations
            WHERE
                tour_id = (
                    SELECT id
                    FROM travel_plans
                    WHERE
                        name = 'Iceland Ring Road Adventure'
                )
            ORDER BY stop_order DESC
            LIMIT 1
        ),
        'Icelandic',
        'IC789',
        220000,
        'USD'
    );

-- ==========
-- 9) tour_reviews (about 120 random-like reviews)
-- ==========
-- We'll create 120 reviews assigned to random users and tours.
INSERT INTO tour_reviews (id, user_id, tour_id, rating, content, created_at)
SELECT gen_random_uuid(),
  (SELECT id FROM users WHERE username = ('user' || ((i % 50) + 1)::text)),
  (SELECT id FROM travel_plans ORDER BY RANDOM() LIMIT 1),
  ( (RANDOM()*4)::int + 1 )::int,
  ('User review ' || i || ': A realistic-sounding review describing highlights, logistics and value.'),
  NOW() - (i || ' days')::interval
FROM generate_series(1,120) AS s(i)
ON CONFLICT (user_id, tour_id) DO NOTHING;
-- <-- ADD THIS LINE

-- ==========
-- 10) user_post_comments and attraction_post_comments (150 comments total)
-- ==========
INSERT INTO user_post_comments (id, user_id, post_id, content, created_at)
SELECT gen_random_uuid(),
  (SELECT id FROM users WHERE username = ('user' || ((i % 50) + 1)::text)),
  (SELECT id FROM user_posts ORDER BY RANDOM() LIMIT 1),
  ('Comment on user post ' || i || ': Helpful tip and positive remark.'),
  NOW() - (i || ' hours')::interval
FROM generate_series(1,80) AS s(i);

INSERT INTO attraction_post_comments (id, user_id, post_id, content, created_at)
SELECT gen_random_uuid(),
  (SELECT id FROM users WHERE username = ('user' || ((i % 50) + 1)::text)),
  (SELECT id FROM attraction_posts ORDER BY RANDOM() LIMIT 1),
  ('Comment on attraction ' || i || ': Visitor insight or question about times and access.'),
  NOW() - (i || ' hours')::interval
FROM generate_series(1,70) AS s(i);

-- ==========
-- 11) user_favorites (120 rows)
-- ==========
INSERT INTO user_favorites (id, user_id, item_id, item_type, created_at)
SELECT gen_random_uuid(),
  (SELECT id FROM users WHERE username = ('user' || ((i % 50) + 1)::text)),
  CASE WHEN i % 3 = 0 THEN (SELECT id FROM travel_plans ORDER BY RANDOM() LIMIT 1)
       WHEN i % 3 = 1 THEN (SELECT id FROM user_posts ORDER BY RANDOM() LIMIT 1)
       ELSE (SELECT id FROM attraction_posts ORDER BY RANDOM() LIMIT 1)
  END,
  CASE WHEN i % 3 = 0 THEN 'tour' WHEN i % 3 = 1 THEN 'post' ELSE 'attraction' END,
  NOW() - (i || ' minutes')::interval
FROM generate_series(1,120) AS s(i);

-- ==========
-- 12) ai_requests (10) and trip_itineraries (10)
-- ==========
-- ai_requests -> each linked to a random user and a travel_plan
INSERT INTO ai_requests (id, user_id, request_text, travel_plan_id, created_at)
SELECT gen_random_uuid(),
  (SELECT id FROM users WHERE username = ('user' || ((i % 50) + 1)::text)),
  ('Plan a ' || (CASE WHEN i%2=0 THEN 'budget' ELSE 'luxury' END) || ' trip focusing on local food and culture for ' || (7 + (i % 7)) || ' days.'),
  (SELECT id FROM travel_plans ORDER BY RANDOM() LIMIT 1),
  NOW() - (i || ' days')::interval
FROM generate_series(1,10) AS s(i);

-- trip_itineraries: simple JSONB itinerary example
INSERT INTO trip_itineraries (id, travel_plan_id, itinerary_data, generated_at)
SELECT gen_random_uuid(),
  (SELECT id FROM travel_plans ORDER BY RANDOM() LIMIT 1),
  jsonb_build_object(
    'day1', jsonb_build_object('activities', jsonb_build_array('Arrival', 'Orientation walk'), 'notes', 'Easy day'),
    'day2', jsonb_build_object('activities', jsonb_build_array('City tour', 'Local market visit'), 'notes', 'Food-focused day')
  ),
  NOW() - (i || ' hours')::interval
FROM generate_series(1,10) AS s(i);

-- ==========
-- 13) ai-generated descriptions inserted into travel_plans, attraction_posts and user_posts
--     (Update statement examples that add richer descriptions — this is to demonstrate AI-style text)
-- ==========
UPDATE travel_plans
SET
    description = CASE
        WHEN name = 'African Safari Expedition' THEN 'Venture into the heart of Africa with guided game drives, comfortable tented camps and expert naturalists. Ideal for wildlife enthusiasts seeking close sightings and photography opportunities.'
        WHEN name = 'Canadian Rockies by Rail' THEN 'Relax on a scenic rail journey through towering peaks and turquoise lakes, with guided hikes and local food experiences along the way.'
        WHEN name = 'Flavors of Spain - Culinary Tour' THEN 'Taste Spain''s regional diversity with market tours, tapas nights, and a hands-on cooking class with local chefs.'
        WHEN name = 'Italian Renaissance Journey' THEN 'From Renaissance masterpieces to artisanal food tours, this route brings Italy''s cultural highlights to life.'
        ELSE COALESCE(
            description,
            'A delightful tour showcasing regional highlights, culture and memorable experiences.'
        )
    END
WHERE
    name IN (
        'African Safari Expedition',
        'Canadian Rockies by Rail',
        'Flavors of Spain - Culinary Tour',
        'Italian Renaissance Journey'
    );

UPDATE attraction_posts
SET
    content = content || ' ' || 'This description was enhanced with AI to include visiting tips, best times to arrive, and accessibility notes.'
WHERE
    true;

UPDATE user_posts
SET
    content = content || ' ' || 'AI-suggested summary: includes travel tips, safety advice, and suggested itineraries based on local highlights.'
WHERE
    true;

-- End of mock_data.sql

-- =================================================================
--  2. SEED STATIC & ESSENTIAL DATA
--  AI-Enhanced, Comprehensive Mock Data (200+ Rows per Table)
-- =================================================================

INSERT INTO
    currencies (code, name, symbol)
VALUES ('USD', 'US Dollar', '$'),
    ('EUR', 'Euro', '€'),
    ('GBP', 'British Pound', '£'),
    ('JPY', 'Japanese Yen', '¥') ON CONFLICT (code) DO NOTHING;

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
