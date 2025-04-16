import { useState } from "react";
import { Helmet } from "react-helmet";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Booking } from "@shared/schema";
import AdminLayout from "@/components/admin/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Check,
  Clock,
  Ban,
  Search,
  Calendar,
  Filter,
  Loader2,
  Mail,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow, format, parseISO } from "date-fns";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function AdminBookings() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Query bookings
  const { data: bookings, isLoading } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
  });

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: number;
      status: "pending" | "confirmed" | "cancelled";
    }) => {
      const response = await apiRequest(
        "PATCH",
        `/api/bookings/${id}/status`,
        { status }
      );
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      toast({
        title: "Status updated",
        description: "The booking status has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update booking status.",
        variant: "destructive",
      });
    },
  });

  // Send reminder email mutation
  const sendReminderMutation = useMutation({
    mutationFn: async (bookingId: number) => {
      const response = await apiRequest(
        "POST",
        `/api/bookings/${bookingId}/remind`,
        {}
      );
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Reminder sent",
        description: "A reminder email has been sent to the client.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send reminder email.",
        variant: "destructive",
      });
    },
  });

  // Filter bookings
  const filteredBookings = bookings
    ? bookings.filter((booking) => {
        const matchesSearch =
          booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.serviceType.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = 
          statusFilter === "all" || booking.status === statusFilter;
        
        return matchesSearch && matchesStatus;
      })
    : [];

  // Sort bookings by date (newest first)
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateB.getTime() - dateA.getTime();
  });

  const handleStatusChange = (bookingId: number, status: "pending" | "confirmed" | "cancelled") => {
    updateStatusMutation.mutate({ id: bookingId, status });
  };

  const handleSendReminder = (bookingId: number) => {
    sendReminderMutation.mutate(bookingId);
  };

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

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 flex items-center gap-1 py-1.5">
            <Check className="h-3.5 w-3.5" />
            Confirmed
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 flex items-center gap-1 py-1.5">
            <Clock className="h-3.5 w-3.5" />
            Pending
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 flex items-center gap-1 py-1.5">
            <Ban className="h-3.5 w-3.5" />
            Cancelled
          </Badge>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Helmet>
        <title>Manage Bookings | Divine Braids</title>
        <meta name="description" content="Manage customer bookings for Divine Braids salon" />
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Bookings</h1>
            <p className="text-muted-foreground mt-1">
              Manage customer appointments and bookings
            </p>
          </div>
        </div>
        
        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500 h-4 w-4" />
            <Input
              placeholder="Search by name, email or service..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select 
              value={statusFilter} 
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-40">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Bookings Table */}
        <Card className="mt-6">
          <CardHeader className="pb-2">
            <CardTitle>
              Appointment Bookings
              {filteredBookings.length > 0 && (
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  {filteredBookings.length} {filteredBookings.length === 1 ? 'booking' : 'bookings'} found
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sortedBookings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="py-3 px-4 text-left text-sm font-medium">Client</th>
                      <th className="py-3 px-4 text-left text-sm font-medium">Service</th>
                      <th className="py-3 px-4 text-left text-sm font-medium">Date & Time</th>
                      <th className="py-3 px-4 text-left text-sm font-medium">Status</th>
                      <th className="py-3 px-4 text-left text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedBookings.map((booking) => (
                      <tr key={booking.id} className="border-b last:border-0 hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium">{booking.name}</div>
                            <div className="text-sm text-neutral-500 flex items-center">
                              <Mail className="h-3.5 w-3.5 mr-1 text-neutral-400" />
                              {booking.email}
                            </div>
                            {booking.phone && (
                              <div className="text-sm text-neutral-500">
                                {booking.phone}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <div>{booking.serviceType}</div>
                            {booking.notes && (
                              <div className="text-sm text-neutral-500 max-w-xs truncate">
                                {booking.notes}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <div className="flex items-center">
                              <Calendar className="h-3.5 w-3.5 mr-1.5 text-purple-600" />
                              {formatBookingDate(booking.date, booking.time)}
                            </div>
                            <div className="text-sm text-neutral-500 ml-5">
                              {formatBookingTime(booking.time)}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {getStatusBadge(booking.status)}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8"
                                  onClick={() => setSelectedBooking(booking)}
                                >
                                  Update
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Update Booking Status</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    {selectedBooking && (
                                      <>
                                        <div className="mb-4">
                                          <p className="font-medium">{selectedBooking.name} - {selectedBooking.serviceType}</p>
                                          <p className="text-sm text-neutral-500">{formatBookingDate(selectedBooking.date, selectedBooking.time)} at {formatBookingTime(selectedBooking.time)}</p>
                                        </div>
                                        <p>Choose the new status for this booking:</p>
                                      </>
                                    )}
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <div className="flex flex-col gap-2 my-4">
                                  <Button
                                    variant={selectedBooking?.status === "pending" ? "default" : "outline"}
                                    className="justify-start"
                                    onClick={() => selectedBooking && handleStatusChange(selectedBooking.id, "pending")}
                                  >
                                    <Clock className="h-4 w-4 mr-2 text-yellow-500" />
                                    Pending
                                  </Button>
                                  <Button
                                    variant={selectedBooking?.status === "confirmed" ? "default" : "outline"}
                                    className="justify-start"
                                    onClick={() => selectedBooking && handleStatusChange(selectedBooking.id, "confirmed")}
                                  >
                                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                                    Confirmed
                                  </Button>
                                  <Button
                                    variant={selectedBooking?.status === "cancelled" ? "default" : "outline"}
                                    className="justify-start"
                                    onClick={() => selectedBooking && handleStatusChange(selectedBooking.id, "cancelled")}
                                  >
                                    <XCircle className="h-4 w-4 mr-2 text-red-500" />
                                    Cancelled
                                  </Button>
                                </div>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Close</AlertDialogCancel>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                            
                            {booking.status === "confirmed" && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8"
                                onClick={() => handleSendReminder(booking.id)}
                                disabled={sendReminderMutation.isPending}
                              >
                                {sendReminderMutation.isPending ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                                ) : (
                                  <Mail className="h-3.5 w-3.5 mr-1" />
                                )}
                                Remind
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-24 text-center">
                <Calendar className="h-12 w-12 mx-auto text-neutral-300 dark:text-neutral-600 mb-4" />
                <h3 className="text-xl font-medium mb-2">No bookings found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your filters to see more results"
                    : "You don't have any bookings yet"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}