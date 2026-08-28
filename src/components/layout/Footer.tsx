import { useState } from "react";
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
  Compass,
  CheckCircle2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export const Footer = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const { data: settings } = useSiteSettings();

  const siteName = settings?.general?.siteName || "Infinity Voyage";
  const tagline = settings?.general?.tagline || "Tours & Safaris";
  const logo = settings?.general?.logo;
  const emailContact = settings?.general?.email || "info@infinityvoyagetours.com";
  const phone = settings?.general?.phone || "+255 758 241 294";
  const address = settings?.general?.address || "Stone Town, Zanzibar & Arusha, Tanzania";

  const socialLinks = [
    { icon: Facebook, href: settings?.social?.facebook || "https://facebook.com", label: "Facebook" },
    { icon: Instagram, href: settings?.social?.instagram || "https://instagram.com", label: "Instagram" },
    { icon: Twitter, href: settings?.social?.twitter || "https://twitter.com", label: "Twitter" },
    { icon: Youtube, href: settings?.social?.youtube || "https://youtube.com", label: "YouTube" },
  ];

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setSubscribed(true);
    toast({
      title: "Subscribed Successfully!",
      description: "Thank you for subscribing to our safari offers and travel tips.",
    });
    setEmail("");
  };

  const quickLinks = [
    { label: "Home", path: "/" },
    { label: "Safari Tours", path: "/safaris" },
    { label: "Zanzibar Excursions", path: "/zanzibar" },
    { label: "Airport Transfers", path: "/transfers" },
    { label: "Safari Calculator", path: "/safari-calculator" },
    { label: "Plan Custom Trip", path: "/plan-my-trip" },
    { label: "Photo Gallery", path: "/gallery" },
    { label: "Track My Booking", path: "/track-booking" },
    { label: "About Infinity", path: "/about" },
    { label: "Contact Us", path: "/contact" },
  ];

  const destinationLinks = [
    { name: "Serengeti National Park", query: "Serengeti" },
    { name: "Ngorongoro Crater", query: "Ngorongoro" },
    { name: "Mount Kilimanjaro", query: "Kilimanjaro" },
    { name: "Tarangire National Park", query: "Tarangire" },
    { name: "Lake Manyara", query: "Manyara" },
    { name: "Zanzibar Beach Holidays", query: "Zanzibar" },
    { name: "Stone Town Historical Tour", query: "Stone Town" },
    { name: "Mnemba Island Snorkeling", query: "Mnemba" },
  ];

  return (
    <footer className="bg-slate-950 text-slate-200 border-t border-slate-800">
      {/* Newsletter Strip */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold font-display text-white mb-1">
              Subscribe for Safari Travel Deals & Guides
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Get seasonal migration updates, park fee tips, and exclusive package discounts.
            </p>
          </div>

          <form onSubmit={handleNewsletter} className="flex w-full md:w-auto gap-2">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 rounded-xl h-11 text-sm w-full sm:w-72 focus-visible:ring-amber-500"
            />
            <Button
              type="submit"
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-5 h-11 rounded-xl text-sm whitespace-nowrap shadow-sm"
            >
              {subscribed ? <CheckCircle2 className="w-4 h-4" /> : <Send className="w-4 h-4" />}
            </Button>
          </form>
        </div>
      </div>

      {/* Main Footer Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Company Column */}
          <div className="lg:col-span-4 flex flex-col items-start">
            <Link to="/" className="flex items-center gap-3 mb-4 group">
              {logo ? (
                <img src={logo} alt={siteName} className="h-10 w-auto object-contain" />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                  <Compass className="w-6 h-6" />
                </div>
              )}
              <div>
                <span className="text-xl font-bold font-display text-white block leading-none">
                  {siteName}
                </span>
                <span className="text-[10px] text-amber-400 font-semibold tracking-wider uppercase">
                  {tagline}
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              Premier Tanzania & Zanzibar tour operator. We create unforgettable tailor-made wildlife safaris, Kilimanjaro climbs, and tropical beach getaways with licensed expert local guides.
            </p>

            <div className="flex items-center gap-2 mb-4">
              {socialLinks.map((s, idx) => (
                <a
                  key={idx}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-lg bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-slate-400 border border-slate-800 flex items-center justify-center transition-colors"
                >
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-4">
              Explore
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              {quickLinks.slice(0, 5).map((l) => (
                <li key={l.path}>
                  <Link to={l.path} className="hover:text-amber-400 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-4">
              Services
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              {quickLinks.slice(5).map((l) => (
                <li key={l.path}>
                  <Link to={l.path} className="hover:text-amber-400 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Destinations with Real Links */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-4">
              Destinations
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              {destinationLinks.slice(0, 5).map((d) => (
                <li key={d.name}>
                  <Link
                    to={`/safaris?destination=${encodeURIComponent(d.query)}`}
                    className="hover:text-amber-400 transition-colors block truncate"
                  >
                    {d.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-4">
              Contact
            </h4>
            <ul className="space-y-3 text-xs text-slate-400">
              <li>
                <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-amber-400 flex items-start gap-2">
                  <Phone className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span>{phone}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${emailContact}`} className="hover:text-amber-400 flex items-start gap-2">
                  <Mail className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span className="break-all">{emailContact}</span>
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <span>{address}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-10 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {siteName}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/terms" className="hover:text-slate-400 transition-colors">
              Terms of Service
            </Link>
            <span>•</span>
            <Link to="/privacy" className="hover:text-slate-400 transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link to="/faq" className="hover:text-slate-400 transition-colors">
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};