import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Send,
  ChevronRight,
  Clock,
  Award,
  Heart,
  Globe,
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useSiteSettings } from "@/hooks/useSiteSettings";

// TikTok Icon component
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

export const Footer = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: settings } = useSiteSettings();
  
  const siteName = settings?.general?.siteName || "Infinity Voyage";
  const tagline = settings?.general?.tagline || "Tours & Safaris";
  const logo = settings?.general?.logo;
  const emailContact = settings?.general?.email || "info@infinityvoyage.com";
  const phone = settings?.general?.phone || "+255 123 456 789";
  const address = settings?.general?.address || "Arusha, Tanzania";
  const socialLinks = [
    { icon: Facebook, href: settings?.social?.facebook || "#", label: "Facebook" },
    { icon: Instagram, href: settings?.social?.instagram || "#", label: "Instagram" },
    { icon: Twitter, href: settings?.social?.twitter || "#", label: "Twitter" },
    { icon: Youtube, href: settings?.social?.youtube || "#", label: "YouTube" },
    { icon: TikTokIcon, href: settings?.social?.tiktok || "https://tiktok.com/@infinityvoyage", label: "TikTok" },
  ];

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call - replace with actual newsletter subscription API
    setTimeout(() => {
      toast({
        title: "Successfully Subscribed! 🎉",
        description: "Thank you for subscribing. Check your inbox for exclusive offers.",
      });
      setEmail("");
      setIsSubmitting(false);
    }, 1000);
  };

  const quickLinks = [
    { label: "Home", path: "/" },
    { label: "About Us", path: "/about" },
    { label: "Safaris", path: "/safaris" },
    { label: "Zanzibar", path: "/zanzibar" },
    { label: "Prices", path: "/prices" },
    { label: "Gallery", path: "/gallery" },
    { label: "FAQ", path: "/faq" },
    { label: "Contact", path: "/contact" },
  ];

  const destinations = [
    "Serengeti National Park",
    "Ngorongoro Crater",
    "Mount Kilimanjaro",
    "Zanzibar Beaches",
    "Tarangire Park",
    "Lake Manyara",
    "Stone Town",
  ];

  return (
    <footer className="relative bg-safari-night text-white overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-safari-gold/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-safari-sunset/5 rounded-full blur-[120px]" />
      </div>

      {/* Newsletter Section */}
      <div className="relative border-b border-white/5 bg-white/[0.02] backdrop-blur-sm">
        <div className="container-wide mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="text-center lg:text-left flex-1">
                <div className="inline-flex items-center gap-3 bg-safari-gold/10 text-safari-gold px-6 py-2.5 rounded-full mb-6 text-sm font-bold uppercase tracking-widest border border-safari-gold/20">
                  <Award className="w-5 h-5" />
                  Exclusive Safari Offers
                </div>
                <h3 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Start Your <span className="italic text-safari-gold">African Adventure</span>
                </h3>
                <p className="text-white/60 text-lg lg:text-xl max-w-2xl leading-relaxed">
                  Subscribe for exclusive offers, travel tips, and early access to new safari experiences across Tanzania.
                </p>
              </div>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row w-full lg:w-auto gap-4 flex-shrink-0">
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-safari-gold transition-transform group-focus-within:scale-110" />
                  <Input
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 w-full sm:w-80 lg:w-96 pl-14 h-16 rounded-2xl focus:border-safari-gold focus:ring-safari-gold/20 transition-all text-lg"
                  />
                </div>
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="h-16 px-10 bg-safari-gold hover:bg-safari-amber text-safari-night font-bold rounded-2xl shadow-2xl shadow-safari-gold/20 transition-all duration-300 text-lg group"
                >
                  {isSubmitting ? (
                    "Subscribing..."
                  ) : (
                    <>
                      Subscribe
                      <Send className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container-wide mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-10">
            <Link to="/" className="inline-block group">
              {logo ? (
                <div className="flex items-center gap-4">
                  <img src={logo} alt={siteName} className="h-16 w-auto object-contain transition-transform duration-500 group-hover:scale-105" />
                  <div className="flex flex-col">
                    <span className="font-display text-3xl font-bold leading-none" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{siteName}</span>
                    <span className="text-safari-gold text-xs font-bold uppercase tracking-[0.3em] mt-1">{tagline}</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col">
                  <span className="font-display text-4xl font-bold leading-none" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    Infinity <span className="italic text-safari-gold">Voyage</span>
                  </span>
                  <span className="text-safari-gold text-xs font-bold uppercase tracking-[0.3em] mt-2">{tagline}</span>
                </div>
              )}
            </Link>
            
            <p className="text-white/50 text-lg leading-relaxed max-w-md">
              Crafting extraordinary safari experiences and beach escapes in Tanzania. From the Serengeti plains to the turquoise waters of Zanzibar.
            </p>

            <div className="flex items-center gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white/60 hover:bg-safari-gold hover:text-safari-night hover:-translate-y-1 transition-all duration-300 border border-white/5"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-8">
            <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-safari-gold">Explore</h4>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path} 
                    className="text-white/60 hover:text-safari-gold transition-colors flex items-center group text-lg"
                  >
                    <ChevronRight className="w-4 h-4 mr-2 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Destinations */}
          <div className="lg:col-span-3 space-y-8">
            <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-safari-gold">Destinations</h4>
            <ul className="space-y-4">
              {destinations.map((dest) => (
                <li key={dest} className="text-white/60 hover:text-safari-gold transition-colors flex items-center group text-lg cursor-pointer">
                  <MapPin className="w-4 h-4 mr-3 text-safari-gold/40 group-hover:text-safari-gold transition-colors" />
                  {dest}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-3 space-y-8">
            <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-safari-gold">Get in Touch</h4>
            <div className="space-y-6">
              <a href={`tel:${phone}`} className="flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-safari-gold/20 transition-colors border border-white/5">
                  <Phone className="w-5 h-5 text-safari-gold" />
                </div>
                <div>
                  <span className="block text-xs font-bold uppercase tracking-widest text-white/30 mb-1">Call Us</span>
                  <span className="text-lg font-medium group-hover:text-safari-gold transition-colors">{phone}</span>
                </div>
              </a>
              <a href={`mailto:${emailContact}`} className="flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-safari-gold/20 transition-colors border border-white/5">
                  <Mail className="w-5 h-5 text-safari-gold" />
                </div>
                <div>
                  <span className="block text-xs font-bold uppercase tracking-widest text-white/30 mb-1">Email Us</span>
                  <span className="text-lg font-medium group-hover:text-safari-gold transition-colors">{emailContact}</span>
                </div>
              </a>
              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-safari-gold/20 transition-colors border border-white/5">
                  <MapPin className="w-5 h-5 text-safari-gold" />
                </div>
                <div>
                  <span className="block text-xs font-bold uppercase tracking-widest text-white/30 mb-1">Visit Us</span>
                  <span className="text-lg font-medium group-hover:text-safari-gold transition-colors">{address}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} {siteName}. All rights reserved.
          </p>
          <div className="flex items-center gap-8">
            <Link to="/terms" className="text-white/40 hover:text-safari-gold text-sm transition-colors">Terms & Conditions</Link>
            <Link to="/privacy" className="text-white/40 hover:text-safari-gold text-sm transition-colors">Privacy Policy</Link>
            <div className="flex items-center gap-2 text-white/40 text-sm">
              <Globe className="w-4 h-4" />
              <span>English (USD)</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};