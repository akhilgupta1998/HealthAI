<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Search, Filter, Plus, Utensils } from 'lucide-react';
=======

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Search, Filter, Plus } from 'lucide-react';
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
import Header from '@/components/Header';
import CalorieCard from '@/components/CalorieCard';
import MealCard from '@/components/MealCard';
import AIFoodScanner from '@/components/AIFoodScanner';
import NutritionChart from '@/components/NutritionChart';
import AnimatedButton from '@/components/AnimatedButton';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
<<<<<<< HEAD
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { FileEdit, Camera } from "lucide-react";

const FoodTracking = () => {
  const [isOpenAIScanner, setIsOpenAIScanner] = useState(false);
  const [activeTab, setActiveTab] = useState('search');

=======

const FoodTracking = () => {
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-grow pt-24 pb-16 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8 animate-fade-in">
            <div className="flex items-center">
              <Link to="/dashboard" className="mr-3">
                <AnimatedButton variant="ghost" size="icon" className="h-10 w-10">
                  <ArrowLeft className="h-5 w-5" />
                </AnimatedButton>
              </Link>
              <h1 className="text-3xl font-bold">Food Tracking</h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="text-sm font-medium">Today</div>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          
          {/* Calorie Summary Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <CalorieCard consumed={1200} goal={2000} className="animate-fade-in" />
            
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card p-5 animate-fade-in" style={{ animationDelay: '100ms' }}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">Nutrient Goals</h3>
                  <span className="text-xs text-muted-foreground">Daily</span>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Protein</span>
                      <span>65g / 120g</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: '54%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Carbs</span>
                      <span>180g / 250g</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: '72%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Fat</span>
                      <span>45g / 65g</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-500 rounded-full" style={{ width: '69%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="glass-card p-5 animate-fade-in" style={{ animationDelay: '200ms' }}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">Weekly Progress</h3>
                  <span className="text-xs text-muted-foreground">Last 7 days</span>
                </div>
                
                <div className="flex items-end space-x-2 h-32">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                    // Generate some sample heights
                    const heights = [65, 80, 50, 90, 75, 60, 70];
                    const isToday = index === 3; // Thursday for example
                    
                    return (
                      <div key={day} className="flex-1 flex flex-col items-center">
                        <div 
                          className={`w-full rounded-t-sm transition-all ${isToday ? 'bg-primary' : 'bg-secondary/80'}`}
                          style={{ height: `${heights[index]}%` }}
                        ></div>
                        <div className="text-xs mt-2 text-muted-foreground">{day}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6 animate-fade-in">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search for foods..."
                className="pl-10"
              />
            </div>
            
            <div className="flex space-x-2">
              <AnimatedButton variant="outline" className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </AnimatedButton>
              
<<<<<<< HEAD
              <AnimatedButton 
                className="flex items-center bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white shadow-md transition-all duration-300 hover:shadow-lg"
                onClick={() => {
                  // Show food selection dialog
                  document.getElementById('food-selection-modal')?.classList.remove('hidden');
                }}
              >
=======
              <AnimatedButton className="flex items-center">
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
                <Plus className="mr-2 h-4 w-4" />
                Add Food
              </AnimatedButton>
            </div>
          </div>
          
<<<<<<< HEAD
          {/* Food Selection Modal */}
          <div id="food-selection-modal" className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center hidden">
            <div className="bg-card rounded-lg shadow-lg border max-w-md w-full p-6 animate-in fade-in zoom-in duration-300">
              <h3 className="text-xl font-bold mb-4">Add Food to Tracker</h3>
              
              {/* Options to Add Food */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <Card 
                    className="cursor-pointer hover:shadow-md transition-shadow duration-200"
                    onClick={() => {
                      setActiveTab("search");
                      // Add scroll to search section
                      const searchSection = document.getElementById("search-section");
                      if (searchSection) {
                        searchSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <Search className="mr-2 h-5 w-5 text-purple-500" />
                        Search Food Database
                      </CardTitle>
                      <CardDescription>Find foods from our extensive database</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        variant="outline" 
                        className="w-full justify-between"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveTab("search");
                          const searchSection = document.getElementById("search-section");
                          if (searchSection) {
                            searchSection.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                      >
                        Start Search
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <Card 
                    className="cursor-pointer hover:shadow-md transition-shadow duration-200"
                    onClick={() => {
                      setActiveTab("custom");
                      // Add scroll to custom section
                      const customSection = document.getElementById("custom-section");
                      if (customSection) {
                        customSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <FileEdit className="mr-2 h-5 w-5 text-emerald-500" />
                        Create Custom Food
                      </CardTitle>
                      <CardDescription>Add your own food with nutrition info</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        variant="outline" 
                        className="w-full justify-between"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveTab("custom");
                          const customSection = document.getElementById("custom-section");
                          if (customSection) {
                            customSection.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                      >
                        Create Food
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <Card 
                    className="cursor-pointer hover:shadow-md transition-shadow duration-200"
                    onClick={() => setIsOpenAIScanner(true)}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <Camera className="mr-2 h-5 w-5 text-blue-500" />
                        Scan Food with AI
                      </CardTitle>
                      <CardDescription>Take a photo and get nutrition info</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        variant="outline" 
                        className="w-full justify-between"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsOpenAIScanner(true);
                        }}
                      >
                        Open Camera
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <AnimatedButton 
                  variant="outline"
                  onClick={() => {
                    document.getElementById('food-selection-modal')?.classList.add('hidden');
                  }}
                >
                  Cancel
                </AnimatedButton>
              </div>
            </div>
          </div>
          
=======
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
          {/* Tabs and Content */}
          <div className="animate-fade-in">
            <Tabs defaultValue="meals">
              <TabsList className="grid grid-cols-4 w-full max-w-md mb-6">
                <TabsTrigger value="meals">Meals</TabsTrigger>
                <TabsTrigger value="scan">Scan</TabsTrigger>
                <TabsTrigger value="analyze">Analysis</TabsTrigger>
                <TabsTrigger value="log">History</TabsTrigger>
              </TabsList>
              
              <TabsContent value="meals" className="space-y-6">
                {/* Breakfast */}
                <div>
                  <h3 className="text-lg font-medium mb-3 flex items-center">
                    Breakfast
                    <span className="text-sm text-muted-foreground ml-2">8:30 AM</span>
                    <span className="ml-auto text-sm font-medium">350 kcal</span>
                  </h3>
                  
                  <MealCard 
                    mealType="Breakfast"
                    foodName="Oatmeal with Berries"
                    calories={350}
                    protein="12g"
                    carbs="45g"
                    fat="8g"
                    className="mb-4"
                  />
                  
                  <div className="flex justify-end">
                    <AnimatedButton variant="outline" size="sm">
                      <Plus className="mr-2 h-3 w-3" />
                      Add to Breakfast
                    </AnimatedButton>
                  </div>
                </div>
                
                {/* Lunch */}
                <div>
                  <h3 className="text-lg font-medium mb-3 flex items-center">
                    Lunch
                    <span className="text-sm text-muted-foreground ml-2">12:45 PM</span>
                    <span className="ml-auto text-sm font-medium">450 kcal</span>
                  </h3>
                  
                  <MealCard 
                    mealType="Lunch"
                    foodName="Grilled Chicken Salad"
                    calories={450}
                    protein="35g"
                    carbs="15g"
                    fat="25g"
                    className="mb-4"
                  />
                  
                  <div className="flex justify-end">
                    <AnimatedButton variant="outline" size="sm">
                      <Plus className="mr-2 h-3 w-3" />
                      Add to Lunch
                    </AnimatedButton>
                  </div>
                </div>
                
                {/* Snack */}
                <div>
                  <h3 className="text-lg font-medium mb-3 flex items-center">
                    Snack
                    <span className="text-sm text-muted-foreground ml-2">3:15 PM</span>
                    <span className="ml-auto text-sm font-medium">180 kcal</span>
                  </h3>
                  
                  <MealCard 
                    mealType="Snack"
                    foodName="Greek Yogurt with Honey"
                    calories={180}
                    protein="18g"
                    carbs="20g"
                    fat="2g"
                    className="mb-4"
                  />
                  
                  <div className="flex justify-end">
                    <AnimatedButton variant="outline" size="sm">
                      <Plus className="mr-2 h-3 w-3" />
                      Add to Snack
                    </AnimatedButton>
                  </div>
                </div>
                
                {/* Dinner */}
                <div>
                  <h3 className="text-lg font-medium mb-3 flex items-center">
                    Dinner
                    <span className="text-sm text-muted-foreground ml-2">Not logged yet</span>
                    <span className="ml-auto text-sm font-medium">0 kcal</span>
                  </h3>
                  
                  <div className="glass-card p-5 border-2 border-dashed border-border bg-transparent hover:bg-secondary/20 transition-colors cursor-pointer flex items-center justify-center">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                        <Plus className="h-5 w-5 text-primary" />
                      </div>
                      <div className="font-medium">Add Dinner</div>
                      <div className="text-sm text-muted-foreground">Log your evening meal</div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="scan">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <AIFoodScanner />
                  
                  <div className="glass-card p-5">
                    <h3 className="font-medium mb-4">Recent Scans</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center p-3 bg-secondary/50 rounded-lg">
                        <div className="w-12 h-12 bg-secondary rounded-md mr-3"></div>
                        <div>
                          <div className="font-medium">Grilled Salmon</div>
                          <div className="text-xs text-muted-foreground">Today, 12:45 PM</div>
                        </div>
                        <div className="ml-auto text-sm font-medium">420 kcal</div>
                      </div>
                      
                      <div className="flex items-center p-3 bg-secondary/50 rounded-lg">
                        <div className="w-12 h-12 bg-secondary rounded-md mr-3"></div>
                        <div>
                          <div className="font-medium">Protein Shake</div>
                          <div className="text-xs text-muted-foreground">Yesterday, 8:30 AM</div>
                        </div>
                        <div className="ml-auto text-sm font-medium">220 kcal</div>
                      </div>
                      
                      <div className="flex items-center p-3 bg-secondary/50 rounded-lg">
                        <div className="w-12 h-12 bg-secondary rounded-md mr-3"></div>
                        <div>
                          <div className="font-medium">Sushi Roll</div>
                          <div className="text-xs text-muted-foreground">Yesterday, 7:15 PM</div>
                        </div>
                        <div className="ml-auto text-sm font-medium">380 kcal</div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="analyze">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <NutritionChart protein={65} carbs={180} fat={45} />
                  
                  <div className="glass-card p-5">
                    <h3 className="font-medium mb-4">Nutritional Insights</h3>
                    
                    <div className="space-y-4">
                      <div className="p-3 bg-blue-500/10 rounded-lg">
                        <div className="font-medium text-blue-600 dark:text-blue-400 mb-1">Protein Intake</div>
                        <p className="text-sm">You're at 54% of your daily protein goal. Consider adding high-protein foods to your dinner.</p>
                      </div>
                      
                      <div className="p-3 bg-green-500/10 rounded-lg">
                        <div className="font-medium text-green-600 dark:text-green-400 mb-1">Carbohydrates</div>
                        <p className="text-sm">Your carb intake is well balanced. Good job maintaining steady energy levels!</p>
                      </div>
                      
                      <div className="p-3 bg-yellow-500/10 rounded-lg">
                        <div className="font-medium text-yellow-600 dark:text-yellow-400 mb-1">Healthy Fats</div>
                        <p className="text-sm">Consider increasing your intake of omega-3 fatty acids by adding more fish or nuts.</p>
                      </div>
                      
                      <div className="p-3 bg-purple-500/10 rounded-lg">
                        <div className="font-medium text-purple-600 dark:text-purple-400 mb-1">Vitamin & Mineral Status</div>
                        <p className="text-sm">Your diet today is lacking in vitamin C. Consider adding citrus fruits to your snacks.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="log">
                <div className="glass-card p-5">
                  <h3 className="font-medium mb-4">Food Log History</h3>
                  
                  <div className="space-y-6">
                    {/* Today */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Today</h4>
                        <span className="text-sm text-muted-foreground">980 kcal</span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center p-3 bg-secondary/50 rounded-lg">
                          <div className="w-10 h-10 bg-secondary rounded-md mr-3"></div>
                          <div>
                            <div className="font-medium">Oatmeal with Berries</div>
                            <div className="text-xs text-muted-foreground">Breakfast - 8:30 AM</div>
                          </div>
                          <div className="ml-auto text-sm font-medium">350 kcal</div>
                        </div>
                        
                        <div className="flex items-center p-3 bg-secondary/50 rounded-lg">
                          <div className="w-10 h-10 bg-secondary rounded-md mr-3"></div>
                          <div>
                            <div className="font-medium">Grilled Chicken Salad</div>
                            <div className="text-xs text-muted-foreground">Lunch - 12:45 PM</div>
                          </div>
                          <div className="ml-auto text-sm font-medium">450 kcal</div>
                        </div>
                        
                        <div className="flex items-center p-3 bg-secondary/50 rounded-lg">
                          <div className="w-10 h-10 bg-secondary rounded-md mr-3"></div>
                          <div>
                            <div className="font-medium">Greek Yogurt with Honey</div>
                            <div className="text-xs text-muted-foreground">Snack - 3:15 PM</div>
                          </div>
                          <div className="ml-auto text-sm font-medium">180 kcal</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Yesterday */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Yesterday</h4>
                        <span className="text-sm text-muted-foreground">1,850 kcal</span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center p-3 bg-secondary/50 rounded-lg">
                          <div className="w-10 h-10 bg-secondary rounded-md mr-3"></div>
                          <div>
                            <div className="font-medium">Protein Shake</div>
                            <div className="text-xs text-muted-foreground">Breakfast - 8:30 AM</div>
                          </div>
                          <div className="ml-auto text-sm font-medium">220 kcal</div>
                        </div>
                        
                        <div className="flex items-center p-3 bg-secondary/50 rounded-lg">
                          <div className="w-10 h-10 bg-secondary rounded-md mr-3"></div>
                          <div>
                            <div className="font-medium">Turkey Sandwich</div>
                            <div className="text-xs text-muted-foreground">Lunch - 1:15 PM</div>
                          </div>
                          <div className="ml-auto text-sm font-medium">480 kcal</div>
                        </div>
                        
                        <div className="flex items-center p-3 bg-secondary/50 rounded-lg">
                          <div className="w-10 h-10 bg-secondary rounded-md mr-3"></div>
                          <div>
                            <div className="font-medium">Protein Bar</div>
                            <div className="text-xs text-muted-foreground">Snack - 4:30 PM</div>
                          </div>
                          <div className="ml-auto text-sm font-medium">200 kcal</div>
                        </div>
                        
                        <div className="flex items-center p-3 bg-secondary/50 rounded-lg">
                          <div className="w-10 h-10 bg-secondary rounded-md mr-3"></div>
                          <div>
                            <div className="font-medium">Sushi Roll</div>
                            <div className="text-xs text-muted-foreground">Dinner - 7:15 PM</div>
                          </div>
                          <div className="ml-auto text-sm font-medium">380 kcal</div>
                        </div>
                        
                        <div className="flex items-center p-3 bg-secondary/50 rounded-lg">
                          <div className="w-10 h-10 bg-secondary rounded-md mr-3"></div>
                          <div>
                            <div className="font-medium">Dark Chocolate</div>
                            <div className="text-xs text-muted-foreground">Snack - 9:45 PM</div>
                          </div>
                          <div className="ml-auto text-sm font-medium">120 kcal</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      {/* Bottom Navigation (same as Dashboard) */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-background/80 backdrop-blur-md py-3 px-8 md:hidden z-40">
        <div className="flex justify-around">
          <Link to="/dashboard" className="flex flex-col items-center text-muted-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link to="/food-tracking" className="flex flex-col items-center text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3v18h18"></path>
              <path d="m19 9-5 5-4-4-3 3"></path>
            </svg>
            <span className="text-xs mt-1">Analytics</span>
          </Link>
          <Link to="#" className="flex flex-col items-center relative">
            <div className="absolute -top-8 bg-primary text-white rounded-full p-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"></path>
                <path d="M12 5v14"></path>
              </svg>
            </div>
            <span className="text-xs mt-8">Add</span>
          </Link>
          <Link to="#" className="flex flex-col items-center text-muted-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span className="text-xs mt-1">Meals</span>
          </Link>
          <Link to="#" className="flex flex-col items-center text-muted-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span className="text-xs mt-1">Profile</span>
          </Link>
        </div>
      </div>
<<<<<<< HEAD

      {/* AI Food Scanner Modal */}
      <AIFoodScanner
        isOpen={isOpenAIScanner}
        onClose={() => setIsOpenAIScanner(false)}
        onScan={(result) => {
          // Handle scan result here
          console.log("Food scanned:", result);
          setIsOpenAIScanner(false);
          // Add logic to save the scanned food to the user's log
        }}
      />

      {/* Add ID elements for scrolling */}
      <div id="search-section" className="pt-4">
        {/* Search interface can go here */}
      </div>

      <div id="custom-section" className="pt-4">
        {/* Custom food form can go here */}
      </div>
=======
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
    </div>
  );
};

export default FoodTracking;
