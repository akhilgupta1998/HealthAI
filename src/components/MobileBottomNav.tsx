<<<<<<< HEAD
=======

>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Salad, 
  Dumbbell, 
  Heart, 
<<<<<<< HEAD
  LineChart,
  Menu,
  User,
  Settings,
  Users,
  Utensils,
  Droplets,
  CalendarRange
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}
=======
  LineChart
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac

const MobileBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
<<<<<<< HEAD
  const navItems: NavItem[] = [
=======
  const navItems = [
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
    { icon: <Home className="h-5 w-5" />, label: 'Dashboard', path: '/dashboard' },
    { icon: <Salad className="h-5 w-5" />, label: 'Food', path: '/food-tracking' },
    { icon: <Dumbbell className="h-5 w-5" />, label: 'Exercise', path: '/exercise' },
    { icon: <Heart className="h-5 w-5" />, label: 'Vitals', path: '/vitals' },
<<<<<<< HEAD
    { icon: <LineChart className="h-5 w-5" />, label: 'Progress', path: '/progress' },
=======
    { icon: <LineChart className="h-5 w-5" />, label: 'Progress', path: '/habits' },
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
  ];
  
  const isActive = (path: string) => location.pathname === path;
  
<<<<<<< HEAD
  // More navigation items for the expanded menu
  const moreNavItems: NavItem[] = [
    { icon: <User className="h-5 w-5" />, label: 'Profile', path: '/profile' },
    { icon: <Settings className="h-5 w-5" />, label: 'Settings', path: '/settings' },
    { icon: <Users className="h-5 w-5" />, label: 'Community', path: '/community' },
    { icon: <Utensils className="h-5 w-5" />, label: 'Recipes', path: '/recipes' },
    { icon: <Droplets className="h-5 w-5" />, label: 'Water Tracking', path: '/water' },
    { icon: <CalendarRange className="h-5 w-5" />, label: 'Meal Planner', path: '/meal-planner' },
  ];
  
  return (
    <motion.div 
      className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-background/95 backdrop-blur-lg border-t shadow-lg"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <div className="flex items-center justify-between px-1 sm:px-2 py-2 max-w-md mx-auto">
        {navItems.slice(0, 4).map((item) => (
          <motion.button
            key={item.path}
            className={cn(
              "flex flex-col items-center justify-center py-1 sm:py-2 px-2 sm:px-3 rounded-lg transition-colors",
              isActive(item.path) 
                ? "text-primary" 
                : "text-muted-foreground hover:text-foreground/80"
            )}
            onClick={() => navigate(item.path)}
            whileTap={{ scale: 0.9 }}
=======
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-background/90 backdrop-blur-lg border-t">
      <div className="flex items-center justify-between px-1 py-2">
        {navItems.map((item) => (
          <button
            key={item.path}
            className={cn(
              "flex flex-col items-center justify-center py-1 px-2 rounded-lg",
              isActive(item.path) ? "text-primary" : "text-muted-foreground"
            )}
            onClick={() => navigate(item.path)}
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
          >
            <div className="relative">
              {item.icon}
              {isActive(item.path) && (
                <motion.div
                  layoutId="bottomNavIndicator"
<<<<<<< HEAD
                  className="absolute -inset-1.5 rounded-full bg-primary/15 -z-10"
=======
                  className="absolute -inset-1 rounded-full bg-primary/10 -z-10"
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
                  transition={{ type: "spring", duration: 0.3 }}
                />
              )}
            </div>
<<<<<<< HEAD
            <span className="text-[10px] font-medium mt-1">{item.label}</span>
          </motion.button>
        ))}
        
        {/* More menu */}
        <Sheet>
          <SheetTrigger asChild>
            <motion.button
              className={cn(
                "flex flex-col items-center justify-center py-1 sm:py-2 px-2 sm:px-3 rounded-lg transition-colors",
                "text-muted-foreground hover:text-foreground/80"
              )}
              whileTap={{ scale: 0.9 }}
            >
              <div className="relative">
                <Menu className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-medium mt-1">More</span>
            </motion.button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[60vh] rounded-t-xl pt-6">
            <div className="grid grid-cols-2 gap-4 pt-4">
              {[...navItems, ...moreNavItems].map((item) => (
                <Button
                  key={item.path}
                  variant="ghost"
                  className={cn(
                    "justify-start h-12",
                    isActive(item.path) && "bg-primary/10 text-primary"
                  )}
                  onClick={() => {
                    navigate(item.path);
                    document.body.click(); // Close the sheet
                  }}
                >
                  <span className="mr-2 opacity-70">{item.icon}</span>
                  {item.label}
                </Button>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
      
      {/* Safe area for iOS devices */}
      <div className="h-safe-area w-full bg-background/95 backdrop-blur-lg" />
    </motion.div>
=======
            <span className="text-[10px] mt-1">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
  );
};

export default MobileBottomNav;
