import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Search, Loader2, CheckCircle, XCircle, Clock, Eye, Trash2, Download } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { downloadBookingPDF } from '@/lib/generateBookingPDF';

interface Booking {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  travel_date: string;
  number_of_guests: number;
  special_requests: string | null;
  status: string;
  total_price: number | null;
  created_at: string;
  tour_id: string | null;
  activity_id: string | null;
  tracking_code: string | null;
  tours?: { title: string } | null;
  activities?: { title: string } | null;
}

const AdminBookings = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          tours:tour_id(title),
          activities:activity_id(title)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Booking[];
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from('bookings').update({ status }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      toast({ title: 'Status updated' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('bookings').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      toast({ title: 'Booking deleted', description: 'The booking has been deleted successfully.' });
    },
    onError: (error: Error) => {
      toast({ title: 'Delete failed', description: error.message, variant: 'destructive' });
    },
  });

  const handleDownloadPDF = (booking: Booking) => {
    downloadBookingPDF({
      trackingCode: booking.tracking_code || 'N/A',
      customerName: booking.customer_name,
      customerEmail: booking.customer_email,
      customerPhone: booking.customer_phone || undefined,
      tourName: booking.tours?.title || booking.activities?.title || 'General Inquiry',
      travelDate: format(new Date(booking.travel_date), 'MMMM dd, yyyy'),
      numberOfGuests: booking.number_of_guests,
      specialRequests: booking.special_requests || undefined,
      status: booking.status as 'pending' | 'confirmed' | 'completed' | 'cancelled',
      totalPrice: booking.total_price || undefined,
    }, booking.status === 'confirmed');
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      confirmed: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
      completed: 'bg-blue-100 text-blue-800 border-blue-200',
    };
    return <Badge variant="outline" className={styles[status] || ''}>{status}</Badge>;
  };

  const filteredBookings = bookings?.filter(booking => {
    const matchesSearch = booking.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      booking.customer_email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Bookings</h1>
          <p className="text-muted-foreground mt-1">Manage customer bookings</p>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredBookings?.length === 0 ? (
          <Card className="shadow-soft">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No bookings found.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredBookings?.map((booking) => (
              <Card key={booking.id} className="shadow-soft">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-foreground">{booking.customer_name}</h3>
                        {getStatusBadge(booking.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">{booking.customer_email}</p>
                      <p className="text-sm text-primary font-medium">
                        {booking.tours?.title || booking.activities?.title || 'Unknown Tour/Activity'}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Travel: {format(new Date(booking.travel_date), 'MMM dd, yyyy')}</span>
                        <span>{booking.number_of_guests} guest(s)</span>
                        {booking.total_price && <span className="font-medium text-foreground">${booking.total_price}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => setSelectedBooking(booking)}>
                        <Eye className="h-4 w-4 mr-1" /> View
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDownloadPDF(booking)}
                        title="Download PDF Voucher"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      {booking.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 hover:text-green-700"
                            onClick={() => updateStatusMutation.mutate({ id: booking.id, status: 'confirmed' })}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-destructive"
                            onClick={() => updateStatusMutation.mutate({ id: booking.id, status: 'cancelled' })}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this booking? This action cannot be undone.')) {
                            deleteMutation.mutate(booking.id);
                          }
                        }}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Booking Details Dialog */}
        <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Booking Details</DialogTitle>
            </DialogHeader>
            {selectedBooking && (
              <div className="space-y-4">
                {/* Tracking Code */}
                {selectedBooking.tracking_code && (
                  <div className="bg-muted/50 rounded-lg p-3 text-center">
                    <p className="text-sm text-muted-foreground">Tracking Code</p>
                    <p className="text-xl font-mono font-bold text-primary">{selectedBooking.tracking_code}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Customer</p>
                  <p className="font-medium">{selectedBooking.customer_name}</p>
                  <p className="text-sm">{selectedBooking.customer_email}</p>
                  {selectedBooking.customer_phone && <p className="text-sm">{selectedBooking.customer_phone}</p>}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tour/Activity</p>
                  <p className="font-medium">{selectedBooking.tours?.title || selectedBooking.activities?.title}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Travel Date</p>
                    <p className="font-medium">{format(new Date(selectedBooking.travel_date), 'MMMM dd, yyyy')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Guests</p>
                    <p className="font-medium">{selectedBooking.number_of_guests}</p>
                  </div>
                </div>
                {selectedBooking.total_price && (
                  <div>
                    <p className="text-sm text-muted-foreground">Total Price</p>
                    <p className="font-medium text-lg">${selectedBooking.total_price}</p>
                  </div>
                )}
                {selectedBooking.special_requests && (
                  <div>
                    <p className="text-sm text-muted-foreground">Special Requests</p>
                    <p className="text-sm">{selectedBooking.special_requests}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Update Status</p>
                  <Select
                    value={selectedBooking.status}
                    onValueChange={(status) => {
                      updateStatusMutation.mutate({ id: selectedBooking.id, status });
                      setSelectedBooking(prev => prev ? { ...prev, status } : null);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* Download PDF Button */}
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => handleDownloadPDF(selectedBooking)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF Voucher
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminBookings;