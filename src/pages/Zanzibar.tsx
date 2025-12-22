import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Clock, Check, MapPin, Sun, Waves, Loader2, Sparkles, Star, Anchor } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';
import { SEO, SEO_KEYWORDS } from "@/components/SEO";

import zanzibarImg from "@/assets/zanzibar.jpg";
import stoneTownImg from "@/assets/stone-town.jpg";
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Excursion {
  id: string;
  title: string;
  slug: string;
  duration?: string | null;
  featured_image?: string | null;
  price?: number | null;
  category?: string | null;
  highlights?: string[] | null;
  short_description?: string | null;
}


const Zanzibar = () => {
  const { isAdmin } = useAuth();
  const [activities, setActivities] = useState<Excursion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchZanzibarActivities();
  }, [isAdmin]);

  const fetchZanzibarActivities = async () => {
    setLoading(true);
    try {
      // Fetch from activities table (created in Admin > Zanzibar Activities)
      let query = supabase
        .from('activities')
        .select('id, title, slug, duration, featured_image, price, category, highlights, short_description');

      // For non-admins only show published activities
      if (!isAdmin) {
        query = query.eq('is_published', true);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching activities:', error);
        throw error;
      }
      
      if (data) {
        console.log('Fetched activities:', data);
        setActivities(data as Excursion[]);
      }
    } catch (err) {
      console.error('Error fetching Zanzibar activities', err);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <section className="relative pt-32 pb-20">
          <div className="container-wide mx-auto px-4 md:px-8">
            <div className="text-center py-32">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Zanzibar Tours & Excursions - Stone Town, Spice Tours, Beaches"
        description="Discover Zanzibar with our expert-guided tours. Stone Town UNESCO heritage, spice tours, prison island, dolphin watching, snorkeling at Mnemba Island, Safari Blue & more. Book your Zanzibar adventure today!"
        keywords={SEO_KEYWORDS.zanzibar}
        url="/zanzibar"
      />
      <Navbar />
      
      {/* Premium Hero */}
      <section className="relative pt-32 pb-28 min-h-[55vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={zanzibarImg}
            alt="Zanzibar Beach"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-safari-night/70 via-safari-night/50 to-safari-night/80" />
          {/* Decorative wave pattern */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent" />
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
              <Anchor className="w-4 h-4 text-cyan-400" />
              Island Paradise
            </motion.div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              <span className="text-cyan-300">Zanzibar</span> Excursions
            </h1>
            <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Discover paradise with pristine beaches, rich culture, and unforgettable island adventures
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap items-center justify-center gap-8 mt-10">
              <div className="text-center">
                <p className="text-3xl font-bold text-cyan-300">{activities.length}+</p>
                <p className="text-sm text-white/60">Excursions</p>
              </div>
              <div className="w-px h-10 bg-white/20 hidden sm:block" />
              <div className="text-center">
                <p className="text-3xl font-bold text-cyan-300">26°C</p>
                <p className="text-sm text-white/60">Avg. Temperature</p>
              </div>
              <div className="w-px h-10 bg-white/20 hidden sm:block" />
              <div className="text-center">
                <p className="text-3xl font-bold text-cyan-300">4.9★</p>
                <p className="text-sm text-white/60">Guest Rating</p>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Floating decorative elements */}
        <motion.div 
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-32 left-10 w-20 h-20 rounded-full bg-cyan-400/10 blur-xl hidden lg:block" 
        />
        <motion.div 
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-40 right-20 w-32 h-32 rounded-full bg-cyan-300/10 blur-2xl hidden lg:block" 
        />
      </section>

      {/* Info Cards - Premium Design */}
      <section className="py-8 -mt-10 relative z-10">
        <div className="container-wide mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-background/95 backdrop-blur-sm rounded-2xl p-6 shadow-luxury border border-border/50 flex items-center gap-4 hover:shadow-elevated transition-all duration-500"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-500/10 flex items-center justify-center shrink-0">
                <Sun className="w-7 h-7 text-amber-500" />
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
              className="bg-background/95 backdrop-blur-sm rounded-2xl p-6 shadow-luxury border border-border/50 flex items-center gap-4 hover:shadow-elevated transition-all duration-500"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/10 flex items-center justify-center shrink-0">
                <Waves className="w-7 h-7 text-cyan-500" />
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
              className="bg-background/95 backdrop-blur-sm rounded-2xl p-6 shadow-luxury border border-border/50 flex items-center gap-4 hover:shadow-elevated transition-all duration-500"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/10 flex items-center justify-center shrink-0">
                <MapPin className="w-7 h-7 text-emerald-500" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Location</h3>
                <p className="text-sm text-muted-foreground">East African Coast, Indian Ocean</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Excursions Grid - Premium Cards */}
      <section className="section-padding bg-gradient-to-b from-background to-muted/20">
        <div className="container-wide mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 bg-cyan-500/10 text-cyan-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Sparkles className="w-4 h-4" />
              Island Adventures
            </div>
            <h2 className="text-4xl md:text-5xl font-semibold text-foreground mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Available <span className="text-cyan-500">Excursions</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Book individual excursions or combine multiple for the perfect Zanzibar experience
            </p>
          </motion.div>

          {/* Empty State */}
          {activities.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="w-20 h-20 rounded-full bg-cyan-500/10 flex items-center justify-center mx-auto mb-4">
                <Waves className="w-10 h-10 text-cyan-500" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No Excursions Available Yet</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                We're preparing amazing Zanzibar excursions for you. Please check back soon or contact us for custom tours.
              </p>
              <Link to="/contact">
                <Button className="mt-6 bg-gradient-to-r from-cyan-500 to-cyan-400">
                  Contact Us
                </Button>
              </Link>
            </motion.div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {activities.map((excursion, index) => (
              <motion.div
                key={excursion.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group bg-background rounded-2xl overflow-hidden border border-border/50 shadow-soft hover:shadow-luxury hover:border-cyan-500/20 transition-all duration-500"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={excursion.featured_image || zanzibarImg}
                    alt={excursion.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-safari-night/50 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge className="bg-gradient-to-r from-cyan-500 to-cyan-400 text-white text-xs font-semibold shadow-md">
                      {excursion.category}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3">
                    <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-foreground text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      {excursion.duration}
                    </Badge>
                  </div>
                  
                  {/* Price badge */}
                  <div className="absolute bottom-3 right-3">
                    <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-lg">
                      <span className="text-lg font-bold text-cyan-600">
                        {excursion.price ? `$${excursion.price.toLocaleString()}` : "Contact"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-medium text-foreground">4.9</span>
                    <span className="text-xs text-muted-foreground">(24 reviews)</span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-cyan-600 transition-colors line-clamp-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {excursion.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {excursion.short_description}
                  </p>

                  {/* Highlights */}
                  {(excursion.highlights || []).length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(excursion.highlights || []).slice(0, 2).map((highlight) => (
                        <span
                          key={highlight}
                          className="inline-flex items-center gap-1 text-xs bg-cyan-500/10 text-cyan-700 px-2.5 py-1 rounded-full"
                        >
                          <Check className="w-3 h-3" />
                          {highlight}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* CTA */}
                  <a 
                    href={`https://wa.me/255758241294?text=Hello! I'm interested in booking "${excursion.title}" excursion. Please provide more details.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-white font-semibold hover:shadow-lg transition-all group/btn">
                      Book Now
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                  </a>
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
