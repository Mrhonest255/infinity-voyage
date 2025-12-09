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
  MessageCircle
} from "lucide-react";
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
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-primary/10 via-background to-safari-gold/5">
        <div className="container-wide mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-3 mb-6">
              <Calculator className="w-8 h-8 text-safari-gold" />
              <span className="text-safari-gold text-sm font-semibold uppercase tracking-[0.2em]">
                Safari Planner
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-6">
              Safari <span className="text-gradient-gold">Price Calculator</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Use our interactive calculator to estimate the cost of your safari adventure.
              Select your preferred destination, season, group size, and duration.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-16 md:py-24">
        <div className="container-wide mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Calculator Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="shadow-luxury border-0">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-semibold mb-8 flex items-center gap-3">
                    <Calculator className="w-6 h-6 text-primary" />
                    Safari Price Calculator
                  </h2>

                  <div className="space-y-6">
                    {/* Destination */}
                    <div>
                      <label className="block text-sm font-semibold mb-3">Safari Destination</label>
                      <Select value={destination} onValueChange={setDestination}>
                        <SelectTrigger className="h-14 text-base">
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
                      <label className="block text-sm font-semibold mb-3">
                        Travel Season
                        <span className="text-muted-foreground font-normal ml-2">
                          Current season: {isHighSeason ? "High" : "Low"} Season
                        </span>
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          onClick={() => setSeason("high")}
                          className={`p-4 rounded-xl border-2 text-left transition-all ${
                            season === "high" 
                              ? "border-primary bg-primary/5" 
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Sun className="w-5 h-5 text-safari-gold" />
                            <span className="font-semibold">High Season</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            June - October & Dec - Feb
                          </p>
                        </button>
                        <button
                          onClick={() => setSeason("low")}
                          className={`p-4 rounded-xl border-2 text-left transition-all ${
                            season === "low" 
                              ? "border-primary bg-primary/5" 
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <CloudRain className="w-5 h-5 text-primary" />
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
                      <label className="block text-sm font-semibold mb-3">Group Size</label>
                      <Select value={groupSize} onValueChange={setGroupSize}>
                        <SelectTrigger className="h-14 text-base">
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
                      <label className="block text-sm font-semibold mb-3">Exact Number of People</label>
                      <div className="flex items-center gap-4">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setNumPeople(Math.max(1, numPeople - 1))}
                          className="h-12 w-12"
                        >
                          -
                        </Button>
                        <span className="text-2xl font-bold w-12 text-center">{numPeople}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setNumPeople(Math.min(20, numPeople + 1))}
                          className="h-12 w-12"
                        >
                          +
                        </Button>
                      </div>
                    </div>

                    {/* Duration */}
                    <div>
                      <label className="block text-sm font-semibold mb-3">Safari Duration</label>
                      <Select value={duration} onValueChange={setDuration}>
                        <SelectTrigger className="h-14 text-base">
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

                    {/* Price Display */}
                    <div className="bg-gradient-to-br from-primary/10 to-safari-gold/10 rounded-2xl p-6 mt-8">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-muted-foreground">Price per person:</span>
                        <span className="text-3xl font-bold text-primary">${calculatedPrice.perPerson}</span>
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t border-border">
                        <span className="text-muted-foreground">Total price:</span>
                        <span className="text-4xl font-bold text-safari-gold">${calculatedPrice.total}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-4">
                        Based on {numPeople} {numPeople === 1 ? "person" : "people"} for {selectedDuration?.label.toLowerCase()} in {season} season
                      </p>
                    </div>

                    {/* Book Button */}
                    <Button 
                      size="xl" 
                      className="w-full bg-gradient-to-r from-safari-gold to-safari-amber text-safari-night font-bold shadow-gold hover:shadow-glow"
                      onClick={() => window.open(`https://wa.me/255758241294?text=Hello! I'm interested in a ${selectedDest?.name} safari for ${numPeople} people, ${selectedDuration?.label}. Estimated price: $${calculatedPrice.total}`, "_blank")}
                    >
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Book This Safari via WhatsApp
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Included Items & Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-8"
            >
              {/* What's Included */}
              <Card className="shadow-elevated border-0">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold mb-6">What's Included:</h3>
                  <div className="space-y-4">
                    {includedItems.map((item, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <item.icon className="w-5 h-5 text-primary" />
                        </div>
                        <span className="text-foreground">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Season Info */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="border-safari-gold/30 bg-safari-gold/5">
                  <CardContent className="p-6">
                    <Sun className="w-8 h-8 text-safari-gold mb-3" />
                    <h4 className="font-semibold mb-2">High Season</h4>
                    <p className="text-sm text-muted-foreground">
                      Best wildlife viewing. Clear skies, animals gather at water sources.
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-primary/30 bg-primary/5">
                  <CardContent className="p-6">
                    <CloudRain className="w-8 h-8 text-primary mb-3" />
                    <h4 className="font-semibold mb-2">Low Season</h4>
                    <p className="text-sm text-muted-foreground">
                      Lower prices, fewer tourists, lush green landscapes.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Tips */}
              <Card className="border-0 bg-muted/50">
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <Info className="w-5 h-5 text-primary" />
                    Safari Planning Tips
                  </h4>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-safari-gold mt-0.5" />
                      Book 3-6 months in advance for high season safaris
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-safari-gold mt-0.5" />
                      Groups of 4 or more enjoy better per-person rates
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-safari-gold mt-0.5" />
                      Multi-day safaris offer more immersive experiences
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-16 bg-muted/30">
        <div className="container-wide mx-auto px-4 md:px-8">
          <h2 className="text-3xl font-semibold text-center mb-12">Safari Destinations</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {safariDestinations.slice(0, 3).map((dest) => (
              <Card key={dest.id} className="safari-card hover-lift">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{dest.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{dest.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">From</span>
                    <span className="text-xl font-bold text-primary">${dest.basePrice.low}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
