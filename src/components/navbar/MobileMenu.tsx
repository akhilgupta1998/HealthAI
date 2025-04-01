
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { UserButton } from '@clerk/clerk-react';
import NavItem from './NavItem';
import MobileFeaturesMenu from './MobileFeaturesMenu';

interface NavItem {
  name: string;
  path: string;
}

interface MobileMenuProps {
  mainNavItems: NavItem[];
  featureSubItems: NavItem[];
  isAuthenticated: boolean;
  onCloseMenu: () => void;
}

const MobileMenu = ({ 
  mainNavItems, 
  featureSubItems, 
  isAuthenticated, 
  onCloseMenu 
}: MobileMenuProps) => {
  return (
    <div className="md:hidden py-4 px-4 bg-background border-b">
      <nav className="space-y-4">
        {mainNavItems.map((item) => {
          if (item.name === 'Features') {
            return (
              <MobileFeaturesMenu 
                key={item.name}
                featureItems={featureSubItems}
                onItemClick={onCloseMenu}
              />
            );
          }
          
          return (
            <NavItem 
              key={item.name}
              name={item.name}
              path={item.path}
              onClick={onCloseMenu}
            />
          );
        })}

        <div className="pt-4 border-t border-border">
          {isAuthenticated ? (
            <div className="flex items-center py-2">
              <UserButton /> 
              <span className="ml-3 text-sm">My Account</span>
            </div>
          ) : (
            <div className="flex flex-col space-y-2">
              <Button variant="outline" asChild className="w-full">
                <Link to="/login" onClick={onCloseMenu}>Sign In</Link>
              </Button>
              <Button asChild className="w-full">
                <Link to="/login?signup=true" onClick={onCloseMenu}>Get Started</Link>
              </Button>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default MobileMenu;
