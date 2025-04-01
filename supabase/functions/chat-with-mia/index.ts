
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
    const { message, audioData, mode, userId, isAuthenticated, userProfile, enableVoice } = await req.json();

    // Handle speech-to-text conversion
    if (mode === 'transcribe' && audioData) {
      console.log("Processing audio transcription request");
      try {
        // Convert base64 to binary
        const binaryAudio = Uint8Array.from(atob(audioData), c => c.charCodeAt(0));
        
        // Create a blob from the binary data
        const audioBlob = new Blob([binaryAudio], { type: 'audio/webm' });
        
        // Create FormData to send to OpenAI
        const formData = new FormData();
        formData.append('file', audioBlob, 'audio.webm');
        formData.append('model', 'whisper-1');
        formData.append('language', 'en');
        
        // Call OpenAI's transcription API
        const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
          },
          body: formData,
        });
        
        if (!response.ok) {
          const errorData = await response.text();
          console.error("OpenAI transcription error:", errorData);
          throw new Error(`Transcription failed with status ${response.status}`);
        }
        
        const result = await response.json();
        console.log("Transcription result:", result);
        
        return new Response(
          JSON.stringify({ text: result.text }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (error) {
        console.error("Error in transcription:", error);
        return new Response(
          JSON.stringify({ error: "Failed to transcribe audio" }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
    }

    if (!message) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log(`Processing chat request for ${isAuthenticated ? 'authenticated user' : 'anonymous user'}`);
    
    if (userProfile) {
      console.log("User profile data available:", Object.keys(userProfile));
    }

    // Prepare the system message with personalized info if available
    let systemMessage = `You are Mia, a health and wellness AI assistant for the Health Guardian app. 
    You provide friendly, supportive advice on nutrition, fitness, and overall well-being. 
    Keep your responses conversational, encouraging, and evidence-based. 
    Your goal is to help users develop healthier habits and make informed choices about their health.
    
    If asked about specific medical issues, remind users that you're not a healthcare professional and 
    they should consult with their doctor for medical advice.
    
    Current date: ${new Date().toLocaleDateString()}`;
    
    // Add personalized information if available
    if (userProfile) {
      systemMessage += `\n\nUser Information:`;
      if (userProfile.display_name) systemMessage += `\n- Name: ${userProfile.display_name}`;
      if (userProfile.age) systemMessage += `\n- Age: ${userProfile.age} years`;
      if (userProfile.gender) systemMessage += `\n- Gender: ${userProfile.gender}`;
      if (userProfile.height) systemMessage += `\n- Height: ${userProfile.height} cm`;
      if (userProfile.weight) systemMessage += `\n- Weight: ${userProfile.weight} kg`;
      if (userProfile.goal_weight) systemMessage += `\n- Goal weight: ${userProfile.goal_weight} kg`;
      
      if (userProfile.activity_level) {
        const activityLevels = {
          "sedentary": "little or no exercise",
          "lightly-active": "light exercise 1-3 days/week",
          "moderately-active": "moderate exercise 3-5 days/week",
          "very-active": "hard exercise 6-7 days/week",
          "extra-active": "very hard exercise or physical job"
        };
        
        const activityDescription = activityLevels[userProfile.activity_level as keyof typeof activityLevels] || userProfile.activity_level;
        systemMessage += `\n- Activity level: ${activityDescription}`;
      }
      
      if (userProfile.dietary_preferences && userProfile.dietary_preferences.length > 0) {
        systemMessage += `\n- Dietary preferences: ${userProfile.dietary_preferences.join(', ')}`;
      }
    }

    const userMessage = {
      role: "user",
      content: message
    };

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemMessage },
        userMessage
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    const aiReply = response.choices[0].message.content;
    console.log("AI response received successfully");
    
    // Generate audio if enabled
    let audioContent = null;
    if (enableVoice && aiReply) {
      try {
        console.log("Generating audio from text response");
        const audioResponse = await fetch('https://api.openai.com/v1/audio/speech', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'tts-1',
            voice: 'nova', // Using a friendly female voice
            input: aiReply,
            response_format: 'mp3',
          }),
        });
        
        if (!audioResponse.ok) {
          throw new Error(`Failed to generate speech: ${audioResponse.statusText}`);
        }
        
        const audioBuffer = await audioResponse.arrayBuffer();
        audioContent = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)));
        console.log("Audio generated successfully");
      } catch (audioError) {
        console.error("Error generating speech:", audioError);
        // Continue without audio if it fails
      }
    }
    
    return new Response(
      JSON.stringify({
        reply: aiReply,
        audioContent: audioContent,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error("Error in chat:", error);
    
    return new Response(
      JSON.stringify({
        error: error.message || 'An error occurred during chat',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
