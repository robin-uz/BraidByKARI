import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Loader2 } from 'lucide-react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link } from 'wouter';
import { supabase } from "@/lib/supabase-client";

export default function AdminSetup() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Get the current user's session
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      // Make request to the admin setup endpoint
      const response = await fetch('/api/admin/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          supabaseToken: token
        })
      });
      
      // Check if content type is JSON
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        const result = await response.json();
        
        if (response.ok) {
          setSuccess(true);
          toast({
            title: "Success!",
            description: result.message || "Admin account set up successfully",
          });
        } else {
          setError(result.message || "Failed to set up admin account");
          toast({
            variant: "destructive",
            title: "Error",
            description: result.message || "Failed to set up admin account",
          });
        }
      } else {
        // Handle non-JSON response
        const textResponse = await response.text();
        console.error("Non-JSON response:", textResponse);
        setError("Server returned an invalid response format. Check console for details.");
        toast({
          variant: "destructive",
          title: "Error",
          description: "Server returned an invalid response format",
        });
      }
    } catch (err: any) {
      console.error("Admin setup error:", err);
      setError(err.message || "An error occurred");
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "An unexpected error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-amber-600 mb-2">KARI STYLEZ</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">Admin Account Setup</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Admin Setup</CardTitle>
            <CardDescription>
              {success 
                ? "Admin account has been successfully set up!" 
                : "Create or promote a user to admin role"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success ? (
              <div className="text-center py-4">
                <div className="rounded-full bg-green-100 p-3 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">Setup Complete!</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  The account with email <strong>{email}</strong> now has admin privileges.
                </p>
                <div className="space-y-2">
                  <Link href="/admin/dashboard">
                    <Button className="w-full">Go to Admin Dashboard</Button>
                  </Link>
                  <Link href="/">
                    <Button variant="outline" className="w-full">Back to Home</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@karistylez.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Enter the email of the user you want to make an admin. If the user doesn't exist,
                    a new user with admin privileges will be created.
                  </p>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Set Up Admin'
                  )}
                </Button>
              </form>
            )}
          </CardContent>

          {!success && (
            <CardFooter>
              <Link href="/" className="w-full">
                <Button variant="outline" className="w-full">Cancel</Button>
              </Link>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}