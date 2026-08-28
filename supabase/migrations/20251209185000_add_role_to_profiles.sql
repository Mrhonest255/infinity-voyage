-- Add role column to profiles table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'role'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'user';
  END IF;
END $$;

-- Update existing admin user if exists
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'admin@infinityvoyage.com' OR email LIKE '%admin%';
