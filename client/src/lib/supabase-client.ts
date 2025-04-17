import { createClient } from '@supabase/supabase-js';

// Explicitly extract environment variables from Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Log availability of credentials for debugging (remove in production)
console.log('Supabase client setup - URL available:', !!supabaseUrl);
console.log('Supabase client setup - Anon Key available:', !!supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase credentials are missing. Authentication will not work correctly.');
}

// Create the Supabase client
export const supabaseClient = createClient(
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
export const supabaseAuth = {
  // Sign up a new user
  async signUp(email: string, password: string, userData?: Record<string, any>) {
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      }
    });
    
    if (error) throw error;
    return data;
  },
  
  // Sign in an existing user
  async signIn(email: string, password: string) {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  },
  
  // Sign out the current user
  async signOut() {
    const { error } = await supabaseClient.auth.signOut();
    if (error) throw error;
  },
  
  // Get the current user session
  async getSession() {
    const { data, error } = await supabaseClient.auth.getSession();
    if (error) throw error;
    return data.session;
  },
  
  // Get the current user
  async getUser() {
    const { data, error } = await supabaseClient.auth.getUser();
    if (error) throw error;
    return data.user;
  },
  
  // Check if the user is authenticated
  async isAuthenticated() {
    try {
      const session = await this.getSession();
      return !!session;
    } catch (error) {
      console.error('Error checking authentication status:', error);
      return false;
    }
  },
  
  // Set up auth state change listener
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabaseClient.auth.onAuthStateChange(callback);
  },
  
  // Request a password reset email
  async resetPassword(email: string) {
    const { data, error } = await supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/supabase-reset-password`,
    });
    
    if (error) throw error;
    return data;
  },
  
  // Update user password
  async updatePassword(password: string) {
    const { data, error } = await supabaseClient.auth.updateUser({
      password,
    });
    
    if (error) throw error;
    return data;
  },
  
  // Update user profile data
  async updateProfile(profile: Record<string, any>) {
    const { data, error } = await supabaseClient.auth.updateUser({
      data: profile,
    });
    
    if (error) throw error;
    return data;
  },
}