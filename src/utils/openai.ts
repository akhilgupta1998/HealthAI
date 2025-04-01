import OpenAI from 'openai';

// Use the environment variable for API key
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

if (!apiKey) {
  throw new Error('OpenAI API key is not set in environment variables');
}

export const openai = new OpenAI({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true
});

export interface FoodRecognitionResult {
  isFoodDetected: boolean;
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

/**
 * Recognizes food from an image and returns nutritional information
 * @param imageBase64 Base64 encoded image
 * @returns Food recognition result
 */
export const recognizeFood = async (imageBase64: string): Promise<FoodRecognitionResult> => {
  try {
    console.log("Starting OpenAI food recognition...");
    
    // Remove data URL prefix if present
    const base64Image = imageBase64.includes('base64,') 
      ? imageBase64.split('base64,')[1] 
      : imageBase64;
    
    // Call OpenAI Vision API to analyze the food image
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Using the recommended model
      messages: [
        {
          role: "system",
          content: `You are a nutritional analysis AI. Identify food in images and provide accurate nutritional information. 
                   Always return the name of the food, calories, protein (g), carbs (g), and fat (g).
                   If no food is detected, clearly state that.`
        },
        {
          role: "user",
          content: [
            { 
              type: "text", 
              text: "What food is in this image? Provide the name and nutritional information (calories, protein, carbs, fat). If there's no food, say 'No food detected'." 
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 500
    });

    const content = response.choices[0]?.message?.content || '';
    console.log("OpenAI Response:", content);
    
    // Check if no food was detected
    if (content.includes("No food detected") || content.includes("not food")) {
      return {
        isFoodDetected: false,
        foodName: "No food detected",
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0
      };
    }

    // Parse the response to extract nutritional information
    let foodName = "Unknown food";
    let calories = 0;
    let protein = 0;
    let carbs = 0;
    let fat = 0;

    // Try to extract food name with improved regex pattern
    const nameMatch = content.match(/(?:This appears to be|I can see|The image shows|This is|This looks like|The food is)\s*(?:a|an)?\s*([\w\s\-,]+?)(?:\.|,|\n|with|containing|that)/i);
    if (nameMatch && nameMatch[1]) {
      foodName = nameMatch[1].trim();
    } else {
      // Fallback regex for food name
      const simpleFoodMatch = content.match(/([A-Za-z\s\-]+)(?=\s*[:\.]\s*(?:\d|calorie|protein|carb|fat))/i);
      if (simpleFoodMatch && simpleFoodMatch[1]) {
        foodName = simpleFoodMatch[1].trim();
      }
    }

    // Extract calories with improved pattern
    const caloriesMatch = content.match(/calories?:?\s*(\d+)(?:\.|,|\s|kcal)/i);
    if (caloriesMatch && caloriesMatch[1]) {
      calories = parseInt(caloriesMatch[1]);
    }

    // Extract protein with improved pattern
    const proteinMatch = content.match(/protein:?\s*(\d+(?:\.\d+)?)\s*g/i);
    if (proteinMatch && proteinMatch[1]) {
      protein = parseFloat(proteinMatch[1]);
    }

    // Extract carbs with improved pattern
    const carbsMatch = content.match(/(?:carbs|carbohydrates):?\s*(\d+(?:\.\d+)?)\s*g/i);
    if (carbsMatch && carbsMatch[1]) {
      carbs = parseFloat(carbsMatch[1]);
    }

    // Extract fat with improved pattern
    const fatMatch = content.match(/fat:?\s*(\d+(?:\.\d+)?)\s*g/i);
    if (fatMatch && fatMatch[1]) {
      fat = parseFloat(fatMatch[1]);
    }

    console.log("Parsed food data:", { foodName, calories, protein, carbs, fat });

    return {
      isFoodDetected: true,
      foodName,
      calories,
      protein,
      carbs,
      fat
    };
  } catch (error) {
    console.error("Error recognizing food:", error);
    throw new Error("Failed to analyze the food image. Please try again.");
  }
};
