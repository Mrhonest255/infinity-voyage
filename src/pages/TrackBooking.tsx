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
  // ...existing code...
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Premium Hero Section */}
      <section className="relative pt-40 pb-24 bg-safari-night overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-safari-gold/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-safari-sunset/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        
        <div className="container-wide mx-auto px-4 md:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center justify-center w-28 h-28 rounded-[2rem] bg-white/5 backdrop-blur-xl border border-white/10 mb-10 shadow-2xl"
            >
              <Package className="w-14 h-14 text-safari-gold" />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-display text-5xl md:text-7xl font-bold text-white mb-6"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Track Your <span className="italic text-safari-gold">Booking</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl text-white/70 mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              Enter your unique tracking code to check the real-time status of your African adventure.
            </motion.p>

            {/* Premium Search Form */}
            <motion.form 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              onSubmit={handleSearch} 
              className="max-w-2xl mx-auto"
            >
              <div className="relative bg-white/10 backdrop-blur-2xl rounded-[2.5rem] p-3 border border-white/20 shadow-2xl group focus-within:border-safari-gold/50 transition-all duration-500">
                <Input
                  type="text"
                  placeholder="Enter tracking code (e.g., IV-ABC123)"
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
                  className="h-20 pl-10 pr-44 text-2xl font-mono tracking-[0.2em] border-0 focus-visible:ring-0 bg-transparent text-white placeholder:text-white/30"
                />
                <Button 
                  type="submit"
                  disabled={isLoading || !trackingCode.trim()}
                  className="absolute right-3 top-3 h-20 px-10 bg-safari-gold hover:bg-safari-amber text-safari-night font-bold rounded-full shadow-2xl transition-all duration-300 text-lg"
                >
                  {isLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      <Search className="w-6 h-6 mr-3" />
                      Track Now
                    </>
                  )}
                </Button>
              </div>
            </motion.form>
          </motion.div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-24 relative">
        <div className="container-wide mx-auto px-4 md:px-8">
          <AnimatePresence mode="wait">
            {isLoading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-3xl mx-auto py-12"
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
                className="max-w-2xl mx-auto text-center"
              >
                <Card className="border-2 border-dashed border-border/50 rounded-[3rem] bg-white shadow-2xl overflow-hidden">
                  <CardContent className="py-20 px-10">
                    <div className="w-24 h-24 rounded-[2rem] bg-red-50 flex items-center justify-center mx-auto mb-8">
                      <AlertCircle className="w-12 h-12 text-red-500" />
                    </div>
                    <h3 className="font-display text-3xl font-bold text-safari-night mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Booking Not Found</h3>
                    <p className="text-xl text-muted-foreground mb-8">
                      We couldn't find a booking with code <span className="font-mono font-bold text-safari-night">{searchCode}</span>
                    </p>
                    <div className="p-6 bg-muted/30 rounded-2xl inline-block">
                      <p className="text-sm text-muted-foreground">
                        Please check your tracking code and try again. <br />
                        The code should look like: <span className="font-bold text-safari-night">IV-XXXXXX</span>
                      </p>
                    </div>
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
                className="max-w-4xl mx-auto"
              >
                {/* Premium Status Card */}
                <Card className={`mb-12 border-0 rounded-[3rem] ${getStatusInfo(booking.status).bgColor} shadow-2xl overflow-hidden`}>
                  <CardContent className="p-12">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                      <div className="flex items-center gap-8">
                        <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center bg-white shadow-xl`}>
                          {(() => {
                            const StatusIcon = getStatusInfo(booking.status).icon;
                            return <StatusIcon className={`w-12 h-12 ${getStatusInfo(booking.status).color}`} />;
                          })()}
                        </div>
                        <div>
                          <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">Current Status</p>
                          <p className={`text-4xl font-bold ${getStatusInfo(booking.status).color}`}>
                            {getStatusInfo(booking.status).label}
                          </p>
                        </div>
                      </div>
                      <div className="text-center md:text-right px-10 py-6 bg-white/40 backdrop-blur-sm rounded-[2rem] border border-white/50">
                        <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">Tracking Code</p>
                        <p className="text-3xl font-mono font-bold text-safari-night">
                          {booking.tracking_code}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Premium Booking Details */}
                <Card className="shadow-2xl rounded-[3rem] border border-border/40 bg-white overflow-hidden">
                  <CardContent className="p-12 md:p-16">
                    <div className="flex items-center gap-4 mb-12">
                      <div className="w-12 h-12 rounded-2xl bg-safari-gold/10 flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-safari-gold" />
                      </div>
                      <h3 className="font-display text-3xl font-bold text-safari-night" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        Booking Details
                      </h3>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                      {/* Customer Name */}
                      <div className="flex items-start gap-6 p-8 rounded-[2rem] bg-muted/30 border border-border/50 group hover:bg-white hover:shadow-xl transition-all duration-500">
                        <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center shrink-0 group-hover:bg-safari-gold group-hover:text-white transition-colors">
                          <Users className="w-7 h-7 text-safari-gold group-hover:text-white" />
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Guest Name</p>
                          <p className="font-bold text-xl text-safari-night">{booking.customer_name}</p>
                        </div>
                      </div>

                      {/* Travel Date */}
                      <div className="flex items-start gap-6 p-8 rounded-[2rem] bg-muted/30 border border-border/50 group hover:bg-white hover:shadow-xl transition-all duration-500">
                        <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center shrink-0 group-hover:bg-safari-gold group-hover:text-white transition-colors">
                          <Calendar className="w-7 h-7 text-safari-gold group-hover:text-white" />
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Travel Date</p>
                          <p className="font-bold text-xl text-safari-night">{formatDate(booking.travel_date)}</p>
                        </div>
                      </div>

                      {/* Number of Guests */}
                      <div className="flex items-start gap-6 p-8 rounded-[2rem] bg-muted/30 border border-border/50 group hover:bg-white hover:shadow-xl transition-all duration-500">
                        <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center shrink-0 group-hover:bg-safari-gold group-hover:text-white transition-colors">
                          <Users className="w-7 h-7 text-safari-gold group-hover:text-white" />
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Group Size</p>
                          <p className="font-bold text-xl text-safari-night">{booking.number_of_guests} {booking.number_of_guests === 1 ? 'Guest' : 'Guests'}</p>
                        </div>
                      </div>

                      {/* Email */}
                      <div className="flex items-start gap-6 p-8 rounded-[2rem] bg-muted/30 border border-border/50 group hover:bg-white hover:shadow-xl transition-all duration-500">
                        <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center shrink-0 group-hover:bg-safari-gold group-hover:text-white transition-colors">
                          <Mail className="w-7 h-7 text-safari-gold group-hover:text-white" />
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Email Address</p>
                          <p className="font-bold text-xl text-safari-night truncate max-w-[200px]">{booking.customer_email}</p>
                        </div>
                      </div>

                      {/* Phone */}
                      {booking.customer_phone && (
                        <div className="flex items-start gap-6 p-8 rounded-[2rem] bg-muted/30 border border-border/50 group hover:bg-white hover:shadow-xl transition-all duration-500">
                          <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center shrink-0 group-hover:bg-safari-gold group-hover:text-white transition-colors">
                            <Phone className="w-7 h-7 text-safari-gold group-hover:text-white" />
                          </div>
                          <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Phone Number</p>
                            <p className="font-bold text-xl text-safari-night">{booking.customer_phone}</p>
                          </div>
                        </div>
                      )}

                      {/* Booking Date */}
                      <div className="flex items-start gap-6 p-8 rounded-[2rem] bg-muted/30 border border-border/50 group hover:bg-white hover:shadow-xl transition-all duration-500">
                        <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center shrink-0 group-hover:bg-safari-gold group-hover:text-white transition-colors">
                          <Clock className="w-7 h-7 text-safari-gold group-hover:text-white" />
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Booked On</p>
                          <p className="font-bold text-xl text-safari-night">{formatDate(booking.created_at)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Special Requests */}
                    {booking.special_requests && (
                      <div className="mt-12 pt-12 border-t border-border/50">
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Special Requests</p>
                        <div className="text-lg text-safari-night bg-muted/30 p-8 rounded-[2rem] border border-border/50 italic leading-relaxed">
                          "{booking.special_requests}"
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Download PDF - for confirmed/completed bookings */}
                {(booking.status === 'confirmed' || booking.status === 'completed') && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-12"
                  >
                    <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 border-2 border-green-500/20 rounded-[3rem] overflow-hidden">
                      <CardContent className="p-12 text-center">
                        <div className="w-24 h-24 rounded-[2rem] bg-white shadow-xl flex items-center justify-center mx-auto mb-8">
                          <FileText className="w-12 h-12 text-green-600" />
                        </div>
                        <h3 className="font-display text-3xl font-bold text-green-800 mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                          {booking.status === 'confirmed' ? 'Your Booking is Confirmed!' : 'Trip Completed!'}
                        </h3>
                        <p className="text-lg text-green-700/70 mb-10 max-w-md mx-auto">
                          Download your official {booking.status === 'confirmed' ? 'confirmation' : 'completion'} voucher for your records.
                        </p>
                        <Button 
                          size="xl"
                          className="bg-safari-night hover:bg-safari-gold hover:text-safari-night text-white font-bold rounded-full px-12 h-20 text-xl shadow-2xl transition-all duration-300"
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
                          <Download className="w-6 h-6 mr-3" />
                          Download Voucher (PDF)
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Contact Section */}
                <div className="mt-16 text-center p-12 bg-white/50 backdrop-blur-sm rounded-[3rem] border border-border/40 shadow-xl">
                  <h4 className="text-2xl font-bold text-safari-night mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Need Assistance?</h4>
                  <p className="text-muted-foreground mb-10 text-lg">
                    Our travel experts are here to help you with any questions regarding your booking.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-6">
                    <Button 
                      size="xl"
                      variant="outline"
                      className="border-2 border-safari-gold text-safari-night hover:bg-safari-gold hover:text-white rounded-full px-10 h-16 text-lg font-bold transition-all duration-300"
                      onClick={() => window.open(`https://wa.me/255758241294?text=Hello! I need help with my booking ${booking.tracking_code}`, '_blank')}
                    >
                      <MessageCircle className="w-6 h-6 mr-3" />
                      WhatsApp Support
                    </Button>
                    <Button 
                      size="xl"
                      variant="outline"
                      className="border-2 border-border/50 hover:border-safari-night hover:bg-safari-night hover:text-white rounded-full px-10 h-16 text-lg font-bold transition-all duration-300"
                      onClick={() => window.location.href = 'mailto:info@infinityvoyagetours.com'}
                    >
                      <Mail className="w-6 h-6 mr-3" />
                      Email Our Team
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
                className="max-w-4xl mx-auto text-center py-12"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                  {[
                    { icon: Clock, label: "Pending", desc: "Under Review", color: "text-amber-500", bg: "bg-amber-50" },
                    { icon: CheckCircle2, label: "Confirmed", desc: "Ready to Go", color: "text-green-500", bg: "bg-green-50" },
                    { icon: Sparkles, label: "Completed", desc: "Trip Finished", color: "text-blue-500", bg: "bg-blue-50" }
                  ].map((item) => (
                    <div key={item.label} className="p-10 rounded-[2.5rem] bg-white border border-border/40 shadow-xl hover:shadow-2xl transition-all duration-500 group">
                      <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl ${item.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                        <item.icon className={`w-10 h-10 ${item.color}`} />
                      </div>
                      <p className="font-bold text-2xl text-safari-night mb-2">{item.label}</p>
                      <p className="text-muted-foreground">{item.desc}</p>
                    </div>
                  ))}
                </div>
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-muted/50 rounded-full text-muted-foreground">
                  <AlertCircle className="w-5 h-5" />
                  <p className="text-sm font-medium">Enter your tracking code above to see your booking status</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <Footer />
    </div>
  );
}
