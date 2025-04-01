import React, { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const DebugLogin = () => {
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);

  // Function to print detailed Firebase config for debugging
  const logFirebaseConfig = () => {
    try {
      // Not logging the actual API key for security, just checking if it's defined
      const apiKeyDefined = !!auth.app.options.apiKey;
      const authDomain = auth.app.options.authDomain;
      const projectId = auth.app.options.projectId;
      
      const configInfo = {
        apiKeyDefined,
        authDomain,
        projectId
      };
      
      console.log("Firebase config:", configInfo);
      setMessage(`Firebase config checked: API Key defined: ${apiKeyDefined}, Auth Domain: ${authDomain}`);
    } catch (err: any) {
      console.error("Error reading Firebase config:", err);
      setError(`Error reading Firebase config: ${err.message}`);
    }
  };

  // Direct Google sign-in for testing
  const testGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);
    
    try {
      console.log("Starting Google sign-in test...");
      
      // Reset the provider to avoid cached states
      googleProvider.setCustomParameters({
        prompt: 'select_account'
      });
      
      // Attempt direct sign-in
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      console.log("Google sign-in successful", user);
      setMessage(`Successfully signed in: ${user.email}`);
      setUserInfo({
        email: user.email,
        name: user.displayName,
        photoURL: user.photoURL,
        uid: user.uid
      });
    } catch (error: any) {
      console.error("Google sign-in test failed:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      
      setError(`Sign-in failed: ${error.code} - ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Check auth state
  const checkAuthState = () => {
    const currentUser = auth.currentUser;
    
    if (currentUser) {
      setMessage(`Currently signed in as: ${currentUser.email}`);
      setUserInfo({
        email: currentUser.email,
        name: currentUser.displayName,
        photoURL: currentUser.photoURL,
        uid: currentUser.uid
      });
    } else {
      setMessage("No user is currently signed in");
      setUserInfo(null);
    }
  };

  return (
    <div className="container max-w-lg mx-auto mt-10 p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Firebase Authentication Debug</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Button onClick={logFirebaseConfig} variant="outline">
              Check Firebase Config
            </Button>
            
            <Button onClick={checkAuthState} variant="outline">
              Check Auth State
            </Button>
            
            <Button 
              onClick={testGoogleSignIn} 
              disabled={loading}
              className="col-span-2"
            >
              {loading ? 'Testing...' : 'Test Google Sign-In'}
            </Button>
          </div>
          
          {message && (
            <div className="bg-green-50 border border-green-200 rounded p-3 mt-4">
              <p className="text-green-800">{message}</p>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-3 mt-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}
          
          {userInfo && (
            <div className="bg-blue-50 border border-blue-200 rounded p-3 mt-4">
              <h3 className="font-medium text-blue-800 mb-2">User Information</h3>
              <pre className="text-xs overflow-x-auto">
                {JSON.stringify(userInfo, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DebugLogin; 