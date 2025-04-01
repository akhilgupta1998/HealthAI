
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink
} from '@/components/ui/navigation-menu';

interface FeatureItem {
  name: string;
  path: string;
}

interface FeaturesDropdownProps {
  featureItems: FeatureItem[];
}

const FeaturesDropdown = ({ featureItems }: FeaturesDropdownProps) => {
  const location = useLocation();
  
  const isPathActive = (path: string) => location.pathname === path;
  const isFeatureActive = isPathActive('/features');
  
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger 
        className={cn(
          isFeatureActive && "bg-accent text-accent-foreground"
        )}
      >
        Features
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
          {featureItems.map((subItem) => (
            <li key={subItem.name}>
              <NavigationMenuLink asChild>
                <Link
                  to={subItem.path}
                  className={cn(
                    "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                    isPathActive(subItem.path) && "bg-accent text-accent-foreground"
                  )}
                >
                  <div className="text-sm font-medium leading-none">{subItem.name}</div>
                </Link>
              </NavigationMenuLink>
            </li>
          ))}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
};

export default FeaturesDropdown;
