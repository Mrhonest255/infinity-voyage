-- Combined seed: reviews table + all tours
-- Safe to run multiple times (uses IF NOT EXISTS / ON CONFLICT DO NOTHING)

-- Reviews table (for per-tour reviews)
CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id uuid REFERENCES public.tours(id) ON DELETE CASCADE,
  name text NOT NULL,
  rating int NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text NOT NULL,
  is_approved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'reviews' AND policyname = 'Anyone can view approved reviews'
  ) THEN
    CREATE POLICY "Anyone can view approved reviews"
      ON public.reviews
      FOR SELECT
      USING (is_approved = true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'reviews' AND policyname = 'Anyone can create reviews'
  ) THEN
    CREATE POLICY "Anyone can create reviews"
      ON public.reviews
      FOR INSERT
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'reviews' AND policyname = 'Admins can manage reviews'
  ) THEN
    CREATE POLICY "Admins can manage reviews"
      ON public.reviews
      FOR ALL
      USING (public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;


-- Tours seed (from previous seeds, merged)
INSERT INTO public.tours (
  title, slug, short_description, description, duration,
  price, currency, category, difficulty, max_group_size,
  included, excluded, itinerary, highlights,
  featured_image, gallery,
  is_featured, is_published
) VALUES
-- Serengeti Safari
(
  'Serengeti Safari', 'serengeti-safari',
  'Classic Serengeti wildlife adventure with endless plains and big cats.',
  'Experience the legendary Serengeti with sunrise game drives, big cat sightings, and sweeping savannah views.',
  '4 days / 3 nights',
  1250, 'USD', 'safari', 'moderate', 12,
  ARRAY['Park fees','Game drives','Full-board safari lodges','Professional guide'],
  ARRAY['International flights','Visas','Tips','Personal insurance'],
  '[{"day":1,"title":"Arrival & Sunset Drive","description":"Pick-up and warm-up sunset game drive."},{"day":2,"title":"Full-Day Safari","description":"Dawn to dusk exploring central Serengeti."},{"day":3,"title":"Big Cats & Kopjes","description":"Track predators and picnic on the plains."},{"day":4,"title":"Morning Drive & Departure","description":"Early game drive then transfer out."}]'::jsonb,
  ARRAY['Big cat tracking','Sunrise & sunset drives','Endless plains views','Picnic in the bush'],
  'https://www.safariventures.com/wp-content/uploads/Untitled-design-1-1.png',
  ARRAY[
    'https://www.greatadventuresafaris.com/wp-content/uploads/Safaro-tours-to-serengeti-national-park.jpg',
    'https://roamwildadventure.com/wp-content/uploads/2021/02/5-day-safari-tarangire-ngorongoro-serengeti-manyara-olduvai-gallery-09-blurred-1-1024x654.jpg',
    'https://www.achieveglobalsafaris.com/wp-content/uploads/2021/01/4-Days-Serengeti-Wildlife-Safari.jpg'
  ],
  true, true
),
-- Ngorongoro Crater Day Trip
(
  'Ngorongoro Crater Day Trip', 'ngorongoro-crater-day-trip',
  'Full-day crater safari with dense wildlife and dramatic vistas.',
  'Descend into the world-famous Ngorongoro Crater for a packed day of wildlife viewing and scenic viewpoints.',
  '1 day',
  320, 'USD', 'safari', 'easy', 14,
  ARRAY['Park fees','4x4 safari vehicle','Professional guide','Lunch box','Bottled water'],
  ARRAY['Tips','Personal items'],
  '[{"day":1,"title":"Crater Descent & Game Drive","description":"Morning descent, big five search, hippo pools and picnic at the crater floor."}]'::jsonb,
  ARRAY['Crater rim views','Big five chances','Hippo pools','Birdlife'],
  'https://www.andbeyond.com/wp-content/uploads/sites/5/ngorongoro-crater-floor-teaming-with-game.jpg',
  ARRAY[
    'https://abundadiscoveriesuganda.com/wp-content/uploads/2025/01/Ngorongoro-National-Park-Tanzania-by-Licious-Adventure-%E2%80%94-YouPic.jpg',
    'https://www.discoverafrica.com/wp-content/uploads/2019/06/iStock-536747875.jpg',
    'https://www.ngorongorocratertanzania.org/wp-content/uploads/2019/04/Ngorongoro-Facts-750x450.jpg'
  ],
  true, true
),
-- Mikumi National Park Full-Day Tour
(
  'Mikumi National Park Full-Day Tour', 'mikumi-national-park-day',
  'Day safari from Dar es Salaam to Mikumi for elephants, giraffes, and wide savannah.',
  'Perfect quick safari escape from Dar es Salaam with classic East African wildlife and scenic plains.',
  '1 day',
  260, 'USD', 'safari', 'easy', 18,
  ARRAY['Park fees','4x4 vehicle','Professional guide','Lunch box','Water'],
  ARRAY['Tips','Personal insurance'],
  '[{"day":1,"title":"Mikumi Game Drive","description":"Early transfer, full-day game drive, and return in the evening."}]'::jsonb,
  ARRAY['Elephants & giraffes','Great for day trips','Open savannah','Family friendly'],
  'https://www.ngorongorocratertanzania.org/wp-content/uploads/2023/03/1-Day-Trip-Mikumi-National-Park-1.jpg',
  ARRAY[
    'https://www.focuseastafricatours.com/wp-content/uploads/Mikumi-National-Park-1.jpg',
    'https://www.leopard-tours.com/wp-content/uploads/2015/12/Mikumi-National-Park-4-1024x680.jpg',
    'https://enosaexpeditions.com/images/2022/05/19/mikumi.jpg'
  ],
  false, true
),
-- Selous Game Reserve Safari
(
  'Selous Game Reserve Safari', 'selous-safari',
  'River-based safari with boat and 4x4 drives in Nyerere (Selous).',
  'Discover riverside wildlife, boat safaris, and classic game drives in one of Africa’s largest reserves.',
  '3 days / 2 nights',
  890, 'USD', 'safari', 'moderate', 12,
  ARRAY['Park fees','Boat safari','Game drives','Lodging','Guide','Meals'],
  ARRAY['Flights','Tips','Drinks'],
  '[{"day":1,"title":"Arrival & Boat Safari","description":"River safari for crocs and hippos."},{"day":2,"title":"Full-Day Game Drives","description":"Explore woodlands and savannah."},{"day":3,"title":"Morning Drive & Exit","description":"Sunrise drive then transfer out."}]'::jsonb,
  ARRAY['Boat safari','Hippos & crocs','Open savannah drives','Large reserve'],
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlrpXhIynX1HELPZ7J5Ei-Ezzk6SSmO-jsVw&s',
  ARRAY[
    'https://www.tanzaniaodyssey.com/site/odyssey-image-proxy/park/selous=401199-320.jpg',
    'https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg'
  ],
  false, true
),
-- Nakupenda Sandbank Tour
(
  'Nakupenda Sandbank Tour', 'nakupenda-sandbank',
  'Iconic white-sand sandbank swim-and-snorkel escape near Stone Town.',
  'Swim, snorkel, and relax on the famous Nakupenda sandbank with turquoise waters and fresh seafood lunch.',
  'Half day',
  85, 'USD', 'beach', 'easy', 20,
  ARRAY['Boat transfer','Snorkeling gear','Seafood lunch','Water & fruits'],
  ARRAY['Tips','Personal expenses'],
  '[{"day":1,"title":"Sandbank & Snorkel","description":"Boat ride, snorkeling reef stops, beach lunch, free time."}]'::jsonb,
  ARRAY['Turquoise waters','Sandbank chill','Snorkeling reef','Great photos'],
  'https://media-cdn.tripadvisor.com/media/attractions-splice-spp-674x446/12/dc/04/45.jpg',
  ARRAY[
    'https://zanzibarstartours.net/wp-content/uploads/2023/06/Screenshot1686934046054.jpg',
    'https://zanzibarstartours.net/wp-content/uploads/2023/06/Screenshot1686934031246.jpg'
  ],
  true, true
),
-- Kuza Cave Adventure
(
  'Kuza Cave Adventure', 'kuza-cave-adventure',
  'Swim in turquoise Kuza Cave and learn Swahili culture in Jambiani.',
  'Discover the hidden Kuza Cave pool, cultural stories, and photo-friendly limestone caverns.',
  'Half day',
  65, 'USD', 'culture', 'easy', 15,
  ARRAY['Entrance fees','Guide','Water'],
  ARRAY['Meals','Transport (optional add-on)'],
  '[{"day":1,"title":"Cave Swim & Culture","description":"Guided cave visit, swim time, cultural storytelling."}]'::jsonb,
  ARRAY['Natural cave pool','Cultural experience','Great photos','Family friendly'],
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnrxPEFPBN4oGZZrFszPYMh3udN4LesvE2Yw&s',
  ARRAY[
    'https://media-cdn.tripadvisor.com/media/attractions-splice-spp-674x446/0f/84/ce/fc.jpg',
    'https://www.travelnotesonline.com/wp-content/uploads/2019/11/img_20190908_123604-scaled.jpg'
  ],
  false, true
),
-- Mtende Secret Beach
(
  'Mtende Secret Beach', 'mtende-secret-beach',
  'Hidden south-coast beach with cliffs, palms, and turquoise shallows.',
  'Escape to Mtende for a serene beach day, cliff views, and tranquil swims away from the crowds.',
  'Half day',
  55, 'USD', 'beach', 'easy', 18,
  ARRAY['Local guide','Water'],
  ARRAY['Meals','Transport (optional add-on)'],
  '[{"day":1,"title":"Secret Beach Chill","description":"Guided visit, cliff viewpoints, swim and photo time."}]'::jsonb,
  ARRAY['Secluded beach','Cliff views','Clear water','Photo spots'],
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTh_TkBZtFnm3ZbSGJfshMoK6nUXVsrk1QLMw&s',
  ARRAY[
    'https://static.wixstatic.com/media/646042_0fafc3060fdb405c8e350eac60693e1d~mv2.jpg/v1/fill/w_187,h_187,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/mtende-beach.jpg',
    'https://cdn.getyourguide.com/img/tour/c94e8969f6279020b91e41f1ee15315ef44395c11a40fb9a3f5d8cb566f249a1.jpg/146.jpg'
  ],
  false, true
),
-- Village Cultural Tour
(
  'Village Cultural Tour', 'village-cultural-tour',
  'Immerse in local village life with crafts, food, and warm hospitality.',
  'Meet artisans, taste local flavors, and learn daily life rhythms in a welcoming village setting.',
  'Half day',
  45, 'USD', 'culture', 'easy', 20,
  ARRAY['Local guide','Cultural activities','Water'],
  ARRAY['Tips','Transport (optional add-on)'],
  '[{"day":1,"title":"Village Walk & Crafts","description":"Meet locals, visit homes, try crafts and taste snacks."}]'::jsonb,
  ARRAY['Authentic culture','Local crafts','Food tasting','Great for families'],
  'https://zanzibarleisuretours.co.tz/wp-content/uploads/2020/11/villagetour2.jpg',
  ARRAY[
    'https://zanzibarstartours.net/wp-content/uploads/2018/11/102.jpg',
    'https://minneriyasafari.com/wp-content/uploads/2023/08/Sigiriya_Village_Tour-600x600.jpg'
  ],
  false, true
),
-- Safari Blue Full Day Experience
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
-- Mnemba Island Snorkeling
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
-- Stone Town Private Walking Tour
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
-- Jozani Forest Tour
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
-- Prison Island Tour
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
-- Dolphin Tour Kizimkazi
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
-- Spice Tour
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
-- Nungwi & Kendwa Beach Tour
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
-- Nungwi Beach & Cooking Class Tour
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
-- Quad Bike Adventure in Zanzibar
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
-- Maalum Cave Exploration
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
-- Serengeti National Park Safari (multi-day)
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
-- Mikumi National Park Safari (2-day)
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
-- Jozani + Spice Farm + Stone Town Tour (package)
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
-- Salam Cave + Jozani Forest + Spice Farm (package)
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
-- Prison Island + Nakupenda Sandbank (package)
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
-- Stone Town + Prison Island + Jozani Forest (package)
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
)
ON CONFLICT (slug) DO NOTHING;

