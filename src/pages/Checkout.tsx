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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-safari-cream/30 to-background">
      <SEO title="Checkout - Complete Your Booking" description="Review your selected tours and complete your booking with Infinity Voyage Tours" />
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 bg-gradient-to-br from-safari-night via-safari-brown to-safari-night overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-safari-gold rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-safari-amber rounded-full blur-3xl" />
        </div>
        
        <div className="container-wide mx-auto px-4 md:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white"
          >
            <div className="inline-flex items-center gap-3 mb-6 px-5 py-2.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <ShoppingBag className="w-5 h-5 text-safari-gold" />
              <span className="text-sm font-medium">{items.length} {items.length === 1 ? "Tour" : "Tours"} Selected</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-semibold mb-4">
              Complete Your <span className="text-safari-gold">Booking</span>
            </h1>
            <p className="text-white/70 max-w-xl mx-auto">
              Review your selected tours and fill in your details to book your African adventure
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-20 -mt-8">
        <div className="container-wide mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Cart Items - Left Side */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h2 className="font-display text-2xl font-semibold mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-safari-gold to-safari-amber flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 text-white" />
                  </div>
                  Your Selected Tours
                </h2>

                <div className="space-y-4">
                  {items.map((item, index) => (
                    <CartItemCard key={item.id} item={item} index={index} onRemove={() => removeItem(item.id)} />
                  ))}
                </div>

                {/* Total */}
                <div className="mt-6 p-6 bg-gradient-to-br from-safari-gold/10 to-safari-amber/5 rounded-2xl border border-safari-gold/20">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium">Total Estimated Price</span>
                    <span className="font-display text-3xl font-bold text-safari-gold">
                      ${totalPrice.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Final price may vary based on dates and availability
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Booking Form - Right Side */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="border border-border/50 shadow-luxury rounded-2xl bg-white overflow-hidden">
                  <CardContent className="p-0">
                    {/* Form Header */}
                    <div className="bg-gradient-to-r from-safari-gold to-safari-amber p-6 text-safari-night">
                      <h2 className="font-display text-2xl font-semibold flex items-center gap-3">
                        <User className="w-6 h-6" />
                        Your Details
                      </h2>
                      <p className="text-safari-night/70 mt-1">Fill in your information to complete the booking</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                      {/* Personal Info Grid */}
                      <div className="grid md:grid-cols-2 gap-5">
                        <div>
                          <Label htmlFor="fullName" className="text-sm font-medium flex items-center gap-2">
                            <User className="w-4 h-4 text-safari-gold" />
                            Full Name *
                          </Label>
                          <Input
                            id="fullName"
                            value={formData.fullName}
                            onChange={(e) => setFormData((p) => ({ ...p, fullName: e.target.value }))}
                            placeholder="John Doe"
                            className="mt-2 h-12 rounded-xl border-border/50 focus:border-safari-gold"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                            <Mail className="w-4 h-4 text-safari-gold" />
                            Email *
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                            placeholder="john@example.com"
                            className="mt-2 h-12 rounded-xl border-border/50 focus:border-safari-gold"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
                            <Phone className="w-4 h-4 text-safari-gold" />
                            Phone Number *
                          </Label>
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                            placeholder="+1 234 567 8900"
                            className="mt-2 h-12 rounded-xl border-border/50 focus:border-safari-gold"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="nationality" className="text-sm font-medium flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-safari-gold" />
                            Nationality
                          </Label>
                          <Input
                            id="nationality"
                            value={formData.nationality}
                            onChange={(e) => setFormData((p) => ({ ...p, nationality: e.target.value }))}
                            placeholder="e.g. American, British"
                            className="mt-2 h-12 rounded-xl border-border/50 focus:border-safari-gold"
                          />
                        </div>
                      </div>

                      {/* Travel Details */}
                      <div className="grid md:grid-cols-2 gap-5">
                        <div>
                          <Label className="text-sm font-medium flex items-center gap-2">
                            <CalendarIcon className="w-4 h-4 text-safari-gold" />
                            Travel Date *
                          </Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full mt-2 h-12 justify-start text-left font-normal rounded-xl border-border/50 hover:border-safari-gold"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4 text-safari-gold" />
                                {formData.travelDate ? format(formData.travelDate, "PPP") : "Select date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 rounded-xl" align="start">
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

                        <div>
                          <Label className="text-sm font-medium flex items-center gap-2">
                            <Users className="w-4 h-4 text-safari-gold" />
                            Number of Travelers *
                          </Label>
                          <Select
                            value={formData.travelers}
                            onValueChange={(value) => setFormData((p) => ({ ...p, travelers: value }))}
                          >
                            <SelectTrigger className="mt-2 h-12 rounded-xl border-border/50 focus:border-safari-gold">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                <SelectItem key={num} value={num.toString()}>
                                  {num} {num === 1 ? "person" : "people"}
                                </SelectItem>
                              ))}
                              <SelectItem value="10+">10+ people (Group)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Special Requests */}
                      <div>
                        <Label htmlFor="specialRequests" className="text-sm font-medium">
                          Special Requests or Questions
                        </Label>
                        <Textarea
                          id="specialRequests"
                          value={formData.specialRequests}
                          onChange={(e) => setFormData((p) => ({ ...p, specialRequests: e.target.value }))}
                          placeholder="Dietary requirements, mobility needs, special occasions, or any questions..."
                          className="mt-2 min-h-[100px] rounded-xl border-border/50 focus:border-safari-gold resize-none"
                        />
                      </div>

                      {/* Trust Badges */}
                      <div className="grid grid-cols-3 gap-4 py-4 border-y border-border/50">
                        <div className="text-center">
                          <Shield className="w-6 h-6 text-safari-gold mx-auto mb-2" />
                          <span className="text-xs text-muted-foreground">Secure Booking</span>
                        </div>
                        <div className="text-center">
                          <Award className="w-6 h-6 text-safari-gold mx-auto mb-2" />
                          <span className="text-xs text-muted-foreground">Best Price</span>
                        </div>
                        <div className="text-center">
                          <CheckCircle2 className="w-6 h-6 text-safari-gold mx-auto mb-2" />
                          <span className="text-xs text-muted-foreground">24hr Confirmation</span>
                        </div>
                      </div>

                      {/* Submit Buttons */}
                      <div className="flex flex-col sm:flex-row gap-4">
                        <motion.button
                          type="submit"
                          disabled={loading}
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex-1 h-14 rounded-2xl bg-gradient-to-r from-safari-gold via-safari-amber to-safari-gold bg-[length:200%_100%] text-safari-night font-bold text-lg shadow-lg hover:shadow-gold transition-all duration-300 flex items-center justify-center gap-2 animate-shimmer disabled:opacity-50"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <Mail className="w-5 h-5" />
                              Submit Booking Request
                            </>
                          )}
                        </motion.button>

                        <motion.button
                          type="button"
                          onClick={handleWhatsAppSubmit}
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex-1 h-14 rounded-2xl bg-gradient-to-r from-green-600 to-green-500 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          <MessageCircle className="w-5 h-5" />
                          Book via WhatsApp
                        </motion.button>
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
      className="flex gap-4 p-4 bg-white rounded-2xl border border-border/50 shadow-soft hover:shadow-md transition-shadow"
    >
      {/* Image */}
      <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-safari-cream">
        {item.image ? (
          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <MapPin className="w-8 h-8 text-safari-gold/50" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <h4 className="font-semibold text-foreground line-clamp-2">{item.title}</h4>
          <button
            onClick={onRemove}
            className="p-1.5 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors flex-shrink-0"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {item.duration && (
          <div className="flex items-center gap-1.5 mt-1 text-sm text-muted-foreground">
            <Clock className="w-3.5 h-3.5 text-safari-gold" />
            <span>{item.duration}</span>
          </div>
        )}

        <div className="flex items-center justify-between mt-3">
          <span className="text-sm text-muted-foreground">Qty: {item.quantity}</span>
          <span className="font-bold text-safari-gold text-lg">
            ${(item.price * item.quantity).toLocaleString()}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default Checkout;
