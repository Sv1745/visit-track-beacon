
import { useUser, useAuth as useClerkAuth } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';

export const useAuth = () => {
  const { user, isLoaded } = useUser();
  const { getToken } = useClerkAuth();

  useEffect(() => {
    const setSupabaseSession = async () => {
      if (isLoaded && user) {
        try {
          // Get the JWT token using the getToken method from useAuth
          const token = await getToken({ template: 'supabase' });
          
          if (token) {
            // Set the session with the Clerk JWT token
            await supabase.auth.setSession({
              access_token: token,
              refresh_token: 'clerk-refresh-token',
            });
          } else {
            // Fallback: create a simple session with user info
            const fakeSession = {
              access_token: `clerk-${user.id}`,
              refresh_token: 'clerk-refresh',
              expires_in: 3600,
              token_type: 'bearer',
              user: {
                id: user.id,
                email: user.primaryEmailAddress?.emailAddress || '',
                user_metadata: {
                  clerk_user_id: user.id,
                  email: user.primaryEmailAddress?.emailAddress || '',
                  full_name: user.fullName || '',
                },
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }
            };

            await supabase.auth.setSession(fakeSession as any);
          }
        } catch (error) {
          console.error('Error setting Supabase session:', error);
          
          // Fallback session creation
          const fakeSession = {
            access_token: `clerk-${user.id}`,
            refresh_token: 'clerk-refresh',
            expires_in: 3600,
            token_type: 'bearer',
            user: {
              id: user.id,
              email: user.primaryEmailAddress?.emailAddress || '',
              user_metadata: {
                clerk_user_id: user.id,
              },
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          };

          await supabase.auth.setSession(fakeSession as any);
        }
      } else if (isLoaded && !user) {
        // User is not authenticated, clear the session
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
