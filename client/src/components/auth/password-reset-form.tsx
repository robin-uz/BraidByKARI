import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { auth } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Form schema
const resetPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export function PasswordResetForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  // Form
  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      setIsLoading(true);
      await auth.resetPassword(data.email);
      setIsSuccess(true);
      toast({
        title: "Reset email sent",
        description: "Check your email for a link to reset your password",
      });
    } catch (error: any) {
      toast({
        title: "Failed to send reset email",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl text-center">Check Your Email</CardTitle>
          <CardDescription className="text-center">
            We've sent a password reset link to your email address.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4">
            If you don't see the email in your inbox, check your spam folder or request another reset link.
          </p>
          <Button 
            onClick={() => setIsSuccess(false)} 
            variant="outline"
          >
            Request Another Link
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center">
          <a 
            href="/auth" 
            className="text-sm text-muted-foreground hover:text-primary"
          >
            Return to login
          </a>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-xl text-center">Reset Your Password</CardTitle>
        <CardDescription className="text-center">
          Enter your email address and we'll send you a link to reset your password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
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
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Reset Password"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <a 
          href="/auth" 
          className="text-sm text-muted-foreground hover:text-primary"
        >
          Return to login
        </a>
      </CardFooter>
    </Card>
  );
}