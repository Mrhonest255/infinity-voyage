import { useEffect, useState, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Copy, 
  Check,
  Package,
  MessageCircle,
  Calendar,
  Clock,
  Heart,
  Download,
  FileText
} from "lucide-react";
import { downloadBookingPDF } from "@/lib/generateBookingPDF";

// Confetti Component
const Confetti = () => {
  const colors = ['#D4AF37', '#FFD700', '#1e40af', '#3b82f6', '#22c55e', '#f97316'];
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {[...Array(100)].map((_, i) => {
        const color = colors[Math.floor(Math.random() * colors.length)];
        const left = Math.random() * 100;
        const delay = Math.random() * 3;
        const duration = 3 + Math.random() * 2;
        const size = 8 + Math.random() * 8;
        
        return (
          <motion.div
            key={i}
            initial={{ 
              top: -20, 
              left: `${left}%`,
              rotate: 0,
              opacity: 1
            }}
            animate={{ 
              top: '110%',
              rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
              opacity: [1, 1, 0]
            }}
            transition={{ 
              duration,
              delay,
              ease: "linear",
            }}
            style={{
              position: 'absolute',
              width: size,
              height: size,
              backgroundColor: color,
              borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            }}
          />
        );
      })}
    </div>
  );
};

// Animated Number Display
const TrackingCodeDisplay = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
      className="relative"
    >
      <div className="bg-gradient-to-br from-safari-night via-safari-night/95 to-primary/20 rounded-2xl p-8 text-center relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-safari-gold/10 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
        </div>
        
        <div className="relative">
          <p className="text-white/60 text-sm uppercase tracking-wider mb-3">
            Your Tracking Code
          </p>
          
          <div className="flex items-center justify-center gap-4">
            <motion.p 
              className="text-4xl md:text-5xl font-mono font-bold text-safari-gold tracking-widest"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {code}
            </motion.p>
            
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1 }}
              onClick={copyToClipboard}
              className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
              title="Copy tracking code"
            >
              {copied ? (
                <Check className="w-6 h-6 text-green-400" />
              ) : (
                <Copy className="w-6 h-6 text-white/70" />
              )}
            </motion.button>
          </div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-white/50 text-sm mt-4"
          >
            Save this code to track your booking status
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
};

const ThankYou = () => {
  const [searchParams] = useSearchParams();
  const trackingCode = searchParams.get('code') || 'IV-XXXXXX';
  const customerName = searchParams.get('name') || 'Valued Guest';
  const customerEmail = searchParams.get('email') || '';
  const tourName = searchParams.get('tour') || 'Tanzania Safari Adventure';
  const travelDate = searchParams.get('date') || 'To be confirmed';
  const guests = parseInt(searchParams.get('guests') || '2');
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Stop confetti after 5 seconds
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleDownloadPDF = () => {
    downloadBookingPDF({
      trackingCode,
      customerName,
      customerEmail,
      tourName,
      travelDate,
      numberOfGuests: guests,
      status: 'pending',
    });
  };

  const steps = [
    { icon: Package, title: "Booking Received", description: "We got your request", completed: true },
    { icon: Clock, title: "Under Review", description: "Our team is reviewing", completed: false },
    { icon: Calendar, title: "Confirmation", description: "We'll confirm soon", completed: false },
    { icon: Heart, title: "Your Adventure", description: "Get ready to explore!", completed: false },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Confetti */}
      {showConfetti && <Confetti />}

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-background to-safari-gold/5" />
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-green-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-safari-gold/10 rounded-full blur-3xl" />

        <div className="relative container-wide mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 mb-8 shadow-xl"
            >
              <CheckCircle2 className="w-12 h-12 text-white" />
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-4"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Booking <span className="text-gradient-gold">Confirmed!</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-muted-foreground mb-10"
            >
              Thank you for choosing Infinity Voyage Tours. Your adventure awaits!
            </motion.p>

            {/* Tracking Code Display */}
            <div className="mb-12">
              <TrackingCodeDisplay code={trackingCode} />
            </div>

            {/* Progress Steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mb-12"
            >
              <Card className="bg-card/80 backdrop-blur border-border/50">
                <CardContent className="p-6 md:p-8">
                  <h3 className="text-lg font-semibold mb-6 flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5 text-safari-gold" />
                    What Happens Next
                  </h3>
                  
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    {steps.map((step, index) => (
                      <div key={step.title} className="flex items-center gap-4 md:flex-col md:text-center flex-1">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                          step.completed 
                            ? 'bg-green-500 text-white' 
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          <step.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <p className={`font-semibold ${step.completed ? 'text-green-600' : 'text-foreground'}`}>
                            {step.title}
                          </p>
                          <p className="text-sm text-muted-foreground">{step.description}</p>
                        </div>
                        {index < steps.length - 1 && (
                          <div className="hidden md:block flex-1 h-px bg-border mx-4" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Button 
                variant="safari" 
                size="lg" 
                className="shadow-gold"
                onClick={handleDownloadPDF}
              >
                <Download className="w-5 h-5 mr-2" />
                Download Voucher PDF
              </Button>

              <Link to="/track-booking">
                <Button variant="outline" size="lg">
                  <Package className="w-5 h-5 mr-2" />
                  Track Your Booking
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => window.open(`https://wa.me/255758241294?text=Hello! I just made a booking with code ${trackingCode}. I would like more information.`, '_blank')}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Chat with Us
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container-wide mx-auto px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <h2 className="text-2xl md:text-3xl font-semibold mb-4">
                Why You're in <span className="text-gradient-gold">Good Hands</span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: "⏰", title: "24-Hour Response", desc: "Our team will contact you within 24 hours" },
                { icon: "🎯", title: "Personalized Service", desc: "Tailored itineraries just for you" },
                { icon: "🛡️", title: "Safe & Secure", desc: "Licensed and insured travel company" },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-6 rounded-2xl bg-background border border-border"
                >
                  <span className="text-4xl mb-4 block">{item.icon}</span>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Explore More */}
      <section className="py-16">
        <div className="container-wide mx-auto px-4 md:px-8 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-semibold mb-6">
              While You Wait, Explore More
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/safaris">
                <Button variant="outline" size="lg">
                  Explore Safaris
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/zanzibar">
                <Button variant="outline" size="lg">
                  Discover Zanzibar
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/gallery">
                <Button variant="outline" size="lg">
                  View Gallery
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ThankYou;
