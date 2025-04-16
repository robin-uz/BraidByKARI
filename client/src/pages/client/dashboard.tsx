import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Helmet } from "react-helmet";
import ClientLayout from "@/components/client/client-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  CalendarIcon, 
  ClockIcon, 
  HistoryIcon, 
  UserIcon, 
  CheckCircle2, 
  Clock, 
  Ban, 
  Sparkles, 
  Calendar as CalendarIcon2, 
  ChevronRight,
  Settings,
  CreditCard,
  Brush,
  Image,
  AlertTriangle,
  XCircle
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Booking } from "@shared/schema";
import { getQueryFn } from "@/lib/queryClient";
import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow, format, parseISO, addDays, isAfter } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { motion } from "framer-motion";
import BookingCancellationModal from "@/components/booking/booking-cancellation-modal";

export default function ClientDashboard() {
  const { user } = useAuth();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  
  const { data: userBookings, isLoading } = useQuery<Booking[]>({
    queryKey: ['/api/client/bookings'],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  // Sort bookings by date (newest first)
  const sortedBookings = userBookings
    ? [...userBookings].sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateA.getTime() - dateB.getTime();
      })
    : [];

  // Get upcoming bookings
  const upcomingBookings = sortedBookings.filter(booking => {
    const bookingDate = new Date(`${booking.date}T${booking.time}`);
    return bookingDate >= new Date() && booking.status !== 'cancelled';
  });

  // Get past bookings
  const pastBookings = sortedBookings.filter(booking => {
    const bookingDate = new Date(`${booking.date}T${booking.time}`);
    return bookingDate < new Date() || booking.status === 'cancelled';
  });

  // Format date for display
  const formatBookingDate = (dateStr: string, timeStr: string) => {
    try {
      const date = parseISO(`${dateStr}T${timeStr}`);
      return format(date, "PPP");
    } catch (error) {
      return dateStr;
    }
  };

  // Format time for display
  const formatBookingTime = (timeStr: string) => {
    try {
      const date = parseISO(`2023-01-01T${timeStr}`);
      return format(date, "h:mm a");
    } catch (error) {
      return timeStr;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle2 className="h-4 w-4 mr-1.5 text-green-600 dark:text-green-400" />;
      case 'cancelled':
        return <Ban className="h-4 w-4 mr-1.5 text-red-600 dark:text-red-400" />;
      default:
        return <Clock className="h-4 w-4 mr-1.5 text-amber-600 dark:text-amber-400" />;
    }
  };

  return (
    <>
      <Helmet>
        <title>Client Dashboard | Divine Braids</title>
        <meta name="description" content="Client dashboard for Divine Braids salon" />
      </Helmet>
      <ClientLayout>
        <div className="container py-10">
          <div className="mb-8">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-3xl font-bold text-purple-800 dark:text-purple-300">Welcome back, {user?.fullName || user?.username}</h1>
              <p className="text-neutral-600 dark:text-neutral-400 mt-2">
                Manage your appointments and personal details
              </p>
            </motion.div>
          </div>
          
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-6 bg-neutral-100 dark:bg-neutral-800/60 p-1 rounded-full">
              <TabsTrigger 
                value="overview" 
                className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-fuchsia-600 data-[state=active]:text-white transition-all duration-300"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="bookings" 
                className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-fuchsia-600 data-[state=active]:text-white transition-all duration-300"
              >
                My Bookings
              </TabsTrigger>
              <TabsTrigger 
                value="profile" 
                className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-fuchsia-600 data-[state=active]:text-white transition-all duration-300"
              >
                Profile
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2 overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-fuchsia-50 dark:from-purple-900/20 dark:to-fuchsia-900/20 pb-8">
                    <CardTitle className="text-xl flex items-center text-purple-700 dark:text-purple-300">
                      <CalendarIcon2 className="mr-2 h-5 w-5" />
                      Upcoming Appointments
                    </CardTitle>
                    <CardDescription>
                      Your next scheduled services
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="-mt-6">
                    {isLoading ? (
                      <div className="space-y-3">
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-20 w-full" />
                      </div>
                    ) : upcomingBookings.length === 0 ? (
                      <div className="text-center py-8 px-4">
                        <motion.div 
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          className="flex flex-col items-center"
                        >
                          <Calendar className="h-12 w-12 text-purple-300 dark:text-purple-700 mb-4" />
                          <h3 className="text-lg font-medium mb-2">No upcoming appointments</h3>
                          <p className="text-neutral-500 dark:text-neutral-400 text-sm max-w-xs text-center mb-6">
                            It looks like you don't have any appointments scheduled. Would you like to book a new service?
                          </p>
                          <Link href="/booking">
                            <Button className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700">
                              Book Now
                            </Button>
                          </Link>
                        </motion.div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {upcomingBookings.map((booking, idx) => (
                          <motion.div 
                            key={booking.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: idx * 0.05 }}
                            className="flex items-start space-x-4 p-4 border border-purple-100 dark:border-purple-900/30 rounded-xl bg-white dark:bg-neutral-800 shadow-sm"
                          >
                            <div className="bg-gradient-to-br from-purple-100 to-fuchsia-100 dark:from-purple-900/40 dark:to-fuchsia-900/40 p-3 rounded-xl">
                              <Calendar className="h-6 w-6 text-purple-700 dark:text-purple-300" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="font-semibold text-purple-800 dark:text-purple-300">
                                    {booking.serviceType}
                                  </h3>
                                  <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                                    <CalendarIcon className="mr-1.5 h-3.5 w-3.5" />
                                    {formatBookingDate(booking.date, booking.time)}
                                    <span className="mx-1.5">•</span>
                                    <ClockIcon className="mr-1.5 h-3.5 w-3.5" />
                                    {formatBookingTime(booking.time)}
                                  </div>
                                </div>
                                <div>
                                  <div className="flex items-center">
                                    {getStatusIcon(booking.status)}
                                    <span className="text-sm font-medium">
                                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              {booking.notes && (
                                <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-700">
                                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                    <span className="font-medium">Notes:</span> {booking.notes}
                                  </p>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                  {upcomingBookings.length > 0 && (
                    <CardFooter className="flex justify-center pb-6">
                      <Link href="/booking">
                        <Button variant="outline" className="text-purple-700 border-purple-200 dark:border-purple-800 dark:text-purple-300">
                          Book Another Appointment
                        </Button>
                      </Link>
                    </CardFooter>
                  )}
                </Card>
                
                <div className="space-y-6">
                  <Card>
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg flex items-center text-purple-700 dark:text-purple-300">
                        <UserIcon className="mr-2 h-5 w-5" />
                        Account Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600 flex items-center justify-center text-white font-bold text-lg">
                            {user?.username?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div className="ml-3">
                            <h3 className="font-medium">{user?.fullName || user?.username}</h3>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">{user?.email}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <Link href="/client/profile">
                          <Button variant="outline" className="w-full justify-start border-purple-200 dark:border-purple-800">
                            <Settings className="mr-2 h-4 w-4 text-purple-600 dark:text-purple-400" />
                            Edit Profile
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Quick Links */}
                  <Card>
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg flex items-center text-purple-700 dark:text-purple-300">
                        <Sparkles className="mr-2 h-5 w-5" />
                        Quick Links
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Link href="/gallery">
                        <Button variant="ghost" className="w-full justify-start">
                          <Image className="mr-2 h-4 w-4" />
                          Explore Gallery
                        </Button>
                      </Link>
                      <Link href="/pricing">
                        <Button variant="ghost" className="w-full justify-start">
                          <CreditCard className="mr-2 h-4 w-4" />
                          View Pricing
                        </Button>
                      </Link>
                      <Link href="/client/hair-simulator">
                        <Button variant="ghost" className="w-full justify-start">
                          <Brush className="mr-2 h-4 w-4" />
                          Hair Simulator
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              {/* Recent Activity / Past Bookings */}
              {pastBookings.length > 0 && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center text-purple-700 dark:text-purple-300">
                      <HistoryIcon className="mr-2 h-5 w-5" />
                      Past Appointments
                    </CardTitle>
                    <CardDescription>
                      Your previous bookings and services
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {pastBookings.slice(0, 3).map((booking, idx) => (
                        <motion.div 
                          key={booking.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: idx * 0.05 }}
                          className="flex items-center space-x-4 p-3 border rounded-lg bg-white dark:bg-neutral-800"
                        >
                          <div className="bg-neutral-100 dark:bg-neutral-700 p-2.5 rounded-lg">
                            <HistoryIcon className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{booking.serviceType}</h4>
                            <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                              <CalendarIcon className="mr-1.5 h-3.5 w-3.5" />
                              {formatBookingDate(booking.date, booking.time)}
                            </div>
                          </div>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-center pt-2 pb-6">
                    <Link href="#" onClick={() => {
                        const bookingsTab = document.querySelector('[value="bookings"]') as HTMLElement;
                        if (bookingsTab) bookingsTab.click();
                      }}>
                      <Button 
                        variant="link" 
                        className="text-purple-600 dark:text-purple-400"
                      >
                        View All Bookings
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="bookings">
              <Card>
                <CardHeader>
                  <CardTitle>Booking History</CardTitle>
                  <CardDescription>View all your past and upcoming appointments</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-3">
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-20 w-full" />
                    </div>
                  ) : sortedBookings.length === 0 ? (
                    <div className="text-center py-12">
                      <Calendar className="mx-auto h-12 w-12 text-purple-300 dark:text-purple-700 mb-4" />
                      <h3 className="text-xl font-medium mb-2">No bookings found</h3>
                      <p className="text-neutral-500 dark:text-neutral-400 max-w-md mx-auto mb-6">
                        You haven't made any bookings yet. When you book an appointment with us, it will appear here.
                      </p>
                      <Link href="/booking">
                        <Button className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700">
                          Book Your First Appointment
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div>
                      <div className="space-y-1 mb-6">
                        <h3 className="text-lg font-semibold text-purple-700 dark:text-purple-300">
                          {upcomingBookings.length} Upcoming {upcomingBookings.length === 1 ? 'Appointment' : 'Appointments'}
                        </h3>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          Your scheduled services that are coming up
                        </p>
                      </div>
                      
                      <div className="space-y-4 mb-8">
                        {upcomingBookings.length > 0 ? (
                          upcomingBookings.map((booking, idx) => (
                            <motion.div 
                              key={booking.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2, delay: idx * 0.05 }}
                              className="border border-purple-100 dark:border-purple-900/30 rounded-xl overflow-hidden bg-white dark:bg-neutral-800 shadow-sm"
                            >
                              <div className="p-4 md:p-5">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                  <div>
                                    <div className="flex items-center">
                                      {getStatusIcon(booking.status)}
                                      <Badge className={getStatusColor(booking.status)}>
                                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                      </Badge>
                                    </div>
                                    <h3 className="font-semibold text-lg mt-2">{booking.serviceType}</h3>
                                    <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2">
                                      <div className="flex items-center text-sm text-neutral-600 dark:text-neutral-400">
                                        <CalendarIcon className="mr-1.5 h-4 w-4 text-purple-500 dark:text-purple-400" />
                                        {formatBookingDate(booking.date, booking.time)}
                                      </div>
                                      <div className="flex items-center text-sm text-neutral-600 dark:text-neutral-400">
                                        <ClockIcon className="mr-1.5 h-4 w-4 text-purple-500 dark:text-purple-400" />
                                        {formatBookingTime(booking.time)}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 px-4">
                                    <div className="text-sm text-purple-700 dark:text-purple-300 font-medium mb-1">
                                      Booked For
                                    </div>
                                    <div className="text-neutral-700 dark:text-neutral-300">
                                      {booking.name}
                                    </div>
                                    <div className="text-sm text-neutral-500 dark:text-neutral-400">
                                      {booking.email}
                                    </div>
                                  </div>
                                </div>
                                
                                {booking.notes && (
                                  <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-700">
                                    <div className="text-sm text-neutral-700 dark:text-neutral-300">
                                      <span className="font-medium text-purple-700 dark:text-purple-300">Notes:</span> {booking.notes}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          ))
                        ) : (
                          <div className="text-center py-6 bg-neutral-50 dark:bg-neutral-900/50 border border-dashed rounded-lg">
                            <p className="text-neutral-500 dark:text-neutral-400">No upcoming appointments</p>
                          </div>
                        )}
                      </div>
                      
                      {pastBookings.length > 0 && (
                        <div>
                          <div className="space-y-1 mb-6">
                            <h3 className="text-lg font-semibold text-purple-700 dark:text-purple-300">
                              Past Appointments
                            </h3>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">
                              Your previous services and bookings
                            </p>
                          </div>
                          
                          <div className="space-y-4">
                            {pastBookings.map((booking, idx) => (
                              <motion.div 
                                key={booking.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2, delay: idx * 0.05 }}
                                className="border rounded-lg p-4 bg-white dark:bg-neutral-800"
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h3 className="font-medium">{booking.serviceType}</h3>
                                    <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                                      <CalendarIcon className="mr-1.5 h-3.5 w-3.5" />
                                      {formatBookingDate(booking.date, booking.time)}
                                      <span className="mx-1.5">•</span>
                                      <ClockIcon className="mr-1.5 h-3.5 w-3.5" />
                                      {formatBookingTime(booking.time)}
                                    </div>
                                  </div>
                                  <Badge className={getStatusColor(booking.status)}>
                                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                  </Badge>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-center pt-2 pb-6">
                  <Link href="/booking">
                    <Button className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700">
                      Book New Appointment
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>View and update your account details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 max-w-2xl">
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-5 mb-6">
                    <div className="flex items-center">
                      <div className="h-16 w-16 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600 flex items-center justify-center text-white font-bold text-2xl mr-4">
                        {user?.username?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-purple-800 dark:text-purple-300">
                          {user?.fullName || user?.username}
                        </h3>
                        <p className="text-neutral-600 dark:text-neutral-400">
                          Member since April 2025
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Username</label>
                      <Input
                        type="text" 
                        value={user?.username} 
                        disabled 
                        className="bg-neutral-50 dark:bg-neutral-800"
                      />
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">Username cannot be changed</p>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      <Input
                        type="email" 
                        value={user?.email} 
                        disabled 
                        className="bg-neutral-50 dark:bg-neutral-800"
                      />
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">Contact support to change your email</p>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Full Name</label>
                      <Input
                        type="text" 
                        defaultValue={user?.fullName || ''} 
                        placeholder="Enter your full name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Phone Number (Optional)</label>
                      <Input
                        type="tel" 
                        placeholder="Enter your phone number" 
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-2 pb-6 border-t">
                  <Button 
                    variant="outline" 
                    className="text-red-500 border-red-200 hover:border-red-300 dark:border-red-800 dark:hover:border-red-700"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                  <Button className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700">
                    Update Profile
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </ClientLayout>
      
      {/* Cancellation Modal */}
      <BookingCancellationModal
        booking={selectedBooking}
        isOpen={isCancelModalOpen}
        onClose={() => {
          setIsCancelModalOpen(false);
          setSelectedBooking(null);
        }}
      />
    </>
  );
}