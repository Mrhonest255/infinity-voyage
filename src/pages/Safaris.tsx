import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Clock, Check, MapPin, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

import serengetiImg from "@/assets/serengeti.jpg";
import zanzibarImg from "@/assets/zanzibar.jpg";
import kilimanjaroImg from "@/assets/kilimanjaro.jpg";
import ngorongoroImg from "@/assets/ngorongoro.jpg";
import tarangireImg from "@/assets/tarangire.jpg";
import stoneTownImg from "@/assets/stone-town.jpg";

const safaris = [
  {
    id: 1,
    name: "Serengeti Great Migration Safari",
    location: "Serengeti National Park",
    duration: "7 Days",
    image: serengetiImg,
    price: 3200,
    category: "Wildlife Safari",
    highlights: ["Great Migration", "Big Five", "Hot Air Balloon", "Luxury Camps"],
    description: "Witness millions of wildebeest crossing the Serengeti plains in one of nature's greatest spectacles.",
  },
  {
    id: 2,
    name: "Ngorongoro Crater Adventure",
    location: "Ngorongoro Conservation Area",
    duration: "3 Days",
    image: ngorongoroImg,
    price: 1800,
    category: "Wildlife Safari",
    highlights: ["Crater Floor Game Drive", "Maasai Village", "Flamingo Lakes"],
    description: "Explore the world's largest intact volcanic caldera, home to an incredible concentration of wildlife.",
  },
  {
    id: 3,
    name: "Mount Kilimanjaro Trek",
    location: "Kilimanjaro Region",
    duration: "8 Days",
    image: kilimanjaroImg,
    price: 4500,
    category: "Trekking",
    highlights: ["Summit Attempt", "Machame Route", "Experienced Guides", "Full Support"],
    description: "Conquer Africa's highest peak via the scenic Machame route with our expert mountain guides.",
  },
  {
    id: 4,
    name: "Tarangire Elephant Safari",
    location: "Tarangire National Park",
    duration: "4 Days",
    image: tarangireImg,
    price: 2100,
    category: "Wildlife Safari",
    highlights: ["Elephant Herds", "Baobab Trees", "Walking Safari", "Bird Watching"],
    description: "Experience close encounters with large elephant herds among ancient baobab trees.",
  },
  {
    id: 5,
    name: "Northern Circuit Complete",
    location: "Multiple Parks",
    duration: "12 Days",
    image: serengetiImg,
    price: 6500,
    category: "Combo Package",
    highlights: ["4 National Parks", "Luxury Lodges", "All Inclusive", "Private Guide"],
    description: "The ultimate Tanzania safari covering Serengeti, Ngorongoro, Tarangire, and Lake Manyara.",
  },
];

const categories = ["All Safaris", "Wildlife Safari", "Trekking", "Combo Package"];

const Safaris = () => {
  const [activeCategory, setActiveCategory] = useState("All Safaris");

  const filteredSafaris = activeCategory === "All Safaris" 
    ? safaris 
    : safaris.filter(s => s.category === activeCategory);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-safari-night">
        <div className="container-wide mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4">
              Mainland Safaris
            </h1>
            <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              Explore Tanzania's iconic national parks and witness the incredible wildlife of East Africa
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-muted/30 sticky top-20 z-30 border-b border-border">
        <div className="container-wide mx-auto px-4 md:px-8">
          <div className="flex items-center gap-4 overflow-x-auto pb-2">
            <Filter className="w-5 h-5 text-muted-foreground shrink-0" />
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-background text-foreground hover:bg-primary/10"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Safari List */}
      <section className="section-padding">
        <div className="container-wide mx-auto">
          <div className="grid gap-8">
            {filteredSafaris.map((safari, index) => (
              <motion.div
                key={safari.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="safari-card grid md:grid-cols-3 overflow-hidden"
              >
                {/* Image */}
                <div className="relative h-64 md:h-auto">
                  <img
                    src={safari.image}
                    alt={safari.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-primary text-primary-foreground">
                      {safari.category}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="md:col-span-2 p-6 md:p-8 flex flex-col">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <MapPin className="w-4 h-4" />
                        {safari.location}
                      </div>
                      <h3 className="font-display text-2xl font-semibold text-foreground">
                        {safari.name}
                      </h3>
                    </div>
                    <Badge variant="outline" className="shrink-0">
                      <Clock className="w-3 h-3 mr-1" />
                      {safari.duration}
                    </Badge>
                  </div>

                  <p className="text-muted-foreground mb-6 flex-grow">
                    {safari.description}
                  </p>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-3 mb-6">
                    {safari.highlights.map((highlight) => (
                      <div
                        key={highlight}
                        className="flex items-center gap-1.5 text-sm text-foreground"
                      >
                        <Check className="w-4 h-4 text-safari-sage" />
                        {highlight}
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div>
                      <span className="text-sm text-muted-foreground">From</span>
                      <p className="text-2xl font-bold text-primary">
                        ${safari.price.toLocaleString()}
                        <span className="text-sm font-normal text-muted-foreground"> /person</span>
                      </p>
                    </div>
                    <Button variant="safari" size="lg">
                      View Details
                      <ArrowRight className="w-4 h-4 ml-2" />
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

export default Safaris;
