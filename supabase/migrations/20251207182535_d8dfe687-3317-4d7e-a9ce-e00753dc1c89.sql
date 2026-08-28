-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create tours table
CREATE TABLE public.tours (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    short_description TEXT,
    duration TEXT,
    price DECIMAL(10,2),
    currency TEXT DEFAULT 'USD',
    category TEXT NOT NULL DEFAULT 'safari',
    difficulty TEXT DEFAULT 'moderate',
    max_group_size INTEGER DEFAULT 12,
    included TEXT[],
    excluded TEXT[],
    itinerary JSONB,
    highlights TEXT[],
    featured_image TEXT,
    gallery TEXT[],
    is_featured BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT false,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;

-- Create activities table (for Zanzibar excursions)
CREATE TABLE public.activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    short_description TEXT,
    duration TEXT,
    price DECIMAL(10,2),
    currency TEXT DEFAULT 'USD',
    location TEXT,
    category TEXT DEFAULT 'excursion',
    included TEXT[],
    excluded TEXT[],
    highlights TEXT[],
    featured_image TEXT,
    gallery TEXT[],
    is_featured BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT false,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- Create bookings table
CREATE TABLE public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tour_id UUID REFERENCES public.tours(id) ON DELETE SET NULL,
    activity_id UUID REFERENCES public.activities(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    travel_date DATE NOT NULL,
    number_of_guests INTEGER DEFAULT 1,
    special_requests TEXT,
    status TEXT DEFAULT 'pending',
    total_price DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT booking_type_check CHECK (tour_id IS NOT NULL OR activity_id IS NOT NULL)
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tours_updated_at
    BEFORE UPDATE ON public.tours
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_activities_updated_at
    BEFORE UPDATE ON public.activities
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data ->> 'full_name');
    RETURN NEW;
END;
$$;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS Policies

-- Profiles policies
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- User roles policies
CREATE POLICY "Users can view their own roles"
    ON public.user_roles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
    ON public.user_roles FOR ALL
    USING (public.has_role(auth.uid(), 'admin'));

-- Tours policies (public can view published, admins can manage all)
CREATE POLICY "Anyone can view published tours"
    ON public.tours FOR SELECT
    USING (is_published = true);

CREATE POLICY "Admins can view all tours"
    ON public.tours FOR SELECT
    USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert tours"
    ON public.tours FOR INSERT
    WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update tours"
    ON public.tours FOR UPDATE
    USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete tours"
    ON public.tours FOR DELETE
    USING (public.has_role(auth.uid(), 'admin'));

-- Activities policies
CREATE POLICY "Anyone can view published activities"
    ON public.activities FOR SELECT
    USING (is_published = true);

CREATE POLICY "Admins can view all activities"
    ON public.activities FOR SELECT
    USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert activities"
    ON public.activities FOR INSERT
    WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update activities"
    ON public.activities FOR UPDATE
    USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete activities"
    ON public.activities FOR DELETE
    USING (public.has_role(auth.uid(), 'admin'));

-- Bookings policies
CREATE POLICY "Admins can view all bookings"
    ON public.bookings FOR SELECT
    USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can create bookings"
    ON public.bookings FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Admins can update bookings"
    ON public.bookings FOR UPDATE
    USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete bookings"
    ON public.bookings FOR DELETE
    USING (public.has_role(auth.uid(), 'admin'));

-- Create storage bucket for tour images
INSERT INTO storage.buckets (id, name, public) VALUES ('tour-images', 'tour-images', true);

-- Storage policies
CREATE POLICY "Anyone can view tour images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'tour-images');

CREATE POLICY "Admins can upload tour images"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'tour-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update tour images"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'tour-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete tour images"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'tour-images' AND public.has_role(auth.uid(), 'admin'));