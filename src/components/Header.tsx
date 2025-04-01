
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Menu, X, Home, User, LogIn } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFirebaseContext } from '@/contexts/FirebaseContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated } = useFirebaseContext();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const navItems = [
    { name: 'Home', path: '/', icon: <Home className="h-4 w-4 mr-1" /> },
    { name: 'Features', path: '/features' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'About', path: '/about' },
  ];
  
  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isScrolled ? "bg-background/95 backdrop-blur-md shadow-sm" : "bg-transparent"
    )}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-foreground">Health Guardian</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Button key={item.name} variant="ghost" asChild>
                <Link to={item.path} className="flex items-center">
                  {item.icon}
                  {item.name}
                </Link>
              </Button>
            ))}
          </nav>
          
          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-2">
            {isAuthenticated ? (
              <Button asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login">
                    <LogIn className="h-4 w-4 mr-1" />
                    Log in
                  </Link>
                </Button>
                <Button asChild>
                  <Link to="/login?signup=true">
                    <User className="h-4 w-4 mr-1" />
                    Sign Up
                  </Link>
                </Button>
              </>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-b">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Button
                  key={item.name}
                  variant="ghost"
                  className="justify-start"
                  asChild
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Link to={item.path} className="flex items-center">
                    {item.icon}
                    {item.name}
                  </Link>
                </Button>
              ))}
              <div className="border-t pt-2 mt-2">
                {isAuthenticated ? (
                  <Button className="w-full" asChild onClick={() => setIsMenuOpen(false)}>
                    <Link to="/dashboard">Dashboard</Link>
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" className="w-full mb-2" asChild onClick={() => setIsMenuOpen(false)}>
                      <Link to="/login">
                        <LogIn className="h-4 w-4 mr-1" />
                        Log in
                      </Link>
                    </Button>
                    <Button className="w-full" asChild onClick={() => setIsMenuOpen(false)}>
                      <Link to="/login?signup=true">
                        <User className="h-4 w-4 mr-1" />
                        Sign Up
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
