<<<<<<< HEAD
import React, { useState, useEffect, useCallback, memo } from 'react';
import { useFirebaseContext } from '@/contexts/FirebaseContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
=======

import React, { useState, useEffect } from 'react';
import { useFirebaseContext } from '@/contexts/FirebaseContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
import BMICalculator from '@/components/BMICalculator';
import AIFoodScanner from '@/components/AIFoodScanner';
import MealCard from '@/components/MealCard';
import CalorieCard from '@/components/CalorieCard';
import NutritionChart from '@/components/NutritionChart';
import OnboardingStatus from '@/components/OnboardingStatus';
<<<<<<< HEAD
import { Plus, Calendar, Droplets, TrendingUp, ArrowUpRight, BarChart2, Utensils, Camera, ArrowRight, Dumbbell, Apple, Scale, Target, Info, Bell, Activity, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

const cardVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

// Modify the Progress component usage to fix linter errors
interface ProgressBarProps {
  value: number;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value, className }) => (
  <Progress 
    value={value} 
    className={className}
  />
);

const Dashboard = memo(() => {
  const { isAuthenticated, userProfile, user, updateProfile } = useFirebaseContext();
  const navigate = useNavigate();
  const [waterCount, setWaterCount] = useState(0);
  const [currentDate, setCurrentDate] = useState(new Date());
  const isMobile = useIsMobile();
  const [isOpenAIScanner, setIsOpenAIScanner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dailyStats, setDailyStats] = useState({
    calories: { consumed: 0, goal: userProfile?.goalCalories || 2000 },
    water: { consumed: 0, goal: userProfile?.goalWater || 8 },
    exercise: { minutes: 0, goal: 60 },
    weight: { current: userProfile?.weight || 70, goal: userProfile?.goalWeight || 65 }
  });
  
  const fetchDailyData = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Format date to YYYY-MM-DD
      const formattedDate = currentDate.toISOString().split('T')[0];
      
      // Simulate getting data from server - in production this would use actual API
      const mockData = {
        caloriesConsumed: Math.floor(Math.random() * 1500),
        waterIntake: Math.floor(Math.random() * 8),
        exerciseMinutes: Math.floor(Math.random() * 60),
        weight: userProfile?.weight || 70
      };
      
      // Update state with fetched data
      setDailyStats({
        calories: { 
          consumed: mockData.caloriesConsumed || 0, 
          goal: userProfile?.goalCalories || 2000 
        },
        water: { 
          consumed: mockData.waterIntake || 0, 
          goal: userProfile?.goalWater || 8 
        },
        exercise: { 
          minutes: mockData.exerciseMinutes || 0, 
          goal: 60 
        },
        weight: { 
          current: mockData.weight || userProfile?.weight || 70, 
          goal: userProfile?.goalWeight || 65 
        }
      });
      
      setWaterCount(mockData.waterIntake || 0);
    } catch (error) {
      console.error('Error fetching daily data:', error);
      toast.error('Could not load your daily statistics');
    } finally {
      setLoading(false);
    }
  }, [currentDate, user, userProfile]);
  
  useEffect(() => {
    fetchDailyData();
  }, [fetchDailyData]);
  
  const handleAddWater = async () => {
    try {
      const newCount = waterCount + 1;
      setWaterCount(newCount);
      
      // Update local state
      setDailyStats(prev => ({
        ...prev,
        water: {
          ...prev.water,
          consumed: newCount
        }
      }));
      
      // Update backend - this would connect to a real API in production
      if (user) {
        // Format date to YYYY-MM-DD
        const formattedDate = currentDate.toISOString().split('T')[0];
        
        toast.success('Water intake logged');
      }
    } catch (error) {
      console.error('Error updating water data:', error);
      toast.error('Failed to save water intake');
      
      // Revert the UI update on error
      setWaterCount(prev => prev - 1);
      setDailyStats(prev => ({
        ...prev,
        water: {
          ...prev.water,
          consumed: prev.water.consumed - 1
        }
      }));
    }
  };

  // Generate personalized suggestions based on user data
  const getPersonalizedSuggestions = () => {
    const suggestions = [];
    
    if (userProfile?.dietaryPreferences?.length > 0) {
      suggestions.push(`Follow recipes aligned with your ${userProfile.dietaryPreferences.join(', ')} dietary preferences`);
    } else {
      suggestions.push("Complete your dietary preferences to get personalized meal suggestions");
    }
    
    if (dailyStats.water.consumed < dailyStats.water.goal / 2) {
      suggestions.push("You're behind on water intake today. Try to drink more water!");
    }
    
    if (dailyStats.calories.consumed > dailyStats.calories.goal * 0.8) {
      suggestions.push("You're close to your calorie goal for today. Consider lighter options for dinner.");
    }
    
    if (dailyStats.exercise.minutes < dailyStats.exercise.goal / 2) {
      suggestions.push("You haven't logged much exercise today. Even a short walk can help!");
    }
    
    return suggestions.length > 0 ? suggestions : ["Track your meals, water, and exercise regularly to see personalized suggestions"];
  };

  const suggestions = getPersonalizedSuggestions();
  
  // Get today's date in a readable format
  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(currentDate);

  return (
    <div className="container mx-auto max-w-7xl">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Welcome Back{userProfile?.displayName ? `, ${userProfile.displayName.split(' ')[0]}` : ''}!</h1>
          <p className="text-muted-foreground">{todayFormatted}</p>
        </div>
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <Button 
            className="bg-indigo-600 hover:bg-indigo-700"
            onClick={() => navigate('/food-tracking')}
          >
            <Utensils className="mr-2 h-4 w-4" />
            Track Food
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate('/calendar')}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Calendar
          </Button>
        </div>
      </div>

      {/* Food Scanner Featured at Top */}
      <motion.div 
        className="mb-8" 
        initial="hidden" 
        animate="visible" 
        variants={cardVariants}
        transition={{ duration: 0.2 }}
      >
        <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/40 dark:to-indigo-950/40 border-0 shadow-md overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">Scan Your Food</h2>
                <p className="text-muted-foreground mb-4">
                  Take a photo of your meal and our AI will identify the food, calculate calories and provide nutritional information instantly.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700"
                    onClick={() => setIsOpenAIScanner(true)}
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Scan Food Now
                  </Button>
                  <Button 
                    variant="outline"
                    className="w-full sm:w-auto"
                    onClick={() => navigate('/food-tracking')}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Log Manually
                  </Button>
                </div>
              </div>
              <div className="w-full md:w-auto">
                <img 
                  src="/assets/food-scan.jpg" 
                  alt="Food Scanning" 
                  className="rounded-lg object-cover w-full md:w-64 h-40 shadow-md"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Daily Statistics */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Today's Progress</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/progress')}
            className="text-primary"
          >
            View All Stats
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
            <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-100 dark:border-amber-900/50 shadow-sm overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-medium flex items-center">
                    <Apple className="mr-2 h-5 w-5 text-amber-600" />
                    Calories
                  </CardTitle>
                  <Badge variant={dailyStats.calories.consumed > dailyStats.calories.goal ? "destructive" : "outline"} className="ml-2">
                    {Math.round((dailyStats.calories.consumed / dailyStats.calories.goal) * 100)}%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col">
                  <div className="flex items-end">
                    <span className="text-3xl font-bold">{dailyStats.calories.consumed}</span>
                    <span className="text-sm text-muted-foreground ml-1 mb-1">/ {dailyStats.calories.goal} kcal</span>
                  </div>
                  <ProgressBar 
                    value={(dailyStats.calories.consumed / dailyStats.calories.goal) * 100} 
                    className="h-2 mt-2 bg-amber-200 [&>div]:bg-amber-500"
                  />
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-center text-amber-700 hover:text-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/30"
                  onClick={() => navigate('/food-tracking')}
                >
                  Log Food <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-blue-100 dark:border-blue-900/50 shadow-sm overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-medium flex items-center">
                    <Droplets className="mr-2 h-5 w-5 text-blue-600" />
                    Water
                  </CardTitle>
                  <Badge variant="outline" className="ml-2">
                    {Math.round((dailyStats.water.consumed / dailyStats.water.goal) * 100)}%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col">
                  <div className="flex items-end">
                    <span className="text-3xl font-bold">{dailyStats.water.consumed}</span>
                    <span className="text-sm text-muted-foreground ml-1 mb-1">/ {dailyStats.water.goal} cups</span>
                  </div>
                  <ProgressBar 
                    value={(dailyStats.water.consumed / dailyStats.water.goal) * 100} 
                    className="h-2 mt-2 bg-blue-200 [&>div]:bg-blue-500"
                  />
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-center text-blue-700 hover:text-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                  onClick={handleAddWater}
                >
                  Add Water <Plus className="ml-1 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.3 }}>
            <Card className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950/30 dark:to-teal-950/30 border-green-100 dark:border-green-900/50 shadow-sm overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-medium flex items-center">
                    <Dumbbell className="mr-2 h-5 w-5 text-green-600" />
                    Exercise
                  </CardTitle>
                  <Badge variant="outline" className="ml-2">
                    {Math.round((dailyStats.exercise.minutes / dailyStats.exercise.goal) * 100)}%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col">
                  <div className="flex items-end">
                    <span className="text-3xl font-bold">{dailyStats.exercise.minutes}</span>
                    <span className="text-sm text-muted-foreground ml-1 mb-1">/ {dailyStats.exercise.goal} min</span>
                  </div>
                  <ProgressBar 
                    value={(dailyStats.exercise.minutes / dailyStats.exercise.goal) * 100} 
                    className="h-2 mt-2 bg-green-200 [&>div]:bg-green-500"
                  />
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-center text-green-700 hover:text-green-800 hover:bg-green-100 dark:hover:bg-green-900/30"
                  onClick={() => navigate('/exercise')}
                >
                  Log Exercise <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.4 }}>
            <Card className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30 border-purple-100 dark:border-purple-900/50 shadow-sm overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-medium flex items-center">
                    <Activity className="mr-2 h-5 w-5 text-purple-600" />
                    Vitals
                  </CardTitle>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6" 
                    onClick={() => navigate('/vitals')}
                  >
                    <Info className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col">
                  <div className="flex justify-between">
                    <div>
                      <span className="text-sm font-medium">Weight</span>
                      <div className="flex items-baseline">
                        <span className="text-2xl font-semibold">{dailyStats.weight.current}</span>
                        <span className="text-xs ml-1 text-muted-foreground">kg</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Goal</span>
                      <div className="flex items-baseline">
                        <span className="text-2xl font-semibold">{dailyStats.weight.goal}</span>
                        <span className="text-xs ml-1 text-muted-foreground">kg</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-center text-purple-700 hover:text-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/30"
                  onClick={() => navigate('/vitals')}
                >
                  Update Vitals <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Personalized Suggestions */}
      <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.5 }}>
        <Card className="mb-8 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30 border-0 shadow-md overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5 text-indigo-600" />
              Your Personalized Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Target className="h-5 w-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Access Buttons */}
      <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.6 }}>
        <h2 className="text-2xl font-bold mb-4">Quick Access</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <Button 
            variant="outline" 
            className="h-auto flex flex-col items-center justify-center py-6 border-dashed hover:bg-background/50"
            onClick={() => navigate('/meal-planner')}
          >
            <Utensils className="h-6 w-6 mb-2 text-primary" />
            <span>Meal Planner</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto flex flex-col items-center justify-center py-6 border-dashed hover:bg-background/50"
            onClick={() => navigate('/water')}
          >
            <Droplets className="h-6 w-6 mb-2 text-blue-500" />
            <span>Water Tracker</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto flex flex-col items-center justify-center py-6 border-dashed hover:bg-background/50"
            onClick={() => navigate('/calendar')}
          >
            <Calendar className="h-6 w-6 mb-2 text-green-500" />
            <span>Calendar</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto flex flex-col items-center justify-center py-6 border-dashed hover:bg-background/50"
            onClick={() => navigate('/progress')}
          >
            <BarChart2 className="h-6 w-6 mb-2 text-purple-500" />
            <span>Progress</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto flex flex-col items-center justify-center py-6 border-dashed hover:bg-background/50"
            onClick={() => navigate('/vitals')}
          >
            <Activity className="h-6 w-6 mb-2 text-red-500" />
            <span>Vitals</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-auto flex flex-col items-center justify-center py-6 border-dashed hover:bg-background/50"
            onClick={() => navigate('/profile')}
          >
            <User className="h-6 w-6 mb-2 text-amber-500" />
            <span>Profile</span>
          </Button>
        </div>
      </motion.div>

      {/* AI Food Scanner Modal */}
      {isOpenAIScanner && (
        <AIFoodScanner isOpen={isOpenAIScanner} onClose={() => setIsOpenAIScanner(false)} />
      )}
    </div>
  );
});
=======
import { Plus, Calendar, Droplets, TrendingUp, ArrowUpRight, BarChart2, Utensils } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { isAuthenticated, userMetadata, user } = useFirebaseContext();
  const navigate = useNavigate();
  const [waterCount, setWaterCount] = useState(0);
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Sample nutrition data - using numbers for protein, carbs, and fat (not strings)
  const nutritionData = {
    consumed: 1200,
    goal: 2000,
    protein: 65,
    carbs: 150,
    fat: 45
  };
  
  useEffect(() => {
    // Simulate fetching water data from backend
    const fetchWaterData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        // For demo, just use 0 as default
        setWaterCount(0);
      } catch (error) {
        console.error('Error fetching water data:', error);
      }
    };
    
    fetchWaterData();
  }, [currentDate]);
  
  const handleAddWater = () => {
    setWaterCount(prev => prev + 1);
    toast.success('Water intake logged');
  };
  
  return (
    <div className="container mx-auto p-4 md:p-6 pt-20">
      <motion.div 
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Welcome {userMetadata?.firstName || user?.displayName?.split(' ')[0] || 'back'}!
          </h1>
          <p className="text-muted-foreground">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/calendar')}
          >
            <Calendar className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/progress')}
          >
            <BarChart2 className="h-5 w-5" />
          </Button>
        </div>
      </motion.div>
      
      {/* Onboarding Status Banner */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <OnboardingStatus />
      </motion.div>
      
      <div className="grid gap-6 md:grid-cols-4 lg:grid-cols-8">
        {/* Calories and Macros */}
        <motion.div 
          className="md:col-span-3 lg:col-span-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle>Daily Nutrition</CardTitle>
              <CardDescription>Your calorie and macronutrient intake for today</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="calories">
                <TabsList className="mb-4">
                  <TabsTrigger value="calories">Calories</TabsTrigger>
                  <TabsTrigger value="macros">Macros</TabsTrigger>
                </TabsList>
                <TabsContent value="calories">
                  <CalorieCard consumed={nutritionData.consumed} goal={nutritionData.goal} />
                </TabsContent>
                <TabsContent value="macros">
                  <NutritionChart 
                    protein={nutritionData.protein} 
                    carbs={nutritionData.carbs} 
                    fat={nutritionData.fat} 
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* BMI Calculator and Water Tracker */}
        <motion.div 
          className="md:col-span-1 lg:col-span-3 flex flex-col gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>BMI Calculator</CardTitle>
            </CardHeader>
            <CardContent>
              <BMICalculator />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <Droplets className="h-5 w-5 text-blue-500 mr-2" />
                  Water Intake
                </CardTitle>
              </div>
              <Button size="sm" onClick={handleAddWater}>
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-2">
                <div className="font-medium">{waterCount} / 8 glasses</div>
                <div 
                  className="text-muted-foreground text-sm cursor-pointer hover:text-primary transition-colors"
                  onClick={() => navigate('/water')}
                >
                  <div className="flex items-center">
                    View More
                    <ArrowUpRight className="ml-1 h-3 w-3" />
                  </div>
                </div>
              </div>
              <Progress value={(waterCount / 8) * 100} className="h-2 bg-blue-100 dark:bg-blue-950">
                <div className="h-full bg-blue-500 rounded-full" />
              </Progress>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Food Scanner */}
        <motion.div 
          className="md:col-span-2 lg:col-span-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-emerald-50/50 to-emerald-100/30 dark:from-emerald-900/20 dark:to-emerald-800/10 border-emerald-200/50 dark:border-emerald-800/30">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Utensils className="h-5 w-5 text-emerald-500 mr-2" />
                Scan Your Food
              </CardTitle>
              <CardDescription>Take a photo of your meal for instant nutritional analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <AIFoodScanner />
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Today's Meals */}
        <motion.div 
          className="md:col-span-2 lg:col-span-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <div>
                <CardTitle>Today's Meals</CardTitle>
                <CardDescription>What you've eaten today</CardDescription>
              </div>
              <Button size="sm" onClick={() => navigate('/food-tracking')}>
                <Plus className="h-4 w-4 mr-1" /> Add Meal
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <MealCard
                  mealType="Breakfast"
                  time="8:30 AM"
                  foodName="Fresh Fruit Salad"
                  calories={320}
                  protein="5g"
                  carbs="45g"
                  fat="10g"
                  imageUrl="https://images.unsplash.com/photo-1494390248081-4e521a5940db?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1160&q=80"
                  onEdit={() => navigate('/food-tracking')}
                />
                <MealCard
                  mealType="Lunch"
                  time="12:45 PM"
                  foodName="Chicken Salad"
                  calories={520}
                  protein="35g"
                  carbs="25g"
                  fat="20g"
                  imageUrl="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1160&q=80"
                  onEdit={() => navigate('/food-tracking')}
                />
                <Button 
                  variant="ghost" 
                  className="w-full" 
                  onClick={() => navigate('/food-tracking')}
                >
                  View All Meals
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac

export default Dashboard;
