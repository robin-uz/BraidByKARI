import { Route, Redirect } from "wouter";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { getUser } from "./supabase-client";
import { supabase } from "./supabase-client";

type SupabaseProtectedRouteProps = {
  path: string;
  component: React.ComponentType;
  adminOnly?: boolean;
};

export function SupabaseProtectedRoute({ path, component: Component, adminOnly = false }: SupabaseProtectedRouteProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const user = await getUser();
        setIsAuthenticated(!!user);
        
        if (user) {
          setUserId(user.id);
          
          // Check if admin by querying the users table
          if (adminOnly) {
            const { data, error } = await supabase
              .from('users')
              .select('role')
              .eq('auth_id', user.id)
              .single();
            
            if (error) {
              console.error('Error fetching user role:', error);
              setIsAdmin(false);
            } else {
              setIsAdmin(data?.role === 'admin');
            }
          }
        }
      } catch (error) {
        setIsAuthenticated(false);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, [adminOnly]);

  return (
    <Route path={path}>
      {() => {
        if (isLoading) {
          return (
            <div className="flex items-center justify-center min-h-screen">
              <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
              <span className="ml-2">Verifying authentication...</span>
            </div>
          );
        }

        if (!isAuthenticated) {
          return <Redirect to="/auth" />;
        }

        if (adminOnly && !isAdmin) {
          return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
              <h1 className="text-2xl font-bold text-amber-600 mb-2">Access Denied</h1>
              <p className="text-center mb-4">You don't have admin permission to access this page.</p>
              <a 
                href="/client/dashboard"
                className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
              >
                Go to Dashboard
              </a>
            </div>
          );
        }

        return <Component />;
      }}
    </Route>
  );
}