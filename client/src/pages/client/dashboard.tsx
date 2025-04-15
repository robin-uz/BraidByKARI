import { useAuth } from "@/hooks/use-auth";
import { Helmet } from "react-helmet";
import ClientLayout from "@/components/client/client-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, CalendarIcon, ClockIcon, HistoryIcon, UserIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Booking } from "@shared/schema";
import { getQueryFn } from "@/lib/queryClient";
import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function ClientDashboard() {
  const { user } = useAuth();
  const { data: userBookings, isLoading } = useQuery<Booking[]>({
    queryKey: ['/api/client/bookings'],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
    }
  };

  return (
    <>
      <Helmet>
        <title>Client Dashboard | Braided Beauty</title>
      </Helmet>
      <ClientLayout>
        <div className="container py-10">
          <h1 className="text-3xl font-semibold mb-6">Welcome, {user?.fullName || user?.username}</h1>
          
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <CalendarIcon className="mr-2 h-5 w-5" />
                      Upcoming Appointments
                    </CardTitle>
                    <CardDescription>Your next scheduled services</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="space-y-2">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                      </div>
                    ) : !userBookings?.filter(b => b.status === 'confirmed').length ? (
                      <p className="text-muted-foreground py-2">No upcoming appointments</p>
                    ) : (
                      <div className="space-y-3">
                        {userBookings
                          ?.filter(booking => booking.status === 'confirmed')
                          .map(booking => (
                            <div key={booking.id} className="flex items-start space-x-3 p-3 border rounded-md">
                              <div className="bg-primary/10 p-2 rounded-full">
                                <Calendar className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">{booking.serviceType}</p>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <ClockIcon className="mr-1 h-3 w-3" />
                                  {booking.date} at {booking.time}
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <UserIcon className="mr-2 h-5 w-5" />
                      Account Information
                    </CardTitle>
                    <CardDescription>Your personal details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <span className="text-sm font-medium block">Username</span>
                      <span className="text-muted-foreground">{user?.username}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium block">Email</span>
                      <span className="text-muted-foreground">{user?.email}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium block">Full Name</span>
                      <span className="text-muted-foreground">{user?.fullName || 'Not provided'}</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <HistoryIcon className="mr-2 h-5 w-5" />
                      Recent Activity
                    </CardTitle>
                    <CardDescription>Your recent bookings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="space-y-2">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    ) : !userBookings?.length ? (
                      <p className="text-muted-foreground py-2">No booking history</p>
                    ) : (
                      <div className="space-y-2">
                        {userBookings?.slice(0, 3).map(booking => (
                          <div key={booking.id} className="text-sm">
                            <p className="font-medium">{booking.serviceType}</p>
                            <p className="text-muted-foreground text-xs">{booking.createdAt ? formatDistanceToNow(new Date(booking.createdAt), { addSuffix: true }) : 'Recently'}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
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
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                    </div>
                  ) : !userBookings?.length ? (
                    <div className="text-center py-6">
                      <Calendar className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                      <h3 className="mt-4 text-lg font-medium">No bookings yet</h3>
                      <p className="mt-2 text-muted-foreground">
                        When you book an appointment, it will appear here.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userBookings?.map(booking => (
                        <div key={booking.id} className="border rounded-md p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium">{booking.serviceType}</h3>
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">Date: </span>
                              {booking.date}
                            </div>
                            <div>
                              <span className="text-muted-foreground">Time: </span>
                              {booking.time}
                            </div>
                            <div>
                              <span className="text-muted-foreground">Name: </span>
                              {booking.name}
                            </div>
                            <div>
                              <span className="text-muted-foreground">Email: </span>
                              {booking.email}
                            </div>
                          </div>
                          {booking.notes && (
                            <>
                              <Separator className="my-2" />
                              <div className="text-sm">
                                <span className="text-muted-foreground">Notes: </span>
                                {booking.notes}
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>View and update your account details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Username</label>
                    <input 
                      type="text" 
                      className="w-full p-2 rounded-md border" 
                      value={user?.username} 
                      disabled 
                    />
                    <p className="text-xs text-muted-foreground">Username cannot be changed</p>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Email</label>
                    <input 
                      type="email" 
                      className="w-full p-2 rounded-md border" 
                      value={user?.email} 
                      disabled 
                    />
                    <p className="text-xs text-muted-foreground">Contact support to change your email</p>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Full Name</label>
                    <input 
                      type="text" 
                      className="w-full p-2 rounded-md border" 
                      defaultValue={user?.fullName || ''} 
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
                    Update Profile
                  </button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </ClientLayout>
    </>
  );
}