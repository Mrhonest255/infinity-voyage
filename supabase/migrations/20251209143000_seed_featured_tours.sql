-- Seed featured tours and experiences with provided images
-- These records are editable/deletable from the admin dashboard (tours table)
-- Slugs are unique; set is_published=true so they appear on the site

INSERT INTO public.tours (
  title, slug, short_description, description, duration,
  price, currency, category, difficulty, max_group_size,
  included, excluded, itinerary, highlights,
  featured_image, gallery,
  is_featured, is_published
) VALUES
(
  'Serengeti Safari', 'serengeti-safari',
  'Classic Serengeti wildlife adventure with endless plains and big cats.',
  'Experience the legendary Serengeti with sunrise game drives, big cat sightings, and sweeping savannah views. Perfect for first-time and returning safari lovers.',
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
);

