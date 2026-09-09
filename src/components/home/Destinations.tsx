import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, MapPin, Clock, Compass, Sparkles, Star } from "lucide-react";
import { useTours } from "@/hooks/useTours";
import { supabase } from "@/integrations/supabase/client";

import serengetiImg from "@/assets/serengeti.jpg";
import zanzibarImg from "@/assets/zanzibar.jpg";
import kilimanjaroImg from "@/assets/kilimanjaro.jpg";
import ngorongoroImg from "@/assets/ngorongoro.jpg";
import tarangireImg from "@/assets/tarangire.jpg";
import stoneTownImg from "@/assets/stone-town.jpg";

interface CombinedDestinationItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  price: number | null;
  duration: string | null;
  featured_image: string | null;
  short_description: string | null;
  is_featured: boolean;
  type: "tour" | "activity";
  targetUrl: string;
  location: string;
}

const CATEGORIES = ["All Destinations", "Safari", "Zanzibar", "Kilimanjaro & Trekking", "Featured Only"];
const placeholderImages = [serengetiImg, zanzibarImg, kilimanjaroImg, ngorongoroImg, tarangireImg, stoneTownImg];

export const Destinations = () => {
  const [activeCategory, setActiveCategory] = useState("All Destinations");
  const { data: tours = [], isLoading: toursLoading } = useTours();

  // Query activities from Supabase so Zanzibar excursions are also included in Destinations
  const { data: activities = [], isLoading: activitiesLoading } = useQuery({
    queryKey: ["destinations-activities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("activities")
        .select("id, title, slug, duration, featured_image, price, category, short_description, is_featured, location")
        .order("is_featured", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching activities for destinations:", error);
        return [];
      }
      return data || [];
    },
    staleTime: 1000 * 60 * 5,
  });

  const isLoading = toursLoading || activitiesLoading;

  // Combine both tours and activities into a comprehensive destinations catalog
  const combinedItems: CombinedDestinationItem[] = useMemo(() => {
    const tourItems: CombinedDestinationItem[] = tours.map((t) => ({
      id: `tour-${t.id}`,
      title: t.title,
      slug: t.slug,
      category: t.category || "Safari",
      price: t.price,
      duration: t.duration,
      featured_image: t.featured_image,
      short_description: t.short_description,
      is_featured: !!t.is_featured,
      type: "tour",
      targetUrl: `/tour/${t.slug}`,
      location: "Tanzania Mainland",
    }));

    const activityItems: CombinedDestinationItem[] = activities.map((a: any) => ({
      id: `act-${a.id}`,
      title: a.title,
      slug: a.slug,
      category: a.category || "Zanzibar",
      price: a.price,
      duration: a.duration,
      featured_image: a.featured_image,
      short_description: a.short_description,
      is_featured: !!a.is_featured,
      type: "activity",
      targetUrl: `/activity/${a.slug}`,
      location: a.location || "Zanzibar Island",
    }));

    // Put all featured items at the front, then mix tours and activities
    return [...tourItems, ...activityItems].sort((a, b) => {
      if (a.is_featured && !b.is_featured) return -1;
      if (!a.is_featured && b.is_featured) return 1;
      return 0;
    });
  }, [tours, activities]);

  // Apply intelligent category filtering
  const filteredItems = useMemo(() => {
    if (activeCategory === "All Destinations") {
      return combinedItems.slice(0, 9);
    }
    if (activeCategory === "Featured Only") {
      return combinedItems.filter((i) => i.is_featured).slice(0, 9);
    }
    if (activeCategory === "Safari") {
      return combinedItems
        .filter((i) => {
          const cat = (i.category || "").toLowerCase();
          const title = i.title.toLowerCase();
          return cat.includes("safari") || cat.includes("wildlife") || title.includes("serengeti") || title.includes("ngorongoro") || title.includes("tarangire");
        })
        .slice(0, 9);
    }
    if (activeCategory === "Zanzibar") {
      return combinedItems
        .filter((i) => {
          const cat = (i.category || "").toLowerCase();
          const title = i.title.toLowerCase();
          const loc = (i.location || "").toLowerCase();
          return cat.includes("zanzibar") || cat.includes("beach") || cat.includes("island") || title.includes("zanzibar") || title.includes("stone town") || title.includes("prison island") || title.includes("mnemba") || loc.includes("zanzibar");
        })
        .slice(0, 9);
    }
    if (activeCategory === "Kilimanjaro & Trekking") {
      return combinedItems
        .filter((i) => {
          const cat = (i.category || "").toLowerCase();
          const title = i.title.toLowerCase();
          return cat.includes("trek") || cat.includes("climb") || cat.includes("mountain") || title.includes("kilimanjaro") || title.includes("meru") || title.includes("machame") || title.includes("marangu");
        })
        .slice(0, 9);
    }
    return combinedItems.slice(0, 9);
  }, [combinedItems, activeCategory]);

  const getPlaceholderImage = (index: number) => {
    return placeholderImages[index % placeholderImages.length];
  };

  return (
    <section className="py-16 md:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-6 h-0.5 bg-amber-600 rounded-full" />
              <span className="text-amber-700 text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Explore Tanzania & Zanzibar
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 font-display tracking-tight mb-2">
              Popular Destinations & Experiences
            </h2>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl">
              From Serengeti game drives and Kilimanjaro summits to turquoise Zanzibar beaches and dolphin safaris.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/safaris">
              <Button
                variant="outline"
                className="border-slate-300 text-slate-800 hover:border-slate-900 rounded-xl font-semibold px-4 h-11 text-xs sm:text-sm"
              >
                <span>View Safaris</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
            <Link to="/zanzibar">
              <Button
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl px-4 h-11 text-xs sm:text-sm shadow-sm"
              >
                <span>Zanzibar Trips</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-full transition-all duration-200 whitespace-nowrap ${
                activeCategory === cat
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-slate-100 rounded-2xl h-80 animate-pulse" />
            ))}
          </div>
        )}

        {/* Tours & Experiences Grid */}
        {!isLoading && filteredItems.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                className="group bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative h-56 sm:h-60 overflow-hidden bg-slate-100">
                  <img
                    src={item.featured_image || getPlaceholderImage(index)}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <Badge className="bg-slate-900/80 backdrop-blur-sm text-white border-0 font-semibold text-xs">
                      {item.category}
                    </Badge>
                    {item.is_featured && (
                      <Badge className="bg-amber-500 text-slate-950 font-bold border-0 text-xs flex items-center gap-1 shadow-sm">
                        <Star className="w-3 h-3 fill-slate-950" /> Featured
                      </Badge>
                    )}
                  </div>

                  {/* Location badge */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs text-white/90 font-medium drop-shadow">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>{item.location}</span>
                  </div>

                  {/* Price Tag */}
                  {item.price && (
                    <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl shadow-md text-right">
                      <span className="block text-[10px] text-slate-500 font-bold uppercase leading-none">From</span>
                      <span className="text-base font-bold text-slate-900 font-display">
                        ${item.price.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {item.duration && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2 font-medium">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>{item.duration}</span>
                      </div>
                    )}

                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-700 transition-colors font-display mb-2 line-clamp-2">
                      {item.title}
                    </h3>

                    <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed mb-4">
                      {item.short_description || "Experience the best of Tanzania and Zanzibar with certified expert native guides."}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      to={item.targetUrl}
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-700 hover:text-amber-800 transition-colors"
                    >
                      <span>Explore Itinerary</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      {item.type === "tour" ? "Safari Package" : "Day Excursion"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && filteredItems.length === 0 && (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
            <Compass className="w-10 h-10 text-amber-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900 mb-1">No tours found in this category</h3>
            <p className="text-sm text-slate-600 mb-4">Contact our travel consultants for a custom safari or island itinerary.</p>
            <Link to="/contact">
              <Button className="bg-amber-500 text-slate-950 font-bold hover:bg-amber-600 rounded-xl">
                Plan Custom Trip
              </Button>
            </Link>
          </div>
        )}

        {/* Mobile View All */}
        <div className="mt-8 flex flex-col sm:hidden gap-3">
          <Link to="/safaris">
            <Button className="w-full bg-slate-900 text-white font-semibold py-3 rounded-xl">
              Browse All Safari Tours
            </Button>
          </Link>
          <Link to="/zanzibar">
            <Button className="w-full bg-amber-500 text-slate-950 font-bold py-3 rounded-xl">
              Explore Zanzibar Activities
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Destinations;