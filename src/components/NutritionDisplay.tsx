
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { PlusCircle, Clock, Award, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useClerkContext } from '@/contexts/ClerkContext';

interface NutritionDisplayProps {
  foodData: {
    food_name: string;
    nutrition: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    };
    health_score?: number;
    health_tips?: string;
    image_url?: string;
  };
  portionType?: string;
  portionAmount?: string;
  mealType?: string;
  onSaveMeal?: () => void;
  isSaving?: boolean;
}

const NutritionDisplay: React.FC<NutritionDisplayProps> = ({ 
  foodData, 
  portionType = 'standard',
  portionAmount = '1',
  mealType = 'lunch',
  onSaveMeal,
  isSaving = false
}) => {
  const { userMetadata, isAuthenticated } = useClerkContext();
  
  // Calculate nutrition values based on portion size
  const calculateAdjustedNutrition = () => {
    const multiplier = parseFloat(portionAmount) || 1;
    return {
      calories: Math.round(foodData.nutrition.calories * multiplier),
      protein: Math.round(foodData.nutrition.protein * multiplier * 10) / 10,
      carbs: Math.round(foodData.nutrition.carbs * multiplier * 10) / 10,
      fat: Math.round(foodData.nutrition.fat * multiplier * 10) / 10
    };
  };
  
  const adjustedNutrition = calculateAdjustedNutrition();
  
  const formatPortionText = () => {
    if (portionAmount === '1') {
      return `1 ${portionType}`;
    }
    return `${portionAmount} ${portionType}s`;
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Nutrition Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">{foodData.food_name}</h3>
            <span className="text-sm flex items-center text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              {new Date().toLocaleString()}
            </span>
          </div>
          
          {portionType && portionAmount && (
            <div className="bg-secondary/20 rounded-md p-2 text-sm flex items-center justify-between">
              <span>Portion size:</span>
              <span className="font-medium">{formatPortionText()}</span>
            </div>
          )}
          
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="bg-primary/10 p-2 rounded-md">
              <p className="text-2xl font-bold">{adjustedNutrition.calories}</p>
              <p className="text-xs text-muted-foreground">Calories</p>
            </div>
            <div className="bg-red-500/10 p-2 rounded-md">
              <p className="text-2xl font-bold">{adjustedNutrition.protein}g</p>
              <p className="text-xs text-muted-foreground">Protein</p>
            </div>
            <div className="bg-yellow-500/10 p-2 rounded-md">
              <p className="text-2xl font-bold">{adjustedNutrition.carbs}g</p>
              <p className="text-xs text-muted-foreground">Carbs</p>
            </div>
            <div className="bg-blue-500/10 p-2 rounded-md">
              <p className="text-2xl font-bold">{adjustedNutrition.fat}g</p>
              <p className="text-xs text-muted-foreground">Fat</p>
            </div>
          </div>
          
          {foodData.health_score !== undefined && (
            <div className="mt-4 p-4 bg-green-500/10 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <Award className="h-5 w-5 mr-2 text-green-500" />
                  <h4 className="font-medium">Health Score</h4>
                </div>
                <span className={`font-bold ${
                  (foodData.health_score ?? 5) >= 7 ? 'text-green-600' : 
                  (foodData.health_score ?? 5) >= 4 ? 'text-yellow-600' : 
                  'text-red-600'
                }`}>
                  {foodData.health_score}/10
                </span>
              </div>
              
              <Progress 
                value={(foodData.health_score ?? 5) * 10} 
                className="h-2 mb-2" 
              />
              
              {foodData.health_tips && (
                <p className="text-sm text-muted-foreground mt-2">{foodData.health_tips}</p>
              )}
            </div>
          )}
          
          <Button 
            className="w-full mt-4" 
            onClick={onSaveMeal} 
            disabled={isSaving || !isAuthenticated}
            variant="default"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add to Meal Log
              </>
            )}
          </Button>
          
          {!isAuthenticated && (
            <p className="text-xs text-muted-foreground text-center mt-2">
              Please sign in to save your meal
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NutritionDisplay;
