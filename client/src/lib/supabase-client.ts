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
  console.log('Signing up with email:', email);
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`
    }
  });
  
  if (error) {
    console.error('Signup error:', error.message);
    throw error;
  }
  
  console.log('Signup success:', data);
  return data;
}

// Sign in with email or username and password
export async function signIn(emailOrUsername: string, password: string) {
  try {
    console.log('Attempting to sign in with:', emailOrUsername);
    
    // First try server authentication
    try {
      console.log('Trying server login first');
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          username: emailOrUsername, 
          password 
        }),
        credentials: 'include',
      });
      
      console.log('Server auth response status:', response.status);
      
      if (response.ok) {
        const userData = await response.json();
        console.log('Server login successful:', userData);
        return { user: userData };
      } else {
        const errorData = await response.json();
        console.log('Server login failed:', errorData.message);
      }
    } catch (serverAuthError) {
      console.error('Server auth error:', serverAuthError);
    }
    
    // If server auth failed and input looks like an email, try Supabase authentication
    if (emailOrUsername.includes('@')) {
      console.log('Trying Supabase auth with email:', emailOrUsername);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailOrUsername,
        password,
      });
      
      if (error) {
        console.error('Supabase login error:', error.message);
        throw error;
      }
      
      console.log('Supabase login success:', data);
      return data;
    } else {
      throw new Error('Login failed. If using username, please ensure it exists and password is correct.');
    }
  } catch (error: any) {
    console.error('All authentication methods failed:', error.message);
    throw error;
  }
}

// Sign in with magic link
export async function signInWithMagicLink(email: string) {
  console.log('Sending magic link to:', email);
  const { data, error } = await supabase.auth.signInWithOtp({
    email
  });
  
  if (error) {
    console.error('Magic link error:', error.message);
    throw error;
  }
  
  console.log('Magic link sent successfully');
  return data;
}

// Sign out
export async function signOut() {
  console.log('Signing out user');
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error('Logout error:', error.message);
    throw error;
  }
  
  console.log('Logged out successfully');
}

// Reset password
export async function resetPassword(email: string) {
  console.log('Resetting password for:', email);
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`
  });
  
  if (error) {
    console.error('Password reset error:', error.message);
    throw error;
  }
  
  console.log('Password reset email sent');
}

// Update user
export async function updateUser(updates: { email?: string, password?: string, data?: any }) {
  console.log('Updating user with:', updates);
  const { data, error } = await supabase.auth.updateUser(updates);
  
  if (error) {
    console.error('Update user error:', error.message);
    throw error;
  }
  
  console.log('User updated successfully');
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
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error('Get user error:', error);
    throw error;
  }
}

// Check if user is an admin
export async function isAdmin(userId: string): Promise<boolean> {
  if (!userId) return false;
  
  try {
    // Query the users table for admin status
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
    
    return data && data.role === 'admin';
  } catch (error) {
    console.error('Error checking admin role:', error);
    return false;
  }
}

// Subscribe to auth state changes
export function onAuthStateChange(callback: (event: string, session: any) => void) {
  return supabase.auth.onAuthStateChange(callback);
}