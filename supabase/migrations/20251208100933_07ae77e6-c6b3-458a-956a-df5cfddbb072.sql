-- Create site_settings table for admin to control website content
CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read settings (public website needs this)
CREATE POLICY "Anyone can view site settings"
ON public.site_settings
FOR SELECT
USING (true);

-- Only admins can modify settings
CREATE POLICY "Admins can insert settings"
ON public.site_settings
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update settings"
ON public.site_settings
FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete settings"
ON public.site_settings
FOR DELETE
USING (has_role(auth.uid(), 'admin'));

-- Add trigger for updated_at
CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default settings
INSERT INTO public.site_settings (key, value) VALUES
('general', '{
  "siteName": "Bongo Safari",
  "tagline": "Experience the Wild Heart of Africa",
  "logo": null,
  "favicon": null,
  "email": "info@bongosafari.com",
  "phone": "+255 123 456 789",
  "whatsapp": "+255 123 456 789",
  "address": "Arusha, Tanzania"
}'::jsonb),
('social', '{
  "facebook": "https://facebook.com",
  "instagram": "https://instagram.com",
  "twitter": "https://twitter.com",
  "youtube": "https://youtube.com",
  "tripadvisor": ""
}'::jsonb),
('homepage', '{
  "heroTitle": "Discover Tanzania''s Untamed Beauty",
  "heroSubtitle": "Embark on an extraordinary journey through the Serengeti, climb Kilimanjaro, and relax on Zanzibar''s pristine beaches",
  "heroVideo": null,
  "showDestinations": true,
  "showPackages": true,
  "showTestimonials": true,
  "showWhyChooseUs": true
}'::jsonb);