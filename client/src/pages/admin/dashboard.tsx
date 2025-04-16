import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Loader2, 
  Calendar, 
  Users, 
  Image, 
  MessageSquare,
  ChevronRight,
  Check,
  Clock,
  Ban,
  BarChart3
} from "lucide-react";
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { useAuth } from "@/hooks/use-auth";
import AdminLayout from "@/components/admin/admin-layout";

export default function AdminDashboard() {
  const { user } = useAuth();
  
  // Query bookings
  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ["/api/bookings"],
  });
  
  // Query testimonials
  const { data: testimonials, isLoading: testimonialsLoading } = useQuery({
    queryKey: ["/api/testimonials"],
  });
  
  // Query gallery
  const { data: gallery, isLoading: galleryLoading } = useQuery({
    queryKey: ["/api/gallery"],
  });
  
  // Query services
  const { data: services, isLoading: servicesLoading } = useQuery({
    queryKey: ["/api/services"],
  });
  
  const isLoading = bookingsLoading || testimonialsLoading || galleryLoading || servicesLoading;
  
  // Stats calculation
  const stats = {
    totalBookings: bookings?.length || 0,
    pendingBookings: bookings?.filter(b => b.status === "pending").length || 0,
    confirmedBookings: bookings?.filter(b => b.status === "confirmed").length || 0,
    cancelledBookings: bookings?.filter(b => b.status === "cancelled").length || 0,
    totalGalleryItems: gallery?.length || 0,
    totalTestimonials: testimonials?.length || 0,
    totalServices: services?.length || 0
  };
  
  // Mock chart data (based on bookings)
  const getBookingsChartData = () => {
    const today = new Date();
    const lastMonth = new Date(today);
    lastMonth.setMonth(today.getMonth() - 1);
    
    // Create dates for the last 30 days
    const dates = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(lastMonth);
      date.setDate(lastMonth.getDate() + i);
      return date.toISOString().split('T')[0];
    });
    
    // Map bookings to dates
    return dates.map(date => {
      const count = bookings?.filter(booking => booking.date === date).length || 0;
      return {
        date: date,
        bookings: count
      };
    });
  };
  
  // Service popularity data
  const getServicePopularityData = () => {
    if (!bookings || !bookings.length) return [];
    
    const serviceCounts = {};
    bookings.forEach(booking => {
      serviceCounts[booking.serviceType] = (serviceCounts[booking.serviceType] || 0) + 1;
    });
    
    return Object.entries(serviceCounts).map(([name, count]) => ({
      name,
      value: count
    }));
  };
  
  // Status distribution data
  const getStatusDistributionData = () => {
    return [
      { name: 'Pending', value: stats.pendingBookings },
      { name: 'Confirmed', value: stats.confirmedBookings },
      { name: 'Cancelled', value: stats.cancelledBookings }
    ];
  };
  
  const COLORS = ['#D4AF37', '#8884d8', '#FF8042'];
  
  // Recent bookings
  const recentBookings = bookings ? 
    [...bookings].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ).slice(0, 5) : 
    [];
  
  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <AdminLayout>
      <Helmet>
        <title>Admin Dashboard | Divine Braids</title>
        <meta name="description" content="Admin dashboard for Divine Braids salon management" />
      </Helmet>
      
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold font-heading">Admin Dashboard</h1>
          <div className="text-sm">
            Welcome, <span className="font-medium">{user?.fullName || user?.username}</span>
          </div>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBookings}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.pendingBookings} pending
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Services</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalServices}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Available styling options
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Gallery</CardTitle>
              <Image className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalGalleryItems}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Images displaying our work
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Testimonials</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTestimonials}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Client reviews and feedback
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Charts and Data Visualization */}
        <Tabs defaultValue="bookings" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="status">Status Distribution</TabsTrigger>
          </TabsList>
          
          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Bookings Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={getBookingsChartData()}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#D4AF37" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-neutral-200 dark:stroke-neutral-700" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(date) => {
                          const d = new Date(date);
                          return `${d.getDate()}/${d.getMonth() + 1}`;
                        }}
                        className="text-xs"
                      />
                      <YAxis className="text-xs" />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="bookings" 
                        stroke="#D4AF37" 
                        fillOpacity={1} 
                        fill="url(#colorBookings)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="services">
            <Card>
              <CardHeader>
                <CardTitle>Service Popularity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={getServicePopularityData()}
                      margin={{ top: 10, right: 30, left: 20, bottom: 70 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-neutral-200 dark:stroke-neutral-700" />
                      <XAxis 
                        dataKey="name" 
                        angle={-45} 
                        textAnchor="end" 
                        height={70} 
                        className="text-xs"
                      />
                      <YAxis className="text-xs" />
                      <Tooltip />
                      <Bar dataKey="value" fill="#D4AF37" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="status">
            <Card>
              <CardHeader>
                <CardTitle>Booking Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getStatusDistributionData()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {getStatusDistributionData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Recent Bookings */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold font-heading">Recent Bookings</h2>
            <Link href="/admin/bookings">
              <Button variant="outline" size="sm" className="text-sm">
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="py-3 px-4 text-left text-sm font-medium">Client</th>
                      <th className="py-3 px-4 text-left text-sm font-medium">Service</th>
                      <th className="py-3 px-4 text-left text-sm font-medium">Date & Time</th>
                      <th className="py-3 px-4 text-left text-sm font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.length > 0 ? (
                      recentBookings.map((booking) => (
                        <tr key={booking.id} className="border-b last:border-0 hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
                          <td className="py-3 px-4">
                            <div>
                              <div className="font-medium">{booking.name}</div>
                              <div className="text-sm text-neutral-500">{booking.email}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4">{booking.serviceType}</td>
                          <td className="py-3 px-4">
                            <div>
                              <div>{booking.date}</div>
                              <div className="text-sm text-neutral-500">{booking.time}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              booking.status === 'confirmed' 
                                ? 'bg-green-100 dark:bg-green-800/20 text-green-700 dark:text-green-500' 
                                : booking.status === 'pending'
                                ? 'bg-yellow-100 dark:bg-yellow-800/20 text-yellow-700 dark:text-yellow-500'
                                : 'bg-red-100 dark:bg-red-800/20 text-red-700 dark:text-red-500'
                            }`}>
                              {booking.status === 'confirmed' ? (
                                <Check className="h-3 w-3 mr-1" />
                              ) : booking.status === 'pending' ? (
                                <Clock className="h-3 w-3 mr-1" />
                              ) : (
                                <Ban className="h-3 w-3 mr-1" />
                              )}
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-6 text-center text-neutral-500">
                          No bookings found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold font-heading">Quick Actions</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <Link href="/admin/bookings">
              <Button variant="outline" className="w-full justify-start h-auto py-4">
                <div className="flex flex-col items-start">
                  <span className="text-primary text-lg mb-1">
                    <Calendar className="h-5 w-5" />
                  </span>
                  <span className="font-medium">Manage Bookings</span>
                  <span className="text-sm text-neutral-500 mt-1">Review and update appointment status</span>
                </div>
              </Button>
            </Link>
            
            <Link href="/admin/analytics">
              <Button variant="outline" className="w-full justify-start h-auto py-4">
                <div className="flex flex-col items-start">
                  <span className="text-primary text-lg mb-1">
                    <BarChart3 className="h-5 w-5" />
                  </span>
                  <span className="font-medium">Business Analytics</span>
                  <span className="text-sm text-neutral-500 mt-1">View detailed performance metrics</span>
                </div>
              </Button>
            </Link>
            
            <Link href="/admin/gallery">
              <Button variant="outline" className="w-full justify-start h-auto py-4">
                <div className="flex flex-col items-start">
                  <span className="text-primary text-lg mb-1">
                    <Image className="h-5 w-5" />
                  </span>
                  <span className="font-medium">Update Gallery</span>
                  <span className="text-sm text-neutral-500 mt-1">Add or edit gallery images</span>
                </div>
              </Button>
            </Link>
            
            <Link href="/admin/services">
              <Button variant="outline" className="w-full justify-start h-auto py-4">
                <div className="flex flex-col items-start">
                  <span className="text-primary text-lg mb-1">
                    <Users className="h-5 w-5" />
                  </span>
                  <span className="font-medium">Manage Services</span>
                  <span className="text-sm text-neutral-500 mt-1">Update service offerings and pricing</span>
                </div>
              </Button>
            </Link>
            
            <Link href="/admin/testimonials">
              <Button variant="outline" className="w-full justify-start h-auto py-4">
                <div className="flex flex-col items-start">
                  <span className="text-primary text-lg mb-1">
                    <MessageSquare className="h-5 w-5" />
                  </span>
                  <span className="font-medium">Testimonials</span>
                  <span className="text-sm text-neutral-500 mt-1">Manage client reviews</span>
                </div>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
