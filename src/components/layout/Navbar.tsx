import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Phone, Menu, X, Compass } from "lucide-react";
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
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { data: settings } = useSiteSettings();

  const siteName = settings?.general?.siteName || "Infinity Voyage";
  const phone = settings?.general?.phone || "+255 758 241 294";
  const logo = settings?.general?.logo;

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const nameParts = siteName.split(" ");
  const firstName = nameParts[0] || "Infinity";
  const secondName = nameParts.slice(1).join(" ") || "Voyage";

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-md py-3 border-b border-slate-200/80"
            : "bg-white/90 backdrop-blur-sm py-4 border-b border-slate-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              {logo ? (
                <img
                  src={logo}
                  alt={siteName}
                  className="h-10 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-900 flex items-center justify-center text-amber-400 shadow-sm transition-transform duration-300 group-hover:scale-105">
                  <Compass className="w-6 h-6" />
                </div>
              )}
              <div className="flex flex-col">
                <span className="font-display text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                  {firstName} <span className="text-amber-600 font-semibold">{secondName}</span>
                </span>
                <span className="text-[10px] sm:text-xs text-slate-500 font-medium tracking-wider uppercase">
                  Tours & Safaris
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1 rounded-full border border-slate-200/60">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 whitespace-nowrap ${
                      isActive
                        ? "bg-slate-900 text-white shadow-sm"
                        : "text-slate-700 hover:text-slate-950 hover:bg-white/80"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* Right Actions */}
            <div className="hidden lg:flex items-center gap-3">
              <CartButton />
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-xs rounded-full transition-all duration-200 shadow-sm hover:shadow"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{phone}</span>
              </a>
            </div>

            {/* Mobile Actions */}
            <div className="flex lg:hidden items-center gap-2">
              <CartButton />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-slate-800 hover:bg-slate-100 focus:outline-none"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed right-0 top-0 bottom-0 w-4/5 max-w-sm bg-white shadow-2xl z-50 flex flex-col p-6 pt-24 overflow-y-auto">
            <div className="flex flex-col gap-1 flex-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-4 py-3 rounded-xl text-sm font-semibold transition-colors flex items-center justify-between ${
                      isActive
                        ? "bg-amber-50 text-amber-900 font-bold"
                        : "text-slate-800 hover:bg-slate-50"
                    }`}
                  >
                    <span>{link.name}</span>
                    {isActive && <span className="w-2 h-2 rounded-full bg-amber-600" />}
                  </Link>
                );
              })}
            </div>

            <div className="pt-6 border-t border-slate-100 mt-4 flex flex-col gap-3">
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="flex items-center justify-center gap-2 py-3 bg-slate-100 text-slate-900 font-semibold text-sm rounded-xl"
              >
                <Phone className="w-4 h-4 text-amber-600" />
                <span>Call {phone}</span>
              </a>
              <Link
                to="/plan-my-trip"
                className="flex items-center justify-center py-3 bg-amber-500 text-slate-950 font-bold text-sm rounded-xl shadow-sm"
              >
                Book Your Safari
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
