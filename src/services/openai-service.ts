import { toast } from "sonner";

// OpenAI API endpoint and configuration
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

// Interface for meal planning preferences
export interface MealPlanRequest {
  duration: number; // Number of days
  dietType: string; // e.g., "vegetarian", "keto", "balanced"
  calorieTarget: number;
  allergies: string[];
  favoriteIngredients?: string[];
  dislikedIngredients?: string[];
  healthGoals?: string[];
  mealType?: string; // e.g., "all", "breakfast", "lunch", "dinner"
}

export interface MealSuggestion {
  name: string;
  ingredients: string[];
  nutritionalInfo: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  preparationTime: number; // in minutes
  instructions: string[];
  category: string; // e.g., "breakfast", "lunch", "dinner", "snack"
  tags: string[]; // e.g., "vegetarian", "high-protein", "low-carb"
}

export interface DailyMealPlan {
  day: number;
  date: string;
  meals: {
    breakfast?: MealSuggestion;
    lunch?: MealSuggestion;
    dinner?: MealSuggestion;
    snacks?: MealSuggestion[];
  };
  totalNutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface MealPlanResponse {
  mealPlan: DailyMealPlan[];
  summary: string;
  tips: string[];
}

export interface NutritionResponse {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
  allergens: string[];
  healthScore: number;
  recommendations: string[];
}

class OpenAIService {
  private apiKey: string | null = null;

  // Initialize the service with an API key
  public initialize(apiKey: string) {
    this.apiKey = apiKey;
  }

  // Check if API key is set
  private checkApiKey(): boolean {
    if (!this.apiKey) {
      console.error("OpenAI API key not set. Call initialize() first.");
      toast.error("AI service not configured properly. Please check your settings.");
      return false;
    }
    return true;
  }

  // Helper method to make API requests
  private async makeRequest(messages: any[], temperature: number = 0.7) {
    if (!this.checkApiKey()) return null;

    try {
      const response = await fetch(OPENAI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages,
          temperature,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "AI request failed");
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error("Error making OpenAI request:", error);
      toast.error("Failed to get response from AI. Please try again later.");
      return null;
    }
  }

  // Generate a personalized meal plan
  public async generateMealPlan(preferences: MealPlanRequest): Promise<MealPlanResponse | null> {
    const prompt = `
      Generate a detailed ${preferences.duration}-day meal plan for a ${preferences.dietType} diet with a daily calorie target of ${preferences.calorieTarget} calories.
      
      Dietary restrictions and preferences:
      ${preferences.allergies.length > 0 ? `- Allergies: ${preferences.allergies.join(", ")}` : "- No specific allergies"}
      ${preferences.favoriteIngredients?.length ? `- Favorite ingredients: ${preferences.favoriteIngredients.join(", ")}` : ""}
      ${preferences.dislikedIngredients?.length ? `- Disliked ingredients: ${preferences.dislikedIngredients.join(", ")}` : ""}
      ${preferences.healthGoals?.length ? `- Health goals: ${preferences.healthGoals.join(", ")}` : ""}
      ${preferences.mealType && preferences.mealType !== "all" ? `- Focus on meal type: ${preferences.mealType}` : ""}
      
      For each day, please include:
      1. Breakfast, lunch, dinner, and optional snacks
      2. Ingredients list for each meal
      3. Brief preparation instructions
      4. Nutritional information (calories, protein, carbs, fat)
      5. Total daily nutrition summary
      
      Provide the response as a well-structured JSON object that can be parsed directly.
      Include a summary and nutrition tips at the end.
    `;

    const messages = [
      { role: "system", content: "You are a certified nutritionist and meal planning expert who provides detailed, varied and delicious meal plans based on user preferences. Your responses are well-structured JSON that can be parsed directly in JavaScript." },
      { role: "user", content: prompt }
    ];

    try {
      const responseText = await this.makeRequest(messages, 0.7);
      if (!responseText) return null;

      // Extract the JSON from the response
      const jsonMatch = responseText.match(/```json\n([\s\S]*)\n```/) || 
                        responseText.match(/```\n([\s\S]*)\n```/) || 
                        [null, responseText];
      
      const jsonStr = jsonMatch[1] || responseText;
      return JSON.parse(jsonStr);
    } catch (error) {
      console.error("Error parsing meal plan response:", error);
      toast.error("Failed to generate meal plan. Please try again.");
      return null;
    }
  }

  // Analyze a food item based on description or image
  public async analyzeFood(foodDescription: string): Promise<NutritionResponse | null> {
    const prompt = `
      Analyze the nutritional content of this food item: "${foodDescription}"
      
      Please provide:
      1. Estimated calories, protein, carbs, and fat
      2. List of main ingredients
      3. Potential allergens
      4. Health score (1-10)
      5. Nutritional recommendations
      
      Format the response as structured JSON that can be parsed.
    `;

    const messages = [
      { role: "system", content: "You are a certified nutritionist and food analysis expert. You provide accurate nutritional information based on food descriptions. Your responses are well-structured JSON that can be parsed directly in JavaScript." },
      { role: "user", content: prompt }
    ];

    try {
      const responseText = await this.makeRequest(messages, 0.3);
      if (!responseText) return null;

      // Extract the JSON from the response
      const jsonMatch = responseText.match(/```json\n([\s\S]*)\n```/) || 
                        responseText.match(/```\n([\s\S]*)\n```/) || 
                        [null, responseText];
      
      const jsonStr = jsonMatch[1] || responseText;
      return JSON.parse(jsonStr);
    } catch (error) {
      console.error("Error parsing food analysis response:", error);
      toast.error("Failed to analyze food. Please try again.");
      return null;
    }
  }

  // Get health tips and recommendations based on user profile
  public async getHealthRecommendations(
    userProfile: {
      height?: number;
      weight?: number;
      age?: number;
      gender?: string;
      activityLevel?: string;
      dietaryPreferences?: string[];
      healthGoals?: string[];
      medicalConditions?: string[];
    }
  ): Promise<string[] | null> {
    const prompt = `
      Based on the following user profile, provide 5-7 personalized health and nutrition recommendations:
      
      ${userProfile.gender ? `- Gender: ${userProfile.gender}` : ""}
      ${userProfile.age ? `- Age: ${userProfile.age}` : ""}
      ${userProfile.height ? `- Height: ${userProfile.height} cm` : ""}
      ${userProfile.weight ? `- Weight: ${userProfile.weight} kg` : ""}
      ${userProfile.activityLevel ? `- Activity level: ${userProfile.activityLevel}` : ""}
      ${userProfile.dietaryPreferences?.length ? `- Dietary preferences: ${userProfile.dietaryPreferences.join(", ")}` : ""}
      ${userProfile.healthGoals?.length ? `- Health goals: ${userProfile.healthGoals.join(", ")}` : ""}
      ${userProfile.medicalConditions?.length ? `- Medical conditions: ${userProfile.medicalConditions.join(", ")}` : ""}
      
      Provide specific, actionable recommendations that are evidence-based.
      Format the response as a JSON array of recommendation strings.
    `;

    const messages = [
      { role: "system", content: "You are a certified nutritionist and health expert who provides personalized, evidence-based health recommendations. Your recommendations are specific, actionable, and tailored to the individual's profile. Your responses are in JSON format." },
      { role: "user", content: prompt }
    ];

    try {
      const responseText = await this.makeRequest(messages, 0.5);
      if (!responseText) return null;

      // Extract the JSON from the response
      const jsonMatch = responseText.match(/```json\n([\s\S]*)\n```/) || 
                        responseText.match(/```\n([\s\S]*)\n```/) || 
                        [null, responseText];
      
      const jsonStr = jsonMatch[1] || responseText;
      return JSON.parse(jsonStr);
    } catch (error) {
      console.error("Error parsing health recommendations:", error);
      toast.error("Failed to get health recommendations. Please try again.");
      return null;
    }
  }
}

// Export as singleton instance
export const openAIService = new OpenAIService();
export default openAIService; 