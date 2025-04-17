import { Helmet } from 'react-helmet';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestPage() {
  return (
    <>
      <Helmet>
        <title>Test Page | KARI STYLEZ</title>
      </Helmet>
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold text-amber-800 dark:text-amber-300 mb-6">Test Page</h1>
        <p className="text-lg mb-8">This is a simple test page to verify routing is working.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Page Information</CardTitle>
              <CardDescription>Basic information about this page</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-2"><strong>Current Time:</strong> {new Date().toLocaleTimeString()}</p>
              <p className="mb-2"><strong>Current Date:</strong> {new Date().toLocaleDateString()}</p>
              <p><strong>Environment:</strong> {import.meta.env.MODE}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Navigation Test</CardTitle>
              <CardDescription>Test links to other pages</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Button asChild className="w-full">
                  <Link href="/">Home</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/auth">Login</Link>
                </Button>
                <Button asChild variant="secondary" className="w-full">
                  <Link href="/client/dashboard">Dashboard</Link>
                </Button>
                <Button asChild variant="destructive" className="w-full">
                  <Link href="/booking">Book Now</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="bg-amber-100 dark:bg-amber-900/30 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Authentication Status</h2>
          <p className="mb-4">This section shows whether you're currently authenticated.</p>
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={() => {
                fetch('/api/user')
                  .then(res => res.json())
                  .then(data => {
                    alert(JSON.stringify(data, null, 2));
                  })
                  .catch(err => {
                    alert("Error fetching user: " + err.message);
                  });
              }}
            >
              Check Auth Status
            </Button>
            
            <Button
              variant="outline"
              onClick={() => {
                fetch('/api/logout', { method: 'POST' })
                  .then(() => {
                    alert("Logged out successfully");
                    window.location.reload();
                  })
                  .catch(err => {
                    alert("Error logging out: " + err.message);
                  });
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}