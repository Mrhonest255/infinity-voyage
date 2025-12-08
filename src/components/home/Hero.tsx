import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Search, Calendar as CalendarIcon, Users, Play, Minus, Plus } from "lucide-react";
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

export const Hero = () => {
  const navigate = useNavigate();
  const { data: settings } = useSiteSettings();
  const [destination, setDestination] = useState("");
  const [showDestinations, setShowDestinations] = useState(false);
  const [date, setDate] = useState<Date>();
  const [guests, setGuests] = useState(2);
  const [showGuests, setShowGuests] = useState(false);

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

  const handlePlay = () => {
    const videoUrl = settings?.homepage?.heroVideo;
    if (videoUrl) {
      window.open(videoUrl, "_blank", "noopener,noreferrer");
    }
  };

  const heroTitle = settings?.homepage?.heroTitle?.trim() || "INFINITY VOYAGE";
  const heroSubtitle = settings?.homepage?.heroSubtitle?.trim() || "Your Gateway to Endless Exploration";

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="African Safari Sunset"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-safari-night/40 via-safari-night/30 to-safari-night/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 container-wide mx-auto px-4 md:px-8 pt-32 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-12"
        >
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-primary-foreground mb-6 tracking-tight">
            {heroTitle}
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90 tracking-[0.2em] uppercase font-light">
            {heroSubtitle}
          </p>
        </motion.div>

        {/* Play Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex justify-center mb-16"
        >
          <button
            className="group relative w-20 h-20 rounded-full bg-primary-foreground/20 backdrop-blur-sm border border-primary-foreground/30 flex items-center justify-center hover:bg-primary-foreground/30 transition-all duration-300 disabled:opacity-50"
            onClick={handlePlay}
            disabled={!settings?.homepage?.heroVideo}
          >
            <Play className="w-8 h-8 text-primary-foreground ml-1" />
            <div className="absolute inset-0 rounded-full border border-primary-foreground/30 animate-ping" />
          </button>
        </motion.div>

        {/* Search Box */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="max-w-5xl mx-auto"
        >
          <div className="bg-background/95 backdrop-blur-md rounded-2xl shadow-elevated p-3 md:p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Destination */}
              <div className="relative">
                <div 
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors cursor-pointer"
                  onClick={() => setShowDestinations(!showDestinations)}
                >
                  <Search className="w-5 h-5 text-primary shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
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
                      className="border-0 p-0 h-auto text-sm font-medium focus-visible:ring-0 bg-transparent"
                    />
                  </div>
                </div>
                {showDestinations && destination.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-background rounded-lg shadow-lg border border-border z-50 max-h-60 overflow-auto">
                    {filteredDestinations.map((d) => (
                      <button
                        key={d}
                        onClick={() => {
                          setDestination(d);
                          setShowDestinations(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-muted transition-colors text-sm"
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="hidden md:block border-l border-border" />

              {/* Date */}
              <Popover>
                <PopoverTrigger asChild>
                  <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors cursor-pointer">
                    <CalendarIcon className="w-5 h-5 text-primary shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Date
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {date ? format(date, "MMM dd, yyyy") : "Add Dates"}
                      </p>
                    </div>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              {/* Divider */}
              <div className="hidden md:block border-l border-border" />

              {/* Guests */}
              <Popover open={showGuests} onOpenChange={setShowGuests}>
                <PopoverTrigger asChild>
                  <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors cursor-pointer">
                    <Users className="w-5 h-5 text-primary shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Guests
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {guests} {guests === 1 ? "Guest" : "Guests"}
                      </p>
                    </div>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-48" align="start">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Guests</span>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setGuests(Math.max(1, guests - 1))}
                        disabled={guests <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center font-medium">{guests}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setGuests(Math.min(20, guests + 1))}
                        disabled={guests >= 20}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Search Button */}
              <div className="md:pl-2">
                <Button variant="safari" size="lg" className="w-full" onClick={handleSearch}>
                  <Search className="w-4 h-4 mr-2" />
                  Explore
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/50 flex justify-center pt-2">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-primary-foreground"
          />
        </div>
      </motion.div>
    </section>
  );
};
