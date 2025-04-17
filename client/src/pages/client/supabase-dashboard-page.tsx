import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, User, Calendar, History, Settings, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function SupabaseDashboardPage() {
  const { user, loading, signOut } = useSupabaseAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  
  // Redirect is handled by the protected route component
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
      </div>
    );
  }
  
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      toast({
        title: 'Sign out failed',
        description: 'There was an error signing out.',
        variant: 'destructive',
      });
    }
  };
  
  return (
    <>
      <Helmet>
        <title>Client Dashboard | KARI STYLEZ</title>
      </Helmet>
      
      <div className="container max-w-7xl py-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Supabase Client Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {user?.user_metadata?.full_name || user?.email}
            </p>
          </div>
          
          <Button 
            variant="outline" 
            className="mt-4 md:mt-0 flex items-center"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Navigation</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <nav className="flex flex-col">
                <button 
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center px-4 py-3 hover:bg-accent transition-colors ${activeTab === 'profile' ? 'bg-muted font-medium' : ''}`}
                >
                  <User className="w-4 h-4 mr-3" />
                  Profile
                </button>
                <button 
                  onClick={() => setActiveTab('appointments')}
                  className={`flex items-center px-4 py-3 hover:bg-accent transition-colors ${activeTab === 'appointments' ? 'bg-muted font-medium' : ''}`}
                >
                  <Calendar className="w-4 h-4 mr-3" />
                  Appointments
                </button>
                <button 
                  onClick={() => setActiveTab('history')}
                  className={`flex items-center px-4 py-3 hover:bg-accent transition-colors ${activeTab === 'history' ? 'bg-muted font-medium' : ''}`}
                >
                  <History className="w-4 h-4 mr-3" />
                  History
                </button>
                <button 
                  onClick={() => setActiveTab('settings')}
                  className={`flex items-center px-4 py-3 hover:bg-accent transition-colors ${activeTab === 'settings' ? 'bg-muted font-medium' : ''}`}
                >
                  <Settings className="w-4 h-4 mr-3" />
                  Settings
                </button>
              </nav>
            </CardContent>
          </Card>
          
          {/* Main Content */}
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>
                {activeTab === 'profile' && 'Your Profile'}
                {activeTab === 'appointments' && 'Your Appointments'}
                {activeTab === 'history' && 'Appointment History'}
                {activeTab === 'settings' && 'Account Settings'}
              </CardTitle>
              <CardDescription>
                {activeTab === 'profile' && 'Manage your personal information'}
                {activeTab === 'appointments' && 'View and manage your upcoming appointments'}
                {activeTab === 'history' && 'Review your past appointments'}
                {activeTab === 'settings' && 'Configure your account preferences'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Account Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p>{user?.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Role</p>
                        <p className="capitalize">{user?.user_metadata?.role || 'Customer'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Full Name</p>
                        <p>{user?.user_metadata?.full_name || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">User ID</p>
                        <p className="text-xs font-mono">{user?.id}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-4">Profile Details</h3>
                    <p className="text-muted-foreground">This is where we would display and edit profile details like phone number, address, preferences, etc.</p>
                    <p className="mt-2 text-sm text-muted-foreground">This is just a demonstration of the Supabase authentication. The full profile management would be implemented in the final version.</p>
                  </div>
                </div>
              )}
              
              {activeTab === 'appointments' && (
                <div className="min-h-[300px] flex items-center justify-center">
                  <div className="text-center">
                    <Calendar className="w-12 h-12 mx-auto text-amber-600 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Upcoming Appointments</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      You don't have any upcoming appointments scheduled. Would you like to book a new appointment?
                    </p>
                    <Button className="mt-4">Book Appointment</Button>
                  </div>
                </div>
              )}
              
              {activeTab === 'history' && (
                <div className="min-h-[300px] flex items-center justify-center">
                  <div className="text-center">
                    <History className="w-12 h-12 mx-auto text-amber-600 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Appointment History</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      You haven't had any appointments with us yet. Your appointment history will appear here after your first visit.
                    </p>
                  </div>
                </div>
              )}
              
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-4">Notification Preferences</h3>
                    <p className="text-muted-foreground">This is where notification settings would be configured (email, SMS, etc.)</p>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-4">Account Security</h3>
                    <p className="text-muted-foreground mb-4">Update your password or manage connected accounts</p>
                    <Button variant="outline">Change Password</Button>
                  </div>
                  
                  <div className="border rounded-lg p-4 border-red-200">
                    <h3 className="font-medium mb-4 text-red-600">Danger Zone</h3>
                    <p className="text-muted-foreground mb-4">Permanently delete your account and all your data</p>
                    <Button variant="destructive">Delete Account</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}