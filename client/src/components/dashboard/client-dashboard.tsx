import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { 
  Calendar, Clock, User, Award, Settings, 
  CreditCard, ChevronRight, Star, LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, Grid, Section, Container, ResponsiveText } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import MainLayout from '@/components/layout/main-layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';

// Mock user type - in a real app this would come from your shared schema
interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  profileImage?: string;
  loyaltyPoints: number;
  loyaltyTier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  appointments: Appointment[];
  loyaltyTransactions: LoyaltyTransaction[];
}

interface Appointment {
  id: number;
  serviceName: string;
  servicePrice: number;
  stylistName: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

interface LoyaltyTransaction {
  id: number;
  date: string;
  points: number;
  reason: string;
  reference?: string;
}

// Dashboard wrapper component
export default function ClientDashboard() {
  // In a real implementation, this would fetch the user data from your API
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ['/api/user/profile'],
    // This would normally be handled by the queryClient's default fetcher
    queryFn: async () => {
      // Mock data for layout testing
      return {
        id: 1,
        username: 'janedoe',
        email: 'jane.doe@example.com',
        name: 'Jane Doe',
        loyaltyPoints: 345,
        loyaltyTier: 'Silver',
        appointments: [
          {
            id: 101,
            serviceName: 'Knotless Box Braids',
            servicePrice: 180,
            stylistName: 'Kari Johnson',
            date: '2025-05-20',
            time: '10:00 AM',
            status: 'upcoming'
          },
          {
            id: 102,
            serviceName: 'Goddess Braids',
            servicePrice: 220,
            stylistName: 'Taylor Smith',
            date: '2025-04-05',
            time: '2:30 PM',
            status: 'completed'
          }
        ],
        loyaltyTransactions: [
          {
            id: 201,
            date: '2025-05-01',
            points: 180,
            reason: 'Service Booking',
            reference: '101'
          },
          {
            id: 202,
            date: '2025-04-05',
            points: 220,
            reason: 'Service Booking',
            reference: '102'
          },
          {
            id: 203,
            date: '2025-04-10',
            points: -50,
            reason: 'Reward Redemption',
            reference: 'DISCOUNT10'
          }
        ]
      };
    }
  });
  
  if (isLoading) {
    return (
      <MainLayout>
        <div className="h-[50vh] flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-amber-600 border-t-transparent rounded-full"></div>
        </div>
      </MainLayout>
    );
  }
  
  if (!user) {
    return (
      <MainLayout>
        <div className="h-[50vh] flex flex-col items-center justify-center">
          <ResponsiveText variant="h2" className="text-red-500 mb-4">
            Authentication Required
          </ResponsiveText>
          <ResponsiveText className="text-neutral-600 dark:text-neutral-400 mb-6">
            Please log in to access your dashboard.
          </ResponsiveText>
          <Link href="/auth">
            <Button className="bg-amber-600 hover:bg-amber-700 text-white">
              Log In
            </Button>
          </Link>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <Section className="bg-neutral-100 dark:bg-neutral-900">
        <Container>
          <DashboardContent user={user} />
        </Container>
      </Section>
    </MainLayout>
  );
}

// Main dashboard content
function DashboardContent({ user }: { user: User }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Sidebar - 4/12 on desktop per specs */}
      <div className="lg:col-span-4">
        <DashboardSidebar user={user} />
      </div>
      
      {/* Main Content - 8/12 on desktop per specs */}
      <div className="lg:col-span-8">
        <DashboardMainContent user={user} />
      </div>
    </div>
  );
}

// Dashboard sidebar component
function DashboardSidebar({ user }: { user: User }) {
  return (
    <div className="space-y-[var(--portal-section-gap)]">
      {/* User Profile Card */}
      <Card className="bg-white dark:bg-neutral-800 overflow-hidden">
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 dark:from-amber-600 dark:to-amber-700 h-20"></div>
        <div className="px-[var(--portal-card-padding)] pb-[var(--portal-card-padding)] -mt-10">
          {/* Profile Image */}
          <div className="w-20 h-20 rounded-full border-4 border-white dark:border-neutral-800 overflow-hidden bg-amber-200 dark:bg-amber-800 flex items-center justify-center text-amber-800 dark:text-amber-200 text-2xl font-bold mb-4">
            {user.profileImage ? (
              <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              user.name.charAt(0)
            )}
          </div>
          
          <ResponsiveText variant="h3" className="font-bold mb-1">
            {user.name}
          </ResponsiveText>
          
          <ResponsiveText variant="label" className="text-neutral-500 dark:text-neutral-400 mb-4">
            {user.email}
          </ResponsiveText>
          
          {/* Loyalty Status */}
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <ResponsiveText variant="label" className="font-semibold text-amber-800 dark:text-amber-300">
                Loyalty Status
              </ResponsiveText>
              <div className="flex items-center">
                <Award className="w-4 h-4 text-amber-600 dark:text-amber-400 mr-1" />
                <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                  {user.loyaltyTier}
                </span>
              </div>
            </div>
            
            <div className="mb-2">
              <div className="flex justify-between text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                <span>{user.loyaltyPoints} Points</span>
                <span>1000 Points</span>
              </div>
              <div className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-500 dark:bg-amber-600 rounded-full"
                  style={{ width: `${Math.min(100, (user.loyaltyPoints / 1000) * 100)}%` }}
                ></div>
              </div>
            </div>
            
            <ResponsiveText variant="label" className="text-neutral-600 dark:text-neutral-400">
              {user.loyaltyTier === 'Bronze' ? '655' : user.loyaltyTier === 'Silver' ? '405' : '155'} points until {user.loyaltyTier === 'Bronze' ? 'Silver' : user.loyaltyTier === 'Silver' ? 'Gold' : 'Platinum'}
            </ResponsiveText>
          </div>
          
          {/* Quick Actions */}
          <div className="space-y-2">
            <Link href="/booking">
              <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white justify-between">
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Appointment
                </span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
            
            <Link href="/loyalty/rewards">
              <Button variant="outline" className="w-full justify-between">
                <span className="flex items-center">
                  <Award className="w-4 h-4 mr-2" />
                  Redeem Rewards
                </span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </Card>
      
      {/* Navigation */}
      <Card className="bg-white dark:bg-neutral-800">
        <div className="p-[var(--portal-card-padding)]">
          <ResponsiveText variant="h4" className="font-semibold mb-4">
            Dashboard Navigation
          </ResponsiveText>
          
          <nav className="space-y-1">
            <Link href="/dashboard">
              <a className="flex items-center py-2 px-3 rounded-md bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300">
                <User className="w-5 h-5 mr-3" />
                <span>My Dashboard</span>
              </a>
            </Link>
            
            <Link href="/dashboard/appointments">
              <a className="flex items-center py-2 px-3 rounded-md text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                <Calendar className="w-5 h-5 mr-3" />
                <span>My Appointments</span>
              </a>
            </Link>
            
            <Link href="/dashboard/loyalty">
              <a className="flex items-center py-2 px-3 rounded-md text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                <Award className="w-5 h-5 mr-3" />
                <span>Loyalty & Rewards</span>
              </a>
            </Link>
            
            <Link href="/dashboard/payments">
              <a className="flex items-center py-2 px-3 rounded-md text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                <CreditCard className="w-5 h-5 mr-3" />
                <span>Payment History</span>
              </a>
            </Link>
            
            <Link href="/dashboard/settings">
              <a className="flex items-center py-2 px-3 rounded-md text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                <Settings className="w-5 h-5 mr-3" />
                <span>Account Settings</span>
              </a>
            </Link>
            
            <Link href="/auth/logout">
              <a className="flex items-center py-2 px-3 rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
                <LogOut className="w-5 h-5 mr-3" />
                <span>Logout</span>
              </a>
            </Link>
          </nav>
        </div>
      </Card>
    </div>
  );
}

// Dashboard main content component
function DashboardMainContent({ user }: { user: User }) {
  return (
    <div className="space-y-[var(--portal-section-gap)]">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-amber-600 to-amber-500 dark:from-amber-700 dark:to-amber-600 rounded-[var(--radius-lg-mobile)] sm:rounded-[var(--radius-lg-tablet)] lg:rounded-[var(--radius-lg)] p-6 md:p-8 text-white">
        <ResponsiveText variant="h3" className="font-bold mb-2">
          Welcome back, {user.name.split(' ')[0]}!
        </ResponsiveText>
        <ResponsiveText className="mb-4 opacity-90">
          Manage your appointments, check your loyalty points, and discover new services.
        </ResponsiveText>
        
        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
            <div className="text-amber-200 mb-1">
              <Calendar className="w-5 h-5" />
            </div>
            <ResponsiveText variant="h4" className="font-bold">
              {user.appointments.filter(a => a.status === 'upcoming').length}
            </ResponsiveText>
            <ResponsiveText variant="label" className="opacity-80">
              Upcoming Appointments
            </ResponsiveText>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
            <div className="text-amber-200 mb-1">
              <Award className="w-5 h-5" />
            </div>
            <ResponsiveText variant="h4" className="font-bold">
              {user.loyaltyPoints}
            </ResponsiveText>
            <ResponsiveText variant="label" className="opacity-80">
              Loyalty Points
            </ResponsiveText>
          </div>
          
          <div className="hidden md:block bg-white/10 backdrop-blur-sm p-4 rounded-lg">
            <div className="text-amber-200 mb-1">
              <Star className="w-5 h-5" />
            </div>
            <ResponsiveText variant="h4" className="font-bold">
              {user.loyaltyTier}
            </ResponsiveText>
            <ResponsiveText variant="label" className="opacity-80">
              Loyalty Tier
            </ResponsiveText>
          </div>
        </div>
      </div>
      
      {/* Tabs for main content */}
      <Tabs defaultValue="appointments" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="loyalty">Loyalty History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="appointments" className="space-y-4">
          <Card className="bg-white dark:bg-neutral-800">
            <div className="p-[var(--portal-card-padding)]">
              <div className="flex justify-between items-center mb-6">
                <ResponsiveText variant="h4" className="font-bold">
                  Upcoming Appointments
                </ResponsiveText>
                <Link href="/booking">
                  <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">
                    Book New
                  </Button>
                </Link>
              </div>
              
              {user.appointments.filter(a => a.status === 'upcoming').length > 0 ? (
                <div className="space-y-4">
                  {user.appointments
                    .filter(a => a.status === 'upcoming')
                    .map(appointment => (
                      <div 
                        key={appointment.id} 
                        className="border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden"
                      >
                        <div className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 px-4 py-3 flex justify-between items-center">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400 mr-2" />
                            <ResponsiveText variant="label" className="font-medium">
                              {format(new Date(appointment.date), 'MMMM d, yyyy')} - {appointment.time}
                            </ResponsiveText>
                          </div>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                            Confirmed
                          </span>
                        </div>
                        
                        <div className="p-4">
                          <ResponsiveText variant="h4" className="font-medium mb-1">
                            {appointment.serviceName}
                          </ResponsiveText>
                          <ResponsiveText variant="label" className="text-neutral-500 dark:text-neutral-400 mb-3">
                            With {appointment.stylistName} • ${appointment.servicePrice}
                          </ResponsiveText>
                          
                          <div className="flex mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-700">
                            <Button variant="outline" size="sm" className="mr-2">
                              View Details
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20">
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-10 border-2 border-dashed border-neutral-200 dark:border-neutral-700 rounded-lg">
                  <Calendar className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
                  <ResponsiveText className="text-neutral-500 dark:text-neutral-400 mb-4">
                    You don't have any upcoming appointments.
                  </ResponsiveText>
                  <Link href="/booking">
                    <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                      Book an Appointment
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </Card>
          
          {/* Past Appointments */}
          <Card className="bg-white dark:bg-neutral-800">
            <div className="p-[var(--portal-card-padding)]">
              <ResponsiveText variant="h4" className="font-bold mb-6">
                Past Appointments
              </ResponsiveText>
              
              {user.appointments.filter(a => a.status === 'completed').length > 0 ? (
                <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
                  {user.appointments
                    .filter(a => a.status === 'completed')
                    .map(appointment => (
                      <div 
                        key={appointment.id} 
                        className="py-4 first:pt-0 last:pb-0"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <ResponsiveText variant="h4" className="font-medium">
                            {appointment.serviceName}
                          </ResponsiveText>
                          <span className="text-sm text-neutral-500 dark:text-neutral-400">
                            ${appointment.servicePrice}
                          </span>
                        </div>
                        
                        <div className="flex justify-between">
                          <ResponsiveText variant="label" className="text-neutral-500 dark:text-neutral-400">
                            {format(new Date(appointment.date), 'MMMM d, yyyy')} • {appointment.time}
                          </ResponsiveText>
                          <Button variant="link" size="sm" className="p-0 h-auto text-amber-600 dark:text-amber-400">
                            Book Again
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <ResponsiveText className="text-neutral-500 dark:text-neutral-400">
                    You don't have any past appointments.
                  </ResponsiveText>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="loyalty" className="space-y-4">
          <Card className="bg-white dark:bg-neutral-800">
            <div className="p-[var(--portal-card-padding)]">
              <ResponsiveText variant="h4" className="font-bold mb-6">
                Loyalty Points History
              </ResponsiveText>
              
              <div className="space-y-4">
                {user.loyaltyTransactions.map(transaction => (
                  <div 
                    key={transaction.id} 
                    className="flex justify-between items-center py-3 border-b border-neutral-200 dark:border-neutral-700 last:border-b-0"
                  >
                    <div>
                      <ResponsiveText variant="label" className="font-medium">
                        {transaction.reason}
                      </ResponsiveText>
                      <div className="text-sm text-neutral-500 dark:text-neutral-400">
                        {format(new Date(transaction.date), 'MMMM d, yyyy')}
                      </div>
                    </div>
                    
                    <div className={cn(
                      "font-bold",
                      transaction.points > 0
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    )}>
                      {transaction.points > 0 ? '+' : ''}{transaction.points}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
          
          {/* Tier Benefits */}
          <Card className="bg-white dark:bg-neutral-800">
            <div className="p-[var(--portal-card-padding)]">
              <ResponsiveText variant="h4" className="font-bold mb-6">
                {user.loyaltyTier} Tier Benefits
              </ResponsiveText>
              
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1 w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xs">
                    ✓
                  </div>
                  <span className="ml-3 text-neutral-700 dark:text-neutral-300">
                    {user.loyaltyTier === 'Bronze' ? '1 point' : user.loyaltyTier === 'Silver' ? '1.2 points' : '1.5 points'} per $1 spent
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1 w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xs">
                    ✓
                  </div>
                  <span className="ml-3 text-neutral-700 dark:text-neutral-300">
                    {user.loyaltyTier === 'Bronze' ? 'Birthday' : user.loyaltyTier === 'Silver' ? 'Birthday + Anniversary' : 'Birthday, Anniversary + Seasonal'} bonus points
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1 w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xs">
                    ✓
                  </div>
                  <span className="ml-3 text-neutral-700 dark:text-neutral-300">
                    {user.loyaltyTier === 'Bronze' ? 'Basic' : user.loyaltyTier === 'Silver' ? 'Priority' : 'VIP'} booking privileges
                  </span>
                </li>
                {(user.loyaltyTier === 'Silver' || user.loyaltyTier === 'Gold') && (
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-1 w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xs">
                      ✓
                    </div>
                    <span className="ml-3 text-neutral-700 dark:text-neutral-300">
                      {user.loyaltyTier === 'Silver' ? '10% off products' : '15% off products and services'}
                    </span>
                  </li>
                )}
                {user.loyaltyTier === 'Gold' && (
                  <li className="flex items-start">
                    <div className="flex-shrink-0 mt-1 w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xs">
                      ✓
                    </div>
                    <span className="ml-3 text-neutral-700 dark:text-neutral-300">
                      Complimentary style consultation
                    </span>
                  </li>
                )}
              </ul>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}