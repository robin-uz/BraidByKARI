import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase, signOut } from '@/lib/supabase-client';
import { Loader2, User, Calendar, Clock, History, LogOut } from 'lucide-react';

export default function SupabaseDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const { toast } = useToast();
  const [, navigate] = useLocation();
  
  useEffect(() => {
    async function getProfile() {
      try {
        setLoading(true);
        
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          navigate('/auth/supabase');
          return;
        }
        
        setUser(user);
      } catch (error: any) {
        console.error('Error fetching user profile:', error.message);
        toast({
          variant: "destructive",
          title: "Error loading profile",
          description: error.message,
        });
      } finally {
        setLoading(false);
      }
    }
    
    getProfile();
  }, [navigate, toast]);
  
  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out",
      });
      navigate('/auth/supabase');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Sign out failed",
        description: error.message,
      });
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
        <span className="ml-2">Loading dashboard...</span>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Supabase Client Dashboard</h1>
      
      {/* User profile summary */}
      <Card className="mb-8">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Welcome, {user?.email}</CardTitle>
          <CardDescription>
            Manage your appointments and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-medium mb-2 flex items-center">
                <User className="mr-2 h-5 w-5 text-amber-600" />
                Your Profile
              </h3>
              <p className="text-muted-foreground">
                Email: {user?.email}
              </p>
              <p className="text-muted-foreground">
                Account created: {new Date(user?.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium mb-2 flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-amber-600" />
                Quick Actions
              </h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  Book New Appointment
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <User className="mr-2 h-4 w-4" />
                  Update Profile
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="secondary" onClick={handleSignOut} className="w-full sm:w-auto">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </CardFooter>
      </Card>
      
      {/* Appointments */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Your Appointments</h2>
        <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upcoming Appointments</CardTitle>
                <CardDescription>Your scheduled appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">You don't have any upcoming appointments</p>
                  <Button variant="outline" className="mt-4">
                    Book an Appointment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="past">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Past Appointments</CardTitle>
                <CardDescription>Your appointment history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <History className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">You don't have any past appointments</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="cancelled">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Cancelled Appointments</CardTitle>
                <CardDescription>Appointments you've cancelled</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground">You don't have any cancelled appointments</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Favorites and recent styles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Favorite Styles</CardTitle>
            <CardDescription>Styles you've saved for inspiration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground">You haven't saved any favorite styles yet</p>
              <Button variant="outline" className="mt-4">
                Browse Styles
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Styles</CardTitle>
            <CardDescription>Styles you've recently had done</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground">You don't have any recent styles</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}