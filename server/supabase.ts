import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables if not already done
config();

// Extract Supabase credentials from environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Check if credentials are available
if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ Missing Supabase credentials. Supabase integration will not work correctly.');
}

// Create Supabase client for server-side operations
export const supabase = createClient(
  supabaseUrl || '',
  supabaseKey || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Helper to verify a Supabase session token
export async function verifySupabaseSession(token: string) {
  try {
    const { data, error } = await supabase.auth.getUser(token);
    
    if (error) {
      console.error('Supabase session verification error:', error.message);
      return null;
    }
    
    return data.user;
  } catch (error) {
    console.error('Unexpected error during Supabase session verification:', error);
    return null;
  }
}

// Helper to get user by Supabase ID
export async function getUserBySupabaseId(supabaseId: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', supabaseId)
      .single();
    
    if (error) {
      console.error('Error fetching user profile from Supabase:', error.message);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Unexpected error during Supabase profile fetch:', error);
    return null;
  }
}