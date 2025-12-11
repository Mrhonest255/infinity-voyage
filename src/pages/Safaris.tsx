import { useEffect, useState } from "react";
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Clock, Check, MapPin, Filter, Sparkles, Search, Users, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SEO, SEO_KEYWORDS } from "@/components/SEO";
import heroImage from "@/assets/serengeti.jpg";

type SafariTour = {
  id: string;
  title: string;
  slug: string;
  duration: string | null;
  featured_image: string | null;
  price: number | null;
  category: string | null;
  highlights: string[] | null;
  short_description: string | null;
};

const categories = ["All", "Wildlife", "Trekking", "Combo", "Package"];

const Safaris = () => {
  const [tours, setTours] = useState<SafariTour[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchSafaris();
  }, [isAdmin]);

  const fetchSafaris = async () => {
    setLoading(true);
    let query = supabase
      .from("tours")
      .select("id,title,slug,duration,featured_image,price,category,highlights,short_description")
      .order("created_at", { ascending: false });

    if (!isAdmin) {
      query = query.eq("is_published", true);
    }

    const { data, error } = await query;
    if (!error && data) {
      const safariOnly = data.filter((t) => (t.category || "").toLowerCase().includes("safari"));
      setTours(safariOnly as SafariTour[]);
    }
    setLoading(false);
  };

  const filteredSafaris =
    activeCategory === "All"
      ? tours
      : tours.filter((s) =>
          (s.category || "").toLowerCase().includes(activeCategory.toLowerCase().replace("wildlife", "safari"))
        );

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Tanzania Safari Tours - Serengeti, Ngorongoro, Tarangire"
        description="Book unforgettable Tanzania safari adventures. Serengeti game drives, Ngorongoro Crater, Tarangire elephants, Lake Manyara flamingos. Expert guides, luxury camps, best prices. Great Migration specialists!"
        keywords={SEO_KEYWORDS.safaris}
        url="/safaris"
      />
      <Navbar />
      
      {/* Premium Hero */}
      <section className="relative pt-32 pb-24 min-h-[50vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Tanzania Safari"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-safari-night/80 via-safari-night/60 to-safari-night/90" />
        </div>
        <div className="relative container-wide mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/90 px-5 py-2 rounded-full text-sm font-medium mb-6 border border-white/10"
            >
              <Sparkles className="w-4 h-4 text-safari-gold" />
              Unforgettable Adventures
            </motion.div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Tanzania <span className="text-gradient-gold">Safari</span> Tours
            </h1>
            <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Explore Tanzania's iconic national parks and witness the incredible wildlife of East Africa
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap items-center justify-center gap-8 mt-10">
              <div className="text-center">
                <p className="text-3xl font-bold text-safari-gold">{tours.length}+</p>
                <p className="text-sm text-white/60">Safari Tours</p>
              </div>
              <div className="w-px h-10 bg-white/20 hidden sm:block" />
              <div className="text-center">
                <p className="text-3xl font-bold text-safari-gold">5</p>
                <p className="text-sm text-white/60">National Parks</p>
              </div>
              <div className="w-px h-10 bg-white/20 hidden sm:block" />
              <div className="text-center">
                <p className="text-3xl font-bold text-safari-gold">4.9★</p>
                <p className="text-sm text-white/60">Guest Rating</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters - Premium Design */}
      <section className="py-6 bg-background sticky top-24 z-30 border-b border-border/50 shadow-sm">
        <div className="container-wide mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
              <div className="flex items-center gap-2 text-muted-foreground shrink-0 pr-3 border-r border-border">
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">Filter:</span>
              </div>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                    activeCategory === category
                      ? "bg-gradient-to-r from-safari-gold to-safari-amber text-safari-night shadow-md"
                      : "bg-muted/50 text-foreground hover:bg-muted border border-border/50"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            <p className="text-sm text-muted-foreground hidden md:block">
              Showing <span className="font-semibold text-foreground">{filteredSafaris.length}</span> safaris
            </p>
          </div>
        </div>
      </section>

      {/* Safari List - Premium Cards */}
      <section className="section-padding bg-gradient-to-b from-background to-muted/20">
        <div className="container-wide mx-auto">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse bg-muted rounded-2xl h-[450px]" />
              ))}
            </div>
          ) : filteredSafaris.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                <Search className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">No safaris found</h3>
              <p className="text-muted-foreground">Try selecting a different category</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredSafaris.map((safari, index) => (
                <motion.div
                  key={safari.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-background rounded-2xl overflow-hidden border border-border/50 shadow-soft hover:shadow-luxury hover:border-safari-gold/20 transition-all duration-500"
                >
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={safari.featured_image || "/placeholder.jpg"}
                      alt={safari.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-safari-night/60 via-transparent to-transparent" />
                    
                    {/* Top badges */}
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                      <Badge className="bg-gradient-to-r from-safari-gold to-safari-amber text-safari-night font-semibold shadow-md">
                        {safari.category || "Safari"}
                      </Badge>
                      <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-foreground">
                        <Clock className="w-3 h-3 mr-1" />
                        {safari.duration || "Multi-day"}
                      </Badge>
                    </div>
                    
                    {/* Price badge */}
                    <div className="absolute bottom-4 right-4">
                      <div className="bg-white/95 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg">
                        <span className="text-xs text-muted-foreground">From</span>
                        <p className="text-xl font-bold text-safari-gold">
                          {safari.price ? `$${safari.price.toLocaleString()}` : "Contact"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <MapPin className="w-4 h-4 text-safari-gold" />
                      Tanzania
                      <span className="ml-auto flex items-center gap-1">
                        <Star className="w-4 h-4 fill-safari-gold text-safari-gold" />
                        <span className="font-medium text-foreground">4.9</span>
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-safari-gold transition-colors line-clamp-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      {safari.title}
                    </h3>

                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {safari.short_description || "Discover Tanzania's best safari experiences."}
                    </p>

                    {/* Highlights */}
                    <div className="flex flex-wrap gap-2 mb-5">
                      {(safari.highlights || []).slice(0, 3).map((highlight) => (
                        <span
                          key={highlight}
                          className="inline-flex items-center gap-1 text-xs bg-muted/50 text-foreground px-2.5 py-1 rounded-full"
                        >
                          <Check className="w-3 h-3 text-safari-gold" />
                          {highlight}
                        </span>
                      ))}
                    </div>

                    {/* CTA */}
                    <Link to={`/tour/${safari.slug}`} className="block">
                      <Button className="w-full rounded-xl bg-gradient-to-r from-safari-gold to-safari-amber text-safari-night font-semibold hover:shadow-gold transition-all group/btn">
                        View Safari Details
                        <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Safaris;
