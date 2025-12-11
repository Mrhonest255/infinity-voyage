import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calculator, 
  Users, 
  Calendar, 
  MapPin, 
  Plane, 
  Check, 
  Sun, 
  CloudRain,
  Camera,
  Utensils,
  Car,
  Home,
  Info,
  MessageCircle,
  Mail
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Safari pricing data
const safariDestinations = [
  { 
    id: "mikumi", 
    name: "Mikumi National Park", 
    description: "Often called Tanzania's 'Little Serengeti'",
    basePrice: { high: 350, low: 280 }
  },
  { 
    id: "selous", 
    name: "Selous Game Reserve (Nyerere)", 
    description: "One of Africa's largest wildlife reserves",
    basePrice: { high: 420, low: 350 }
  },
  { 
    id: "serengeti", 
    name: "Serengeti National Park", 
    description: "Tanzania's most famous national park",
    basePrice: { high: 650, low: 520 }
  },
  { 
    id: "ngorongoro", 
    name: "Ngorongoro Crater", 
    description: "World's largest intact volcanic caldera",
    basePrice: { high: 580, low: 480 }
  },
  { 
    id: "tarangire", 
    name: "Tarangire National Park", 
    description: "Famous for its elephant herds and baobab trees",
    basePrice: { high: 380, low: 300 }
  },
];

const groupSizeOptions = [
  { id: "1", label: "1 Person", multiplier: 1.5 },
  { id: "2-3", label: "2-3 People", multiplier: 1.0 },
  { id: "4-5", label: "4-5 People", multiplier: 0.9 },
  { id: "6+", label: "6+ People", multiplier: 0.8 },
];

const durationOptions = [
  { id: "1", label: "1 Day (Go & Return)", nights: 0, multiplier: 0.6 },
  { id: "2", label: "2 Days / 1 Night", nights: 1, multiplier: 1.0 },
  { id: "3", label: "3 Days / 2 Nights", nights: 2, multiplier: 1.8 },
  { id: "4", label: "4 Days / 3 Nights", nights: 3, multiplier: 2.5 },
];

const includedItems = [
  { icon: Plane, text: "Return flights from Zanzibar" },
  { icon: MapPin, text: "Park entrance fees" },
  { icon: Users, text: "Professional safari guide" },
  { icon: Car, text: "Game drives in 4x4 vehicles" },
  { icon: Home, text: "Accommodation" },
  { icon: Utensils, text: "All meals" },
  { icon: Camera, text: "Bottled water and soft drinks" },
];

export default function SafariCalculator() {
  const [destination, setDestination] = useState("mikumi");
  const [season, setSeason] = useState<"high" | "low">("low");
  const [groupSize, setGroupSize] = useState("2-3");
  const [duration, setDuration] = useState("2");
  const [numPeople, setNumPeople] = useState(2);

  // Calculate price
  const calculatedPrice = useMemo(() => {
    const dest = safariDestinations.find(d => d.id === destination);
    const group = groupSizeOptions.find(g => g.id === groupSize);
    const dur = durationOptions.find(d => d.id === duration);
    
    if (!dest || !group || !dur) return { perPerson: 0, total: 0 };
    
    const basePrice = dest.basePrice[season];
    const pricePerPerson = Math.round(basePrice * group.multiplier * dur.multiplier);
    const totalPrice = pricePerPerson * numPeople;
    
    return { perPerson: pricePerPerson, total: totalPrice };
  }, [destination, season, groupSize, duration, numPeople]);

  const selectedDest = safariDestinations.find(d => d.id === destination);
  const selectedDuration = durationOptions.find(d => d.id === duration);

  // Get current month to determine season
  const currentMonth = new Date().getMonth();
  const isHighSeason = [5, 6, 7, 8, 9, 11, 0, 1].includes(currentMonth); // June-Oct, Dec-Feb

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Premium Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-safari-cream via-background to-safari-gold/5 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-gradient-to-br from-safari-gold/15 to-safari-amber/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/4 left-10 w-24 h-24 border border-safari-gold/20 rounded-full" />
        <div className="absolute bottom-1/4 right-20 w-16 h-16 border border-primary/20 rounded-full" />
        
        <div className="container-wide mx-auto px-4 md:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-3 mb-8 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full border border-safari-gold/30 shadow-soft"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-safari-gold to-safari-amber flex items-center justify-center">
                <Calculator className="w-5 h-5 text-white" />
              </div>
              <span className="text-safari-brown text-sm font-semibold uppercase tracking-[0.2em]">
                Safari Planner
              </span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-6"
            >
              Safari <span className="text-gradient-gold">Price Calculator</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              Use our interactive calculator to estimate the cost of your safari adventure.
              Select your preferred destination, season, group size, and duration.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Premium Calculator Section */}
      <section className="py-20 md:py-28">
        <div className="container-wide mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Premium Calculator Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="shadow-luxury border border-border/50 rounded-2xl bg-white">
                <CardContent className="p-8 md:p-10">
                  <h2 className="font-display text-2xl font-semibold mb-8 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-safari-gold/20 to-safari-amber/10 flex items-center justify-center">
                      <Calculator className="w-6 h-6 text-safari-gold" />
                    </div>
                    Safari Price Calculator
                  </h2>

                  <div className="space-y-7">
                    {/* Destination */}
                    <div>
                      <label className="block text-sm font-semibold mb-3 text-foreground">Safari Destination</label>
                      <Select value={destination} onValueChange={setDestination}>
                        <SelectTrigger className="h-14 text-base rounded-xl border-border/50 focus:border-safari-gold">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {safariDestinations.map(dest => (
                            <SelectItem key={dest.id} value={dest.id}>
                              <div>
                                <p className="font-medium">{dest.name}</p>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {selectedDest && (
                        <p className="text-sm text-muted-foreground mt-2">{selectedDest.description}</p>
                      )}
                    </div>

                    {/* Season */}
                    <div>
                      <label className="block text-sm font-semibold mb-3 text-foreground">
                        Travel Season
                        <Badge className="ml-2 bg-safari-gold/10 text-safari-brown border-0 font-normal">
                          Current: {isHighSeason ? "High" : "Low"} Season
                        </Badge>
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          onClick={() => setSeason("high")}
                          className={`p-5 rounded-2xl border-2 text-left transition-all ${
                            season === "high" 
                              ? "border-safari-gold bg-safari-gold/5 shadow-soft" 
                              : "border-border/50 hover:border-safari-gold/50"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-safari-gold/20 flex items-center justify-center">
                              <Sun className="w-4 h-4 text-safari-gold" />
                            </div>
                            <span className="font-semibold">High Season</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            June - October & Dec - Feb
                          </p>
                        </button>
                        <button
                          onClick={() => setSeason("low")}
                          className={`p-5 rounded-2xl border-2 text-left transition-all ${
                            season === "low" 
                              ? "border-primary bg-primary/5 shadow-soft" 
                              : "border-border/50 hover:border-primary/50"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                              <CloudRain className="w-4 h-4 text-primary" />
                            </div>
                            <span className="font-semibold">Low Season</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            March - May & November
                          </p>
                        </button>
                      </div>
                    </div>

                    {/* Group Size */}
                    <div>
                      <label className="block text-sm font-semibold mb-3 text-foreground">Group Size</label>
                      <Select value={groupSize} onValueChange={setGroupSize}>
                        <SelectTrigger className="h-14 text-base rounded-xl border-border/50 focus:border-safari-gold">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {groupSizeOptions.map(opt => (
                            <SelectItem key={opt.id} value={opt.id}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Number of People */}
                    <div>
                      <label className="block text-sm font-semibold mb-3 text-foreground">Exact Number of People</label>
                      <div className="flex items-center gap-4">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setNumPeople(Math.max(1, numPeople - 1))}
                          className="h-14 w-14 rounded-xl border-2 border-border/50 text-lg font-bold"
                        >
                          -
                        </Button>
                        <span className="text-3xl font-bold w-16 text-center">{numPeople}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setNumPeople(Math.min(20, numPeople + 1))}
                          className="h-14 w-14 rounded-xl border-2 border-border/50 text-lg font-bold"
                        >
                          +
                        </Button>
                      </div>
                    </div>

                    {/* Duration */}
                    <div>
                      <label className="block text-sm font-semibold mb-3 text-foreground">Safari Duration</label>
                      <Select value={duration} onValueChange={setDuration}>
                        <SelectTrigger className="h-14 text-base rounded-xl border-border/50 focus:border-safari-gold">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {durationOptions.map(opt => (
                            <SelectItem key={opt.id} value={opt.id}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Premium Price Display */}
                    <div className="bg-gradient-to-br from-safari-gold/10 via-safari-amber/5 to-safari-cream/30 rounded-2xl p-8 mt-8 border border-safari-gold/20">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-muted-foreground font-medium">Price per person:</span>
                        <span className="text-3xl font-bold text-primary">${calculatedPrice.perPerson}</span>
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t border-safari-gold/20">
                        <span className="text-muted-foreground font-medium">Total price:</span>
                        <span className="text-4xl font-bold text-safari-gold">${calculatedPrice.total}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-4">
                        Based on {numPeople} {numPeople === 1 ? "person" : "people"} for {selectedDuration?.label.toLowerCase()} in {season} season
                      </p>
                    </div>

                    {/* Premium Dual Booking Options */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                      <Link 
                        to={`/contact?subject=Safari%20Booking&safari=${encodeURIComponent(selectedDest?.name || '')}&people=${numPeople}&duration=${encodeURIComponent(selectedDuration?.label || '')}&price=${calculatedPrice.total}`}
                        className="flex-1"
                      >
                        <Button 
                          size="xl" 
                          variant="outline"
                          className="w-full h-14 border-2 border-safari-gold text-safari-brown hover:bg-safari-gold/10 font-bold rounded-xl"
                        >
                          <Mail className="w-5 h-5 mr-2" />
                          Book via Email
                        </Button>
                      </Link>
                      <Button 
                        size="xl" 
                        className="flex-1 h-14 bg-gradient-to-r from-green-600 to-green-500 text-white font-bold shadow-lg hover:shadow-xl hover:from-green-500 hover:to-green-600 rounded-xl"
                        onClick={() => window.open(`https://wa.me/255758241294?text=Hello! I'm interested in a ${selectedDest?.name} safari for ${numPeople} people, ${selectedDuration?.label}. Estimated price: $${calculatedPrice.total}`, "_blank")}
                      >
                        <MessageCircle className="w-5 h-5 mr-2" />
                        Book via WhatsApp
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Premium Included Items & Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-8"
            >
              {/* What's Included */}
              <Card className="shadow-luxury border border-border/50 rounded-2xl bg-white">
                <CardContent className="p-8">
                  <h3 className="font-display text-xl font-semibold mb-6">What's Included:</h3>
                  <div className="space-y-4">
                    {includedItems.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 rounded-xl bg-safari-cream/30 border border-safari-gold/10">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-safari-gold/20 to-safari-amber/10 flex items-center justify-center shrink-0">
                          <item.icon className="w-6 h-6 text-safari-gold" />
                        </div>
                        <span className="text-foreground font-medium">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Season Info */}
              <div className="grid grid-cols-2 gap-5">
                <Card className="border-2 border-safari-gold/30 bg-gradient-to-br from-safari-gold/5 to-safari-amber/5 rounded-2xl">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-safari-gold/20 flex items-center justify-center mb-4">
                      <Sun className="w-6 h-6 text-safari-gold" />
                    </div>
                    <h4 className="font-semibold mb-2">High Season</h4>
                    <p className="text-sm text-muted-foreground">
                      Best wildlife viewing. Clear skies, animals gather at water sources.
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                      <CloudRain className="w-6 h-6 text-primary" />
                    </div>
                    <h4 className="font-semibold mb-2">Low Season</h4>
                    <p className="text-sm text-muted-foreground">
                      Lower prices, fewer tourists, lush green landscapes.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Tips */}
              <Card className="border border-border/50 bg-safari-cream/30 rounded-2xl">
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Info className="w-5 h-5 text-primary" />
                    </div>
                    Safari Planning Tips
                  </h4>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-safari-gold/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-safari-gold" />
                      </div>
                      Book 3-6 months in advance for high season safaris
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-safari-gold/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-safari-gold" />
                      </div>
                      Groups of 4 or more enjoy better per-person rates
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-safari-gold/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-safari-gold" />
                      </div>
                      Multi-day safaris offer more immersive experiences
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Premium Destinations Grid */}
      <section className="py-20 bg-gradient-to-br from-safari-cream/50 via-background to-safari-gold/5">
        <div className="container-wide mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-safari-gold text-sm font-semibold uppercase tracking-[0.2em]">Explore</span>
            <h2 className="font-display text-3xl md:text-4xl font-semibold mt-4">Safari Destinations</h2>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {safariDestinations.slice(0, 3).map((dest, index) => (
              <motion.div
                key={dest.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="group bg-white rounded-2xl border border-border/50 shadow-soft hover:shadow-luxury transition-all duration-500 overflow-hidden">
                  <CardContent className="p-8">
                    <h3 className="font-display text-xl font-semibold mb-2 group-hover:text-safari-gold transition-colors">{dest.name}</h3>
                    <p className="text-muted-foreground text-sm mb-6">{dest.description}</p>
                    <div className="flex justify-between items-center pt-4 border-t border-border/50">
                      <span className="text-sm text-muted-foreground">From</span>
                      <span className="text-2xl font-bold text-safari-gold">${dest.basePrice.low}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
