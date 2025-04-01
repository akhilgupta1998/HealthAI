
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useClerkContext } from '@/contexts/ClerkContext';
import DesktopNavigation from './navbar/DesktopNavigation';
import MobileMenu from './navbar/MobileMenu';
import AuthButtons from './navbar/AuthButtons';

const AppNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated } = useClerkContext();

  const mainNavItems = [
    { name: 'Home', path: '/dashboard' },
    { name: 'Features', path: '/features' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'About', path: '/about' }
  ];

  const featureSubItems = [
    { name: 'Food Tracking', path: '/food-tracking' },
    { name: 'Exercise', path: '/exercise' },
    { name: 'Water', path: '/water' },
    { name: 'Vitals', path: '/vitals' },
    { name: 'Progress', path: '/progress' },
    { name: 'Community', path: '/community' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="font-bold text-xl">
              Health Guardian
            </Link>
          </div>

          {/* Desktop Navigation */}
          <DesktopNavigation 
            mainNavItems={mainNavItems} 
            featureSubItems={featureSubItems} 
          />

          {/* Auth Buttons */}
          <AuthButtons />

          {/* Mobile Menu Toggle */}
          <Button 
            variant="ghost" 
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <MobileMenu 
          mainNavItems={mainNavItems}
          featureSubItems={featureSubItems}
          isAuthenticated={isAuthenticated}
          onCloseMenu={() => setIsMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default AppNavbar;
