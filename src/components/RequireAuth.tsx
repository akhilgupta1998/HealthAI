<<<<<<< HEAD
import { useState, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
=======

import { useState, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
import { toast } from 'sonner';
import { useFirebaseContext } from '@/contexts/FirebaseContext';

const RequireAuth = () => {
<<<<<<< HEAD
  const { isLoading, isAuthenticated, userId, user, syncUserWithSupabase } = useFirebaseContext();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // This will clear any previous auth errors when the component remounts
    setAuthError(null);
    
    let timeoutId: NodeJS.Timeout;
    
    const checkAuth = async () => {
      try {
        if (isAuthenticated && user) {
          // User is authenticated, clear the checking state
          console.log("User authenticated:", user.uid);
          
          // Ensure user data is synced with Supabase
          await syncUserWithSupabase();
          
          setIsChecking(false);
        } else if (!isLoading && !isAuthenticated) {
          // If Firebase has finished loading and user is not authenticated
          if (retryCount < 2) {
            // Try to sync with Supabase one more time before giving up
            console.log(`Auth retry attempt ${retryCount + 1}/2`);
            setRetryCount(prev => prev + 1);
            
            // Add a short delay before retry
            timeoutId = setTimeout(async () => {
              try {
                await syncUserWithSupabase();
                // If we've successfully authed after sync, we're done
                if (isAuthenticated && user) {
                  setIsChecking(false);
                  return;
                }
              } catch (e) {
                console.error("Sync retry failed:", e);
              }
              
              setIsChecking(false);
              if (!isAuthenticated) {
                setAuthError("Session expired or user not authenticated");
                console.log("Auth check complete - User not authenticated after retry");
              }
            }, 1000);
          } else {
            // We've tried enough, mark as not authenticated
            setIsChecking(false);
            setAuthError("Session expired or user not authenticated");
            console.log("Auth check complete - User not authenticated");
          }
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setAuthError("Error verifying your authentication status");
=======
  const { isLoading, isAuthenticated, userId, user } = useFirebaseContext();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Brief timeout to ensure Firebase auth is initialized
        setTimeout(() => {
          setIsChecking(false);
        }, 1000);
      } catch (error) {
        console.error("Error checking authentication:", error);
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
        setIsChecking(false);
      }
    };
    
<<<<<<< HEAD
    checkAuth();
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isLoading, isAuthenticated, user, syncUserWithSupabase, retryCount]);
=======
    if (!isLoading) {
      checkAuth();
    }
  }, [isLoading, isAuthenticated]);
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac

  // While checking auth status, show loading indicator
  if (isLoading || isChecking) {
    return (
      <div className="fixed inset-0 flex h-screen w-full items-center justify-center bg-background/80 backdrop-blur-sm z-50">
        <div className="text-center bg-card p-6 rounded-xl shadow-lg border border-border/50 max-w-md w-full">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
<<<<<<< HEAD
          <span className="text-xl font-medium">Verifying account access...</span>
          <p className="text-sm text-muted-foreground mt-2">
            {retryCount > 0 ? "Reconnecting to secure services..." : "Please wait while we prepare your experience"}
          </p>
=======
          <span className="text-xl font-medium">Loading your account...</span>
          <p className="text-sm text-muted-foreground mt-2">Please wait while we prepare your experience</p>
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
<<<<<<< HEAD
  if (!isAuthenticated || !user) {
    console.log("User not authenticated, redirecting to login");
    
    // Only show the toast if there's a specific auth error
    if (authError) {
      toast.error(authError, {
        icon: <AlertCircle className="h-4 w-4" />,
        duration: 5000,
      });
    } else {
      toast.error("Please sign in to access this page", {
        duration: 3000,
      });
    }
    
    // Store the current path to redirect back after login
    localStorage.setItem("redirectAfterLogin", location.pathname);
    
    // Redirect to login page with the current location saved as the "from" state
=======
  if (!isAuthenticated) {
    console.log("User not authenticated, redirecting to login");
    toast.error("Please sign in to access this page");
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated, show the protected route
  return <Outlet />;
};

export default RequireAuth;
