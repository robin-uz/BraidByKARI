import { useEffect } from 'react';

// This component is for debugging environment variables
export function DebugEnv() {
  useEffect(() => {
    console.log('=== Environment Variables Debug ===');
    console.log('SUPABASE_URL:', import.meta.env.SUPABASE_URL || 'undefined');
    console.log('SUPABASE_ANON_KEY:', import.meta.env.SUPABASE_ANON_KEY || 'undefined');
    console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL || 'undefined');
    console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY || 'undefined');
    console.log('================================');
  }, []);

  return null;
}