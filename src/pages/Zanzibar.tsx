import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Clock, Check, MapPin, Sun, Waves, Loader2 } from "lucide-react";
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
  const [tours, setTours] = useState<Excursion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchZanzibarTours();
  }, []);

  const fetchZanzibarTours = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('tours')
        .select('id, title, slug, duration, featured_image, price, category, highlights, short_description');

      // For non-admins only show published tours
      if (!isAdmin) {
        query = query.eq('is_published', true);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      if (data) {
        // Filter for Zanzibar-relevant tours: beach, cultural, marine, excursion categories
        // OR tours with "zanzibar" in title/description
        const zanzibarCategories = ['beach', 'cultural', 'marine', 'excursion', 'leisure', 'nature', 'water', 'snorkeling', 'diving', 'island'];
        const zanzibarOnly = (data as any[]).filter((t) => {
          const cat = (t.category || '').toLowerCase();
          const title = (t.title || '').toLowerCase();
          const desc = (t.short_description || '').toLowerCase();
          // Include if category is zanzibar-relevant OR title/description mentions zanzibar
          return zanzibarCategories.includes(cat) || 
                 title.includes('zanzibar') || 
                 title.includes('beach') ||
                 title.includes('spice') ||
                 title.includes('stone town') ||
                 title.includes('nakupenda') ||
                 title.includes('dolphin') ||
                 title.includes('snorkel') ||
                 desc.includes('zanzibar') ||
                 cat.includes('zanz');
        });
        // If no Zanzibar tours found, show all tours as fallback
        setTours((zanzibarOnly.length > 0 ? zanzibarOnly : data) as Excursion[]);
      }
    } catch (err) {
      console.error('Error fetching Zanzibar tours', err);
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
            {tours.map((excursion, index) => (
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
                    src={excursion.featured_image || excursion.image || zanzibarImg}
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
                    {excursion.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {excursion.short_description || excursion.description}
                  </p>

                  {/* Highlights */}
                  {(excursion.highlights || []).length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(excursion.highlights || []).slice(0, 2).map((highlight) => (
                        <span
                          key={highlight}
                          className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground"
                        >
                          {highlight}
                        </span>
                      ))}
                      {(excursion.highlights || []).length > 2 && (
                        <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                          +{(excursion.highlights || []).length - 2} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div>
                      {excursion.price ? (
                        <>
                          <span className="text-xl font-bold text-primary">
                            ${excursion.price?.toLocaleString()}
                          </span>
                          <span className="text-sm text-muted-foreground"> /person</span>
                        </>
                      ) : (
                        <span className="text-sm text-muted-foreground">Contact</span>
                      )}
                    </div>
                    <Link to={`/tour/${excursion.slug}`}>
                      <Button variant="safari" size="sm">
                        Book
                      </Button>
                    </Link>
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
