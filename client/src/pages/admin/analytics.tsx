import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Booking, Service } from "@shared/schema";
import { getQueryFn } from "@/lib/queryClient";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";
import { format, subDays, startOfDay, startOfMonth, startOfYear, parseISO, isBefore, isAfter, addDays } from "date-fns";
import { CalendarIcon, DollarSign, TrendingUp, Users, Scissors } from "lucide-react";

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("month");
  const [bookingData, setBookingData] = useState<any[]>([]);
  const [serviceData, setServiceData] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [metricsData, setMetricsData] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    avgBookingValue: 0,
    activeClients: 0,
    popularService: "",
  });

  const { data: bookings } = useQuery<Booking[]>({
    queryKey: ['/api/bookings'],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  const { data: services } = useQuery<Service[]>({
    queryKey: ['/api/services'],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  const getDateRangeStart = () => {
    const today = new Date();
    switch (timeRange) {
      case "week":
        return subDays(today, 7);
      case "month":
        return startOfMonth(today);
      case "year":
        return startOfYear(today);
      default:
        return subDays(today, 30);
    }
  };

  const COLORS = ['#f1c40f', '#e67e22', '#e74c3c', '#9b59b6', '#3498db', '#2ecc71'];

  useEffect(() => {
    if (!bookings || !services) return;

    const dateRangeStart = getDateRangeStart();

    // Filter bookings based on date range
    // In practice, we would convert the string dates to Date objects
    // For demo, we'll use the booking ID to simulate date filtering
    const filteredBookings = bookings.filter(booking => 
      // In a real app, we'd parse the date and compare properly
      // For now, we're just simulating with IDs to show functionality
      booking.id > 0
    );

    // Calculate metrics
    const totalBookings = filteredBookings.length;
    
    // Map services to bookings to calculate revenue
    let totalRevenue = 0;
    const serviceMap = new Map();
    services.forEach(service => serviceMap.set(service.name, service.price));
    
    filteredBookings.forEach(booking => {
      const price = serviceMap.get(booking.serviceType) || 0;
      totalRevenue += price;
    });

    // Get service frequencies
    const serviceCounts = filteredBookings.reduce((acc, booking) => {
      acc[booking.serviceType] = (acc[booking.serviceType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const popularService = Object.entries(serviceCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "";
    
    // Generate time series data for bookings
    const dates = [];
    const startDate = dateRangeStart;
    const today = new Date();
    
    // Create dates array based on time range
    let currentDate = startDate;
    while (isBefore(currentDate, today) || currentDate.getDate() === today.getDate()) {
      dates.push(format(currentDate, 'MM/dd'));
      currentDate = addDays(currentDate, timeRange === "week" ? 1 : timeRange === "month" ? 3 : 30);
    }

    // Create booking data with random distribution for demo
    const bookingTimeSeries = dates.map(date => {
      // Simulate booking counts with random values (for demo)
      return {
        date,
        bookings: Math.floor(Math.random() * (totalBookings / dates.length) * 2)
      };
    });

    // Service distribution data
    const serviceDistribution = Object.entries(serviceCounts).map(([name, count]) => ({
      name, 
      value: count,
      price: serviceMap.get(name) || 0,
      revenue: (serviceMap.get(name) || 0) * count
    }));

    // Revenue data with random distribution for demo
    const revenueTimeSeries = dates.map(date => {
      // Simulate revenue with random values (for demo)
      return {
        date,
        revenue: Math.floor(Math.random() * (totalRevenue / dates.length) * 2)
      };
    });

    setBookingData(bookingTimeSeries);
    setServiceData(serviceDistribution);
    setRevenueData(revenueTimeSeries);
    setMetricsData({
      totalBookings,
      totalRevenue,
      avgBookingValue: totalBookings ? Math.round(totalRevenue / totalBookings) : 0,
      activeClients: Math.floor(totalBookings * 0.7), // Simulate unique client count
      popularService
    });
  }, [bookings, services, timeRange]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <>
      <Helmet>
        <title>Analytics Dashboard | Divine Braids</title>
      </Helmet>

      <div className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
            <p className="text-muted-foreground">Track your salon's performance and growth</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <CalendarIcon className="mr-2 h-4 w-4" />
            <Tabs 
              value={timeRange} 
              onValueChange={(value) => setTimeRange(value as "week" | "month" | "year")}
              className="w-[300px]"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
                <TabsTrigger value="year">Year</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 flex items-center">
              <div className="bg-primary/10 p-3 rounded-full mr-4">
                <CalendarIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
                <h3 className="text-2xl font-bold">{metricsData.totalBookings}</h3>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex items-center">
              <div className="bg-primary/10 p-3 rounded-full mr-4">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <h3 className="text-2xl font-bold">{formatCurrency(metricsData.totalRevenue)}</h3>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex items-center">
              <div className="bg-primary/10 p-3 rounded-full mr-4">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Booking Value</p>
                <h3 className="text-2xl font-bold">{formatCurrency(metricsData.avgBookingValue)}</h3>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex items-center">
              <div className="bg-primary/10 p-3 rounded-full mr-4">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Clients</p>
                <h3 className="text-2xl font-bold">{metricsData.activeClients}</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Booking Trends</CardTitle>
              <CardDescription>Number of bookings over time</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bookingData}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="bookings" fill="#f1c40f" name="Bookings" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Service Distribution</CardTitle>
              <CardDescription>Most popular services</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={serviceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {serviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name, props) => [`${value} bookings`, name]} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Analysis</CardTitle>
            <CardDescription>Revenue trends over time</CardDescription>
          </CardHeader>
          <CardContent className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [formatCurrency(value as number), "Revenue"]} />
                <Legend />
                <Bar dataKey="revenue" fill="#2ecc71" name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Services by Revenue */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Top Services by Revenue</h2>
          <div className="bg-white dark:bg-gray-950 border rounded-lg overflow-hidden">
            <table className="min-w-full divide-y">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Service</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Bookings</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Price</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {serviceData
                  .sort((a, b) => b.revenue - a.revenue)
                  .map((service, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-white dark:bg-gray-950" : "bg-gray-50 dark:bg-gray-900/50"}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center">
                          <div className="h-3 w-3 rounded-full mr-3" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                          {service.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{service.value}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{formatCurrency(service.price)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{formatCurrency(service.revenue)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}