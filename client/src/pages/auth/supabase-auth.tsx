import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { signIn, signUp, resetPassword } from '@/lib/supabase-client';
import { useLocation } from 'wouter';

// Login form schema
const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
});

// Registration form schema
const registerSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// Reset password schema
const resetSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
});

export default function SupabaseAuthPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('login');
  const [location, navigate] = useLocation();
  const { toast } = useToast();

  // Login form
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Register form
  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  // Reset password form
  const resetForm = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: '',
    },
  });

  const onLogin = async (values: z.infer<typeof loginSchema>) => {
    setLoading(true);
    setAuthError(null);
    
    try {
      await signIn(values.email, values.password);
      toast({
        title: "Welcome back!",
        description: "You've successfully signed in.",
      });
      
      // Navigate to dashboard after successful login
      navigate('/client/dashboard');
    } catch (error: any) {
      setAuthError(error.message || 'Failed to sign in');
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || 'An error occurred during sign in',
      });
    } finally {
      setLoading(false);
    }
  };

  const onRegister = async (values: z.infer<typeof registerSchema>) => {
    setLoading(true);
    setAuthError(null);
    
    try {
      await signUp(values.email, values.password);
      toast({
        title: "Account created",
        description: "Please check your email to confirm your registration.",
      });
      
      // Switch to login tab after successful registration
      setActiveTab('login');
    } catch (error: any) {
      setAuthError(error.message || 'Failed to create account');
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message || 'An error occurred during registration',
      });
    } finally {
      setLoading(false);
    }
  };

  const onReset = async (values: z.infer<typeof resetSchema>) => {
    setLoading(true);
    setAuthError(null);
    
    try {
      await resetPassword(values.email);
      toast({
        title: "Password reset email sent",
        description: "Please check your email for the password reset link.",
      });
      
      // Switch to login tab after successful password reset request
      setActiveTab('login');
    } catch (error: any) {
      setAuthError(error.message || 'Failed to send password reset email');
      toast({
        variant: "destructive",
        title: "Password reset failed",
        description: error.message || 'An error occurred while sending the password reset email',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Form Column */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center font-bold">KARI STYLEZ</CardTitle>
            <CardDescription className="text-center">
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              
              {authError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{authError}</AlertDescription>
                </Alert>
              )}
              
              <TabsContent value="login">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="email@example.com" {...field} />
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
                            <div className="relative">
                              <Input 
                                type={showPassword ? "text" : "password"} 
                                placeholder="••••••••" 
                                {...field} 
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="button" 
                      variant="link" 
                      className="p-0 h-auto font-normal text-sm text-muted-foreground hover:text-primary"
                      onClick={() => setActiveTab('reset')}
                    >
                      Forgot password?
                    </Button>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Please wait
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
              
              <TabsContent value="register">
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="email@example.com" {...field} />
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
                            <div className="relative">
                              <Input 
                                type={showPassword ? "text" : "password"} 
                                placeholder="••••••••" 
                                {...field} 
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                              </Button>
                            </div>
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
                            <Input 
                              type={showPassword ? "text" : "password"} 
                              placeholder="••••••••" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Please wait
                        </>
                      ) : (
                        "Sign Up"
                      )}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
              
              <TabsContent value="reset">
                <Form {...resetForm}>
                  <form onSubmit={resetForm.handleSubmit(onReset)} className="space-y-4">
                    <FormField
                      control={resetForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="email@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Please wait
                        </>
                      ) : (
                        "Send Reset Link"
                      )}
                    </Button>
                    <Button 
                      type="button" 
                      variant="link" 
                      className="p-0 h-auto font-normal text-sm text-muted-foreground hover:text-primary w-full justify-center"
                      onClick={() => setActiveTab('login')}
                    >
                      Back to Login
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <div className="text-center text-sm text-muted-foreground">
              By continuing, you agree to KARI STYLEZ's
              <a href="/legal/terms" className="font-medium text-primary hover:underline ml-1">Terms of Service</a>
              <span className="mx-1">and</span>
              <a href="/legal/privacy-policy" className="font-medium text-primary hover:underline">Privacy Policy</a>.
            </div>
          </CardFooter>
        </Card>
      </div>
      
      {/* Hero Column */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-b from-[#F6B856] to-amber-800 items-center justify-center">
        <div className="max-w-md text-white p-8">
          <h2 className="text-4xl font-bold mb-6">Welcome to KARI STYLEZ</h2>
          <p className="text-lg mb-6">
            Experience the best in hair braiding and styling. Create an account to book appointments, 
            manage your profile, and keep track of your favorite styles.
          </p>
          <div className="bg-white/10 p-4 rounded-lg">
            <p>
              "KARI STYLEZ provides exceptional braiding services with attention to detail and 
              customer satisfaction. Join our community of satisfied clients today!"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}