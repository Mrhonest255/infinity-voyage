-- Seed additional tours and packages with provided images
-- Safe to rerun: uses ON CONFLICT DO NOTHING on unique slug

INSERT INTO public.tours (
  title, slug, short_description, description, duration,
  price, currency, category, difficulty, max_group_size,
  included, excluded, itinerary, highlights,
  featured_image, gallery,
  is_featured, is_published
) VALUES
(
  'Safari Blue Full Day Experience', 'safari-blue-full-day',
  'Iconic dhow day with sandbanks, snorkeling, seafood lunch, and dolphins.',
  'Sail on a traditional dhow, snorkel clear reefs, feast on seafood, and relax on pristine sandbanks.',
  'Full day',
  95, 'USD', 'beach', 'easy', 24,
  ARRAY['Dhow boat','Seafood lunch','Snorkeling gear','Fruits & water'],
  ARRAY['Tips','Hotel transfers (optional add-on)'],
  '[{"day":1,"title":"Dhow Cruise & Sandbank","description":"Snorkel reefs, seafood BBQ, tropical fruits, dolphins if lucky."}]'::jsonb,
  ARRAY['Dhow sailing','Sandbank relax','Snorkeling','Seafood BBQ'],
  'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1c/b3/b1/c3/the-original-safari-blue.jpg?w=1200&h=900&s=1',
  ARRAY[
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAHJGlwh-SzvJN5vP51hsISJsFyR8BKmZqnA&s',
    'https://images.pexels.com/photos/1430672/pexels-photo-1430672.jpeg'
  ],
  true, true
),
(
  'Mnemba Island Snorkeling', 'mnemba-island-snorkeling',
  'World-class snorkeling at Mnemba reef with turquoise water and vibrant fish.',
  'Speedboat to Mnemba atoll for snorkeling, marine life spotting, and beach time on the clear shallows.',
  'Half day',
  110, 'USD', 'beach', 'easy', 18,
  ARRAY['Boat transfer','Snorkeling gear','Guide','Water & fruits'],
  ARRAY['Marine park fees (if applicable)','Tips'],
  '[{"day":1,"title":"Mnemba Reef Snorkel","description":"Two snorkel sessions, beach stop, fruits and water."}]'::jsonb,
  ARRAY['Clear reef','Colorful fish','Dolphin chances','Great photos'],
  'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/29/ff/7d/42/caption.jpg?w=1200&h=-1&s=1',
  ARRAY[
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyGBXPgIR-ampNqlEGIwxP3_8t2EXLEiaPjQ&s',
    'https://images.pexels.com/photos/1645028/pexels-photo-1645028.jpeg'
  ],
  true, true
),
(
  'Stone Town Private Walking Tour', 'stone-town-walking-tour',
  'Guided walk through alleys, markets, history, and culture of Stone Town.',
  'Discover Stone Town heritage: Old Fort, Forodhani, Sultan''s Palace, markets, and carved doors.',
  '3-4 hours',
  35, 'USD', 'culture', 'easy', 15,
  ARRAY['Professional guide','Bottled water'],
  ARRAY['Monument entry fees','Tips'],
  '[{"day":1,"title":"Historic Stone Town","description":"Markets, old fort, palaces, Freddie Mercury spots, coffee stop."}]'::jsonb,
  ARRAY['UNESCO history','Markets & food','Doors & alleys','Photo spots'],
  'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1c/30/34/de/caption.jpg?w=500&h=400&s=1',
  ARRAY[
    'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1b/32/a7/81/caption.jpg?w=500&h=400&s=1',
    'https://travel-buddies.com/wp-content/uploads/2024/11/1_private-city-tour-in-stone-town.jpg'
  ],
  false, true
),
(
  'Jozani Forest Tour', 'jozani-forest-tour',
  'Red colobus monkeys, mangroves, and nature walk in Jozani-Chwaka Bay.',
  'Walk the boardwalks, spot red colobus monkeys, and explore mangroves with a local guide.',
  'Half day',
  55, 'USD', 'nature', 'easy', 18,
  ARRAY['Park entry','Local guide','Water'],
  ARRAY['Transport (optional add-on)','Tips'],
  '[{"day":1,"title":"Forest & Mangroves","description":"Monkey spotting, nature trails, mangrove boardwalk."}]'::jsonb,
  ARRAY['Red colobus','Mangroves','Nature walk','Family friendly'],
  'https://www.zanzibar-tours.co.tz/wp-content/uploads/2024/11/tour_gallery_42.jpg',
  ARRAY[
    'https://www.exploretanzaniatours.com/wp-content/uploads/2022/02/Jozani-Chwaka-Bay-National-park.jpg',
    'https://images.pexels.com/photos/4577816/pexels-photo-4577816.jpeg'
  ],
  false, true
),
(
  'Prison Island Tour', 'prison-island-tour',
  'Boat to Changuu Island for giant tortoises and snorkeling.',
  'Visit the historical prison, meet giant Aldabra tortoises, and snorkel in clear waters near Stone Town.',
  'Half day',
  45, 'USD', 'culture', 'easy', 20,
  ARRAY['Boat transfer','Entrance fees','Guide'],
  ARRAY['Snorkel gear (optional rental)','Tips'],
  '[{"day":1,"title":"Island & Tortoises","description":"Boat ride, tortoise sanctuary, brief history, optional snorkel."}]'::jsonb,
  ARRAY['Giant tortoises','History stop','Snorkeling option','Near Stone Town'],
  'https://media.tacdn.com/media/attractions-splice-spp-674x446/0a/8a/85/05.jpg',
  ARRAY[
    'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/25/fb/f4/56/prison-island.jpg?w=500&h=300&s=1',
    'https://www.tanzaniatourism.com/images/uploads/Zanzibar_Prison_Island_01.jpg'
  ],
  false, true
),
(
  'Dolphin Tour Kizimkazi', 'dolphin-tour-kizimkazi',
  'Morning boat to spot dolphins and optional snorkel in Kizimkazi.',
  'Early start for higher dolphin chances; respectful viewing and optional swim depending on conditions.',
  'Half day (morning)',
  60, 'USD', 'beach', 'easy', 18,
  ARRAY['Boat tour','Guide','Water'],
  ARRAY['Snorkel gear rental','Tips'],
  '[{"day":1,"title":"Dolphin Spotting","description":"Sunrise departure, dolphin search, optional swim/snorkel."}]'::jsonb,
  ARRAY['Dolphin spotting','Sunrise light','Optional swim','Coastal views'],
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKf9J7jUoEO5ifwNmFYgtvytKTNw9bkVnfgA&s',
  ARRAY[
    'https://zanzibarworld.com/wp-content/uploads/2021/01/boat-rentals-kizimkazi-mtendeni-zanzibar-central-south-region-processed.jpg',
    'https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg'
  ],
  false, true
),
(
  'Spice Tour', 'spice-tour',
  'Discover Zanzibar spices with tastings, demos, and local lunch option.',
  'Walk through spice farms, see how spices grow, taste fresh fruits, and learn traditional uses.',
  'Half day',
  35, 'USD', 'culture', 'easy', 20,
  ARRAY['Local guide','Tastings','Water'],
  ARRAY['Transport (optional add-on)','Tips'],
  '[{"day":1,"title":"Spice Farm Walk","description":"See cloves, cinnamon, vanilla, fruits; tasting and shopping."}]'::jsonb,
  ARRAY['Spice demos','Fruit tasting','Local culture','Great souvenirs'],
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3LOjo6A1pvnvysGaS_pMeZGYCzYT6VjAoxg&s',
  ARRAY[
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYXq6ijO6Z7EfDCQlCBo1eiTyNPyn3cQUxbA&s',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS51ofb8BalKEKkZxJUsL88B9pU3YOwGwWGcw&s'
  ],
  false, true
),
(
  'Nungwi & Kendwa Beach Tour', 'nungwi-kendwa-beach-tour',
  'North coast twin beaches for swimming, sunsets, and chill time.',
  'Visit Nungwi and Kendwa for powder sand, turquoise water, beach bars, and epic sunsets.',
  'Full day',
  80, 'USD', 'beach', 'easy', 22,
  ARRAY['Transport from Stone Town','Guide','Water'],
  ARRAY['Meals','Activities (optional)'],
  '[{"day":1,"title":"Twin Beach Day","description":"Nungwi swim, fish market/boat yard, Kendwa sunset chill."}]'::jsonb,
  ARRAY['Soft sand','Sunset views','Swimming','Photo friendly'],
  'https://media-cdn.tripadvisor.com/media/attractions-splice-spp-674x446/0a/d8/e4/cd.jpg',
  ARRAY[
    'https://media.tacdn.com/media/attractions-splice-spp-674x446/0b/92/41/82.jpg',
    'https://images.pexels.com/photos/1074448/pexels-photo-1074448.jpeg'
  ],
  false, true
),
(
  'Nungwi Beach & Cooking Class Tour', 'nungwi-cooking-class',
  'Beach time plus Swahili cooking class in Nungwi.',
  'Combine relaxing Nungwi beach with a hands-on Swahili cooking experience and tasting.',
  'Full day',
  120, 'USD', 'culture', 'easy', 14,
  ARRAY['Transport','Cooking class','Lunch','Water'],
  ARRAY['Extra drinks','Tips'],
  '[{"day":1,"title":"Beach & Cook","description":"Morning beach time, afternoon cooking class and shared meal."}]'::jsonb,
  ARRAY['Cooking class','Beach swim','Local flavors','Fun group activity'],
  'https://cdn.getyourguide.com/img/tour/9f979c2ea6578e2463452c93c0c1bb07833a9fb3c70ede80c9f9dc0a0ede8f1d.jpg/146.jpg',
  ARRAY[
    'https://www.easytravel.co.tz/wp-content/uploads/2023/06/Nungwi-Beach-Zanzibar.jpg',
    'https://images.pexels.com/photos/1074448/pexels-photo-1074448.jpeg'
  ],
  false, true
),
(
  'Quad Bike Adventure in Zanzibar', 'quad-bike-adventure',
  'Off-road quad biking through villages, palm groves, and coast tracks.',
  'Guided quad adventure with safety briefing, scenic routes, and photo stops.',
  '2-3 hours',
  95, 'USD', 'adventure', 'moderate', 12,
  ARRAY['Quad bike','Helmet','Guide','Water'],
  ARRAY['Insurance waiver','Tips'],
  '[{"day":1,"title":"Off-Road Ride","description":"Briefing, test ride, trails through villages and coast tracks."}]'::jsonb,
  ARRAY['Thrilling ride','Local villages','Scenic trails','Photo stops'],
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2GaFVE4bGqH31qTYYT2J6AY_nrtx8ArhMcQ&s',
  ARRAY[
    'https://tuliazanzibar.com/wp-content/uploads/2019/09/01222E32A478423CB60DBA681674DE77.jpg',
    'https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg'
  ],
  false, true
),
(
  'Maalum Cave Exploration', 'maalum-cave-exploration',
  'Swim and relax in the scenic Maalum Cave pools near Paje.',
  'Crystal-clear underground pool with platforms, lights, and photo-worthy cave formations.',
  'Half day',
  50, 'USD', 'culture', 'easy', 15,
  ARRAY['Entrance','Guide','Water'],
  ARRAY['Transport (optional add-on)','Meals'],
  '[{"day":1,"title":"Cave Swim","description":"Guided cave visit, swim time, and photos."}]'::jsonb,
  ARRAY['Clear cave pool','Photo friendly','Relaxing swim','Near Paje'],
  'https://zanzibarstartours.net/wp-content/uploads/2023/10/1000029754-scaled.jpg',
  ARRAY[
    'https://maalumzanzibar.com/images/instagram-2.jpg',
    'https://worldoflina.com/wp-content/uploads/2024/09/DSC_0789-1-850x680.jpg'
  ],
  false, true
),
(
  'Serengeti National Park Safari', 'serengeti-national-park-safari',
  'Multi-day Serengeti safari focused on migration and big cats.',
  'Track the Great Migration (seasonal), big cats, and classic Serengeti vistas with comfortable lodges or camps.',
  '5 days / 4 nights',
  1850, 'USD', 'safari', 'moderate', 12,
  ARRAY['Park fees','Game drives','Full-board camps/lodges','Professional guide','4x4 vehicle'],
  ARRAY['Flights','Tips','Drinks','Visas'],
  '[{"day":1,"title":"Arrival & Afternoon Drive","description":"Enter park and sunset game drive."},{"day":2,"title":"Central Serengeti","description":"Full-day drives tracking predators."},{"day":3,"title":"Migration Zone","description":"Follow herds (seasonal), picnic lunch."},{"day":4,"title":"Plains & Kopjes","description":"Explore kopjes and river areas."},{"day":5,"title":"Morning Drive & Exit","description":"Sunrise drive and depart."}]'::jsonb,
  ARRAY['Migration (seasonal)','Big cats','Sunrise/sunset drives','Endless plains'],
  'https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg',
  ARRAY[
    'https://images.pexels.com/photos/3046582/pexels-photo-3046582.jpeg',
    'https://images.pexels.com/photos/1645028/pexels-photo-1645028.jpeg'
  ],
  true, true
),
(
  'Mikumi National Park Safari', 'mikumi-national-park-safari',
  'Short classic safari in Mikumi with elephants, giraffes, and big views.',
  'Enjoy Mikumi''s open plains with elephants, giraffes, and plains game; great add-on to Dar trips.',
  '2 days / 1 night',
  420, 'USD', 'safari', 'easy', 16,
  ARRAY['Park fees','Game drives','Lodging','Guide','Meals'],
  ARRAY['Drinks','Tips','Transfers from Dar (optional)'],
  '[{"day":1,"title":"Transfer & Afternoon Game Drive","description":"Enter park, game drive until sunset."},{"day":2,"title":"Morning Drive & Exit","description":"Dawn drive then exit/return."}]'::jsonb,
  ARRAY['Elephants & giraffes','Easy access','Short getaway','Great value'],
  'https://www.lakemanyaranationalparks.com/wp-content/uploads/2023/06/M6-1.jpg',
  ARRAY[
    'https://www.leopard-tours.com/wp-content/uploads/2015/12/Mikumi-National-Park-4-1024x680.jpg',
    'https://images.pexels.com/photos/3046582/pexels-photo-3046582.jpeg'
  ],
  false, true
),
(
  'Jozani + Spice Farm + Stone Town Tour', 'jozani-spice-stone-package',
  'Full-day combo: monkeys, spices, and historic Stone Town.',
  'See red colobus in Jozani, taste spices on a farm, then explore Stone Town highlights in one packed day.',
  'Full day',
  120, 'USD', 'package', 'easy', 18,
  ARRAY['Transport','Park entry','Spice tour','Stone Town guide','Water'],
  ARRAY['Lunch','Tips'],
  '[{"day":1,"title":"Jozani, Spice & Stone Town","description":"Morning Jozani, midday spice farm, afternoon Stone Town walk."}]'::jsonb,
  ARRAY['Monkeys','Spices','UNESCO town','Great value'],
  'https://www.exploretanzaniatours.com/wp-content/uploads/2022/02/Jozani-Chwaka-Bay-National-park.jpg',
  ARRAY[
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3LOjo6A1pvnvysGaS_pMeZGYCzYT6VjAoxg&s',
    'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1c/30/34/de/caption.jpg?w=500&h=400&s=1'
  ],
  false, true
),
(
  'Salam Cave + Jozani Forest + Spice Farm', 'salam-cave-jozani-spice',
  'Cave swim plus nature and spices in one immersive day.',
  'Combine a refreshing cave visit with Jozani monkeys and a spice farm tasting experience.',
  'Full day',
  125, 'USD', 'package', 'easy', 16,
  ARRAY['Transport','Cave entry','Park entry','Spice tour','Guide','Water'],
  ARRAY['Lunch','Tips'],
  '[{"day":1,"title":"Cave, Forest, Spices","description":"Morning cave swim, midday Jozani walk, afternoon spice farm."}]'::jsonb,
  ARRAY['Cave swim','Wildlife','Spices','All-in-one'],
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnrxPEFPBN4oGZZrFszPYMh3udN4LesvE2Yw&s',
  ARRAY[
    'https://www.exploretanzaniatours.com/wp-content/uploads/2022/02/Jozani-Chwaka-Bay-National-park.jpg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3LOjo6A1pvnvysGaS_pMeZGYCzYT6VjAoxg&s'
  ],
  false, true
),
(
  'Prison Island + Nakupenda Sandbank', 'prison-island-nakupenda',
  'Giant tortoises plus sandbank chill and snorkel combo.',
  'Half-day island visit with tortoises, then relax and snorkel on Nakupenda sandbank.',
  'Half day',
  75, 'USD', 'package', 'easy', 22,
  ARRAY['Boat transfers','Tortoise entry','Guide','Fruits & water'],
  ARRAY['Seafood lunch (optional add-on)','Tips'],
  '[{"day":1,"title":"Tortoises & Sandbank","description":"Island visit then sandbank swim/snorkel."}]'::jsonb,
  ARRAY['Tortoises','Sandbank','Snorkeling','Great photos'],
  'https://cdn.getyourguide.com/img/location/5c4def5d967c6.jpeg/99.jpg',
  ARRAY[
    'https://www.tanzaniatourism.com/images/uploads/Zanzibar_Prison_Island.jpg',
    'https://media-cdn.tripadvisor.com/media/attractions-splice-spp-674x446/12/dc/04/45.jpg'
  ],
  true, true
),
(
  'Stone Town + Prison Island + Jozani Forest', 'stone-prison-jozani-package',
  'History, tortoises, and rainforest in a single day.',
  'Blend Stone Town heritage, Prison Island tortoises, and Jozani red colobus into one efficient itinerary.',
  'Full day',
  130, 'USD', 'package', 'easy', 18,
  ARRAY['Transport','Boat transfer','Entries','Guides','Water'],
  ARRAY['Lunch','Tips'],
  '[{"day":1,"title":"Town, Island, Forest","description":"Morning Stone Town, midday Prison Island, afternoon Jozani."}]'::jsonb,
  ARRAY['UNESCO sites','Tortoises','Monkeys','Great variety'],
  'https://serengetinationalparksafaris.com/wp-content/uploads/2022/10/Stone-Town-Zanzibar-zanzibar-tourists-800x450-1-750x450.jpg',
  ARRAY[
    'https://www.tanzaniatourism.com/images/uploads/Zanzibar_Prison_Island.jpg',
    'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1c/eb/2c/52/jozan-forest-is-a-national.jpg?w=900&h=500&s=1'
  ],
  false, true
);

-- Avoid duplicate inserts if rerun
ON CONFLICT (slug) DO NOTHING;

