
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://wmixkyfwpozfsvcqzkfj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndtaXhreWZ3cG96ZnN2Y3F6a2ZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NzY3OTIsImV4cCI6MjA2NjM1Mjc5Mn0.NP6zDDKpN0wfJ4nipVVNV8ztmScSqz3M9NCJsI9MCXY";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    storage: window.localStorage,
  },
  global: {
    headers: {
      'x-application-name': 'visit-tracker'
    }
  }
});

// Helper function to get current Clerk user ID
export const getCurrentClerkUserId = () => {
  if (typeof window !== 'undefined') {
    const clerk = (window as any).Clerk;
    return clerk?.user?.id || null;
  }
  return null;
};
