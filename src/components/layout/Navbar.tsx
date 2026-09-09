import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Phone, Menu, X, Compass } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { CartButton } from "@/components/cart/Cart";

interface NavLinkItem {
  label: string;
  href: string;
}

const DEFAULT_NAV_LINKS: NavLinkItem[] = [
  { label: "Zanzibar", href: "/zanzibar" },
  { label: "Safaris", href: "/safaris" },
  { label: "Transfers", href: "/transfers" },
  { label: "Calculator", href: "/safari-calculator" },
  { label: "Gallery", href: "/gallery" },
  { label: "Plan Trip", href: "/plan-my-trip" },
  { label: "Track Booking", href: "/track-booking" },
  { label: "Contact", href: "/contact" },
];

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { data: settings } = useSiteSettings();

  const siteName = settings?.general?.siteName || "Infinity Voyage";
  const phone = settings?.general?.phone || "+255 758 241 294";
  const logo = settings?.general?.logo;

  const customLinks = settings?.navigation?.links;
  const navLinks: NavLinkItem[] =
    Array.isArray(customLinks) && customLinks.length > 0
      ? customLinks.map((item) => ({
          label: item.label || (item as unknown as { name?: string }).name || "",
          href: item.href || (item as unknown as { path?: string }).path || "#",
        }))
      : DEFAULT_NAV_LINKS;

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

  const isExternalLink = (url: string) =>
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("mailto:") ||
    url.startsWith("tel:");

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
                const external = isExternalLink(link.href);
                const isActive = !external && location.pathname === link.href;
                const linkClass = `px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-700 hover:text-slate-950 hover:bg-white/80"
                }`;

                if (external) {
                  return (
                    <a
                      key={`${link.label}-${link.href}`}
                      href={link.href}
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className={linkClass}
                    >
                      {link.label}
                    </a>
                  );
                }

                return (
                  <Link
                    key={`${link.label}-${link.href}`}
                    to={link.href}
                    className={linkClass}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Right Actions */}
            <div className="hidden lg:flex items-center gap-3">
              <CartButton />
              {phone && (
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-xs rounded-full transition-all duration-200 shadow-sm hover:shadow"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{phone}</span>
                </a>
              )}
            </div>

            {/* Mobile Actions */}
            <div className="flex lg:hidden items-center gap-2">
              <CartButton />
              {phone && (
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="p-2 rounded-lg text-slate-800 hover:bg-slate-100 focus:outline-none transition-colors"
                  aria-label={`Call ${phone}`}
                  title={`Call ${phone}`}
                >
                  <Phone className="w-5 h-5 text-amber-600" />
                </a>
              )}
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
            aria-hidden="true"
          />
          <div className="fixed right-0 top-0 bottom-0 w-4/5 max-w-sm bg-white shadow-2xl z-50 flex flex-col p-6 pt-24 overflow-y-auto">
            <div className="flex flex-col gap-1 flex-1">
              {navLinks.map((link) => {
                const external = isExternalLink(link.href);
                const isActive = !external && location.pathname === link.href;
                const itemClass = `px-4 py-3 rounded-xl text-sm font-semibold transition-colors flex items-center justify-between ${
                  isActive
                    ? "bg-amber-50 text-amber-900 font-bold"
                    : "text-slate-800 hover:bg-slate-50"
                }`;

                if (external) {
                  return (
                    <a
                      key={`mobile-${link.label}-${link.href}`}
                      href={link.href}
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={itemClass}
                    >
                      <span>{link.label}</span>
                    </a>
                  );
                }

                return (
                  <Link
                    key={`mobile-${link.label}-${link.href}`}
                    to={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={itemClass}
                  >
                    <span>{link.label}</span>
                    {isActive && <span className="w-2 h-2 rounded-full bg-amber-600" />}
                  </Link>
                );
              })}
            </div>

            <div className="pt-6 border-t border-slate-100 mt-4 flex flex-col gap-3">
              {phone && (
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="flex items-center justify-center gap-2 py-3 bg-slate-100 text-slate-900 font-semibold text-sm rounded-xl hover:bg-slate-200 transition-colors"
                >
                  <Phone className="w-4 h-4 text-amber-600" />
                  <span>Call {phone}</span>
                </a>
              )}
              <Link
                to="/plan-my-trip"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm rounded-xl shadow-sm transition-colors"
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
