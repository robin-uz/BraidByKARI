import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';

// Define the User type based on our schema
type User = {
  id: number;
  username: string;
  email: string;
  role: string;
  createdAt: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: Error | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const ServerAuthContext = createContext<AuthContextType | undefined>(undefined);

export function ServerAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  // Check if the user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const response = await apiRequest('GET', '/api/user');
        
        // If the response is OK, the user is authenticated
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          console.log("Authenticated user:", userData);
        } else {
          // If 401, clear user data
          if (response.status === 401) {
            setUser(null);
          } else {
            throw new Error(`Error fetching user: ${response.statusText}`);
          }
        }
      } catch (err) {
        console.error("Auth check error:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (username: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Attempting login with:", { username });
      
      const response = await apiRequest('POST', '/api/login', { username, password });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Login failed" }));
        console.error("Login API error:", response.status, errorData);
        throw new Error(errorData.message || `Login failed: ${response.statusText}`);
      }
      
      const userData = await response.json();
      console.log("Login successful:", userData);
      
      setUser(userData);
      toast({
        title: "Logged in successfully",
        description: `Welcome back, ${userData.username || userData.email}!`,
      });
      
      // Invalidate any relevant queries
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      
      return userData;
    } catch (err) {
      console.error("Login error:", err);
      const message = err instanceof Error ? err.message : String(err);
      setError(err instanceof Error ? err : new Error(message));
      toast({
        title: "Login failed",
        description: message,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (username: string, email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Attempting registration with:", { username, email });
      
      const response = await apiRequest('POST', '/api/register', { 
        username, 
        email, 
        password 
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Registration failed: ${response.statusText}`);
      }
      
      const userData = await response.json();
      console.log("Registration successful:", userData);
      
      setUser(userData);
      toast({
        title: "Registration successful",
        description: `Welcome to Divine Braids, ${userData.username || userData.email}!`,
      });
      
      // Invalidate any relevant queries
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      
    } catch (err) {
      console.error("Registration error:", err);
      const message = err instanceof Error ? err.message : String(err);
      setError(err instanceof Error ? err : new Error(message));
      toast({
        title: "Registration failed",
        description: message,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiRequest('POST', '/api/logout');
      
      if (!response.ok) {
        throw new Error(`Logout failed: ${response.statusText}`);
      }
      
      setUser(null);
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
      
      // Clear any cached user data
      queryClient.setQueryData(['/api/user'], null);
      
    } catch (err) {
      console.error("Logout error:", err);
      const message = err instanceof Error ? err.message : String(err);
      setError(err instanceof Error ? err : new Error(message));
      toast({
        title: "Logout failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
  };

  return <ServerAuthContext.Provider value={value}>{children}</ServerAuthContext.Provider>;
}

export function useServerAuth() {
  const context = useContext(ServerAuthContext);
  if (context === undefined) {
    throw new Error('useServerAuth must be used within a ServerAuthProvider');
  }
  return context;
}