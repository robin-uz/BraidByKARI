import { useState, useEffect } from 'react';
import { Route, useLocation } from 'wouter';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  path: string;
  component: () => JSX.Element;
  adminOnly?: boolean;
}

export function SupabaseProtectedRoute({ 
  path, 
  component: Component, 
  adminOnly = false 
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();
  const [location] = useLocation();

  // Handle initial loading state
  if (loading) {
    return (
      <Route path={path}>
        {() => (
          <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
            <span className="ml-2">Checking authentication...</span>
          </div>
        )}
      </Route>
    );
  }

  // If not authenticated, redirect to home page
  if (!user) {
    console.log('Not authenticated, redirecting to home');
    window.location.href = '/';
    return (
      <Route path={path}>
        {() => (
          <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
            <span className="ml-2">Not logged in. Redirecting to home...</span>
          </div>
        )}
      </Route>
    );
  }

  // If adminOnly is true, check if user has admin role
  // This will need to be customized based on how you store admin status
  if (adminOnly && user.user_metadata?.role !== 'admin') {
    return (
      <Route path={path}>
        {() => (
          <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
            <p className="text-center mb-4">You don't have permission to access this page.</p>
            <a 
              href="/"
              className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
            >
              Return to Home
            </a>
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