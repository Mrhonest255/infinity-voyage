import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Loader2, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Calendar,
  Users,
  MapPin,
  Phone,
  Mail,
  Sparkles,
  AlertCircle,
  Package,
  Download,
  FileText
} from "lucide-react";
import { downloadBookingPDF } from "@/lib/generateBookingPDF";
import { format } from "date-fns";

interface Booking {
  id: string;
  tracking_code: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  travel_date: string;
  number_of_guests: number;
  special_requests: string | null;
  status: string;
  created_at: string;
  tour_id: string | null;
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType; bgColor: string }> = {
  pending: { 
    label: "Pending Review", 
    color: "text-amber-600", 
    icon: Clock,
    bgColor: "bg-amber-500/10 border-amber-500/20"
  },
  confirmed: { 
    label: "Confirmed", 
    color: "text-green-600", 
    icon: CheckCircle2,
    bgColor: "bg-green-500/10 border-green-500/20"
  },
  cancelled: { 
    label: "Cancelled", 
    color: "text-red-600", 
    icon: XCircle,
    bgColor: "bg-red-500/10 border-red-500/20"
  },
  completed: { 
    label: "Completed", 
    color: "text-blue-600", 
    icon: Sparkles,
    bgColor: "bg-blue-500/10 border-blue-500/20"
  },
};

export default function TrackBooking() {
  const [trackingCode, setTrackingCode] = useState("");
  const [searchCode, setSearchCode] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const { data: booking, isLoading, error } = useQuery({
    queryKey: ['booking-tracking', searchCode],
    queryFn: async (): Promise<Booking | null> => {
      if (!searchCode) return null;
      
      // Use raw query to avoid TypeScript deep instantiation issue
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/bookings?tracking_code=eq.${encodeURIComponent(searchCode.toUpperCase())}&select=*`,
        {
          headers: {
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
        }
      );
      
      if (!response.ok) throw new Error('Failed to fetch booking');
      
      const data = await response.json();
      if (!data || data.length === 0) return null;
      
      const booking = data[0];
      return {
        id: booking.id,
        tracking_code: booking.tracking_code || '',
        customer_name: booking.customer_name,
        customer_email: booking.customer_email,
        customer_phone: booking.customer_phone,
        travel_date: booking.travel_date,
        number_of_guests: booking.number_of_guests,
        special_requests: booking.special_requests,
        status: booking.status,
        created_at: booking.created_at,
        tour_id: booking.tour_id,
      };
    },
    enabled: !!searchCode,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingCode.trim()) {
      setSearchCode(trackingCode.trim().toUpperCase());
      setHasSearched(true);
    }
  };

  const getStatusInfo = (status: string) => {
    return statusConfig[status] || statusConfig.pending;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 bg-gradient-to-br from-primary/10 via-background to-safari-gold/5 overflow-hidden">
        <div className="absolute top-20 right-0 w-96 h-96 bg-safari-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        
        <div className="container-wide mx-auto px-4 md:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mx-auto"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-safari-gold to-safari-amber mb-6 shadow-gold">
              <Package className="w-10 h-10 text-safari-night" />
            </div>
            <h1 className="text-4xl md:text-5xl font-semibold text-foreground mb-4">
              Track Your <span className="text-gradient-gold">Booking</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Enter your tracking code to check the status of your booking
            </p>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="max-w-md mx-auto">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Enter tracking code (e.g., IV-ABC123)"
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
                  className="h-14 pl-5 pr-32 text-lg font-mono tracking-wider border-2 focus:border-safari-gold rounded-xl"
                />
                <Button 
                  type="submit"
                  disabled={isLoading || !trackingCode.trim()}
                  className="absolute right-2 top-2 h-10 px-6 bg-gradient-to-r from-safari-gold to-safari-amber text-safari-night font-semibold rounded-lg"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Track
                    </>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-12 md:py-20">
        <div className="container-wide mx-auto px-4 md:px-8">
          <AnimatePresence mode="wait">
            {isLoading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center py-12"
              >
                <Loader2 className="w-10 h-10 animate-spin text-safari-gold" />
              </motion.div>
            )}

            {!isLoading && hasSearched && !booking && (
              <motion.div
                key="not-found"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-lg mx-auto text-center"
              >
                <Card className="border-2 border-dashed border-muted-foreground/30">
                  <CardContent className="py-12">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                      <AlertCircle className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Booking Not Found</h3>
                    <p className="text-muted-foreground mb-4">
                      We couldn't find a booking with code <span className="font-mono font-bold">{searchCode}</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Please check your tracking code and try again. The code should look like: IV-XXXXXX
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {!isLoading && booking && (
              <motion.div
                key="found"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-2xl mx-auto"
              >
                {/* Status Card */}
                <Card className={`mb-6 border-2 ${getStatusInfo(booking.status).bgColor}`}>
                  <CardContent className="py-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${getStatusInfo(booking.status).bgColor}`}>
                          {(() => {
                            const StatusIcon = getStatusInfo(booking.status).icon;
                            return <StatusIcon className={`w-8 h-8 ${getStatusInfo(booking.status).color}`} />;
                          })()}
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Booking Status</p>
                          <p className={`text-2xl font-bold ${getStatusInfo(booking.status).color}`}>
                            {getStatusInfo(booking.status).label}
                          </p>
                        </div>
                      </div>
                      <div className="text-center md:text-right">
                        <p className="text-sm text-muted-foreground mb-1">Tracking Code</p>
                        <p className="text-2xl font-mono font-bold text-foreground">
                          {booking.tracking_code}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Booking Details */}
                <Card className="shadow-elevated">
                  <CardContent className="py-8">
                    <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-safari-gold" />
                      Booking Details
                    </h3>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Customer Name */}
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <Users className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Guest Name</p>
                          <p className="font-semibold">{booking.customer_name}</p>
                        </div>
                      </div>

                      {/* Travel Date */}
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-safari-gold/10 flex items-center justify-center shrink-0">
                          <Calendar className="w-5 h-5 text-safari-gold" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Travel Date</p>
                          <p className="font-semibold">{formatDate(booking.travel_date)}</p>
                        </div>
                      </div>

                      {/* Number of Guests */}
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                          <Users className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Number of Guests</p>
                          <p className="font-semibold">{booking.number_of_guests} {booking.number_of_guests === 1 ? 'Guest' : 'Guests'}</p>
                        </div>
                      </div>

                      {/* Email */}
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                          <Mail className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="font-semibold">{booking.customer_email}</p>
                        </div>
                      </div>

                      {/* Phone */}
                      {booking.customer_phone && (
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                            <Phone className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Phone</p>
                            <p className="font-semibold">{booking.customer_phone}</p>
                          </div>
                        </div>
                      )}

                      {/* Booking Date */}
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                          <Clock className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Booked On</p>
                          <p className="font-semibold">{formatDate(booking.created_at)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Special Requests */}
                    {booking.special_requests && (
                      <div className="mt-6 pt-6 border-t">
                        <p className="text-sm text-muted-foreground mb-2">Special Requests</p>
                        <p className="text-foreground bg-muted/50 p-4 rounded-lg">
                          {booking.special_requests}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Download PDF - for confirmed/completed bookings */}
                {(booking.status === 'confirmed' || booking.status === 'completed') && (
                  <div className="mt-8">
                    <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 border-green-500/20">
                      <CardContent className="py-6 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                          <FileText className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-green-700 mb-2">
                          {booking.status === 'confirmed' ? 'Your Booking is Confirmed!' : 'Trip Completed!'}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Download your official {booking.status === 'confirmed' ? 'confirmation' : 'completion'} voucher
                        </p>
                        <Button 
                          variant="safari"
                          className="shadow-gold"
                          onClick={() => {
                            downloadBookingPDF({
                              trackingCode: booking.tracking_code,
                              customerName: booking.customer_name,
                              customerEmail: booking.customer_email,
                              customerPhone: booking.customer_phone || undefined,
                              tourName: 'Tanzania Safari Adventure', // Would need tour data
                              travelDate: format(new Date(booking.travel_date), 'MMMM dd, yyyy'),
                              numberOfGuests: booking.number_of_guests,
                              specialRequests: booking.special_requests || undefined,
                              status: booking.status as 'pending' | 'confirmed' | 'completed' | 'cancelled',
                            }, true);
                          }}
                        >
                          <Download className="w-5 h-5 mr-2" />
                          Download Confirmation Voucher (PDF)
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Contact Section */}
                <div className="mt-8 text-center">
                  <p className="text-muted-foreground mb-4">
                    Need help with your booking? Contact us:
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <Button 
                      variant="outline"
                      onClick={() => window.open(`https://wa.me/255758241294?text=Hello! I need help with my booking ${booking.tracking_code}`, '_blank')}
                    >
                      WhatsApp Support
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => window.location.href = 'mailto:info@infinityvoyagetours.com'}
                    >
                      Email Us
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {!hasSearched && !isLoading && (
              <motion.div
                key="initial"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-lg mx-auto text-center py-8"
              >
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="p-4 rounded-xl bg-muted/50 border border-border">
                    <Clock className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                    <p className="text-sm font-medium">Pending</p>
                    <p className="text-xs text-muted-foreground">Under Review</p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/50 border border-border">
                    <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <p className="text-sm font-medium">Confirmed</p>
                    <p className="text-xs text-muted-foreground">Ready to Go</p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/50 border border-border">
                    <Sparkles className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <p className="text-sm font-medium">Completed</p>
                    <p className="text-xs text-muted-foreground">Trip Finished</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  Enter your tracking code above to see your booking status
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <Footer />
    </div>
  );
}
