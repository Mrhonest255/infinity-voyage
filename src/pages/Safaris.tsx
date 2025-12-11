import { useEffect, useState } from "react";
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Clock, Check, MapPin, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SEO, SEO_KEYWORDS } from "@/components/SEO";

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
      
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-safari-night">
        <div className="container-wide mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4">
              Tanzania Safari Tours
            </h1>
            <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              Explore Tanzania's iconic national parks and witness the incredible wildlife of East Africa. Serengeti, Ngorongoro, Tarangire & more!
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
                    src={safari.featured_image || "/placeholder.jpg"}
                    alt={safari.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-primary text-primary-foreground">
                      {safari.category || "Safari"}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="md:col-span-2 p-6 md:p-8 flex flex-col">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <MapPin className="w-4 h-4" />
                        Tanzania
                      </div>
                      <h3 className="font-display text-2xl font-semibold text-foreground">
                        {safari.title}
                      </h3>
                    </div>
                    <Badge variant="outline" className="shrink-0">
                      <Clock className="w-3 h-3 mr-1" />
                      {safari.duration || "Multi-day"}
                    </Badge>
                  </div>

                  <p className="text-muted-foreground mb-6 flex-grow">
                    {safari.short_description || "Discover Tanzania's best safari experiences."}
                  </p>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-3 mb-6">
                    {(safari.highlights || []).slice(0, 6).map((highlight) => (
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
                        {safari.price ? `$${safari.price.toLocaleString()}` : "Contact"}
                        <span className="text-sm font-normal text-muted-foreground"> /person</span>
                      </p>
                    </div>
                    <Link to={`/tour/${safari.slug}`}>
                      <Button variant="safari" size="lg">
                        View Details
                        <ArrowRight className="w-4 h-4 ml-2" />
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

export default Safaris;
