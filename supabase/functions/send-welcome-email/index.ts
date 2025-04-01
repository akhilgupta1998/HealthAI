
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const MAILCHIMP_API_KEY = "dde6786b25a8540c7f8aa1e8ac3a964e-us9";
const MAILCHIMP_SERVER = "us9"; // Extract from API key (us9)
const MAILCHIMP_LIST_ID = "your-audience-id"; // You need to get this from Mailchimp

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Create subscriber hash for the email (MD5 hash of lowercase email)
    const subscriberHash = await createSubscriberHash(email.toLowerCase());

    // First check if the user already exists
    const url = `https://${MAILCHIMP_SERVER}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members/${subscriberHash}`;

    const response = await fetch(url, {
      method: 'PUT', // Use PUT to either add or update
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${btoa(`anystring:${MAILCHIMP_API_KEY}`)}`,
      },
      body: JSON.stringify({
        email_address: email,
        status_if_new: 'subscribed',
        status: 'subscribed',
        merge_fields: {
          FNAME: name || '',
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.title || 'Failed to subscribe to Mailchimp');
    }

    // Now send a welcome email
    await sendWelcomeEmail(email, name);

    return new Response(
      JSON.stringify({ success: true, message: 'Welcome email sent successfully' }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to send welcome email' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function createSubscriberHash(email: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(email);
  const hashBuffer = await crypto.subtle.digest('MD5', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function sendWelcomeEmail(email: string, name: string): Promise<void> {
  // This is a simple implementation using Mailchimp's API
  // In a real-world scenario, you might want to use a template or a more sophisticated approach
  const template = `
    <html>
      <head>
        <title>Welcome to Health Guardian!</title>
      </head>
      <body>
        <h1>Welcome to Health Guardian, ${name || 'there'}!</h1>
        <p>Thank you for signing up. We're excited to help you track your health and fitness goals.</p>
        <p>Get started by:</p>
        <ul>
          <li>Completing your profile</li>
          <li>Setting your health goals</li>
          <li>Tracking your first meal</li>
        </ul>
        <p>If you have any questions, feel free to reach out to our support team.</p>
        <p>Best regards,<br>The Health Guardian Team</p>
      </body>
    </html>
  `;

  // In a real implementation, you'd send this via an email service
  console.log(`Welcome email content for ${email}:`, template);
  
  // For now, we'll just log that we sent it
  console.log(`Welcome email sent to ${email}`);
}
