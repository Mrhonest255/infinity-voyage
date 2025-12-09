-- Zanzibar Excursions - Individual Tours (1-11) and Package Tours (12-21)
-- Safe to run multiple times (uses ON CONFLICT DO NOTHING)

-- INDIVIDUAL TOURS (1-11)
INSERT INTO public.tours (
  title, slug, short_description, description, duration,
  price, currency, category, difficulty, max_group_size,
  included, excluded, itinerary, highlights,
  featured_image, gallery,
  is_featured, is_published
) VALUES

-- 1. Stone Town
(
  'Stone Town Tour', 'stone-town-tour',
  'Explore the historic UNESCO World Heritage Site of Stone Town with its winding alleys and rich history.',
  'Discover the fascinating history and culture of Stone Town, a UNESCO World Heritage Site. Walk through narrow winding streets, visit the Old Fort, the House of Wonders, the Old Slave Market, and explore local markets filled with spices, crafts, and Swahili culture.',
  'Half day (3-4 hours)',
  35, 'USD', 'zanzibar', 'easy', 20,
  ARRAY['Professional guide','Hotel pickup and drop-off','Entrance fees','Bottled water'],
  ARRAY['Tips','Personal shopping','Lunch'],
  '[{"day":1,"title":"Stone Town Walking Tour","description":"Explore the historic Old Fort, House of Wonders, Old Slave Market, Sultan Palace, and local markets."}]'::jsonb,
  ARRAY['UNESCO World Heritage Site','Historic architecture','Old Slave Market','Local markets','Swahili culture'],
  'https://images.unsplash.com/photo-1586273510152-59c7de93a374?w=800',
  ARRAY['https://images.unsplash.com/photo-1586273510152-59c7de93a374?w=800'],
  true, true
),

-- 2. Spice Tour
(
  'Spice Tour', 'spice-tour',
  'Visit spice plantations and discover why Zanzibar is called the Spice Island.',
  'Experience the aromatic world of Zanzibar spices! Visit local spice farms to see, smell, and taste cloves, nutmeg, cinnamon, vanilla, black pepper, cardamom, and many more exotic spices. Learn about their uses in cooking, medicine, and cosmetics.',
  'Half day (3-4 hours)',
  35, 'USD', 'zanzibar', 'easy', 20,
  ARRAY['Professional guide','Hotel pickup and drop-off','Spice samples','Tropical fruit tasting','Bottled water'],
  ARRAY['Tips','Personal purchases'],
  '[{"day":1,"title":"Spice Plantation Visit","description":"Visit spice farms, learn about various spices, enjoy tropical fruit tasting and witness traditional rope climbing."}]'::jsonb,
  ARRAY['Spice plantations','Tropical fruits','Traditional uses','Aromatic experience','Local farming'],
  'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800',
  ARRAY['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800'],
  true, true
),

-- 3. Prison Island
(
  'Prison Island Tour', 'prison-island-tour',
  'Visit the famous Prison Island to see giant Aldabra tortoises and enjoy pristine beaches.',
  'Take a boat trip to Prison Island (Changuu Island), home to giant Aldabra tortoises some over 100 years old. Explore the historic prison ruins, swim in crystal clear waters, and relax on beautiful white sandy beaches.',
  'Half day (3-4 hours)',
  45, 'USD', 'zanzibar', 'easy', 20,
  ARRAY['Boat transfer','Professional guide','Entrance fees','Snorkeling gear','Bottled water'],
  ARRAY['Tips','Lunch','Personal items'],
  '[{"day":1,"title":"Prison Island Adventure","description":"Boat ride to the island, visit giant tortoises, explore prison ruins, swimming and snorkeling."}]'::jsonb,
  ARRAY['Giant Aldabra tortoises','Historic prison ruins','Snorkeling','Beautiful beaches','Crystal clear water'],
  'https://images.unsplash.com/photo-1559666126-84f389727b9a?w=800',
  ARRAY['https://images.unsplash.com/photo-1559666126-84f389727b9a?w=800'],
  true, true
),

-- 4. Village Tour
(
  'Village Tour', 'village-tour',
  'Experience authentic Zanzibar village life and traditional Swahili culture.',
  'Immerse yourself in authentic Zanzibar village life. Visit local homes, see traditional cooking methods, learn about daily activities, interact with friendly locals, and experience the warmth of Swahili hospitality.',
  'Half day (3-4 hours)',
  30, 'USD', 'zanzibar', 'easy', 15,
  ARRAY['Professional guide','Hotel pickup and drop-off','Traditional snacks','Bottled water'],
  ARRAY['Tips','Personal purchases'],
  '[{"day":1,"title":"Village Experience","description":"Visit local homes, observe traditional activities, interact with villagers, and learn about Swahili culture."}]'::jsonb,
  ARRAY['Local village life','Traditional cooking','Swahili hospitality','Cultural immersion','Authentic experience'],
  'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800',
  ARRAY['https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800'],
  false, true
),

-- 5. Jozani Forest
(
  'Jozani Forest Tour', 'jozani-forest-tour',
  'Trek through Jozani Forest to see the rare endemic Red Colobus monkeys.',
  'Explore Jozani Chwaka Bay National Park, the last indigenous forest in Zanzibar. See the rare and endemic Zanzibar Red Colobus monkeys in their natural habitat, walk through the mangrove boardwalk, and discover unique flora and fauna.',
  'Half day (3-4 hours)',
  50, 'USD', 'zanzibar', 'easy', 20,
  ARRAY['Professional guide','Hotel pickup and drop-off','Park entrance fees','Bottled water'],
  ARRAY['Tips','Personal items'],
  '[{"day":1,"title":"Jozani Forest Trek","description":"Guided walk through the forest, spot Red Colobus monkeys, explore mangrove boardwalk."}]'::jsonb,
  ARRAY['Red Colobus monkeys','Indigenous forest','Mangrove boardwalk','Endemic wildlife','Nature walk'],
  'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=800',
  ARRAY['https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=800'],
  true, true
),

-- 6. Mnemba Snorkeling Half Day
(
  'Mnemba Snorkeling Half Day', 'mnemba-snorkeling-half-day',
  'Half-day snorkeling adventure at the pristine Mnemba Atoll marine reserve.',
  'Experience world-class snorkeling at Mnemba Atoll, a protected marine reserve with crystal clear waters, vibrant coral reefs, and abundant tropical fish. Perfect for a quick but unforgettable underwater adventure.',
  'Half day (4-5 hours)',
  60, 'USD', 'zanzibar', 'easy', 15,
  ARRAY['Boat transfer','Snorkeling equipment','Professional guide','Bottled water','Fresh fruits'],
  ARRAY['Tips','Lunch','Underwater camera'],
  '[{"day":1,"title":"Mnemba Snorkeling","description":"Boat ride to Mnemba Atoll, snorkeling in crystal clear waters, spot tropical fish and coral reefs."}]'::jsonb,
  ARRAY['Mnemba Atoll','Coral reefs','Tropical fish','Crystal clear water','Marine life'],
  'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
  ARRAY['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800'],
  true, true
),

-- 7. Mnemba Snorkeling Full Day
(
  'Mnemba Snorkeling Full Day', 'mnemba-snorkeling-full-day',
  'Full-day snorkeling expedition at Mnemba Atoll with multiple dive spots and beach BBQ.',
  'Spend a full day exploring the underwater wonders of Mnemba Atoll. Visit multiple snorkeling spots, enjoy a delicious seafood BBQ lunch on a sandbank, and have plenty of time to swim, relax, and discover marine life.',
  'Full day (7-8 hours)',
  85, 'USD', 'zanzibar', 'easy', 15,
  ARRAY['Boat transfer','Snorkeling equipment','Professional guide','Seafood BBQ lunch','Drinks','Fresh fruits'],
  ARRAY['Tips','Underwater camera'],
  '[{"day":1,"title":"Full Day Mnemba Adventure","description":"Multiple snorkeling spots, sandbank visit, seafood BBQ lunch, swimming and relaxation."}]'::jsonb,
  ARRAY['Multiple snorkeling spots','Seafood BBQ','Sandbank visit','All-day adventure','Marine sanctuary'],
  'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800',
  ARRAY['https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800'],
  true, true
),

-- 8. Butterfly Center
(
  'Butterfly Center Tour', 'butterfly-center-tour',
  'Visit the enchanting Zanzibar Butterfly Center with hundreds of colorful species.',
  'Discover the magical world of butterflies at the Zanzibar Butterfly Center. Walk through tropical gardens filled with hundreds of colorful butterflies, learn about their life cycle, and capture amazing photos of these beautiful creatures.',
  '2-3 hours',
  25, 'USD', 'zanzibar', 'easy', 20,
  ARRAY['Entrance fees','Professional guide','Bottled water'],
  ARRAY['Tips','Hotel transfer','Personal items'],
  '[{"day":1,"title":"Butterfly Center Visit","description":"Guided tour through butterfly gardens, learn about butterfly life cycles, photo opportunities."}]'::jsonb,
  ARRAY['Colorful butterflies','Tropical gardens','Educational tour','Photography','Nature experience'],
  'https://images.unsplash.com/photo-1452570053594-1b985d6ea890?w=800',
  ARRAY['https://images.unsplash.com/photo-1452570053594-1b985d6ea890?w=800'],
  false, true
),

-- 9. Safari Blue
(
  'Safari Blue', 'safari-blue',
  'The ultimate Zanzibar sea adventure with sailing, snorkeling, seafood and sandbanks.',
  'Safari Blue is Zanzibar most popular full-day sea adventure! Sail on a traditional dhow, snorkel in pristine waters, visit mangrove lagoons, swim with starfish, enjoy a lavish seafood BBQ on a sandbank, and witness a spectacular sunset.',
  'Full day (8-9 hours)',
  85, 'USD', 'zanzibar', 'easy', 30,
  ARRAY['Dhow sailing','Snorkeling equipment','Seafood BBQ lunch','Drinks','Fresh fruits','Hotel pickup'],
  ARRAY['Tips','Underwater camera'],
  '[{"day":1,"title":"Safari Blue Adventure","description":"Dhow sailing, snorkeling, mangrove visit, sandbank BBQ, swimming with starfish, sunset cruise."}]'::jsonb,
  ARRAY['Traditional dhow sailing','Snorkeling','Sandbank BBQ','Mangrove lagoon','Sunset views'],
  'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=800',
  ARRAY['https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=800'],
  true, true
),

-- 10. Culinary Tour
(
  'Culinary Tour', 'culinary-tour',
  'Taste authentic Zanzibar cuisine and learn traditional Swahili cooking.',
  'Embark on a delicious journey through Zanzibar flavors! Visit local markets, learn about exotic ingredients, participate in traditional cooking classes, and taste authentic Swahili dishes. A food lover paradise!',
  'Half day (4-5 hours)',
  55, 'USD', 'zanzibar', 'easy', 12,
  ARRAY['Professional chef guide','Market tour','Cooking class','Full meal','Recipe booklet','Bottled water'],
  ARRAY['Tips','Personal items'],
  '[{"day":1,"title":"Culinary Experience","description":"Visit local markets, cooking demonstration, hands-on cooking class, enjoy your creations."}]'::jsonb,
  ARRAY['Swahili cooking','Local markets','Authentic cuisine','Cooking class','Food tasting'],
  'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=800',
  ARRAY['https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=800'],
  false, true
),

-- 11. Nakupenda Sandbank
(
  'Nakupenda Sandbank', 'nakupenda-sandbank',
  'Visit the stunning disappearing sandbank with crystal waters and seafood BBQ.',
  'Escape to Nakupenda, a beautiful sandbank that appears at low tide in the middle of the ocean. Enjoy swimming in turquoise waters, sunbathing on white sand, snorkeling, and a delicious seafood BBQ lunch.',
  'Half day (4-5 hours)',
  55, 'USD', 'zanzibar', 'easy', 20,
  ARRAY['Boat transfer','Snorkeling equipment','Seafood BBQ lunch','Fresh fruits','Drinks','Beach mat'],
  ARRAY['Tips','Underwater camera'],
  '[{"day":1,"title":"Nakupenda Experience","description":"Boat ride to sandbank, swimming, snorkeling, sunbathing, seafood BBQ lunch."}]'::jsonb,
  ARRAY['Disappearing sandbank','Turquoise waters','Seafood BBQ','Snorkeling','Beach relaxation'],
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
  ARRAY['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800'],
  true, true
)

ON CONFLICT (slug) DO NOTHING;


-- PACKAGE TOURS (12-21) - Combination tours
INSERT INTO public.tours (
  title, slug, short_description, description, duration,
  price, currency, category, difficulty, max_group_size,
  included, excluded, itinerary, highlights,
  featured_image, gallery,
  is_featured, is_published
) VALUES

-- 12. Nakupenda with Prison Island
(
  'Nakupenda with Prison Island', 'nakupenda-prison-island-package',
  'Combine the famous Prison Island tortoises with Nakupenda sandbank paradise.',
  'The perfect island combination! Start with Prison Island to meet giant Aldabra tortoises and explore historic ruins, then sail to Nakupenda sandbank for swimming, snorkeling, and a delicious seafood BBQ lunch.',
  'Full day (6-7 hours)',
  75, 'USD', 'zanzibar-package', 'easy', 18,
  ARRAY['Boat transfers','Entrance fees','Snorkeling equipment','Seafood BBQ lunch','Drinks','Professional guide'],
  ARRAY['Tips','Underwater camera'],
  '[{"day":1,"title":"Prison Island & Nakupenda","description":"Morning visit to Prison Island for tortoises and history, then boat to Nakupenda for beach BBQ and snorkeling."}]'::jsonb,
  ARRAY['Giant tortoises','Prison Island history','Nakupenda sandbank','Seafood BBQ','Snorkeling'],
  'https://images.unsplash.com/photo-1559666126-84f389727b9a?w=800',
  ARRAY['https://images.unsplash.com/photo-1559666126-84f389727b9a?w=800'],
  true, true
),

-- 13. Stone Town + Spice Tour
(
  'Stone Town + Spice Tour', 'stone-town-spice-package',
  'Combine history and aromatics with Stone Town heritage and spice plantation visit.',
  'Experience the best of Zanzibar culture in one day! Explore the UNESCO World Heritage Stone Town in the morning, then visit aromatic spice plantations to discover why Zanzibar is called the Spice Island.',
  'Full day (6-7 hours)',
  55, 'USD', 'zanzibar-package', 'easy', 18,
  ARRAY['Professional guide','Hotel pickup','Entrance fees','Spice samples','Fruit tasting','Lunch','Bottled water'],
  ARRAY['Tips','Personal shopping'],
  '[{"day":1,"title":"Culture & Spices","description":"Morning Stone Town walking tour, lunch break, afternoon spice plantation visit with tasting."}]'::jsonb,
  ARRAY['Stone Town heritage','Spice plantations','Local markets','Cultural immersion','Tropical fruits'],
  'https://images.unsplash.com/photo-1586273510152-59c7de93a374?w=800',
  ARRAY['https://images.unsplash.com/photo-1586273510152-59c7de93a374?w=800'],
  true, true
),

-- 14. Stone Town + Spice Tour + Prison Island
(
  'Stone Town + Spice Tour + Prison Island', 'stone-town-spice-prison-package',
  'Ultimate Zanzibar culture package with history, spices, and giant tortoises.',
  'The complete Zanzibar experience! Explore Stone Town historical sites, visit aromatic spice farms, and boat to Prison Island to meet giant tortoises. Perfect for first-time visitors wanting to see it all.',
  'Full day (8-9 hours)',
  85, 'USD', 'zanzibar-package', 'easy', 15,
  ARRAY['Professional guide','All entrance fees','Boat transfer','Spice samples','Lunch','Bottled water'],
  ARRAY['Tips','Personal shopping'],
  '[{"day":1,"title":"Complete Culture Tour","description":"Morning Stone Town tour, spice plantation visit, boat to Prison Island for tortoises."}]'::jsonb,
  ARRAY['Stone Town UNESCO site','Spice plantations','Giant tortoises','Prison Island','Complete experience'],
  'https://images.unsplash.com/photo-1586273510152-59c7de93a374?w=800',
  ARRAY['https://images.unsplash.com/photo-1586273510152-59c7de93a374?w=800'],
  true, true
),

-- 15. Stone Town + Prison Island
(
  'Stone Town + Prison Island', 'stone-town-prison-island-package',
  'Combine Stone Town heritage walk with Prison Island tortoise sanctuary.',
  'Perfect half-culture, half-nature combination! Walk through historic Stone Town streets and landmarks, then boat to Prison Island to meet the famous giant Aldabra tortoises and swim in crystal waters.',
  'Full day (6-7 hours)',
  65, 'USD', 'zanzibar-package', 'easy', 18,
  ARRAY['Professional guide','Entrance fees','Boat transfer','Snorkeling gear','Lunch','Bottled water'],
  ARRAY['Tips','Personal shopping'],
  '[{"day":1,"title":"History & Nature","description":"Morning Stone Town exploration, lunch, afternoon boat to Prison Island for tortoises and swimming."}]'::jsonb,
  ARRAY['Stone Town heritage','Giant tortoises','Boat ride','Snorkeling','Historic sites'],
  'https://images.unsplash.com/photo-1586273510152-59c7de93a374?w=800',
  ARRAY['https://images.unsplash.com/photo-1586273510152-59c7de93a374?w=800'],
  false, true
),

-- 16. Prison Island + Spice Tour
(
  'Prison Island + Spice Tour', 'prison-island-spice-package',
  'Meet giant tortoises on Prison Island and explore aromatic spice plantations.',
  'A unique combination of wildlife and culture! Visit Prison Island in the morning to see giant Aldabra tortoises, then head inland to explore the famous spice plantations with fruit tasting.',
  'Full day (6-7 hours)',
  65, 'USD', 'zanzibar-package', 'easy', 18,
  ARRAY['Professional guide','Boat transfer','Entrance fees','Spice samples','Fruit tasting','Lunch','Bottled water'],
  ARRAY['Tips','Personal purchases'],
  '[{"day":1,"title":"Tortoises & Spices","description":"Morning boat to Prison Island for tortoises, afternoon spice plantation tour with tasting."}]'::jsonb,
  ARRAY['Giant tortoises','Spice plantations','Tropical fruits','Island adventure','Aromatic experience'],
  'https://images.unsplash.com/photo-1559666126-84f389727b9a?w=800',
  ARRAY['https://images.unsplash.com/photo-1559666126-84f389727b9a?w=800'],
  false, true
),

-- 17. Prison Island + Stone Town Tour
(
  'Prison Island + Stone Town Tour', 'prison-island-stone-town-package',
  'Giant tortoises and UNESCO World Heritage Stone Town in one memorable day.',
  'Start with a boat trip to Prison Island for giant tortoises and historic prison ruins, then explore the winding streets and landmarks of UNESCO World Heritage Stone Town.',
  'Full day (6-7 hours)',
  65, 'USD', 'zanzibar-package', 'easy', 18,
  ARRAY['Professional guide','Boat transfer','All entrance fees','Lunch','Bottled water'],
  ARRAY['Tips','Personal shopping'],
  '[{"day":1,"title":"Island & Town","description":"Morning boat to Prison Island, meet tortoises, afternoon Stone Town walking tour."}]'::jsonb,
  ARRAY['Giant tortoises','Stone Town','UNESCO heritage','Historic sites','Cultural experience'],
  'https://images.unsplash.com/photo-1559666126-84f389727b9a?w=800',
  ARRAY['https://images.unsplash.com/photo-1559666126-84f389727b9a?w=800'],
  false, true
),

-- 18. Jozani Forest + Spice Tour
(
  'Jozani Forest + Spice Tour', 'jozani-forest-spice-package',
  'Rare Red Colobus monkeys in Jozani Forest and aromatic spice plantation experience.',
  'Nature and culture combined! Trek through Jozani Forest to spot the endemic Red Colobus monkeys, then visit spice plantations to discover the aromatic treasures that made Zanzibar famous.',
  'Full day (6-7 hours)',
  70, 'USD', 'zanzibar-package', 'easy', 18,
  ARRAY['Professional guide','Park entrance fees','Spice samples','Fruit tasting','Lunch','Bottled water','Hotel pickup'],
  ARRAY['Tips','Personal purchases'],
  '[{"day":1,"title":"Forest & Spices","description":"Morning Jozani Forest trek for monkeys, lunch, afternoon spice plantation tour."}]'::jsonb,
  ARRAY['Red Colobus monkeys','Jozani Forest','Spice plantations','Tropical fruits','Nature walk'],
  'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=800',
  ARRAY['https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=800'],
  true, true
),

-- 19. Jozani Forest + Stone Town Tour
(
  'Jozani Forest + Stone Town Tour', 'jozani-forest-stone-town-package',
  'Red Colobus monkeys in natural forest and Stone Town UNESCO heritage sites.',
  'The perfect nature-culture balance! Start with Jozani Forest to see rare Red Colobus monkeys and mangroves, then explore the historic streets and landmarks of Stone Town.',
  'Full day (7-8 hours)',
  70, 'USD', 'zanzibar-package', 'easy', 18,
  ARRAY['Professional guide','All entrance fees','Lunch','Bottled water','Hotel pickup'],
  ARRAY['Tips','Personal shopping'],
  '[{"day":1,"title":"Forest & Heritage","description":"Morning Jozani Forest trek, lunch break, afternoon Stone Town walking tour."}]'::jsonb,
  ARRAY['Red Colobus monkeys','Jozani Forest','Stone Town','UNESCO heritage','Full day adventure'],
  'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=800',
  ARRAY['https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=800'],
  false, true
),

-- 20. Jozani Forest + Prison Island Tour
(
  'Jozani Forest + Prison Island Tour', 'jozani-forest-prison-island-package',
  'Two wildlife experiences - Red Colobus monkeys and giant Aldabra tortoises.',
  'Double wildlife adventure! See the rare endemic Red Colobus monkeys in Jozani Forest, then boat to Prison Island to meet giant Aldabra tortoises over 100 years old.',
  'Full day (7-8 hours)',
  80, 'USD', 'zanzibar-package', 'easy', 15,
  ARRAY['Professional guide','Park entrance fees','Boat transfer','Snorkeling gear','Lunch','Bottled water'],
  ARRAY['Tips','Underwater camera'],
  '[{"day":1,"title":"Wildlife Double","description":"Morning Jozani Forest trek for monkeys, lunch, afternoon boat to Prison Island for tortoises."}]'::jsonb,
  ARRAY['Red Colobus monkeys','Giant tortoises','Jozani Forest','Prison Island','Wildlife experience'],
  'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=800',
  ARRAY['https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=800'],
  true, true
),

-- 21. Jozani Forest + Butterfly Center
(
  'Jozani Forest + Butterfly Center', 'jozani-forest-butterfly-package',
  'Nature walk for Red Colobus monkeys and colorful butterflies at the Butterfly Center.',
  'A beautiful nature-focused day! Trek through Jozani Forest to spot Red Colobus monkeys and explore mangroves, then visit the enchanting Butterfly Center with hundreds of colorful species.',
  'Half day (5-6 hours)',
  60, 'USD', 'zanzibar-package', 'easy', 18,
  ARRAY['Professional guide','All entrance fees','Bottled water','Hotel pickup'],
  ARRAY['Tips','Lunch','Personal items'],
  '[{"day":1,"title":"Monkeys & Butterflies","description":"Jozani Forest trek for Red Colobus monkeys, then visit Butterfly Center gardens."}]'::jsonb,
  ARRAY['Red Colobus monkeys','Colorful butterflies','Jozani Forest','Nature experience','Photography'],
  'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=800',
  ARRAY['https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=800'],
  false, true
)

ON CONFLICT (slug) DO NOTHING;
