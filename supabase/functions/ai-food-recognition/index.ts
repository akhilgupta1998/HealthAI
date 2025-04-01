
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "https://esm.sh/openai@4.14.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Use the environment variable first, then the fallback
const openAIApiKey = Deno.env.get('OPENAI_API_KEY') || 
  'OPENAI_API_KEY_PLACEHOLDER ';

const openai = new OpenAI({
  apiKey: openAIApiKey,
});

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    });
  }

  try {
    const { 
      image, 
      portionType = 'standard', 
      portionAmount = '1',
      updatePortionOnly = false,
      existingFoodName = null 
    } = await req.json();

    if (!image) {
      return new Response(
        JSON.stringify({ error: 'Image data is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log(`Processing food image (Portion: ${portionAmount} ${portionType})`);
    
    let prompt = "Analyze this food image and provide detailed nutritional information.";
    
    if (updatePortionOnly && existingFoodName) {
      prompt = `This is an image of ${existingFoodName}. Provide updated nutritional information for ${portionAmount} ${portionType}(s) of this food.`;
    } else {
      prompt += ` Consider the portion size as ${portionAmount} ${portionType}(s).`;
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Using the compatible model
      messages: [
        {
          role: "system",
          content: "You are a nutritional analysis expert. Analyze the provided food image and identify the food items, estimated calories, and nutritional breakdown (protein, carbs, fats). Format the response as a JSON object with fields: foodName, calories, protein, carbs, fat, healthScore (1-10), and healthTips (recommendations). For portion sizes, adjust the nutritional values accordingly. Make sure to accurately adjust nutritional data based on the specified portion type and amount."
        },
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: image } }
          ]
        }
      ],
      response_format: { type: "json_object" },
    });

    console.log("AI response received successfully");
    
    return new Response(
      JSON.stringify({
        result: JSON.parse(response.choices[0].message.content),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error("Error processing image:", error);
    
    return new Response(
      JSON.stringify({
        error: error.message || 'An error occurred during image analysis',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
