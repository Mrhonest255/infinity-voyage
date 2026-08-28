import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Check, ArrowRight, Compass } from "lucide-react";
import { AddToCartButton } from "@/components/cart/Cart";
import { useTours } from "@/hooks/useTours";

import serengetiImg from "@/assets/serengeti.jpg";
import zanzibarImg from "@/assets/zanzibar.jpg";
import kilimanjaroImg from "@/assets/kilimanjaro.jpg";
import tarangireImg from "@/assets/tarangire.jpg";

const placeholderImages = [serengetiImg, zanzibarImg, kilimanjaroImg, tarangireImg];

export const TourPackages = () => {
  const [activeFilter, setActiveFilter] = useState<"all" | "safari" | "zanzibar">("all");
  const { data: allTours = [], isLoading } = useTours();

  const featuredTours = allTours.slice(0, 4);

  const filtered = featuredTours.filter((tour) => {
    if (activeFilter === "all") return true;
    const cat = (tour.category || "").toLowerCase();
    if (activeFilter === "safari") return cat.includes("safari") || cat.includes("wildlife");
    return cat.includes("zanzibar") || cat.includes("beach") || cat.includes("island");
  });

  const getPlaceholderImage = (index: number) => {
    return placeholderImages[index % placeholderImages.length];
  };

  return (
    <section className="py-16 md:py-24 bg-slate-50 border-t border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-6 h-0.5 bg-amber-600 rounded-full" />
              <span className="text-amber-700 text-xs sm:text-sm font-bold uppercase tracking-wider">
                Curated Packages
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 font-display tracking-tight mb-2">
              Featured Tour Itineraries
            </h2>
            <p className="text-base sm:text-lg text-slate-600 max-w-xl">
              Handpicked bestsellers designed for the most comprehensive African experience.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 bg-slate-200/70 p-1 rounded-xl">
            {(["all", "safari", "zanzibar"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 capitalize ${
                  activeFilter === tab
                    ? "bg-white text-slate-950 shadow-sm"
                    : "text-slate-700 hover:text-slate-950"
                }`}
              >
                {tab === "all" ? "All Packages" : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Loading skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-slate-200/60 rounded-2xl h-96 animate-pulse" />
            ))}
          </div>
        )}

        {/* 2x2 Grid of Featured Packages */}
        {!isLoading && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {filtered.map((tour, index) => (
              <div
                key={tour.id}
                className="group bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Image container */}
                  <div className="relative h-64 sm:h-72 overflow-hidden bg-slate-100">
                    <img
                      src={tour.featured_image || getPlaceholderImage(index)}
                      alt={tour.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                    {/* Badges on top */}
                    <div className="absolute top-4 left-4 flex gap-2">
                      <Badge className="bg-amber-500 text-slate-950 font-bold border-0 text-xs">
                        Top Rated
                      </Badge>
                      {tour.duration && (
                        <Badge className="bg-slate-900/80 backdrop-blur-sm text-white border-0 font-medium text-xs flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{tour.duration}</span>
                        </Badge>
                      )}
                    </div>

                    {/* Overlay Title */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl sm:text-2xl font-bold text-white font-display leading-tight mb-1">
                        {tour.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-200 line-clamp-1">
                        {tour.short_description || "All-inclusive Tanzania safari adventure."}
                      </p>
                    </div>
                  </div>

                  {/* Highlights & Inclusions */}
                  <div className="p-5 sm:p-6">
                    {tour.included && tour.included.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2 mb-6">
                        {tour.included.slice(0, 4).map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
                            <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                            <span className="truncate">{item}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2 mb-6 text-xs sm:text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          <span>Park Entrance Fees</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          <span>4x4 Safari Cruiser</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          <span>Professional Guide</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          <span>Full Board Meals</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer: Price + Action Buttons */}
                <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0 flex items-center justify-between border-t border-slate-100 mt-2">
                  <div>
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Starting Price
                    </span>
                    {tour.price ? (
                      <span className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
                        ${tour.price.toLocaleString()}
                        <span className="text-xs font-normal text-slate-500 ml-1">/ person</span>
                      </span>
                    ) : (
                      <span className="text-base font-bold text-slate-900">Inquire for price</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
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
                      <Button className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 sm:px-5 rounded-xl text-xs sm:text-sm h-10 shadow-sm flex items-center gap-1.5">
                        <span>View Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Fallback */}
        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <Compass className="w-10 h-10 text-amber-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900 mb-1">More packages coming soon</h3>
            <p className="text-sm text-slate-600 mb-4">We are preparing new itineraries for this category.</p>
            <Link to="/safaris">
              <Button className="bg-slate-900 text-white font-semibold rounded-xl">
                Browse All Safaris
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};