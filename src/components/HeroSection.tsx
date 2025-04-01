
import React from 'react';
import { ArrowRight, Camera, BarChart2, Utensils, Activity, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const HeroSection = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/10 animate-float" />
        <div className="absolute bottom-1/4 right-1/3 w-48 h-48 rounded-full bg-accent/10 animate-float animation-delay-1000" />
        <div className="absolute top-1/3 right-1/4 w-32 h-32 rounded-full bg-primary/10 animate-float animation-delay-2000" />
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center max-w-7xl mx-auto">
          {/* Text Content */}
          <motion.div 
            className="w-full lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-block px-3 py-1 mb-6 rounded-full bg-primary/10 text-primary text-sm font-medium">
              AI-Powered Health Tracking
            </div>
            <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight tracking-tight">
              Your Health Journey, 
              <span className="bg-gradient-to-r from-primary via-purple-500 to-accent bg-clip-text text-transparent block">Reimagined</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto lg:mx-0 mb-8">
              Track your nutrition with AI precision. Get personalized health insights and build better habits with our comprehensive wellness platform.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 justify-center lg:justify-start">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link to="/onboarding">
                  <span>Get Started</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild size="lg" className="w-full sm:w-auto">
                <Link to="/features">
                  Explore Features
                </Link>
              </Button>
            </div>
            
            {/* Usage Stats */}
            <div className="flex flex-wrap justify-center lg:justify-start mt-12 gap-8">
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <p className="text-3xl font-bold text-primary">15K+</p>
                <p className="text-muted-foreground">Active Users</p>
              </motion.div>
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <p className="text-3xl font-bold text-primary">1M+</p>
                <p className="text-muted-foreground">Meals Tracked</p>
              </motion.div>
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <p className="text-3xl font-bold text-primary">98%</p>
                <p className="text-muted-foreground">Accuracy</p>
              </motion.div>
            </div>
          </motion.div>
          
          {/* Hero Image/Mockup */}
          <motion.div 
            className="w-full lg:w-1/2 relative"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="relative max-w-md mx-auto">
              {/* Phone Mockup */}
              <div className="rounded-2xl overflow-hidden p-4 shadow-2xl bg-white/10 backdrop-blur-lg border border-white/20">
                {/* App Screenshot */}
                <div className="relative bg-background rounded-xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-accent/5"></div>
                  
                  {/* App UI */}
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-6">
                      <div className="text-lg font-semibold">Health Dashboard</div>
                      <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                        <User className="h-4 w-4" />
                      </div>
                    </div>
                    
                    {/* Daily Progress */}
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-6 border border-white/10">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Daily Calories</span>
                        <span className="font-medium">1,200 / 2,000</span>
                      </div>
                      <div className="w-full h-2 bg-secondary rounded-full">
                        <div className="h-full w-3/5 bg-gradient-to-r from-primary to-accent rounded-full"></div>
                      </div>
                    </div>
                    
                    {/* Feature Cards */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl aspect-square flex flex-col items-center justify-center p-2 border border-white/10">
                        <Camera className="h-6 w-6 text-primary mb-2" />
                        <span className="text-xs text-center">Scan Food</span>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl aspect-square flex flex-col items-center justify-center p-2 border border-white/10">
                        <Activity className="h-6 w-6 text-primary mb-2" />
                        <span className="text-xs text-center">Activity</span>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl aspect-square flex flex-col items-center justify-center p-2 border border-white/10">
                        <Heart className="h-6 w-6 text-primary mb-2" />
                        <span className="text-xs text-center">Vitals</span>
                      </div>
                    </div>
                    
                    {/* Recent Meal */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                      <div className="text-sm font-medium mb-2">Lunch</div>
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-secondary rounded-md"></div>
                        <div>
                          <div className="text-sm font-medium">Grilled Salmon</div>
                          <div className="text-xs text-muted-foreground">420 kcal · 38g protein</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -bottom-6 -left-12 w-24 h-24 rounded-full bg-primary/10 animate-float" style={{ animationDelay: '1s' }}></div>
              <div className="absolute -top-8 -right-8 w-20 h-20 rounded-full bg-accent/10 animate-float" style={{ animationDelay: '2s' }}></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

function User(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

export default HeroSection;
