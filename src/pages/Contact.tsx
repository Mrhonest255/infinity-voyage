import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Phone, Mail, MapPin, Clock, Send, MessageCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { SEO } from "@/components/SEO";

import heroImage from "@/assets/hero-safari.jpg";

const WHATSAPP_NUMBER = '255758241294';

const Contact = () => {
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    interest: 'Safari Experience',
    message: ''
  });

  // Pre-fill form from URL params
  useEffect(() => {
    const subject = searchParams.get('subject');
    const transfer = searchParams.get('transfer');
    const route = searchParams.get('route');
    const safari = searchParams.get('safari');
    const people = searchParams.get('people');
    const duration = searchParams.get('duration');
    const price = searchParams.get('price');

    let prefillMessage = '';
    let prefillInterest = 'Safari Experience';

    if (transfer) {
      prefillInterest = 'Other Inquiry';
      prefillMessage = `🚗 TRANSFER BOOKING REQUEST\n\nTransfer: ${transfer}\nRoute: ${route || 'Not specified'}\n\nPlease confirm availability and pricing.`;
    } else if (safari) {
      prefillInterest = 'Safari Experience';
      prefillMessage = `🦁 SAFARI BOOKING REQUEST\n\nSafari: ${safari}\nTravelers: ${people || 'Not specified'}\nDuration: ${duration || 'Not specified'}\nEstimated Price: $${price || 'TBD'}\n\nPlease confirm availability.`;
    } else if (subject) {
      prefillMessage = `Subject: ${subject}\n\n`;
    }

    if (prefillMessage) {
      setFormData(prev => ({
        ...prev,
        interest: prefillInterest,
        message: prefillMessage
      }));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Send email to admin via Edge Function
      const { error } = await supabase.functions.invoke('send-booking-email', {
        body: {
          customerName: `${formData.firstName} ${formData.lastName}`.trim(),
          customerEmail: formData.email,
          customerPhone: formData.phone || 'Not provided',
          tourName: `Contact Inquiry: ${formData.interest}`,
          travelDate: 'Not specified',
          numberOfGuests: 1,
          specialRequests: formData.message,
        },
      });

      if (error) throw error;

      toast.success("Thank you! We'll get back to you within 24 hours.");
      
      // Reset form
      setFormData({
        firstName: '', lastName: '', email: '', phone: '',
        interest: 'Safari Experience', message: ''
      });
    } catch (error: any) {
      console.error('Contact form error:', error);
      toast.error("Failed to send message. Please try again or contact us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsApp = () => {
    const message = `Hello! I'm interested in ${formData.interest}.\n\nName: ${formData.firstName} ${formData.lastName}\nEmail: ${formData.email}\n\n${formData.message}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Contact Us - Book Your Tanzania Safari or Zanzibar Tour"
        description="Get in touch with Infinity Voyage Tours. WhatsApp +255 758 241 294, Email info@infinityvoyagetours.com. Stone Town, Zanzibar office. 24/7 support for safari bookings and tour inquiries."
        keywords="contact Infinity Voyage, Tanzania safari booking, Zanzibar tour booking, safari inquiry, tour quote Tanzania"
        url="/contact"
      />
      <Navbar />
      
      {/* Hero */}
      <section className="relative pt-24 sm:pt-32 pb-16 sm:pb-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Contact Us"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-safari-night/80 via-safari-night/60 to-safari-night/90" />
        </div>
        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-48 sm:w-72 h-48 sm:h-72 bg-safari-gold/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-64 sm:w-96 h-64 sm:h-96 bg-primary/10 rounded-full blur-3xl" />
        </div>
        <div className="relative container-wide mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <span className="w-6 sm:w-10 h-px bg-safari-gold" />
              <span className="text-safari-gold text-[10px] sm:text-sm font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em]">
                Get in Touch
              </span>
              <span className="w-6 sm:w-10 h-px bg-safari-gold" />
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-primary-foreground mb-4 sm:mb-6 leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Let's Plan Your <span className="text-gradient-luxury">Adventure</span>
            </h1>
            <p className="text-base sm:text-xl text-primary-foreground/80 max-w-2xl mx-auto px-4">
              Have questions? We're here to help create your perfect African experience
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 sm:py-20 md:py-28 bg-gradient-to-b from-background to-muted/30">
        <div className="container-wide mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-10 sm:gap-16">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-card rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 shadow-luxury border border-border/30"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-safari-gold/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-safari-gold" />
                </div>
                <h2 className="text-xl sm:text-3xl font-semibold text-foreground" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Send us a Message
                </h2>
              </div>
              <p className="text-xs sm:text-base text-muted-foreground mb-6 sm:mb-8 pl-0 sm:pl-[60px]">
                Fill out the form below and we'll respond within 24 hours
              </p>

              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-xs sm:text-sm font-medium">First Name *</Label>
                    <Input 
                      id="firstName" 
                      placeholder="John" 
                      value={formData.firstName}
                      onChange={(e) => handleChange('firstName', e.target.value)}
                      required 
                      className="h-12 sm:h-14 rounded-xl border-border/50 focus:border-safari-gold transition-colors text-sm sm:text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-xs sm:text-sm font-medium">Last Name *</Label>
                    <Input 
                      id="lastName" 
                      placeholder="Doe" 
                      value={formData.lastName}
                      onChange={(e) => handleChange('lastName', e.target.value)}
                      required 
                      className="h-12 sm:h-14 rounded-xl border-border/50 focus:border-safari-gold transition-colors text-sm sm:text-base"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs sm:text-sm font-medium">Email *</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="john@example.com" 
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    required 
                    className="h-12 sm:h-14 rounded-xl border-border/50 focus:border-safari-gold transition-colors text-sm sm:text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-xs sm:text-sm font-medium">Phone Number</Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    placeholder="+1 234 567 890" 
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="h-12 sm:h-14 rounded-xl border-border/50 focus:border-safari-gold transition-colors text-sm sm:text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interest" className="text-xs sm:text-sm font-medium">I'm interested in</Label>
                  <select
                    id="interest"
                    value={formData.interest}
                    onChange={(e) => handleChange('interest', e.target.value)}
                    className="flex h-12 sm:h-14 w-full rounded-xl border border-border/50 bg-background px-4 py-2 text-sm sm:text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-safari-gold/50 focus:border-safari-gold transition-colors"
                  >
                    <option>Safari Experience</option>
                    <option>Zanzibar Beach Holiday</option>
                    <option>Kilimanjaro Trekking</option>
                    <option>Combo Package</option>
                    <option>Custom Itinerary</option>
                    <option>Transfer Booking</option>
                    <option>Other Inquiry</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-xs sm:text-sm font-medium">Your Message *</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us about your dream trip..."
                    rows={5}
                    value={formData.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    required
                    className="rounded-xl border-border/50 focus:border-safari-gold transition-colors resize-none text-sm sm:text-base"
                  />
                </div>

                {/* Dual Submit Options */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="flex-1 h-12 sm:h-14 rounded-xl bg-gradient-to-r from-safari-gold to-safari-amber text-safari-night font-bold shadow-gold hover:shadow-glow transition-all duration-300 hover:scale-[1.02] text-sm sm:text-base"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                  <Button 
                    type="button" 
                    size="lg" 
                    className="flex-1 h-12 sm:h-14 bg-gradient-to-r from-green-600 to-green-500 text-white font-bold hover:from-green-500 hover:to-green-600 rounded-xl text-sm sm:text-base"
                    onClick={handleWhatsApp}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Chat on WhatsApp
                  </Button>
                </div>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-semibold text-foreground" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    Get in Touch
                  </h2>
                </div>
                <p className="text-muted-foreground pl-[52px]">
                  We're available 24/7 to assist you with your travel plans
                </p>
              </div>

              <div className="space-y-4">
                <div className="group flex items-start gap-4 p-5 rounded-2xl bg-card shadow-soft border border-border/30 hover:border-safari-gold/30 hover:shadow-elevated transition-all duration-300">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Visit Our Office</h3>
                    <p className="text-muted-foreground">
                      Kisauni, Stone Town<br />
                      Zanzibar, Tanzania
                    </p>
                  </div>
                </div>

                <div className="group flex items-start gap-4 p-5 rounded-2xl bg-card shadow-soft border border-border/30 hover:border-safari-gold/30 hover:shadow-elevated transition-all duration-300">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-safari-gold/20 to-safari-gold/5 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Phone className="w-6 h-6 text-safari-gold" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Call or WhatsApp</h3>
                    <a href="tel:+255758241294" className="text-muted-foreground hover:text-safari-gold transition-colors block">
                      +255 758 241 294
                    </a>
                    <span className="text-xs text-safari-gold font-medium">WhatsApp Available 24/7</span>
                  </div>
                </div>

                <div className="group flex items-start gap-4 p-5 rounded-2xl bg-card shadow-soft border border-border/30 hover:border-safari-gold/30 hover:shadow-elevated transition-all duration-300">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-safari-sage/20 to-safari-sage/5 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Mail className="w-6 h-6 text-safari-sage" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Email Us</h3>
                    <a href="mailto:info@infinityvoyagetours.com" className="text-muted-foreground hover:text-safari-gold transition-colors block">
                      info@infinityvoyagetours.com
                    </a>
                    <a href="mailto:bookings@infinityvoyagetours.com" className="text-muted-foreground hover:text-safari-gold transition-colors text-sm">
                      bookings@infinityvoyagetours.com
                    </a>
                  </div>
                </div>

                <div className="group flex items-start gap-4 p-5 rounded-2xl bg-card shadow-soft border border-border/30 hover:border-safari-gold/30 hover:shadow-elevated transition-all duration-300">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Office Hours</h3>
                    <p className="text-muted-foreground">
                      Monday - Saturday: 8:00 AM - 6:00 PM (EAT)<br />
                      <span className="text-safari-gold text-sm font-medium">24/7 Emergency Support</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Premium WhatsApp CTA Card */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-safari-night via-safari-night/95 to-primary/20 p-8 text-center">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-safari-gold/10 rounded-full blur-2xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/10 rounded-full blur-xl" />
                
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-green-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <MessageCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-primary-foreground mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    Prefer WhatsApp?
                  </h3>
                  <p className="text-primary-foreground/80 mb-6 max-w-xs mx-auto">
                    Get instant responses and plan your trip in real-time with our travel experts
                  </p>
                  <Button 
                    size="lg"
                    className="rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold h-14 px-8 shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello! I'm interested in booking a safari with Infinity Voyage Tours.")}`, "_blank")}
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Start Chat Now
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
