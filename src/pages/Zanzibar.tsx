import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Clock, Check, MapPin, Sun, Waves } from "lucide-react";
import { motion } from "framer-motion";

import zanzibarImg from "@/assets/zanzibar.jpg";
import stoneTownImg from "@/assets/stone-town.jpg";

const excursions = [
  {
    id: 1,
    name: "Spice Plantation Tour",
    duration: "Half Day",
    image: stoneTownImg,
    price: 45,
    category: "Cultural",
    highlights: ["Spice Tasting", "Local Guide", "Lunch Included"],
    description: "Discover the aromatic world of Zanzibar's famous spices including cloves, cinnamon, and vanilla.",
  },
  {
    id: 2,
    name: "Stone Town Walking Tour",
    duration: "4 Hours",
    image: stoneTownImg,
    price: 35,
    category: "Cultural",
    highlights: ["UNESCO Heritage Site", "Local Guide", "Historical Sites"],
    description: "Explore the winding streets, markets, and historical landmarks of this UNESCO World Heritage Site.",
  },
  {
    id: 3,
    name: "Mnemba Atoll Snorkeling",
    duration: "Full Day",
    image: zanzibarImg,
    price: 85,
    category: "Marine",
    highlights: ["Snorkeling Gear", "Boat Trip", "Seafood Lunch", "Dolphin Spotting"],
    description: "Snorkel in crystal-clear waters around the pristine Mnemba Atoll marine reserve.",
  },
  {
    id: 4,
    name: "Jozani Forest Tour",
    duration: "Half Day",
    image: stoneTownImg,
    price: 40,
    category: "Nature",
    highlights: ["Red Colobus Monkeys", "Nature Walk", "Mangrove Boardwalk"],
    description: "Visit the last remaining indigenous forest in Zanzibar, home to the rare Red Colobus monkeys.",
  },
  {
    id: 5,
    name: "Sunset Dhow Cruise",
    duration: "3 Hours",
    image: zanzibarImg,
    price: 55,
    category: "Leisure",
    highlights: ["Traditional Dhow", "Drinks & Snacks", "Sunset Views"],
    description: "Sail on a traditional dhow as the sun sets over the Indian Ocean with refreshments included.",
  },
  {
    id: 6,
    name: "Prison Island & Dolphins",
    duration: "Full Day",
    image: zanzibarImg,
    price: 95,
    category: "Marine",
    highlights: ["Giant Tortoises", "Dolphin Swimming", "Snorkeling", "Lunch"],
    description: "Swim with dolphins and visit the historic Prison Island with its giant Aldabra tortoises.",
  },
  {
    id: 7,
    name: "Nungwi Beach Day",
    duration: "Full Day",
    image: zanzibarImg,
    price: 65,
    category: "Beach",
    highlights: ["Beach Access", "Lunch", "Water Sports Options"],
    description: "Relax on the stunning white sands of Nungwi, one of Zanzibar's most beautiful beaches.",
  },
  {
    id: 8,
    name: "Safari Blue Excursion",
    duration: "Full Day",
    image: zanzibarImg,
    price: 110,
    category: "Marine",
    highlights: ["Sailing", "Snorkeling", "Sandbank Picnic", "Seafood Feast"],
    description: "The ultimate marine adventure with sailing, snorkeling, and a gourmet seafood lunch on a sandbank.",
  },
];

const Zanzibar = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={zanzibarImg}
            alt="Zanzibar Beach"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-safari-night/60" />
        </div>
        <div className="relative container-wide mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4">
              Zanzibar Excursions
            </h1>
            <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              Discover paradise with our curated selection of island adventures and cultural experiences
            </p>
          </motion.div>
        </div>
      </section>

      {/* Info Cards */}
      <section className="py-8 -mt-16 relative z-10">
        <div className="container-wide mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-background rounded-xl p-6 shadow-elevated flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Sun className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Best Time to Visit</h3>
                <p className="text-sm text-muted-foreground">June to October (Dry Season)</p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-background rounded-xl p-6 shadow-elevated flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-full bg-safari-gold/10 flex items-center justify-center shrink-0">
                <Waves className="w-6 h-6 text-safari-gold" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Water Temperature</h3>
                <p className="text-sm text-muted-foreground">25-29°C year-round</p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-background rounded-xl p-6 shadow-elevated flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-full bg-safari-sage/10 flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6 text-safari-sage" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Location</h3>
                <p className="text-sm text-muted-foreground">East African Coast, Indian Ocean</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Excursions Grid */}
      <section className="section-padding">
        <div className="container-wide mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
              Available Excursions
            </h2>
            <p className="text-muted-foreground">
              Book individual excursions or combine multiple for the perfect Zanzibar experience
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {excursions.map((excursion, index) => (
              <motion.div
                key={excursion.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="safari-card group"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={excursion.image}
                    alt={excursion.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge className="bg-background/90 backdrop-blur-sm text-foreground text-xs">
                      {excursion.category}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3">
                    <Badge variant="outline" className="bg-background/90 backdrop-blur-sm text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      {excursion.duration}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                    {excursion.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {excursion.description}
                  </p>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {excursion.highlights.slice(0, 2).map((highlight) => (
                      <span
                        key={highlight}
                        className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground"
                      >
                        {highlight}
                      </span>
                    ))}
                    {excursion.highlights.length > 2 && (
                      <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                        +{excursion.highlights.length - 2} more
                      </span>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div>
                      <span className="text-xl font-bold text-primary">
                        ${excursion.price}
                      </span>
                      <span className="text-sm text-muted-foreground"> /person</span>
                    </div>
                    <Button variant="safari" size="sm">
                      Book
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Zanzibar;
