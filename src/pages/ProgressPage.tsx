<<<<<<< HEAD
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Scale, ArrowDown, Dumbbell, Utensils, CalendarRange, ChevronLeft, ChevronRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { format, subDays, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, 
         subMonths, addMonths, isToday, isSameDay, isSameMonth, subYears, addYears,
         startOfYear, endOfYear, eachDayOfInterval, eachWeekOfInterval } from 'date-fns';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

type TimeFrame = 'day' | 'week' | 'month' | 'year';

const ProgressPage = () => {
  const { user } = useAuth();
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('day');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [calendarOpen, setCalendarOpen] = useState<boolean>(false);
=======

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Scale, ArrowDown, Dumbbell, Utensils } from 'lucide-react';

const ProgressPage = () => {
  const { user } = useAuth();
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
  
  // Mock data for charts
  const weightData = [
    { date: 'Week 1', weight: 82 },
    { date: 'Week 2', weight: 81 },
    { date: 'Week 3', weight: 80.5 },
    { date: 'Week 4', weight: 79.8 },
    { date: 'Week 5', weight: 79 },
    { date: 'Week 6', weight: 78.2 },
    { date: 'Week 7', weight: 77.5 },
    { date: 'Week 8', weight: 77 },
  ];
  
  const caloriesData = [
    { day: 'Mon', calories: 2100 },
    { day: 'Tue', calories: 1950 },
    { day: 'Wed', calories: 2050 },
    { day: 'Thu', calories: 1850 },
    { day: 'Fri', calories: 2200 },
    { day: 'Sat', calories: 2300 },
    { day: 'Sun', calories: 2150 },
  ];
  
  const macroData = [
    { name: 'Protein', value: 30 },
    { name: 'Carbs', value: 45 },
    { name: 'Fat', value: 25 },
  ];
  
<<<<<<< HEAD
  // Generate mock data based on selected dates
  const dailyActivityData = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    calories: Math.floor(Math.random() * 200) + (i > 8 && i < 20 ? 100 : 20),
    steps: Math.floor(Math.random() * 1000) + (i > 8 && i < 20 ? 500 : 50),
  }));
  
  const weeklyActivityData = Array.from({ length: 7 }, (_, i) => ({
    day: format(addDays(startOfWeek(selectedDate), i), 'EEE'),
    calories: Math.floor(Math.random() * 1000) + 1500,
    steps: Math.floor(Math.random() * 5000) + 5000,
    weight: 80 - (i * 0.2) - (Math.random() * 0.3),
    exerciseMinutes: Math.floor(Math.random() * 30) + 30,
  }));
  
  const monthlyActivityData = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    calories: Math.floor(Math.random() * 500) + 1800,
    steps: Math.floor(Math.random() * 4000) + 6000,
    weight: 80 - (i * 0.1) - (Math.random() * 0.2),
  }));
  
  const yearlyActivityData = Array.from({ length: 12 }, (_, i) => ({
    month: format(new Date(2025, i, 1), 'MMM'),
    avgCalories: Math.floor(Math.random() * 200) + 1900,
    avgSteps: Math.floor(Math.random() * 2000) + 7000,
    weight: 82 - (i * 0.4) - (Math.random() * 0.1),
  }));
  
  // Helper functions for date navigation
  const navigatePrevious = () => {
    switch (timeFrame) {
      case 'day':
        setSelectedDate(prevDate => subDays(prevDate, 1));
        break;
      case 'week':
        setSelectedDate(prevDate => subDays(prevDate, 7));
        break;
      case 'month':
        setSelectedDate(prevDate => subMonths(prevDate, 1));
        break;
      case 'year':
        setSelectedDate(prevDate => subYears(prevDate, 1));
        break;
    }
  };
  
  const navigateNext = () => {
    switch (timeFrame) {
      case 'day':
        setSelectedDate(prevDate => addDays(prevDate, 1));
        break;
      case 'week':
        setSelectedDate(prevDate => addDays(prevDate, 7));
        break;
      case 'month':
        setSelectedDate(prevDate => addMonths(prevDate, 1));
        break;
      case 'year':
        setSelectedDate(prevDate => addYears(prevDate, 1));
        break;
    }
  };
  
  const getDateRangeText = () => {
    switch (timeFrame) {
      case 'day':
        return format(selectedDate, 'EEEE, MMMM d, yyyy');
      case 'week': {
        const start = startOfWeek(selectedDate);
        const end = endOfWeek(selectedDate);
        return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
      }
      case 'month':
        return format(selectedDate, 'MMMM yyyy');
      case 'year':
        return format(selectedDate, 'yyyy');
      default:
        return '';
    }
  };
  
  // Function to handle clicking on the calendar date
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setCalendarOpen(false);
    }
  };
  
  const COLORS = ['#ff5722', '#4caf50', '#2196f3'];
  
  return (
    <div className="container mx-auto p-4 md:p-6 pt-16 pb-20 md:pb-6 md:pt-20">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Progress & Analytics</h1>
        <p className="text-muted-foreground">Track your health journey progress</p>
      </div>
      
      {/* Time frame selector and date navigation */}
      <Card className="mb-6">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div>
              <TabsList className="mb-4 md:mb-0">
                <TabsTrigger 
                  value="day" 
                  className={timeFrame === 'day' ? 'data-[state=active]:bg-primary data-[state=active]:text-primary-foreground' : ''}
                  onClick={() => setTimeFrame('day')}
                >
                  Day
                </TabsTrigger>
                <TabsTrigger 
                  value="week" 
                  className={timeFrame === 'week' ? 'data-[state=active]:bg-primary data-[state=active]:text-primary-foreground' : ''}
                  onClick={() => setTimeFrame('week')}
                >
                  Week
                </TabsTrigger>
                <TabsTrigger 
                  value="month" 
                  className={timeFrame === 'month' ? 'data-[state=active]:bg-primary data-[state=active]:text-primary-foreground' : ''}
                  onClick={() => setTimeFrame('month')}
                >
                  Month
                </TabsTrigger>
                <TabsTrigger 
                  value="year" 
                  className={timeFrame === 'year' ? 'data-[state=active]:bg-primary data-[state=active]:text-primary-foreground' : ''}
                  onClick={() => setTimeFrame('year')}
                >
                  Year
                </TabsTrigger>
              </TabsList>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" onClick={navigatePrevious}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="relative">
                <Button 
                  variant="outline" 
                  className="flex items-center min-w-[150px] justify-center"
                  onClick={() => setCalendarOpen(!calendarOpen)}
                >
                  <CalendarRange className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">{getDateRangeText()}</span>
                </Button>
                
                {calendarOpen && (
                  <motion.div 
                    className="absolute z-50 mt-2 bg-card border rounded-lg shadow-lg"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      initialFocus
                    />
                  </motion.div>
                )}
              </div>
              
              <Button variant="outline" size="icon" onClick={navigateNext} disabled={isToday(selectedDate) && timeFrame === 'day'}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
=======
  const COLORS = ['#ff5722', '#4caf50', '#2196f3'];
  
  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Progress & Analytics</h1>
        <p className="text-muted-foreground">Track your health journey progress</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Scale className="h-5 w-5 mr-2" />
              Current Weight
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <span className="text-3xl font-bold">77 kg</span>
              <span className="ml-2 text-green-500 flex items-center text-sm">
                <ArrowDown className="h-4 w-4" />
                5 kg
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Since starting</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Utensils className="h-5 w-5 mr-2" />
              Avg. Daily Calories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">2,086</div>
            <p className="text-sm text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Dumbbell className="h-5 w-5 mr-2" />
              Exercise Minutes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">210</div>
            <p className="text-sm text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              BMI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">24.8</div>
            <p className="text-sm text-muted-foreground">Normal range</p>
          </CardContent>
        </Card>
      </div>
      
<<<<<<< HEAD
      {/* Data visualization based on selected timeframe */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* First row of charts */}
        {timeFrame === 'day' && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Daily Activity</CardTitle>
                <CardDescription>Hourly breakdown - {format(selectedDate, 'MMM d, yyyy')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={dailyActivityData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" tickFormatter={(hour) => `${hour}:00`} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="calories" name="Calories" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Step Count</CardTitle>
                <CardDescription>Hourly steps - {format(selectedDate, 'MMM d, yyyy')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={dailyActivityData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" tickFormatter={(hour) => `${hour}:00`} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="steps" name="Steps" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </>
        )}
        
        {timeFrame === 'week' && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Weekly Calories</CardTitle>
                <CardDescription>{getDateRangeText()}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={weeklyActivityData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="calories" name="Calories" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Weekly Exercise</CardTitle>
                <CardDescription>{getDateRangeText()}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={weeklyActivityData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="exerciseMinutes" name="Exercise (min)" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </>
        )}
        
        {timeFrame === 'month' && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Monthly Weight Trend</CardTitle>
                <CardDescription>{format(selectedDate, 'MMMM yyyy')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={monthlyActivityData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
                      <Tooltip />
                      <Line type="monotone" dataKey="weight" name="Weight (kg)" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Monthly Calorie Trend</CardTitle>
                <CardDescription>{format(selectedDate, 'MMMM yyyy')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={monthlyActivityData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="calories" name="Calories" stroke="#82ca9d" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </>
        )}
        
        {timeFrame === 'year' && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Yearly Weight Trend</CardTitle>
                <CardDescription>{format(selectedDate, 'yyyy')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={yearlyActivityData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
                      <Tooltip />
                      <Line type="monotone" dataKey="weight" name="Weight (kg)" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Yearly Activity Summary</CardTitle>
                <CardDescription>{format(selectedDate, 'yyyy')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={yearlyActivityData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="avgCalories" name="Avg. Calories" stroke="#82ca9d" />
                      <Line type="monotone" dataKey="avgSteps" name="Avg. Steps (×10)" stroke="#ffc658" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </>
        )}
        
        {/* Shared charts for all timeframes */}
=======
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Weight History</CardTitle>
            <CardDescription>Last 8 weeks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={weightData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
                  <Tooltip />
                  <Line type="monotone" dataKey="weight" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Calorie Intake</CardTitle>
            <CardDescription>Last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={caloriesData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="calories" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
>>>>>>> 26af89be74df9c5f1f8e662624d8361fb82618ac
        <Card>
          <CardHeader>
            <CardTitle>Macronutrient Balance</CardTitle>
            <CardDescription>Average distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={macroData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {macroData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Goal Progress</CardTitle>
            <CardDescription>Track your health goals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Weight Loss</span>
                  <span className="text-sm font-medium">70%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div className="bg-primary h-2.5 rounded-full" style={{ width: '70%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Exercise Goals</span>
                  <span className="text-sm font-medium">60%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Protein Intake</span>
                  <span className="text-sm font-medium">85%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Water Intake</span>
                  <span className="text-sm font-medium">50%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '50%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProgressPage;
