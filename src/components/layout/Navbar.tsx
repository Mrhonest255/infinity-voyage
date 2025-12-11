import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { CartButton } from "@/components/cart/Cart";

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
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border/50 shadow-sm"
      >
        <div className="container-wide mx-auto px-4 md:px-8">
          <nav className="flex items-center justify-between h-24">
            {/* Logo - Vertical/Tall Layout */}
            <Link to="/" className="flex items-center group">
              {logo ? (
                <div className="flex items-center gap-3">
                  <img 
                    src={logo} 
                    alt={siteName} 
                    className="h-16 w-auto object-contain" 
                  />
                  <div className="flex flex-col">
                    <span
                      className="font-semibold text-lg text-foreground leading-tight"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      {siteName.split(' ')[0]}
                    </span>
                    <span
                      className="font-semibold text-lg text-foreground leading-tight"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      {siteName.split(' ').slice(1).join(' ')}
                    </span>
                    <span className="text-[10px] text-safari-gold font-semibold uppercase tracking-wider">
                      Tours & Safaris
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-white rounded-md shadow-md flex items-center justify-center border border-border/50">
                    <div className="text-safari-gold">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2L2 7l10 5 10-5-10-5z" />
                        <path d="M2 17l10 5 10-5" />
                        <path d="M2 12l10 5 10-5" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span
                      className="font-semibold text-lg text-foreground leading-tight"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      Infinity
                    </span>
                    <span
                      className="font-semibold text-lg text-foreground leading-tight"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      Voyage
                    </span>
                    <span className="text-[10px] text-safari-gold font-semibold uppercase tracking-wider">
                      Tours & Safaris
                    </span>
                  </div>
                </div>
              )}
            </Link>

            {/* Desktop Navigation - Clean Design */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                    location.pathname === link.path
                      ? "text-safari-gold"
                      : "text-foreground/80 hover:text-safari-gold"
                  }`}
                >
                  {link.name}
                  {location.pathname === link.path && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-0.5 bg-safari-gold"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* CTA Buttons - Cart and Phone */}
            <div className="hidden lg:flex items-center gap-3">
              <CartButton />
              <a
                href={`tel:${phone.replace(/\s/g, '')}`}
                className="flex items-center gap-2.5 text-sm font-medium text-foreground/70 hover:text-primary"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary/10">
                  <Phone className="w-4 h-4" />
                </div>
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
