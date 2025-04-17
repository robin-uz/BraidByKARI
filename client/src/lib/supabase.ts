import { createClient } from '@supabase/supabase-js';

// Explicitly extract environment variables from Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY || '';

// Log available keys for debugging (remove in production)
console.log('Supabase URL available:', !!supabaseUrl);
console.log('Supabase Anon Key available:', !!supabaseAnonKey);

// Create a single supabase client for interacting with your database
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

// Log a warning instead of throwing an error, so the app still loads
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase credentials missing or invalid. Authentication will not work properly.');
}

// Authentication helper functions
export const auth = {
  // Sign up a new user
  async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  },
  
  // Sign in an existing user
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  },
  
  // Sign out the current user
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },
  
  // Get the current user session
  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },
  
  // Get the current user
  async getUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },
  
  // Check if the user is authenticated
  async isAuthenticated() {
    const session = await this.getSession();
    return !!session;
  },
  
  // Set up auth state change listener
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  },
  
  // Request a password reset email
  async resetPassword(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    
    if (error) throw error;
    return data;
  },
  
  // Update user password
  async updatePassword(password: string) {
    const { data, error } = await supabase.auth.updateUser({
      password: password,
    });
    
    if (error) throw error;
    return data;
  },
  
  // Update user profile data
  async updateProfile(profile: { firstName?: string; lastName?: string; avatarUrl?: string }) {
    const { data, error } = await supabase.auth.updateUser({
      data: profile,
    });
    
    if (error) throw error;
    return data;
  },
  
  // Verify and confirm new email address
  async verifyOtp(email: string, token: string, type: 'email' | 'recovery' = 'email') {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type,
    });
    
    if (error) throw error;
    return data;
  }
};