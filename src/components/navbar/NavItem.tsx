
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavItemProps {
  name: string;
  path: string;
  onClick?: () => void;
}

const NavItem = ({ name, path, onClick }: NavItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === path;
  
  return (
    <Link
      to={path}
      className={cn(
        "block py-2 text-base font-medium",
        isActive ? "text-primary" : "text-foreground",
        "px-4 py-2 rounded-md text-sm font-medium",
        isActive ? "bg-accent text-accent-foreground" : "text-foreground hover:bg-accent/50"
      )}
      onClick={onClick}
    >
      {name}
    </Link>
  );
};

export default NavItem;
