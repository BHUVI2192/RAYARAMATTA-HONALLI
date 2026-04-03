import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl) {
  console.error('CRITICAL ERROR: SUPABASE_URL is not defined in environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
