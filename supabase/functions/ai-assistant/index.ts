import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "https://esm.sh/openai@4.14.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

if (!openAIApiKey) {
  throw new Error('OPENAI_API_KEY environment variable is not set');
}

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
    const { message, isAuthenticated, userProfile } = await req.json();
    
    console.log("Processing message:", message);
    console.log("Auth status:", isAuthenticated);
    console.log("User profile:", userProfile);
    
    if (!message) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Prepare system message based on authentication status
    let systemMessage = isAuthenticated 
      ? "You are Mia, a health and wellness assistant for Health Guardian. You provide personalized health advice, nutrition information, and fitness recommendations. Be friendly, supportive, and encouraging."
      : "You are Mia, an AI assistant for Health Guardian. You can provide general health information, but for personalized health advice, suggest the user to sign in.";
    
    // Add user profile information if available
    if (isAuthenticated && userProfile) {
      systemMessage += `\nThe user's profile information: ${JSON.stringify(userProfile, null, 2)}`;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const reply = completion.choices[0].message.content;
    console.log("AI response generated successfully:", reply.substring(0, 50) + "...");
    
    return new Response(
      JSON.stringify({ reply }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error("Error in ai-assistant function:", error);
    
    return new Response(
      JSON.stringify({
        error: 'An error occurred during processing',
        details: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
