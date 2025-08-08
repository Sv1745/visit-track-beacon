
-- Phase 1: Enable Row Level Security on all tables
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requirements ENABLE ROW LEVEL SECURITY;

-- Fix the get_clerk_user_id() function to properly extract user ID from JWT
CREATE OR REPLACE FUNCTION public.get_clerk_user_id()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $function$
BEGIN
  -- Extract the Clerk user ID from the JWT claims
  RETURN COALESCE(
    current_setting('request.jwt.claims', true)::json->>'clerk_user_id',
    current_setting('request.jwt.claims', true)::json->>'sub'
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$function$;

-- Recreate RLS policies to ensure they work with the fixed function
DROP POLICY IF EXISTS "Users can manage their own companies" ON public.companies;
DROP POLICY IF EXISTS "Users can manage their own customers" ON public.customers;
DROP POLICY IF EXISTS "Users can manage their own visits" ON public.visits;
DROP POLICY IF EXISTS "Users can manage their own requirements" ON public.requirements;

-- Create proper RLS policies
CREATE POLICY "Users can manage their own companies" 
ON public.companies 
FOR ALL 
USING (user_id = get_clerk_user_id())
WITH CHECK (user_id = get_clerk_user_id());

CREATE POLICY "Users can manage their own customers" 
ON public.customers 
FOR ALL 
USING (user_id = get_clerk_user_id())
WITH CHECK (user_id = get_clerk_user_id());

CREATE POLICY "Users can manage their own visits" 
ON public.visits 
FOR ALL 
USING (user_id = get_clerk_user_id())
WITH CHECK (user_id = get_clerk_user_id());

CREATE POLICY "Users can manage their own requirements" 
ON public.requirements 
FOR ALL 
USING (user_id = get_clerk_user_id())
WITH CHECK (user_id = get_clerk_user_id());
