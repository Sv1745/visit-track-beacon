
import { useUser } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';

export const useAuth = () => {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    // Create a fake session for Supabase when user is authenticated with Clerk
    if (isLoaded && user) {
      // Set a fake session to make Supabase think the user is authenticated
      const fakeSession = {
        access_token: 'fake-token',
        refresh_token: 'fake-refresh',
        expires_in: 3600,
        token_type: 'bearer',
        user: {
          id: user.id,
          email: user.primaryEmailAddress?.emailAddress || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      };

      // This is a workaround to make Supabase RLS work with Clerk
      // We set the session manually
      supabase.auth.setSession(fakeSession as any);
    }
  }, [user, isLoaded]);

  return {
    user,
    isLoaded,
    isAuthenticated: !!user
  };
};
