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
import { BookingDetailSkeleton } from "@/components/ui/skeleton";
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

  const { data: booking, isLoading, error, refetch } = useQuery({
    queryKey: ['booking-tracking', searchCode],
    queryFn: async (): Promise<Booking | null> => {
      if (!searchCode) return null;
      
      console.log('Searching for tracking code:', searchCode.toUpperCase());
      
      // Fetch all bookings and filter by tracking code (workaround for TypeScript issue)
      const { data, error } = await supabase
        .from('bookings')
        .select('*');
      
      if (error) {
        console.error('Booking fetch error:', error);
        throw error;
      }
      
      // Find matching booking by tracking code
      const matchingBooking = (data as any[])?.find(
        (b: any) => b.tracking_code?.toUpperCase() === searchCode.toUpperCase()
      );
      
      if (!matchingBooking) {
        console.log('No booking found for code:', searchCode);
        return null;
      }
      
      console.log('Found booking:', matchingBooking);
      
      return {
        id: matchingBooking.id,
        tracking_code: matchingBooking.tracking_code || searchCode.toUpperCase(),
        customer_name: matchingBooking.customer_name,
        customer_email: matchingBooking.customer_email,
        customer_phone: matchingBooking.customer_phone,
        travel_date: matchingBooking.travel_date,
        number_of_guests: matchingBooking.number_of_guests,
        special_requests: matchingBooking.special_requests,
        status: matchingBooking.status,
        created_at: matchingBooking.created_at,
        tour_id: matchingBooking.tour_id,
      };
    },
    enabled: !!searchCode,
    retry: false,
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
      
      {/* Premium Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-safari-cream via-background to-safari-gold/5 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-gradient-to-br from-safari-gold/15 to-safari-amber/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/4 left-10 w-24 h-24 border border-safari-gold/20 rounded-full" />
        <div className="absolute bottom-1/4 right-20 w-16 h-16 border border-primary/20 rounded-full" />
        
        <div className="container-wide mx-auto px-4 md:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-safari-gold to-safari-amber mb-8 shadow-luxury"
            >
              <Package className="w-12 h-12 text-white" />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-4"
            >
              Track Your <span className="text-gradient-gold">Booking</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto"
            >
              Enter your tracking code to check the status of your booking
            </motion.p>

            {/* Premium Search Form */}
            <motion.form 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              onSubmit={handleSearch} 
              className="max-w-lg mx-auto"
            >
              <div className="relative bg-white rounded-2xl shadow-luxury p-2 border border-border/50">
                <Input
                  type="text"
                  placeholder="Enter tracking code (e.g., IV-ABC123)"
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
                  className="h-14 pl-5 pr-36 text-lg font-mono tracking-wider border-0 focus:ring-0 bg-transparent"
                />
                <Button 
                  type="submit"
                  disabled={isLoading || !trackingCode.trim()}
                  className="absolute right-2 top-2 h-12 px-6 bg-gradient-to-r from-safari-gold to-safari-amber text-safari-night font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Search className="w-5 h-5 mr-2" />
                      Track
                    </>
                  )}
                </Button>
              </div>
            </motion.form>
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
                className="max-w-2xl mx-auto py-8"
              >
                <BookingDetailSkeleton />
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
                <Card className="border-2 border-dashed border-muted-foreground/20 rounded-2xl bg-white shadow-soft">
                  <CardContent className="py-14">
                    <div className="w-20 h-20 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-6">
                      <AlertCircle className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h3 className="font-display text-2xl font-semibold mb-3">Booking Not Found</h3>
                    <p className="text-muted-foreground mb-4">
                      We couldn't find a booking with code <span className="font-mono font-bold text-foreground">{searchCode}</span>
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
                {/* Premium Status Card */}
                <Card className={`mb-8 border-2 rounded-2xl ${getStatusInfo(booking.status).bgColor} shadow-soft`}>
                  <CardContent className="py-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="flex items-center gap-5">
                        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center ${getStatusInfo(booking.status).bgColor}`}>
                          {(() => {
                            const StatusIcon = getStatusInfo(booking.status).icon;
                            return <StatusIcon className={`w-10 h-10 ${getStatusInfo(booking.status).color}`} />;
                          })()}
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1 font-medium">Booking Status</p>
                          <p className={`text-3xl font-bold ${getStatusInfo(booking.status).color}`}>
                            {getStatusInfo(booking.status).label}
                          </p>
                        </div>
                      </div>
                      <div className="text-center md:text-right px-6 py-4 bg-white/50 rounded-xl">
                        <p className="text-sm text-muted-foreground mb-1 font-medium">Tracking Code</p>
                        <p className="text-2xl font-mono font-bold text-foreground">
                          {booking.tracking_code}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Premium Booking Details */}
                <Card className="shadow-luxury rounded-2xl border border-border/50 bg-white">
                  <CardContent className="py-10 px-8">
                    <h3 className="font-display text-xl font-semibold mb-8 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-safari-gold/20 to-safari-amber/10 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-safari-gold" />
                      </div>
                      Booking Details
                    </h3>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Customer Name */}
                      <div className="flex items-start gap-4 p-4 rounded-xl bg-safari-cream/30 border border-safari-gold/10">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                          <Users className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground font-medium">Guest Name</p>
                          <p className="font-semibold text-lg">{booking.customer_name}</p>
                        </div>
                      </div>

                      {/* Travel Date */}
                      <div className="flex items-start gap-4 p-4 rounded-xl bg-safari-cream/30 border border-safari-gold/10">
                        <div className="w-12 h-12 rounded-xl bg-safari-gold/10 flex items-center justify-center shrink-0">
                          <Calendar className="w-6 h-6 text-safari-gold" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground font-medium">Travel Date</p>
                          <p className="font-semibold text-lg">{formatDate(booking.travel_date)}</p>
                        </div>
                      </div>

                      {/* Number of Guests */}
                      <div className="flex items-start gap-4 p-4 rounded-xl bg-safari-cream/30 border border-safari-gold/10">
                        <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
                          <Users className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground font-medium">Number of Guests</p>
                          <p className="font-semibold text-lg">{booking.number_of_guests} {booking.number_of_guests === 1 ? 'Guest' : 'Guests'}</p>
                        </div>
                      </div>

                      {/* Email */}
                      <div className="flex items-start gap-4 p-4 rounded-xl bg-safari-cream/30 border border-safari-gold/10">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                          <Mail className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground font-medium">Email</p>
                          <p className="font-semibold text-lg">{booking.customer_email}</p>
                        </div>
                      </div>

                      {/* Phone */}
                      {booking.customer_phone && (
                        <div className="flex items-start gap-4 p-4 rounded-xl bg-safari-cream/30 border border-safari-gold/10">
                          <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
                            <Phone className="w-6 h-6 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground font-medium">Phone</p>
                            <p className="font-semibold text-lg">{booking.customer_phone}</p>
                          </div>
                        </div>
                      )}

                      {/* Booking Date */}
                      <div className="flex items-start gap-4 p-4 rounded-xl bg-safari-cream/30 border border-safari-gold/10">
                        <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center shrink-0">
                          <Clock className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground font-medium">Booked On</p>
                          <p className="font-semibold text-lg">{formatDate(booking.created_at)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Special Requests */}
                    {booking.special_requests && (
                      <div className="mt-8 pt-8 border-t border-border/50">
                        <p className="text-sm text-muted-foreground mb-3 font-medium">Special Requests</p>
                        <p className="text-foreground bg-safari-cream/30 p-5 rounded-xl border border-safari-gold/10">
                          {booking.special_requests}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Download PDF - for confirmed/completed bookings */}
                {(booking.status === 'confirmed' || booking.status === 'completed') && (
                  <div className="mt-8">
                    <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 border-2 border-green-500/20 rounded-2xl">
                      <CardContent className="py-8 text-center">
                        <div className="w-20 h-20 rounded-2xl bg-green-500/20 flex items-center justify-center mx-auto mb-5">
                          <FileText className="w-10 h-10 text-green-600" />
                        </div>
                        <h3 className="font-display text-xl font-semibold text-green-700 mb-2">
                          {booking.status === 'confirmed' ? 'Your Booking is Confirmed!' : 'Trip Completed!'}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-6">
                          Download your official {booking.status === 'confirmed' ? 'confirmation' : 'completion'} voucher
                        </p>
                        <Button 
                          size="lg"
                          className="bg-gradient-to-r from-safari-gold to-safari-amber text-safari-night font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
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
                <div className="mt-10 text-center p-8 bg-safari-cream/30 rounded-2xl border border-safari-gold/10">
                  <p className="text-muted-foreground mb-5 font-medium">
                    Need help with your booking? Contact us:
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <Button 
                      size="lg"
                      variant="outline"
                      className="border-2 border-safari-gold text-safari-brown hover:bg-safari-gold/10 rounded-xl font-semibold"
                      onClick={() => window.open(`https://wa.me/255758241294?text=Hello! I need help with my booking ${booking.tracking_code}`, '_blank')}
                    >
                      WhatsApp Support
                    </Button>
                    <Button 
                      size="lg"
                      variant="outline"
                      className="border-2 rounded-xl font-semibold"
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
                <div className="grid grid-cols-3 gap-5 mb-10">
                  <div className="p-5 rounded-2xl bg-white border border-border/50 shadow-soft">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-amber-500/10 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-amber-500" />
                    </div>
                    <p className="font-semibold">Pending</p>
                    <p className="text-xs text-muted-foreground mt-1">Under Review</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-white border border-border/50 shadow-soft">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-green-500/10 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    </div>
                    <p className="font-semibold">Confirmed</p>
                    <p className="text-xs text-muted-foreground mt-1">Ready to Go</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-white border border-border/50 shadow-soft">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-blue-500/10 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-blue-500" />
                    </div>
                    <p className="font-semibold">Completed</p>
                    <p className="text-xs text-muted-foreground mt-1">Trip Finished</p>
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
