
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnimatedButton from '@/components/AnimatedButton';
import { Home, LineChart, Salad, Dumbbell, Heart, Calendar } from 'lucide-react';

interface NavigationItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}

const HeaderNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const navigationItems: NavigationItem[] = [
    { icon: <Home className="h-5 w-5" />, label: 'Dashboard', path: '/dashboard' },
    { icon: <Salad className="h-5 w-5" />, label: 'Food Tracking', path: '/food-tracking' },
    { icon: <Dumbbell className="h-5 w-5" />, label: 'Exercise', path: '/exercise' },
    { icon: <Heart className="h-5 w-5" />, label: 'Vitals', path: '/vitals' },
    { icon: <Calendar className="h-5 w-5" />, label: 'Progress', path: '/habits' },
  ];
  
  return (
    <nav className="mx-6 hidden items-center space-x-1 md:hidden">
      {navigationItems.map((item, index) => {
        const isActive = location.pathname === item.path;
        return (
          <AnimatedButton
            key={index}
            variant={isActive ? "default" : "ghost"}
            className={`relative px-3 ${isActive ? 'bg-primary/10 text-primary font-medium' : ''}`}
            onClick={() => navigate(item.path)}
          >
            {item.icon}
            <span className="ml-2">{item.label}</span>
            {isActive && (
              <motion.div 
                className="absolute left-0 right-0 bottom-0 h-0.5 bg-primary rounded-t-full"
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
  );
};

export default HeaderNavigation;
