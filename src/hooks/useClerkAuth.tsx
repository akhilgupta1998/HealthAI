
import { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useClerkAuth = () => {
  const { getToken } = useAuth();
  const { user, isLoaded, isSignedIn } = useUser();
  const [supabaseUser, setSupabaseUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userMetadata, setUserMetadata] = useState<any>(null);

  useEffect(() => {
    const syncWithSupabase = async () => {
      try {
        if (!isLoaded || !isSignedIn) {
          setIsLoading(false);
          return;
        }
        
        setIsLoading(true);

        // Set user metadata
        if (user) {
          setUserMetadata({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            fullName: user.fullName,
            email: user.primaryEmailAddress?.emailAddress,
            avatar_url: user.imageUrl
          });
        }
        
        // Get the Supabase token from Clerk
        const token = await getToken({ template: 'supabase' });
        
        if (!token) {
          throw new Error('Could not get Supabase token');
        }
        
        // Set the auth cookie for Supabase
        const { data, error } = await supabase.auth.setSession({
          access_token: token,
          refresh_token: '',
        });
        
        if (error) throw error;
        
        // Check if user profile exists
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error fetching user profile:', profileError);
        }
        
        // If not, create a profile
        if (!profileData) {
          const { error: insertError } = await supabase
            .from('user_profiles')
            .insert([{
              id: user.id,
              clerk_id: user.id,
              display_name: user.fullName || user.username || user.emailAddresses?.[0]?.emailAddress,
              avatar_url: user.imageUrl,
            }]);
            
          if (insertError) {
            console.error('Error creating user profile:', insertError);
          }
        } else if (!profileData.clerk_id) {
          // Update the profile with clerk_id if it doesn't exist
          const { error: updateError } = await supabase
            .from('user_profiles')
            .update({ clerk_id: user.id })
            .eq('id', user.id);
            
          if (updateError) {
            console.error('Error updating user profile with clerk_id:', updateError);
          }
        }
        
        setSupabaseUser(data.user);
      } catch (error: any) {
        console.error('Error syncing with Supabase:', error);
        toast.error('Error syncing user data');
      } finally {
        setIsLoading(false);
      }
    };
    
    syncWithSupabase();
  }, [isLoaded, isSignedIn, user, getToken]);
  
  return {
    user: supabaseUser,
    clerkUser: user,
    userId: user?.id || null,
    userMetadata,
    isLoading,
    isAuthenticated: !!supabaseUser && isSignedIn,
  };
};
