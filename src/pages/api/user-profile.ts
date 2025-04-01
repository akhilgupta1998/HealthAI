
import { supabase } from '@/integrations/supabase/client';

export default async function handler(req: Request) {
  if (req.method === 'GET') {
    try {
      // Get the current user's session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        return new Response(JSON.stringify({ error: sessionError.message }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      
      if (!sessionData.session?.user) {
        return new Response(JSON.stringify({ error: 'Not authenticated' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      
      // Get the user's profile
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', sessionData.session.user.id)
        .single();
        
      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      
      return new Response(JSON.stringify({ data }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error: any) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } else {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
