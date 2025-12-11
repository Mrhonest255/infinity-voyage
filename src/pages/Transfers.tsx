import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { SEO, SEO_KEYWORDS } from "@/components/SEO";
import { TransferCardSkeleton } from "@/components/ui/skeleton";
import { 
  Plane, 
  Car, 
  Clock, 
  Check, 
  Users,
  MapPin,
  Shield,
  MessageCircle,
  Loader2,
  Ship,
  Mail,
  CalendarIcon,
  Send,
  Phone
} from "lucide-react";

const WHATSAPP_NUMBER = '255758241294';
const ADMIN_EMAIL = 'info@infinityvoyagetours.com';

interface Transfer {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  transfer_type: string;
  route_from: string;
  route_to: string;
  price_small_group: number | null;
  price_large_group: number | null;
  vehicle_type: string | null;
  max_passengers: number | null;
  duration: string | null;
  featured_image: string | null;
  features: string[] | null;
  is_featured: boolean;
}

// Fallback static data if database is empty
const fallbackTransfers = [
  {
    id: "town",
    title: "Town Hotels",
    slug: "town-hotels",
    short_description: "Stone Town and central area hotels",
    description: "Comfortable transfer to all Stone Town hotels",
    transfer_type: "airport",
    route_from: "Zanzibar Airport (ZNZ)",
    route_to: "Stone Town Hotels",
    price_small_group: 27,
    price_large_group: 54,
    vehicle_type: "minivan",
    max_passengers: 12,
    duration: "20-30 minutes",
    featured_image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80",
    features: ["Meet & greet at the airport", "Air-conditioned vehicle", "Professional driver", "Complimentary water"],
    is_featured: true
  },
  {
    id: "beach",
    title: "Beach Hotels",
    slug: "beach-hotels",
    short_description: "North and East coast beach resorts",
    description: "Comfortable transfer to all beach hotels",
    transfer_type: "airport",
    route_from: "Zanzibar Airport (ZNZ)",
    route_to: "Beach Hotels",
    price_small_group: 60,
    price_large_group: 115,
    vehicle_type: "minivan",
    max_passengers: 12,
    duration: "45-75 minutes",
    featured_image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80",
    features: ["Meet & greet at the airport", "Air-conditioned vehicle", "Professional driver", "Complimentary water", "Scenic route option"],
    is_featured: true
  }
];

const whyChooseUs = [
  {
    icon: Clock,
    title: "Punctual Service",
    description: "We monitor flight arrivals to ensure we're always on time, even if your flight is delayed."
  },
  {
    icon: Shield,
    title: "Safe & Reliable",
    description: "Our professional drivers and well-maintained vehicles ensure a safe and comfortable journey."
  },
  {
    icon: Check,
    title: "Fixed Pricing",
    description: "No hidden fees or surprises. Our transparent pricing ensures you know exactly what you're paying."
  }
];

export default function Transfers() {
  const { toast } = useToast();
  const [selectedTransfer, setSelectedTransfer] = useState<Transfer | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: undefined as Date | undefined,
    passengers: '2',
    flightNumber: '',
    notes: ''
  });

  const { data: transfers, isLoading } = useQuery({
    queryKey: ['public-transfers'],
    queryFn: async () => {
      const { data, error } = await (supabase
        .from('transfers' as any)
        .select('*')
        .eq('is_published', true)
        .order('is_featured', { ascending: false }) as any);
      
      if (error) {
        console.error('Error fetching transfers:', error);
        return fallbackTransfers;
      }
      console.log('Transfers from DB:', data);
      return data?.length ? data as Transfer[] : fallbackTransfers;
    },
    staleTime: 0, // Always fetch fresh data
    refetchOnMount: 'always', // Refetch when component mounts
  });

  const openBookingForm = (transfer: Transfer) => {
    setSelectedTransfer(transfer);
    setIsBookingOpen(true);
  };

  const handleWhatsAppBooking = (transfer: Transfer) => {
    const message = `Hello! I would like to book a transfer:\n\n📍 Route: ${transfer.route_from} → ${transfer.route_to}\n💰 Price: $${transfer.price_small_group || 'TBD'} (1-6 pax)\n\nPlease confirm availability.`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTransfer || !bookingForm.name || !bookingForm.email || !bookingForm.date) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Save booking to database
      const { error: dbError } = await supabase.from('bookings').insert({
        customer_name: bookingForm.name,
        customer_email: bookingForm.email,
        customer_phone: bookingForm.phone,
        travel_date: bookingForm.date.toISOString(),
        number_of_guests: parseInt(bookingForm.passengers),
        special_requests: `Transfer: ${selectedTransfer.title}\nRoute: ${selectedTransfer.route_from} → ${selectedTransfer.route_to}\nFlight Number: ${bookingForm.flightNumber || 'Not provided'}\nNotes: ${bookingForm.notes || 'None'}`,
        total_price: parseInt(bookingForm.passengers) <= 6 
          ? selectedTransfer.price_small_group || 0 
          : selectedTransfer.price_large_group || 0,
        status: 'pending'
      });

      if (dbError) throw dbError;

      // Send email notification via Edge Function
      await supabase.functions.invoke('send-booking-email', {
        body: {
          to: ADMIN_EMAIL,
          customerName: bookingForm.name,
          customerEmail: bookingForm.email,
          customerPhone: bookingForm.phone,
          tourName: `Transfer: ${selectedTransfer.title}`,
          travelDate: format(bookingForm.date, 'PPP'),
          guests: bookingForm.passengers,
          specialRequests: `Route: ${selectedTransfer.route_from} → ${selectedTransfer.route_to}\nFlight: ${bookingForm.flightNumber || 'N/A'}\n${bookingForm.notes}`,
          totalPrice: parseInt(bookingForm.passengers) <= 6 
            ? selectedTransfer.price_small_group || 0 
            : selectedTransfer.price_large_group || 0
        }
      });

      toast({
        title: "Booking Submitted! 🎉",
        description: "We'll confirm your transfer shortly via email.",
      });

      setIsBookingOpen(false);
      setBookingForm({
        name: '', email: '', phone: '', date: undefined,
        passengers: '2', flightNumber: '', notes: ''
      });
    } catch (error: any) {
      console.error('Booking error:', error);
      toast({
        title: "Booking Failed",
        description: error.message || "Please try again or contact us directly.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppFromForm = () => {
    if (!selectedTransfer) return;
    const message = `🚗 *TRANSFER BOOKING REQUEST*
━━━━━━━━━━━━━━━━━
*Transfer:* ${selectedTransfer.title}
*Route:* ${selectedTransfer.route_from} → ${selectedTransfer.route_to}
*Name:* ${bookingForm.name || 'Not provided'}
*Email:* ${bookingForm.email || 'Not provided'}
*Phone:* ${bookingForm.phone || 'Not provided'}
*Date:* ${bookingForm.date ? format(bookingForm.date, 'PPP') : 'Not selected'}
*Passengers:* ${bookingForm.passengers}
*Flight Number:* ${bookingForm.flightNumber || 'Not provided'}
*Notes:* ${bookingForm.notes || 'None'}
━━━━━━━━━━━━━━━━━
Please confirm this transfer booking!`;
    
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'airport': return Plane;
      case 'port': return Ship;
      default: return Car;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'airport': return 'Airport Transfer';
      case 'port': return 'Port Transfer';
      case 'hotel': return 'Hotel Transfer';
      default: return 'Transfer';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Zanzibar Airport Transfers - Reliable Pickup & Drop Service"
        description="Book reliable Zanzibar airport transfers. Professional drivers, modern vehicles, fixed prices. Airport to Stone Town, Nungwi, Paje, Kendwa hotels. 24/7 service, flight monitoring included!"
        keywords={SEO_KEYWORDS.transfers}
        url="/transfers"
      />
      <Navbar />
      
      {/* Premium Hero Section */}
      <section className="relative pt-32 pb-24 bg-gradient-to-br from-safari-cream via-background to-safari-gold/5 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-gradient-to-br from-safari-gold/15 to-safari-amber/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/4 left-10 w-24 h-24 border border-safari-gold/20 rounded-full" />
        <div className="absolute bottom-1/4 right-20 w-16 h-16 border border-primary/20 rounded-full" />
        
        <div className="container-wide mx-auto px-4 md:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-3 mb-8 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full border border-safari-gold/30 shadow-soft"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-safari-gold to-safari-amber flex items-center justify-center">
                <Car className="w-5 h-5 text-white" />
              </div>
              <span className="text-safari-brown text-sm font-semibold uppercase tracking-[0.2em]">
                Premium Transportation
              </span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-6 leading-tight"
            >
              Airport <span className="text-gradient-gold">Transfer Services</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
            >
              Reliable and comfortable transportation from Zanzibar Airport to your hotel.
              Start your vacation stress-free with our professional transfer service.
            </motion.p>
            
            {/* Quick Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap justify-center gap-6 md:gap-10"
            >
              {[
                { value: '24/7', label: 'Service' },
                { value: '100%', label: 'Reliable' },
                { value: 'Fixed', label: 'Pricing' },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-safari-gold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Transfer Options */}
      <section className="py-20 md:py-28">
        <div className="container-wide mx-auto px-4 md:px-8">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-safari-gold text-sm font-semibold uppercase tracking-[0.2em]">Our Routes</span>
            <h2 className="font-display text-3xl md:text-4xl font-semibold mt-4">
              Available <span className="text-gradient-gold">Transfer Routes</span>
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              Choose from our selection of transfer routes covering all major destinations in Zanzibar
            </p>
          </motion.div>
          
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <TransferCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {transfers?.map((transfer, index) => {
                const TypeIcon = getTypeIcon(transfer.transfer_type);
                return (
                  <motion.div
                    key={transfer.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="group bg-white rounded-2xl border border-border/50 shadow-soft hover:shadow-luxury transition-all duration-500 overflow-hidden h-full flex flex-col">
                      {/* Image */}
                      <div className="h-52 relative overflow-hidden">
                        {transfer.featured_image ? (
                          <img 
                            src={transfer.featured_image} 
                            alt={transfer.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-safari-cream to-safari-gold/20 flex items-center justify-center">
                            <Car className="w-16 h-16 text-safari-gold/50" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-safari-night/70 via-safari-night/20 to-transparent" />
                        <div className="absolute bottom-4 left-4">
                          <Badge className="bg-white/95 text-safari-brown font-semibold shadow-lg border-0">
                            <TypeIcon className="w-3 h-3 mr-1.5 text-safari-gold" />
                            {getTypeLabel(transfer.transfer_type)}
                          </Badge>
                        </div>
                        {transfer.is_featured && (
                          <div className="absolute top-4 right-4">
                            <Badge className="bg-gradient-to-r from-safari-gold to-safari-amber text-white font-semibold border-0 shadow-lg">
                              ★ Featured
                            </Badge>
                          </div>
                        )}
                      </div>

                      <CardContent className="p-6 flex-1 flex flex-col">
                        <h2 className="font-display text-xl font-semibold mb-3 group-hover:text-safari-gold transition-colors">{transfer.title}</h2>
                        
                        {/* Route */}
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4 p-3 bg-safari-cream/50 rounded-xl">
                          <MapPin className="w-5 h-5 text-safari-gold shrink-0" />
                          <span className="font-medium">{transfer.route_from} → {transfer.route_to}</span>
                        </div>

                        {transfer.duration && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                            <Clock className="w-4 h-4 text-safari-gold" />
                            <span>{transfer.duration}</span>
                          </div>
                        )}

                        <p className="text-muted-foreground text-sm mb-6 line-clamp-2">
                          {transfer.short_description || transfer.description}
                        </p>

                        {/* Premium Pricing */}
                        <div className="grid grid-cols-2 gap-3 mb-6">
                          {transfer.price_small_group && (
                            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-4 text-center border border-primary/20">
                              <div className="flex items-center justify-center gap-1.5 text-muted-foreground mb-2">
                                <Users className="w-4 h-4 text-primary" />
                                <span className="text-xs font-medium">1-6 Pax</span>
                              </div>
                              <p className="text-2xl font-bold text-primary">${transfer.price_small_group}</p>
                            </div>
                          )}
                          {transfer.price_large_group && (
                            <div className="bg-gradient-to-br from-safari-gold/5 to-safari-gold/15 rounded-xl p-4 text-center border border-safari-gold/30">
                              <div className="flex items-center justify-center gap-1.5 text-muted-foreground mb-2">
                                <Users className="w-4 h-4 text-safari-gold" />
                                <span className="text-xs font-medium">7-12 Pax</span>
                              </div>
                              <p className="text-2xl font-bold text-safari-gold">${transfer.price_large_group}</p>
                            </div>
                          )}
                        </div>

                        {/* Features */}
                        {transfer.features && transfer.features.length > 0 && (
                          <div className="space-y-2.5 mb-6 flex-1">
                            {transfer.features.slice(0, 4).map((feature, i) => (
                              <div key={i} className="flex items-center gap-2.5 text-sm">
                                <div className="w-5 h-5 rounded-full bg-safari-gold/10 flex items-center justify-center shrink-0">
                                  <Check className="w-3 h-3 text-safari-gold" />
                                </div>
                                <span>{feature}</span>
                              </div>
                            ))}
                            {transfer.features.length > 4 && (
                              <p className="text-xs text-muted-foreground pl-7">
                                +{transfer.features.length - 4} more features
                              </p>
                            )}
                          </div>
                        )}

                        {/* Dual Booking Options */}
                        <div className="flex gap-3 mt-auto pt-4 border-t border-border/50">
                          <Button 
                            size="lg" 
                            variant="outline"
                            className="flex-1 border-2 border-safari-gold text-safari-brown hover:bg-safari-gold/10 rounded-xl font-semibold"
                            onClick={() => openBookingForm(transfer)}
                          >
                            <Send className="w-4 h-4 mr-2" />
                            Book Now
                          </Button>
                          <Button 
                            size="lg" 
                            className="flex-1 bg-gradient-to-r from-green-600 to-green-500 text-white font-bold hover:from-green-500 hover:to-green-600 rounded-xl shadow-lg"
                            onClick={() => handleWhatsAppBooking(transfer)}
                          >
                            <MessageCircle className="w-4 h-4 mr-2" />
                            WhatsApp
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us - Premium Section */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-safari-cream/50 via-background to-safari-gold/5 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-10 right-20 w-32 h-32 border border-safari-gold/20 rounded-full" />
        <div className="absolute bottom-20 left-10 w-24 h-24 border border-primary/15 rounded-full" />
        
        <div className="container-wide mx-auto px-4 md:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-safari-gold text-sm font-semibold uppercase tracking-[0.2em]">Our Promise</span>
            <h2 className="font-display text-3xl md:text-4xl font-semibold mt-4 mb-4">
              Why Choose Our <span className="text-gradient-gold">Transfer Service</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We ensure your journey is comfortable, safe, and memorable from the moment you land
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {whyChooseUs.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group text-center p-8 rounded-3xl bg-white border border-border/50 shadow-soft hover:shadow-luxury transition-all duration-500"
              >
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-safari-gold/20 to-safari-amber/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-safari-gold to-safari-amber flex items-center justify-center shadow-lg">
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                </div>
                <h3 className="font-display text-xl font-semibold mb-3 group-hover:text-safari-gold transition-colors">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium CTA Section */}
      <section className="py-24 bg-gradient-to-br from-safari-night via-safari-night/95 to-primary/20 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-safari-gold/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        <div className="absolute top-1/4 right-20 w-20 h-20 border border-white/10 rounded-full" />
        <div className="absolute bottom-1/4 left-20 w-16 h-16 border border-safari-gold/20 rounded-full" />
        
        <div className="container-wide mx-auto px-4 md:px-8 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 mb-8 px-5 py-2.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"
            >
              <Car className="w-5 h-5 text-safari-gold" />
              <span className="text-white/90 text-sm font-medium">Ready When You Are</span>
            </motion.div>
            
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-6">
              Book Your Airport Transfer <span className="text-safari-gold">Today</span>
            </h2>
            <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto">
              Start your Zanzibar adventure with a smooth and hassle-free airport transfer
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="xl"
                variant="outline"
                className="border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 rounded-xl font-semibold"
                onClick={() => {
                  if (transfers && transfers.length > 0) {
                    openBookingForm(transfers[0]);
                  }
                }}
              >
                <Send className="w-5 h-5 mr-2" />
                Book Now
              </Button>
              <Button 
                size="xl"
                className="bg-gradient-to-r from-green-600 to-green-500 text-white font-bold shadow-lg hover:shadow-glow hover:from-green-500 hover:to-green-600 rounded-xl"
                onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=Hello! I would like to book an airport transfer.`, "_blank")}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Book via WhatsApp
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />

      {/* Premium Booking Form Dialog */}
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border-border/50">
          <DialogHeader className="pb-4 border-b border-border/50">
            <DialogTitle className="font-display text-2xl font-bold flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-safari-gold to-safari-amber flex items-center justify-center">
                <Car className="w-5 h-5 text-white" />
              </div>
              Book Transfer
            </DialogTitle>
          </DialogHeader>

          {selectedTransfer && (
            <div className="space-y-6 pt-2">
              {/* Transfer Info Card */}
              <div className="bg-gradient-to-br from-safari-cream/50 to-safari-gold/5 rounded-xl p-5 border border-safari-gold/20">
                <h3 className="font-display font-semibold text-lg mb-2">{selectedTransfer.title}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 text-safari-gold" />
                  <span>{selectedTransfer.route_from} → {selectedTransfer.route_to}</span>
                </div>
                <div className="flex gap-6 mt-4 pt-4 border-t border-safari-gold/20">
                  <div className="text-center">
                    <span className="text-xs text-muted-foreground font-medium">1-6 Pax</span>
                    <p className="text-2xl font-bold text-primary">${selectedTransfer.price_small_group}</p>
                  </div>
                  <div className="text-center">
                    <span className="text-xs text-muted-foreground font-medium">7-12 Pax</span>
                    <p className="text-2xl font-bold text-safari-gold">${selectedTransfer.price_large_group}</p>
                  </div>
                </div>
              </div>

              {/* Premium Booking Form */}
              <form onSubmit={handleFormSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-foreground">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={bookingForm.name}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, name: e.target.value }))}
                      required
                      className="h-12 rounded-xl border-border/50 bg-background focus:border-safari-gold focus:ring-safari-gold/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-foreground">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={bookingForm.email}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                      className="h-12 rounded-xl border-border/50 bg-background focus:border-safari-gold focus:ring-safari-gold/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium text-foreground">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+255 xxx xxx xxx"
                      value={bookingForm.phone}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="h-12 rounded-xl border-border/50 bg-background focus:border-safari-gold focus:ring-safari-gold/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground">Travel Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full h-12 justify-start text-left font-normal rounded-xl border-border/50 hover:border-safari-gold"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 text-safari-gold" />
                          {bookingForm.date ? format(bookingForm.date, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 rounded-xl" align="start">
                        <Calendar
                          mode="single"
                          selected={bookingForm.date}
                          onSelect={(date) => setBookingForm(prev => ({ ...prev, date }))}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="passengers" className="text-sm font-medium text-foreground">Number of Passengers</Label>
                    <select
                      id="passengers"
                      value={bookingForm.passengers}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, passengers: e.target.value }))}
                      className="flex h-12 w-full rounded-xl border border-border/50 bg-background px-4 py-2 text-sm focus:border-safari-gold focus:outline-none focus:ring-2 focus:ring-safari-gold/20"
                    >
                      {[1,2,3,4,5,6,7,8,9,10,11,12].map(n => (
                        <option key={n} value={n}>{n} {n === 1 ? 'passenger' : 'passengers'}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="flight" className="text-sm font-medium text-foreground">Flight Number</Label>
                    <Input
                      id="flight"
                      placeholder="e.g., KQ 403"
                      value={bookingForm.flightNumber}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, flightNumber: e.target.value }))}
                      className="h-12 rounded-xl border-border/50 bg-background focus:border-safari-gold focus:ring-safari-gold/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-sm font-medium text-foreground">Special Requests</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any special requirements or notes..."
                    value={bookingForm.notes}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    className="rounded-xl border-border/50 bg-background focus:border-safari-gold focus:ring-safari-gold/20 resize-none"
                  />
                </div>

                {/* Premium Submit Options */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border/50">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 h-12 bg-gradient-to-r from-safari-gold to-safari-amber text-safari-night font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4 mr-2" />
                        Submit Booking
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    onClick={handleWhatsAppFromForm}
                    className="flex-1 h-12 bg-gradient-to-r from-green-600 to-green-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Book via WhatsApp
                  </Button>
                </div>
              </form>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
