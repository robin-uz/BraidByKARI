import { useState, useEffect } from 'react';
import { Route, useLocation } from 'wouter';
import { Loader2 } from 'lucide-react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

interface SupabaseProtectedRouteProps {
  path: string;
  component: () => JSX.Element;
  adminOnly?: boolean;
}

export function SupabaseProtectedRoute({ 
  path, 
  component: Component, 
  adminOnly = false 
}: SupabaseProtectedRouteProps) {
  const { user, loading } = useSupabaseAuth();
  const [, navigate] = useLocation();
  const [location] = useLocation();

  // Handle initial loading state
  if (loading) {
    return (
      <Route path={path}>
        {() => (
          <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
            <span className="ml-2">Checking Supabase authentication...</span>
          </div>
        )}
      </Route>
    );
  }

  // If not authenticated, redirect to Supabase auth test page
  if (!user) {
    console.log('Not authenticated with Supabase, redirecting to test page');
    return (
      <Route path={path}>
        {() => {
          // Use effect to navigate after render
          useEffect(() => {
            navigate('/auth/supabase-test');
          }, []);
          
          return (
            <div className="flex items-center justify-center min-h-screen">
              <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
              <span className="ml-2">Not logged in with Supabase. Redirecting...</span>
            </div>
          );
        }}
      </Route>
    );
  }

  // If adminOnly is true, check if user has admin role
  if (adminOnly && user.user_metadata?.role !== 'admin') {
    return (
      <Route path={path}>
        {() => (
          <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
            <p className="text-center mb-4">You don't have admin permissions in Supabase.</p>
            <button 
              onClick={() => navigate('/auth/supabase-test')}
              className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
            >
              Return to Supabase Test Page
            </button>
          </div>
        )}
      </Route>
    );
  }

  // If authenticated, render the protected content
  return (
    <Route path={path}>
      {() => <Component />}
    </Route>
  );
}