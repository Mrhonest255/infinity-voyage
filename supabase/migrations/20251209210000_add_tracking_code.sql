-- Add tracking_code column to bookings table for customer tracking
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS tracking_code TEXT UNIQUE;

-- Create function to generate tracking code
CREATE OR REPLACE FUNCTION generate_tracking_code()
RETURNS TRIGGER AS $$
DECLARE
  new_code TEXT;
  code_exists BOOLEAN;
BEGIN
  LOOP
    -- Generate code format: IV-XXXXXX (6 random alphanumeric characters)
    new_code := 'IV-' || upper(substr(md5(random()::text || clock_timestamp()::text), 1, 6));
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM public.bookings WHERE tracking_code = new_code) INTO code_exists;
    
    -- Exit loop if unique
    IF NOT code_exists THEN
      EXIT;
    END IF;
  END LOOP;
  
  NEW.tracking_code := new_code;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate tracking code on insert
DROP TRIGGER IF EXISTS set_booking_tracking_code ON public.bookings;
CREATE TRIGGER set_booking_tracking_code
  BEFORE INSERT ON public.bookings
  FOR EACH ROW
  WHEN (NEW.tracking_code IS NULL)
  EXECUTE FUNCTION generate_tracking_code();

-- Update existing bookings without tracking codes
UPDATE public.bookings 
SET tracking_code = 'IV-' || upper(substr(md5(id::text || created_at::text), 1, 6))
WHERE tracking_code IS NULL;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_bookings_tracking_code ON public.bookings(tracking_code);

-- Allow public to read their own booking by tracking code (RLS policy)
CREATE POLICY "Anyone can view booking by tracking code"
  ON public.bookings FOR SELECT
  USING (true);
