
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser, useAuth, useClerk, useSession } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UserMetadata {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  fullName?: string | null;
  email?: string | null;
  avatar_url?: string | null;
  emailAddresses?: Array<{emailAddress: string}>;
}

interface ClerkContextType {
  user: any;
  userMetadata: UserMetadata | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  userId: string | null;
  sessionId: string | null;
  signOut: () => Promise<void>;
  syncUserWithSupabase: () => Promise<void>;
}

const ClerkContext = createContext<ClerkContextType>({
  user: null,
  userMetadata: null,
  isLoading: true,
  isAuthenticated: false,
  userId: null,
  sessionId: null,
  signOut: async () => {},
  syncUserWithSupabase: async () => {},
});

export const useClerkContext = () => useContext(ClerkContext);

export const ClerkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const { signOut: clerkSignOut } = useClerk();
  const { session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [userMetadata, setUserMetadata] = useState<UserMetadata | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<any>(null);
  const [syncAttempts, setSyncAttempts] = useState(0);
  const [lastSyncTime, setLastSyncTime] = useState(0);

  // Function to sign out
  const handleSignOut = async () => {
    try {
      await clerkSignOut();
      // Clear Supabase session
      await supabase.auth.signOut();
      setSupabaseUser(null);
      setUserMetadata(null);
      toast.success("Successfully signed out");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Error signing out");
    }
  };

  // Function to sync with Supabase
  const syncUserWithSupabase = async () => {
    const now = Date.now();
    
    // Prevent multiple syncs within a short time period
    if (now - lastSyncTime < 2000 && syncAttempts > 0) {
      console.log("Skipping sync - too frequent");
      return;
    }
    
    setSyncAttempts(prev => prev + 1);
    setLastSyncTime(now);
    
    try {
      if (!isLoaded || !isSignedIn) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      
      // Set user metadata
      if (user) {
        console.log('Setting user metadata for user:', user.id);
        setUserMetadata({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: user.fullName,
          email: user.primaryEmailAddress?.emailAddress,
          avatar_url: user.imageUrl,
          emailAddresses: user.emailAddresses?.map(email => ({
            emailAddress: email.emailAddress
          }))
        });
      }
      
      // Get the Supabase token from Clerk
      console.log('Getting Supabase token from Clerk...');
      const token = await getToken({ template: 'supabase' });
      
      if (!token) {
        throw new Error('Could not get Supabase token');
      }
      
      // Set the auth cookie for Supabase
      console.log('Setting Supabase session with token...');
      const { data, error } = await supabase.auth.setSession({
        access_token: token,
        refresh_token: '',
      });
      
      if (error) {
        console.error('Error setting Supabase session:', error);
        throw error;
      }
      
      console.log('Supabase session set successfully');
      
      // Check if user profile exists
      console.log('Checking if user profile exists...');
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (profileError) {
        if (profileError.code !== 'PGRST116') {
          console.error('Error fetching user profile:', profileError);
        }
        console.log('User profile not found, creating new profile...');
      }
      
      // If not, create a profile
      if (!profileData) {
        console.log('Creating new user profile...');
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
        } else {
          console.log('User profile created successfully');
        }
      } else if (!profileData.clerk_id) {
        // Update the profile with clerk_id if it doesn't exist
        console.log('Updating user profile with clerk_id...');
        const { error: updateError } = await supabase
          .from('user_profiles')
          .update({ clerk_id: user.id })
          .eq('id', user.id);
          
        if (updateError) {
          console.error('Error updating user profile with clerk_id:', updateError);
        } else {
          console.log('User profile updated successfully');
        }
      }
      
      setSupabaseUser(data.user);
      setIsLoading(false);
    } catch (error: any) {
      console.error('Error syncing with Supabase:', error);
      toast.error('Error syncing user data');
      setIsLoading(false);
      throw error;
    }
  };
  
  // Expose syncUserWithSupabase globally for access from other components
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.clerkContext = {
        syncUserWithSupabase
      };
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        delete window.clerkContext;
      }
    };
  }, []);
  
  // Sync with Supabase whenever auth state changes
  useEffect(() => {
    if (isLoaded) {
      console.log('Auth state changed, syncing with Supabase...');
      syncUserWithSupabase().catch(err => {
        console.error('Error in initial sync:', err);
      });
    }
  }, [isLoaded, isSignedIn, user?.id]);
  
  // Respond to session changes
  useEffect(() => {
    if (session && isSignedIn) {
      console.log('Session changed, syncing with Supabase...');
      syncUserWithSupabase().catch(err => {
        console.error('Error in session sync:', err);
      });
    }
  }, [session?.id]);
  
  return (
    <ClerkContext.Provider 
      value={{ 
        user: supabaseUser, 
        userMetadata, 
        isLoading, 
        isAuthenticated: !!supabaseUser && isSignedIn,
        userId: user?.id || null,
        sessionId: session?.id || null,
        signOut: handleSignOut,
        syncUserWithSupabase
      }}
    >
      {children}
    </ClerkContext.Provider>
  );
};
