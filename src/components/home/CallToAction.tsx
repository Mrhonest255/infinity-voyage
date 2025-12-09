import { Button } from "@/components/ui/button";
import { ArrowRight, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-safari.jpg";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export const CallToAction = () => {
  const navigate = useNavigate();
  const { data: settings } = useSiteSettings();
  const phoneNumber = settings?.general?.phone || "+255 000 000 000";

  const handlePlan = () => navigate("/contact");
  const handleCall = () => window.open(`tel:${phoneNumber}`);

  return (
    <section className="relative py-40 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Safari Landscape"
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-safari-night/85 via-safari-night/75 to-primary/50" />
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-safari-night/60 via-transparent to-transparent" />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-safari-gold/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 container-wide mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Label */}
          <div className="inline-flex items-center gap-3 mb-8">
            <span className="w-16 h-px bg-gradient-to-r from-transparent via-safari-gold to-transparent" />
            <span className="text-safari-gold text-sm font-semibold uppercase tracking-[0.3em]">
              Start Your Journey
            </span>
            <span className="w-16 h-px bg-gradient-to-r from-transparent via-safari-gold to-transparent" />
          </div>

          <h2 className="text-5xl md:text-6xl lg:text-7xl font-semibold text-primary-foreground mb-8 leading-[1.1]">
            Ready for Your
            <br />
            <span className="text-gradient-luxury">African Adventure?</span>
          </h2>

          <p className="text-xl md:text-2xl text-primary-foreground/75 mb-14 leading-relaxed max-w-2xl mx-auto">
            Let us create your perfect safari experience. Contact us today for a 
            <span className="text-safari-gold font-medium"> free consultation</span> and personalized itinerary.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Button 
              size="xl" 
              onClick={handlePlan}
              className="px-12 py-6 text-lg font-bold rounded-2xl bg-gradient-to-r from-safari-gold via-safari-amber to-safari-gold text-safari-night shadow-gold hover:shadow-glow transition-all duration-500 hover:scale-105"
            >
              Plan Your Trip
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              variant="hero" 
              size="xl" 
              onClick={handleCall}
              className="px-10 py-6 text-lg font-semibold rounded-2xl border-2 border-primary-foreground/30 hover:border-safari-gold/50 hover:bg-safari-gold/10 transition-all duration-500"
            >
              <Phone className="w-5 h-5 mr-2" />
              Call Us Now
            </Button>
          </div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex items-center justify-center gap-8 mt-16 pt-10 border-t border-primary-foreground/10"
          >
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-safari-gold">500+</p>
              <p className="text-sm text-primary-foreground/60 mt-1">Happy Travelers</p>
            </div>
            <div className="w-px h-12 bg-primary-foreground/20" />
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-safari-gold">50+</p>
              <p className="text-sm text-primary-foreground/60 mt-1">Tour Packages</p>
            </div>
            <div className="w-px h-12 bg-primary-foreground/20" />
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-safari-gold">10+</p>
              <p className="text-sm text-primary-foreground/60 mt-1">Years Experience</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
