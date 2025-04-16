import { useState, useEffect } from 'react';
import { useLocation, useSearch } from 'wouter';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';

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
import { useToast } from '@/hooks/use-toast';

// Login form schema
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

// Registration form schema
const registerSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const redirect = params.get('redirect') || '/';

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
      email: '',
      password: '',
    },
  });

  // Registration form
  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onLoginSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      await signIn(data.email, data.password);
      // Redirect is handled by the useEffect
    } catch (error) {
      // Error is handled in the auth context
    } finally {
      setIsLoading(false);
    }
  };

  const onRegisterSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      await signUp(data.email, data.password);
      toast({
        title: "Registration successful",
        description: "Please check your email to verify your account",
      });
      
      // Switch to login if signup is successful but requires email verification
      setIsLogin(true);
    } catch (error) {
      // Error is handled in the auth context
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Auth Form Column */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Divine Braids</CardTitle>
            <CardDescription className="text-center">
              {isLogin ? "Sign in to your account" : "Create a new account"}
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
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
                      {isLoading ? "Signing in..." : "Sign in"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
              
              <TabsContent value="register">
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
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
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
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
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating account..." : "Create account"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-center text-sm text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </CardFooter>
        </Card>
      </div>
      
      {/* Hero Section Column */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-r from-purple-700 to-pink-600 items-center justify-center">
        <div className="max-w-md text-white p-8">
          <h2 className="text-3xl font-bold mb-4">Artistry in Every Braid</h2>
          <p className="mb-6">
            Welcome to Divine Braids, your premium destination for exquisite, 
            professional hair braiding services. Create an account to book appointments, 
            view your history, and unlock exclusive offers.
          </p>
          <ul className="space-y-2">
            <li className="flex items-center">
              <span className="mr-2">✓</span> Easy appointment booking
            </li>
            <li className="flex items-center">
              <span className="mr-2">✓</span> Personalized style recommendations
            </li>
            <li className="flex items-center">
              <span className="mr-2">✓</span> Access to exclusive promotions
            </li>
            <li className="flex items-center">
              <span className="mr-2">✓</span> Hair color and style simulator
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}