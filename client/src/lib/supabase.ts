import { createClient } from '@supabase/supabase-js';

// Check if we're in the browser or server environment
const getSupabaseCredentials = () => {
  // For client side (Vite injects these as import.meta.env)
  if (typeof window !== 'undefined') {
    // Try to get from VITE_ prefixed variables first, if not available use non-prefixed versions
    return {
      url: import.meta.env.VITE_SUPABASE_URL || import.meta.env.SUPABASE_URL,
      key: import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY,
    };
  } 
  // For server side
  else {
    return {
      url: process.env.SUPABASE_URL || '',
      key: process.env.SUPABASE_ANON_KEY || '',
    };
  }
};

const { url: supabaseUrl, key: supabaseAnonKey } = getSupabaseCredentials();

// Create a single supabase client for interacting with your database
// Use placeholder values during development if not available, but display a warning
const supabaseOptions = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
};

export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  supabaseOptions
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