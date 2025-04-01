import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarComponent, 
  CalendarProps 
} from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { format, isSameDay, isSameMonth, addDays, subDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight,
  FileText,
  Droplets,
  Dumbbell,
  Heart,
  Utensils,
  CalendarRange,
  PlusCircle,
  Check,
  X,
  CheckCircle2
} from 'lucide-react';
import { useFirebaseContext } from '@/contexts/FirebaseContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface ActivityEntry {
  date: string;
  type: 'exercise' | 'water' | 'meal' | 'weight' | 'meditation' | 'sleep' | 'custom';
  value?: number;
  unit?: string;
  notes?: string;
  completed?: boolean;
  id?: string;
}

interface Activity {
  id: string;
  title: string;
  category: string;
  date: string;
  completed: boolean;
}

const Calendar = () => {
  const { user, getUserData, saveUserData } = useFirebaseContext();
  const [date, setDate] = useState<Date>(new Date());
  const [month, setMonth] = useState<Date>(new Date());
  const [selectedActivity, setSelectedActivity] = useState<string>('all');
  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [newActivity, setNewActivity] = useState({
    title: '',
    category: 'exercise'
  });

  // Load user activity data
  useEffect(() => {
    const loadUserActivities = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // Get water intake data
        const waterData = await getUserData<any[]>('waterIntake') || [];
        
        // Format as activities
        const waterActivities = waterData.map(entry => ({
          date: entry.date,
          type: 'water' as const,
          value: entry.count,
          unit: 'glasses',
          completed: entry.count >= 8 // 8 glasses target
        }));
        
        // Exercise data (mock for now, would get from backend)
        // This would be replaced by real data from your backend
        const exerciseData = await getUserData<any[]>('exerciseData') || [];
        
        // Combine all activities
        setActivities([...waterActivities, ...exerciseData]);
      } catch (error) {
        console.error('Error loading activity data:', error);
        toast.error('Could not load your activity data');
      } finally {
        setLoading(false);
      }
    };
    
    loadUserActivities();
  }, [user, getUserData]);

  // Navigate between months
  const handlePreviousMonth = () => {
    setMonth(prevMonth => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(newMonth.getMonth() - 1);
      return newMonth;
    });
  };

  const handleNextMonth = () => {
    setMonth(prevMonth => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(newMonth.getMonth() + 1);
      return newMonth;
    });
  };

  // Get activities for a specific date
  const getActivitiesForDate = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return activities.filter(activity => 
      activity.date === dateString && 
      (selectedActivity === 'all' || activity.type === selectedActivity)
    );
  };

  // Check if a date has any activities
  const hasActivities = (date: Date) => {
    return getActivitiesForDate(date).length > 0;
  };

  // Activity types with their icons and colors
  const activityTypes = [
    { value: 'all', label: 'All Activities', icon: <CalendarRange className="h-4 w-4" />, color: 'bg-primary' },
    { value: 'water', label: 'Water Intake', icon: <Droplets className="h-4 w-4" />, color: 'bg-blue-500' },
    { value: 'exercise', label: 'Exercise', icon: <Dumbbell className="h-4 w-4" />, color: 'bg-green-500' },
    { value: 'meal', label: 'Meals', icon: <Utensils className="h-4 w-4" />, color: 'bg-orange-500' },
    { value: 'weight', label: 'Weight', icon: <FileText className="h-4 w-4" />, color: 'bg-purple-500' },
    { value: 'meditation', label: 'Meditation', icon: <Heart className="h-4 w-4" />, color: 'bg-red-500' }
  ];

  // Custom day renderer for the calendar
  const renderDay = (date: Date, cellProps: any) => {
    const dateActivities = getActivitiesForDate(date);
    const hasWater = dateActivities.some(a => a.type === 'water');
    const hasExercise = dateActivities.some(a => a.type === 'exercise');
    const hasMeal = dateActivities.some(a => a.type === 'meal');
    
    return (
      <div
        className={`relative h-9 w-9 p-0 font-normal aria-selected:opacity-100 ${
          isSameDay(date, new Date()) ? 'bg-primary/10 text-primary font-medium rounded-full' : ''
        }`}
      >
        <div className="flex h-full w-full items-center justify-center">
          {format(date, 'd')}
        </div>
        
        {/* Activity indicators */}
        {(hasWater || hasExercise || hasMeal) && (
          <div className="absolute -bottom-1 left-0 right-0 flex justify-center space-x-0.5">
            {hasWater && <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />}
            {hasExercise && <div className="h-1.5 w-1.5 rounded-full bg-green-500" />}
            {hasMeal && <div className="h-1.5 w-1.5 rounded-full bg-orange-500" />}
          </div>
        )}
      </div>
    );
  };

  // Add a new activity entry
  const addActivity = async (type: ActivityEntry['type']) => {
    if (!user) {
      toast.error('Please sign in to track activities');
      return;
    }
    
    const newActivity: ActivityEntry = {
      date: format(date, 'yyyy-MM-dd'),
      type,
      completed: false
    };
    
    switch(type) {
      case 'water':
        navigate('/water');
        break;
      case 'exercise':
        navigate('/exercise');
        break;
      case 'meal':
        navigate('/food-tracking');
        break;
      default:
        toast.info(`Navigate to ${type} tracking`);
    }
  };

  const handleDateClick = (date: Date) => {
    setDate(date);
  };

  const handleAddActivity = () => {
    if (newActivity.title.trim() === '') return;
    
    const activity: ActivityEntry = {
      id: Math.random().toString(36).substring(2, 9),
      type: newActivity.category as ActivityEntry['type'],
      value: 1,
      date: format(date, 'yyyy-MM-dd'),
      completed: false
    };
    
    setActivities([...activities, activity]);
    
    // In a real app, save to Firebase
    // saveUserData('activities', [...activities, activity]);
    
    setNewActivity({ title: '', category: 'exercise' });
    setShowEventDialog(false);
  };

  const handleToggleComplete = (id: string) => {
    const updatedActivities = activities.map(activity => 
      activity.id === id ? { ...activity, completed: !activity.completed } : activity
    );
    setActivities(updatedActivities);
    
    // In a real app, save to Firebase
    // saveUserData('activities', updatedActivities);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'exercise':
        return 'bg-blue-100 text-blue-800';
      case 'water':
        return 'bg-cyan-100 text-cyan-800';
      case 'meal':
        return 'bg-orange-100 text-orange-800';
      case 'weight':
        return 'bg-purple-100 text-purple-800';
      case 'meditation':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 pt-16 pb-20 md:pb-6 md:pt-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <div className="flex items-center mb-2">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl sm:text-3xl font-bold">Activity Calendar</h1>
          </div>
          <p className="text-muted-foreground">Track your health journey day by day</p>
        </div>
        
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <Select
            value={selectedActivity}
            onValueChange={setSelectedActivity}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter activities" />
            </SelectTrigger>
            <SelectContent>
              {activityTypes.map(type => (
                <SelectItem key={type.value} value={type.value}>
                  <div className="flex items-center">
                    {type.icon}
                    <span className="ml-2">{type.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button onClick={() => setDate(new Date())}>Today</Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>Calendar</CardTitle>
              <div className="flex space-x-1">
                <Button variant="ghost" size="icon" onClick={handlePreviousMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="min-w-[120px] text-center font-medium">
                  {format(month, 'MMMM yyyy')}
                </div>
                <Button variant="ghost" size="icon" onClick={handleNextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={(newDate) => newDate && setDate(newDate)}
              month={month}
              onMonthChange={setMonth}
              className="rounded-md border"
              modifiers={{
                highlighted: (day) => hasActivities(day)
              }}
              modifiersClassNames={{
                highlighted: "bg-primary/10"
              }}
            />
          </CardContent>
        </Card>
        
        {/* Daily Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CalendarRange className="h-5 w-5 mr-2 text-primary" />
              {format(date, 'EEEE, MMMM d, yyyy')}
            </CardTitle>
            <CardDescription>
              {loading ? 'Loading activities...' : 
                getActivitiesForDate(date).length === 0 ? 
                'No activities for this day' : 
                `${getActivitiesForDate(date).length} activities recorded`
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
                </div>
              ) : getActivitiesForDate(date).length > 0 ? (
                <>
                  {getActivitiesForDate(date).map((activity, index) => {
                    const activityType = activityTypes.find(t => t.value === activity.type);
                    
                    return (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-secondary/40">
                        <div className="flex items-center">
                          <div className={`p-2 rounded-full ${activityType?.color || 'bg-gray-500'} text-white mr-3`}>
                            {activityType?.icon || <FileText className="h-4 w-4" />}
                          </div>
                          <div>
                            <div className="font-medium capitalize">{activity.type}</div>
                            <div className="text-sm text-muted-foreground">
                              {activity.value !== undefined && `${activity.value} ${activity.unit || ''}`}
                            </div>
                          </div>
                        </div>
                        
                        {activity.completed !== undefined && (
                          <Badge variant={activity.completed ? "success" : "destructive"}>
                            {activity.completed ? 
                              <Check className="h-3 w-3 mr-1" /> : 
                              <X className="h-3 w-3 mr-1" />
                            }
                            {activity.completed ? 'Completed' : 'Missed'}
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <CalendarRange className="h-12 w-12 text-muted-foreground mb-3" />
                  <h3 className="text-lg font-medium mb-1">No Activities</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    There are no tracked activities for this day.
                  </p>
                  <Button onClick={() => addActivity('exercise')}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Activity
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-around border-t pt-4">
            <Button variant="ghost" onClick={() => addActivity('water')} className="flex-col h-auto py-2">
              <Droplets className="h-5 w-5 mb-1 text-blue-500" />
              <span className="text-xs">Water</span>
            </Button>
            <Button variant="ghost" onClick={() => addActivity('exercise')} className="flex-col h-auto py-2">
              <Dumbbell className="h-5 w-5 mb-1 text-green-500" />
              <span className="text-xs">Exercise</span>
            </Button>
            <Button variant="ghost" onClick={() => addActivity('meal')} className="flex-col h-auto py-2">
              <Utensils className="h-5 w-5 mb-1 text-orange-500" />
              <span className="text-xs">Meal</span>
            </Button>
            <Button variant="ghost" onClick={() => addActivity('weight')} className="flex-col h-auto py-2">
              <FileText className="h-5 w-5 mb-1 text-purple-500" />
              <span className="text-xs">Weight</span>
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <Tabs defaultValue="month" className="w-full mt-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="month">Month View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="month" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="text-sm font-medium text-muted-foreground py-2">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {eachDayOfInterval({ start: startOfMonth(month), end: endOfMonth(month) }).map((day, i) => {
                  const dayActivities = getActivitiesForDate(day);
                  const isSelected = isSameDay(day, date);
                  
                  return (
                    <div
                      key={i}
                      className={`min-h-[100px] border rounded-lg p-1 ${
                        isSameDay(day, new Date()) ? 'bg-primary/5 border-primary/20' : ''
                      } ${
                        isSameMonth(day, month) ? '' : 'text-muted-foreground bg-muted/50'
                      } ${
                        isSelected ? 'ring-2 ring-primary' : ''
                      } hover:bg-accent transition-colors cursor-pointer`}
                      onClick={() => handleDateClick(day)}
                    >
                      <div className="text-right p-1 font-medium">
                        {format(day, 'd')}
                      </div>
                      <div className="mt-1 space-y-1 max-h-[80px] overflow-y-auto">
                        {dayActivities.slice(0, 3).map((activity) => (
                          <div 
                            key={activity.id}
                            className={`text-xs px-1 py-0.5 rounded ${getCategoryColor(activity.type)} flex items-center ${
                              activity.completed ? 'line-through opacity-60' : ''
                            }`}
                          >
                            <span className="truncate">{activity.type}</span>
                          </div>
                        ))}
                        {dayActivities.length > 3 && (
                          <div className="text-xs text-muted-foreground px-1">
                            +{dayActivities.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="list" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between">
                <span>Activities for {format(date, 'MMMM d, yyyy')}</span>
                <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <PlusCircle className="h-4 w-4 mr-1" />
                      Add Activity
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Activity</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                      <div className="space-y-2">
                        <Label htmlFor="title">Activity Title</Label>
                        <Input 
                          id="title" 
                          placeholder="What are you planning to do?" 
                          value={newActivity.title}
                          onChange={(e) => setNewActivity({...newActivity, title: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select 
                          value={newActivity.category} 
                          onValueChange={(value) => setNewActivity({...newActivity, category: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {activityTypes.map(type => (
                              <SelectItem key={type.value} value={type.value}>
                                <div className="flex items-center">
                                  {type.icon}
                                  <span className="ml-2">{type.label}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={handleAddActivity} className="w-full">
                        Add to Calendar
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {getActivitiesForDate(date).length > 0 ? (
                <div className="space-y-2">
                  {getActivitiesForDate(date).map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-2 rounded-lg border">
                      <div className="flex items-center gap-2">
                        <Badge className={getCategoryColor(activity.type)}>
                          {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                        </Badge>
                        <span className={activity.completed ? 'line-through text-muted-foreground' : ''}>
                          {activity.type}
                        </span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleToggleComplete(activity.id)}
                      >
                        <CheckCircle2 className={`h-5 w-5 ${activity.completed ? 'text-primary' : 'text-muted-foreground'}`} />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No activities planned for this day. Click "Add Activity" to create one.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Calendar; 