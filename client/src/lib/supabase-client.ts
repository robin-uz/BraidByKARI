import { createClient } from '@supabase/supabase-js';

// Get Supabase URL and anon key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase environment variables are missing!");
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Sign up with email and password
export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/supabase`
    }
  });
  
  if (error) {
    console.error('Signup error:', error.message);
    throw error;
  }
  
  console.log('Signup success:', data);
  return data;
}

// Sign in with email and password
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

// Sign out
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error('Logout error:', error.message);
    throw error;
  }
  
  console.log('Logged out');
}

// Reset password
export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`
  });
  
  if (error) {
    console.error('Password reset error:', error.message);
    throw error;
  }
  
  console.log('Password reset email sent');
}

// Update password
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

// Get current session
export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('Get session error:', error.message);
    throw error;
  }
  
  return data.session;
}

// Get current user
export async function getUser() {
  const { data, error } = await supabase.auth.getUser();
  
  if (error) {
    console.error('Get user error:', error.message);
    throw error;
  }
  
  return data.user;
}

// Subscribe to auth state changes
export function onAuthStateChange(callback: (event: string, session: any) => void) {
  return supabase.auth.onAuthStateChange(callback);
}