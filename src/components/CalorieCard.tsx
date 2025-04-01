<<<<<<< HEAD
=======

>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
<<<<<<< HEAD
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Utensils, Apple, Coffee } from 'lucide-react';
=======
import { motion } from 'framer-motion';
import { Settings } from 'lucide-react';
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac

interface CalorieCardProps {
  consumed: number;
  goal: number;
  className?: string;
}

const CalorieCard: React.FC<CalorieCardProps> = ({ consumed = 0, goal = 2000, className = '' }) => {
  const [percentage, setPercentage] = useState(0);
<<<<<<< HEAD
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => {
      setPercentage(Math.min((consumed / goal) * 100, 100));
      
      // Reset animation flag after animation
      const animTimer = setTimeout(() => {
        setIsAnimating(false);
      }, 1500);
      
      return () => clearTimeout(animTimer);
=======
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setPercentage(Math.min((consumed / goal) * 100, 100));
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
    }, 500);
    
    return () => clearTimeout(timer);
  }, [consumed, goal]);
  
  const remaining = Math.max(goal - consumed, 0);
  
  const getProgressColor = () => {
    if (percentage > 100) return '#ef4444'; // Red for over limit
    if (percentage > 90) return '#f97316'; // Orange for near limit
    return '#10b981'; // Green for good progress
  };
  
<<<<<<< HEAD
  const textClass = isAnimating 
    ? 'animate-pulse text-primary transition-colors duration-500'
    : 'text-primary';
  
  return (
    <Card className={`glass-card overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 p-5 ${className}`}>
      <CardContent className="p-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <motion.div
              initial={{ rotate: -20, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mr-2"
            >
              <Utensils className="h-5 w-5 text-primary" />
            </motion.div>
            <h3 className="font-medium text-lg">Daily Calories</h3>
          </div>
          <motion.button 
            className="text-muted-foreground hover:text-foreground transition-colors"
            whileHover={{ rotate: 45 }}
            transition={{ duration: 0.2 }}
          >
            <Settings className="h-4 w-4" />
          </motion.button>
        </div>
        
        <div className="flex flex-col sm:flex-row">
          <div className="w-28 h-28 mx-auto sm:mx-0 sm:mr-5 mb-4 sm:mb-0">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <CircularProgressbar
                value={percentage}
                text={`${Math.round(percentage)}%`}
                strokeWidth={10}
                styles={buildStyles({
                  textSize: '1.5rem',
                  textColor: 'var(--foreground)',
                  pathColor: getProgressColor(),
                  trailColor: 'var(--secondary)',
                  pathTransition: 'stroke-dashoffset 1.5s ease 0s',
                })}
              />
            </motion.div>
=======
  return (
    <Card className={`glass-card p-5 ${className}`}>
      <CardContent className="p-0">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">Daily Calories</h3>
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <Settings className="h-4 w-4" />
          </button>
        </div>
        
        <div className="flex">
          <div className="w-24 h-24 mr-4">
            <CircularProgressbar
              value={percentage}
              text={`${Math.round(percentage)}%`}
              strokeWidth={10}
              styles={buildStyles({
                textSize: '1.5rem',
                textColor: 'var(--foreground)',
                pathColor: getProgressColor(),
                trailColor: 'var(--secondary)',
              })}
            />
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
          </div>
          
          <div className="flex-1">
            <div className="grid grid-cols-3 gap-2">
<<<<<<< HEAD
              <div className="flex flex-col items-center sm:items-start">
                <AnimatePresence mode="wait">
                  <motion.p 
                    key={consumed}
                    className={`text-xl font-bold ${textClass}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    {consumed}
                  </motion.p>
                </AnimatePresence>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Apple className="h-3 w-3 mr-1" />
                  <span>Consumed</span>
                </div>
              </div>
              
              <div className="flex flex-col items-center sm:items-start">
                <AnimatePresence mode="wait">
                  <motion.p 
                    key={remaining}
                    className="text-xl font-bold"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    {remaining}
                  </motion.p>
                </AnimatePresence>
                <p className="text-xs text-muted-foreground">Remaining</p>
              </div>
              
              <div className="flex flex-col items-center sm:items-start">
                <p className="text-xl font-bold text-muted-foreground">{goal}</p>
                <p className="text-xs text-muted-foreground">Daily Goal</p>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="w-full bg-secondary/50 rounded-full h-2">
                <motion.div 
                  className="h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{ backgroundColor: getProgressColor() }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(percentage, 100)}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </div>
              
              <div className="mt-3 grid grid-cols-4 text-xs text-muted-foreground">
                <div>0%</div>
                <div className="text-center">25%</div>
                <div className="text-center">50%</div>
                <div className="text-right">100%</div>
=======
              <div>
                <motion.p 
                  className="text-lg font-bold text-primary"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  key={consumed}
                >
                  {consumed}
                </motion.p>
                <p className="text-xs text-muted-foreground">Consumed</p>
              </div>
              
              <div>
                <motion.p 
                  className="text-lg font-bold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  key={remaining}
                >
                  {remaining}
                </motion.p>
                <p className="text-xs text-muted-foreground">Remaining</p>
              </div>
              
              <div>
                <p className="text-lg font-bold text-muted-foreground">{goal}</p>
                <p className="text-xs text-muted-foreground">Goal</p>
              </div>
            </div>
            
            <div className="mt-3">
              <div className="w-full bg-secondary rounded-full h-1.5">
                <div 
                  className="h-1.5 rounded-full transition-all duration-1000 ease-out"
                  style={{ 
                    width: `${Math.min(percentage, 100)}%`,
                    backgroundColor: getProgressColor()
                  }}
                ></div>
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalorieCard;
<<<<<<< HEAD

=======
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
