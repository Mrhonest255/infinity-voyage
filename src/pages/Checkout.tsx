import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCart, CartItem } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { SEO } from "@/components/SEO";
import {
  ShoppingBag,
  Trash2,
  Calendar as CalendarIcon,
  Users,
  Mail,
  Phone,
  User,
  MapPin,
  Clock,
  CheckCircle2,
  ArrowRight,
  Loader2,
  MessageCircle,
  Shield,
  Award,
  Sparkles,
} from "lucide-react";

const Checkout = () => {
  const navigate = useNavigate();
  const { items, removeItem, clearCart, totalPrice } = useCart();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    nationality: "",
    travelDate: undefined as Date | undefined,
    travelers: "2",
    specialRequests: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add some tours to your cart before booking.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.fullName || !formData.email || !formData.phone || !formData.travelDate) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Create booking entries for each cart item
      const bookingPromises = items.map(async (item) => {
        const { error } = await supabase.from("bookings").insert({
          tour_id: item.type === "tour" ? item.id : null,
          customer_name: formData.fullName,
          customer_email: formData.email,
          customer_phone: formData.phone,
          travel_date: formData.travelDate?.toISOString().split("T")[0] || new Date().toISOString().split("T")[0],
          number_of_guests: parseInt(formData.travelers),
          special_requests: `${item.title} (Qty: ${item.quantity})${formData.nationality ? ` | Nationality: ${formData.nationality}` : ""}${formData.specialRequests ? ` | Notes: ${formData.specialRequests}` : ""}`,
          total_price: item.price * item.quantity,
          status: "pending",
        });
        
        if (error) throw error;
      });

      await Promise.all(bookingPromises);

      // Clear cart after successful booking
      clearCart();

      toast({
        title: "Booking Submitted! 🎉",
        description: "We'll contact you within 24 hours to confirm your booking.",
      });

      navigate("/thank-you");
    } catch (error: any) {
      console.error("Booking error:", error);
      toast({
        title: "Booking failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppSubmit = () => {
    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add some tours to your cart.",
        variant: "destructive",
      });
      return;
    }

    const itemsList = items
      .map((item) => `• ${item.title} (x${item.quantity}) - $${(item.price * item.quantity).toLocaleString()}`)
      .join("\n");

    const message = `🌍 *New Booking Request*

*Tours Selected:*
${itemsList}

*Total: $${totalPrice.toLocaleString()}*

*Customer Details:*
👤 Name: ${formData.fullName || "Not provided"}
📧 Email: ${formData.email || "Not provided"}
📱 Phone: ${formData.phone || "Not provided"}
🌎 Nationality: ${formData.nationality || "Not provided"}
📅 Travel Date: ${formData.travelDate ? format(formData.travelDate, "PPP") : "Not specified"}
👥 Travelers: ${formData.travelers}

*Special Requests:*
${formData.specialRequests || "None"}

Please confirm availability and send me a quote!`;

    const whatsappUrl = `https://wa.me/255758241294?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <SEO title="Checkout - Infinity Voyage Tours" description="Complete your booking" />
        <Navbar />
        
        <main className="flex-1 flex items-center justify-center py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md mx-auto px-4"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-safari-gold/10 to-safari-amber/10 flex items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-safari-gold/50" />
            </div>
            <h1 className="font-display text-3xl font-semibold mb-4">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-8">
              Browse our amazing tours and add your favorites to the cart to start booking.
            </p>
            <Button
              onClick={() => navigate("/safaris")}
              size="lg"
              className="bg-gradient-to-r from-safari-gold to-safari-amber text-safari-night font-bold rounded-xl"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Explore Tours
            </Button>
          </motion.div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO title="Checkout - Complete Your Booking" description="Review your selected tours and complete your booking with Infinity Voyage Tours" />
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
            className="text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-3 mb-8 px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20"
            >
              <ShoppingBag className="w-5 h-5 text-safari-gold" />
              <span className="text-white/90 text-sm font-bold uppercase tracking-widest">
                {items.length} {items.length === 1 ? "Tour" : "Tours"} in Cart
              </span>
            </motion.div>
            
            <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Complete Your <span className="italic text-safari-gold">Booking</span>
            </h1>
            <p className="text-white/70 text-xl max-w-2xl mx-auto leading-relaxed">
              Review your selected adventures and provide your details to finalize your extraordinary journey through Tanzania.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 relative -mt-12">
        <div className="container-wide mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-12 gap-12">
            {/* Cart Items - Left Side */}
            <div className="lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className="sticky top-32"
              >
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 rounded-2xl bg-safari-gold/10 flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6 text-safari-gold" />
                  </div>
                  <h2 className="font-display text-3xl font-bold text-safari-night" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    Your Selection
                  </h2>
                </div>

                <div className="space-y-6 mb-10">
                  {items.map((item, index) => (
                    <CartItemCard key={item.id} item={item} index={index} onRemove={() => removeItem(item.id)} />
                  ))}
                </div>

                {/* Total Card */}
                <div className="p-10 bg-safari-night rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-safari-gold/10 rounded-full blur-3xl group-hover:bg-safari-gold/20 transition-all duration-700" />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-white/60 font-medium uppercase tracking-widest text-sm">Estimated Total</span>
                      <Sparkles className="w-5 h-5 text-safari-gold" />
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold text-safari-gold">
                        ${totalPrice.toLocaleString()}
                      </span>
                      <span className="text-white/40 text-sm">USD</span>
                    </div>
                    <div className="mt-8 pt-8 border-t border-white/10">
                      <p className="text-white/50 text-sm leading-relaxed">
                        * Final price will be confirmed by our travel experts based on your specific travel dates and group size.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Booking Form - Right Side */}
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="border-0 shadow-2xl rounded-[3rem] bg-white overflow-hidden">
                  <CardContent className="p-0">
                    {/* Form Header */}
                    <div className="bg-safari-gold p-12 text-safari-night">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-safari-night/10 flex items-center justify-center">
                          <User className="w-6 h-6" />
                        </div>
                        <h2 className="font-display text-3xl font-bold" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                          Guest Information
                        </h2>
                      </div>
                      <p className="text-safari-night/70 text-lg">Please provide your details to receive a personalized quote.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-10 md:p-16 space-y-10">
                      {/* Personal Info Grid */}
                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <Label htmlFor="fullName" className="text-sm font-bold uppercase tracking-widest text-safari-night">Full Name *</Label>
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-safari-gold" />
                            <Input
                              id="fullName"
                              value={formData.fullName}
                              onChange={(e) => setFormData((p) => ({ ...p, fullName: e.target.value }))}
                              placeholder="John Doe"
                              className="h-14 pl-12 rounded-2xl border-border/50 focus:ring-safari-gold/20 focus:border-safari-gold text-lg"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="email" className="text-sm font-bold uppercase tracking-widest text-safari-night">Email Address *</Label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-safari-gold" />
                            <Input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                              placeholder="john@example.com"
                              className="h-14 pl-12 rounded-2xl border-border/50 focus:ring-safari-gold/20 focus:border-safari-gold text-lg"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="phone" className="text-sm font-bold uppercase tracking-widest text-safari-night">Phone Number *</Label>
                          <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-safari-gold" />
                            <Input
                              id="phone"
                              value={formData.phone}
                              onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                              placeholder="+1 234 567 8900"
                              className="h-14 pl-12 rounded-2xl border-border/50 focus:ring-safari-gold/20 focus:border-safari-gold text-lg"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="nationality" className="text-sm font-bold uppercase tracking-widest text-safari-night">Nationality</Label>
                          <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-safari-gold" />
                            <Input
                              id="nationality"
                              value={formData.nationality}
                              onChange={(e) => setFormData((p) => ({ ...p, nationality: e.target.value }))}
                              placeholder="e.g. American, British"
                              className="h-14 pl-12 rounded-2xl border-border/50 focus:ring-safari-gold/20 focus:border-safari-gold text-lg"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Travel Details */}
                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <Label className="text-sm font-bold uppercase tracking-widest text-safari-night">Preferred Travel Date *</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full h-14 justify-start text-left font-normal rounded-2xl border-border/50 hover:border-safari-gold hover:bg-safari-gold/5 transition-all text-lg"
                              >
                                <CalendarIcon className="mr-3 h-5 w-5 text-safari-gold" />
                                {formData.travelDate ? format(formData.travelDate, "PPP") : "Select date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 rounded-2xl shadow-2xl border-border/40" align="start">
                              <Calendar
                                mode="single"
                                selected={formData.travelDate}
                                onSelect={(date) => setFormData((p) => ({ ...p, travelDate: date }))}
                                disabled={(date) => date < new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>

                        <div className="space-y-3">
                          <Label className="text-sm font-bold uppercase tracking-widest text-safari-night">Number of Travelers *</Label>
                          <Select
                            value={formData.travelers}
                            onValueChange={(value) => setFormData((p) => ({ ...p, travelers: value }))}
                          >
                            <SelectTrigger className="h-14 rounded-2xl border-border/50 focus:ring-safari-gold/20 focus:border-safari-gold text-lg">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl shadow-2xl border-border/40">
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                <SelectItem key={num} value={num.toString()} className="rounded-xl">
                                  {num} {num === 1 ? "person" : "people"}
                                </SelectItem>
                              ))}
                              <SelectItem value="10+" className="rounded-xl">10+ people (Group)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Special Requests */}
                      <div className="space-y-3">
                        <Label htmlFor="specialRequests" className="text-sm font-bold uppercase tracking-widest text-safari-night">
                          Special Requests or Questions
                        </Label>
                        <Textarea
                          id="specialRequests"
                          value={formData.specialRequests}
                          onChange={(e) => setFormData((p) => ({ ...p, specialRequests: e.target.value }))}
                          placeholder="Dietary requirements, mobility needs, special occasions, or any questions..."
                          className="min-h-[150px] rounded-[2rem] border-border/50 focus:ring-safari-gold/20 focus:border-safari-gold resize-none p-6 text-lg"
                        />
                      </div>

                      {/* Trust Badges */}
                      <div className="grid grid-cols-3 gap-6 py-10 border-y border-border/40">
                        <div className="text-center group">
                          <div className="w-14 h-14 rounded-2xl bg-safari-gold/10 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                            <Shield className="w-7 h-7 text-safari-gold" />
                          </div>
                          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Secure Booking</span>
                        </div>
                        <div className="text-center group">
                          <div className="w-14 h-14 rounded-2xl bg-safari-gold/10 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                            <Award className="w-7 h-7 text-safari-gold" />
                          </div>
                          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Best Price</span>
                        </div>
                        <div className="text-center group">
                          <div className="w-14 h-14 rounded-2xl bg-safari-gold/10 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                            <CheckCircle2 className="w-7 h-7 text-safari-gold" />
                          </div>
                          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">24hr Response</span>
                        </div>
                      </div>

                      {/* Submit Buttons */}
                      <div className="flex flex-col sm:flex-row gap-6 pt-4">
                        <Button
                          type="submit"
                          disabled={loading}
                          className="flex-1 h-20 bg-safari-night hover:bg-safari-gold hover:text-safari-night text-white font-bold rounded-full text-xl shadow-2xl transition-all duration-300 group"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <Mail className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                              Submit Request
                            </>
                          )}
                        </Button>

                        <Button
                          type="button"
                          onClick={handleWhatsAppSubmit}
                          className="flex-1 h-20 bg-green-600 hover:bg-green-500 text-white font-bold rounded-full text-xl shadow-2xl transition-all duration-300 group"
                        >
                          <MessageCircle className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                          Book via WhatsApp
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

// Cart Item Card Component
function CartItemCard({ item, index, onRemove }: { item: CartItem; index: number; onRemove: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex gap-6 p-6 bg-white rounded-[2rem] border border-border/40 shadow-xl hover:shadow-2xl transition-all duration-500 group"
    >
      {/* Image */}
      <div className="w-28 h-28 rounded-2xl overflow-hidden flex-shrink-0 bg-safari-cream relative">
        {item.image ? (
          <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <MapPin className="w-10 h-10 text-safari-gold/50" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start gap-4">
            <h4 className="font-bold text-safari-night text-lg line-clamp-2 leading-tight group-hover:text-safari-gold transition-colors">{item.title}</h4>
            <button
              onClick={onRemove}
              className="p-2 rounded-xl hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-all duration-300 flex-shrink-0"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          {item.duration && (
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground font-medium">
              <Clock className="w-4 h-4 text-safari-gold" />
              <span>{item.duration}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="px-3 py-1 bg-muted/50 rounded-full text-xs font-bold text-muted-foreground">
            Qty: {item.quantity}
          </div>
          <span className="font-bold text-safari-gold text-2xl">
            ${(item.price * item.quantity).toLocaleString()}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default Checkout;
