import { createClient } from '@supabase/supabase-js';

// Explicitly extract environment variables from Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('CRITICAL ERROR: Supabase credentials are missing. Authentication will not work correctly.');
}

// Create the Supabase client
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
);

// Helper functions for auth operations
export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/supabase-auth`
    }
  });
  
  if (error) {
    console.error('Signup error:', error.message);
    throw error;
  }
  
  console.log('Signup success:', data);
  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    console.error('Login error:', error.message);
    throw error;
  }
  
  console.log('Login success:', data);
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error('Logout error:', error.message);
    throw error;
  }
  
  console.log('Logged out');
}

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/supabase-reset-password`
  });
  
  if (error) {
    console.error('Password reset error:', error.message);
    throw error;
  }
  
  console.log('Password reset email sent');
}

export async function updatePassword(newPassword: string) {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword
  });
  
  if (error) {
    console.error('Password update error:', error.message);
    throw error;
  }
  
  console.log('Password updated successfully');
  return data;
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('Get session error:', error.message);
    throw error;
  }
  
  return data.session;
}

export async function getUser() {
  const { data, error } = await supabase.auth.getUser();
  
  if (error) {
    console.error('Get user error:', error.message);
    throw error;
  }
  
  return data.user;
}

export function onAuthStateChange(callback: (event: string, session: any) => void) {
  return supabase.auth.onAuthStateChange(callback);
}