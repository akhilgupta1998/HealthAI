<<<<<<< HEAD
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Salad, 
  Droplet, 
  Dumbbell, 
  Activity, 
  CalendarDays, 
  BarChart, 
  User, 
  Settings,
  MessageCircle,
  Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFirebaseContext } from '@/contexts/FirebaseContext';
import { cn } from '@/lib/utils';
=======

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, LineChart, Salad, Dumbbell, Heart, Calendar, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFirebaseContext } from '@/contexts/FirebaseContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

interface NavigationItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac

const DesktopSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
<<<<<<< HEAD
  const { userProfile } = useFirebaseContext();

  const menuItems = [
    { 
      name: 'Dashboard', 
      path: '/dashboard', 
      icon: <Home className="h-5 w-5" /> 
    },
    { 
      name: 'Food Tracking', 
      path: '/food-tracking', 
      icon: <Salad className="h-5 w-5" /> 
    },
    { 
      name: 'Water', 
      path: '/water', 
      icon: <Droplet className="h-5 w-5" /> 
    },
    { 
      name: 'Exercise', 
      path: '/exercise', 
      icon: <Dumbbell className="h-5 w-5" /> 
    },
    { 
      name: 'Vitals', 
      path: '/vitals', 
      icon: <Activity className="h-5 w-5" /> 
    },
    { 
      name: 'Meal Planner', 
      path: '/meal-planner', 
      icon: <Salad className="h-5 w-5" /> 
    },
    { 
      name: 'Calendar', 
      path: '/calendar', 
      icon: <CalendarDays className="h-5 w-5" /> 
    },
    { 
      name: 'Progress', 
      path: '/progress', 
      icon: <BarChart className="h-5 w-5" /> 
    },
    { 
      name: 'Profile', 
      path: '/profile', 
      icon: <User className="h-5 w-5" /> 
    },
    { 
      name: 'Settings', 
      path: '/settings', 
      icon: <Settings className="h-5 w-5" /> 
    },
    { 
      name: 'Contact', 
      path: '/contact', 
      icon: <MessageCircle className="h-5 w-5" /> 
    },
  ];

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-background border-r p-4 hidden md:block overflow-y-auto">
      <div className="flex flex-col h-full">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Button
                key={item.path}
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isActive && "bg-secondary text-secondary-foreground font-medium"
                )}
                onClick={() => navigate(item.path)}
              >
                <span className={cn("mr-2", isActive && "text-primary")}>{item.icon}</span>
                {item.name}
              </Button>
            );
          })}
        </div>

        <div className="mt-auto pt-6 border-t">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {userProfile?.displayName || 'Health Guardian User'}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {userProfile?.email || ''}
              </p>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full justify-start" 
            onClick={() => navigate('/goals')}
          >
            <Heart className="h-5 w-5 mr-2 text-primary" />
            My Health Goals
          </Button>
        </div>
      </div>
    </aside>
=======
  const { userMetadata, signOut, user } = useFirebaseContext();
  
  const navigationItems: NavigationItem[] = [
    { icon: <Home className="h-5 w-5" />, label: 'Dashboard', path: '/dashboard' },
    { icon: <Salad className="h-5 w-5" />, label: 'Food Tracking', path: '/food-tracking' },
    { icon: <Dumbbell className="h-5 w-5" />, label: 'Exercise', path: '/exercise' },
    { icon: <Heart className="h-5 w-5" />, label: 'Vitals', path: '/vitals' },
    { icon: <Calendar className="h-5 w-5" />, label: 'Progress', path: '/habits' },
  ];

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

  const getInitials = () => {
    if (!userMetadata?.fullName) return 'U';
    return userMetadata.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase();
  };
  
  return (
    <div className="hidden md:flex flex-col w-64 border-r bg-card h-screen sticky top-0">
      <div className="p-4 border-b">
        <h2 className="font-bold text-xl">HealthGuardian</h2>
      </div>
      
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={userMetadata?.avatarUrl || user?.photoURL} alt={userMetadata?.fullName} />
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
          <div className="overflow-hidden">
            <p className="font-medium truncate">{userMetadata?.fullName || user?.displayName || 'User'}</p>
            <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Button
              key={item.path}
              variant={isActive ? "secondary" : "ghost"}
              className={`w-full justify-start relative ${isActive ? 'bg-primary/10 text-primary font-medium' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <span className="flex items-center">
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </span>
              
              {isActive && (
                <motion.div 
                  className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full"
                  layoutId="sidebarActiveIndicator"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </Button>
          );
        })}
      </nav>
      
      <div className="p-4 border-t">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-muted-foreground"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
  );
};

export default DesktopSidebar;
