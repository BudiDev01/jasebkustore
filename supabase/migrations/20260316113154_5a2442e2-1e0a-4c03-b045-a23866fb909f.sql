
-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS: admins can view all roles, users can view their own
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Create page_visits table for visitor tracking
CREATE TABLE public.page_visits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    page_path TEXT NOT NULL DEFAULT '/',
    user_agent TEXT,
    referrer TEXT
);

ALTER TABLE public.page_visits ENABLE ROW LEVEL SECURITY;

-- Anyone can insert visits (even anonymous)
CREATE POLICY "Anyone can record visits"
ON public.page_visits FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only admins can read visits
CREATE POLICY "Admins can view visits"
ON public.page_visits FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
