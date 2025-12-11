import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Search, Compass, ArrowRight } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex min-h-[calc(100vh-200px)] items-center justify-center relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-safari-gold/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-safari-amber/5 rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
          {/* Safari-themed 404 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="relative inline-block">
              <span className="text-[150px] md:text-[200px] font-bold text-transparent bg-clip-text bg-gradient-to-br from-safari-gold via-safari-amber to-safari-gold" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                404
              </span>
              {/* Safari animal silhouette */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
                <motion.div
                  animate={{ x: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="text-6xl"
                >
                  🦁
                </motion.div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Lost in the <span className="text-safari-gold">Savanna?</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
              Looks like this trail doesn't exist. Don't worry, even the best explorers take wrong turns sometimes!
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/">
              <Button size="lg" className="rounded-xl bg-gradient-to-r from-safari-gold to-safari-amber text-safari-night font-semibold shadow-gold hover:shadow-glow transition-all">
                <Home className="w-5 h-5 mr-2" />
                Back to Home
              </Button>
            </Link>
            <Link to="/safaris">
              <Button size="lg" variant="outline" className="rounded-xl border-2 hover:border-safari-gold hover:bg-safari-gold/5 transition-all">
                <Compass className="w-5 h-5 mr-2" />
                Explore Safaris
              </Button>
            </Link>
          </motion.div>

          {/* Helpful links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-12 pt-8 border-t border-border"
          >
            <p className="text-sm text-muted-foreground mb-4">Popular destinations:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { name: "Zanzibar", path: "/zanzibar" },
                { name: "Safari Tours", path: "/safaris" },
                { name: "Gallery", path: "/gallery" },
                { name: "Contact Us", path: "/contact" },
              ].map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-sm font-medium text-foreground/70 hover:text-safari-gold transition-colors flex items-center gap-1"
                >
                  {link.name}
                  <ArrowRight className="w-3 h-3" />
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
