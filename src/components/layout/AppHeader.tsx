<<<<<<< HEAD
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, Bell, Search, Settings, Home, Salad, Droplet, Dumbbell, Activity, CalendarDays, BarChart, Heart } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useFirebaseContext } from '@/contexts/FirebaseContext';
import { Badge } from '@/components/ui/badge';

export default function AppHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, userProfile, isAuthenticated } = useFirebaseContext();
  
  const initials = userProfile?.displayName
    ? userProfile.displayName.split(' ').map(n => n[0]).join('').toUpperCase()
    : user?.email?.substring(0, 2).toUpperCase() || 'HG';

  const topNavItems = [
    { name: 'Home', path: '/' },
    { name: 'Features', path: '/features' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact-us' },
  ];

  const mobileMenuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <Home className="h-5 w-5 mr-2" /> },
    { name: 'Food Tracking', path: '/food-tracking', icon: <Salad className="h-5 w-5 mr-2" /> },
    { name: 'Water', path: '/water', icon: <Droplet className="h-5 w-5 mr-2" /> },
    { name: 'Exercise', path: '/exercise', icon: <Dumbbell className="h-5 w-5 mr-2" /> },
    { name: 'Vitals', path: '/vitals', icon: <Activity className="h-5 w-5 mr-2" /> },
    { name: 'Meal Planner', path: '/meal-planner', icon: <Salad className="h-5 w-5 mr-2" /> },
    { name: 'Calendar', path: '/calendar', icon: <CalendarDays className="h-5 w-5 mr-2" /> },
    { name: 'Progress', path: '/progress', icon: <BarChart className="h-5 w-5 mr-2" /> },
    { name: 'Profile', path: '/profile', icon: <User className="h-5 w-5 mr-2" /> },
    { name: 'Settings', path: '/settings', icon: <Settings className="h-5 w-5 mr-2" /> },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b h-16 flex items-center px-4 md:px-6">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-4">
          {isAuthenticated && isMobile ? (
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="flex flex-col h-full">
                  <div className="px-6 py-4 border-b">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold">Menu</h2>
                      <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                  <nav className="flex-1 px-6 py-4">
                    <ul className="space-y-2">
                      {mobileMenuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                          <li key={item.path}>
                            <Button
                              variant={isActive ? "default" : "ghost"}
                              className="w-full justify-start"
                              onClick={() => {
                                navigate(item.path);
                                setIsMenuOpen(false);
                              }}
                            >
                              {item.icon}
                              {item.name}
                            </Button>
                          </li>
                        );
                      })}
                    </ul>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          ) : null}
          
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-bold cursor-pointer" onClick={() => navigate(isAuthenticated ? '/dashboard' : '/')}>
              Health Guardian
            </span>
          </div>
        </div>
        
        {/* Main Navigation */}
        {!isAuthenticated ? (
          <nav className="hidden md:flex items-center gap-6">
            {topNavItems.map((item) => (
              <Button 
                key={item.path} 
                variant="ghost" 
                className="text-base font-medium"
                onClick={() => navigate(item.path)}
              >
                {item.name}
              </Button>
            ))}
          </nav>
        ) : !isMobile ? (
          <nav className="ml-8 hidden md:flex items-center gap-6">
            <Button 
              variant="ghost" 
              className="text-base font-medium"
              onClick={() => navigate('/dashboard')}
            >
              Dashboard
            </Button>
            <Button 
              variant="ghost" 
              className="text-base font-medium"
              onClick={() => navigate('/food-tracking')}
            >
              Food Tracking
            </Button>
            <Button 
              variant="ghost" 
              className="text-base font-medium"
              onClick={() => navigate('/water')}
            >
              Water
            </Button>
            <Button 
              variant="ghost" 
              className="text-base font-medium"
              onClick={() => navigate('/exercise')}
            >
              Exercise
            </Button>
          </nav>
        ) : null}
        
        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <>
              <Button variant="ghost" size="icon" onClick={() => navigate('/search')}>
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
              
              <Button variant="ghost" size="icon" onClick={() => navigate('/notifications')}>
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs" variant="destructive">
                  3
                </Badge>
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
              </Button>
            </>
          )}
          
          {isAuthenticated && !isMobile && (
            <Button 
              variant="ghost" 
              className="flex items-center gap-2 font-medium"
              onClick={() => navigate('/profile')}
            >
              <User className="h-5 w-5" />
              <span>My Profile</span>
            </Button>
          )}
          
          {isAuthenticated ? (
            <Avatar className="cursor-pointer" onClick={() => navigate('/profile')}>
              <AvatarImage src={userProfile?.photoURL || ''} alt={userProfile?.displayName || 'User'} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => navigate('/login')}>Log in</Button>
              <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => navigate('/signup')}>Sign up</Button>
            </div>
          )}
=======

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import AnimatedButton from '@/components/AnimatedButton';
import HeaderNavigation from './HeaderNavigation';
import MobileMenuSheet from './MobileMenuSheet';
import NotificationsMenu from './NotificationsMenu';
import UserMenu from './UserMenu';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useFirebaseContext } from '@/contexts/FirebaseContext';
import { toast } from 'sonner';

const AppHeader = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { signOut } = useFirebaseContext();
  
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
      toast.success("You have been signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Error signing out. Please try again.");
    }
  };
  
  return (
    <header className={`sticky top-0 z-40 border-b transition-all duration-200 ${
      scrolled ? 'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60' : 'bg-background'
    }`}>
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Logo only visible on mobile in the header */}
          <div className="md:hidden">
            <AnimatedButton variant="ghost" onClick={() => navigate('/')}>
              <span className="font-bold text-xl">HealthGuardian</span>
            </AnimatedButton>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMobile && <MobileMenuSheet />}
        
        {/* Desktop Navigation */}
        <HeaderNavigation />
        
        <div className="flex items-center gap-2">
          <NotificationsMenu />
          
          {/* Sign Out button for desktop */}
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleSignOut}
            className="hidden md:flex items-center"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
          
          <UserMenu />
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
        </div>
      </div>
    </header>
  );
<<<<<<< HEAD
}
=======
};

export default AppHeader;
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
