import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { 
  supabase, 
  signIn as supabaseSignIn, 
  signUp as supabaseSignUp, 
  signOut as supabaseSignOut,
  resetPassword as supabaseResetPassword,
  updatePassword as supabaseUpdatePassword,
  getSession as supabaseGetSession,
  getUser as supabaseGetUser
} from '@/lib/supabase-client';
import { useToast } from '@/hooks/use-toast';

// Define the shape of our auth context
type SupabaseAuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
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
    // Get the current session
    const initializeAuth = async () => {
      try {
        console.log('Initializing Supabase auth...');
        
        // Get current session
        const currentSession = await supabaseGetSession();
        setSession(currentSession);
        
        if (currentSession) {
          const currentUser = await supabaseGetUser();
          setUser(currentUser);
          console.log('Supabase user authenticated:', currentUser?.email);
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('Supabase auth state changed:', event);
        setSession(currentSession);
        setUser(currentSession?.user || null);
        
        // Show appropriate toast notifications based on the auth event
        if (event === 'SIGNED_IN' && currentSession?.user) {
          toast({
            title: "Signed in successfully",
            description: `Welcome, ${currentSession.user.email}!`,
          });
        } else if (event === 'SIGNED_OUT') {
          toast({
            title: "Signed out",
            description: "You have been signed out successfully",
          });
        } else if (event === 'PASSWORD_RECOVERY') {
          toast({
            title: "Password recovery",
            description: "Password recovery process started",
          });
        } else if (event === 'USER_UPDATED') {
          toast({
            title: "Account updated",
            description: "Your account has been updated successfully",
          });
        }
      }
    );

    // Cleanup
    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      await supabaseSignIn(email, password);
      // Note: We don't need to manually update user/session here
      // The onAuthStateChange listener above will handle that
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
  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      await supabaseSignUp(email, password);
      toast({
        title: "Account created",
        description: "Please check your email for a confirmation link",
      });
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
      await supabaseSignOut();
      // Note: We don't need to manually clear user/session here
      // The onAuthStateChange listener above will handle that
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
      await supabaseResetPassword(email);
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
      await supabaseUpdatePassword(password);
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