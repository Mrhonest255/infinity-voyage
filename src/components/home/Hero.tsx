import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Search, Calendar as CalendarIcon, Users, Minus, Plus } from "lucide-react";
import { motion } from "framer-motion";
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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Fallback Background Image - shows while video loads */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="African Safari"
          className={`w-full h-full object-cover transition-opacity duration-1000 ${videoLoaded ? 'opacity-0' : 'opacity-100'}`}
        />
      </div>

      {/* YouTube Video Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 scale-150">
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
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-safari-night/50 via-safari-night/40 to-safari-night/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 container-wide mx-auto px-4 md:px-8 pt-32 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="text-center mb-16"
        >
          {/* Luxury tagline */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="inline-flex items-center gap-3 mb-8"
          >
            <span className="w-12 h-px bg-gradient-to-r from-transparent via-safari-gold to-transparent" />
            <span className="text-safari-gold text-sm font-medium uppercase tracking-[0.3em]">
              Luxury African Experiences
            </span>
            <span className="w-12 h-px bg-gradient-to-r from-transparent via-safari-gold to-transparent" />
          </motion.div>

          {/* Main headline with elegant typography */}
          <h1 className="text-5xl md:text-7xl lg:text-[6rem] xl:text-[7rem] font-semibold text-primary-foreground mb-8 leading-[0.95] tracking-tight">
            <span className="block">Discover Tanzania's</span>
            <span className="block text-gradient-luxury">Untamed Beauty</span>
          </h1>

          {/* Subtitle with refined styling */}
          <p className="text-lg md:text-xl lg:text-2xl text-primary-foreground/80 tracking-[0.15em] uppercase font-light max-w-3xl mx-auto leading-relaxed">
            Embark on an extraordinary journey through the Serengeti,
            <br className="hidden md:block" />
            climb Kilimanjaro, and relax on Zanzibar's pristine beaches
          </p>

          {/* Decorative line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="w-24 h-0.5 bg-gradient-to-r from-safari-gold via-safari-amber to-safari-gold mx-auto mt-10"
          />
        </motion.div>

        {/* Removed Play Button since video is now auto-playing in background */}

        {/* Search Box - Premium Glass Design */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-5xl mx-auto mt-12"
        >
          <div className="glass-light rounded-3xl shadow-luxury p-2 md:p-3">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              {/* Destination */}
              <div className="relative">
                <div 
                  className="flex items-center gap-4 p-4 rounded-2xl hover:bg-primary/5 transition-all duration-300 cursor-pointer group"
                  onClick={() => setShowDestinations(!showDestinations)}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-sunset flex items-center justify-center shadow-soft group-hover:shadow-elevated transition-all duration-300">
                    <Search className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">
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
                      className="border-0 p-0 h-auto text-base font-medium focus-visible:ring-0 bg-transparent placeholder:text-muted-foreground/60"
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
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-3 text-primary-foreground/80">
            <span className="text-xs font-medium uppercase tracking-[0.25em]">Explore</span>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-7 h-12 rounded-full border-2 border-safari-gold/50 flex justify-center pt-2.5 backdrop-blur-sm"
            >
              <motion.div 
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1.5 h-3 rounded-full bg-gradient-to-b from-safari-gold to-safari-amber" 
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
