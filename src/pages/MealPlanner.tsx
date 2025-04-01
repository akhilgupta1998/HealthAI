import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useFirebaseContext } from '@/contexts/FirebaseContext';
import { Loader2, ChevronRight, Calendar, Utensils, BookMarked, 
         RotateCcw, Plus, ShoppingBag, SendIcon, BookOpen, ChefHat, Clock, PlusCircle, Search, Save, Trash2, ArrowRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { format, addDays } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { openAIService, MealPlanRequest, MealPlanResponse, DailyMealPlan } from '@/services/openai-service';

// Define types for meal plans
interface Meal {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
  instructions: string;
  imageUrl?: string;
}

interface DailyPlan {
  date: Date;
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
  snacks: Meal[];
}

interface WeeklyPlan {
  startDate: Date;
  endDate: Date;
  days: DailyPlan[];
}

interface MealPlan {
  id: string;
  title: string;
  date: Date;
  meals: Meal[];
}

// Common diet types
const DIET_TYPES = [
  { label: 'Balanced', value: 'balanced' },
  { label: 'Vegetarian', value: 'vegetarian' },
  { label: 'Vegan', value: 'vegan' },
  { label: 'Keto', value: 'keto' },
  { label: 'Paleo', value: 'paleo' },
  { label: 'Low Carb', value: 'low-carb' },
  { label: 'Gluten Free', value: 'gluten-free' },
  { label: 'Dairy Free', value: 'dairy-free' },
  { label: 'High Protein', value: 'high-protein' }
];

// Common allergies
const COMMON_ALLERGIES = [
  { label: 'Peanuts', value: 'peanuts' },
  { label: 'Tree Nuts', value: 'tree-nuts' },
  { label: 'Dairy', value: 'dairy' },
  { label: 'Eggs', value: 'eggs' },
  { label: 'Wheat', value: 'wheat' },
  { label: 'Soy', value: 'soy' },
  { label: 'Fish', value: 'fish' },
  { label: 'Shellfish', value: 'shellfish' },
  { label: 'Gluten', value: 'gluten' }
];

// Mock OpenAI API key - in a real app, this would be securely stored in environment variables
const OPENAI_API_KEY = "mock-api-key-replace-with-real-key";

const MealPlanner = () => {
  const { user, userMetadata, updateUserProfile } = useFirebaseContext();
  const navigate = useNavigate();
  
  // Initialize OpenAI service
  useEffect(() => {
    openAIService.initialize(OPENAI_API_KEY);
  }, []);
  
  // State for meal planning
  const [activeTab, setActiveTab] = useState('generate');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showMealDetails, setShowMealDetails] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // State for meal plan request
  const [planRequest, setPlanRequest] = useState<MealPlanRequest>({
    duration: 7,
    dietType: userMetadata?.dietaryPreferences?.dietType || 'balanced',
    calorieTarget: userMetadata?.healthMetrics?.targetCalories || 2000,
    allergies: userMetadata?.dietaryPreferences?.allergies || [],
    favoriteIngredients: userMetadata?.dietaryPreferences?.favoriteIngredients || [],
    dislikedIngredients: userMetadata?.dietaryPreferences?.dislikedIngredients || [],
    healthGoals: userMetadata?.fitnessGoals || [],
    mealType: 'all'
  });
  
  // State for generated meal plan
  const [generatedPlan, setGeneratedPlan] = useState<MealPlanResponse | null>(null);
  const [savedMealPlans, setSavedMealPlans] = useState<{id: string, title: string, date: Date, plan: MealPlanResponse}[]>([]);
  
  // Load user's saved meal plans
  useEffect(() => {
    const loadSavedPlans = async () => {
      if (userMetadata?.mealPlans?.length) {
        setSavedMealPlans(userMetadata.mealPlans);
      }
    };
    
    loadSavedPlans();
  }, [userMetadata]);
  
  // Handle generate meal plan
  const handleGenerateMealPlan = async () => {
    setIsGenerating(true);
    
    try {
      const response = await openAIService.generateMealPlan(planRequest);
      if (response) {
        setGeneratedPlan(response);
        setActiveTab('view');
        toast.success("Meal plan generated successfully!");
      }
    } catch (error) {
      console.error("Error generating meal plan:", error);
      toast.error("Failed to generate meal plan. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Handle save meal plan
  const handleSaveMealPlan = async () => {
    if (!generatedPlan) return;
    
    try {
      const newPlan = {
        id: crypto.randomUUID(),
        title: `${planRequest.duration}-Day ${planRequest.dietType} Meal Plan`,
        date: new Date(),
        plan: generatedPlan
      };
      
      const updatedPlans = [...(savedMealPlans || []), newPlan];
      setSavedMealPlans(updatedPlans);
      
      // Save to user profile
      await updateUserProfile({
        mealPlans: updatedPlans
      });
      
      toast.success("Meal plan saved successfully!");
    } catch (error) {
      console.error("Error saving meal plan:", error);
      toast.error("Failed to save meal plan. Please try again.");
    }
  };
  
  // Handle delete meal plan
  const handleDeleteMealPlan = async (planId: string) => {
    try {
      const updatedPlans = savedMealPlans.filter(plan => plan.id !== planId);
      setSavedMealPlans(updatedPlans);
      
      // Save to user profile
      await updateUserProfile({
        mealPlans: updatedPlans
      });
      
      toast.success("Meal plan deleted successfully!");
    } catch (error) {
      console.error("Error deleting meal plan:", error);
      toast.error("Failed to delete meal plan. Please try again.");
    }
  };
  
  // Handle update meal plan request
  const handleUpdatePlanRequest = (field: keyof MealPlanRequest, value: any) => {
    setPlanRequest(prev => ({ ...prev, [field]: value }));
  };
  
  // Render meal card
  const renderMealCard = (meal: any, date: string, type: string) => {
    if (!meal) return null;
    
    return (
      <Card className="mb-4 overflow-hidden hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <Badge variant="outline" className="mb-2">{type}</Badge>
              <CardTitle className="text-lg">{meal.name}</CardTitle>
            </div>
            <div className="flex items-center text-muted-foreground text-sm">
              <Clock className="h-3 w-3 mr-1" />
              <span>{meal.preparationTime || '20'} min</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex flex-wrap gap-1 mb-2">
            {(meal.tags || []).slice(0, 3).map((tag: string, i: number) => (
              <Badge key={i} variant="secondary" className="text-xs">{tag}</Badge>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-2 text-xs text-center">
            <div>
              <p className="font-bold">{meal.nutritionalInfo.calories}</p>
              <p className="text-muted-foreground">Cal</p>
            </div>
            <div>
              <p className="font-bold">{meal.nutritionalInfo.protein}g</p>
              <p className="text-muted-foreground">Protein</p>
            </div>
            <div>
              <p className="font-bold">{meal.nutritionalInfo.carbs}g</p>
              <p className="text-muted-foreground">Carbs</p>
            </div>
            <div>
              <p className="font-bold">{meal.nutritionalInfo.fat}g</p>
              <p className="text-muted-foreground">Fat</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-muted/30 pt-2 pb-2">
          <Button variant="ghost" size="sm" className="w-full text-xs" onClick={() => setShowMealDetails(`${date}-${type}`)}>
            View Details
            <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </CardFooter>
      </Card>
    );
  };
  
  // Render meal details dialog
  const renderMealDetailsDialog = () => {
    if (!showMealDetails || !generatedPlan) return null;
    
    const [dateString, mealType] = showMealDetails.split('-');
    const dayIndex = parseInt(dateString.split('-')[0]);
    const dailyPlan = generatedPlan.mealPlan.find(d => d.day === dayIndex);
    
    if (!dailyPlan) return null;
    
    let meal;
    switch (mealType) {
      case 'breakfast':
        meal = dailyPlan.meals.breakfast;
        break;
      case 'lunch':
        meal = dailyPlan.meals.lunch;
        break;
      case 'dinner':
        meal = dailyPlan.meals.dinner;
        break;
      default:
        if (mealType.startsWith('snack') && dailyPlan.meals.snacks) {
          const snackIndex = parseInt(mealType.replace('snack', ''));
          meal = dailyPlan.meals.snacks[snackIndex];
        }
    }
    
    if (!meal) return null;
    
    return (
      <Dialog open={!!showMealDetails} onOpenChange={() => setShowMealDetails(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Utensils className="h-5 w-5 mr-2" />
              {meal.name}
            </DialogTitle>
            <DialogDescription>
              From Day {dayIndex} • {dailyPlan.date} • {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Ingredients</h3>
              <ul className="space-y-1 mb-4">
                {meal.ingredients.map((ingredient: string, i: number) => (
                  <li key={i} className="flex items-start">
                    <div className="mr-2 mt-1 h-1 w-1 rounded-full bg-primary" />
                    <span>{ingredient}</span>
                  </li>
                ))}
              </ul>
              
              <div className="bg-muted p-3 rounded-md mb-4">
                <h4 className="font-medium mb-2">Nutrition Facts</h4>
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-lg font-bold">{meal.nutritionalInfo.calories}</p>
                    <p className="text-xs text-muted-foreground">Calories</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold">{meal.nutritionalInfo.protein}g</p>
                    <p className="text-xs text-muted-foreground">Protein</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold">{meal.nutritionalInfo.carbs}g</p>
                    <p className="text-xs text-muted-foreground">Carbs</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold">{meal.nutritionalInfo.fat}g</p>
                    <p className="text-xs text-muted-foreground">Fat</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {(meal.tags || []).map((tag: string, i: number) => (
                  <Badge key={i} variant="outline">{tag}</Badge>
                ))}
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">Instructions</h3>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{meal.preparationTime || '20'} min</span>
                </div>
              </div>
              
              <ol className="space-y-2">
                {meal.instructions.map((step: string, i: number) => (
                  <li key={i} className="flex items-start">
                    <span className="font-bold min-w-[20px] mr-2">{i + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMealDetails(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };
  
  return (
    <div className="container max-w-6xl mx-auto p-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <ChefHat className="mr-2 h-7 w-7" />
            Meal Planner
          </h1>
          <p className="text-muted-foreground">Create and manage your personalized meal plans</p>
        </div>
        
        <div className="mt-2 md:mt-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[300px]">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="generate">Generate</TabsTrigger>
              <TabsTrigger value="view">View</TabsTrigger>
              <TabsTrigger value="saved">Saved</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <TabsContent value="generate" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Generate a New Meal Plan</CardTitle>
              <CardDescription>Customize your preferences to get a personalized meal plan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="duration">Duration (days)</Label>
                    <Select 
                      value={planRequest.duration.toString()}
                      onValueChange={(value) => handleUpdatePlanRequest('duration', parseInt(value))}
                    >
                      <SelectTrigger id="duration">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 day</SelectItem>
                        <SelectItem value="3">3 days</SelectItem>
                        <SelectItem value="7">7 days</SelectItem>
                        <SelectItem value="14">14 days</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="diet-type">Diet Type</Label>
                    <Select 
                      value={planRequest.dietType}
                      onValueChange={(value) => handleUpdatePlanRequest('dietType', value)}
                    >
                      <SelectTrigger id="diet-type">
                        <SelectValue placeholder="Select diet type" />
                      </SelectTrigger>
                      <SelectContent>
                        {DIET_TYPES.map((diet) => (
                          <SelectItem key={diet.value} value={diet.value}>{diet.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="calories">Daily Calorie Target</Label>
                    <div className="flex items-center space-x-4">
                      <Slider
                        id="calories"
                        defaultValue={[planRequest.calorieTarget]}
                        min={1200}
                        max={3500}
                        step={100}
                        onValueChange={(values) => handleUpdatePlanRequest('calorieTarget', values[0])}
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        value={planRequest.calorieTarget}
                        onChange={(e) => handleUpdatePlanRequest('calorieTarget', parseInt(e.target.value) || 2000)}
                        className="w-20"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="allergies">Allergies</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {COMMON_ALLERGIES.map((allergy) => (
                        <div key={allergy.value} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`allergy-${allergy.value}`}
                            checked={planRequest.allergies.includes(allergy.value)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleUpdatePlanRequest('allergies', [...planRequest.allergies, allergy.value]);
                              } else {
                                handleUpdatePlanRequest('allergies', planRequest.allergies.filter(a => a !== allergy.value));
                              }
                            }}
                          />
                          <label 
                            htmlFor={`allergy-${allergy.value}`}
                            className="text-sm cursor-pointer"
                          >
                            {allergy.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="meal-focus">Meal Focus (Optional)</Label>
                    <Select 
                      value={planRequest.mealType || 'all'}
                      onValueChange={(value) => handleUpdatePlanRequest('mealType', value)}
                    >
                      <SelectTrigger id="meal-focus">
                        <SelectValue placeholder="All meals" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All meals</SelectItem>
                        <SelectItem value="breakfast">Breakfast only</SelectItem>
                        <SelectItem value="lunch">Lunch only</SelectItem>
                        <SelectItem value="dinner">Dinner only</SelectItem>
                        <SelectItem value="snacks">Snacks only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="favorite-ingredients">Favorite Ingredients (Optional)</Label>
                    <Textarea
                      id="favorite-ingredients"
                      placeholder="Enter ingredients you like, separated by commas"
                      value={planRequest.favoriteIngredients?.join(', ') || ''}
                      onChange={(e) => handleUpdatePlanRequest('favoriteIngredients', e.target.value.split(',').map(i => i.trim()).filter(Boolean))}
                      className="h-20"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="disliked-ingredients">Disliked Ingredients (Optional)</Label>
                    <Textarea
                      id="disliked-ingredients"
                      placeholder="Enter ingredients you don't like, separated by commas"
                      value={planRequest.dislikedIngredients?.join(', ') || ''}
                      onChange={(e) => handleUpdatePlanRequest('dislikedIngredients', e.target.value.split(',').map(i => i.trim()).filter(Boolean))}
                      className="h-20"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="health-goals">Health Goals (Optional)</Label>
                    <Textarea
                      id="health-goals"
                      placeholder="Enter your health goals, separated by commas"
                      value={planRequest.healthGoals?.join(', ') || ''}
                      onChange={(e) => handleUpdatePlanRequest('healthGoals', e.target.value.split(',').map(i => i.trim()).filter(Boolean))}
                      className="h-20"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleGenerateMealPlan} 
                className="w-full"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>Generating Meal Plan...</>
                ) : (
                  <>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Generate Meal Plan
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="view" className="mt-0">
          {!generatedPlan ? (
            <Card className="bg-muted/30">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <ChefHat className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No Meal Plan Generated Yet</h3>
                <p className="text-muted-foreground text-center mb-6 max-w-md">
                  Generate a new meal plan with your preferences to view and save it here.
                </p>
                <Button onClick={() => setActiveTab('generate')}>
                  Go to Generate
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-2xl font-bold">
                    {planRequest.duration}-Day {DIET_TYPES.find(d => d.value === planRequest.dietType)?.label || planRequest.dietType} Meal Plan
                  </h2>
                  <p className="text-muted-foreground">
                    {planRequest.calorieTarget} calories per day
                  </p>
                </div>
                
                <Button onClick={handleSaveMealPlan}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Meal Plan
                </Button>
              </div>
              
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Plan Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">{generatedPlan.summary}</p>
                  
                  {generatedPlan.tips && generatedPlan.tips.length > 0 && (
                    <div className="bg-muted p-4 rounded-md">
                      <h3 className="font-medium mb-2">Nutrition Tips</h3>
                      <ul className="space-y-1">
                        {generatedPlan.tips.map((tip, i) => (
                          <li key={i} className="flex items-start">
                            <Check className="h-4 w-4 mr-2 text-green-500 mt-1 flex-shrink-0" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                {generatedPlan.mealPlan.map((dailyPlan) => (
                  <Card key={dailyPlan.day} className="mb-4 md:mb-0">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Day {dailyPlan.day}</CardTitle>
                      <CardDescription>{dailyPlan.date}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <ScrollArea className="h-[400px] pr-4">
                        {dailyPlan.meals.breakfast && renderMealCard(dailyPlan.meals.breakfast, `${dailyPlan.day}-${dailyPlan.date}`, 'breakfast')}
                        {dailyPlan.meals.lunch && renderMealCard(dailyPlan.meals.lunch, `${dailyPlan.day}-${dailyPlan.date}`, 'lunch')}
                        {dailyPlan.meals.dinner && renderMealCard(dailyPlan.meals.dinner, `${dailyPlan.day}-${dailyPlan.date}`, 'dinner')}
                        
                        {dailyPlan.meals.snacks && dailyPlan.meals.snacks.length > 0 && (
                          <>
                            <Separator className="my-2" />
                            <p className="text-sm font-medium mb-2">Snacks</p>
                            {dailyPlan.meals.snacks.map((snack, i) => 
                              renderMealCard(snack, `${dailyPlan.day}-${dailyPlan.date}`, `snack${i}`)
                            )}
                          </>
                        )}
                      </ScrollArea>
                    </CardContent>
                    <CardFooter className="pt-2">
                      <div className="w-full grid grid-cols-4 gap-1 text-xs text-center">
                        <div className="bg-primary/10 p-1 rounded">
                          <p className="font-bold">{dailyPlan.totalNutrition.calories}</p>
                          <p className="text-muted-foreground">Cal</p>
                        </div>
                        <div className="bg-primary/10 p-1 rounded">
                          <p className="font-bold">{dailyPlan.totalNutrition.protein}g</p>
                          <p className="text-muted-foreground">Prot</p>
                        </div>
                        <div className="bg-primary/10 p-1 rounded">
                          <p className="font-bold">{dailyPlan.totalNutrition.carbs}g</p>
                          <p className="text-muted-foreground">Carbs</p>
                        </div>
                        <div className="bg-primary/10 p-1 rounded">
                          <p className="font-bold">{dailyPlan.totalNutrition.fat}g</p>
                          <p className="text-muted-foreground">Fat</p>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </>
          )}
        </TabsContent>
        
        <TabsContent value="saved" className="mt-0">
          {savedMealPlans.length === 0 ? (
            <Card className="bg-muted/30">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Save className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No Saved Meal Plans</h3>
                <p className="text-muted-foreground text-center mb-6 max-w-md">
                  Generate and save meal plans to access them here later.
                </p>
                <Button onClick={() => setActiveTab('generate')}>
                  Generate a Meal Plan
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedMealPlans.map((plan) => (
                <Card key={plan.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div>
                        <CardTitle className="text-lg">{plan.title}</CardTitle>
                        <CardDescription>
                          {format(new Date(plan.date), 'PPP')}
                        </CardDescription>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteMealPlan(plan.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {plan.plan.summary}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline">{plan.plan.mealPlan.length} days</Badge>
                      <Badge variant="outline">{plan.plan.mealPlan[0]?.totalNutrition.calories || '2000'} calories</Badge>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="default" 
                      className="w-full"
                      onClick={() => {
                        setGeneratedPlan(plan.plan);
                        setActiveTab('view');
                      }}
                    >
                      <Search className="mr-2 h-4 w-4" />
                      View Plan
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </div>
      
      {renderMealDetailsDialog()}
    </div>
  );
};

export default MealPlanner; 