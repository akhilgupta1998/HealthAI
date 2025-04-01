
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import AnimatedButton from '@/components/AnimatedButton';
import { Home, LineChart, Salad, Dumbbell, Heart, Calendar } from 'lucide-react';
import { useFirebaseContext } from '@/contexts/FirebaseContext';
import { toast } from 'sonner';

interface NavigationItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}

const MobileMenuSheet = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useFirebaseContext();
  
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
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[240px] sm:w-[300px] p-0">
        <div className="border-b p-4">
          <h2 className="text-lg font-bold">HealthGuardian</h2>
        </div>
        
        <div className="flex flex-col gap-4 py-4 px-2">
          <nav className="flex flex-col gap-1">
            {navigationItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <AnimatedButton
                  key={index}
                  variant={isActive ? "accent" : "ghost"}
                  className={`justify-start gap-2 ${isActive ? 'bg-primary/10 text-primary font-medium' : ''}`}
                  onClick={() => navigate(item.path)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.div 
                      className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full"
                      layoutId="activeIndicator"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </AnimatedButton>
              );
            })}
          </nav>
          
          <div className="mt-auto px-2">
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
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenuSheet;
