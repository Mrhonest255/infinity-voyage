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
      <Navbar />
      
      {/* Hero */}
      <section className="relative pt-32 pb-20">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Contact Us"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-safari-night/70" />
        </div>
        <div className="relative container-wide mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4">
              Contact Us
            </h1>
            <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              Have questions? We're here to help plan your perfect African adventure
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding">
        <div className="container-wide mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-3xl font-semibold text-foreground mb-2">
                Send us a Message
              </h2>
              <p className="text-muted-foreground mb-8">
                Fill out the form below and we'll respond within 24 hours
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName" 
                      placeholder="John" 
                      value={formData.firstName}
                      onChange={(e) => handleChange('firstName', e.target.value)}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      placeholder="Doe" 
                      value={formData.lastName}
                      onChange={(e) => handleChange('lastName', e.target.value)}
                      required 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="john@example.com" 
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    placeholder="+1 234 567 890" 
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interest">I'm interested in</Label>
                  <select
                    id="interest"
                    value={formData.interest}
                    onChange={(e) => handleChange('interest', e.target.value)}
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                  <Label htmlFor="message">Your Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us about your dream trip..."
                    rows={5}
                    value={formData.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    required
                  />
                </div>

                {/* Dual Submit Options */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    type="submit" 
                    variant="safari" 
                    size="lg" 
                    className="flex-1"
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
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-500 text-white font-bold hover:from-green-500 hover:to-green-600"
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
            >
              <h2 className="font-display text-3xl font-semibold text-foreground mb-2">
                Get in Touch
              </h2>
              <p className="text-muted-foreground mb-8">
                We're available 24/7 to assist you with your travel plans
              </p>

              <div className="space-y-6 mb-12">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/50">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Visit Our Office</h3>
                    <p className="text-muted-foreground">
                      Kisauni, Zanzibar<br />
                      Tanzania, East Africa
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/50">
                  <div className="w-12 h-12 rounded-full bg-safari-gold/10 flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6 text-safari-gold" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Call Us</h3>
                    <p className="text-muted-foreground">
                      +255 758 241 294<br />
                      WhatsApp Available
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/50">
                  <div className="w-12 h-12 rounded-full bg-safari-sage/10 flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6 text-safari-sage" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Email Us</h3>
                    <p className="text-muted-foreground">
                      info@infinityvoyagetours.com<br />
                      bookings@infinityvoyagetours.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/50">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Office Hours</h3>
                    <p className="text-muted-foreground">
                      Monday - Friday: 8:00 AM - 6:00 PM (EAT)<br />
                      24/7 Emergency Support Available
                    </p>
                  </div>
                </div>
              </div>

              {/* WhatsApp CTA */}
              <div className="bg-gradient-sunset rounded-xl p-6 text-center">
                <MessageCircle className="w-10 h-10 text-primary-foreground mx-auto mb-4" />
                <h3 className="font-display text-xl font-semibold text-primary-foreground mb-2">
                  Quick Response via WhatsApp
                </h3>
                <p className="text-primary-foreground/80 mb-4">
                  Get instant answers to your questions
                </p>
                <Button variant="hero" size="lg" className="w-full">
                  Chat on WhatsApp
                </Button>
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
