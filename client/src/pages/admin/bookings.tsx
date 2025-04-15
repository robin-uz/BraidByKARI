import { Helmet } from "react-helmet";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Booking } from "@shared/schema";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { 
  Loader2, 
  Check, 
  Clock, 
  Ban, 
  MoreHorizontal, 
  Search, 
  Calendar, 
  Filter, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDistance } from "date-fns";

export default function AdminBookings() {
  const { toast } = useToast();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 10;
  
  // Fetch bookings
  const { data: bookings, isLoading } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
  });
  
  // Update booking status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: "pending" | "confirmed" | "cancelled" }) => {
      const res = await apiRequest("PATCH", `/api/bookings/${id}/status`, { status });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      toast({
        title: "Status updated",
        description: "The booking status has been successfully updated.",
      });
      setDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating status",
        description: error.message || "There was an error updating the booking status.",
        variant: "destructive",
      });
    },
  });
  
  // Update deposit status mutation
  const updateDepositMutation = useMutation({
    mutationFn: async ({ id, depositPaid }: { id: number; depositPaid: boolean }) => {
      const res = await apiRequest("PATCH", `/api/bookings/${id}/deposit`, { depositPaid });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      toast({
        title: "Deposit status updated",
        description: "The booking deposit status has been successfully updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating deposit status",
        description: error.message || "There was an error updating the deposit status.",
        variant: "destructive",
      });
    },
  });
  
  // Handle status update
  const handleStatusUpdate = (status: "pending" | "confirmed" | "cancelled") => {
    if (selectedBooking) {
      updateStatusMutation.mutate({ id: selectedBooking.id, status });
    }
  };
  
  // Handle deposit update
  const handleDepositUpdate = (depositPaid: boolean) => {
    if (selectedBooking) {
      updateDepositMutation.mutate({ id: selectedBooking.id, depositPaid });
    }
  };
  
  // Open booking details dialog
  const openBookingDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setDialogOpen(true);
  };
  
  // Filter and search bookings
  const filteredBookings = bookings ? bookings.filter(booking => {
    // Status filter
    if (statusFilter && booking.status !== statusFilter) {
      return false;
    }
    
    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        booking.name.toLowerCase().includes(query) ||
        booking.email.toLowerCase().includes(query) ||
        booking.phone.toLowerCase().includes(query) ||
        booking.serviceType.toLowerCase().includes(query)
      );
    }
    
    return true;
  }) : [];
  
  // Pagination
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);
  
  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
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
        <title>Manage Bookings | Divine Braids Admin</title>
        <meta name="description" content="Manage and update booking status for Divine Braids salon" />
      </Helmet>
      
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold font-heading">Bookings</h1>
            <p className="text-neutral-500 dark:text-neutral-400">
              Manage and update customer appointment bookings
            </p>
          </div>
          
          <Button onClick={() => window.history.back()} variant="outline" size="sm">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
        
        {/* Filters and Search */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                <Input 
                  placeholder="Search by name, email, phone..." 
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="w-full md:w-48">
                <Select 
                  value={statusFilter || ""} 
                  onValueChange={(value) => setStatusFilter(value || null)}
                >
                  <SelectTrigger>
                    <div className="flex items-center">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by status" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Bookings Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Bookings</CardTitle>
            <CardDescription>
              {filteredBookings.length} booking{filteredBookings.length !== 1 ? 's' : ''} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 px-4 text-left text-sm font-medium">Client</th>
                    <th className="py-3 px-4 text-left text-sm font-medium">Service</th>
                    <th className="py-3 px-4 text-left text-sm font-medium">Date & Time</th>
                    <th className="py-3 px-4 text-left text-sm font-medium">Status</th>
                    <th className="py-3 px-4 text-left text-sm font-medium">Deposit</th>
                    <th className="py-3 px-4 text-left text-sm font-medium">Created</th>
                    <th className="py-3 px-4 text-right text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentBookings.length > 0 ? (
                    currentBookings.map((booking) => (
                      <tr key={booking.id} className="border-b last:border-0 hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium">{booking.name}</div>
                            <div className="text-sm text-neutral-500">{booking.email}</div>
                            <div className="text-xs text-neutral-500">{booking.phone}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4">{booking.serviceType}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1 text-neutral-500" />
                            <span className="mr-1">{booking.date}</span>
                          </div>
                          <div className="text-sm text-neutral-500">{booking.time}</div>
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
                        <td className="py-3 px-4">
                          <Button 
                            variant={booking.depositPaid ? "default" : "outline"} 
                            size="sm"
                            className={`h-7 text-xs ${booking.depositPaid ? 'bg-green-600 hover:bg-green-700' : ''}`}
                            onClick={() => {
                              setSelectedBooking(booking);
                              handleDepositUpdate(!booking.depositPaid);
                            }}
                          >
                            {booking.depositPaid ? 'Paid' : 'Not Paid'}
                          </Button>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-sm text-neutral-500">
                          {booking.createdAt ? (
                            formatDistance(new Date(booking.createdAt), new Date(), { addSuffix: true })
                          ) : (
                            'N/A'
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openBookingDetails(booking)}>
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => {
                                  setSelectedBooking(booking);
                                  handleStatusUpdate('confirmed');
                                }}
                                disabled={booking.status === 'confirmed'}
                              >
                                Mark as Confirmed
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => {
                                  setSelectedBooking(booking);
                                  handleStatusUpdate('pending');
                                }}
                                disabled={booking.status === 'pending'}
                              >
                                Mark as Pending
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => {
                                  setSelectedBooking(booking);
                                  handleStatusUpdate('cancelled');
                                }}
                                disabled={booking.status === 'cancelled'}
                                className="text-red-600 dark:text-red-400"
                              >
                                Cancel Booking
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-6 text-center text-neutral-500">
                        No bookings found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-neutral-500">
                  Showing {indexOfFirstBooking + 1}-{Math.min(indexOfLastBooking, filteredBookings.length)} of {filteredBookings.length} bookings
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => 
                      page === 1 || 
                      page === totalPages || 
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    )
                    .map((page, index, array) => (
                      <React.Fragment key={page}>
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <span className="text-neutral-500">...</span>
                        )}
                        <Button
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => paginate(page)}
                        >
                          {page}
                        </Button>
                      </React.Fragment>
                    ))
                  }
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Booking Details Dialog */}
      {selectedBooking && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Booking Details</DialogTitle>
              <DialogDescription>
                View and update booking information
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-neutral-500">Client</h4>
                  <p className="mt-1">{selectedBooking.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-neutral-500">Service</h4>
                  <p className="mt-1">{selectedBooking.serviceType}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-neutral-500">Email</h4>
                  <p className="mt-1">{selectedBooking.email}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-neutral-500">Phone</h4>
                  <p className="mt-1">{selectedBooking.phone}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-neutral-500">Date</h4>
                  <p className="mt-1">{selectedBooking.date}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-neutral-500">Time</h4>
                  <p className="mt-1">{selectedBooking.time}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-neutral-500">Status</h4>
                  <div className="mt-1">
                    <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      selectedBooking.status === 'confirmed' 
                        ? 'bg-green-100 dark:bg-green-800/20 text-green-700 dark:text-green-500' 
                        : selectedBooking.status === 'pending'
                        ? 'bg-yellow-100 dark:bg-yellow-800/20 text-yellow-700 dark:text-yellow-500'
                        : 'bg-red-100 dark:bg-red-800/20 text-red-700 dark:text-red-500'
                    }`}>
                      {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-neutral-500">Deposit</h4>
                  <p className="mt-1">{selectedBooking.depositPaid ? 'Paid' : 'Not Paid'}</p>
                </div>
              </div>
              
              {selectedBooking.notes && (
                <div>
                  <h4 className="text-sm font-medium text-neutral-500">Special Requests</h4>
                  <p className="mt-1 text-sm">{selectedBooking.notes}</p>
                </div>
              )}
              
              <div>
                <h4 className="text-sm font-medium text-neutral-500 mb-2">Update Status</h4>
                <div className="flex space-x-2">
                  <Button 
                    variant={selectedBooking.status === 'confirmed' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => handleStatusUpdate('confirmed')}
                    disabled={updateStatusMutation.isPending || selectedBooking.status === 'confirmed'}
                    className={selectedBooking.status === 'confirmed' ? 'bg-green-600 hover:bg-green-700' : ''}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Confirm
                  </Button>
                  <Button 
                    variant={selectedBooking.status === 'pending' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => handleStatusUpdate('pending')}
                    disabled={updateStatusMutation.isPending || selectedBooking.status === 'pending'}
                    className={selectedBooking.status === 'pending' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}
                  >
                    <Clock className="h-4 w-4 mr-1" />
                    Pending
                  </Button>
                  <Button 
                    variant={selectedBooking.status === 'cancelled' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => handleStatusUpdate('cancelled')}
                    disabled={updateStatusMutation.isPending || selectedBooking.status === 'cancelled'}
                    className={selectedBooking.status === 'cancelled' ? 'bg-red-600 hover:bg-red-700' : ''}
                  >
                    <Ban className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-neutral-500 mb-2">Update Deposit</h4>
                <div className="flex space-x-2">
                  <Button 
                    variant={selectedBooking.depositPaid ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => handleDepositUpdate(true)}
                    disabled={updateDepositMutation.isPending || selectedBooking.depositPaid}
                    className={selectedBooking.depositPaid ? 'bg-green-600 hover:bg-green-700' : ''}
                  >
                    Mark as Paid
                  </Button>
                  <Button 
                    variant={!selectedBooking.depositPaid ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => handleDepositUpdate(false)}
                    disabled={updateDepositMutation.isPending || !selectedBooking.depositPaid}
                  >
                    Mark as Unpaid
                  </Button>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setDialogOpen(false)}
                disabled={updateStatusMutation.isPending || updateDepositMutation.isPending}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
