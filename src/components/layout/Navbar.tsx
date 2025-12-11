import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, ChevronDown, ArrowRight } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
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
  const { scrollY } = useScroll();
  
  const siteName = settings?.general?.siteName || "Infinity Voyage";
  const phone = settings?.general?.phone || "+255 123 456 789";
  const logo = settings?.general?.logo;
  
  // Dynamic navbar height based on scroll
  const navHeight = useTransform(scrollY, [0, 100], [96, 72]);

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

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-background/98 backdrop-blur-2xl shadow-lg border-b border-border/30"
            : "bg-gradient-to-b from-safari-night/60 via-safari-night/30 to-transparent"
        }`}
      >
        <div className="container-wide mx-auto px-4 md:px-8">
          <motion.nav 
            style={{ height: navHeight }}
            className="flex items-center justify-between"
          >
            {/* Logo - Enhanced */}
            <Link to="/" className="flex items-center gap-3 group relative z-10">
              {logo ? (
                <div className="relative flex items-center gap-4">
                  <div className="relative">
                    <img 
                      src={logo} 
                      alt={siteName} 
                      className="h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
                    />
                    {/* Glow effect on hover */}
                    <div className="absolute inset-0 bg-safari-gold/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="hidden sm:flex flex-col">
                    <span
                      className={`font-bold text-xl leading-tight transition-colors duration-300 ${
                        isScrolled ? "text-foreground" : "text-primary-foreground"
                      }`}
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      {siteName}
                    </span>
                    <span className={`text-[10px] uppercase tracking-[0.25em] font-semibold ${
                      isScrolled ? "text-safari-gold" : "text-safari-gold/90"
                    }`}>
                      Tours & Safaris
                    </span>
                  </div>
                </div>
              ) : (
                <div className="relative flex items-center gap-4">
                  <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-safari-gold via-safari-amber to-safari-gold flex items-center justify-center shadow-gold group-hover:shadow-glow transition-all duration-500 group-hover:scale-105 overflow-hidden">
                    <span className="text-safari-night font-bold text-2xl relative z-10" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      IV
                    </span>
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  </div>
                  <div className="flex flex-col">
                    <span
                      className={`font-bold text-xl leading-tight transition-colors duration-300 ${
                        isScrolled ? "text-foreground" : "text-primary-foreground"
                      }`}
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      {siteName}
                    </span>
                    <span className={`text-[10px] uppercase tracking-[0.25em] font-semibold ${
                      isScrolled ? "text-safari-gold" : "text-safari-gold/90"
                    }`}>
                      Tours & Safaris
                    </span>
                  </div>
                </div>
              )}
            </Link>

            {/* Desktop Navigation - Enhanced */}
            <div className="hidden lg:flex items-center gap-0.5">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-2.5 text-sm font-medium transition-all duration-300 rounded-lg ${
                    location.pathname === link.path
                      ? isScrolled
                        ? "text-primary bg-primary/5"
                        : "text-safari-gold"
                      : isScrolled
                      ? "text-foreground/70 hover:text-primary hover:bg-primary/5"
                      : "text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/5"
                  }`}
                >
                  {link.name}
                  {location.pathname === link.path && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-safari-gold via-safari-amber to-safari-gold rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* CTA Buttons - Enhanced */}
            <div className="hidden lg:flex items-center gap-4">
              <a
                href={`tel:${phone.replace(/\s/g, '')}`}
                className={`flex items-center gap-2.5 text-sm font-medium transition-all duration-300 group ${
                  isScrolled ? "text-foreground/70 hover:text-primary" : "text-primary-foreground/80 hover:text-primary-foreground"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  isScrolled 
                    ? "bg-primary/10 group-hover:bg-primary/20" 
                    : "bg-white/10 group-hover:bg-white/20"
                }`}>
                  <Phone className="w-4 h-4" />
                </div>
                <span className="hidden xl:inline font-semibold">{phone}</span>
              </a>
              
              {/* Primary CTA - Gold gradient */}
              <Button 
                size="lg"
                className={`rounded-xl font-bold shadow-soft hover:shadow-gold transition-all duration-300 h-11 px-6 group overflow-hidden relative ${
                  isScrolled 
                    ? "bg-gradient-to-r from-safari-gold to-safari-amber text-safari-night hover:scale-105" 
                    : "bg-gradient-to-r from-safari-gold to-safari-amber text-safari-night hover:scale-105"
                }`}
                onClick={() => window.open("https://wa.me/255758241294?text=Hello! I would like to book a tour with Infinity Voyage Tours.", "_blank")}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Book Safari
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </Button>
            </div>

            {/* Mobile Menu Button - Enhanced */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden relative p-2.5 rounded-xl transition-all duration-300 ${
                isScrolled
                  ? "text-foreground hover:bg-muted"
                  : "text-primary-foreground hover:bg-white/10"
              }`}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </motion.nav>
        </div>
      </motion.header>

      {/* Mobile Menu - Premium Fullscreen */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-safari-night/80 backdrop-blur-md"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-background shadow-luxury"
            >
              {/* Decorative gradient top */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-safari-gold via-safari-amber to-safari-gold" />
              
              <div className="p-6 pt-28 h-full overflow-y-auto">
                <div className="flex flex-col gap-1">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 + 0.1 }}
                    >
                      <Link
                        to={link.path}
                        className={`flex items-center justify-between px-4 py-4 rounded-xl text-base font-medium transition-all ${
                          location.pathname === link.path
                            ? "text-safari-gold bg-safari-gold/10"
                            : "text-foreground hover:text-primary hover:bg-primary/5"
                        }`}
                      >
                        {link.name}
                        {location.pathname === link.path && (
                          <div className="w-2 h-2 rounded-full bg-safari-gold" />
                        )}
                      </Link>
                    </motion.div>
                  ))}
                </div>
                
                {/* Bottom section */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-8 pt-8 border-t border-border"
                >
                  <a
                    href={`tel:${phone.replace(/\s/g, '')}`}
                    className="flex items-center gap-3 text-sm font-medium text-muted-foreground mb-6 hover:text-primary transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Phone className="w-4 h-4" />
                    </div>
                    {phone}
                  </a>
                  <Button 
                    size="lg" 
                    className="w-full rounded-xl bg-gradient-to-r from-safari-gold to-safari-amber text-safari-night font-bold h-14 shadow-gold hover:shadow-glow transition-all duration-300"
                    onClick={() => window.open("https://wa.me/255758241294?text=Hello! I would like to book a tour with Infinity Voyage Tours.", "_blank")}
                  >
                    Book Your Safari
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  
                  {/* Social links placeholder */}
                  <p className="text-xs text-muted-foreground text-center mt-8">
                    Tanzania's Premier Safari Experts
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
