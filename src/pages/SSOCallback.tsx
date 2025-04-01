
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useFirebaseContext } from '@/contexts/FirebaseContext';

const SSOCallback = () => {
  const navigate = useNavigate();
  const { syncUserWithSupabase } = useFirebaseContext();

  useEffect(() => {
    // Create a global reference to the syncUserWithSupabase function
    if (typeof window !== 'undefined') {
      window.clerkContext = {
        syncUserWithSupabase
      };
    }

    const handleCallback = async () => {
      try {
        console.log("Handling OAuth callback");
        // For Firebase, we handle redirects via the Firebase auth state listener
        // We still need to sync with Supabase
        await syncUserWithSupabase();
        
        // Redirect to dashboard
        navigate('/dashboard', { replace: true });
      } catch (error) {
        console.error("Error handling OAuth callback:", error);
        navigate('/login', { replace: true });
      }
    };

    handleCallback();
  }, [navigate, syncUserWithSupabase]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <h2 className="text-2xl font-semibold mb-2">Processing your sign in...</h2>
      <p className="text-muted-foreground">You'll be redirected shortly</p>
    </div>
  );
};

export default SSOCallback;
