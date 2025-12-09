import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CheckCircle, Sparkles, ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-safari.jpg";

const ThankYou = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Thank you" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/70 to-background" />
        </div>

        <div className="relative container-wide mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center space-y-6 bg-card/80 backdrop-blur-lg border border-border/60 rounded-3xl p-8 shadow-elevated"
          >
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-primary" />
              </div>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Thank You! Your request is received.
            </h1>
            <p className="text-lg text-muted-foreground">
              Our travel experts are already reviewing your request. Expect a response within 24
              hours with tailored options for your perfect adventure.
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-2 bg-secondary/60 rounded-full px-4 py-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Personalized itineraries
              </span>
              <span className="flex items-center gap-2 bg-secondary/60 rounded-full px-4 py-2">
                <Sparkles className="w-4 h-4 text-primary" />
                24/7 support
              </span>
              <span className="flex items-center gap-2 bg-secondary/60 rounded-full px-4 py-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Local expert guides
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <Button asChild variant="safari" size="lg">
                <a href="/safaris">
                  Explore Safaris
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="/zanzibar">
                  Explore Zanzibar
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ThankYou;

