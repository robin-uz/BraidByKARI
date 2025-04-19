import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import { updateUser, supabase } from '@/lib/supabase-client';

// New password schema
const passwordSchema = z.object({
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, navigate] = useLocation();
  const { toast } = useToast();

  // Password form
  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  // Check if the user has a valid reset token 
  useEffect(() => {
    const checkResetToken = async () => {
      try {
        // Get the hash from the URL (contains the access token)
        const hash = window.location.hash;
        if (!hash) {
          // No access token in URL, show error and redirect to login after a delay
          setError('No reset token found. Please request a new password reset link.');
          setTimeout(() => {
            navigate('/auth/supabase');
          }, 3000);
          return;
        }

        // Try to get the current session to verify the token
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setError('Invalid or expired token. Please request a new password reset link.');
          setTimeout(() => {
            navigate('/auth/supabase');
          }, 3000);
        }
      } catch (err: any) {
        console.error('Error checking reset token:', err);
        setError(err.message || 'An error occurred. Please try again.');
      }
    };

    checkResetToken();
  }, [navigate]);

  const onResetPassword = async (values: z.infer<typeof passwordSchema>) => {
    setLoading(true);
    setError(null);
    
    try {
      await updateUser({ password: values.password });
      toast({
        title: "Password updated",
        description: "Your password has been successfully updated. You can now login with your new password.",
      });
      
      // Redirect to login page after successful password reset
      setTimeout(() => {
        navigate('/auth/supabase');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to update password');
      toast({
        variant: "destructive",
        title: "Password update failed",
        description: err.message || 'An error occurred while updating your password',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-bold">KARI STYLEZ</CardTitle>
          <CardDescription className="text-center">
            Reset Your Password
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(onResetPassword)} className="space-y-4">
                <FormField
                  control={passwordForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={passwordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
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
                    "Update Password"
                  )}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button 
            variant="link" 
            onClick={() => navigate('/auth/supabase')}
            className="text-sm"
          >
            Back to Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}