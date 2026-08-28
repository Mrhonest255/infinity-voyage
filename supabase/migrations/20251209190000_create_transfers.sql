-- Create transfers table for managing airport/hotel transfer services
CREATE TABLE IF NOT EXISTS public.transfers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  transfer_type TEXT NOT NULL DEFAULT 'airport', -- airport, hotel, port
  route_from TEXT NOT NULL,
  route_to TEXT NOT NULL,
  price_small_group NUMERIC, -- 1-6 passengers
  price_large_group NUMERIC, -- 7-12 passengers
  vehicle_type TEXT, -- sedan, minivan, bus
  max_passengers INTEGER DEFAULT 12,
  duration TEXT,
  featured_image TEXT,
  gallery TEXT[] DEFAULT '{}',
  features TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.transfers ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view published transfers" 
  ON public.transfers FOR SELECT 
  USING (is_published = true);

CREATE POLICY "Admins can manage transfers" 
  ON public.transfers FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Insert sample data
INSERT INTO public.transfers (title, slug, description, short_description, transfer_type, route_from, route_to, price_small_group, price_large_group, vehicle_type, max_passengers, duration, features, is_featured) VALUES
(
  'Airport to Town Hotels',
  'airport-town-hotels',
  'Comfortable airport transfer service to all major town hotels in Stone Town and surrounding areas. Our professional drivers ensure a smooth and safe journey.',
  'Private transfer from Zanzibar Airport to Town Hotels',
  'airport',
  'Zanzibar Airport (ZNZ)',
  'Stone Town Hotels',
  27,
  54,
  'minivan',
  12,
  '20-30 minutes',
  ARRAY['Air-conditioned vehicle', 'Professional driver', 'Meet & greet service', 'Luggage assistance', 'Free waiting time', '24/7 availability'],
  true
),
(
  'Airport to Beach Hotels (North)',
  'airport-beach-hotels-north',
  'Premium transfer service from Zanzibar Airport to the beautiful North Coast beach hotels including Nungwi and Kendwa areas.',
  'Private transfer from Zanzibar Airport to North Coast Beach Hotels',
  'airport',
  'Zanzibar Airport (ZNZ)',
  'North Coast (Nungwi/Kendwa)',
  60,
  115,
  'minivan',
  12,
  '60-75 minutes',
  ARRAY['Air-conditioned vehicle', 'Professional driver', 'Meet & greet service', 'Luggage assistance', 'Complimentary water', 'Scenic route option'],
  true
),
(
  'Airport to Beach Hotels (East)',
  'airport-beach-hotels-east',
  'Convenient transfer to the stunning East Coast beaches including Paje, Jambiani, and Bwejuu areas.',
  'Private transfer from Zanzibar Airport to East Coast Beach Hotels',
  'airport',
  'Zanzibar Airport (ZNZ)',
  'East Coast (Paje/Jambiani)',
  55,
  105,
  'minivan',
  12,
  '45-60 minutes',
  ARRAY['Air-conditioned vehicle', 'Professional driver', 'Meet & greet service', 'Luggage assistance', 'Complimentary water'],
  true
),
(
  'Stone Town to Nungwi',
  'stonetown-nungwi',
  'Direct transfer from Stone Town to the famous Nungwi beach area on the northern tip of Zanzibar.',
  'Private transfer from Stone Town to Nungwi Beach',
  'hotel',
  'Stone Town',
  'Nungwi Beach',
  50,
  95,
  'minivan',
  12,
  '50-60 minutes',
  ARRAY['Air-conditioned vehicle', 'Professional driver', 'Luggage assistance', 'Flexible pickup time'],
  false
),
(
  'Port Transfer - Ferry Terminal',
  'port-ferry-terminal',
  'Transfer service to and from the Zanzibar Ferry Terminal for arrivals from Dar es Salaam.',
  'Transfer to/from Zanzibar Ferry Terminal',
  'port',
  'Ferry Terminal',
  'Any Hotel',
  25,
  45,
  'minivan',
  12,
  '10-30 minutes',
  ARRAY['Air-conditioned vehicle', 'Professional driver', 'Meet at arrival gate', 'Luggage assistance'],
  false
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_transfers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER transfers_updated_at
  BEFORE UPDATE ON public.transfers
  FOR EACH ROW
  EXECUTE FUNCTION update_transfers_updated_at();
