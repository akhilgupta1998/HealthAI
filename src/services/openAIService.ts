import axios from 'axios';
import { Meal } from './firebaseService';

// API Key from environment variables
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY || 'dummy-key-for-development';

// Base URL for OpenAI API
const API_URL = 'https://api.openai.com/v1/chat/completions';

// Meal Plan Request Interface
export interface MealPlanRequest {
  dietType?: string;
  calorieTarget?: number;
  mealCount?: number;
  dietaryRestrictions?: string[];
  allergies?: string[];
  preferredCuisines?: string[];
  excludeIngredients?: string[];
  goalFocus?: string; // e.g., 'weight loss', 'muscle gain', 'maintenance'
}

// Meal Plan Response Interface
export interface MealPlanResponse {
  meals: Meal[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  tips?: string[];
}

/**
 * Generate a personalized meal plan based on user preferences
 * @param request MealPlanRequest object containing user preferences
 * @returns Promise<MealPlanResponse> with generated meal plan
 */
export const generateMealPlan = async (request: MealPlanRequest): Promise<MealPlanResponse> => {
  try {
    // Construct the prompt for OpenAI
    const prompt = constructMealPlanPrompt(request);
    
    // Make API call to OpenAI
    const response = await axios.post(
      API_URL,
      {
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a nutritionist specialized in creating personalized meal plans. Provide detailed meal plans with exact nutritional information and ingredients. Format your response as JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
        response_format: { type: 'json_object' }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        }
      }
    );
    
    // Parse the response
    const rawResponse = response.data.choices[0].message.content;
    
    // Parse the JSON response
    const parsedResponse = JSON.parse(rawResponse);
    
    // Map the OpenAI response to our MealPlanResponse interface
    return mapOpenAIResponseToMealPlan(parsedResponse);
    
  } catch (error) {
    console.error('Error generating meal plan:', error);
    
    // Return a fallback meal plan in case of error
    return getFallbackMealPlan(request);
  }
};

/**
 * Construct a prompt for OpenAI based on user preferences
 * @param request MealPlanRequest object
 * @returns string prompt for OpenAI
 */
const constructMealPlanPrompt = (request: MealPlanRequest): string => {
  const {
    dietType = 'balanced',
    calorieTarget = 2000,
    mealCount = 3,
    dietaryRestrictions = [],
    allergies = [],
    preferredCuisines = [],
    excludeIngredients = [],
    goalFocus = 'balanced nutrition'
  } = request;
  
  return `Create a detailed meal plan with ${mealCount} meals for a day.
  
Diet type: ${dietType}
Calorie target: ${calorieTarget}
Dietary restrictions: ${dietaryRestrictions.join(', ') || 'None'}
Allergies: ${allergies.join(', ') || 'None'}
Preferred cuisines: ${preferredCuisines.join(', ') || 'Any'}
Exclude ingredients: ${excludeIngredients.join(', ') || 'None'}
Goal focus: ${goalFocus}

For each meal, provide:
1. Name of the dish
2. Exact calories
3. Exact protein (g)
4. Exact carbs (g)
5. Exact fat (g)
6. Complete list of ingredients (with quantities)
7. Brief cooking instructions

Also include totals for the entire day.

Format your response as a JSON object with the following structure:
{
  "meals": [
    {
      "name": "Meal name",
      "calories": 500,
      "protein": 30,
      "carbs": 40,
      "fat": 15,
      "ingredients": ["1 cup of ingredient 1", "2 tbsp of ingredient 2"],
      "instructions": "Brief cooking instructions"
    }
  ],
  "totalCalories": 2000,
  "totalProtein": 120,
  "totalCarbs": 180,
  "totalFat": 65,
  "tips": ["Nutritional tip 1", "Nutritional tip 2"]
}
`;
};

/**
 * Map the OpenAI response to our MealPlanResponse interface
 * @param response Raw response from OpenAI
 * @returns MealPlanResponse object
 */
const mapOpenAIResponseToMealPlan = (response: any): MealPlanResponse => {
  // Map the meals array
  const meals = response.meals.map((meal: any) => ({
    name: meal.name,
    calories: meal.calories,
    protein: meal.protein,
    carbs: meal.carbs,
    fat: meal.fat,
    ingredients: meal.ingredients,
    instructions: meal.instructions
  }));
  
  return {
    meals,
    totalCalories: response.totalCalories,
    totalProtein: response.totalProtein,
    totalCarbs: response.totalCarbs,
    totalFat: response.totalFat,
    tips: response.tips
  };
};

/**
 * Get a fallback meal plan in case the API call fails
 * @param request MealPlanRequest object
 * @returns MealPlanResponse with a basic meal plan
 */
const getFallbackMealPlan = (request: MealPlanRequest): MealPlanResponse => {
  const { calorieTarget = 2000 } = request;
  
  // Create a basic meal plan based on the calorie target
  const breakfastCalories = Math.round(calorieTarget * 0.3);
  const lunchCalories = Math.round(calorieTarget * 0.35);
  const dinnerCalories = Math.round(calorieTarget * 0.35);
  
  return {
    meals: [
      {
        name: 'Basic Breakfast',
        calories: breakfastCalories,
        protein: Math.round(breakfastCalories * 0.25 / 4), // 25% of calories from protein (4 cal/g)
        carbs: Math.round(breakfastCalories * 0.5 / 4),    // 50% of calories from carbs (4 cal/g)
        fat: Math.round(breakfastCalories * 0.25 / 9),     // 25% of calories from fat (9 cal/g)
        ingredients: [
          '2 large eggs',
          '1 slice whole grain toast',
          '1 tbsp olive oil',
          '1/2 avocado'
        ],
        instructions: 'Scramble eggs in olive oil. Serve with toast and sliced avocado.'
      },
      {
        name: 'Simple Lunch',
        calories: lunchCalories,
        protein: Math.round(lunchCalories * 0.3 / 4),
        carbs: Math.round(lunchCalories * 0.4 / 4),
        fat: Math.round(lunchCalories * 0.3 / 9),
        ingredients: [
          '6 oz grilled chicken breast',
          '2 cups mixed greens',
          '1/4 cup quinoa, cooked',
          '2 tbsp olive oil and lemon dressing'
        ],
        instructions: 'Grill chicken, combine with quinoa and greens, dress with olive oil and lemon juice.'
      },
      {
        name: 'Basic Dinner',
        calories: dinnerCalories,
        protein: Math.round(dinnerCalories * 0.3 / 4),
        carbs: Math.round(dinnerCalories * 0.4 / 4),
        fat: Math.round(dinnerCalories * 0.3 / 9),
        ingredients: [
          '6 oz salmon fillet',
          '1 cup roasted vegetables',
          '1/2 cup brown rice, cooked',
          '1 tbsp olive oil for cooking'
        ],
        instructions: 'Bake salmon, serve with roasted vegetables and brown rice.'
      }
    ],
    totalCalories: calorieTarget,
    totalProtein: Math.round(calorieTarget * 0.3 / 4),
    totalCarbs: Math.round(calorieTarget * 0.4 / 4),
    totalFat: Math.round(calorieTarget * 0.3 / 9),
    tips: [
      'Drink plenty of water throughout the day',
      'Adjust portions based on your hunger and satiety cues',
      'This is a fallback meal plan. For a more personalized plan, please try again later.'
    ]
  };
};

// Export the service
export default {
  generateMealPlan
}; 