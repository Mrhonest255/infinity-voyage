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
} from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-safari-night text-primary-foreground">
      {/* Newsletter Section */}
      <div className="border-b border-primary-foreground/10">
        <div className="container-wide mx-auto px-4 md:px-8 py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="font-display text-2xl md:text-3xl font-semibold mb-2">
                Start Your African Adventure
              </h3>
              <p className="text-primary-foreground/70">
                Subscribe for exclusive offers and travel tips
              </p>
            </div>
            <div className="flex w-full lg:w-auto gap-3">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 w-full lg:w-80"
              />
              <Button variant="gold" size="lg">
                <Send className="w-4 h-4 mr-2" />
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-wide mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-sunset flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold text-xl">
                  IV
                </span>
              </div>
              <span className="font-display text-xl font-semibold">
                Infinity Voyage
              </span>
            </div>
            <p className="text-primary-foreground/70 mb-6 leading-relaxed">
              Your gateway to endless exploration. We craft unforgettable
              African experiences tailored just for you.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                "Home",
                "About Us",
                "Safaris",
                "Zanzibar Excursions",
                "Prices",
                "Gallery",
                "Contact",
              ].map((link) => (
                <li key={link}>
                  <Link
                    to={`/${link.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-primary-foreground/70 hover:text-safari-gold transition-colors"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Destinations */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-6">
              Top Destinations
            </h4>
            <ul className="space-y-3">
              {[
                "Serengeti National Park",
                "Ngorongoro Crater",
                "Mount Kilimanjaro",
                "Zanzibar Beaches",
                "Tarangire Park",
                "Lake Manyara",
                "Stone Town",
              ].map((dest) => (
                <li key={dest}>
                  <a
                    href="#"
                    className="text-primary-foreground/70 hover:text-safari-gold transition-colors"
                  >
                    {dest}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-6">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-safari-gold shrink-0 mt-0.5" />
                <span className="text-primary-foreground/70">
                  123 Safari Avenue, Arusha, Tanzania
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-safari-gold shrink-0" />
                <a
                  href="tel:+255123456789"
                  className="text-primary-foreground/70 hover:text-safari-gold transition-colors"
                >
                  +255 123 456 789
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-safari-gold shrink-0" />
                <a
                  href="mailto:info@infinityvoyage.com"
                  className="text-primary-foreground/70 hover:text-safari-gold transition-colors"
                >
                  info@infinityvoyage.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-primary-foreground/10">
        <div className="container-wide mx-auto px-4 md:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-primary-foreground/60">
            <p>© 2024 Infinity Voyage Tours & Safaris. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-safari-gold transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-safari-gold transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
