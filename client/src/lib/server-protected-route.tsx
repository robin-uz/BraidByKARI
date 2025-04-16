import { Route, useLocation } from 'wouter';
import { useServerAuth } from '@/contexts/DebugAuthContext';
import { Loader2 } from 'lucide-react';

type ServerProtectedRouteProps = {
  path: string;
  component: () => JSX.Element;
  adminOnly?: boolean;
};

export function ServerProtectedRoute({ path, component: Component, adminOnly = false }: ServerProtectedRouteProps) {
  const { user, loading } = useServerAuth();
  const [location] = useLocation();

  return (
    <Route path={path}>
      {() => {
        if (loading) {
          // Show loading state while checking authentication
          return (
            <div className="flex items-center justify-center min-h-screen">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          );
        }

        // If not authenticated, redirect to login page
        if (!user) {
          window.location.href = `/auth?redirect=${encodeURIComponent(location)}`;
          return null;
        }

        // If adminOnly is true, check if user has admin role
        if (adminOnly && user.role !== 'admin') {
          return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
              <h1 className="text-2xl font-bold text-destructive mb-2">Access Denied</h1>
              <p className="text-center mb-4">You don't have permission to access this page.</p>
              <a 
                href="/"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Return to Home
              </a>
            </div>
          );
        }

        // If authenticated, render the protected content
        return <Component />;
      }}
    </Route>
  );
}