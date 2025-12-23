import { useState, useEffect } from "react";
import { useAuth } from '@/hooks/useAuth';
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
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      let query = supabase
        .from('tours')
        .select('*')
        .order('is_featured', { ascending: false })
        .limit(6);
      if (!isAdmin) query = query.eq('is_published', true);
      const { data, error } = await query;
      
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
    <section className="section-padding bg-gradient-to-b from-muted/30 via-background to-muted/30 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-safari-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="container-wide mx-auto relative">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-8 mb-10 sm:mb-12 lg:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Section label */}
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <span className="w-8 sm:w-10 h-px bg-safari-gold" />
              <span className="text-safari-gold text-xs sm:text-sm font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em]">
                Destinations
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-3 sm:mb-5">
              Popular <span className="text-gradient-gold">Destinations</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl">
              Explore the top-rated places in Tanzania & Zanzibar
            </p>
          </motion.div>
          <Link to="/safaris" className="hidden sm:block">
            <Button variant="outline" size="lg" className="rounded-xl border-2 hover:border-primary hover:bg-primary/5 transition-all duration-300">
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
          transition={{ delay: 0.1, duration: 0.6 }}
          className="flex gap-2 sm:gap-3 mb-8 sm:mb-10 lg:mb-14 overflow-x-auto pb-2 scroll-smooth-touch -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-400 whitespace-nowrap touch-target flex-shrink-0 ${
                activeCategory === category
                  ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-elevated"
                  : "bg-background text-foreground border border-border hover:border-primary/50 hover:shadow-soft"
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
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-gradient-to-r from-safari-gold/10 via-safari-gold/5 to-safari-gold/10 border border-safari-gold/30 rounded-xl sm:rounded-2xl p-4 sm:p-5 mb-8 sm:mb-10 lg:mb-14 backdrop-blur-sm"
        >
          <p className="text-xs sm:text-sm text-foreground">
            <span className="font-semibold text-safari-gold">✦ Best Season:</span> June to October
            is perfect for safaris (Dry Season). December to February is great
            for calving season in the Serengeti.
          </p>
        </motion.div>

        {/* Destination Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {filteredTours.map((tour, index) => (
            <motion.div
              key={tour.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group safari-card"
            >
              {/* Image */}
              <div className="relative h-56 sm:h-64 lg:h-72 overflow-hidden img-zoom">
                <img
                  src={tour.featured_image || getPlaceholderImage(index)}
                  alt={tour.title}
                  className="w-full h-full object-cover"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-safari-night/80 via-safari-night/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                
                <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                  <Badge
                    variant="secondary"
                    className="bg-background/95 backdrop-blur-md text-[10px] sm:text-xs font-semibold px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg shadow-soft"
                  >
                    {tour.category}
                  </Badge>
                </div>
                {tour.is_featured && (
                  <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                    <Badge className="badge-premium shadow-gold">
                      ✦ Featured
                    </Badge>
                  </div>
                )}

                {/* Price overlay */}
                {tour.price && (
                  <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4">
                    <div className="bg-background/95 backdrop-blur-md rounded-lg sm:rounded-xl px-3 sm:px-4 py-1.5 sm:py-2 shadow-elevated">
                      <p className="text-[10px] sm:text-xs text-muted-foreground">From</p>
                      <p className="text-base sm:text-lg font-bold text-foreground">
                        ${tour.price?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4 sm:p-5 lg:p-7">
                <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">
                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-safari-gold" />
                  <span>Tanzania</span>
                  {tour.duration && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                      <span>{tour.duration}</span>
                    </>
                  )}
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground mb-2 sm:mb-3 group-hover:text-primary transition-colors duration-300">
                  {tour.title}
                </h3>
                <p className="text-muted-foreground text-xs sm:text-sm mb-4 sm:mb-5 line-clamp-2 leading-relaxed">
                  {tour.short_description || 'Discover this amazing destination'}
                </p>

                {/* Highlights */}
                {tour.highlights && tour.highlights.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-5">
                    {tour.highlights.slice(0, 2).map((highlight) => (
                      <span
                        key={highlight}
                        className="text-[10px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg bg-primary/5 text-primary font-medium border border-primary/10"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-border gap-2">
                  <div className="min-w-0">
                    {tour.price && (
                      <>
                        <span className="text-xl sm:text-2xl font-bold text-primary">
                          ${tour.price.toLocaleString()}
                        </span>
                        <span className="text-xs sm:text-sm text-muted-foreground">
                          {" "}/ person
                        </span>
                      </>
                    )}
                  </div>
                  <Link to={`/tour/${tour.slug}`}>
                    <Button variant="safari" size="sm" className="text-xs sm:text-sm">
                      Book Now
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button - Mobile */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-8 sm:mt-12"
        >
          <Link to="/safaris">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              View All Destinations
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};