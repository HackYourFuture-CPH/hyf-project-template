-- =================================================================
--  Definitive, Content-Rich Mock Data (v7)
-- =================================================================
-- This script combines comprehensive data generation with rich,
-- unique content. It is designed to be parsed by the image downloader
-- script and populates ALL tables with a large number of records.
-- THIS VERSION FIXES THE CONTENT MISMATCH ISSUE.
-- =================================================================

DO $$
DECLARE
    -- =================================================================
    --  1. UNIQUE CONTENT DEFINITIONS
    --  Each entry is ['Title', 'Long Description']
    -- =================================================================
    tour_content TEXT[][] := ARRAY[
        ['Italian Renaissance Journey', 'Embark on a captivating journey through the heart of the Renaissance. Discover the artistic treasures of Florence, the ancient wonders of Rome, and the romantic canals of Venice. This immersive tour offers a perfect blend of history, art, and culinary delights, from private viewings of masterpieces to hands-on pasta-making classes. You''ll stay in charming, centrally located hotels and travel by high-speed train, ensuring a comfortable and seamless experience as you uncover the secrets of Italy''s most iconic cities.'],
        ['Scandinavian Dreams', 'Experience the breathtaking beauty and minimalist design of Scandinavia. This tour takes you from the vibrant, bike-friendly streets of Copenhagen to the stunning, deep-blue fjords of Norway and the chic, historic archipelago of Stockholm. You will witness majestic landscapes, explore royal palaces, and dine in world-class restaurants. Enjoy a scenic train ride through the Norwegian highlands and a relaxing cruise through Stockholm''s islands, fully immersing yourself in the tranquil and sophisticated Nordic lifestyle.'],
        ['Southeast Asian Adventure', 'Dive into the vibrant cultures and flavors of Southeast Asia. This journey will guide you through the ancient, vine-covered temples of Angkor Wat in Cambodia, the bustling, sensory-rich markets of Bangkok, and the futuristic, garden-like skyline of Singapore. You''ll sample exotic street food, interact with local communities, and relax on pristine beaches. It''s a whirlwind adventure of unforgettable tastes, sights, and sounds, designed for the curious and adventurous traveler.'],
        ['African Safari Expedition', 'Witness the majestic wildlife of Africa on an unforgettable safari adventure. Track the "Big Five" (lion, leopard, elephant, rhino, and buffalo) across the vast plains of Kenya''s Maasai Mara and Tanzania''s Serengeti. You''ll stay in luxurious lodges and tented camps, embark on daily game drives with expert guides, and experience a traditional Maasai village visit. This is a journey into the raw, untamed heart of the wild, offering unparalleled opportunities for wildlife photography and connection with nature.'],
        ['Mysteries of Ancient Japan', 'Discover the unique blend of ancient tradition and modern innovation in Japan. This tour explores the serene temples and geisha districts of Kyoto, the neon-lit, bustling metropolis of Tokyo, and the poignant historical sites of Hiroshima. You will participate in a traditional tea ceremony, learn the art of sushi making from a master chef, and travel on the world-renowned Shinkansen bullet train. It''s a deep cultural immersion into the heart and soul of Japan, past and present.'],
        ['Patagonian Wilderness Trek', 'Embark on a trek through the dramatic, windswept landscapes of Patagonia. This adventure is for the true nature lover, featuring hikes to the iconic Fitz Roy massif and the granite towers of Torres del Paine National Park. You''ll navigate past turquoise lakes, massive glaciers, and rugged mountains, staying in rustic but comfortable mountain refugios. It''s a physically demanding but immensely rewarding journey into one of the world''s last great wildernesses.'],
        ['The Silk Road Odyssey', 'Retrace the steps of ancient merchants and explorers on a modern-day Silk Road odyssey. This epic journey takes you through the heart of Central Asia, from the tiled mosques of Samarkand and Bukhara in Uzbekistan to the dramatic landscapes of Kyrgyzstan. You''ll explore bustling bazaars, ancient ruins, and sleep in traditional yurts under a canopy of stars. It''s a unique opportunity to experience a region rich in history and culture, far off the beaten path.'],
        ['Flavors of Spain: A Culinary Tour', 'Indulge your senses on a culinary journey through Spain. From the tapas bars of Barcelona to the paella masters of Valencia and the sherry bodegas of Andalusia, you will taste the very best of Spanish cuisine. This tour includes market visits, cooking classes with local chefs, and meals at both hidden gems and Michelin-starred restaurants. It''s a delicious exploration of a country where food is a celebrated art form and an integral part of life.'],
        ['Wonders of Ancient Egypt', 'Journey down the Nile and unravel the secrets of the pharaohs. This comprehensive tour takes you from the bustling markets of Cairo to the majestic Pyramids of Giza and the Valley of the Kings in Luxor. You will enjoy a multi-day Nile cruise, exploring temples like Karnak and Abu Simbel at a leisurely pace. With an expert Egyptologist as your guide, the stories of this ancient civilization will come to life before your eyes.'],
        ['Greek Islands Cruise', 'Sail the azure waters of the Aegean Sea on a classic Greek Islands cruise. Wake up to a new, stunning view each day, from the iconic blue-domed churches of Santorini to the vibrant nightlife of Mykonos and the historical richness of Crete. You''ll have plenty of time for swimming in crystal-clear coves, savoring fresh Mediterranean cuisine, and exploring charming, whitewashed villages. This is the ultimate relaxing and picturesque getaway.'],
        ['New Zealand Adventure Quest', 'For the thrill-seeker, New Zealand is the ultimate playground. This action-packed tour covers both the North and South Islands. You will hike on glaciers, kayak through the stunning Milford Sound, bungee jump in Queenstown (the adventure capital of the world), and explore the geothermal wonders of Rotorua. It''s a high-octane journey through one of the most beautiful and diverse landscapes on the planet.'],
        ['Canadian Rockies by Rail', 'Experience the awe-inspiring grandeur of the Canadian Rockies from the comfort of a luxury train. This journey takes you through a landscape of towering snow-capped peaks, pristine turquoise lakes, and vast forests. With glass-domed viewing cars, you won''t miss a moment of the breathtaking scenery. Stops in charming mountain towns like Banff and Jasper allow for wildlife viewing, gentle hikes, and soaking in hot springs. It''s a civilized way to experience the wild.'],
        ['Vietnam & Cambodia Discovery', 'A journey of history, resilience, and incredible beauty. Start in the vibrant streets of Hanoi, cruise through the mystical limestone karsts of Ha Long Bay, and delve into the poignant history of Ho Chi Minh City. Then, fly to Cambodia to explore the magnificent, sprawling temple complex of Angkor Wat. This tour is a sensory feast, from the complex flavors of the local cuisine to the welcoming smiles of the people.'],
        ['Peru: Land of the Incas', 'Explore the heart of the ancient Inca Empire on this journey through Peru. You will wander the colonial streets of Cusco, visit traditional communities in the Sacred Valley, and, of course, experience the wonder of Machu Picchu. The tour also includes a visit to the mysterious Nazca Lines and the unique floating islands of Lake Titicaca. It''s a deep dive into a country of stunning landscapes and rich, enduring culture.'],
        ['Moroccan Kasbahs & Deserts', 'Immerse yourself in the exotic sights, sounds, and smells of Morocco. Get lost in the labyrinthine souks of Marrakesh, explore ancient fortified kasbahs like Aït Benhaddou, and journey into the Sahara Desert. A highlight of the trip is a camel trek into the dunes to spend a night in a traditional Berber camp under a breathtaking canopy of stars. It''s a magical adventure straight out of a storybook.']
    ];

    attraction_content TEXT[][] := ARRAY[
        ['The Majestic Eiffel Tower at Night', 'While beautiful by day, the Eiffel Tower transforms into a breathtaking spectacle at night. Every hour on the hour, from sunset to 1 AM, the tower is adorned with a sparkling cloak of 20,000 golden lights, a dazzling display that can be seen from across Paris. For the best view, find a spot at the Trocadéro gardens. The experience of watching the city of light twinkle below from the summit is an unforgettable memory, a quintessential Parisian moment that encapsulates the romance and magic of the city.'],
        ['The Ancient Colosseum at Dawn', 'Visiting the Colosseum as the sun rises is a magical experience. The early morning light casts long, dramatic shadows across the ancient stones, highlighting the sheer scale and architectural genius of this Roman amphitheater. With fewer crowds, you can wander through the corridors and stands in relative peace, imagining the roar of the 80,000 spectators and the gladiatorial contests that once took place on its floor. It''s a poignant and powerful way to connect with the history of the Roman Empire.'],
        ['Hiking the Great Wall of China', 'Stretching for thousands of miles, the Great Wall of China is a testament to human endeavor. The best way to experience its grandeur is to hike a restored section, such as Mutianyu or Jinshanling. As you walk along the winding stone path, climbing from watchtower to watchtower, you are rewarded with panoramic views of the wall snaking across the rugged, green mountains. The sense of history is palpable, and the physical effort of the hike makes the stunning vistas all the more rewarding.'],
        ['Sunrise over Machu Picchu', 'Witnessing the first rays of sunlight strike the ancient Inca citadel of Machu Picchu is a spiritual experience. After an early morning journey, you arrive at the Sun Gate to watch as the mist slowly lifts, revealing the iconic stone structures and the dramatic peak of Huayna Picchu. The soft, golden light illuminates the terraces and temples, creating a mystical atmosphere. It''s a moment of pure awe, connecting you to the ingenuity and mystery of the Inca civilization.'],
        ['The Grand Pyramids of Giza', 'Standing before the last surviving wonder of the ancient world is a humbling experience. The Great Pyramid of Khufu, along with the pyramids of Khafre and Menkaure and the enigmatic Sphinx, have dominated the Giza plateau for over 4,500 years. Exploring the complex, you can marvel at the precision of their construction and ponder the mysteries of their purpose. For an even more memorable experience, a camel ride at sunset offers a classic perspective of these monumental tombs against the desert sky.'],
        ['Exploring the Acropolis of Athens', 'Perched high above the bustling city of Athens, the Acropolis is a symbol of Western civilization and democratic ideals. Dominated by the magnificent Parthenon, a temple dedicated to the goddess Athena, the site also includes the Erechtheion and the Propylaea. As you walk among these ancient marble structures, you are walking in the footsteps of Socrates and Pericles. The view from the top, overlooking Athens and stretching to the Aegean Sea, is as breathtaking as the history itself.'],
        ['Hot Air Balloon over Cappadocia', 'Floating in a hot air balloon over the surreal landscape of Cappadocia, Turkey, is a dreamlike experience. At sunrise, hundreds of balloons ascend into the sky, creating a vibrant mosaic against the dawn. Below, the "fairy chimneys"—unique cone-like rock formations—and ancient cave dwellings create an otherworldly panorama. The silence and the gentle drift of the balloon provide a serene and unforgettable perspective on one of the world''s most unique geological wonders.'],
        ['The Lost City of Petra by Night', 'While Petra is stunning by day, the "Petra by Night" experience is pure magic. The journey begins with a walk through the Siq, the narrow canyon entrance, which is lit by over 1,500 candles. The path opens up to the Treasury, its magnificent facade glowing in the candlelight as a traditional Bedouin musician plays. It''s an incredibly atmospheric and intimate way to experience the mystery and beauty of this ancient Nabatean city, carved directly into the rose-red cliffs.'],
        ['A Day at The Louvre Museum', 'Home to masterpieces like the Mona Lisa and the Venus de Milo, the Louvre is the world''s largest and most visited art museum. Housed in a former royal palace, its collection spans from ancient civilizations to the mid-19th century. To avoid being overwhelmed, it''s best to pick a few wings or specific works to focus on. Seeing these iconic pieces of human creativity in person is a profound experience for any art lover or history buff.'],
        ['Sydney Opera House Tour', 'Instantly recognizable by its sail-like design, the Sydney Opera House is an architectural marvel of the 20th century. While stunning from the outside, a backstage tour reveals the incredible engineering and artistic vision that brought it to life. You get to visit concert halls and theaters that are normally off-limits, learn about its controversial history, and hear stories about the famous performers who have graced its stages. It gives you a whole new appreciation for this Australian icon.'],
        ['Christ the Redeemer at Sunrise', 'Standing at the summit of Corcovado Mountain, the colossal statue of Christ the Redeemer embraces Rio de Janeiro with open arms. Taking the first cog train of the morning allows you to arrive before the major crowds and watch as the rising sun illuminates the statue and the breathtaking panorama below. You can see the entire city, from the famous beaches of Copacabana and Ipanema to Sugarloaf Mountain and Guanabara Bay. It''s a truly inspiring and unforgettable view.'],
        ['Exploring the Temples of Angkor Wat', 'Angkor Wat is the world''s largest religious monument and a breathtaking testament to the Khmer Empire. The main temple is famous for its intricate bas-reliefs and iconic lotus-like towers, but the surrounding complex is vast. Exploring other temples like the jungle-enveloped Ta Prohm (the "Tomb Raider" temple) and the enigmatic stone faces of Bayon is essential. Renting a bicycle or hiring a tuk-tuk for a few days is the best way to immerse yourself in the grandeur and mystery of this incredible UNESCO World Heritage site.'],
        ['Venice''s Grand Canal by Gondola', 'A gondola ride along the Grand Canal is the quintessential Venetian experience. As your gondolier expertly navigates the historic waterway, you''ll glide past magnificent palaces, churches, and bustling water-taxis. It’s a journey back in time, offering a unique and romantic perspective of the city''s stunning architecture. While it may seem like a tourist cliché, the quiet, water-level view of this magical floating city is an experience that truly lives up to the hype.'],
        ['The Northern Lights from Tromsø', 'Tromsø, Norway, located high above the Arctic Circle, is one of the best places on Earth to witness the Aurora Borealis. From September to April, on clear, dark nights, the sky often comes alive with ethereal, dancing curtains of green, pink, and violet light. Joining a guided "Northern Lights chase" with experts who know the best viewing spots away from city light pollution dramatically increases your chances of seeing a spectacular display of this incredible natural phenomenon.'],
        ['Walking the Streets of Pompeii', 'The eruption of Mount Vesuvius in 79 AD buried the Roman city of Pompeii under a thick blanket of ash, preserving it for centuries. Today, walking through its excavated streets is like stepping back in time. You can explore ancient villas with their vibrant frescoes still intact, see bakeries with carbonized loaves of bread in the ovens, and wander through the forum, temples, and amphitheater. It''s a haunting but fascinating glimpse into daily Roman life, frozen at a single, catastrophic moment.']
    ];

    user_post_content TEXT[][] := ARRAY[
        ['My Unforgettable Journey Through the Alps', 'There are few places on Earth that can prepare you for the sheer majesty of the Swiss Alps. For two weeks, I hiked through emerald valleys, past glacier-fed lakes of an impossible turquoise blue, and up to panoramic ridges that offered views of snow-capped giants like the Matterhorn and Eiger. The sound of cowbells was a constant, gentle companion, and the hospitality in the small mountain villages was as warm as the fondue. This trip was more than a vacation; it was a rejuvenation of the soul.'],
        ['A Culinary Tour of Tokyo''s Best Kept Secrets', 'Forget the tourist traps. The real magic of Tokyo''s food scene is found in its hidden alleyways and basement izakayas. I spent ten days on a mission to find the best, guided by locals and a healthy dose of curiosity. I discovered a tiny, six-seat ramen shop that has used the same broth recipe for fifty years, a tempura master who fries each piece to delicate perfection, and a sake bar with over a hundred varieties to sample. This is a story of flavor, tradition, and the incredible dedication of Tokyo''s culinary artisans.'],
        ['Backpacking Across Southeast Asia on a Budget', 'Many people dream of traveling through Southeast Asia, but worry about the cost. I''m here to tell you it''s not only possible, it''s an incredible adventure. For three months, with just a backpack and a strict budget, I navigated the chaos of Hanoi''s streets on a motorbike, slept in bungalows on Thai beaches for a few dollars a night, and ate some of the most delicious meals of my life from street vendors. This guide is packed with practical tips on how to manage your money without sacrificing the experience.'],
        ['Trekking to Everest Base Camp: A Photo Diary', 'The trek to Everest Base Camp is as much a mental journey as a physical one. Each day brought new challenges and even more spectacular rewards. This photo diary captures the essence of the journey: the swinging suspension bridges draped in prayer flags, the warm smiles of the Sherpa people, the impossibly high peaks of the Himalayas, and the final, emotional arrival at the foot of the world''s tallest mountain. These images tell a story of perseverance, beauty, and the humbling power of nature.'],
        ['Finding Paradise: A Guide to the Philippines', 'With over 7,000 islands, the Philippines is a paradise for beach lovers and adventure seekers. I spent a month island-hopping, and this is my guide to the best of the best. From swimming with whale sharks in Cebu and kayaking through the dramatic lagoons of El Nido to finding untouched, white-sand beaches in Siargao, I''ve compiled all the information you need to plan your own trip. Get ready for crystal-clear waters, vibrant coral reefs, and some of the friendliest people you will ever meet.'],
        ['Chasing the Northern Lights in Iceland', 'Standing under a sky alive with the dancing green and purple hues of the Aurora Borealis is a moment that defies description. My week-long trip to Iceland in the dead of winter was a hunt for this celestial phenomenon. We drove through volcanic landscapes covered in snow, relaxed in the geothermal waters of the Blue Lagoon, and each night, we would head out into the darkness, hoping for a clear sky. This post shares the story of that chase, with tips on how to maximize your chances of seeing the incredible Northern Lights.'],
        ['What I Learned from a Month in South America', 'South America is a continent of contrasts, from the arid Atacama Desert to the lush Amazon rainforest. A month-long journey through Peru and Bolivia was a profound learning experience. I learned about ancient civilizations at Machu Picchu, the resilience of the local people in the Andes, and the overwhelming beauty of the Uyuni Salt Flats. More than that, I learned about myself—about being adaptable, pushing my comfort zones, and finding beauty in simplicity. It was a trip that changed my perspective on the world.'],
        ['A Food Lover''s Guide to Italy', 'To truly know Italy, you must eat your way through it. This guide is a celebration of regional Italian cuisine. We''ll explore the rich, meaty ragùs of Bologna, the simple yet perfect pizzas of Naples, the fresh seafood of Sicily, and the creamy risottos of Milan. This is more than just a list of restaurants; it''s a journey into the heart of Italian culture, where every meal is a passionate expression of history, family, and the joy of living. Prepare to be hungry!'],
        ['Solo Travel in Vietnam: A Woman''s Perspective', 'Traveling solo as a woman can be intimidating, but Vietnam proved to be one of the most welcoming and safe destinations I''ve ever visited. This post is for any woman considering a solo trip. I''ll share my itinerary, tips on what to pack, how to navigate local transportation, and advice on staying safe while still immersing yourself in the culture. From the charming lantern-lit streets of Hoi An to the bustling energy of Ho Chi Minh City, Vietnam is an amazing place for a solo adventure.'],
        ['The Food Markets of Mexico City', 'Mexico City is a food lover''s paradise, and its heart beats in its vibrant markets. This is a visual and culinary tour of my favorites, from the sprawling La Merced to the more curated Mercado Roma. I tasted tacos al pastor sliced fresh from the trompo, sampled exotic fruits I''d never seen before, and drank smoky mezcal with local vendors. Forget the fancy restaurants; the true taste of Mexico City is right here, in the organized chaos of its incredible markets.'],
        ['Living with a Host Family in Japan', 'To truly understand a culture, you have to live it. For one month, I lived with a host family in a small town outside of Kyoto. I learned about the nuances of Japanese etiquette, helped cook traditional family meals, and participated in local festivals. It was a challenging, humbling, and incredibly rewarding experience that gave me a much deeper appreciation for Japanese culture than any hotel stay ever could. This is the story of my temporary Japanese family.'],
        ['Getting Lost in the Souks of Marrakesh', 'The medina of Marrakesh is a dizzying, intoxicating labyrinth of narrow alleyways, and the best way to experience it is to simply get lost. Let your senses guide you. Follow the scent of spices to a hidden stall, the sound of hammering to the metalworkers'' quarter, and the vibrant colors to the dye pits. This blog post is a collection of photographs and moments from my time wandering without a map, discovering the magic and beauty hidden within the chaos of the souks.'],
        ['Our Family Road Trip Across the USA', 'Packing two kids into a minivan for a cross-country road trip might sound crazy, but it was the adventure of a lifetime. We drove from New York to California, stopping at national parks, quirky roadside attractions, and small towns along the way. We saw the vastness of the Grand Canyon, listened to live jazz in New Orleans, and ate our weight in BBQ in Texas. This post is our family scrapbook, filled with tips for traveling with kids and proof that the journey is just as important as the destination.'],
        ['The Most Beautiful Beaches in Thailand', 'Thailand is famous for its beaches, but with so many to choose from, where do you start? After extensive "research" (i.e., lounging on a lot of sand), I''ve compiled my list of the absolute best. From the dramatic limestone cliffs of Railay Beach to the tranquil, turquoise waters of Koh Lipe and the party atmosphere of Phi Phi, this guide covers it all. Whether you''re looking for a secluded cove or a lively beach bar, your perfect patch of sand is in here.'],
        ['A Weekend in Paris for First-Timers', 'Paris can be overwhelming for a first-time visitor. This is my tried-and-tested itinerary for a perfect weekend that covers all the highlights without feeling rushed. We''ll visit the Louvre, see the Mona Lisa, climb the Eiffel Tower, and take a cruise on the Seine. But we''ll also make time for the simple Parisian pleasures: sipping coffee at a sidewalk café, eating a warm croissant from a local bakery, and simply strolling through the charming streets of Montmartre.']
    ];

    -- Helper data arrays
    first_names TEXT[] := ARRAY['Liam', 'Olivia', 'Noah', 'Emma', 'Oliver', 'Charlotte', 'Elijah', 'Amelia', 'James', 'Ava', 'William', 'Sophia', 'Benjamin', 'Isabella', 'Lucas', 'Mia', 'Henry', 'Evelyn', 'Theodore', 'Harper'];
    last_names TEXT[] := ARRAY['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson'];
    destinations_by_theme JSONB := '{
        "Italian Renaissance Journey": ["Rome,Italy", "Florence,Italy", "Venice,Italy"],
        "Scandinavian Dreams": ["Copenhagen,Denmark", "Oslo,Norway", "Stockholm,Sweden"],
        "Southeast Asian Adventure": ["Bangkok,Thailand", "Siem Reap,Cambodia", "Singapore,Singapore"],
        "African Safari Expedition": ["Nairobi,Kenya", "Maasai Mara,Kenya", "Serengeti,Tanzania"],
        "Mysteries of Ancient Japan": ["Tokyo,Japan", "Kyoto,Japan", "Hiroshima,Japan"],
        "Patagonian Wilderness Trek": ["El Chaltén,Argentina", "Torres del Paine,Chile"],
        "The Silk Road Odyssey": ["Samarkand,Uzbekistan", "Bukhara,Uzbekistan", "Bishkek,Kyrgyzstan"],
        "Flavors of Spain: A Culinary Tour": ["Barcelona,Spain", "Valencia,Spain", "Seville,Spain"],
        "Wonders of Ancient Egypt": ["Cairo,Egypt", "Luxor,Egypt", "Aswan,Egypt"],
        "Greek Islands Cruise": ["Athens,Greece", "Santorini,Greece", "Mykonos,Greece"],
        "New Zealand Adventure Quest": ["Queenstown,New Zealand", "Auckland,New Zealand", "Franz Josef,New Zealand"],
        "Canadian Rockies by Rail": ["Vancouver,Canada", "Banff,Canada", "Jasper,Canada"],
        "Vietnam & Cambodia Discovery": ["Hanoi,Vietnam", "Ha Long Bay,Vietnam", "Siem Reap,Cambodia"],
        "Peru: Land of the Incas": ["Cusco,Peru", "Machu Picchu,Peru", "Lima,Peru"],
        "Moroccan Kasbahs & Deserts": ["Marrakesh,Morocco", "Fes,Morocco", "Sahara Desert,Morocco"]
    }';
    review_contents TEXT[] := ARRAY['An absolutely unforgettable experience! The guide was fantastic, knowledgeable, and made the trip special.', 'A well-organized tour with a perfect itinerary. Everything ran like clockwork. Highly recommended!', 'A fantastic trip from start to finish. The accommodations were excellent and the sights were breathtaking.', 'I would recommend this tour to anyone looking for adventure. It exceeded all my expectations.', 'Good value for the price. We covered a lot of ground and saw so many incredible places.'];
    comment_contents TEXT[] := ARRAY['Great post, this is so helpful for planning my own trip!', 'Your photos are absolutely stunning! Looks like you had an amazing time.', 'Thanks for sharing these tips. I''ll definitely keep them in mind.', 'This makes me want to book a flight right now! So inspiring.', 'I had a similar experience when I visited last year. Such a beautiful place.'];
    hotel_names TEXT[] := ARRAY['Grand', 'Plaza', 'Royal', 'City Center', 'Park View', 'Riverside', 'Central', 'Imperial', 'Metropolitan'];
    hotel_types TEXT[] := ARRAY['hotel', 'hostel', 'guesthouse'];
    airlines TEXT[] := ARRAY['Global Airways', 'Horizon Jet', 'SkyLink Airlines', 'Continental Connect', 'Apex Air'];

    -- Helper variables
    fname TEXT; lname TEXT; tour_id_temp UUID; user_id_temp UUID; post_id_temp UUID; item_id_temp UUID; item_type_temp TEXT;
    dest_text TEXT; dest_parts TEXT[]; dest_array TEXT[]; num_stops INTEGER; stop_counter INTEGER;
    dep_dest_id UUID; arr_dest_id UUID;
    content_slice TEXT[];
    content_index INTEGER;
    attraction_category_temp TEXT;
BEGIN
    -- Temp tables to hold generated IDs for efficient relationship creation
    CREATE TEMP TABLE temp_user_ids (id UUID) ON COMMIT DROP;
    CREATE TEMP TABLE temp_tour_ids (id UUID) ON COMMIT DROP;
    CREATE TEMP TABLE temp_attraction_post_ids (id UUID) ON COMMIT DROP;
    CREATE TEMP TABLE temp_user_post_ids (id UUID) ON COMMIT DROP;
    CREATE TEMP TABLE temp_currency_codes (code CHAR(3)) ON COMMIT DROP;
    CREATE TEMP TABLE temp_all_favoritable_items (id UUID, type TEXT) ON COMMIT DROP;


    -- =================================================================
    --  2. SEED STATIC & ESSENTIAL DATA
    -- =================================================================
    -- Seed Currencies
    INSERT INTO currencies (code, name, symbol) VALUES ('USD', 'US Dollar', '$'), ('EUR', 'Euro', '€'), ('GBP', 'British Pound', '£'), ('JPY', 'Japanese Yen', '¥') ON CONFLICT (code) DO NOTHING;
    INSERT INTO temp_currency_codes SELECT code FROM currencies;

    -- Create dedicated Admin User
    INSERT INTO users (first_name, last_name, email, username, password, mobile, role, is_active, email_verified_at)
    VALUES ('Admin', 'User', 'admin@example.com', 'admin', '$2a$12$.mbqwDuqyUdJAtc1ixCsP.SPPKXnry2gojRzQck56wzbdvLxT8zjS', '555-0000-ADMIN', 'admin', true, NOW()) ON CONFLICT (username) DO NOTHING;


    -- =================================================================
    --  3. SEED USERS (200+)
    -- =================================================================
    FOR i IN 1..250 LOOP
        fname := first_names[floor(random() * array_length(first_names, 1)) + 1];
        lname := last_names[floor(random() * array_length(last_names, 1)) + 1];
        INSERT INTO users (username, email, password, first_name, last_name, mobile, role, is_active, email_verified_at, last_login_at)
        VALUES (LOWER(fname || lname || i), LOWER(fname || '.' || lname || i) || '@example.com', 'bcrypt_hashed_password', fname, lname, '555-' || LPAD(i::text, 7, '0'), CASE WHEN i % 50 = 0 THEN 'moderator' ELSE 'user' END, (random() > 0.1), CASE WHEN random() > 0.3 THEN NOW() - (random() * 300 || ' days')::interval ELSE NULL END, NOW() - (random() * 60 || ' days')::interval);
    END LOOP;
    INSERT INTO temp_user_ids SELECT id FROM users;


    -- =================================================================
    --  4. SEED THEMATIC TOURS AND RELATED DATA (200+)
    -- =================================================================
    FOR i IN 1..200 LOOP
        content_index := floor(random() * array_length(tour_content, 1)) + 1;
        content_slice := tour_content[content_index:content_index][1];
        dest_array := ARRAY(SELECT jsonb_array_elements_text(destinations_by_theme -> content_slice[1]));

        INSERT INTO travel_plans (name, description, start_date, duration_days, price_minor, currency_code, capacity, cover_image_url, plan_type)
        VALUES (content_slice[1], content_slice[2], '2026-01-15'::date + (i * 10 || ' days')::interval, (array_length(dest_array, 1) * 3) + 2, (floor(random() * 5000) + 2000) * 100, (SELECT code FROM temp_currency_codes ORDER BY random() LIMIT 1), floor(random() * 20) + 10, '/images/tours/placeholder.jpg', 'tour')
        RETURNING id INTO tour_id_temp;
        INSERT INTO temp_tour_ids VALUES(tour_id_temp);

        num_stops := array_length(dest_array, 1);
        FOR stop_counter IN 1..num_stops LOOP
            dest_text := dest_array[stop_counter];
            dest_parts := string_to_array(dest_text, ',');
            INSERT INTO tour_destinations (tour_id, city_name, country_name, stop_order, duration_days) VALUES (tour_id_temp, dest_parts[1], dest_parts[2], stop_counter, floor(random() * 2) + 2) RETURNING id INTO dep_dest_id;
            INSERT INTO tour_accommodations (tour_id, destination_id, name, type, rating, price_minor, currency_code) VALUES (tour_id_temp, dep_dest_id, 'The ' || hotel_names[floor(random() * array_length(hotel_names, 1)) + 1] || ' ' || dest_parts[1], hotel_types[floor(random() * array_length(hotel_types, 1)) + 1], ROUND((random() * 2 + 3)::numeric, 1), (floor(random() * 200) + 80) * 100, (SELECT code FROM temp_currency_codes ORDER BY random() LIMIT 1));
            IF stop_counter > 1 THEN
                SELECT id INTO arr_dest_id FROM tour_destinations WHERE tour_id = tour_id_temp AND stop_order = stop_counter - 1;
                INSERT INTO tour_flights (tour_id, departs_from_destination_id, arrives_at_destination_id, airline, flight_number, price_minor, currency_code) VALUES (tour_id_temp, arr_dest_id, dep_dest_id, airlines[floor(random() * array_length(airlines, 1)) + 1], 'FL' || (1000 + floor(random()*9000))::text, (floor(random()*300)+150)*100, (SELECT code FROM temp_currency_codes ORDER BY random() LIMIT 1));
            END IF;
        END LOOP;
    END LOOP;


    -- =================================================================
    --  5. SEED ATTRACTION POSTS & PHOTOS (200+)
    -- =================================================================
    FOR i IN 1..200 LOOP
        content_index := floor(random() * array_length(attraction_content, 1)) + 1;
        content_slice := attraction_content[content_index:content_index][1];
        attraction_category_temp := CASE WHEN content_slice[1] ILIKE ANY (ARRAY['%Museum%', '%Louvre%', '%Art%']) THEN 'Art & Culture' WHEN content_slice[1] ILIKE ANY (ARRAY['%Colosseum%', '%Wall%', '%Pyramids%', '%Acropolis%', '%Petra%', '%Angkor Wat%', '%Shrines%']) THEN 'History' WHEN content_slice[1] ILIKE ANY (ARRAY['%Canyon%', '%Falls%', '%Sunrise%', '%Balloon%']) THEN 'Nature' WHEN content_slice[1] ILIKE ANY (ARRAY['%Market%', '%Tasting%']) THEN 'Food' ELSE 'Landmark' END;
        
        WITH inserted AS (INSERT INTO attraction_posts(title, content, location, category) VALUES (content_slice[1], content_slice[2], 'Global', attraction_category_temp) RETURNING id)
        INSERT INTO temp_attraction_post_ids(id) SELECT id FROM inserted;
    END LOOP;
    INSERT INTO attraction_post_photos(post_id, image_url, caption) SELECT id, '/images/attractions/placeholder.jpg', 'A placeholder image.' FROM temp_attraction_post_ids;


    -- =================================================================
    --  6. SEED USER POSTS & PHOTOS (200+)
    -- =================================================================
    FOR i IN 1..250 LOOP
        content_index := floor(random() * array_length(user_post_content, 1)) + 1;
        content_slice := user_post_content[content_index:content_index][1];

        WITH inserted AS (INSERT INTO user_posts(user_id, title, content, category) VALUES ((SELECT id FROM temp_user_ids ORDER BY random() LIMIT 1), content_slice[1], content_slice[2], CASE WHEN random() > 0.5 THEN 'Adventure' ELSE 'Culinary' END) RETURNING id)
        INSERT INTO temp_user_post_ids(id) SELECT id FROM inserted;
    END LOOP;
    INSERT INTO user_post_photos(post_id, image_url, caption) SELECT id, '/images/posts/placeholder.jpg', 'A placeholder image.' FROM temp_user_post_ids;


    -- =================================================================
    --  7. SEED TOUR REVIEWS (300+) & UPDATE TOUR RATINGS
    -- =================================================================
    FOR i IN 1..300 LOOP
        user_id_temp := (SELECT id FROM temp_user_ids ORDER BY random() LIMIT 1);
        tour_id_temp := (SELECT id FROM temp_tour_ids ORDER BY random() LIMIT 1);
        INSERT INTO tour_reviews(user_id, tour_id, rating, content) VALUES (user_id_temp, tour_id_temp, (floor(random() * 3) + 3)::int, review_contents[floor(random() * array_length(review_contents, 1)) + 1]) ON CONFLICT (user_id, tour_id) DO NOTHING;
    END LOOP;

    UPDATE travel_plans SET rating_count = sub.count, rating = sub.avg_rating FROM (SELECT tour_id, COUNT(*) as count, AVG(rating) as avg_rating FROM tour_reviews GROUP BY tour_id) AS sub WHERE id = sub.tour_id;


    -- =================================================================
    --  8. SEED USER POST & ATTRACTION COMMENTS (500+)
    -- =================================================================
    FOR i IN 1..300 LOOP
        INSERT INTO user_post_comments(user_id, post_id, content) VALUES ((SELECT id FROM temp_user_ids ORDER BY random() LIMIT 1), (SELECT id FROM temp_user_post_ids ORDER BY random() LIMIT 1), comment_contents[floor(random() * array_length(comment_contents, 1)) + 1]);
    END LOOP;
    FOR i IN 1..200 LOOP
        INSERT INTO attraction_post_comments(user_id, post_id, content) VALUES ((SELECT id FROM temp_user_ids ORDER BY random() LIMIT 1), (SELECT id FROM temp_attraction_post_ids ORDER BY random() LIMIT 1), comment_contents[floor(random() * array_length(comment_contents, 1)) + 1]);
    END LOOP;


    -- =================================================================
    --  9. SEED USER FAVORITES (400+)
    -- =================================================================
    INSERT INTO temp_all_favoritable_items (id, type) SELECT id, 'tour' FROM temp_tour_ids;
    INSERT INTO temp_all_favoritable_items (id, type) SELECT id, 'post' FROM temp_user_post_ids;
    INSERT INTO temp_all_favoritable_items (id, type) SELECT id, 'attraction' FROM temp_attraction_post_ids;
    FOR i IN 1..400 LOOP
        SELECT id, type INTO item_id_temp, item_type_temp FROM temp_all_favoritable_items ORDER BY random() LIMIT 1;
        INSERT INTO user_favorites (user_id, item_id, item_type) VALUES ((SELECT id FROM temp_user_ids ORDER BY random() LIMIT 1), item_id_temp, item_type_temp) ON CONFLICT (user_id, item_id, item_type) DO NOTHING;
    END LOOP;

    RAISE NOTICE 'Mock data seeding completed successfully!';

END $$;