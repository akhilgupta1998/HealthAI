
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, Settings, LogOut, Loader2 } from 'lucide-react';
import AnimatedButton from '@/components/AnimatedButton';
import { useFirebaseContext } from '@/contexts/FirebaseContext';
import { toast } from 'sonner';

const UserMenu = () => {
  const { isAuthenticated, userMetadata, signOut, isLoading, user } = useFirebaseContext();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (isAuthenticated && userMetadata) {
        setUserProfile(userMetadata);
      }
    };
    
    fetchUserProfile();
  }, [isAuthenticated, userMetadata]);
  
  const getInitials = () => {
    if (!userProfile?.fullName) return 'U';
    return userProfile.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase();
  };
  
  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut();
      navigate('/');
      toast.success("You have been signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Error signing out. Please try again.");
    } finally {
      setIsSigningOut(false);
    }
  };
  
  if (isLoading) {
    return (
      <Button variant="ghost" className="relative h-10 w-10 rounded-full">
        <Loader2 className="h-5 w-5 animate-spin" />
      </Button>
    );
  }
  
  return (
    <>
      {isAuthenticated ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar>
                <AvatarImage src={userProfile?.avatar_url || user?.photoURL} alt={userProfile?.fullName} />
                <AvatarFallback>{getInitials()}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/profile')}>
              <User className="h-4 w-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} disabled={isSigningOut}>
              {isSigningOut ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Signing out...
                </>
              ) : (
                <>
                  <LogOut className="h-4 w-4 mr-2" />
                  Log out
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <AnimatedButton onClick={() => navigate('/login')}>Sign In</AnimatedButton>
      )}
    </>
  );
};

export default UserMenu;
