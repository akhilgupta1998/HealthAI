import React, { useState, useEffect } from 'react';
import { useFirebaseContext } from '@/contexts/FirebaseContext';
import { goalService, Goal, GoalType } from '@/services/goalService';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'react-hot-toast';
import { 
  Scale, 
  Utensils, 
  Droplet, 
  Activity, 
  Moon, 
  Target, 
  TrendingUp,
  TrendingDown,
  Minus,
  Plus,
  Dumbbell,
  CalendarRange
} from 'lucide-react';
import { format, addWeeks } from 'date-fns';

interface GoalEditorProps {
  existingGoal?: Goal;
  category?: Goal['category'];
  onSave?: (goal: Goal) => void;
  onCancel?: () => void;
}

const GoalEditor: React.FC<GoalEditorProps> = ({ 
  existingGoal, 
  category = 'weight', 
  onSave, 
  onCancel 
}) => {
  const { user } = useFirebaseContext();
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [goalType, setGoalType] = useState<GoalType>(existingGoal?.type || 'general_health');
  const [title, setTitle] = useState(existingGoal?.title || '');
  const [description, setDescription] = useState(existingGoal?.description || '');
  const [currentValue, setCurrentValue] = useState<number | null>(existingGoal?.currentValue || null);
  const [targetValue, setTargetValue] = useState<number | null>(existingGoal?.targetValue || null);
  const [unit, setUnit] = useState(existingGoal?.unit || 'kg');
  const [selectedCategory, setSelectedCategory] = useState<Goal['category']>(existingGoal?.category || category);
  
  // Weight goal specific
  const [weeklyTarget, setWeeklyTarget] = useState<number>(0.5);
  
  // Nutrition goal specific
  const [caloriesTarget, setCaloriesTarget] = useState<number | undefined>(
    existingGoal?.category === 'nutrition' ? (existingGoal as any).caloriesTarget : undefined
  );
  const [proteinTarget, setProteinTarget] = useState<number | undefined>(
    existingGoal?.category === 'nutrition' ? (existingGoal as any).proteinTarget : undefined
  );
  const [carbsTarget, setCarbsTarget] = useState<number | undefined>(
    existingGoal?.category === 'nutrition' ? (existingGoal as any).carbsTarget : undefined
  );
  const [fatTarget, setFatTarget] = useState<number | undefined>(
    existingGoal?.category === 'nutrition' ? (existingGoal as any).fatTarget : undefined
  );
  
  // Exercise goal specific
  const [frequencyPerWeek, setFrequencyPerWeek] = useState<number>(
    existingGoal?.category === 'exercise' ? (existingGoal as any).frequencyPerWeek : 3
  );
  const [durationPerSession, setDurationPerSession] = useState<number>(
    existingGoal?.category === 'exercise' ? (existingGoal as any).durationPerSession : 30
  );
  const [activityType, setActivityType] = useState<string>(
    existingGoal?.category === 'exercise' ? (existingGoal as any).activityType : 'Any'
  );
  
  // Water goal specific
  const [dailyWaterTarget, setDailyWaterTarget] = useState<number>(
    existingGoal?.category === 'water' ? (existingGoal as any).dailyTarget : 2500
  );
  
  // Sleep goal specific
  const [hoursPerNight, setHoursPerNight] = useState<number>(
    existingGoal?.category === 'sleep' ? (existingGoal as any).hoursPerNight : 8
  );
  
  // Dates
  const [startDate, setStartDate] = useState<Date>(existingGoal?.startDate || new Date());
  const [hasEndDate, setHasEndDate] = useState<boolean>(!!existingGoal?.targetDate);
  const [targetDate, setTargetDate] = useState<Date | null>(existingGoal?.targetDate || addWeeks(new Date(), 12));
  
  // Generate title and description based on selected options
  useEffect(() => {
    if (title && description && existingGoal) return; // Don't override if already set
    
    let newTitle = '';
    let newDescription = '';
    
    if (selectedCategory === 'weight') {
      if (goalType === 'weight_loss' && currentValue && targetValue) {
        const toLoose = currentValue - targetValue;
        newTitle = `Lose ${toLoose.toFixed(1)} ${unit}`;
        newDescription = `Lose ${toLoose.toFixed(1)} ${unit} at a rate of ${weeklyTarget} ${unit} per week`;
      } else if (goalType === 'weight_gain' && currentValue && targetValue) {
        const toGain = targetValue - currentValue;
        newTitle = `Gain ${toGain.toFixed(1)} ${unit}`;
        newDescription = `Gain ${toGain.toFixed(1)} ${unit} at a rate of ${weeklyTarget} ${unit} per week`;
      } else if (targetValue) {
        newTitle = `Maintain weight at ${targetValue.toFixed(1)} ${unit}`;
        newDescription = `Keep weight within 1 ${unit} of ${targetValue.toFixed(1)} ${unit}`;
      }
    } else if (selectedCategory === 'nutrition' && caloriesTarget) {
      newTitle = `Consume ${caloriesTarget} calories daily`;
      newDescription = `Maintain a daily calorie intake of ${caloriesTarget} calories`;
      
      if (proteinTarget || carbsTarget || fatTarget) {
        newDescription += ' with';
        if (proteinTarget) newDescription += ` ${proteinTarget}g protein,`;
        if (carbsTarget) newDescription += ` ${carbsTarget}g carbs,`;
        if (fatTarget) newDescription += ` ${fatTarget}g fat`;
        newDescription = newDescription.replace(/,$/, '');
      }
    } else if (selectedCategory === 'exercise') {
      newTitle = `Exercise ${frequencyPerWeek} times per week`;
      newDescription = `Complete ${durationPerSession} minutes of ${activityType.toLowerCase()} exercise ${frequencyPerWeek} times per week`;
    } else if (selectedCategory === 'water') {
      newTitle = `Drink ${dailyWaterTarget}ml of water daily`;
      newDescription = 'Stay hydrated by drinking enough water every day';
    } else if (selectedCategory === 'sleep') {
      newTitle = `Sleep ${hoursPerNight} hours each night`;
      newDescription = 'Improve sleep quality and duration for better health';
    }
    
    if (newTitle && !title) setTitle(newTitle);
    if (newDescription && !description) setDescription(newDescription);
  }, [
    selectedCategory, goalType, currentValue, targetValue, unit, weeklyTarget,
    caloriesTarget, proteinTarget, carbsTarget, fatTarget,
    frequencyPerWeek, durationPerSession, activityType,
    dailyWaterTarget, hoursPerNight
  ]);
  
  const handleSave = async () => {
    if (!user) {
      toast.error('Please sign in to create goals');
      return;
    }
    
    if (!title || !description) {
      toast.error('Please provide a title and description for your goal');
      return;
    }
    
    try {
      setLoading(true);
      
      let goalData: any = {
        userId: user.uid,
        type: goalType,
        title,
        description,
        currentValue,
        targetValue,
        unit,
        category: selectedCategory,
        startDate,
        targetDate: hasEndDate ? targetDate : null
      };
      
      // Add category-specific properties
      if (selectedCategory === 'weight') {
        goalData = {
          ...goalData,
          startWeight: currentValue,
          targetWeight: targetValue,
          weeklyTarget
        };
      } else if (selectedCategory === 'nutrition') {
        goalData = {
          ...goalData,
          caloriesTarget,
          proteinTarget,
          carbsTarget,
          fatTarget
        };
      } else if (selectedCategory === 'exercise') {
        goalData = {
          ...goalData,
          frequencyPerWeek,
          durationPerSession,
          activityType
        };
      } else if (selectedCategory === 'water') {
        goalData = {
          ...goalData,
          dailyTarget: dailyWaterTarget
        };
      } else if (selectedCategory === 'sleep') {
        goalData = {
          ...goalData,
          hoursPerNight
        };
      }
      
      let savedGoal: Goal;
      
      if (existingGoal) {
        // Update existing goal
        await goalService.updateGoal(existingGoal.id!, goalData);
        savedGoal = {
          ...existingGoal,
          ...goalData
        };
      } else {
        // Create new goal
        savedGoal = await goalService.createGoal(goalData);
      }
      
      toast.success(existingGoal ? 'Goal updated successfully' : 'Goal created successfully');
      
      if (onSave) {
        onSave(savedGoal);
      }
    } catch (error) {
      console.error('Error saving goal:', error);
      toast.error('Failed to save goal');
    } finally {
      setLoading(false);
    }
  };
  
  const getCategoryIcon = () => {
    switch (selectedCategory) {
      case 'weight':
        return <Scale className="h-5 w-5 text-primary" />;
      case 'nutrition':
        return <Utensils className="h-5 w-5 text-orange-500" />;
      case 'exercise':
        return <Activity className="h-5 w-5 text-green-500" />;
      case 'water':
        return <Droplet className="h-5 w-5 text-blue-500" />;
      case 'sleep':
        return <Moon className="h-5 w-5 text-purple-500" />;
      default:
        return <Target className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const getGoalTypeIcon = () => {
    switch (goalType) {
      case 'weight_loss':
        return <TrendingDown className="h-5 w-5 text-green-500" />;
      case 'weight_gain':
      case 'muscle_gain':
        return <TrendingUp className="h-5 w-5 text-blue-500" />;
      case 'maintenance':
        return <Minus className="h-5 w-5 text-gray-500" />;
      default:
        return <Target className="h-5 w-5 text-primary" />;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label className="mb-2 block">Goal Category</Label>
          <Select 
            value={selectedCategory} 
            onValueChange={(value: Goal['category']) => setSelectedCategory(value)}
            disabled={!!existingGoal} // Can't change category for existing goals
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weight" className="flex items-center">
                <div className="flex items-center gap-2">
                  <Scale className="h-4 w-4" /> Weight
                </div>
              </SelectItem>
              <SelectItem value="nutrition">
                <div className="flex items-center gap-2">
                  <Utensils className="h-4 w-4" /> Nutrition
                </div>
              </SelectItem>
              <SelectItem value="exercise">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4" /> Exercise
                </div>
              </SelectItem>
              <SelectItem value="water">
                <div className="flex items-center gap-2">
                  <Droplet className="h-4 w-4" /> Water Intake
                </div>
              </SelectItem>
              <SelectItem value="sleep">
                <div className="flex items-center gap-2">
                  <Moon className="h-4 w-4" /> Sleep
                </div>
              </SelectItem>
              <SelectItem value="other">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4" /> Other
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {selectedCategory === 'weight' && (
          <div>
            <Label className="mb-2 block">Goal Type</Label>
            <div className="flex flex-col space-y-2">
              <RadioGroup value={goalType} onValueChange={(value) => setGoalType(value as GoalType)} className="flex flex-col space-y-1">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="weight_loss" id="weight_loss" />
                  <Label htmlFor="weight_loss" className="flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-green-500" /> Weight Loss
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="weight_gain" id="weight_gain" />
                  <Label htmlFor="weight_gain" className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-500" /> Weight Gain
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="maintenance" id="maintenance" />
                  <Label htmlFor="maintenance" className="flex items-center gap-2">
                    <Minus className="h-4 w-4 text-gray-500" /> Maintenance
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="muscle_gain" id="muscle_gain" />
                  <Label htmlFor="muscle_gain" className="flex items-center gap-2">
                    <Dumbbell className="h-4 w-4 text-purple-500" /> Muscle Gain
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        )}
        
        {selectedCategory === 'exercise' && (
          <>
            <div>
              <Label className="mb-2 block">Activity Type</Label>
              <Select value={activityType} onValueChange={setActivityType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select activity type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Any">Any Exercise</SelectItem>
                  <SelectItem value="Walking">Walking</SelectItem>
                  <SelectItem value="Running">Running</SelectItem>
                  <SelectItem value="Cycling">Cycling</SelectItem>
                  <SelectItem value="Swimming">Swimming</SelectItem>
                  <SelectItem value="Weight Training">Weight Training</SelectItem>
                  <SelectItem value="Yoga">Yoga</SelectItem>
                  <SelectItem value="HIIT">HIIT</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="mb-2 block">Sessions Per Week</Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[frequencyPerWeek]}
                  min={1}
                  max={7}
                  step={1}
                  onValueChange={(value) => setFrequencyPerWeek(value[0])}
                />
                <span className="w-12 text-center font-medium">{frequencyPerWeek}</span>
              </div>
            </div>
            
            <div>
              <Label className="mb-2 block">Minutes Per Session</Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[durationPerSession]}
                  min={5}
                  max={120}
                  step={5}
                  onValueChange={(value) => setDurationPerSession(value[0])}
                />
                <span className="w-12 text-center font-medium">{durationPerSession}</span>
              </div>
            </div>
          </>
        )}
        
        {selectedCategory === 'nutrition' && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="calories" className="mb-2 block">Daily Calorie Target</Label>
              <Input
                id="calories"
                type="number"
                value={caloriesTarget || ''}
                onChange={(e) => setCaloriesTarget(Number(e.target.value))}
                placeholder="e.g. 2000"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="protein" className="mb-2 block">Protein (g)</Label>
                <Input
                  id="protein"
                  type="number"
                  value={proteinTarget || ''}
                  onChange={(e) => setProteinTarget(Number(e.target.value))}
                  placeholder="e.g. 150"
                />
              </div>
              <div>
                <Label htmlFor="carbs" className="mb-2 block">Carbs (g)</Label>
                <Input
                  id="carbs"
                  type="number"
                  value={carbsTarget || ''}
                  onChange={(e) => setCarbsTarget(Number(e.target.value))}
                  placeholder="e.g. 200"
                />
              </div>
              <div>
                <Label htmlFor="fat" className="mb-2 block">Fat (g)</Label>
                <Input
                  id="fat"
                  type="number"
                  value={fatTarget || ''}
                  onChange={(e) => setFatTarget(Number(e.target.value))}
                  placeholder="e.g. 70"
                />
              </div>
            </div>
          </div>
        )}
        
        {selectedCategory === 'water' && (
          <div>
            <Label className="mb-2 block">Daily Water Intake Target (ml)</Label>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Target: {dailyWaterTarget}ml</span>
              </div>
              <Slider
                value={[dailyWaterTarget]}
                min={1000}
                max={4000}
                step={100}
                onValueChange={(value) => setDailyWaterTarget(value[0])}
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>1000ml</span>
                <span>2000ml</span>
                <span>3000ml</span>
                <span>4000ml</span>
              </div>
            </div>
          </div>
        )}
        
        {selectedCategory === 'sleep' && (
          <div>
            <Label className="mb-2 block">Hours of Sleep Per Night</Label>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Target: {hoursPerNight} hours</span>
              </div>
              <Slider
                value={[hoursPerNight]}
                min={5}
                max={10}
                step={0.5}
                onValueChange={(value) => setHoursPerNight(value[0])}
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>5h</span>
                <span>6h</span>
                <span>7h</span>
                <span>8h</span>
                <span>9h</span>
                <span>10h</span>
              </div>
            </div>
          </div>
        )}
        
        {(selectedCategory === 'weight' || selectedCategory === 'other') && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="current-value" className="mb-2 block">Current Value</Label>
              <div className="flex">
                <Input
                  id="current-value"
                  type="number"
                  value={currentValue === null ? '' : currentValue}
                  onChange={(e) => setCurrentValue(e.target.value ? Number(e.target.value) : null)}
                  placeholder="e.g. 70"
                  className="rounded-r-none"
                />
                <Select value={unit} onValueChange={setUnit} disabled={selectedCategory !== 'other'}>
                  <SelectTrigger className="w-24 rounded-l-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="lbs">lbs</SelectItem>
                    {selectedCategory === 'other' && (
                      <>
                        <SelectItem value="cm">cm</SelectItem>
                        <SelectItem value="steps">steps</SelectItem>
                        <SelectItem value="minutes">min</SelectItem>
                        <SelectItem value="hours">hours</SelectItem>
                        <SelectItem value="calories">cal</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="target-value" className="mb-2 block">Target Value</Label>
              <div className="flex">
                <Input
                  id="target-value"
                  type="number"
                  value={targetValue === null ? '' : targetValue}
                  onChange={(e) => setTargetValue(e.target.value ? Number(e.target.value) : null)}
                  placeholder="e.g. 65"
                  className="rounded-r-none"
                />
                <div className="w-24 rounded-l-none border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                  {unit}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {selectedCategory === 'weight' && goalType !== 'maintenance' && (
          <div>
            <Label className="mb-2 block">Weekly Target ({unit})</Label>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Target: {weeklyTarget} {unit} per week</span>
              </div>
              <Slider
                value={[weeklyTarget * 10]}
                min={2.5}
                max={10}
                step={2.5}
                onValueChange={(value) => setWeeklyTarget(value[0] / 10)}
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>0.25 {unit}</span>
                <span>0.5 {unit}</span>
                <span>0.75 {unit}</span>
                <span>1.0 {unit}</span>
              </div>
            </div>
          </div>
        )}
        
        <div>
          <Label htmlFor="title" className="mb-2 block">Goal Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Lose 5kg in 10 weeks"
          />
        </div>
        
        <div>
          <Label htmlFor="description" className="mb-2 block">Goal Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your goal in more detail"
            rows={3}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="start-date" className="mb-2 block">Start Date</Label>
            <div className="flex">
              <Input
                id="start-date"
                type="date"
                value={format(startDate, 'yyyy-MM-dd')}
                onChange={(e) => setStartDate(new Date(e.target.value))}
              />
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="target-date">Target Date</Label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="has-end-date"
                  checked={hasEndDate}
                  onChange={(e) => setHasEndDate(e.target.checked)}
                  className="mr-2"
                />
                <Label htmlFor="has-end-date" className="text-sm text-gray-500">Set end date</Label>
              </div>
            </div>
            <Input
              id="target-date"
              type="date"
              value={targetDate ? format(targetDate, 'yyyy-MM-dd') : ''}
              onChange={(e) => setTargetDate(new Date(e.target.value))}
              disabled={!hasEndDate}
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        {onCancel && (
          <Button variant="outline" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
        )}
        <Button onClick={handleSave} disabled={loading}>
          {loading ? 'Saving...' : existingGoal ? 'Update Goal' : 'Create Goal'}
        </Button>
      </div>
    </div>
  );
};

export default GoalEditor; 