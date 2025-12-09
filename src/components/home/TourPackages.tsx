import { useState, useEffect } from "react";
import { useAuth } from '@/hooks/useAuth';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Clock, Check, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

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

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
          {filteredTours.map((tour, index) => (
            <motion.div
              key={tour.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group safari-card hover-lift"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden img-zoom">
                <img
                  src={tour.featured_image || getPlaceholderImage(index)}
                  alt={tour.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-safari-night/70 via-safari-night/20 to-transparent" />
                <div className="absolute top-4 left-4 flex gap-2">
                  {tour.duration && (
                    <Badge
                      variant="secondary"
                      className="bg-background/95 backdrop-blur-md text-xs font-semibold px-3 py-1.5 rounded-lg"
                    >
                      <Clock className="w-3 h-3 mr-1.5" />
                      {tour.duration}
                    </Badge>
                  )}
                  {tour.is_featured && (
                    <Badge className="badge-premium shadow-gold">
                      ✦ Popular
                    </Badge>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                  {tour.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-5 line-clamp-2 leading-relaxed">
                  {tour.short_description || 'Experience the adventure of a lifetime'}
                </p>

                {/* Features */}
                {tour.included && tour.included.length > 0 && (
                  <div className="space-y-2.5 mb-5">
                    {tour.included.slice(0, 3).map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-2.5 text-sm text-muted-foreground"
                      >
                        <div className="w-5 h-5 rounded-full bg-safari-gold/10 flex items-center justify-center">
                          <Check className="w-3 h-3 text-safari-gold" />
                        </div>
                        {feature}
                      </div>
                    ))}
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-5 border-t border-border/50">
                  <div>
                    <span className="text-xs text-muted-foreground">From</span>
                    {tour.price ? (
                      <p className="text-2xl font-bold text-gradient-gold">
                        ${tour.price.toLocaleString()}
                      </p>
                    ) : (
                      <p className="text-sm font-medium text-muted-foreground">Contact us</p>
                    )}
                  </div>
                  <Link to={`/tour/${tour.slug}`}>
                    <Button variant="ghost" size="sm" className="text-primary font-semibold hover:bg-primary/10 rounded-lg">
                      View Details
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};