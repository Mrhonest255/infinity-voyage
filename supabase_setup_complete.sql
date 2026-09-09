-- ============================================================================
-- INFINITY VOYAGE TOURS & SAFARIS - COMPLETE SUPABASE SETUP SCRIPT
-- ============================================================================
--
-- [SWAHILI]
-- MAELEKEZO YA KUTUMIA:
-- 1. Fungua Supabase Dashboard yako (https://supabase.com/dashboard)
-- 2. Chagua project yako ya Infinity Voyage
-- 3. Nenda upande wa kushoto kwenye "SQL Editor"
-- 4. Bonyeza "New query" (Query Mpya)
-- 5. Copy script hii yote na u-paste hapo
-- 6. Bonyeza kitufe cha kijani "Run" (au bonyeza Ctrl+Enter / Cmd+Enter)
-- 7. Utaona matokeo mwishoni yakionyesha tables, storage buckets na settings zote zikiwa tayari!
--
-- [ENGLISH]
-- INSTRUCTIONS FOR USE:
-- 1. Open your Supabase Dashboard (https://supabase.com/dashboard)
-- 2. Select your Infinity Voyage project
-- 3. In the left navigation, click on "SQL Editor"
-- 4. Click "+ New query"
-- 5. Copy this entire script and paste it into the editor
-- 6. Click "Run" (or press Ctrl+Enter / Cmd+Enter)
-- 7. You will see confirmation results at the bottom showing all tables, buckets, and settings!
--
-- NOTE: This script is 100% IDEMPOTENT (safe to run multiple times without breaking existing data).
-- ============================================================================

-- Ensure pgcrypto extension is active for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. TABLE: site_settings & ROW LEVEL SECURITY (RLS)
-- ============================================================================
-- Table inahifadhi taarifa zote za tovuti (General, Navigation, FAQ, Footer, n.k.)

CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Auto-update updated_at timestamp function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for site_settings updated_at
DROP TRIGGER IF EXISTS trigger_site_settings_updated_at ON public.site_settings;
DROP TRIGGER IF EXISTS set_updated_at ON public.site_settings;
DROP TRIGGER IF EXISTS update_site_settings_updated_at ON public.site_settings;

CREATE TRIGGER trigger_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ----------------------------------------------------------------------------
-- POLICIES for site_settings
-- ----------------------------------------------------------------------------
-- Drop existing policies first to prevent conflicts or duplicate errors
DROP POLICY IF EXISTS "Anyone can read site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Anyone can view site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Public read site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Authenticated users can insert site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins can insert settings" ON public.site_settings;
DROP POLICY IF EXISTS "Authenticated users can update site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins can update settings" ON public.site_settings;
DROP POLICY IF EXISTS "Authenticated users can delete site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins can delete settings" ON public.site_settings;

-- 1. Public Read: Kila mtu (wageni na waliologisti) anaweza kusoma mipangilio ya tovuti
CREATE POLICY "Public read site_settings"
  ON public.site_settings
  FOR SELECT
  USING (true);

-- 2. Authenticated Insert: Watumiaji waliologisti (Admins) wanaweza kuongeza mipangilio mipya
CREATE POLICY "Authenticated users can insert site_settings"
  ON public.site_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 3. Authenticated Update: Watumiaji waliologisti (Admins) wanaweza kubadilisha mipangilio
CREATE POLICY "Authenticated users can update site_settings"
  ON public.site_settings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 4. Authenticated Delete: Watumiaji waliologisti (Admins) wanaweza kufuta mipangilio
CREATE POLICY "Authenticated users can delete site_settings"
  ON public.site_settings
  FOR DELETE
  TO authenticated
  USING (true);


-- ============================================================================
-- 2. SUPABASE STORAGE BUCKETS & POLICIES
-- ============================================================================
-- Tunatengeneza 'tour-images' (kwa ajili ya safari photos, tours, activities)
-- na 'branding' (kwa ajili ya nembo/logo, favicon, vipeperushi)

-- Insert storage buckets if not already existing
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  (
    'tour-images',
    'tour-images',
    true,
    15728640, -- 15MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
  ),
  (
    'branding',
    'branding',
    true,
    10485760, -- 10MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'image/x-icon', 'image/vnd.microsoft.icon']
  )
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ----------------------------------------------------------------------------
-- Storage Policies (tour-images & branding)
-- ----------------------------------------------------------------------------
-- Drop old policies to prevent collision
DROP POLICY IF EXISTS "Public can view tour-images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view branding" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload to tour-images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload to branding" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update in tour-images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update in branding" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete in tour-images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete in branding" ON storage.objects;
DROP POLICY IF EXISTS "Public Access tour-images" ON storage.objects;
DROP POLICY IF EXISTS "Public Access branding" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload tour-images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update tour-images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete tour-images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload branding" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update branding" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete branding" ON storage.objects;

-- 1. Public Read Policies (Allow anyone to view images on website)
CREATE POLICY "Public can view tour-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'tour-images');

CREATE POLICY "Public can view branding"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'branding');

-- 2. Authenticated Upload Policies (Admin can upload files)
CREATE POLICY "Authenticated users can upload to tour-images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'tour-images');

CREATE POLICY "Authenticated users can upload to branding"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'branding');

-- 3. Authenticated Update Policies (Admin can overwrite/update files)
CREATE POLICY "Authenticated users can update in tour-images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'tour-images')
  WITH CHECK (bucket_id = 'tour-images');

CREATE POLICY "Authenticated users can update in branding"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'branding')
  WITH CHECK (bucket_id = 'branding');

-- 4. Authenticated Delete Policies (Admin can delete files)
CREATE POLICY "Authenticated users can delete in tour-images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'tour-images');

CREATE POLICY "Authenticated users can delete in branding"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'branding');


-- ============================================================================
-- 3. SCHEMA VERIFICATION & HELPER INDEXES
-- ============================================================================
-- Indexes kwa ajili ya kuongeza kasi ya tovuti (Speed & Query Optimization)

CREATE INDEX IF NOT EXISTS idx_site_settings_key 
  ON public.site_settings (key);

DO $$
BEGIN
  -- Check if tours table exists before creating index
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'tours'
  ) THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_tours_published_featured_created ON public.tours (is_published, is_featured, created_at DESC)';
  END IF;

  -- Check if activities table exists before creating index
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'activities'
  ) THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_activities_published_featured_created ON public.activities (is_published, is_featured, created_at DESC)';
  END IF;
END $$;


-- ============================================================================
-- 4. DEFAULT INITIAL SEED DATA (Infinity Voyage Content)
-- ============================================================================
-- Inatumia "ON CONFLICT (key) DO NOTHING" ili kama kuna data uliyobadilisha 
-- kwenye Admin Dashboard isifutwe wala kuharibika!

-- 4.1 GENERAL SETTINGS
INSERT INTO public.site_settings (key, value)
VALUES (
  'general',
  '{
    "siteName": "Infinity Voyage",
    "tagline": "Tours & Safaris",
    "logo": null,
    "favicon": null,
    "email": "info@infinityvoyagetours.com",
    "phone": "+255 758 241 294",
    "whatsapp": "+255 758 241 294",
    "address": "Kisauni, Stone Town, Zanzibar & Arusha, Tanzania"
  }'::jsonb
)
ON CONFLICT (key) DO NOTHING;

-- 4.2 NAVIGATION SETTINGS (Navbar & Mobile Drawer Links)
INSERT INTO public.site_settings (key, value)
VALUES (
  'navigation',
  '{
    "links": [
      { "label": "Zanzibar", "href": "/zanzibar" },
      { "label": "Safaris", "href": "/safaris" },
      { "label": "Transfers", "href": "/transfers" },
      { "label": "Calculator", "href": "/safari-calculator" },
      { "label": "Gallery", "href": "/gallery" },
      { "label": "Plan Trip", "href": "/plan-my-trip" },
      { "label": "Track Booking", "href": "/track-booking" },
      { "label": "FAQ", "href": "/faq" },
      { "label": "About Us", "href": "/about" },
      { "label": "Contact", "href": "/contact" }
    ]
  }'::jsonb
)
ON CONFLICT (key) DO NOTHING;

-- 4.3 WHY CHOOSE US SETTINGS
INSERT INTO public.site_settings (key, value)
VALUES (
  'whyChooseUs',
  '{
    "eyebrow": "The Infinity Difference",
    "heading": "Why Travel with Infinity Voyage?",
    "description": "We deliver seamless, memorable adventures across Tanzania''s national parks, mountains, and Indian Ocean islands.",
    "cards": [
      {
        "icon": "ShieldCheck",
        "title": "Safe & Fully Certified",
        "description": "Licensed tour operator in Tanzania and Zanzibar. Secure booking, insured safari vehicles, and top safety standards."
      },
      {
        "icon": "MapPin",
        "title": "Native Expert Guides",
        "description": "Born and raised in Tanzania. Our guides spot elusive wildlife and share authentic cultural insights throughout your trip."
      },
      {
        "icon": "Compass",
        "title": "Tailor-Made Itineraries",
        "description": "From luxury honeymoon escapes to family safaris and budget climbs, every detail is custom-built to match your preferences."
      },
      {
        "icon": "Headphones",
        "title": "24/7 Dedicated Support",
        "description": "Personal safari concierge from your first inquiry to your flight back home. Direct WhatsApp & phone assistance anytime."
      }
    ]
  }'::jsonb
)
ON CONFLICT (key) DO NOTHING;

-- 4.4 TESTIMONIALS SETTINGS
INSERT INTO public.site_settings (key, value)
VALUES (
  'testimonials',
  '{
    "eyebrow": "Traveler Reviews",
    "heading": "What Our Guests Say",
    "description": "Real feedback from international travelers who experienced Tanzania and Zanzibar with us.",
    "reviews": [
      {
        "id": 1,
        "name": "Sarah Jenkins",
        "location": "London, United Kingdom",
        "initials": "SJ",
        "tourType": "7-Day Serengeti & Ngorongoro Safari",
        "text": "The Serengeti safari was absolutely magical. Seeing the Big Five and the Great Migration up close was a lifelong dream. Our guide Dennis had eagle eyes and incredible wildlife knowledge. Infinity Voyage handled every single detail with perfection!",
        "rating": 5,
        "date": "July 2025"
      },
      {
        "id": 2,
        "name": "Dr. Michael Chen",
        "location": "Singapore",
        "initials": "MC",
        "tourType": "Machame Route Kilimanjaro Climb",
        "text": "Summiting Uhuru Peak with the Infinity team was the best adventure of my life. The mountain guides, porters, and camp chef were top class. Safety checks every morning and evening made all the difference.",
        "rating": 5,
        "date": "August 2025"
      },
      {
        "id": 3,
        "name": "Emma & David Thompson",
        "location": "Sydney, Australia",
        "initials": "ET",
        "tourType": "Zanzibar Luxury Honeymoon",
        "text": "Zanzibar was pure paradise! The private spice tour, dhow sunset cruise, and snorkeling around Mnemba Island were unforgettable. Super responsive team on WhatsApp throughout our entire stay.",
        "rating": 5,
        "date": "June 2025"
      },
      {
        "id": 4,
        "name": "Hans & Greta Mueller",
        "location": "Munich, Germany",
        "initials": "HM",
        "tourType": "5-Day Tarangire & Manyara Wildlife Safari",
        "text": "Unbelievable herds of elephants in Tarangire and tree-climbing lions in Lake Manyara. The 4x4 land cruiser was very comfortable with pop-up roof for photography. Will definitely travel with them again!",
        "rating": 5,
        "date": "September 2025"
      }
    ]
  }'::jsonb
)
ON CONFLICT (key) DO NOTHING;

-- 4.5 CALL TO ACTION SETTINGS
INSERT INTO public.site_settings (key, value)
VALUES (
  'callToAction',
  '{
    "badgeText": "Quick Response Within 2 Hours",
    "heading": "Ready to Start Your African Adventure?",
    "body": "Whether you want a private Serengeti migration safari, a Kilimanjaro summit expedition, or a relaxing Zanzibar beach holiday, our local travel experts are ready to craft your personalized quote.",
    "primaryButtonText": "Plan My Custom Trip",
    "whatsappMessage": "Hello! I''d like to plan a safari tour.",
    "valueBadges": [
      "Free Itinerary Consultation",
      "Best Price Guarantee",
      "Direct Local Booking"
    ]
  }'::jsonb
)
ON CONFLICT (key) DO NOTHING;

-- 4.6 FOOTER SETTINGS
INSERT INTO public.site_settings (key, value)
VALUES (
  'footer',
  '{
    "companyBlurb": "Premier Tanzania & Zanzibar tour operator. We create unforgettable tailor-made wildlife safaris, Kilimanjaro climbs, and tropical beach getaways with licensed expert local guides.",
    "newsletterTitle": "Subscribe for Safari Travel Deals & Guides",
    "newsletterSubtitle": "Get seasonal migration updates, park fee tips, and exclusive package discounts.",
    "quickLinks": [
      { "label": "Home", "href": "/" },
      { "label": "Safari Tours", "href": "/safaris" },
      { "label": "Zanzibar Excursions", "href": "/zanzibar" },
      { "label": "Airport Transfers", "href": "/transfers" },
      { "label": "Safari Calculator", "href": "/safari-calculator" },
      { "label": "Plan Custom Trip", "href": "/plan-my-trip" },
      { "label": "Photo Gallery", "href": "/gallery" },
      { "label": "Track My Booking", "href": "/track-booking" },
      { "label": "FAQ", "href": "/faq" },
      { "label": "About Infinity", "href": "/about" },
      { "label": "Contact Us", "href": "/contact" }
    ],
    "destinationLinks": [
      { "label": "Serengeti National Park", "href": "/safaris?destination=Serengeti" },
      { "label": "Ngorongoro Crater", "href": "/safaris?destination=Ngorongoro" },
      { "label": "Mount Kilimanjaro", "href": "/safaris?destination=Kilimanjaro" },
      { "label": "Tarangire National Park", "href": "/safaris?destination=Tarangire" },
      { "label": "Lake Manyara", "href": "/safaris?destination=Manyara" }
    ]
  }'::jsonb
)
ON CONFLICT (key) DO NOTHING;

-- 4.7 FAQ SETTINGS (Full 18 categorized Q&As)
INSERT INTO public.site_settings (key, value)
VALUES (
  'faq',
  '{
    "title": "Frequently Asked Questions",
    "subtitle": "Find answers to common questions about our safari tours, Zanzibar holidays, booking process, and travel preparation in Tanzania.",
    "items": [
      {
        "id": "faq-1",
        "category": "Booking & Reservations",
        "question": "How far in advance should I book my safari?",
        "answer": "We recommend booking at least 3-6 months in advance, especially for peak season (July-October and December-February). For high-demand destinations like the Serengeti during the Great Migration, booking 6-12 months ahead is advisable."
      },
      {
        "id": "faq-2",
        "category": "Booking & Reservations",
        "question": "What payment methods do you accept?",
        "answer": "We accept major credit cards (Visa, MasterCard, American Express), bank transfers, and PayPal. A 30% deposit is required to confirm your booking, with the balance due 60 days before departure."
      },
      {
        "id": "faq-3",
        "category": "Booking & Reservations",
        "question": "What is your cancellation policy?",
        "answer": "Cancellations made 60+ days before departure receive a full refund minus a $100 admin fee. 30-59 days: 50% refund. Less than 30 days: No refund. We strongly recommend travel insurance."
      },
      {
        "id": "faq-4",
        "category": "Booking & Reservations",
        "question": "Can I customize my safari itinerary?",
        "answer": "Absolutely! All our safaris can be customized to your preferences. Contact us with your interests, travel dates, and budget, and we''ll create a personalized itinerary for you."
      },
      {
        "id": "faq-5",
        "category": "Safari Experience",
        "question": "What is the best time to visit Tanzania for a safari?",
        "answer": "The dry season (June-October) offers the best wildlife viewing as animals gather around water sources. The Great Migration in Serengeti is spectacular from July-October. The green season (November-May) offers lush landscapes and fewer crowds."
      },
      {
        "id": "faq-6",
        "category": "Safari Experience",
        "question": "What should I pack for a safari?",
        "answer": "Essential items include: neutral-colored clothing (khaki, olive, brown), comfortable walking shoes, sun hat, sunscreen, insect repellent, binoculars, camera with zoom lens, light jacket for early mornings, and any personal medications."
      },
      {
        "id": "faq-7",
        "category": "Safari Experience",
        "question": "Is it safe to go on a safari?",
        "answer": "Yes, safaris are very safe when conducted with professional guides. Our guides are highly trained and experienced. You''ll always be accompanied, and we follow strict safety protocols. Wildlife is observed from safe distances."
      },
      {
        "id": "faq-8",
        "category": "Safari Experience",
        "question": "What type of accommodation is available?",
        "answer": "We offer various options from luxury lodges and tented camps to budget camping. Lodges offer hotel-like amenities, while tented camps provide an authentic bush experience with comfortable beds and en-suite facilities."
      },
      {
        "id": "faq-9",
        "category": "Zanzibar Excursions",
        "question": "How do I get to Zanzibar from mainland Tanzania?",
        "answer": "You can fly directly to Zanzibar from Dar es Salaam (20 min), Arusha, or Kilimanjaro. Alternatively, take a ferry from Dar es Salaam (2 hours). We can arrange all transfers for you."
      },
      {
        "id": "faq-10",
        "category": "Zanzibar Excursions",
        "question": "What activities are available in Zanzibar?",
        "answer": "Popular activities include: Stone Town cultural tours, spice farm visits, dolphin watching, snorkeling and diving, sunset dhow cruises, Prison Island trips, Jozani Forest visits, and beach relaxation."
      },
      {
        "id": "faq-11",
        "category": "Zanzibar Excursions",
        "question": "Is Zanzibar suitable for families with children?",
        "answer": "Yes! Zanzibar is family-friendly with many kid-appropriate activities like beach time, swimming with dolphins, visiting the turtle sanctuary, and exploring spice farms. We can customize family-friendly itineraries."
      },
      {
        "id": "faq-12",
        "category": "Health & Safety",
        "question": "Do I need vaccinations to visit Tanzania?",
        "answer": "Yellow fever vaccination is required if arriving from an endemic country. Recommended vaccines include Hepatitis A & B, Typhoid, and Tetanus. Malaria prophylaxis is strongly advised. Consult your doctor 6-8 weeks before travel."
      },
      {
        "id": "faq-13",
        "category": "Health & Safety",
        "question": "Is travel insurance required?",
        "answer": "Yes, comprehensive travel insurance is mandatory for all our tours. It should cover medical evacuation, trip cancellation, and personal belongings. We can recommend trusted insurance providers."
      },
      {
        "id": "faq-14",
        "category": "Health & Safety",
        "question": "What about COVID-19 requirements?",
        "answer": "Requirements change frequently. Currently, Tanzania has minimal restrictions. Check the latest guidelines before travel. We''ll provide updated information during the booking process."
      },
      {
        "id": "faq-15",
        "category": "Practical Information",
        "question": "What currency is used in Tanzania?",
        "answer": "The Tanzanian Shilling (TZS) is the local currency, but US Dollars are widely accepted. Credit cards work in major hotels and lodges. ATMs are available in cities. Bring some cash for tips and small purchases."
      },
      {
        "id": "faq-16",
        "category": "Practical Information",
        "question": "Do I need a visa to visit Tanzania?",
        "answer": "Most nationalities need a visa. Tourist visas can be obtained online (e-visa) or on arrival at major entry points. Single-entry visas cost $50 USD. Check requirements for your nationality."
      },
      {
        "id": "faq-17",
        "category": "Practical Information",
        "question": "What language is spoken in Tanzania?",
        "answer": "Swahili and English are the official languages. English is widely spoken in tourist areas. Our guides speak fluent English. Learning a few Swahili phrases like ''Jambo'' (Hello) and ''Asante'' (Thank you) is appreciated!"
      },
      {
        "id": "faq-18",
        "category": "Practical Information",
        "question": "How much should I budget for tips?",
        "answer": "Tipping is customary in Tanzania. Guidelines: Safari guides $20-25/day, camp/lodge staff $10-15/day shared, hotel porters $1-2/bag. Tips are pooled and shared among staff at most establishments."
      }
    ]
  }'::jsonb
)
ON CONFLICT (key) DO NOTHING;

-- 4.8 SOCIAL MEDIA & CONTACT SETTINGS (Optional bonus seeds)
INSERT INTO public.site_settings (key, value)
VALUES (
  'social',
  '{
    "facebook": "https://facebook.com/infinityvoyage",
    "instagram": "https://instagram.com/infinityvoyage",
    "twitter": "https://twitter.com/infinityvoyage",
    "youtube": "https://youtube.com/@infinityvoyage",
    "tripadvisor": "https://tripadvisor.com"
  }'::jsonb
)
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.site_settings (key, value)
VALUES (
  'hero',
  '{
    "badgeText": "Tanzania & Zanzibar Luxury Tour Operator",
    "searchPlaceholder": "Serengeti, Zanzibar, Kilimanjaro...",
    "trustBadges": [
      { "icon": "ShieldCheck", "text": "100% Tailor-Made" },
      { "icon": "Star", "text": "Top Rated Guides" },
      { "icon": "MapPin", "text": "Local Experts in Arusha & Zanzibar" }
    ],
    "topDestinations": [
      "Serengeti National Park",
      "Ngorongoro Crater",
      "Zanzibar Island",
      "Mount Kilimanjaro",
      "Tarangire National Park",
      "Stone Town"
    ]
  }'::jsonb
)
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.site_settings (key, value)
VALUES (
  'about',
  '{
    "heroTitle": "Our Story",
    "heroSubtitle": "Your gateway to endless exploration in the heart of East Africa.",
    "foundedYear": "2009",
    "story": "Founded in 2009 by a group of passionate Tanzanian travel enthusiasts, Infinity Voyage Tours & Safaris was born from a simple belief: everyone deserves to experience the magic of Africa in its purest form.",
    "mission": "We do not just show you Tanzania; we invite you to feel it, taste it, and become part of its eternal story.",
    "stats": {
      "travelers": "5000+",
      "experience": "15+",
      "destinations": "50+"
    },
    "values": [
      { "title": "Authentic Experiences", "description": "We go beyond typical tourist routes to show you the real Tanzania." },
      { "title": "Sustainable Tourism", "description": "We partner with local communities and conservation projects." },
      { "title": "Expert Local Guides", "description": "Our guides are passionate Tanzanians with deep knowledge." },
      { "title": "Personalized Service", "description": "We customize every itinerary to match your interests." }
    ]
  }'::jsonb
)
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.site_settings (key, value)
VALUES (
  'homepage',
  '{
    "heroTitle": "Discover Tanzania''s Untamed Beauty",
    "heroSubtitle": "Embark on an extraordinary journey through the Serengeti, climb Kilimanjaro, and relax on Zanzibar''s pristine beaches",
    "heroVideo": null,
    "showDestinations": true,
    "showPackages": true,
    "showTestimonials": true,
    "showWhyChooseUs": true,
    "showStats": true,
    "showCallToAction": true
  }'::jsonb
)
ON CONFLICT (key) DO NOTHING;


-- ============================================================================
-- 5. VERIFICATION & SUCCESS CHECK
-- ============================================================================
-- Display summary of site settings and storage buckets created

SELECT '--- SITE SETTINGS RECORDS INSTALLED ---' AS status_category;
SELECT key, updated_at FROM public.site_settings ORDER BY key ASC;

SELECT '--- STORAGE BUCKETS READY ---' AS status_category;
SELECT id, name, public, file_size_limit FROM storage.buckets WHERE id IN ('tour-images', 'branding');
