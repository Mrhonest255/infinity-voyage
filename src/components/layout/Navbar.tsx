import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { CartButton } from "@/components/cart/Cart";

const navLinks = [
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { data: settings } = useSiteSettings();
  
  const siteName = settings?.general?.siteName || "Infinity Voyage";
  const phone = settings?.general?.phone || "+255 123 456 789";
  const logo = settings?.general?.logo;

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
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-safari-gold/10 shadow-2xl shadow-safari-night/5"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between h-20 sm:h-24 lg:h-28 gap-4">
            {/* Logo - Vertical/Tall Layout */}
            <Link to="/" className="flex items-center group relative flex-shrink-0">
              <div className="absolute -inset-4 bg-safari-gold/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              {logo ? (
                <div className="flex items-center gap-3 sm:gap-4 relative z-10">
                  <img 
                    src={logo} 
                    alt={siteName} 
                    className="h-12 sm:h-14 lg:h-20 w-auto object-contain transition-transform duration-500 group-hover:scale-105" 
                  />
                  <div className="flex flex-col min-w-0">
                    <span
                      className="font-display text-lg sm:text-xl lg:text-2xl text-safari-night leading-none font-bold truncate"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      {siteName.split(' ')[0]}
                    </span>
                    <span
                      className="font-display text-lg sm:text-xl lg:text-2xl text-safari-night leading-none font-bold italic text-safari-gold truncate"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      {siteName.split(' ').slice(1).join(' ')}
                    </span>
                    <div className="h-px w-full bg-gradient-to-r from-safari-gold to-transparent mt-1" />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 sm:gap-4 relative z-10">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-safari-night rounded-2xl shadow-2xl flex items-center justify-center border border-white/10 group-hover:rotate-3 transition-transform duration-500 flex-shrink-0">
                    <div className="text-safari-gold">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="sm:w-8 sm:h-8 lg:w-10 lg:h-10">
                        <path d="M12 2L2 7l10 5 10-5-10-5z" />
                        <path d="M2 17l10 5 10-5" />
                        <path d="M2 12l10 5 10-5" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span
                      className="font-display text-lg sm:text-xl lg:text-2xl text-safari-night leading-none font-bold truncate"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      Infinity
                    </span>
                    <span
                      className="font-display text-lg sm:text-xl lg:text-2xl text-safari-night leading-none font-bold italic text-safari-gold truncate"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      Voyage
                    </span>
                    <div className="h-px w-full bg-gradient-to-r from-safari-gold to-transparent mt-1" />
                  </div>
                </div>
              )}
            </Link>

            {/* Desktop Navigation - Clean Design */}
            <div className="hidden lg:flex items-center gap-1 bg-safari-night/5 p-1.5 rounded-full border border-safari-night/5 overflow-x-auto max-w-full">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-2.5 text-[10px] xl:text-xs font-bold uppercase tracking-widest transition-all duration-300 rounded-full whitespace-nowrap ${
                    location.pathname === link.path
                      ? "text-white bg-safari-night shadow-lg"
                      : "text-safari-night/60 hover:text-safari-night hover:bg-white"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* CTA Buttons - Cart and Phone */}
            <div className="hidden lg:flex items-center gap-4">
              <CartButton />
              <a
                href={`tel:${phone.replace(/\s/g, '')}`}
                className="group flex items-center gap-3 pl-2 pr-6 py-2 bg-safari-gold rounded-full text-safari-night font-bold transition-all duration-300 hover:shadow-xl hover:shadow-safari-gold/20 hover:-translate-y-0.5"
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/20 group-hover:bg-white/40 transition-colors">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="text-sm uppercase tracking-wider">Call Us</span>
              </a>
            </div>

            {/* Mobile Menu Button and Cart */}
            <div className="flex lg:hidden items-center gap-2">
              <CartButton />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="relative p-2.5 rounded-xl text-foreground hover:bg-muted transition-colors"
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
            </div>
          </nav>
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
              className="absolute right-0 top-0 bottom-0 w-full max-w-[320px] sm:max-w-sm bg-background shadow-luxury"
            >
              {/* Decorative gradient top */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-safari-gold via-safari-amber to-safari-gold" />
              
              <div className="p-4 sm:p-6 pt-20 sm:pt-28 h-full overflow-y-auto scroll-smooth-touch">
                <div className="flex flex-col gap-0.5 sm:gap-1">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 + 0.1 }}
                    >
                      <Link
                        to={link.path}
                        className={`flex items-center justify-between px-3 sm:px-4 py-3.5 sm:py-4 rounded-lg sm:rounded-xl text-sm sm:text-base font-medium transition-all touch-target ${
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
                  className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-border"
                >
                  <a
                    href={`tel:${phone.replace(/\s/g, '')}`}
                    className="flex items-center gap-3 text-xs sm:text-sm font-medium text-muted-foreground mb-4 sm:mb-6 hover:text-primary transition-colors touch-target"
                  >
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-primary/10 flex items-center justify-center">
                      <Phone className="w-4 h-4" />
                    </div>
                    {phone}
                  </a>
                  <Button 
                    size="lg" 
                    className="w-full rounded-xl bg-gradient-to-r from-safari-gold to-safari-amber text-safari-night font-bold h-12 sm:h-14 shadow-gold hover:shadow-glow transition-all duration-300 btn-shine"
                    onClick={() => window.open("https://wa.me/255758241294?text=Hello! I would like to book a tour with Infinity Voyage Tours.", "_blank")}
                  >
                    Book Your Safari
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
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
