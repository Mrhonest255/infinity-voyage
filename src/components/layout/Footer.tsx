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
    <footer className="relative bg-safari-night text-primary-foreground overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div className="absolute top-10 left-10 w-64 h-64 bg-safari-gold rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-safari-sunset rounded-full blur-3xl"></div>
      </div>

      {/* Newsletter Section */}
      <div className="relative border-b border-primary-foreground/10 bg-gradient-to-r from-primary-foreground/5 to-transparent">
        <div className="container-wide mx-auto px-4 md:px-8 py-12 md:py-16">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="text-center lg:text-left flex-1">
                <div className="inline-flex items-center gap-2 bg-safari-gold/20 text-safari-gold px-4 py-2 rounded-full mb-4 text-sm font-semibold">
                  <Award className="w-4 h-4" />
                  Exclusive Offers
                </div>
                <h3 className="font-display text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-primary-foreground to-primary-foreground/80 bg-clip-text text-transparent">
                  Start Your African Adventure
                </h3>
                <p className="text-primary-foreground/80 text-lg">
                  Subscribe for exclusive offers, travel tips, and early access to new safari experiences
                </p>
              </div>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row w-full lg:w-auto gap-3 flex-shrink-0">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-foreground/40" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 w-full sm:w-80 pl-12 h-12 focus:border-safari-gold focus:ring-safari-gold transition-all"
                  />
                </div>
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  variant="gold" 
                  size="lg"
                  className="h-12 px-8 bg-gradient-to-r from-safari-gold to-safari-amber hover:from-safari-amber hover:to-safari-gold shadow-lg hover:shadow-xl transition-all"
                >
                  {isSubmitting ? (
                    "Subscribing..."
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Subscribe
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="relative container-wide mx-auto px-4 md:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* About */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              {logo ? (
                <img src={logo} alt={siteName} className="w-12 h-12 object-contain" />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-safari-gold to-safari-amber flex items-center justify-center shadow-lg">
                  <span className="text-safari-night font-display font-bold text-xl">
                    IV
                  </span>
                </div>
              )}
              <div>
                <span className="font-display text-xl font-bold block">{siteName}</span>
                <span className="text-xs text-primary-foreground/60">{tagline}</span>
              </div>
            </div>
            <p className="text-primary-foreground/80 mb-6 leading-relaxed">
              Your gateway to endless exploration. We craft unforgettable African experiences tailored just for you.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="group w-11 h-11 rounded-lg bg-primary-foreground/10 flex items-center justify-center hover:bg-safari-gold hover:scale-110 transition-all duration-300"
                  >
                    <Icon className="w-5 h-5 group-hover:text-safari-night transition-colors" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-bold mb-6 flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-safari-gold" />
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="group text-primary-foreground/80 hover:text-safari-gold transition-colors flex items-center gap-2"
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Destinations */}
          <div>
            <h4 className="font-display text-lg font-bold mb-6 flex items-center gap-2">
              <Globe className="w-4 h-4 text-safari-gold" />
              Top Destinations
            </h4>
            <ul className="space-y-3">
              {destinations.map((dest, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="group text-primary-foreground/80 hover:text-safari-gold transition-colors flex items-center gap-2"
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span>{dest}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-bold mb-6 flex items-center gap-2">
              <Phone className="w-4 h-4 text-safari-gold" />
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 group">
                <MapPin className="w-5 h-5 text-safari-gold shrink-0 mt-1 group-hover:scale-110 transition-transform" />
                <span className="text-primary-foreground/80 leading-relaxed">
                  {address}
                </span>
              </li>
              <li className="flex items-center gap-3 group">
                <Phone className="w-5 h-5 text-safari-gold shrink-0 group-hover:scale-110 transition-transform" />
                <a
                  href={`tel:${phone.replace(/\s/g, '')}`}
                  className="text-primary-foreground/80 hover:text-safari-gold transition-colors"
                >
                  {phone}
                </a>
              </li>
              <li className="flex items-center gap-3 group">
                <Mail className="w-5 h-5 text-safari-gold shrink-0 group-hover:scale-110 transition-transform" />
                <a
                  href={`mailto:${emailContact}`}
                  className="text-primary-foreground/80 hover:text-safari-gold transition-colors break-all"
                >
                  {emailContact}
                </a>
              </li>
              <li className="flex items-center gap-3 group pt-2">
                <Clock className="w-5 h-5 text-safari-gold shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-primary-foreground/80 text-sm">
                  Mon - Sat: 8:00 AM - 6:00 PM<br />
                  <span className="text-primary-foreground/60">Sun: 10:00 AM - 4:00 PM</span>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="relative border-t border-primary-foreground/10 bg-primary-foreground/5">
        <div className="container-wide mx-auto px-4 md:px-8 py-6 md:py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-2 text-primary-foreground/70">
              <p>© {new Date().getFullYear()} {siteName}.</p>
              <span className="hidden sm:inline">All rights reserved.</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
              <Link 
                to="/privacy" 
                className="text-primary-foreground/70 hover:text-safari-gold transition-colors flex items-center gap-1 group"
              >
                Privacy Policy
                <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link 
                to="/terms" 
                className="text-primary-foreground/70 hover:text-safari-gold transition-colors flex items-center gap-1 group"
              >
                Terms of Service
                <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link 
                to="/faq" 
                className="text-primary-foreground/70 hover:text-safari-gold transition-colors flex items-center gap-1 group"
              >
                FAQ
                <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </div>
            <div className="flex items-center gap-2 text-primary-foreground/60 text-xs">
              <Heart className="w-3 h-3 text-safari-gold fill-safari-gold" />
              <span>Made with passion for adventure</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};