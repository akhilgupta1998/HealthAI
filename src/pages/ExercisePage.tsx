
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  PlusCircle, 
  Dumbbell, 
  Clock, 
  BarChart2, 
  X, 
  Calendar, 
  RotateCcw, 
  Flame 
} from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useClerkContext } from '@/contexts/ClerkContext';

const exerciseTypes = [
  "Strength Training",
  "Cardio",
  "HIIT",
  "Yoga",
  "Pilates",
  "Swimming",
  "Cycling",
  "Running",
  "Walking",
  "Other"
];

const muscleGroups = [
  "Chest",
  "Back",
  "Shoulders",
  "Arms",
  "Legs",
  "Core",
  "Full Body",
  "None/Cardio"
];

interface ExerciseLog {
  id: string;
  exercise_name: string;
  exercise_type: string;
  muscle_group?: string;
  duration_minutes: number;
  calories_burned: number;
  recorded_date: string;
}

const ExercisePage = () => {
  const { user } = useAuth();
  const { userId } = useClerkContext();
  const [isLoading, setIsLoading] = useState(false);
  const [exerciseName, setExerciseName] = useState('');
  const [exerciseType, setExerciseType] = useState('');
  const [muscleGroup, setMuscleGroup] = useState('');
  const [duration, setDuration] = useState('');
  const [caloriesBurned, setCaloriesBurned] = useState('');
  const [recentExercises, setRecentExercises] = useState<ExerciseLog[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchExerciseData = async () => {
    if (!userId) return;
    
    try {
      console.log('Fetching exercise data for user ID:', userId);
      const { data, error } = await supabase
        .from('exercise_logs')
        .select('*')
        .eq('user_id', userId)
        .order('recorded_date', { ascending: false })
        .limit(5);
        
      if (error) {
        console.error('Error fetching exercise data:', error);
        throw error;
      }
      
      if (data) {
        console.log('Exercise data retrieved:', data);
        setRecentExercises(data as ExerciseLog[]);
      }
    } catch (error) {
      console.error('Error fetching exercise data:', error);
      toast.error('Failed to load your exercise data');
    }
  };

  React.useEffect(() => {
    if (userId) {
      fetchExerciseData();
    }
  }, [userId]);

  const handleLogExercise = async () => {
    if (!exerciseName || !exerciseType || !duration) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (!userId) {
      toast.error('User not authenticated');
      return;
    }

    setIsLoading(true);

    try {
      console.log('Logging exercise for user ID:', userId);
      console.log('Exercise data:', {
        user_id: userId,
        exercise_name: exerciseName,
        exercise_type: exerciseType,
        muscle_group: muscleGroup,
        duration_minutes: parseInt(duration),
        calories_burned: caloriesBurned ? parseInt(caloriesBurned) : null
      });
      
      const { data, error } = await supabase
        .from('exercise_logs')
        .insert([
          {
            user_id: userId,
            exercise_name: exerciseName,
            exercise_type: exerciseType,
            muscle_group: muscleGroup || null,
            duration_minutes: parseInt(duration),
            calories_burned: caloriesBurned ? parseInt(caloriesBurned) : null,
            recorded_date: new Date().toISOString()
          }
        ])
        .select();

      if (error) {
        console.error('Error inserting exercise log:', error);
        throw error;
      }
      
      toast.success('Exercise logged successfully!');
      setExerciseName('');
      setExerciseType('');
      setMuscleGroup('');
      setDuration('');
      setCaloriesBurned('');
      setIsDialogOpen(false);
      
      fetchExerciseData();
    } catch (error: any) {
      console.error('Error logging exercise:', error);
      toast.error('Failed to log exercise. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateMinutesPerType = () => {
    const minutesPerType: Record<string, number> = {};
    
    recentExercises.forEach(exercise => {
      const type = exercise.exercise_type || 'Other';
      minutesPerType[type] = (minutesPerType[type] || 0) + exercise.duration_minutes;
    });
    
    return minutesPerType;
  };
  
  const minutesPerType = calculateMinutesPerType();

  const totalMinutes = recentExercises.reduce((total, ex) => total + ex.duration_minutes, 0);
  const totalCalories = recentExercises.reduce((total, ex) => total + (ex.calories_burned || 0), 0);
  
  return (
    <div className="container mx-auto p-4 md:p-6 pt-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Exercise Tracking</h1>
          <p className="text-muted-foreground">Track your workouts and stay active</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="mt-4 md:mt-0">
              <PlusCircle className="h-4 w-4 mr-2" /> Log Exercise
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Log Exercise</DialogTitle>
              <DialogDescription>
                Record your workout details to track your fitness progress
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="exercise-name">Exercise Name *</Label>
                <Input 
                  id="exercise-name" 
                  value={exerciseName} 
                  onChange={(e) => setExerciseName(e.target.value)} 
                  placeholder="e.g. Push-ups, Running, Yoga"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="exercise-type">Exercise Type *</Label>
                <Select value={exerciseType} onValueChange={setExerciseType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select exercise type" />
                  </SelectTrigger>
                  <SelectContent>
                    {exerciseTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="muscle-group">Muscle Group</Label>
                <Select value={muscleGroup} onValueChange={setMuscleGroup}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select muscle group" />
                  </SelectTrigger>
                  <SelectContent>
                    {muscleGroups.map(group => (
                      <SelectItem key={group} value={group}>{group}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="duration">Duration (minutes) *</Label>
                <Input 
                  id="duration" 
                  type="number" 
                  value={duration} 
                  onChange={(e) => setDuration(e.target.value)} 
                  placeholder="30"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="calories">Calories Burned (optional)</Label>
                <Input 
                  id="calories" 
                  type="number" 
                  value={caloriesBurned} 
                  onChange={(e) => setCaloriesBurned(e.target.value)} 
                  placeholder="150"
                />
              </div>
            </div>
            <DialogFooter className="sm:justify-between">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="button" onClick={handleLogExercise} disabled={isLoading}>
                {isLoading ? <RotateCcw className="h-4 w-4 mr-2 animate-spin" /> : <PlusCircle className="h-4 w-4 mr-2" />}
                Log Exercise
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Clock className="h-5 w-5 text-primary mr-2" />
              Weekly Activity
            </CardTitle>
            <CardDescription>Total active minutes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{totalMinutes}</p>
                  <p className="text-xs text-muted-foreground">minutes</p>
                </div>
              </div>
              <div className="text-green-500 flex items-center text-sm">
                <span>This week</span>
                <Calendar className="h-4 w-4 ml-1" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full" 
                style={{ width: `${Math.min((totalMinutes / 150) * 100, 100)}%` }} 
              />
            </div>
            <div className="w-full flex justify-between mt-1">
              <span className="text-xs text-muted-foreground">0 min</span>
              <span className="text-xs text-muted-foreground">Goal: 150 min</span>
            </div>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Dumbbell className="h-5 w-5 text-primary mr-2" />
              Recent Workouts
            </CardTitle>
            <CardDescription>Last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentExercises.length > 0 ? (
                recentExercises.map((exercise) => (
                  <div key={exercise.id} className="flex justify-between items-center py-1 border-b">
                    <div className="flex items-center gap-2">
                      <div className="bg-primary/10 p-1 rounded-full">
                        <Dumbbell className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <span className="font-medium">{exercise.exercise_name}</span>
                        <p className="text-xs text-muted-foreground">{exercise.exercise_type}</p>
                      </div>
                    </div>
                    <div className="text-muted-foreground text-sm">{exercise.duration_minutes} min</div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Dumbbell className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground mb-2">No workouts logged yet</p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Log your first workout
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
          {recentExercises.length > 0 && (
            <CardFooter className="pt-0">
              <Button variant="ghost" className="w-full" onClick={() => setIsDialogOpen(true)}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Log New Workout
              </Button>
            </CardFooter>
          )}
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Flame className="h-5 w-5 text-primary mr-2" />
              Calories & Activity
            </CardTitle>
            <CardDescription>Breakdown by exercise type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">Total Calories Burned</span>
                <span className="text-sm font-medium">{totalCalories}</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full">
                <div 
                  className="h-2 bg-red-500 rounded-full" 
                  style={{ width: `${Math.min((totalCalories / 1000) * 100, 100)}%` }} 
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-muted-foreground">0</span>
                <span className="text-xs text-muted-foreground">1000 kcal</span>
              </div>
            </div>
            
            <div className="space-y-3">
              {Object.keys(minutesPerType).length > 0 ? (
                Object.entries(minutesPerType).map(([type, minutes]) => (
                  <div key={type}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{type}</span>
                      <span className="text-sm font-medium">{minutes} min</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-primary" 
                        style={{ width: `${Math.min((minutes / totalMinutes) * 100, 100)}%` }} 
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No exercise data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExercisePage;
