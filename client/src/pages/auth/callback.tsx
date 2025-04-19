import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { supabase } from '@/lib/supabase-client';
import { Loader2 } from 'lucide-react';

export default function AuthCallback() {
  const [, navigate] = useLocation();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get the hash from the URL
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    const refreshToken = hashParams.get('refresh_token');

    const handleCallback = async () => {
      try {
        // Process the callback URL that Supabase Auth redirected to
        const { error } = await supabase.auth.initialize();
        
        if (error) {
          throw error;
        }

        // If we have an access token in the URL, try to exchange it
        if (accessToken && refreshToken) {
          await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
        }

        // Get the current session to verify it worked
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          navigate('/client/supabase-dashboard');
        } else {
          navigate('/auth/supabase');
        }
      } catch (err: any) {
        console.error('Error processing auth callback:', err.message);
        setError(err.message);
        setTimeout(() => {
          navigate('/auth/supabase');
        }, 3000);
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {error ? (
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
          <p className="mb-4">{error}</p>
          <p>Redirecting to login page...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 animate-spin text-amber-600 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Authenticating</h1>
          <p>Please wait while we complete your sign-in process...</p>
        </div>
      )}
    </div>
  );
}