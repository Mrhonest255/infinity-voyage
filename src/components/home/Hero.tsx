import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Users, ArrowRight, ShieldCheck, Star, Award } from "lucide-react";
import heroImage from "@/assets/hero-safari.jpg";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const topDestinations = [
  "Serengeti National Park",
  "Ngorongoro Crater",
  "Zanzibar Island",
  "Mount Kilimanjaro",
  "Tarangire National Park",
  "Stone Town",
];

export const Hero = () => {
  const navigate = useNavigate();
  const { data: settings } = useSiteSettings();
  const [destination, setDestination] = useState("");
  const [guests, setGuests] = useState("2");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const heroTitle = settings?.homepage?.heroTitle?.trim() || "Discover Tanzania's Untamed Beauty";
  const heroSubtitle =
    settings?.homepage?.heroSubtitle?.trim() ||
    "From Serengeti Great Migration to Mount Kilimanjaro summits and Zanzibar's turquoise waters, we craft bespoke African safari experiences.";

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();
    if (destination) params.set("destination", destination);
    if (guests) params.set("guests", guests);
    navigate(`/safaris?${params.toString()}`);
  };

  const filtered = topDestinations.filter((d) =>
    d.toLowerCase().includes(destination.toLowerCase())
  );

  return (
    <section className="relative min-h-[90vh] md:min-h-[94vh] flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-slate-950">
      {/* Optimized Background Image with Dark Vignette */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Tanzania Safari Landscape"
          fetchPriority="high"
          loading="eager"
          className="w-full h-full object-cover object-center scale-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/40" />
        <div className="absolute inset-0 bg-slate-950/20" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
        {/* Subtle pill badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-6">
          <Award className="w-3.5 h-3.5" />
          <span>Tanzania & Zanzibar Luxury Tour Operator</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1] mb-6 font-display max-w-4xl">
          {heroTitle}
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-slate-200/90 max-w-2xl mx-auto font-normal leading-relaxed mb-8 sm:mb-10">
          {heroSubtitle}
        </p>

        {/* Search / Booking Box */}
        <div className="w-full max-w-3xl bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-2xl shadow-2xl border border-white/40 mb-10 text-left">
          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-3 items-center">
            {/* Destination Input */}
            <div className="sm:col-span-6 relative">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1 ml-1">
                Where to?
              </label>
              <div className="relative flex items-center">
                <MapPin className="w-4 h-4 text-amber-600 absolute left-3 pointer-events-none" />
                <Input
                  type="text"
                  placeholder="Serengeti, Zanzibar, Kilimanjaro..."
                  value={destination}
                  onChange={(e) => {
                    setDestination(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  className="pl-9 pr-3 h-11 bg-slate-50 border-slate-200 text-slate-900 rounded-xl text-sm font-medium focus-visible:ring-amber-500"
                />
              </div>

              {/* Autocomplete dropdown */}
              {showSuggestions && destination.length > 0 && filtered.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-30 py-1 overflow-hidden">
                  {filtered.map((dest) => (
                    <button
                      type="button"
                      key={dest}
                      onClick={() => {
                        setDestination(dest);
                        setShowSuggestions(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-800 hover:bg-amber-50 hover:text-amber-900 transition-colors flex items-center gap-2"
                    >
                      <MapPin className="w-3.5 h-3.5 text-amber-600" />
                      <span>{dest}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Guests Select */}
            <div className="sm:col-span-3">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1 ml-1">
                Travelers
              </label>
              <div className="relative flex items-center">
                <Users className="w-4 h-4 text-amber-600 absolute left-3 pointer-events-none" />
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full pl-9 pr-3 h-11 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="1">1 Traveler</option>
                  <option value="2">2 Travelers</option>
                  <option value="4">3-4 Travelers</option>
                  <option value="6">5+ Group</option>
                </select>
              </div>
            </div>

            {/* Search Button */}
            <div className="sm:col-span-3 sm:self-end">
              <Button
                type="submit"
                className="w-full h-11 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                <span>Search Tours</span>
              </Button>
            </div>
          </form>
        </div>

        {/* Action Buttons & Trust indicators */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-slate-300 text-xs sm:text-sm font-medium">
          <div className="flex items-center gap-1.5 text-white">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% Tailor-Made</span>
          </div>
          <div className="flex items-center gap-1.5 text-white">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>Top Rated Guides</span>
          </div>
          <div className="flex items-center gap-1.5 text-white">
            <MapPin className="w-4 h-4 text-amber-400" />
            <span>Local Experts in Arusha & Zanzibar</span>
          </div>
        </div>
      </div>
    </section>
  );
};
