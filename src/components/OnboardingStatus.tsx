
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ClipboardCheck, UserCheck, ChevronRight } from 'lucide-react';
import { useFirebaseContext } from '@/contexts/FirebaseContext';
import { supabase } from '@/integrations/supabase/client';

const OnboardingStatus = () => {
  const { user, userMetadata } = useFirebaseContext();
  const [profileComplete, setProfileComplete] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkProfileStatus = async () => {
      if (!user?.uid) return;
      
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('display_name, age, height, weight, gender, activity_level')
          .eq('id', user.uid)
          .single();
          
        if (error) {
          console.error("Error fetching profile:", error);
          setProfileComplete(false);
          return;
        }
        
        // Check if essential profile fields are filled
        const isComplete = Boolean(
          data?.display_name && 
          data?.age && 
          data?.height && 
          data?.weight && 
          data?.gender
        );
        
        setProfileComplete(isComplete);
      } catch (error) {
        console.error("Error checking profile status:", error);
        setProfileComplete(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkProfileStatus();
  }, [user]);
  
  const handleCompleteProfile = () => {
    navigate('/profile');
  };
  
  if (loading) return null;
  
  return (
    <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {profileComplete ? (
              <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                <UserCheck className="h-5 w-5 text-green-600 dark:text-green-500" />
              </div>
            ) : (
              <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full">
                <ClipboardCheck className="h-5 w-5 text-amber-600 dark:text-amber-500" />
              </div>
            )}
            <div>
              <h3 className="font-medium">
                {profileComplete ? "Profile Complete" : "Complete Your Profile"}
              </h3>
              <CardDescription>
                {profileComplete 
                  ? "Your health profile is ready" 
                  : "Add your health details for personalized recommendations"}
              </CardDescription>
            </div>
          </div>
          
          <Button 
            variant={profileComplete ? "outline" : "default"}
            size="sm"
            className={profileComplete ? "border-primary/20 text-primary" : ""}
            onClick={handleCompleteProfile}
          >
            {profileComplete ? "View Profile" : "Complete Now"}
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OnboardingStatus;
