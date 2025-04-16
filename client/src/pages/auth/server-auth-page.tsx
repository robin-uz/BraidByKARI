import { useState, useEffect, useContext } from 'react';
import { useLocation, useSearch } from 'wouter';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ServerAuthContext } from '@/contexts/DebugAuthContext';
import { Helmet } from 'react-helmet';
import { Eye, EyeOff } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Login form schema
const loginSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

// Registration form schema
const registerSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

export default function ServerAuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Access auth context directly
  const authContext = useContext(ServerAuthContext);
  const user = authContext?.user || null;
  const login = authContext?.login || (() => Promise.reject(new Error('Auth not initialized')));
  const register = authContext?.register || (() => Promise.reject(new Error('Auth not initialized')));
  const [, navigate] = useLocation();
  const search = useSearch();
  const params = new URLSearchParams(search);
  // Change default redirect to dashboard for logged in users
  const redirect = params.get('redirect') || '/client/dashboard';

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate(redirect);
    }
  }, [user, navigate, redirect]);

  // Login form
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  // Registration form
  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onLoginSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Submitting login data:', { username: data.username });
      
      // Direct fetch approach for better debugging
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: data.username, 
          password: data.password 
        }),
        credentials: 'include'
      });
      
      console.log('Login response status:', response.status);
      
      // Get raw response text
      const responseText = await response.text();
      console.log('Login response text:', responseText);
      
      // If not OK, show the error
      if (!response.ok) {
        let errorMessage = 'Login failed';
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // Response wasn't JSON, use text as error
          errorMessage = responseText || `Error ${response.status}: ${response.statusText}`;
        }
        
        setError(errorMessage);
        return;
      }
      
      // If successful, try to parse the user data
      try {
        const userData = JSON.parse(responseText);
        console.log('Login successful:', userData);
        
        // Force reload the page to ensure proper session state
        window.location.href = redirect;
      } catch (e) {
        console.error('Error parsing user data:', e);
        setError('Login was successful but there was an error loading your profile');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      if (error instanceof Error) {
        setError(error.message);
      } else if (typeof error === 'string') {
        setError(error);
      } else {
        setError('An unknown error occurred during login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onRegisterSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      await register(data.username, data.email, data.password);
      // Redirect is handled by the useEffect
    } catch (error) {
      console.error('Registration error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{isLogin ? 'Login' : 'Sign Up'} | KARI STYLEZ</title>
      </Helmet>
      <div className="flex min-h-screen">
        {/* Auth Form Column */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-2xl text-center font-heading">KARI STYLEZ</CardTitle>
              <CardDescription className="text-center">
                {isLogin ? "Sign in to your account" : "Create a new account"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <Tabs defaultValue="login" onValueChange={(value) => setIsLogin(value === 'login')}>
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input placeholder="your_username" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <div className="password-input-wrapper">
                              <FormControl>
                                <Input 
                                  type={showLoginPassword ? "text" : "password"} 
                                  placeholder="••••••••" 
                                  {...field} 
                                />
                              </FormControl>
                              <div 
                                className="password-toggle-icon" 
                                onClick={() => setShowLoginPassword(!showLoginPassword)}
                                aria-label={showLoginPassword ? "Hide password" : "Show password"}
                              >
                                {showLoginPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4 eye-blink" />
                                )}
                              </div>
                            </div>
                            <FormMessage />
                            <div className="text-right">
                              <a 
                                href="/auth/forgot-password" 
                                className="text-xs text-primary hover:underline"
                              >
                                Forgot password?
                              </a>
                            </div>
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <span className="flex items-center">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Signing in...
                          </span>
                        ) : (
                          "Sign in"
                        )}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
                
                <TabsContent value="register">
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                      <FormField
                        control={registerForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input placeholder="your_username" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="your.email@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <div className="password-input-wrapper">
                              <FormControl>
                                <Input 
                                  type={showRegisterPassword ? "text" : "password"} 
                                  placeholder="••••••••" 
                                  {...field} 
                                />
                              </FormControl>
                              <div 
                                className="password-toggle-icon" 
                                onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                                aria-label={showRegisterPassword ? "Hide password" : "Show password"}
                              >
                                {showRegisterPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4 eye-blink" />
                                )}
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <div className="password-input-wrapper">
                              <FormControl>
                                <Input 
                                  type={showConfirmPassword ? "text" : "password"} 
                                  placeholder="••••••••" 
                                  {...field} 
                                />
                              </FormControl>
                              <div 
                                className="password-toggle-icon" 
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                              >
                                {showConfirmPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4 eye-blink" />
                                )}
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <span className="flex items-center">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating account...
                          </span>
                        ) : (
                          "Create account"
                        )}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <p className="text-sm text-muted-foreground text-center">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
              
              {/* Demo credentials for testing */}
              {process.env.NODE_ENV !== 'production' && (
                <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-md text-xs">
                  <p className="font-medium mb-1">🔑 Demo Credentials:</p>
                  <div className="grid grid-cols-2 gap-x-2">
                    <p><span className="font-semibold">Username:</span> customer</p>
                    <p><span className="font-semibold">Password:</span> customer123</p>
                  </div>
                </div>
              )}
              
              {/* Debug info */}
              {process.env.NODE_ENV !== 'production' && (
                <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-md text-xs">
                  <p className="font-mono">Auth Status: {user ? 'Authenticated' : 'Not authenticated'}</p>
                  {user && (
                    <pre className="mt-2 overflow-auto max-h-20">
                      {JSON.stringify(user, null, 2)}
                    </pre>
                  )}
                  {error && (
                    <div className="mt-2 text-red-500">
                      <p className="font-bold">Error:</p>
                      <p>{error}</p>
                    </div>
                  )}
                </div>
              )}
            </CardFooter>
          </Card>
        </div>
        
        {/* Hero Section Column */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-r from-amber-700 to-amber-600 items-center justify-center">
          <div className="max-w-md text-white p-8">
            <h2 className="text-4xl font-heading font-bold mb-4">Where Style Meets Artistry</h2>
            <div className="h-1 w-24 bg-amber-300 rounded mb-6"></div>
            <p className="mb-6">
              Welcome to KARI STYLEZ, your premium destination for exquisite, 
              professional hair braiding and styling. Create an account to book appointments, 
              track your favorite styles, and unlock exclusive offers.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center">
                <span className="mr-2 text-amber-300">✓</span> Easy online appointment booking
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-amber-300">✓</span> Personalized style consultations
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-amber-300">✓</span> Access to exclusive member promotions
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-amber-300">✓</span> Style inspiration and tips
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}