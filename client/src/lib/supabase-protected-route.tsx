import { Route, Redirect } from "wouter";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { getUser } from "./supabase-client";

type SupabaseProtectedRouteProps = {
  path: string;
  component: React.ComponentType;
};

export function SupabaseProtectedRoute({ path, component: Component }: SupabaseProtectedRouteProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const user = await getUser();
        setIsAuthenticated(!!user);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, []);

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

        return isAuthenticated ? <Component /> : <Redirect to="/auth/supabase" />;
      }}
    </Route>
  );
}