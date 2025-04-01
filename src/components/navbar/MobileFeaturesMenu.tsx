
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureItem {
  name: string;
  path: string;
}

interface MobileFeaturesMenuProps {
  featureItems: FeatureItem[];
  onItemClick?: () => void;
}

const MobileFeaturesMenu = ({ featureItems, onItemClick }: MobileFeaturesMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  const isPathActive = (path: string) => location.pathname === path;
  
  return (
    <div className="space-y-2">
      <div 
        className="flex items-center justify-between cursor-pointer" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <Link 
          to="/features"
          className={cn(
            "block py-2 text-base font-medium",
            isPathActive('/features') ? "text-primary" : "text-foreground"
          )}
        >
          Features
        </Link>
        <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "transform rotate-180")} />
      </div>
      
      {isOpen && (
        <div className="pl-4 border-l border-border space-y-2">
          {featureItems.map((subItem) => (
            <Link
              key={subItem.name}
              to={subItem.path}
              className={cn(
                "block py-1 text-sm",
                isPathActive(subItem.path) ? "text-primary" : "text-muted-foreground"
              )}
              onClick={onItemClick}
            >
              {subItem.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MobileFeaturesMenu;
