
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://wmixkyfwpozfsvcqzkfj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndtaXhreWZ3cG96ZnN2Y3F6a2ZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NzY3OTIsImV4cCI6MjA2NjM1Mjc5Mn0.NP6zDDKpN0wfJ4nipVVNV8ztmScSqz3M9NCJsI9MCXY";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Helper function to get user ID from Clerk
export const getCurrentUserId = () => {
  if (typeof window !== 'undefined') {
    const clerkUser = (window as any).__clerk_user;
    return clerkUser?.id || null;
  }
  return null;
};
