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
  const headline = settings?.homepage?.heroTitle || "Ready for Your African Adventure?";
  const subhead =
    settings?.homepage?.heroSubtitle ||
    "Let us create your perfect safari experience. Contact us today for a free consultation and personalized itinerary.";

  const handlePlan = () => navigate("/contact");
  const handleCall = () => window.open(`tel:${phoneNumber}`);

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Safari Landscape"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-safari-night/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 container-wide mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
            {headline}
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-10">{subhead}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="gold" size="xl" onClick={handlePlan}>
              Plan Your Trip
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button variant="hero" size="xl" onClick={handleCall}>
              <Phone className="w-5 h-5 mr-2" />
              Call Us Now ({phoneNumber})
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
