import { useState, useEffect } from "react";
import { useAuth } from '@/hooks/useAuth';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Clock, Check, Loader2, Star, MapPin, Users, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AddToCartButton } from "@/components/cart/Cart";

import serengetiImg from "@/assets/serengeti.jpg";
import zanzibarImg from "@/assets/zanzibar.jpg";
import kilimanjaroImg from "@/assets/kilimanjaro.jpg";
import tarangireImg from "@/assets/tarangire.jpg";

// Default placeholder images when no image is uploaded
const placeholderImages = [serengetiImg, zanzibarImg, kilimanjaroImg, tarangireImg];

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
  included: string[] | null;
}

export const TourPackages = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<"all" | "safari" | "zanzibar">("all");
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchFeaturedTours();
  }, []);

  const fetchFeaturedTours = async () => {
    try {
      let query = supabase
        .from('tours')
        .select('*')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(4);

      if (!isAdmin) {
        query = query.eq('is_published', true);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      // If not enough featured tours, get some regular tours
      if ((data?.length || 0) < 4) {
        let moreQuery = supabase
          .from('tours')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(4);
        if (!isAdmin) moreQuery = moreQuery.eq('is_published', true);
        const { data: moreTours, error: moreError } = await moreQuery;
        
        if (!moreError && moreTours) {
          const uniqueTours = [...(data || [])];
          moreTours.forEach(tour => {
            if (!uniqueTours.find(t => t.id === tour.id)) {
              uniqueTours.push(tour);
            }
          });
          setTours(uniqueTours.slice(0, 4));
          return;
        }
      }
      
      setTours(data || []);
    } catch (error) {
      console.error('Error fetching tours:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTours = tours.filter((tour) => {
    if (activeFilter === "all") return true;
    const isSafari = (tour.category || "").toLowerCase().includes("safari");
    return activeFilter === "safari" ? isSafari : !isSafari;
  });

  const getPlaceholderImage = (index: number) => {
    return placeholderImages[index % placeholderImages.length];
  };

  if (loading) {
    return (
      <section className="section-padding bg-background">
        <div className="container-wide mx-auto flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  if (tours.length === 0) {
    return (
      <section className="section-padding bg-background">
        <div className="container-wide mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
            <div>
              <p className="text-primary font-medium mb-2">Curated Experiences</p>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground">
                Our Top Tour Packages
              </h2>
              <p className="text-muted-foreground mt-2 max-w-2xl">
                Tours are being added. In the meantime, reach out and we will craft a custom itinerary for you.
              </p>
            </div>
            <Link to="/contact">
              <Button variant="safari" size="lg">
                Plan with an expert
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[0, 1, 2, 3].map((index) => (
              <div key={index} className="safari-card overflow-hidden">
                <div className="relative h-48">
                  <img
                    src={getPlaceholderImage(index)}
                    alt="Coming soon"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-safari-night/60 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
                      Coming soon
                    </Badge>
                  </div>
                </div>
                <div className="p-5 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    Tailored duration
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    Bespoke Adventure
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Talk to us and we will design a journey that matches your budget and timeline.
                  </p>
                  <Button asChild variant="ghost" size="sm" className="text-primary">
                    <Link to="/contact">
                      Tell us your dates
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
    <section className="section-padding bg-background relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-primary/3 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

      <div className="container-wide mx-auto relative">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Section label */}
            <div className="flex items-center gap-3 mb-4">
              <span className="w-10 h-px bg-safari-gold" />
              <span className="text-safari-gold text-sm font-semibold uppercase tracking-[0.2em]">
                Curated Experiences
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-4">
              Our Top <span className="text-gradient-gold">Tour Packages</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl">
              Handpicked safari and beach experiences designed for unforgettable memories.
            </p>
          </motion.div>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex rounded-2xl bg-muted/60 p-1.5 border border-border/50">
              {["all", "safari", "zanzibar"].map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveFilter(key as "all" | "safari" | "zanzibar")}
                  className={`px-5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 ${
                    activeFilter === key
                      ? "bg-primary text-primary-foreground shadow-elevated"
                      : "text-foreground hover:bg-primary/10"
                  }`}
                >
                  {key === "all" ? "All" : key === "safari" ? "Safari" : "Zanzibar"}
                </button>
              ))}
            </div>
            <Link to="/safaris">
              <Button variant="outline" size="lg" className="rounded-xl border-2 hover:border-primary">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Packages Grid - Premium 2x2 Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredTours.map((tour, index) => (
            <motion.div
              key={tour.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative bg-card rounded-3xl overflow-hidden shadow-soft hover:shadow-luxury transition-all duration-500 border border-border/30 hover:border-safari-gold/30"
            >
              {/* Image - 60% height */}
              <div className="relative h-72 lg:h-80 overflow-hidden">
                <img
                  src={tour.featured_image || getPlaceholderImage(index)}
                  alt={tour.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Multi-layer overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-safari-night via-safari-night/30 to-transparent opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-r from-safari-night/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Top badges */}
                <div className="absolute top-5 left-5 right-5 flex items-start justify-between">
                  <div className="flex flex-wrap gap-2">
                    {tour.is_featured && (
                      <Badge className="badge-premium shadow-gold animate-pulse">
                        ✦ Featured
                      </Badge>
                    )}
                    {tour.duration && (
                      <Badge
                        variant="secondary"
                        className="bg-background/95 backdrop-blur-md text-xs font-semibold px-3 py-1.5 rounded-full shadow-soft"
                      >
                        <Clock className="w-3 h-3 mr-1.5" />
                        {tour.duration}
                      </Badge>
                    )}
                  </div>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1 bg-background/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-soft">
                    <Star className="w-4 h-4 fill-safari-gold text-safari-gold" />
                    <span className="text-sm font-bold">5.0</span>
                  </div>
                </div>

                {/* Bottom content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl lg:text-3xl font-semibold text-white mb-2 group-hover:text-safari-gold transition-colors duration-300" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {tour.title}
                  </h3>
                  <p className="text-white/80 text-sm line-clamp-2 max-w-md">
                    {tour.short_description || 'Experience the adventure of a lifetime with our expertly curated safari package'}
                  </p>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 pt-5">
                {/* Features grid */}
                {tour.included && tour.included.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    {tour.included.slice(0, 4).map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2.5 text-sm text-muted-foreground"
                      >
                        <div className="w-5 h-5 rounded-full bg-safari-gold/10 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-safari-gold" />
                        </div>
                        <span className="truncate">{feature}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Footer with price and CTA */}
                <div className="flex items-center justify-between pt-5 border-t border-border/50">
                  <div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Starting from</span>
                    {tour.price ? (
                      <p className="text-3xl font-bold text-gradient-gold" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        ${tour.price.toLocaleString()}
                        <span className="text-sm font-normal text-muted-foreground ml-1">/person</span>
                      </p>
                    ) : (
                      <p className="text-lg font-semibold text-muted-foreground">Contact for price</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <AddToCartButton
                      item={{
                        id: tour.id,
                        type: "tour",
                        title: tour.title,
                        image: tour.featured_image || undefined,
                        price: tour.price || 0,
                        duration: tour.duration || undefined,
                      }}
                      variant="icon"
                    />
                    <Link to={`/tour/${tour.slug}`}>
                      <motion.div
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="relative px-6 py-3 rounded-2xl bg-gradient-to-r from-safari-gold via-safari-amber to-safari-gold bg-[length:200%_100%] text-safari-night font-bold shadow-lg hover:shadow-gold transition-all duration-300 overflow-hidden flex items-center gap-2 group/btn animate-shimmer"
                      >
                        {/* Shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                        <span className="relative z-10">View</span>
                        <ArrowRight className="w-4 h-4 relative z-10 transition-transform group-hover/btn:translate-x-1" />
                      </motion.div>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Decorative corner accent */}
              <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden pointer-events-none">
                <div className="absolute top-4 -right-8 w-24 h-6 bg-gradient-to-r from-safari-gold to-safari-amber rotate-45 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};