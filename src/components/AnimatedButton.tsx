
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Slot } from '@radix-ui/react-slot';

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  asChild?: boolean;
  as?: React.ElementType;
}

const AnimatedButton = ({ 
  children, 
  variant = 'default', 
  size = 'default', 
  className,
  asChild,
  as: Component,
  ...props 
}: AnimatedButtonProps) => {
  let variantClasses = '';
  
  switch (variant) {
    case 'accent':
      variantClasses = 'bg-accent text-accent-foreground hover:bg-accent/90';
      break;
    case 'outline':
      variantClasses = 'border border-input bg-background hover:bg-accent/10 hover:text-accent';
      break;
    case 'ghost':
      variantClasses = 'hover:bg-accent/10 hover:text-accent';
      break;
    default:
      variantClasses = 'bg-primary text-primary-foreground hover:bg-primary/90';
  }
  
  const Comp = asChild ? Slot : Component || 'button';
  
  return (
    <Comp
      className={cn(
        'relative overflow-hidden transition-all duration-300 ease-out active:scale-95',
        'after:absolute after:inset-0 after:z-[-1] after:bg-gradient-to-r after:from-primary/80 after:to-accent/80 after:opacity-0 hover:after:opacity-10 after:transition-opacity',
        variantClasses,
        className
      )}
      {...(Comp === 'button' ? { size } : {})}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </Comp>
  );
};

export default AnimatedButton;
