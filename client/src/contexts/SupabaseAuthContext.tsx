import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabaseClient, supabaseAuth } from '@/lib/supabase-client';
import { useToast } from '@/hooks/use-toast';

// Define the shape of our auth context
type SupabaseAuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData?: Record<string, any>) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  updateProfile: (profile: Record<string, any>) => Promise<void>;
};

// Create the context with default values
const SupabaseAuthContext = createContext<SupabaseAuthContextType | undefined>(undefined);

// The provider component
export function SupabaseAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('Initializing Supabase auth...');
        // Get the current session
        const session = await supabaseAuth.getSession();
        
        setSession(session);
        
        if (session) {
          const user = await supabaseAuth.getUser();
          setUser(user);
          console.log('Supabase user authenticated:', user?.email);
        } else {
          console.log('No Supabase session found');
        }
      } catch (error) {
        console.error('Error initializing Supabase auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Supabase auth state changed:', event);
        setSession(currentSession);
        setUser(currentSession?.user || null);
        setLoading(false);
      }
    );

    // Cleanup
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { user, session } = await supabaseAuth.signIn(email, password);
      setUser(user);
      setSession(session);
      toast({
        title: "Signed in successfully",
        description: `Welcome back, ${user?.email}!`,
      });
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message || "An error occurred during sign in",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, userData?: Record<string, any>) => {
    try {
      setLoading(true);
      const { user, session } = await supabaseAuth.signUp(email, password, userData);
      toast({
        title: "Account created",
        description: "Please check your email for a confirmation link",
      });
      
      // If auto-confirmed (based on Supabase settings)
      if (session) {
        setUser(user);
        setSession(session);
      }
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message || "An error occurred during sign up",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setLoading(true);
      await supabaseAuth.signOut();
      setUser(null);
      setSession(null);
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      });
    } catch (error: any) {
      toast({
        title: "Sign out failed",
        description: error.message || "An error occurred during sign out",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      await supabaseAuth.resetPassword(email);
      toast({
        title: "Password reset email sent",
        description: "Please check your email for a password reset link",
      });
    } catch (error: any) {
      toast({
        title: "Password reset failed",
        description: error.message || "An error occurred while sending reset email",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update password
  const updatePassword = async (password: string) => {
    try {
      setLoading(true);
      await supabaseAuth.updatePassword(password);
      toast({
        title: "Password updated",
        description: "Your password has been successfully updated",
      });
    } catch (error: any) {
      toast({
        title: "Password update failed",
        description: error.message || "An error occurred while updating password",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update profile
  const updateProfile = async (profile: Record<string, any>) => {
    try {
      setLoading(true);
      await supabaseAuth.updateProfile(profile);
      // Refresh user data
      const updatedUser = await supabaseAuth.getUser();
      setUser(updatedUser);
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated",
      });
    } catch (error: any) {
      toast({
        title: "Profile update failed",
        description: error.message || "An error occurred while updating profile",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Create context value
  const contextValue = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
  };

  return (
    <SupabaseAuthContext.Provider value={contextValue}>
      {children}
    </SupabaseAuthContext.Provider>
  );
}

// Hook to use the auth context
export function useSupabaseAuth() {
  const context = useContext(SupabaseAuthContext);
  if (context === undefined) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider');
  }
  return context;
}