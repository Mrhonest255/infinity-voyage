import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Zanzibar", path: "/zanzibar" },
  { name: "Safaris", path: "/safaris" },
  { name: "Transfers", path: "/transfers" },
  { name: "Calculator", path: "/safari-calculator" },
  { name: "Gallery", path: "/gallery" },
  { name: "Plan Trip", path: "/plan-my-trip" },
  { name: "Track Booking", path: "/track-booking" },
  { name: "Contact", path: "/contact" },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { data: settings } = useSiteSettings();
  
  const siteName = settings?.general?.siteName || "Infinity Voyage";
  const phone = settings?.general?.phone || "+255 123 456 789";
  const logo = settings?.general?.logo;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-background/95 backdrop-blur-xl shadow-soft border-b border-border/50"
            : "bg-gradient-to-b from-safari-night/40 to-transparent"
        }`}
      >
        <div className="container-wide mx-auto px-4 md:px-8">
          <nav className="flex items-center justify-between h-24">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              {logo ? (
                <img src={logo} alt={siteName} className="w-12 h-12 object-contain" />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-safari-gold via-safari-amber to-safari-gold flex items-center justify-center shadow-gold group-hover:shadow-glow transition-all duration-500">
                  <span className="text-safari-night font-bold text-xl">
                    IV
                  </span>
                </div>
              )}
              <div className="flex flex-col">
                <span
                  className={`font-semibold text-xl tracking-tight transition-colors duration-300 ${
                    isScrolled ? "text-foreground" : "text-primary-foreground"
                  }`}
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {siteName}
                </span>
                <span className={`text-[10px] uppercase tracking-[0.2em] font-medium ${
                  isScrolled ? "text-safari-gold" : "text-safari-gold/90"
                }`}>
                  Zanzibar
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
                    location.pathname === link.path
                      ? isScrolled
                        ? "text-primary"
                        : "text-safari-gold"
                      : isScrolled
                      ? "text-foreground/80 hover:text-primary"
                      : "text-primary-foreground/85 hover:text-primary-foreground"
                  }`}
                >
                  {link.name}
                  {location.pathname === link.path && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-safari-gold to-safari-amber rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden lg:flex items-center gap-5">
              <a
                href={`tel:${phone.replace(/\s/g, '')}`}
                className={`flex items-center gap-2.5 text-sm font-medium transition-all duration-300 group ${
                  isScrolled ? "text-foreground/80 hover:text-primary" : "text-primary-foreground/85 hover:text-primary-foreground"
                }`}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 ${
                  isScrolled ? "bg-primary/10 group-hover:bg-primary/20" : "bg-primary-foreground/10 group-hover:bg-primary-foreground/20"
                }`}>
                  <Phone className="w-4 h-4" />
                </div>
                <span className="hidden xl:inline">{phone}</span>
              </a>
              <Button 
                variant={isScrolled ? "safari" : "heroSolid"} 
                size="lg"
                className={`rounded-xl font-semibold shadow-soft hover:shadow-elevated transition-all duration-300 ${
                  !isScrolled ? "bg-gradient-to-r from-safari-gold to-safari-amber text-safari-night hover:shadow-gold" : ""
                }`}
                onClick={() => window.open("https://wa.me/255758241294?text=Hello! I would like to book a tour with Infinity Voyage Tours.", "_blank")}
              >
                Book Now
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                isScrolled
                  ? "text-foreground hover:bg-muted"
                  : "text-primary-foreground hover:bg-primary-foreground/10"
              }`}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </nav>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-safari-night/50 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute right-0 top-0 bottom-0 w-80 bg-background shadow-elevated"
            >
              <div className="p-6 pt-24">
                <div className="flex flex-col gap-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`px-4 py-3 rounded-lg text-base font-medium transition-all ${
                        location.pathname === link.path
                          ? "text-primary bg-primary/10"
                          : "text-foreground hover:text-primary hover:bg-primary/5"
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-border">
                  <a
                    href={`tel:${phone.replace(/\s/g, '')}`}
                    className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-4"
                  >
                    <Phone className="w-4 h-4" />
                    {phone}
                  </a>
                  <Button 
                    variant="safari" 
                    size="lg" 
                    className="w-full"
                    onClick={() => window.open("https://wa.me/255758241294?text=Hello! I would like to book a tour with Infinity Voyage Tours.", "_blank")}
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
