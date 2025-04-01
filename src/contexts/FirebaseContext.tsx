<<<<<<< HEAD
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail } from 'firebase/auth';
import { 
  signOutUser, 
  getUserProfile, 
  updateUserProfile, 
  getDailySummary,
  UserProfile,
  setOfflineMode
} from '../services/firebaseService';
import { auth, googleProvider, db, performance, trace } from '../firebase';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import { doc, setDoc } from 'firebase/firestore';

interface FirebaseContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  userProfile: UserProfile | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  signUpWithEmailAndPassword: (email: string, password: string) => Promise<void>;
  loginWithEmailAndPassword: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  getDailyData: (date: Date) => Promise<any>;
  setOffline: (enabled: boolean) => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  userProfile: null,
  signIn: async () => {},
  signOut: async () => {},
  signUpWithEmailAndPassword: async () => {},
  loginWithEmailAndPassword: async () => {},
  resetPassword: async () => {},
  updateProfile: async () => {},
  getDailyData: async () => ({}),
  setOffline: async () => {},
=======

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  getAuth, 
  onAuthStateChanged, 
  GoogleAuthProvider, 
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  User as FirebaseUser,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import app from '@/integrations/firebase/config';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

interface UserMetadata {
  id: string;
  email?: string;
  fullName?: string;
  avatarUrl?: string;
  hasCompletedOnboarding?: boolean;
  [key: string]: any;
}

interface FirebaseContextType {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: FirebaseUser | null;
  userMetadata: UserMetadata | null;
  userId: string | null;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, fullName?: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  syncUserWithSupabase: () => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType>({
  isLoading: true,
  isAuthenticated: false,
  user: null,
  userMetadata: null,
  userId: null,
  signInWithGoogle: async () => {},
  signInWithEmail: async () => {},
  signUpWithEmail: async () => {},
  signOut: async () => {},
  resetPassword: async () => {},
  syncUserWithSupabase: async () => {},
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
});

export const useFirebaseContext = () => useContext(FirebaseContext);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
<<<<<<< HEAD
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isOffline, setIsOffline] = useState<boolean>(false);

  // Monitor auth state with performance tracking
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      const perfTrace = performance ? trace(performance, 'authStateChange') : null;
      perfTrace?.start();
      
      try {
        setUser(user);
        
        if (user) {
          try {
            const profile = await getUserProfile(user.uid);
            setUserProfile(profile);
          } catch (error) {
            console.error('Error fetching user profile:', error);
            toast.error('Failed to load user profile');
          }
        } else {
          setUserProfile(null);
        }
      } finally {
        setIsLoading(false);
        perfTrace?.stop();
      }
    });

    return () => unsubscribe();
  }, []);

  // Network state monitoring
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setOfflineMode(false);
    };
    
    const handleOffline = () => {
      setIsOffline(true);
      setOfflineMode(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Optimized sign in with Google
  const signIn = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      
      // Create/update user profile in Firestore
      const user = result.user;
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        updatedAt: new Date(),
        createdAt: new Date(),
        lastLogin: new Date(),
      }, { merge: true });
      
      toast.success(`Welcome, ${result.user.displayName || result.user.email}`);
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      toast.error(getAuthErrorMessage(error.code));
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Optimized sign out
  const signOut = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      await signOutUser();
      toast.success('Successfully signed out');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Optimized email/password login
  const loginWithEmailAndPassword = useCallback(async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Email login successful:", userCredential.user.email);
      toast.success('Logged in successfully');
    } catch (error: any) {
      console.error('Error logging in:', error);
      toast.error(getAuthErrorMessage(error.code));
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Optimized password reset
  const resetPassword = useCallback(async (email: string): Promise<void> => {
    try {
      setIsLoading(true);
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent');
    } catch (error: any) {
      console.error('Error resetting password:', error);
      toast.error(getAuthErrorMessage(error.code));
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Optimized profile update
  const updateProfile = useCallback(async (data: Partial<UserProfile>): Promise<void> => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      await updateUserProfile(user.uid, data);
      toast.success('Profile updated successfully');
      
      // Update local state
      setUserProfile(prev => {
        if (!prev) return null;
        return { ...prev, ...data };
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
      throw error;
    }
  }, [user]);

  // Optimized daily data fetch
  const getDailyData = useCallback(async (date: Date) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      return await getDailySummary(user.uid, date);
    } catch (error) {
      console.error('Error getting daily summary:', error);
      toast.error('Failed to load daily data. Please try again.');
      throw error;
    }
  }, [user]);

  // Optimized offline mode toggle
  const setOffline = useCallback(async (enabled: boolean): Promise<void> => {
    try {
      await setOfflineMode(enabled);
      setIsOffline(enabled);
    } catch (error) {
      console.error('Error setting offline mode:', error);
      toast.error('Failed to change offline mode');
      throw error;
    }
  }, []);

  // Helper function for auth error messages
  const getAuthErrorMessage = (code: string): string => {
    switch (code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'Invalid email or password';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection.';
      case 'auth/api-key-not-valid':
        return 'Authentication configuration error. Please contact support.';
      case 'auth/popup-blocked':
        return 'Popup was blocked. Please allow popups for this site.';
      case 'auth/popup-closed-by-user':
        return 'Sign-in cancelled. Please try again.';
      default:
        return 'Authentication failed. Please try again.';
=======
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userMetadata, setUserMetadata] = useState<UserMetadata | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [syncAttempts, setSyncAttempts] = useState(0);
  const [lastSyncTime, setLastSyncTime] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  const syncUserWithSupabase = useCallback(async () => {
    if (!user) return;
    
    // Prevent multiple rapid sync attempts
    const now = Date.now();
    if (now - lastSyncTime < 1000 && syncAttempts > 0) {
      console.log(`Skipping sync - too soon since last attempt (${now - lastSyncTime}ms)`);
      return;
    }
    
    if (isSyncing) {
      console.log("Sync already in progress, skipping");
      return;
    }
    
    try {
      // Mark that we're syncing and increment attempts
      setIsSyncing(true);
      setSyncAttempts(prev => prev + 1);
      setLastSyncTime(now);
      
      console.log(`Sync attempt #${syncAttempts + 1} for user ${user.uid}`);
      
      // Get Firebase ID token
      const idToken = await user.getIdToken(true); // Force refresh to ensure we have the latest token
      
      // Sign in to Supabase with custom token
      const { error: signInError } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: idToken,
      });
      
      if (signInError) {
        console.error("Error signing into Supabase:", signInError);
        return;
      }
      
      // Get or create user profile
      const { data: existingProfile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.uid)
        .single();
      
      if (profileError && profileError.code !== 'PGRST116') {
        console.error("Error fetching user profile:", profileError);
      }
      
      // If profile doesn't exist, create one
      if (!existingProfile) {
        const { error: insertError } = await supabase
          .from('user_profiles')
          .insert({
            id: user.uid,
            display_name: user.displayName || user.email?.split('@')[0],
            email: user.email,
            avatar_url: user.photoURL,
          });
        
        if (insertError) {
          console.error("Error creating user profile:", insertError);
        }
      }
      
      // Fetch the user profile
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.uid)
        .single();
      
      if (profile) {
        setUserMetadata({
          id: user.uid,
          email: user.email || '',
          fullName: profile.display_name,
          avatarUrl: profile.avatar_url,
          hasCompletedOnboarding: profile.has_completed_onboarding,
          ...profile
        });
        
        console.log("User data synced successfully with Supabase");
      }
    } catch (error) {
      console.error("Error syncing user with Supabase:", error);
      toast.error("Error syncing user data");
    } finally {
      setIsSyncing(false);
    }
  }, [user, syncAttempts, lastSyncTime, isSyncing]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setIsLoading(true);
      
      if (currentUser) {
        console.log("User authenticated:", currentUser.uid);
        setUser(currentUser);
        setUserId(currentUser.uid);
        setIsAuthenticated(true);
        
        try {
          await syncUserWithSupabase();
        } catch (error) {
          console.error("Error during initial sync:", error);
        }
      } else {
        console.log("No user authenticated");
        setUser(null);
        setUserId(null);
        setUserMetadata(null);
        setIsAuthenticated(false);
        
        // Sign out from Supabase too
        await supabase.auth.signOut();
      }
      
      setIsLoading(false);
    });
    
    return () => unsubscribe();
  }, [syncUserWithSupabase]);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        await syncUserWithSupabase();
        toast.success("Successfully signed in with Google!");
      }
    } catch (error: any) {
      console.error("Google sign-in error:", error);
      if (error.code === 'auth/popup-closed-by-user') {
        toast.error("Sign-in canceled. Please try again.");
      } else {
        toast.error("Failed to sign in with Google. Please try again.");
      }
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      if (result.user) {
        await syncUserWithSupabase();
        toast.success("Successfully signed in!");
      }
    } catch (error: any) {
      console.error("Email sign-in error:", error);
      if (error.code === 'auth/invalid-credential') {
        toast.error("Invalid email or password. Please check your credentials.");
      } else if (error.code === 'auth/user-not-found') {
        toast.error("No account found with this email. Please sign up.");
      } else {
        toast.error("Error signing in. Please try again.");
      }
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, password: string, fullName?: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      if (fullName && result.user) {
        await updateProfile(result.user, { displayName: fullName });
        // Reload user to get updated profile
        await result.user.reload();
      }
      
      if (result.user) {
        await syncUserWithSupabase();
        toast.success("Account created successfully!");
      }
    } catch (error: any) {
      console.error("Email sign-up error:", error);
      if (error.code === 'auth/email-already-in-use') {
        toast.error("This email is already in use. Try signing in instead.");
      } else if (error.code === 'auth/weak-password') {
        toast.error("Password is too weak. Please use a stronger password.");
      } else {
        toast.error("Error creating account. Please try again.");
      }
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setSyncAttempts(0); // Reset sync attempts
      setLastSyncTime(0);
      await firebaseSignOut(auth);
      await supabase.auth.signOut();
      toast.success("Signed out successfully");
    } catch (error) {
      console.error("Sign-out error:", error);
      toast.error("Error signing out. Please try again.");
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent. Check your inbox.");
    } catch (error: any) {
      console.error("Reset password error:", error);
      if (error.code === 'auth/user-not-found') {
        toast.error("No account found with this email.");
      } else {
        toast.error("Error sending password reset email. Please try again.");
      }
      throw error;
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
    }
  };

  const value = {
<<<<<<< HEAD
    user,
    isAuthenticated: !!user,
    isLoading,
    userProfile,
    signIn,
    signOut,
    signUpWithEmailAndPassword: loginWithEmailAndPassword,
    loginWithEmailAndPassword,
    resetPassword,
    updateProfile,
    getDailyData,
    setOffline,
=======
    isLoading,
    isAuthenticated,
    user,
    userMetadata,
    userId,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    resetPassword,
    syncUserWithSupabase,
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
<<<<<<< HEAD
      <Toaster position="top-right" />
    </FirebaseContext.Provider>
  );
};

export default FirebaseContext;
=======
    </FirebaseContext.Provider>
  );
};
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
