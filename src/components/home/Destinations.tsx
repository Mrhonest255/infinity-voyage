import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, MapPin, Clock, Compass } from "lucide-react";
import { useTours } from "@/hooks/useTours";

import serengetiImg from "@/assets/serengeti.jpg";
import zanzibarImg from "@/assets/zanzibar.jpg";
import kilimanjaroImg from "@/assets/kilimanjaro.jpg";
import ngorongoroImg from "@/assets/ngorongoro.jpg";
import tarangireImg from "@/assets/tarangire.jpg";
import stoneTownImg from "@/assets/stone-town.jpg";

const categories = ["All Destinations", "Safari", "Zanzibar", "Trekking"];
const placeholderImages = [serengetiImg, zanzibarImg, kilimanjaroImg, ngorongoroImg, tarangireImg, stoneTownImg];

export const Destinations = () => {
  const [activeCategory, setActiveCategory] = useState("All Destinations");
  const { data: tours = [], isLoading } = useTours({ limit: 6 });

  const filteredTours = tours.filter((tour) => {
    if (activeCategory === "All Destinations") return true;
    return (tour.category || "").toLowerCase().includes(activeCategory.toLowerCase());
  });

  const getPlaceholderImage = (index: number) => {
    return placeholderImages[index % placeholderImages.length];
  };

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-6 h-0.5 bg-amber-600 rounded-full" />
              <span className="text-amber-700 text-xs sm:text-sm font-bold uppercase tracking-wider">
                Explore Tanzania
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 font-display tracking-tight mb-2">
              Popular Destinations
            </h2>
            <p className="text-base sm:text-lg text-slate-600 max-w-xl">
              Experience the world's most iconic wildlife parks, pristine beaches, and mountain peaks.
            </p>
          </div>

          <Link to="/safaris" className="hidden sm:inline-flex">
            <Button
              variant="outline"
              className="border-slate-300 text-slate-800 hover:border-slate-900 rounded-xl font-semibold px-5 h-11"
            >
              <span>View All Tours</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
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

        {/* Tours Grid */}
        {!isLoading && filteredTours.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredTours.map((tour, index) => (
              <div
                key={tour.id}
                className="group bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                {/* Tour Image */}
                <div className="relative h-56 sm:h-60 overflow-hidden bg-slate-100">
                  <img
                    src={tour.featured_image || getPlaceholderImage(index)}
                    alt={tour.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge className="bg-slate-900/80 backdrop-blur-sm text-white border-0 font-medium text-xs">
                      {tour.category}
                    </Badge>
                    {tour.is_featured && (
                      <Badge className="bg-amber-500 text-slate-950 font-bold border-0 text-xs">
                        Featured
                      </Badge>
                    )}
                  </div>

                  {/* Price Tag */}
                  {tour.price && (
                    <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-xl shadow-md text-right">
                      <span className="block text-[10px] text-slate-500 font-bold uppercase leading-none">From</span>
                      <span className="text-base font-bold text-slate-900 font-display">
                        ${tour.price.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Tour Info */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mb-2 font-medium">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-600" />
                        <span>Tanzania</span>
                      </span>
                      {tour.duration && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <span>{tour.duration}</span>
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-700 transition-colors font-display mb-2 line-clamp-2">
                      {tour.title}
                    </h3>

                    <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed mb-4">
                      {tour.short_description || "Experience the best of Tanzania with expert native safari guides."}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      to={`/tour/${tour.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-700 hover:text-amber-800 transition-colors"
                    >
                      <span>Explore Details</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && filteredTours.length === 0 && (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
            <Compass className="w-10 h-10 text-amber-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900 mb-1">No tours found in this category</h3>
            <p className="text-sm text-slate-600 mb-4">Contact our travel consultants for a custom itinerary.</p>
            <Link to="/contact">
              <Button className="bg-amber-500 text-slate-950 font-bold hover:bg-amber-600 rounded-xl">
                Plan Custom Trip
              </Button>
            </Link>
          </div>
        )}

        {/* Mobile View All */}
        <div className="mt-8 text-center sm:hidden">
          <Link to="/safaris">
            <Button className="w-full bg-slate-900 text-white font-semibold py-3 rounded-xl">
              View All Tours & Safaris
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};