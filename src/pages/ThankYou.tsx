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
  // ...existing code...
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Confetti */}
      {showConfetti && <Confetti />}

      {/* Premium Hero Section */}
      <section className="relative pt-40 pb-24 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-background to-safari-gold/5" />
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-green-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-safari-gold/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />

        <div className="relative container-wide mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="inline-flex items-center justify-center w-28 h-28 rounded-[2rem] bg-gradient-to-br from-green-500 to-emerald-600 mb-10 shadow-2xl shadow-green-500/20"
            >
              <CheckCircle2 className="w-14 h-14 text-white" />
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-7xl font-bold text-safari-night mb-6"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Booking <span className="italic text-safari-gold">Confirmed!</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              Thank you for choosing <span className="text-safari-night font-bold">Infinity Voyage Tours</span>. Your extraordinary African adventure starts here!
            </motion.p>

            {/* Tracking Code Display */}
            <div className="mb-16">
              <TrackingCodeDisplay code={trackingCode} />
            </div>

            {/* Progress Steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mb-16"
            >
              <Card className="bg-white/80 backdrop-blur-xl border-border/40 shadow-2xl rounded-[3rem] overflow-hidden">
                <CardContent className="p-10 md:p-16">
                  <div className="inline-flex items-center gap-3 mb-10 px-6 py-3 bg-safari-gold/10 rounded-full border border-safari-gold/20">
                    <Sparkles className="w-5 h-5 text-safari-gold" />
                    <span className="text-safari-gold text-sm font-bold uppercase tracking-widest">What Happens Next</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-8 left-[15%] right-[15%] h-0.5 bg-border/30 -z-10" />
                    
                    {steps.map((step, index) => (
                      <div key={step.title} className="flex flex-col items-center text-center group">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 ${
                          step.completed 
                            ? 'bg-green-500 text-white shadow-xl shadow-green-500/20 scale-110' 
                            : 'bg-muted text-muted-foreground group-hover:bg-safari-gold/10 group-hover:text-safari-gold'
                        }`}>
                          <step.icon className="w-8 h-8" />
                        </div>
                        <h4 className={`text-lg font-bold mb-2 ${step.completed ? 'text-safari-night' : 'text-muted-foreground'}`}>
                          {step.title}
                        </h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
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
              className="flex flex-col sm:flex-row justify-center gap-6"
            >
              <Button 
                size="xl"
                className="bg-safari-night hover:bg-safari-gold hover:text-safari-night text-white font-bold rounded-full px-10 h-16 text-lg shadow-2xl transition-all duration-300"
                onClick={handleDownloadPDF}
              >
                <Download className="w-5 h-5 mr-3" />
                Download Voucher PDF
              </Button>

              <Link to="/track-booking">
                <Button variant="outline" size="xl" className="border-2 border-border/50 hover:border-safari-gold hover:bg-safari-gold/5 rounded-full px-10 h-16 text-lg font-bold transition-all duration-300">
                  <Package className="w-5 h-5 mr-3" />
                  Track Your Booking
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                size="xl"
                className="border-2 border-border/50 hover:border-safari-gold hover:bg-safari-gold/5 rounded-full px-10 h-16 text-lg font-bold transition-all duration-300"
                onClick={() => window.open(`https://wa.me/255758241294?text=Hello! I just made a booking with code ${trackingCode}. I would like more information.`, '_blank')}
              >
                <MessageCircle className="w-5 h-5 mr-3" />
                Chat with Us
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/30 relative overflow-hidden">
        <div className="container-wide mx-auto px-4 md:px-8">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-5xl font-bold text-safari-night mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Why You're in <span className="italic text-safari-gold">Good Hands</span>
              </h2>
              <div className="w-24 h-1 bg-safari-gold mx-auto rounded-full" />
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: "⏰", title: "24-Hour Response", desc: "Our team will contact you within 24 hours to finalize details." },
                { icon: "🎯", title: "Personalized Service", desc: "Every itinerary is tailored to your specific preferences and needs." },
                { icon: "🛡️", title: "Safe & Secure", desc: "We are a fully licensed and insured travel company based in Tanzania." },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-10 rounded-[2.5rem] border border-border/40 shadow-xl hover:shadow-2xl transition-all duration-500 group"
                >
                  <div className="w-20 h-20 rounded-2xl bg-safari-gold/10 flex items-center justify-center text-4xl mb-8 group-hover:scale-110 transition-transform duration-500">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-safari-night mb-4">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Explore More */}
      <section className="py-32">
        <div className="container-wide mx-auto px-4 md:px-8 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-safari-night mb-12" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              While You Wait, <span className="italic text-safari-gold">Explore More</span>
            </h2>
            <div className="flex flex-wrap justify-center gap-6">
              {[
                { label: "Explore Safaris", path: "/safaris" },
                { label: "Discover Zanzibar", path: "/zanzibar" },
                { label: "View Gallery", path: "/gallery" }
              ].map((link) => (
                <Link key={link.path} to={link.path}>
                  <Button variant="outline" size="xl" className="border-2 border-border/50 hover:border-safari-gold hover:bg-safari-gold/5 rounded-full px-10 h-16 text-lg font-bold transition-all duration-300">
                    {link.label}
                    <ArrowRight className="w-5 h-5 ml-3" />
                  </Button>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ThankYou;
