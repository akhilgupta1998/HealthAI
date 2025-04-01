
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFirebaseContext } from './FirebaseContext';
import { toast } from 'sonner';

interface AuthContextType {
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  user: any; // Add user property to the interface
}

const AuthContext = createContext<AuthContextType>({
  signInWithEmail: async () => {},
  signUp: async () => {},
  signInWithGoogle: async () => {},
  signOut: async () => {},
  resetPassword: async () => {},
  user: null, // Add user property to the default value
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    signInWithEmail: firebaseSignIn, 
    signUpWithEmail: firebaseSignUp,
    signInWithGoogle: firebaseSignInWithGoogle, 
    signOut: firebaseSignOut,
    resetPassword: firebaseResetPassword,
    user: firebaseUser // Get the user from FirebaseContext
  } = useFirebaseContext();
  const navigate = useNavigate();
  const [user, setUser] = useState(firebaseUser); // Local state to track user

  // Update local user state when Firebase user changes
  useEffect(() => {
    setUser(firebaseUser);
  }, [firebaseUser]);

  const signInWithEmail = async (email: string, password: string) => {
    try {
      await firebaseSignIn(email, password);
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      await firebaseSignUp(email, password, fullName);
    } catch (error) {
      console.error("Sign up error:", error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      await firebaseSignInWithGoogle();
    } catch (error) {
      console.error("Google sign in error:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut();
      navigate('/login');
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Error signing out. Please try again.");
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await firebaseResetPassword(email);
    } catch (error) {
      console.error("Reset password error:", error);
      throw error;
    }
  };

  const value = {
    signInWithEmail,
    signUp,
    signInWithGoogle,
    signOut,
    resetPassword,
    user, // Pass the user to the context value
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
