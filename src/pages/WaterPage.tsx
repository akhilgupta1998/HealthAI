<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFirebaseContext } from '@/contexts/FirebaseContext';
import { WaterLog, addWaterLog, getWaterLogs, deleteWaterLog } from '../services/firebaseService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { Droplet, Clock, Plus, X, ChevronUp, ChevronDown, BarChart, CalendarDays } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const WaterPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useFirebaseContext();
  
  // State for water tracking
  const [waterAmount, setWaterAmount] = useState<number>(250); // Default to 250ml
  const [waterLogs, setWaterLogs] = useState<WaterLog[]>([]);
  const [totalWater, setTotalWater] = useState<number>(0);
  const [goalWater, setGoalWater] = useState<number>(2500); // Default 2.5L goal
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('today');
  
  // Common drink sizes in ml
  const commonSizes = [
    { name: 'Small Glass', amount: 200 },
    { name: 'Regular Glass', amount: 250 },
    { name: 'Large Glass', amount: 350 },
    { name: 'Water Bottle', amount: 500 },
    { name: 'Large Bottle', amount: 750 },
    { name: 'Sport Bottle', amount: 1000 },
  ];
  
  // Load water logs and user goal
  useEffect(() => {
    if (isAuthenticated && user) {
      loadWaterLogs();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, user, activeTab]);
  
  // Load water logs
  const loadWaterLogs = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Get start and end date based on active tab
      let startDate: Date | undefined;
      let endDate: Date | undefined;
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (activeTab === 'today') {
        startDate = today;
        endDate = new Date(today);
        endDate.setHours(23, 59, 59, 999);
      } else if (activeTab === 'week') {
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
      } else if (activeTab === 'month') {
        startDate = new Date(today);
        startDate.setMonth(today.getMonth() - 1);
      }
      
      // Get water logs
      const logs = await getWaterLogs(user.uid, startDate, endDate);
      setWaterLogs(logs);
      
      // Calculate total water for today
      if (activeTab === 'today') {
        const total = logs.reduce((sum, log) => sum + log.amount, 0);
        setTotalWater(total);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading water logs:', error);
      toast.error('Failed to load water logs');
      setIsLoading(false);
    }
  };
  
  // Add water log
  const handleAddWater = async () => {
    if (!user) {
      toast.error('Please sign in to track water intake');
      navigate('/login');
      return;
    }
    
    try {
      const newWaterLog: WaterLog = {
        userId: user.uid,
        amount: waterAmount,
        timestamp: new Date(),
      };
      
      await addWaterLog(newWaterLog);
      toast.success(`Added ${waterAmount}ml of water`);
      
      // Reload logs
      loadWaterLogs();
    } catch (error) {
      console.error('Error adding water log:', error);
      toast.error('Failed to add water');
    }
  };
  
  // Delete water log
  const handleDeleteWaterLog = async (id: string) => {
    if (!id) return;
    
    try {
      await deleteWaterLog(id);
      toast.success('Water log deleted');
      
      // Reload logs
      loadWaterLogs();
    } catch (error) {
      console.error('Error deleting water log:', error);
      toast.error('Failed to delete water log');
    }
  };
  
  // Calculate progress percentage
  const calculateProgress = (): number => {
    return Math.min(Math.round((totalWater / goalWater) * 100), 100);
  };
  
  // Update water amount
  const updateWaterAmount = (direction: 'up' | 'down') => {
    const step = 50; // 50ml step
    if (direction === 'up') {
      setWaterAmount(prev => Math.min(prev + step, 2000));
    } else {
      setWaterAmount(prev => Math.max(prev - step, 50));
    }
  };
  
  // Group logs by day
  const groupLogsByDay = () => {
    const grouped: { [date: string]: WaterLog[] } = {};
    
    waterLogs.forEach(log => {
      const date = format(log.timestamp, 'yyyy-MM-dd');
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(log);
    });
    
    return grouped;
  };
  
  // Get total water for a specific day
  const getTotalWaterForDay = (logs: WaterLog[]): number => {
    return logs.reduce((sum, log) => sum + log.amount, 0);
  };
  
  return (
    <div className="container px-4 py-6 mx-auto max-w-5xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Water Tracking</h1>
      
      {/* Progress Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Droplet className="mr-2 h-6 w-6 text-blue-500" />
            <span>Today's Progress</span>
          </CardTitle>
          <CardDescription>Track your daily water intake</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                {totalWater} ml of {goalWater} ml
              </span>
              <span className="text-sm font-medium">{calculateProgress()}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700">
              <div 
                className="bg-blue-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${calculateProgress()}%` }}
              ></div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {commonSizes.map((size) => (
              <Button
                key={size.name}
                variant="outline"
                size="sm"
                onClick={() => setWaterAmount(size.amount)}
                className={waterAmount === size.amount ? 'bg-blue-100 border-blue-500' : ''}
              >
                {size.name} ({size.amount}ml)
              </Button>
            ))}
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => updateWaterAmount('down')}
              disabled={waterAmount <= 50}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
            
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span className="text-sm">50ml</span>
                <span className="text-sm">2000ml</span>
              </div>
              <Slider
                value={[waterAmount]}
                min={50}
                max={2000}
                step={50}
                onValueChange={(value) => setWaterAmount(value[0])}
                className="cursor-pointer"
              />
            </div>
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => updateWaterAmount('up')}
              disabled={waterAmount >= 2000}
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Droplet className="h-8 w-8 text-blue-500" />
              <div>
                <span className="text-2xl font-bold">{waterAmount}</span>
                <span className="text-sm ml-1">ml</span>
              </div>
            </div>
            
            <Button onClick={handleAddWater} className="bg-blue-500 hover:bg-blue-600">
              <Plus className="mr-2 h-4 w-4" />
              Add Water
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* History Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="week">This Week</TabsTrigger>
          <TabsTrigger value="month">This Month</TabsTrigger>
        </TabsList>
        
        {/* Today's Logs */}
        <TabsContent value="today">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                Today's Water Logs
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-center py-4">Loading...</p>
              ) : waterLogs.length === 0 ? (
                <p className="text-center py-4 text-gray-500">No water logs for today yet.</p>
              ) : (
                <ul className="space-y-3">
                  <AnimatePresence>
                    {waterLogs.map((log) => (
                      <motion.li
                        key={log.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center">
                          <Droplet className="h-5 w-5 text-blue-500 mr-3" />
                          <div>
                            <span className="font-medium">{log.amount} ml</span>
                            <p className="text-sm text-gray-500">
                              {format(log.timestamp, 'h:mm a')}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => log.id && handleDeleteWaterLog(log.id)}
                          className="text-gray-500 hover:text-red-500"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* This Week's Logs */}
        <TabsContent value="week">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart className="mr-2 h-5 w-5" />
                This Week's Water Logs
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-center py-4">Loading...</p>
              ) : waterLogs.length === 0 ? (
                <p className="text-center py-4 text-gray-500">No water logs for this week.</p>
              ) : (
                <div className="space-y-4">
                  {Object.entries(groupLogsByDay()).map(([date, logs]) => (
                    <div key={date} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold flex items-center">
                          <CalendarDays className="h-4 w-4 mr-2" />
                          {format(new Date(date), 'EEEE, MMMM d')}
                        </h3>
                        <span className="text-blue-500 font-medium">
                          {getTotalWaterForDay(logs)} ml
                        </span>
                      </div>
                      <ul className="space-y-2">
                        {logs.map((log) => (
                          <li
                            key={log.id}
                            className="flex items-center justify-between py-1 px-2 text-sm"
                          >
                            <div className="flex items-center">
                              <Droplet className="h-3 w-3 text-blue-400 mr-2" />
                              <span>{log.amount} ml</span>
                            </div>
                            <span className="text-gray-500">
                              {format(log.timestamp, 'h:mm a')}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* This Month's Logs */}
        <TabsContent value="month">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart className="mr-2 h-5 w-5" />
                This Month's Water Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-center py-4">Loading...</p>
              ) : waterLogs.length === 0 ? (
                <p className="text-center py-4 text-gray-500">No water logs for this month.</p>
              ) : (
                <div className="space-y-4">
                  {Object.entries(groupLogsByDay()).map(([date, logs]) => (
                    <div key={date} className="flex items-center justify-between py-3 border-b">
                      <div>
                        <h3 className="font-medium">
                          {format(new Date(date), 'MMMM d, yyyy')}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {logs.length} entries
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-blue-500">
                          {getTotalWaterForDay(logs)} ml
                        </p>
                        <p className="text-sm text-gray-500">
                          {Math.round((getTotalWaterForDay(logs) / goalWater) * 100)}% of goal
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Tips Card */}
      <Card>
        <CardHeader>
          <CardTitle>Hydration Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 list-disc list-inside text-gray-700">
            <li>Drink water first thing in the morning to kickstart your metabolism</li>
            <li>Carry a water bottle with you throughout the day</li>
            <li>Set reminders on your phone to drink water regularly</li>
            <li>Eat water-rich foods like cucumber, watermelon, and oranges</li>
            <li>Drink a glass of water before each meal</li>
            <li>Replace sugary drinks with water or herbal tea</li>
          </ul>
        </CardContent>
        <CardFooter className="text-sm text-gray-500">
          The recommended daily water intake varies but is generally around 2.5 to 3.5 liters.
        </CardFooter>
      </Card>
=======

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Droplet, Plus, Minus, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const WaterPage = () => {
  const { user } = useAuth();
  const [todayTotal, setTodayTotal] = useState(0);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [target, setTarget] = useState(2500); // 2.5 liters in ml
  
  useEffect(() => {
    if (user) {
      loadWaterData();
    }
  }, [user]);
  
  const loadWaterData = async () => {
    try {
      setLoading(true);
      
      // Get today's date in ISO format
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayISO = today.toISOString();
      
      // Get 7 days ago
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
      sevenDaysAgo.setHours(0, 0, 0, 0);
      const sevenDaysAgoISO = sevenDaysAgo.toISOString();
      
      // Get today's total
      const { data: todayData, error: todayError } = await supabase
        .from('water_intake')
        .select('amount_ml')
        .eq('user_id', user?.id)
        .gte('recorded_at', todayISO);
      
      if (todayError) throw todayError;
      
      if (todayData) {
        const total = todayData.reduce((sum, item) => sum + item.amount_ml, 0);
        setTodayTotal(total);
      }
      
      // Get weekly data
      const { data: weekData, error: weekError } = await supabase
        .from('water_intake')
        .select('amount_ml, recorded_at')
        .eq('user_id', user?.id)
        .gte('recorded_at', sevenDaysAgoISO);
      
      if (weekError) throw weekError;
      
      if (weekData) {
        // Group by day
        const dayTotals: {[key: string]: number} = {};
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        // Initialize with zeros for all days
        for (let i = 0; i < 7; i++) {
          const day = new Date();
          day.setDate(day.getDate() - i);
          const dayName = days[day.getDay()];
          dayTotals[dayName] = 0;
        }
        
        // Sum amounts by day
        weekData.forEach(item => {
          const date = new Date(item.recorded_at);
          const dayName = days[date.getDay()];
          dayTotals[dayName] = (dayTotals[dayName] || 0) + item.amount_ml;
        });
        
        // Convert to array format for the chart
        const formattedData = Object.keys(dayTotals).map(day => ({
          day,
          amount: dayTotals[day]
        }));
        
        setWeeklyData(formattedData);
      }
    } catch (error: any) {
      console.error('Error loading water data:', error);
      toast({
        title: 'Error loading data',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const addWater = async (amount: number) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('water_intake')
        .insert({
          user_id: user?.id,
          amount_ml: amount,
          recorded_at: new Date().toISOString(),
        });
      
      if (error) throw error;
      
      setTodayTotal(prev => prev + amount);
      
      toast({
        title: 'Water logged',
        description: `Added ${amount}ml of water`,
      });
      
      // Refresh weekly data
      loadWaterData();
    } catch (error: any) {
      console.error('Error adding water:', error);
      toast({
        title: 'Error logging water',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Water Intake</h1>
        <p className="text-muted-foreground">Track your daily hydration</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-full md:col-span-1">
          <CardHeader>
            <CardTitle>Today's Water Intake</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="flex flex-col items-center">
                <div className="text-6xl font-bold text-blue-500 mb-2">{(todayTotal / 1000).toFixed(1)}</div>
                <div className="text-muted-foreground">of {target/1000} liters</div>
              </div>
              
              <div className="relative w-32 h-32">
                <div className="absolute inset-0 rounded-full border-4 border-muted"></div>
                <div 
                  className="absolute inset-0 rounded-full border-4 border-blue-500 transition-all" 
                  style={{ 
                    clipPath: `inset(${100 - (todayTotal / target * 100)}% 0 0 0)`
                  }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Droplet className="h-16 w-16 text-blue-500 opacity-30" />
                </div>
              </div>
              
              <div className="flex flex-col space-y-4">
                <Button 
                  size="sm" 
                  className="bg-blue-500 hover:bg-blue-600" 
                  onClick={() => addWater(250)}
                  disabled={loading}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add 250ml
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => addWater(500)}
                  disabled={loading}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add 500ml
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-full md:col-span-1">
          <CardHeader>
            <CardTitle>Weekly Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end gap-2 pt-6">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                // Generate some mock data if we don't have real data yet
                const mockHeights = [40, 65, 80, 50, 60, 75, 45];
                const foundData = weeklyData.find(d => d.day === day);
                const amount = foundData ? foundData.amount : 0;
                const percentage = amount ? Math.min((amount / target) * 100, 100) : mockHeights[index];
                
                return (
                  <div key={day} className="flex flex-col items-center flex-1">
                    <div 
                      className="w-full bg-blue-500 rounded-t-md transition-all hover:bg-blue-600"
                      style={{ height: `${percentage}%` }}
                    ></div>
                    <div className="text-xs text-muted-foreground mt-2">{day}</div>
                    {amount > 0 && (
                      <div className="text-xs">{(amount/1000).toFixed(1)}L</div>
                    )}
                  </div>
                );
              })}
            </div>
            {weeklyData.length > 0 && (
              <div className="mt-4 flex items-center text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                <span>Progress tracked with your real data</span>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Hydration Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Morning Routine</h3>
                <p className="text-sm text-muted-foreground">Start your day with a glass of water to jumpstart your metabolism.</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Workout Hydration</h3>
                <p className="text-sm text-muted-foreground">Drink water before, during, and after exercise to maintain performance.</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Set Reminders</h3>
                <p className="text-sm text-muted-foreground">Use app notifications to remind yourself to drink water throughout the day.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
    </div>
  );
};

export default WaterPage;
