
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fadeInUp = (delay: number = 0) => ({
  initial: { 
    opacity: 0, 
    y: 20 
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
      delay: delay / 10
    }
  },
  exit: {
    opacity: 0,
    y: 20,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1]
    }
  }
});

export const fadeIn = (delay: number = 0) => ({
  initial: { 
    opacity: 0 
  },
  animate: { 
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
      delay: delay / 10
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1]
    }
  }
});

export const slideIn = (direction: 'left' | 'right' | 'up' | 'down', delay: number = 0) => {
  let x = 0;
  let y = 0;
  
  if (direction === 'left') x = 50;
  if (direction === 'right') x = -50;
  if (direction === 'up') y = 50;
  if (direction === 'down') y = -50;
  
  return {
    initial: { 
      opacity: 0, 
      x, 
      y 
    },
    animate: { 
      opacity: 1, 
      x: 0, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
        delay: delay / 10
      }
    },
    exit: {
      opacity: 0,
      x,
      y,
      transition: {
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };
};

export const scaleIn = (delay: number = 0) => ({
  initial: { 
    opacity: 0, 
    scale: 0.95 
  },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
      delay: delay / 10
    }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1]
    }
  }
});

export const staggerContainer = (staggerChildren: number = 0.05, delayChildren: number = 0) => ({
  initial: {},
  animate: {
    transition: {
      staggerChildren,
      delayChildren: delayChildren / 10
    }
  },
  exit: {
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1
    }
  }
});
