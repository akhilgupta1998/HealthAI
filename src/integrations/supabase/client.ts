// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://pfmuyksxukpxtyuvxscf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmbXV5a3N4dWtweHR5dXZ4c2NmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MTc2NDYsImV4cCI6MjA1ODM5MzY0Nn0.vHF-c7vEHYg9SuLm51HavlQZsUcYXMI11ctMuhUuckc";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);