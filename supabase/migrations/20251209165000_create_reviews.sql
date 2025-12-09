-- Create reviews table for tours and site-wide feedback
CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id uuid REFERENCES public.tours(id) ON DELETE CASCADE,
  name text NOT NULL,
  rating int NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text NOT NULL,
  is_approved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Public can read approved reviews
CREATE POLICY "Anyone can view approved reviews"
  ON public.reviews
  FOR SELECT
  USING (is_approved = true);

-- Public can create reviews (awaiting approval)
CREATE POLICY "Anyone can create reviews"
  ON public.reviews
  FOR INSERT
  WITH CHECK (true);

-- Admins manage reviews
CREATE POLICY "Admins can manage reviews"
  ON public.reviews
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

