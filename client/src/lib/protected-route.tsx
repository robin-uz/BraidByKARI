import { Route, useLocation } from 'wouter';
import { Loader2 } from 'lucide-react';
import { useContext } from 'react';
import { ServerAuthContext } from '@/contexts/DebugAuthContext';

type ProtectedRouteProps = {
  path: string;
  component: () => JSX.Element;
  adminOnly?: boolean;
};

export function ProtectedRoute({ path, component: Component, adminOnly = false }: ProtectedRouteProps) {
  const authContext = useContext(ServerAuthContext);
  const user = authContext?.user || null;
  const loading = authContext?.loading || false;
  const [location] = useLocation();

  return (
    <Route path={path}>
      {() => {
        if (loading) {
          // Show loading state while checking authentication
          return (
            <div className="flex items-center justify-center min-h-screen">
              <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
            </div>
          );
        }

        // If not authenticated, redirect to login page
        if (!user) {
          const currentPath = location || path;
          window.location.href = `/auth?redirect=${encodeURIComponent(currentPath)}`;
          return (
            <div className="flex items-center justify-center min-h-screen">
              <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
              <span className="ml-2">Redirecting to login...</span>
            </div>
          );
        }

        // If adminOnly is true, check if user has admin role
        if (adminOnly && user.role !== 'admin') {
          return (
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
          );
        }

        // If authenticated, render the protected content
        return <Component />;
      }}
    </Route>
  );
}