import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, MapPin, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

import serengetiImg from "@/assets/serengeti.jpg";
import zanzibarImg from "@/assets/zanzibar.jpg";
import kilimanjaroImg from "@/assets/kilimanjaro.jpg";
import ngorongoroImg from "@/assets/ngorongoro.jpg";
import tarangireImg from "@/assets/tarangire.jpg";
import stoneTownImg from "@/assets/stone-town.jpg";

const categories = ["All Destinations", "Safari", "Zanzibar", "Trekking"];

// Default placeholder images when no image is uploaded
const placeholderImages = [serengetiImg, zanzibarImg, kilimanjaroImg, ngorongoroImg, tarangireImg, stoneTownImg];

interface Tour {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  featured_image: string | null;
  category: string;
  price: number | null;
  currency: string | null;
  duration: string | null;
  is_featured: boolean | null;
  highlights: string[] | null;
}

export const Destinations = () => {
  const [activeCategory, setActiveCategory] = useState("All Destinations");
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      const { data, error } = await supabase
        .from('tours')
        .select('*')
        .eq('is_published', true)
        .order('is_featured', { ascending: false })
        .limit(6);
      
      if (error) throw error;
      setTours(data || []);
    } catch (error) {
      console.error('Error fetching tours:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredTours = () => {
    if (activeCategory === "All Destinations") return tours;
    return tours.filter((tour) => 
      tour.category.toLowerCase() === activeCategory.toLowerCase()
    );
  };

  const filteredTours = getFilteredTours();

  const getPlaceholderImage = (index: number) => {
    return placeholderImages[index % placeholderImages.length];
  };

  if (loading) {
    return (
      <section className="section-padding bg-muted/30">
        <div className="container-wide mx-auto flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  if (tours.length === 0) {
    return (
      <section className="section-padding bg-muted/30">
        <div className="container-wide mx-auto space-y-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-3">
                Popular Destinations
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl">
                We are curating the best experiences. Share your dream and we will map the perfect route.
              </p>
            </div>
            <Link to="/contact">
              <Button variant="safari" size="lg">
                Talk to a planner
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {placeholderImages.slice(0, 3).map((image, index) => (
              <div key={index} className="safari-card overflow-hidden">
                <div className="relative h-64">
                  <img src={image} alt="Destination coming soon" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-safari-night/60 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
                      Curating now
                    </Badge>
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    Tanzania & Zanzibar
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground">Tailored Escape</h3>
                  <p className="text-muted-foreground text-sm">
                    Tell us what you would love to see and we will recommend a route, lodges, and activities.
                  </p>
                  <Button asChild variant="ghost" size="sm" className="text-primary">
                    <Link to="/contact">
                      Start planning
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-muted/30">
      <div className="container-wide mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-4">
              Popular Destinations
            </h2>
            <p className="text-lg text-muted-foreground">
              Explore the top-rated places in Tanzania & Zanzibar
            </p>
          </motion.div>
          <Link to="/safaris">
            <Button variant="outline" size="lg">
              View All Places
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-3 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === category
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "bg-background text-foreground hover:bg-primary/10"
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Season Tip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="bg-safari-gold/10 border border-safari-gold/30 rounded-xl p-4 mb-12"
        >
          <p className="text-sm text-foreground">
            <span className="font-semibold">Best Season?</span> June to October
            is perfect for safaris (Dry Season). December to February is great
            for calving season in the Serengeti.
          </p>
        </motion.div>

        {/* Destination Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTours.map((tour, index) => (
            <motion.div
              key={tour.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group safari-card"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={tour.featured_image || getPlaceholderImage(index)}
                  alt={tour.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <Badge
                    variant="secondary"
                    className="bg-background/90 backdrop-blur-sm"
                  >
                    {tour.category}
                  </Badge>
                </div>
                {tour.is_featured && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-safari-gold text-safari-night">
                      Featured
                    </Badge>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <MapPin className="w-4 h-4" />
                  Tanzania
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  {tour.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {tour.short_description || 'Discover this amazing destination'}
                </p>

                {/* Highlights */}
                {tour.highlights && tour.highlights.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tour.highlights.slice(0, 2).map((highlight) => (
                      <span
                        key={highlight}
                        className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    {tour.price && (
                      <>
                        <span className="text-2xl font-bold text-primary">
                          ${tour.price.toLocaleString()}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {" "}/ person
                        </span>
                      </>
                    )}
                  </div>
                  <Link to={`/tour/${tour.slug}`}>
                    <Button variant="safari" size="sm">
                      Book Now
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link to="/safaris">
            <Button variant="outline" size="lg">
              View All Destinations
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};