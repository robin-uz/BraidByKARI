import { useState } from "react";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, CalendarIcon, BarChart3, TrendingUp, DollarSign, Users, Clock } from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval, parse, isValid } from "date-fns";

export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState<string>("30days");
  const [revenueTimeRange, setRevenueTimeRange] = useState<string>("monthly");
  const [serviceComparisonType, setServiceComparisonType] = useState<string>("bookings");

  // Fetch data
  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ["/api/bookings"],
  });

  const { data: services, isLoading: servicesLoading } = useQuery({
    queryKey: ["/api/services"],
  });

  const isLoading = bookingsLoading || servicesLoading;

  // Generate date range based on selected time frame
  const getDateRange = () => {
    const today = new Date();
    
    switch (timeRange) {
      case "7days":
        return eachDayOfInterval({
          start: subDays(today, 6),
          end: today
        });
      case "30days":
        return eachDayOfInterval({
          start: subDays(today, 29),
          end: today
        });
      case "90days":
        return eachDayOfInterval({
          start: subDays(today, 89),
          end: today
        });
      case "thisMonth":
        return eachDayOfInterval({
          start: startOfMonth(today),
          end: today
        });
      default:
        return eachDayOfInterval({
          start: subDays(today, 29),
          end: today
        });
    }
  };

  // Generate booking trend data
  const getBookingTrendData = () => {
    if (!bookings || !bookings.length) return [];
    
    const dateRange = getDateRange();
    
    return dateRange.map(date => {
      const formattedDate = format(date, "yyyy-MM-dd");
      const count = bookings.filter(booking => booking.date === formattedDate).length || 0;
      
      return {
        date: formattedDate,
        count: count
      };
    });
  };

  // Generate service popularity data
  const getServicePopularityData = () => {
    if (!bookings || !bookings.length || !services || !services.length) return [];
    
    const serviceCounts = {};
    
    bookings.forEach(booking => {
      serviceCounts[booking.serviceType] = (serviceCounts[booking.serviceType] || 0) + 1;
    });
    
    // If we want to show revenue instead of booking counts
    if (serviceComparisonType === "revenue") {
      const serviceRevenue = {};
      
      // Map service names to their prices
      const servicePrices = {};
      services.forEach(service => {
        servicePrices[service.name] = service.price;
      });
      
      // Calculate revenue for each service
      Object.keys(serviceCounts).forEach(serviceName => {
        const price = servicePrices[serviceName] || 0;
        serviceRevenue[serviceName] = serviceCounts[serviceName] * price;
      });
      
      return Object.entries(serviceRevenue)
        .map(([name, revenue]) => ({
          name,
          value: revenue
        }))
        .sort((a, b) => b.value - a.value);
    }
    
    // Return booking counts
    return Object.entries(serviceCounts)
      .map(([name, count]) => ({
        name,
        value: count
      }))
      .sort((a, b) => b.value - a.value);
  };

  // Generate booking status distribution data
  const getBookingStatusData = () => {
    if (!bookings || !bookings.length) return [];
    
    const statusCounts = {
      confirmed: 0,
      pending: 0,
      cancelled: 0
    };
    
    bookings.forEach(booking => {
      statusCounts[booking.status] = statusCounts[booking.status] + 1;
    });
    
    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count
    }));
  };

  // Generate revenue data
  const getRevenueData = () => {
    if (!bookings || !bookings.length || !services || !services.length) return [];
    
    // Map service names to their prices
    const servicePrices = {};
    services.forEach(service => {
      servicePrices[service.name] = service.price;
    });
    
    // Format data based on selected time range
    if (revenueTimeRange === "monthly") {
      // Group by month
      const monthlyRevenue = {};
      
      bookings.forEach(booking => {
        try {
          // Parse the date string and ensure it's valid
          const dateObj = parse(booking.date, "yyyy-MM-dd", new Date());
          
          if (!isValid(dateObj)) return;
          
          const monthKey = format(dateObj, "MMM yyyy");
          const price = servicePrices[booking.serviceType] || 0;
          
          monthlyRevenue[monthKey] = (monthlyRevenue[monthKey] || 0) + price;
        } catch (error) {
          console.error("Error parsing date:", error);
        }
      });
      
      return Object.entries(monthlyRevenue)
        .map(([month, revenue]) => ({
          name: month,
          revenue
        }));
    } else {
      // Group by day (last 30 days)
      const today = new Date();
      const dateRange = eachDayOfInterval({
        start: subDays(today, 29),
        end: today
      });
      
      return dateRange.map(date => {
        const formattedDate = format(date, "yyyy-MM-dd");
        
        // Find bookings for this day
        const dayBookings = bookings.filter(booking => booking.date === formattedDate);
        
        // Calculate total revenue for the day
        let dayRevenue = 0;
        dayBookings.forEach(booking => {
          const price = servicePrices[booking.serviceType] || 0;
          dayRevenue += price;
        });
        
        return {
          name: format(date, "dd MMM"),
          revenue: dayRevenue
        };
      });
    }
  };

  // Generate time slot popularity data
  const getTimeSlotData = () => {
    if (!bookings || !bookings.length) return [];
    
    // Group bookings by time slot
    const timeSlotCounts = {};
    
    bookings.forEach(booking => {
      timeSlotCounts[booking.time] = (timeSlotCounts[booking.time] || 0) + 1;
    });
    
    // Sort time slots chronologically
    return Object.entries(timeSlotCounts)
      .map(([time, count]) => ({
        time,
        count
      }))
      .sort((a, b) => {
        // Simple time comparison - assumes format like "10:00 AM"
        return a.time.localeCompare(b.time);
      });
  };

  const performanceMetrics = [
    {
      title: "Average Bookings",
      value: bookings ? (bookings.length / 30).toFixed(1) : "0", 
      change: "+12.5%",
      trend: "up"
    },
    {
      title: "Completion Rate",
      value: bookings ? 
        ((bookings.filter(b => b.status === "confirmed").length / bookings.length) * 100).toFixed(0) + "%" : 
        "0%",
      change: "+5.2%", 
      trend: "up"
    },
    {
      title: "Cancellation Rate",
      value: bookings ? 
        ((bookings.filter(b => b.status === "cancelled").length / bookings.length) * 100).toFixed(0) + "%" : 
        "0%",
      change: "-2.3%", 
      trend: "down"
    },
    {
      title: "Avg. Booking Value",
      value: "$99", 
      change: "+$7", 
      trend: "up"
    },
  ];

  // Colors for charts
  const COLORS = ['#D4AF37', '#8884d8', '#FF8042', '#00C49F', '#FFBB28'];
  const STATUS_COLORS = {
    'Confirmed': '#4ADE80',
    'Pending': '#FACC15',
    'Cancelled': '#F87171'
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Analytics | Divine Braids</title>
      </Helmet>
      
      <div className="p-6 space-y-8">
        <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold font-heading">Business Analytics</h1>
            <p className="text-muted-foreground">Track your salon performance metrics and growth</p>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Time Range:</span>
            <Select
              value={timeRange}
              onValueChange={setTimeRange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="90days">Last 90 Days</SelectItem>
                <SelectItem value="thisMonth">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Performance Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {performanceMetrics.map((metric, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className={`text-xs flex items-center mt-1 ${
                  metric.trend === "up" ? "text-green-500" : "text-red-500"
                }`}>
                  {metric.trend === "up" ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingUp className="h-3 w-3 mr-1 rotate-180" />
                  )}
                  {metric.change} from previous period
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Tabs defaultValue="bookings" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="time">Timing</TabsTrigger>
          </TabsList>
          
          <TabsContent value="bookings">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Booking Trends</CardTitle>
                  <CardDescription>Bookings over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={getBookingTrendData()}
                        margin={{ top: 10, right: 30, left: 0, bottom: 25 }}
                      >
                        <defs>
                          <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#D4AF37" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <XAxis 
                          dataKey="date" 
                          angle={-45} 
                          textAnchor="end" 
                          height={60}
                          tickFormatter={(date) => format(new Date(date), "MMM dd")}
                        />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip 
                          labelFormatter={(date) => format(new Date(date), "MMMM d, yyyy")}
                          formatter={(value) => [`${value} bookings`, "Bookings"]}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="count" 
                          stroke="#D4AF37"
                          fillOpacity={1}
                          fill="url(#colorCount)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Booking Status</CardTitle>
                  <CardDescription>Distribution by status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={getBookingStatusData()}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {getBookingStatusData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} bookings`, ""]} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="services">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Service Comparison</CardTitle>
                  <CardDescription>Popularity of different services</CardDescription>
                </div>
                <Select
                  value={serviceComparisonType}
                  onValueChange={setServiceComparisonType}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bookings">By Bookings</SelectItem>
                    <SelectItem value="revenue">By Revenue</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={getServicePopularityData()}
                      layout="vertical"
                      margin={{ top: 10, right: 30, left: 120, bottom: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis 
                        type="category" 
                        dataKey="name" 
                        width={100}
                      />
                      <Tooltip 
                        formatter={(value) => [
                          serviceComparisonType === 'revenue' ? 
                            `$${value}` : 
                            `${value} booking${value !== 1 ? 's' : ''}`,
                          serviceComparisonType === 'revenue' ? 'Revenue' : 'Bookings'
                        ]}
                      />
                      <Bar 
                        dataKey="value" 
                        fill="#D4AF37" 
                        name={serviceComparisonType === 'revenue' ? 'Revenue' : 'Bookings'}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="revenue">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Revenue Analysis</CardTitle>
                  <CardDescription>Track your salon revenue over time</CardDescription>
                </div>
                <Select
                  value={revenueTimeRange}
                  onValueChange={setRevenueTimeRange}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily (30 days)</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={getRevenueData()}
                      margin={{ top: 10, right: 30, left: 20, bottom: 25 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        angle={-45} 
                        textAnchor="end" 
                        height={60}
                      />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [`$${value}`, "Revenue"]}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#D4AF37" 
                        name="Revenue" 
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">Revenue by Service</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$4,280</div>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12.5% from previous month
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$89.50</div>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +5.2% from previous month
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">Monthly Estimate</CardTitle>
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$7,850</div>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +8.1% from previous month
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="time">
            <Card>
              <CardHeader>
                <CardTitle>Popular Time Slots</CardTitle>
                <CardDescription>Most booked appointment times</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={getTimeSlotData()}
                      margin={{ top: 10, right: 30, left: 0, bottom: 25 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="time" 
                        angle={-45} 
                        textAnchor="end" 
                        height={60}
                      />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [`${value} bookings`, "Bookings"]}
                      />
                      <Bar 
                        dataKey="count" 
                        fill="#D4AF37" 
                        name="Bookings"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Day of Week Analysis</CardTitle>
                  <CardDescription>Booking patterns by day</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { day: "Monday", bookings: 12 },
                          { day: "Tuesday", bookings: 9 },
                          { day: "Wednesday", bookings: 15 },
                          { day: "Thursday", bookings: 18 },
                          { day: "Friday", bookings: 22 },
                          { day: "Saturday", bookings: 30 },
                          { day: "Sunday", bookings: 5 }
                        ]}
                        margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value} bookings`, "Bookings"]} />
                        <Bar dataKey="bookings" fill="#D4AF37" name="Bookings" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center">
                  <div>
                    <CardTitle>Average Service Duration</CardTitle>
                    <CardDescription>Time spent on each service type</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={services?.map(service => ({
                          name: service.name,
                          duration: parseInt(service.duration.split(' ')[0]) // Assuming duration is like "90 minutes"
                        })) || []}
                        margin={{ top: 10, right: 30, left: 20, bottom: 25 }}
                        layout="vertical"
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis 
                          type="category" 
                          dataKey="name" 
                          width={150}
                        />
                        <Tooltip formatter={(value) => [`${value} minutes`, "Duration"]} />
                        <Bar dataKey="duration" fill="#D4AF37" name="Duration (minutes)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}