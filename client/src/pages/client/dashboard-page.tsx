import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useContext } from 'react';
import { ServerAuthContext } from '@/contexts/DebugAuthContext';
import { useToast } from '@/hooks/use-toast';
import { Link, useLocation } from 'wouter';
import {
  CalendarDays,
  Clock,
  User,
  Phone,
  Mail,
  LogOut,
  Scissors,
  Home,
  Clipboard,
  CreditCard,
  X,
  ChevronRight,
  Calendar,
  AlarmClock,
  Info,
  Loader2
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from '@/components/ui/badge';
import { Booking } from '@shared/schema';

export default function ClientDashboardPage() {
  // Access auth context directly
  const authContext = useContext(ServerAuthContext);
  const user = authContext?.user || null;
  const loading = authContext?.loading || false;
  const login = authContext?.login;
  const logout = authContext?.logout;
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [cancelId, setCancelId] = useState<number | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/auth?redirect=/client/dashboard');
    }
  }, [user, navigate]);

  // Fetch user's bookings
  const {
    data: bookings = [],
    isLoading: bookingsLoading,
    error: bookingsError
  } = useQuery<Booking[]>({
    queryKey: ['/api/client/bookings'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/client/bookings');
      return res.json();
    },
    enabled: !!user,
  });

  // Cancel booking mutation
  const cancelBookingMutation = useMutation({
    mutationFn: async (bookingId: number) => {
      const res = await apiRequest('POST', `/api/client/bookings/${bookingId}/cancel`);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Booking Cancelled",
        description: "Your appointment has been successfully cancelled.",
      });
      // Refetch bookings
      queryClient.invalidateQueries({ queryKey: ['/api/client/bookings'] });
      setCancelDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Cancellation Failed",
        description: error.message || "Failed to cancel booking. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Handle cancel booking
  const handleCancelBooking = (id: number) => {
    setCancelId(id);
    setCancelDialogOpen(true);
  };

  const confirmCancelBooking = () => {
    if (cancelId !== null) {
      cancelBookingMutation.mutate(cancelId);
    }
  };

  const handleLogout = async () => {
    try {
      if (logout) {
        await logout();
        navigate('/');
      } else {
        toast({
          title: "Logout Failed",
          description: "Unable to access logout function",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Logout failed:', error);
      toast({
        title: "Logout Failed",
        description: "There was an error during logout",
        variant: "destructive"
      });
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please log in to view your dashboard</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/auth?redirect=/client/dashboard">Log In</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Filter bookings for different tabs
  const upcomingBookings = bookings.filter(b => 
    new Date(`${b.date}T${b.time}`) > new Date() && 
    b.status !== 'cancelled'
  );
  
  const pastBookings = bookings.filter(b => 
    new Date(`${b.date}T${b.time}`) <= new Date() || 
    b.status === 'cancelled'
  );

  return (
    <>
      <Helmet>
        <title>Client Dashboard | KARI STYLEZ</title>
        <meta name="description" content="Manage your appointments, view booking history, and update your profile at KARI STYLEZ." />
      </Helmet>

      <section className="py-12 md:py-20 bg-gradient-to-b from-amber-50/50 to-white dark:from-amber-950/20 dark:to-black">
        <div className="container px-4 mx-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2 text-amber-800 dark:text-amber-300">
                Hello, {(user as any).fullName || user.username}
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400">
                Welcome to your personal dashboard at KARI STYLEZ
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" asChild>
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </Link>
              </Button>
              <Button variant="ghost" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log Out
              </Button>
            </div>
          </div>

          {/* Dashboard Tabs */}
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid grid-cols-3 w-full max-w-md mb-4">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>

            {/* Upcoming Appointments Tab */}
            <TabsContent value="upcoming" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookingsLoading ? (
                  <div className="col-span-full flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
                  </div>
                ) : upcomingBookings.length > 0 ? (
                  upcomingBookings.map((booking) => (
                    <Card key={booking.id} className="overflow-hidden border-amber-200 dark:border-amber-900">
                      <div className={`h-2 ${booking.status === 'confirmed' ? 'bg-green-500' : 'bg-amber-500'}`} />
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg font-heading">{booking.serviceType}</CardTitle>
                          <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'} 
                                 className={booking.status === 'confirmed' ? 'bg-green-500 hover:bg-green-600' : ''}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </Badge>
                        </div>
                        <CardDescription className="flex gap-2 items-center mt-1">
                          <CalendarDays className="h-4 w-4 text-amber-600" />
                          {new Date(booking.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                          })}
                          <span className="mx-1">•</span>
                          <Clock className="h-4 w-4 text-amber-600" />
                          {booking.time}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <div className="text-sm space-y-1 text-neutral-700 dark:text-neutral-300">
                          <p className="flex items-center gap-2">
                            <Scissors className="h-4 w-4 text-amber-600" />
                            {booking.serviceType}
                          </p>
                          {booking.notes && (
                            <p className="flex items-start gap-2 mt-2">
                              <Info className="h-4 w-4 text-amber-600 mt-0.5" />
                              <span className="flex-1 italic text-neutral-600 dark:text-neutral-400">
                                "{booking.notes}"
                              </span>
                            </p>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <div className="w-full flex justify-between items-center">
                          <Badge variant={booking.depositPaid ? "secondary" : "outline"} className="rounded-sm">
                            {booking.depositPaid ? "Deposit Paid" : "Deposit Due"}
                          </Badge>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleCancelBooking(booking.id)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full">
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertTitle>No Upcoming Appointments</AlertTitle>
                      <AlertDescription>
                        You don't have any upcoming appointments scheduled.
                        <Button asChild variant="link" className="px-0 text-amber-600 dark:text-amber-400">
                          <Link href="/booking-page">
                            Book an appointment
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Link>
                        </Button>
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
              </div>
              
              <div className="flex justify-center mt-8">
                <Button asChild variant="default" className="bg-amber-600 hover:bg-amber-700">
                  <Link href="/booking-page">
                    <Calendar className="mr-2 h-4 w-4" />
                    Book New Appointment
                  </Link>
                </Button>
              </div>
            </TabsContent>

            {/* Booking History Tab */}
            <TabsContent value="history" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookingsLoading ? (
                  <div className="col-span-full flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
                  </div>
                ) : pastBookings.length > 0 ? (
                  pastBookings.map((booking) => (
                    <Card key={booking.id} className={`overflow-hidden ${
                      booking.status === 'cancelled' ? 'border-red-200 dark:border-red-900/50 opacity-75' : 'border-neutral-200 dark:border-neutral-800'
                    }`}>
                      <div className={`h-2 ${
                        booking.status === 'cancelled' ? 'bg-red-500' : 'bg-neutral-500'
                      }`} />
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg font-heading">{booking.serviceType}</CardTitle>
                          <Badge variant={
                            booking.status === 'cancelled' ? 'destructive' : 'secondary'
                          }>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </Badge>
                        </div>
                        <CardDescription className="flex gap-2 items-center mt-1">
                          <CalendarDays className="h-4 w-4 text-amber-600" />
                          {new Date(booking.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                          })}
                          <span className="mx-1">•</span>
                          <Clock className="h-4 w-4 text-amber-600" />
                          {booking.time}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <div className="text-sm space-y-1 text-neutral-700 dark:text-neutral-300">
                          <p className="flex items-center gap-2">
                            <Scissors className="h-4 w-4 text-amber-600" />
                            {booking.serviceType}
                          </p>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <div className="w-full flex justify-end">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            asChild
                          >
                            <Link href="/booking-page">
                              Book Again
                            </Link>
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full">
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertTitle>No Booking History</AlertTitle>
                      <AlertDescription>
                        You don't have any past appointments.
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>Your account details at KARI STYLEZ</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p className="text-sm text-neutral-500 dark:text-neutral-400 flex items-center">
                            <User className="h-4 w-4 mr-2 text-amber-600" />
                            Username
                          </p>
                          <p className="font-medium">{user.username}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-neutral-500 dark:text-neutral-400 flex items-center">
                            <Mail className="h-4 w-4 mr-2 text-amber-600" />
                            Email
                          </p>
                          <p className="font-medium">{user.email}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-neutral-500 dark:text-neutral-400 flex items-center">
                            <User className="h-4 w-4 mr-2 text-amber-600" />
                            Full Name
                          </p>
                          <p className="font-medium">{(user as any).fullName || 'Not provided'}</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full md:w-auto">
                        Update Profile
                      </Button>
                    </CardFooter>
                  </Card>
                </div>

                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Links</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button variant="outline" asChild className="w-full justify-start">
                        <Link href="/booking-page">
                          <AlarmClock className="mr-2 h-4 w-4 text-amber-600" />
                          Book Appointment
                        </Link>
                      </Button>
                      <Button variant="outline" asChild className="w-full justify-start">
                        <Link href="/pricing-page">
                          <CreditCard className="mr-2 h-4 w-4 text-amber-600" />
                          View Services
                        </Link>
                      </Button>
                      <Button variant="outline" asChild className="w-full justify-start">
                        <Link href="/contact-page">
                          <Phone className="mr-2 h-4 w-4 text-amber-600" />
                          Contact Us
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <div className="md:col-span-3">
                  <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/50">
                    <CardHeader>
                      <CardTitle>Member Benefits</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-white dark:bg-black/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800/50">
                          <h3 className="font-medium text-lg mb-2 text-amber-800 dark:text-amber-300">Exclusive Discounts</h3>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            Regular clients receive special pricing and priority booking options.
                          </p>
                        </div>
                        <div className="bg-white dark:bg-black/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800/50">
                          <h3 className="font-medium text-lg mb-2 text-amber-800 dark:text-amber-300">Birthday Treats</h3>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            Special offers during your birthday month as our thank you.
                          </p>
                        </div>
                        <div className="bg-white dark:bg-black/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800/50">
                          <h3 className="font-medium text-lg mb-2 text-amber-800 dark:text-amber-300">Early Access</h3>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            Be the first to know about new styles, products, and special events.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Cancellation Confirmation Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Appointment</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this appointment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
              Keep Appointment
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmCancelBooking}
              disabled={cancelBookingMutation.isPending}
            >
              {cancelBookingMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Confirm Cancellation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}