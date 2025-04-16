import { useEffect, useState } from 'react';
import { useServerAuth } from '@/contexts/DebugAuthContext';
import { ProfileForm } from '@/components/profile/profile-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, KeyRound, User, ShieldAlert } from 'lucide-react';
// Temporarily comment out until we implement this component
// import { PasswordChangeForm } from '@/components/profile/password-change-form';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';

export default function ProfilePage() {
  const { user, loading } = useServerAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const { toast } = useToast();
  
  useEffect(() => {
    // If user is not authenticated and not loading, redirect to login
    if (!user && !loading) {
      window.location.href = '/auth';
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="container max-w-6xl py-10 flex items-center justify-center min-h-[80vh]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Return an empty div instead of null to satisfy the component type
    return <div className="hidden"></div>; // This will be handled by the useEffect redirect
  }

  // Extract user profile data
  const userProfile = {
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email || '',
    phoneNumber: user.phoneNumber || '',
    avatarUrl: user.avatarUrl || '',
  };

  // For demonstrating LastLogin component (temporary)
  const lastLogin = new Date().toLocaleString();

  return (
    <div className="container max-w-6xl py-8 md:py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-8 lg:space-y-0">
        <aside className="lg:w-1/4">
          <Tabs 
            defaultValue={activeTab} 
            orientation="vertical" 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 lg:flex lg:flex-col h-full">
              <TabsTrigger value="profile" className="flex justify-start lg:justify-start">
                <User className="h-4 w-4 mr-2" />
                <span className="lg:block">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex justify-start lg:justify-start">
                <KeyRound className="h-4 w-4 mr-2" />
                <span className="lg:block">Security</span>
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex justify-start lg:justify-start">
                <ShieldAlert className="h-4 w-4 mr-2" />
                <span className="lg:block">Privacy</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Last Login Card */}
          <Card className="mt-6 hidden lg:block">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Account Info</CardTitle>
            </CardHeader>
            <CardContent className="pb-3 pt-1 text-xs">
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last login</span>
                  <span>{lastLogin}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Account type</span>
                  <span className="capitalize">{user.role || 'client'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">User ID</span>
                  <span className="truncate max-w-[120px]" title={String(user.id)}>
                    {String(user.id).substring(0, 8)}...
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>

        <div className="flex-1 lg:max-w-3xl">
          <TabsContent value="profile" className="mt-0">
            <ProfileForm initialData={userProfile} />
          </TabsContent>

          <TabsContent value="security" className="mt-0">
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-2xl">Security Settings</CardTitle>
                <CardDescription>Manage your password and authentication settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Change Password</h3>
                  {/* Temporarily using a button instead of the form component */}
                  <Button
                    onClick={() => {
                      toast({
                        title: "Coming Soon!",
                        description: "Password change functionality will be available in a future update.",
                      });
                    }}
                  >
                    Change Password
                  </Button>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account by enabling two-factor authentication
                  </p>
                  <Button
                    onClick={() => {
                      toast({
                        title: "Coming Soon!",
                        description: "Two-factor authentication will be available in a future update.",
                      });
                    }}
                  >
                    Enable 2FA
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="mt-0">
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-2xl">Privacy Settings</CardTitle>
                <CardDescription>Manage how we handle your data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Data Management</h3>
                  <p className="text-sm text-muted-foreground">
                    You can request a copy of your data or delete your account and all associated data
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button variant="outline"
                      onClick={() => {
                        toast({
                          title: "Coming Soon!",
                          description: "Data export will be available in a future update.",
                        });
                      }}
                    >
                      Export My Data
                    </Button>
                    <Button variant="destructive"
                      onClick={() => {
                        toast({
                          title: "Coming Soon!",
                          description: "Account deletion will be available in a future update.",
                          variant: "destructive",
                        });
                      }}
                    >
                      Delete My Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </div>
    </div>
  );
}