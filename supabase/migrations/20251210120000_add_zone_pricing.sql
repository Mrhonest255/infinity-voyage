-- Add zone-based pricing to activities
-- This allows different prices based on pickup location zones

-- Add zone_prices column to activities table (JSONB for flexible pricing)
ALTER TABLE activities ADD COLUMN IF NOT EXISTS zone_prices JSONB DEFAULT '{}'::jsonb;

-- Add zone_prices column to tours table as well
ALTER TABLE tours ADD COLUMN IF NOT EXISTS zone_prices JSONB DEFAULT '{}'::jsonb;

-- Create a reference table for pickup zones
CREATE TABLE IF NOT EXISTS pickup_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  display_name VARCHAR(150) NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default pickup zones based on the PDF pricing structure
INSERT INTO pickup_zones (name, display_name, description, sort_order) VALUES
  ('stone_town', 'Stone Town Hotels', 'Hotels in Stone Town and central area', 1),
  ('beach_north', 'North Coast Beach Hotels', 'Nungwi, Kendwa and nearby beach resorts', 2),
  ('beach_east', 'East Coast Beach Hotels', 'Paje, Jambiani, Bwejuu and nearby beaches', 3),
  ('beach_south', 'South Coast Beach Hotels', 'Kizimkazi and southern beaches', 4),
  ('airport', 'Airport Pickup', 'Direct pickup from Zanzibar Airport', 5)
ON CONFLICT (name) DO NOTHING;

-- Enable RLS on pickup_zones
ALTER TABLE pickup_zones ENABLE ROW LEVEL SECURITY;

-- Allow public read access to pickup zones
CREATE POLICY "Anyone can read pickup zones" ON pickup_zones
  FOR SELECT USING (true);

-- Only authenticated users can modify pickup zones  
CREATE POLICY "Authenticated users can modify pickup zones" ON pickup_zones
  FOR ALL USING (auth.role() = 'authenticated');

-- Add comments for documentation
COMMENT ON COLUMN activities.zone_prices IS 'JSON object with zone-based pricing, e.g., {"stone_town": 25, "beach_north": 35, "beach_east": 40}';
COMMENT ON COLUMN tours.zone_prices IS 'JSON object with zone-based pricing for tours';
COMMENT ON TABLE pickup_zones IS 'Reference table for pickup location zones with display names';
