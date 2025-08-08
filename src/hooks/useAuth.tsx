
import { useUser, useAuth as useClerkAuth } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';
import { logAuthSuccess, logAuthFailure } from '@/utils/securityLogger';

export const useAuth = () => {
  const { user, isLoaded } = useUser();
  const { getToken } = useClerkAuth();

  useEffect(() => {
    const setSupabaseSession = async () => {
      if (isLoaded && user) {
        try {
          console.log('Setting up Supabase session for user:', user.id);
          
          // Get the JWT token with Supabase template
          const token = await getToken({ template: 'supabase' });
          
          if (token) {
            console.log('Successfully obtained Clerk JWT token');
            // Set the session with the proper Clerk JWT token
            const { error } = await supabase.auth.setSession({
              access_token: token,
              refresh_token: 'clerk-refresh-token', // Clerk handles refresh
            });
            
            if (error) {
              console.error('Error setting Supabase session with Clerk token:', error);
              logAuthFailure(`Failed to set Supabase session: ${error.message}`);
            } else {
              console.log('Supabase session set successfully');
              logAuthSuccess(user.id);
            }
          } else {
            console.error('Failed to obtain Clerk JWT token - check Supabase integration setup');
            logAuthFailure('Failed to obtain Clerk JWT token');
          }
        } catch (error) {
          console.error('Error in authentication flow:', error);
          logAuthFailure(`Authentication flow error: ${error}`);
        }
      } else if (isLoaded && !user) {
        // User is not authenticated, clear the session
        console.log('User not authenticated, clearing Supabase session');
        await supabase.auth.signOut();
      }
    };

    setSupabaseSession();
  }, [user, isLoaded, getToken]);

  return {
    user,
    isLoaded,
    isAuthenticated: !!user
  };
};
