import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Search, Calendar as CalendarIcon, Users, Minus, Plus, MapPin, Compass, Play, ChevronDown } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { format } from "date-fns";
import heroImage from "@/assets/hero-safari.jpg";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const destinations = [
  "Serengeti National Park",
  "Ngorongoro Crater",
  "Zanzibar Island",
  "Mount Kilimanjaro",
  "Tarangire National Park",
  "Stone Town",
  "Lake Manyara",
  "Selous Game Reserve",
];

// Extract YouTube video ID from URL
const getYouTubeId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export const Hero = () => {
  const navigate = useNavigate();
  const { data: settings } = useSiteSettings();
  const [destination, setDestination] = useState("");
  const [showDestinations, setShowDestinations] = useState(false);
  const [date, setDate] = useState<Date>();
  const [guests, setGuests] = useState(2);
  const [showGuests, setShowGuests] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  
  // Parallax scroll effect
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, 300]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  // YouTube video ID - from settings or default
  const videoUrl = settings?.homepage?.heroVideo || "https://www.youtube.com/watch?v=DZnw2TeLuEU";
  const videoId = getYouTubeId(videoUrl) || "DZnw2TeLuEU";

  const filteredDestinations = destinations.filter(d => 
    d.toLowerCase().includes(destination.toLowerCase())
  );

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (destination) params.set("destination", destination);
    if (date) params.set("date", format(date, "yyyy-MM-dd"));
    if (guests) params.set("guests", guests.toString());
    navigate(`/safaris?${params.toString()}`);
  };

  const heroTitle = settings?.homepage?.heroTitle?.trim() || "INFINITY VOYAGE";
  const heroSubtitle = settings?.homepage?.heroSubtitle?.trim() || "Your Gateway to Endless Exploration";

  return (
    <section ref={heroRef} className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
      {/* Parallax Background Container */}
      <motion.div style={{ y }} className="absolute inset-0 z-0">
        {/* Fallback Background Image - shows while video loads */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="African Safari"
            className={`w-full h-full object-cover scale-105 transition-opacity duration-1000 ${videoLoaded ? 'opacity-0' : 'opacity-100'}`}
          />
        </div>

        {/* YouTube Video Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 scale-[1.25]">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1&enablejsapi=1&origin=${window.location.origin}&disablekb=1&fs=0`}
              title="Background Video"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[177.78vh] min-w-full min-h-[56.25vw] h-screen"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen={false}
              onLoad={() => setVideoLoaded(true)}
              style={{
                border: 'none',
                pointerEvents: 'none',
              }}
            />
          </div>
        </div>
      </motion.div>

      {/* Premium Multi-Layer Overlay */}
      <div className="absolute inset-0 z-[1]">
        <div className="absolute inset-0 bg-gradient-to-b from-safari-night/50 via-safari-night/25 to-safari-night/75" />
        <div className="absolute inset-0 bg-gradient-to-r from-safari-night/30 via-transparent to-safari-night/30" />
        <div className="absolute bottom-0 left-0 right-0 h-32 sm:h-40 md:h-48 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden">
        {/* Corner decorations - hidden on very small screens */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 0.2 }} 
          transition={{ delay: 1, duration: 1 }}
          className="absolute top-16 sm:top-20 left-4 sm:left-8 md:left-16 hidden sm:block"
        >
          <div className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 border-l-2 border-t-2 border-safari-gold/50" />
        </motion.div>
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 0.2 }} 
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-24 sm:bottom-32 right-4 sm:right-8 md:right-16 hidden sm:block"
        >
          <div className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 border-r-2 border-b-2 border-safari-gold/50" />
        </motion.div>
        
        {/* Floating compass icon */}
        <motion.div
          initial={{ opacity: 0, rotate: -30 }}
          animate={{ opacity: 0.08, rotate: 0 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute top-1/4 right-[8%] hidden xl:block"
        >
          <Compass className="w-40 h-40 2xl:w-48 2xl:h-48 text-safari-gold" strokeWidth={0.5} />
        </motion.div>
      </div>

      {/* Main Content */}
      <motion.div style={{ opacity }} className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-24 sm:pt-28 md:pt-32 pb-20 sm:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="text-center max-w-5xl mx-auto"
        >
          {/* Luxury tagline with animated lines */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="inline-flex items-center gap-2 sm:gap-4 mb-6 sm:mb-10"
          >
            <motion.span 
              initial={{ width: 0 }}
              animate={{ width: 40 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="h-px bg-gradient-to-r from-transparent via-safari-gold to-safari-gold hidden sm:block sm:w-10 md:w-16" 
            />
            <span className="text-safari-gold text-[10px] sm:text-xs md:text-sm font-medium uppercase tracking-[0.2em] sm:tracking-[0.4em] flex items-center gap-1.5 sm:gap-2">
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="whitespace-nowrap">Tanzania's Premier Safari Experts</span>
            </span>
            <motion.span 
              initial={{ width: 0 }}
              animate={{ width: 40 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="h-px bg-gradient-to-l from-transparent via-safari-gold to-safari-gold hidden sm:block sm:w-10 md:w-16" 
            />
          </motion.div>

          {/* Main headline - Premium Typography */}
          <h1 className="mb-8 leading-[0.9] tracking-tight">
            <motion.span 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light text-primary-foreground"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Discover Tanzania's
            </motion.span>
            <motion.span 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[9rem] font-bold text-gradient-luxury mt-2"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Untamed Beauty
            </motion.span>
          </h1>

          {/* Subtitle with elegant styling */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-sm sm:text-base md:text-lg lg:text-xl text-primary-foreground/85 tracking-wide font-light max-w-2xl lg:max-w-3xl mx-auto leading-relaxed mb-8 sm:mb-10 md:mb-12 px-2"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Embark on an extraordinary journey through the <span className="text-safari-gold font-medium">Serengeti</span>,
            climb <span className="text-safari-gold font-medium">Kilimanjaro</span>, and relax on <span className="text-safari-gold font-medium">Zanzibar's</span> pristine beaches
          </motion.p>

          {/* Decorative divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-10 md:mb-12"
          >
            <span className="w-12 sm:w-16 md:w-24 h-px bg-gradient-to-r from-transparent to-safari-gold/60" />
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-safari-gold" />
            <span className="w-12 sm:w-16 md:w-24 h-px bg-gradient-to-l from-transparent to-safari-gold/60" />
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-14 md:mb-16 px-4"
          >
            <Button 
              size="lg"
              onClick={() => navigate('/safaris')}
              className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-10 text-sm sm:text-base font-semibold rounded-full bg-gradient-to-r from-safari-gold via-safari-amber to-safari-gold text-safari-night shadow-gold hover:shadow-glow transition-all duration-500 hover:scale-105 group btn-shine"
            >
              Explore Safaris
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="ml-2"
              >
                →
              </motion.span>
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => navigate('/plan-my-trip')}
              className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-10 text-sm sm:text-base font-semibold rounded-full border-2 border-primary-foreground/30 text-primary-foreground bg-transparent hover:bg-primary-foreground/10 hover:border-safari-gold transition-all duration-300"
            >
              Plan Your Journey
            </Button>
          </motion.div>
        </motion.div>

        {/* Premium Search Box */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="max-w-5xl mx-auto px-2 sm:px-0"
        >
          <div className="glass-premium rounded-2xl sm:rounded-3xl shadow-luxury p-2 sm:p-3">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-1 sm:gap-2">
              {/* Destination */}
              <div className="relative">
                <div 
                  className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl hover:bg-primary/5 transition-all duration-300 cursor-pointer group"
                  onClick={() => setShowDestinations(!showDestinations)}
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-sunset flex items-center justify-center shadow-soft group-hover:shadow-elevated transition-all duration-300 flex-shrink-0">
                    <Search className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] sm:text-xs font-semibold text-primary uppercase tracking-wider mb-0.5 sm:mb-1">
                      Destinations
                    </p>
                    <Input
                      value={destination}
                      onChange={(e) => {
                        setDestination(e.target.value);
                        setShowDestinations(true);
                      }}
                      onFocus={() => setShowDestinations(true)}
                      placeholder="Serengeti, Zanzibar..."
                      className="border-0 p-0 h-auto text-sm sm:text-base font-medium focus-visible:ring-0 bg-transparent placeholder:text-muted-foreground/60"
                    />
                  </div>
                </div>
                {showDestinations && destination.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-background/98 backdrop-blur-xl rounded-2xl shadow-luxury border border-border/50 z-50 max-h-60 overflow-auto">
                    {filteredDestinations.map((d) => (
                      <button
                        key={d}
                        onClick={() => {
                          setDestination(d);
                          setShowDestinations(false);
                        }}
                        className="w-full text-left px-5 py-4 hover:bg-primary/5 transition-colors text-sm font-medium first:rounded-t-2xl last:rounded-b-2xl"
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Divider - Desktop */}
              <div className="hidden md:block w-px bg-gradient-to-b from-transparent via-border to-transparent self-stretch my-4" />

              {/* Date */}
              <Popover>
                <PopoverTrigger asChild>
                  <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-primary/5 transition-all duration-300 cursor-pointer group">
                    <div className="w-12 h-12 rounded-xl bg-gradient-sunset flex items-center justify-center shadow-soft group-hover:shadow-elevated transition-all duration-300">
                      <CalendarIcon className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">
                        Travel Date
                      </p>
                      <p className="text-base font-medium truncate">
                        {date ? format(date, "MMM d, yyyy") : "Select date"}
                      </p>
                    </div>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-2xl shadow-luxury border-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    disabled={(date) => date < new Date()}
                    className="rounded-2xl"
                  />
                </PopoverContent>
              </Popover>

              {/* Divider - Desktop */}
              <div className="hidden md:block w-px bg-gradient-to-b from-transparent via-border to-transparent self-stretch my-4" />

              {/* Guests */}
              <Popover open={showGuests} onOpenChange={setShowGuests}>
                <PopoverTrigger asChild>
                  <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-primary/5 transition-all duration-300 cursor-pointer group">
                    <div className="w-12 h-12 rounded-xl bg-gradient-sunset flex items-center justify-center shadow-soft group-hover:shadow-elevated transition-all duration-300">
                      <Users className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">
                        Travelers
                      </p>
                      <p className="text-base font-medium">
                        {guests} {guests === 1 ? "Guest" : "Guests"}
                      </p>
                    </div>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-56 rounded-2xl shadow-luxury border-0 p-4" align="start">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">Travelers</span>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setGuests(Math.max(1, guests - 1))}
                        className="w-10 h-10 rounded-xl border-2 border-border flex items-center justify-center hover:bg-primary/10 hover:border-primary transition-all duration-300"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-bold text-lg">{guests}</span>
                      <button
                        onClick={() => setGuests(Math.min(20, guests + 1))}
                        className="w-10 h-10 rounded-xl border-2 border-border flex items-center justify-center hover:bg-primary/10 hover:border-primary transition-all duration-300"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Search Button - Premium Gold */}
              <Button 
                onClick={handleSearch}
                size="lg" 
                className="h-auto py-5 px-10 text-base font-bold rounded-2xl bg-gradient-to-r from-safari-gold via-safari-amber to-safari-gold text-safari-night shadow-gold hover:shadow-glow transition-all duration-500 hover:scale-[1.02]"
              >
                <Search className="w-5 h-5 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Scroll Indicator - Premium */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 hidden sm:block"
        >
          <button 
            onClick={() => {
              const nextSection = document.querySelector('section:nth-of-type(2)');
              nextSection?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex flex-col items-center gap-2 sm:gap-3 text-primary-foreground/80 hover:text-safari-gold transition-colors group cursor-pointer"
          >
            <span className="text-[9px] sm:text-[10px] font-medium uppercase tracking-[0.2em] sm:tracking-[0.3em]">Scroll to Explore</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-6 h-10 sm:w-8 sm:h-14 rounded-full border-2 border-safari-gold/40 group-hover:border-safari-gold flex justify-center pt-2 sm:pt-3 backdrop-blur-sm transition-colors"
            >
              <motion.div 
                animate={{ opacity: [0.4, 1, 0.4], y: [0, 6, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1 h-3 sm:w-1.5 sm:h-4 rounded-full bg-gradient-to-b from-safari-gold to-safari-amber" 
              />
            </motion.div>
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
};
