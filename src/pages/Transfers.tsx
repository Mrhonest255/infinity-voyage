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
      return data?.length ? data as Transfer[] : fallbackTransfers;
    },
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
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-primary/10 via-background to-safari-gold/5 overflow-hidden">
        <div className="absolute top-20 right-0 w-96 h-96 bg-safari-gold/10 rounded-full blur-3xl" />
        
        <div className="container-wide mx-auto px-4 md:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-3 mb-6">
              <Car className="w-8 h-8 text-safari-gold" />
              <span className="text-safari-gold text-sm font-semibold uppercase tracking-[0.2em]">
                Transportation
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-6">
              Airport <span className="text-gradient-gold">Transfer Services</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Reliable and comfortable transportation from Zanzibar Airport to your hotel.
              Start your vacation stress-free with our professional transfer service.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Transfer Options */}
      <section className="py-16 md:py-24">
        <div className="container-wide mx-auto px-4 md:px-8">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {transfers?.map((transfer, index) => {
                const TypeIcon = getTypeIcon(transfer.transfer_type);
                return (
                  <motion.div
                    key={transfer.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="safari-card hover-lift overflow-hidden h-full flex flex-col">
                      {/* Image */}
                      <div className="h-48 relative">
                        {transfer.featured_image ? (
                          <img 
                            src={transfer.featured_image} 
                            alt={transfer.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-safari-gold/20 flex items-center justify-center">
                            <Car className="w-16 h-16 text-muted-foreground/50" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-safari-night/60 to-transparent" />
                        <div className="absolute bottom-4 left-4">
                          <Badge className="badge-premium shadow-gold">
                            <TypeIcon className="w-3 h-3 mr-1" />
                            {getTypeLabel(transfer.transfer_type)}
                          </Badge>
                        </div>
                        {transfer.is_featured && (
                          <div className="absolute top-4 right-4">
                            <Badge className="bg-safari-gold text-safari-night">Featured</Badge>
                          </div>
                        )}
                      </div>

                      <CardContent className="p-6 flex-1 flex flex-col">
                        <h2 className="text-xl font-semibold mb-2">{transfer.title}</h2>
                        
                        {/* Route */}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                          <MapPin className="w-4 h-4 text-safari-gold" />
                          <span>{transfer.route_from} → {transfer.route_to}</span>
                        </div>

                        {transfer.duration && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                            <Clock className="w-4 h-4" />
                            <span>{transfer.duration}</span>
                          </div>
                        )}

                        <p className="text-muted-foreground text-sm mb-6">
                          {transfer.short_description || transfer.description}
                        </p>

                        {/* Pricing */}
                        <div className="grid grid-cols-2 gap-3 mb-6">
                          {transfer.price_small_group && (
                            <div className="bg-primary/5 rounded-xl p-3 text-center">
                              <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                                <Users className="w-3 h-3" />
                                <span className="text-xs">1-6 Pax</span>
                              </div>
                              <p className="text-2xl font-bold text-primary">${transfer.price_small_group}</p>
                            </div>
                          )}
                          {transfer.price_large_group && (
                            <div className="bg-safari-gold/5 rounded-xl p-3 text-center">
                              <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                                <Users className="w-3 h-3" />
                                <span className="text-xs">7-12 Pax</span>
                              </div>
                              <p className="text-2xl font-bold text-safari-gold">${transfer.price_large_group}</p>
                            </div>
                          )}
                        </div>

                        {/* Features */}
                        {transfer.features && transfer.features.length > 0 && (
                          <div className="space-y-2 mb-6 flex-1">
                            {transfer.features.slice(0, 4).map((feature, i) => (
                              <div key={i} className="flex items-center gap-2 text-sm">
                                <Check className="w-4 h-4 text-safari-gold shrink-0" />
                                <span>{feature}</span>
                              </div>
                            ))}
                            {transfer.features.length > 4 && (
                              <p className="text-xs text-muted-foreground pl-6">
                                +{transfer.features.length - 4} more features
                              </p>
                            )}
                          </div>
                        )}

                        {/* Dual Booking Options */}
                        <div className="flex gap-2 mt-auto">
                          <Button 
                            size="lg" 
                            variant="outline"
                            className="flex-1 border-2 border-primary hover:bg-primary/10"
                            onClick={() => openBookingForm(transfer)}
                          >
                            <Send className="w-4 h-4 mr-2" />
                            Book Now
                          </Button>
                          <Button 
                            size="lg" 
                            className="flex-1 bg-gradient-to-r from-green-600 to-green-500 text-white font-bold hover:from-green-500 hover:to-green-600"
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

      {/* Why Choose Us */}
      <section className="py-16 bg-muted/30">
        <div className="container-wide mx-auto px-4 md:px-8">
          <h2 className="text-3xl font-semibold text-center mb-12">
            Why Choose Our <span className="text-gradient-gold">Transfer Service</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {whyChooseUs.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-8 rounded-2xl bg-background shadow-soft"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mx-auto mb-6 shadow-elevated">
                  <item.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-safari-night via-safari-night/95 to-primary/20">
        <div className="container-wide mx-auto px-4 md:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-semibold text-primary-foreground mb-6">
              Book Your Airport Transfer Today
            </h2>
            <p className="text-primary-foreground/70 mb-8 max-w-xl mx-auto">
              Start your Zanzibar adventure with a smooth and hassle-free airport transfer
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="xl"
                variant="outline"
                className="border-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:border-primary-foreground/50"
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
                className="bg-gradient-to-r from-green-600 to-green-500 text-white font-bold shadow-lg hover:shadow-glow hover:from-green-500 hover:to-green-600"
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

      {/* Booking Form Dialog */}
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Car className="w-6 h-6 text-safari-gold" />
              Book Transfer
            </DialogTitle>
          </DialogHeader>

          {selectedTransfer && (
            <div className="space-y-6">
              {/* Transfer Info */}
              <div className="bg-muted/50 rounded-xl p-4">
                <h3 className="font-semibold text-lg">{selectedTransfer.title}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <MapPin className="w-4 h-4 text-safari-gold" />
                  <span>{selectedTransfer.route_from} → {selectedTransfer.route_to}</span>
                </div>
                <div className="flex gap-4 mt-3">
                  <div className="text-center">
                    <span className="text-xs text-muted-foreground">1-6 Pax</span>
                    <p className="text-xl font-bold text-primary">${selectedTransfer.price_small_group}</p>
                  </div>
                  <div className="text-center">
                    <span className="text-xs text-muted-foreground">7-12 Pax</span>
                    <p className="text-xl font-bold text-safari-gold">${selectedTransfer.price_large_group}</p>
                  </div>
                </div>
              </div>

              {/* Booking Form */}
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={bookingForm.name}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={bookingForm.email}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+255 xxx xxx xxx"
                      value={bookingForm.phone}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Travel Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {bookingForm.date ? format(bookingForm.date, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
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
                    <Label htmlFor="passengers">Number of Passengers</Label>
                    <select
                      id="passengers"
                      value={bookingForm.passengers}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, passengers: e.target.value }))}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      {[1,2,3,4,5,6,7,8,9,10,11,12].map(n => (
                        <option key={n} value={n}>{n} {n === 1 ? 'passenger' : 'passengers'}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="flight">Flight Number</Label>
                    <Input
                      id="flight"
                      placeholder="e.g., KQ 403"
                      value={bookingForm.flightNumber}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, flightNumber: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Special Requests</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any special requirements or notes..."
                    value={bookingForm.notes}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                  />
                </div>

                {/* Dual Submit Options */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-safari-gold to-safari-amber text-safari-night font-bold"
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
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-500 text-white font-bold"
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
