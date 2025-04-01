import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  PlusCircle, 
  CheckCircle2, 
  Calendar, 
  Trophy, 
  BarChart, 
  X, 
  AlertCircle, 
  CheckCircle 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useClerkContext } from '@/contexts/ClerkContext';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface Habit {
  id: string;
  name: string;
  description: string;
  frequency: string;
  user_id: string;
  created_at: string;
  tracking?: {
    id: string;
    completed_date: string;
    status: boolean;
  }[];
}

const HabitsPage = () => {
  const { user } = useAuth();
  const { userId } = useClerkContext();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Form states
  const [habitName, setHabitName] = useState('');
  const [habitDescription, setHabitDescription] = useState('');
  const [habitFrequency, setHabitFrequency] = useState('daily');
  
  const fetchHabits = async () => {
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from('habits')
        .select(`
          *,
          habit_tracking (
            id,
            completed_date,
            status
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      if (data) {
        setHabits(data as Habit[]);
      }
    } catch (error) {
      console.error('Error fetching habits:', error);
      toast.error('Failed to load your habits');
    }
  };
  
  useEffect(() => {
    fetchHabits();
  }, [userId]);
  
  const handleCreateHabit = async () => {
    if (!habitName || !habitFrequency) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (!userId) {
      toast.error('User not authenticated');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('habits')
        .insert([
          {
            name: habitName,
            description: habitDescription,
            frequency: habitFrequency,
            user_id: userId
          }
        ])
        .select();
        
      if (error) throw error;
      
      toast.success('Habit created successfully!');
      setHabitName('');
      setHabitDescription('');
      setHabitFrequency('daily');
      setIsDialogOpen(false);
      
      // Refresh habits list
      fetchHabits();
    } catch (error) {
      console.error('Error creating habit:', error);
      toast.error('Failed to create habit. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleToggleHabit = async (habitId: string, completed: boolean) => {
    if (!userId) {
      toast.error('User not authenticated');
      return;
    }
    
    const today = new Date().toISOString().split('T')[0];
    
    try {
      // Check if there's already a tracking record for today
      const { data: existingData, error: existingError } = await supabase
        .from('habit_tracking')
        .select('*')
        .eq('habit_id', habitId)
        .eq('completed_date', today);
        
      if (existingError) throw existingError;
      
      if (existingData && existingData.length > 0) {
        // Update existing record
        const { error } = await supabase
          .from('habit_tracking')
          .update({ status: completed })
          .eq('id', existingData[0].id);
          
        if (error) throw error;
      } else {
        // Create new record
        const { error } = await supabase
          .from('habit_tracking')
          .insert([
            {
              habit_id: habitId,
              completed_date: today,
              status: completed
            }
          ]);
          
        if (error) throw error;
      }
      
      toast.success(completed ? 'Habit marked as complete!' : 'Habit marked as incomplete');
      
      // Refresh habits
      fetchHabits();
    } catch (error) {
      console.error('Error updating habit status:', error);
      toast.error('Failed to update habit status');
    }
  };
  
  const isHabitCompletedToday = (habit: Habit) => {
    if (!habit.tracking || habit.tracking.length === 0) return false;
    
    const today = new Date().toISOString().split('T')[0];
    
    return habit.tracking.some(track => 
      track.completed_date.split('T')[0] === today && track.status
    );
  };
  
  // Calculate completed habits for today
  const completedHabitsToday = habits.filter(habit => isHabitCompletedToday(habit)).length;
  
  const formatFrequency = (frequency: string) => {
    return frequency.charAt(0).toUpperCase() + frequency.slice(1);
  };
  
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const currentDayIndex = new Date().getDay();
  
  return (
    <div className="container mx-auto p-4 md:p-6 pt-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Habit Tracker</h1>
          <p className="text-muted-foreground">Build and maintain healthy habits</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="mt-4 md:mt-0">
              <PlusCircle className="h-4 w-4 mr-2" /> Create Habit
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Habit</DialogTitle>
              <DialogDescription>
                Add a new habit that you want to track regularly
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="habit-name">Habit Name *</Label>
                <Input 
                  id="habit-name" 
                  value={habitName} 
                  onChange={(e) => setHabitName(e.target.value)} 
                  placeholder="e.g. Drink water, Meditate"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="habit-description">Description (optional)</Label>
                <Textarea 
                  id="habit-description" 
                  value={habitDescription} 
                  onChange={(e) => setHabitDescription(e.target.value)} 
                  placeholder="Add some details about this habit"
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="habit-frequency">Frequency *</Label>
                <Select value={habitFrequency} onValueChange={setHabitFrequency}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekdays">Weekdays</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="sm:justify-between">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="button" onClick={handleCreateHabit} disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Habit'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>My Habits</CardTitle>
            <CardDescription>Track your daily habits</CardDescription>
          </CardHeader>
          <CardContent>
            {habits.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-8 gap-2 mb-4 border-b pb-2">
                  <div className="col-span-2 font-medium">Habit</div>
                  {weekDays.map((day, index) => (
                    <div 
                      key={day} 
                      className={`text-center text-sm font-medium ${index === currentDayIndex ? 'text-primary' : ''}`}
                    >
                      {day}
                    </div>
                  ))}
                </div>
                
                {habits.map((habit) => (
                  <div key={habit.id} className="grid grid-cols-8 gap-2 items-center">
                    <div className="col-span-2">
                      <div className="font-medium">{habit.name}</div>
                      <div className="text-xs text-muted-foreground">{formatFrequency(habit.frequency)}</div>
                    </div>
                    {weekDays.map((day, index) => {
                      const isToday = index === currentDayIndex;
                      const completed = isToday && isHabitCompletedToday(habit);
                      
                      return (
                        <div key={`${habit.id}-${day}`} className="flex justify-center">
                          {isToday ? (
                            <button 
                              className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors ${
                                completed 
                                  ? 'bg-green-500 text-white hover:bg-green-600' 
                                  : 'bg-muted hover:bg-muted-foreground/20'
                              }`}
                              onClick={() => handleToggleHabit(habit.id, !completed)}
                            >
                              {completed && <CheckCircle2 className="h-5 w-5" />}
                            </button>
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-muted/50 flex items-center justify-center opacity-50">
                              {/* Empty placeholder for non-current days */}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto bg-muted w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No habits yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start tracking your habits to build consistency
                </p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <PlusCircle className="h-4 w-4 mr-2" /> Create Your First Habit
                </Button>
              </div>
            )}
          </CardContent>
          {habits.length > 0 && (
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => setIsDialogOpen(true)}>
                <PlusCircle className="h-4 w-4 mr-2" /> Add New Habit
              </Button>
            </CardFooter>
          )}
        </Card>
        
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Today's Progress</CardTitle>
              <CardDescription>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{completedHabitsToday} / {habits.length}</p>
                    <p className="text-xs text-muted-foreground">habits completed</p>
                  </div>
                </div>
              </div>
              
              <div className="w-full bg-muted rounded-full h-2.5 mb-4">
                <div 
                  className="bg-primary h-2.5 rounded-full" 
                  style={{ width: habits.length > 0 ? `${(completedHabitsToday / habits.length) * 100}%` : '0%' }}
                ></div>
              </div>
              
              {habits.length > 0 ? (
                completedHabitsToday === habits.length ? (
                  <div className="text-center bg-green-500/10 p-3 rounded-lg">
                    <Trophy className="h-6 w-6 text-green-500 mx-auto mb-2" />
                    <p className="font-medium text-green-500">All habits completed today!</p>
                  </div>
                ) : (
                  <div className="text-center bg-primary/5 p-3 rounded-lg">
                    <AlertCircle className="h-6 w-6 text-primary mx-auto mb-2" />
                    <p className="font-medium text-primary">
                      {habits.length - completedHabitsToday} habits remaining today
                    </p>
                  </div>
                )
              ) : (
                <div className="text-center bg-muted p-3 rounded-lg">
                  <p className="text-muted-foreground">Create habits to start tracking</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Streak Statistics</CardTitle>
              <CardDescription>Your consistency metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="bg-orange-500/10 p-2 rounded-full">
                      <BarChart className="h-5 w-5 text-orange-500" />
                    </div>
                    <span>Current Streak</span>
                  </div>
                  <span className="font-bold">{completedHabitsToday > 0 ? 1 : 0} days</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-500/10 p-2 rounded-full">
                      <Trophy className="h-5 w-5 text-blue-500" />
                    </div>
                    <span>Completion Rate</span>
                  </div>
                  <span className="font-bold">
                    {habits.length > 0 ? Math.round((completedHabitsToday / habits.length) * 100) : 0}%
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="bg-green-500/10 p-2 rounded-full">
                      <Calendar className="h-5 w-5 text-green-500" />
                    </div>
                    <span>Active Habits</span>
                  </div>
                  <span className="font-bold">{habits.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HabitsPage;
