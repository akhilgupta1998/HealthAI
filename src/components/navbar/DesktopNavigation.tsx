
import React from 'react';
import { 
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem
} from '@/components/ui/navigation-menu';
import NavItem from './NavItem';
import FeaturesDropdown from './FeaturesDropdown';

interface NavItem {
  name: string;
  path: string;
}

interface DesktopNavigationProps {
  mainNavItems: NavItem[];
  featureSubItems: NavItem[];
}

const DesktopNavigation = ({ mainNavItems, featureSubItems }: DesktopNavigationProps) => {
  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        {mainNavItems.map((item) => {
          if (item.name === 'Features') {
            return (
              <FeaturesDropdown 
                key={item.name} 
                featureItems={featureSubItems} 
              />
            );
          }
          
          return (
            <NavigationMenuItem key={item.name}>
              <NavItem name={item.name} path={item.path} />
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default DesktopNavigation;
