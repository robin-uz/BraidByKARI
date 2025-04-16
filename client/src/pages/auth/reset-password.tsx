import { NewPasswordForm } from '@/components/auth/new-password-form';
import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { auth } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export default function ResetPasswordPage() {
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [location] = useLocation();
  const { toast } = useToast();
  
  useEffect(() => {
    const verifyToken = async () => {
      try {
        // Check if we have a hash from Supabase auth
        const hash = window.location.hash;
        
        if (!hash) {
          setIsValidToken(false);
          setIsLoading(false);
          return;
        }
        
        // Verification is automatic, just check if we have a valid session
        const session = await auth.getSession();
        setIsValidToken(!!session);
      } catch (error) {
        console.error('Error verifying token:', error);
        setIsValidToken(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    verifyToken();
  }, []);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }
  
  if (isValidToken === false) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg max-w-md text-center">
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">Invalid or Expired Link</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            The password reset link you used is invalid or has expired. Please request a new password reset link.
          </p>
          <a 
            href="/auth/forgot-password" 
            className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Request New Link
          </a>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen">
      {/* Reset Password Form Column */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8">
        <NewPasswordForm />
      </div>
      
      {/* Hero Section Column */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-r from-purple-700 to-pink-600 items-center justify-center">
        <div className="max-w-md text-white p-8">
          <h2 className="text-3xl font-bold mb-4">Create a New Password</h2>
          <p className="mb-6">
            Your account security is important to us. Please create a strong, 
            unique password that you don't use for other services.
          </p>
          <div className="bg-white/10 p-4 rounded-lg">
            <p className="text-sm">
              A strong password helps protect your account. Make sure 
              your new password includes uppercase and lowercase letters,
              numbers, and is at least 8 characters long.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}