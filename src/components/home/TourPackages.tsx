import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Check, ArrowRight, Compass, MapPin, Star, Sparkles } from "lucide-react";
import { AddToCartButton } from "@/components/cart/Cart";
import { useTours, TourItem } from "@/hooks/useTours";

import serengetiImg from "@/assets/serengeti.jpg";
import zanzibarImg from "@/assets/zanzibar.jpg";
import kilimanjaroImg from "@/assets/kilimanjaro.jpg";
import tarangireImg from "@/assets/tarangire.jpg";
import ngorongoroImg from "@/assets/ngorongoro.jpg";
import stoneTownImg from "@/assets/stone-town.jpg";
import heroSafariImg from "@/assets/hero-safari.jpg";

type FilterCategory = "all" | "safari" | "zanzibar" | "trekking";

interface FilterTab {
  id: FilterCategory;
  label: string;
}

const FILTER_TABS: FilterTab[] = [
  { id: "all", label: "All Packages" },
  { id: "safari", label: "Safaris" },
  { id: "zanzibar", label: "Zanzibar" },
  { id: "trekking", label: "Trekking & Climbs" },
];

const placeholderImages = [
  serengetiImg,
  ngorongoroImg,
  kilimanjaroImg,
  zanzibarImg,
  tarangireImg,
  stoneTownImg,
  heroSafariImg,
];

// High-fidelity fallback packages to ensure the homepage is always full, beautiful, and functional
const FALLBACK_TOURS: TourItem[] = [
  {
    id: "fb-1",
    title: "7-Day Great Serengeti Migration & Ngorongoro Safari",
    slug: "7-day-serengeti-migration-ngorongoro",
    short_description: "Witness millions of wildebeest and the Big Five in Tanzania's premier game parks with luxury tented camps.",
    featured_image: serengetiImg,
    category: "Safari",
    price: 2450,
    currency: "USD",
    duration: "7 Days / 6 Nights",
    is_featured: true,
    is_published: true,
    highlights: ["Serengeti Game Drives", "Ngorongoro Crater Floor", "Big Five Tracking", "Luxury Tented Camps"],
    included: ["Park Entrance Fees", "4x4 Safari Land Cruiser", "Professional Native Guide", "Full Board Meals & Water"],
  },
  {
    id: "fb-2",
    title: "5-Day Big Five Classic Safari: Tarangire, Manyara & Ngorongoro",
    slug: "5-day-big-five-safari",
    short_description: "Experience massive elephant herds in Tarangire, tree-climbing lions, and the majestic Ngorongoro caldera.",
    featured_image: ngorongoroImg,
    category: "Safari",
    price: 1650,
    currency: "USD",
    duration: "5 Days / 4 Nights",
    is_featured: true,
    is_published: true,
    highlights: ["Tarangire Elephants", "Ngorongoro Crater", "Lake Manyara Birds", "Maasai Cultural Visit"],
    included: ["All Park Entry Fees", "4WD Pop-up Roof Vehicle", "Certified Safari Guide", "All Meals & Accommodation"],
  },
  {
    id: "fb-3",
    title: "7-Day Mount Kilimanjaro Climb - Machame Route",
    slug: "7-day-kilimanjaro-machame-route",
    short_description: "Conquer the 'Roof of Africa' via the highly scenic Whiskey route with optimum acclimatization and high summit success.",
    featured_image: kilimanjaroImg,
    category: "Trekking",
    price: 2190,
    currency: "USD",
    duration: "7 Days / 6 Nights",
    is_featured: true,
    is_published: true,
    highlights: ["Uhuru Peak Summit (5,895m)", "Shira Plateau", "Barranco Wall", "Lava Tower Acclimatization"],
    included: ["Licensed Mountain Guides", "Porters & Camp Chef", "Park & Rescue Fees", "All Mountain Meals & Tents"],
  },
  {
    id: "fb-4",
    title: "6-Day Zanzibar Beach Holiday & Historic Stone Town",
    slug: "6-day-zanzibar-beach-escape",
    short_description: "Relax on turquoise beaches of Nungwi, explore UNESCO Stone Town alleys, and swim with green sea turtles.",
    featured_image: zanzibarImg,
    category: "Zanzibar",
    price: 1280,
    currency: "USD",
    duration: "6 Days / 5 Nights",
    is_featured: true,
    is_published: true,
    highlights: ["Nungwi Beach Relaxation", "Stone Town Walking Tour", "Prison Island Giant Tortoises", "Spice Plantation Tour"],
    included: ["Beachfront Resort Lodging", "Airport Transfers", "Private Guided Excursions", "Daily Breakfast & Dinners"],
  },
  {
    id: "fb-5",
    title: "3-Day Tarangire & Ngorongoro Express Wildlife Tour",
    slug: "3-day-tarangire-ngorongoro-express",
    short_description: "A fast-paced, high-yield safari encountering giant baobabs, massive elephant herds, and crater predators.",
    featured_image: tarangireImg,
    category: "Safari",
    price: 990,
    currency: "USD",
    duration: "3 Days / 2 Nights",
    is_featured: false,
    is_published: true,
    highlights: ["Tarangire River Wildlife", "Ngorongoro Caldera Drive", "Predator Action", "Scenic Rift Valley"],
    included: ["Park Entry Fees", "Private 4x4 Cruiser", "Professional Driver-Guide", "Full Board Lodging"],
  },
  {
    id: "fb-6",
    title: "6-Day Mount Kilimanjaro Marangu Route Trek",
    slug: "6-day-kilimanjaro-marangu-route",
    short_description: "The classic 'Coca-Cola' route offering comfortable sleeping huts, gradual ascents, and alpine desert vistas.",
    featured_image: kilimanjaroImg,
    category: "Trekking",
    price: 1950,
    currency: "USD",
    duration: "6 Days / 5 Nights",
    is_featured: false,
    is_published: true,
    highlights: ["Mandara & Horombo Huts", "Kibo Saddle Crossing", "Uhuru Peak 5895m", "Rainforest Trekking"],
    included: ["Comfortable Hut Lodging", "Chief Guide & Crew", "Park & Hut Fees", "3 Hearty Meals Daily"],
  },
  {
    id: "fb-7",
    title: "4-Day Zanzibar Mnemba Atoll Snorkeling & Safari Blue",
    slug: "4-day-zanzibar-mnemba-safari-blue",
    short_description: "Sail on traditional wooden dhows, snorkel vibrant coral reefs, and feast on fresh grilled seafood sandbank barbecue.",
    featured_image: stoneTownImg,
    category: "Zanzibar",
    price: 750,
    currency: "USD",
    duration: "4 Days / 3 Nights",
    is_featured: false,
    is_published: true,
    highlights: ["Mnemba Marine Reserve", "Safari Blue Sandbank", "Dolphin Spotting", "Seafood Beach BBQ"],
    included: ["Private Dhow Cruise", "Snorkel Gear & Lifejackets", "Marine Conservation Fees", "Fresh Seafood Lunch"],
  },
  {
    id: "fb-8",
    title: "8-Day Ultimate Tanzania Bush-to-Beach Explorer",
    slug: "8-day-tanzania-bush-to-beach",
    short_description: "Combine thrilling Serengeti game drives and the wonders of Ngorongoro with idyllic Zanzibar white sand beaches.",
    featured_image: heroSafariImg,
    category: "Safari",
    price: 2890,
    currency: "USD",
    duration: "8 Days / 7 Nights",
    is_featured: true,
    is_published: true,
    highlights: ["Serengeti & Ngorongoro", "Domestic Flight to Zanzibar", "Kendwa White Beaches", "Sunset Dhow Cruise"],
    included: ["All Park & Flight Tickets", "Luxury Camps & Resorts", "4x4 Safari & Zanzibar Tours", "All In-Country Logistics"],
  },
];

const getTourDestination = (tour: TourItem) => {
  const text = `${tour.title} ${tour.category || ""} ${tour.short_description || ""}`.toLowerCase();
  if (text.includes("kilimanjaro")) return "Mount Kilimanjaro, Tanzania";
  if (text.includes("meru")) return "Mount Meru, Arusha";
  if (text.includes("serengeti") && text.includes("ngorongoro")) return "Serengeti & Ngorongoro";
  if (text.includes("serengeti")) return "Serengeti National Park";
  if (text.includes("ngorongoro") || text.includes("crater")) return "Ngorongoro Conservation Area";
  if (text.includes("tarangire")) return "Tarangire National Park";
  if (text.includes("manyara")) return "Lake Manyara National Park";
  if (text.includes("stone town")) return "Stone Town, Zanzibar";
  if (text.includes("mnemba")) return "Mnemba Atoll, Zanzibar";
  if (text.includes("zanzibar") || text.includes("beach") || text.includes("island")) return "Zanzibar Island";
  return "Tanzania Wilderness";
};

const getTourInclusions = (tour: TourItem): string[] => {
  if (tour.included && tour.included.length > 0) {
    return tour.included;
  }
  const text = `${tour.title} ${tour.category || ""}`.toLowerCase();
  if (text.includes("kilimanjaro") || text.includes("climb") || text.includes("trek")) {
    return ["Licensed Guides & Porters", "Park & Camping Fees", "Mountain Meals & Water", "Safety & Oxygen Gear"];
  }
  if (text.includes("zanzibar") || text.includes("beach") || text.includes("island")) {
    return ["Resort Accommodation", "Airport Transfers", "Guided Tours & Excursions", "Snorkel Gear & Boat"];
  }
  return ["Park Entrance Fees", "4x4 Safari Land Cruiser", "Professional Native Guide", "Full Board Meals"];
};

export const TourPackages = () => {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("all");
  const { data: allTours = [], isLoading } = useTours();

  // Combine database tours with fallback data if database has fewer items
  const displayTours = useMemo(() => {
    if (!allTours || allTours.length === 0) {
      return FALLBACK_TOURS;
    }
    if (allTours.length >= 8) {
      return allTours;
    }
    const existingSlugs = new Set(allTours.map((t) => t.slug));
    const supplements = FALLBACK_TOURS.filter((t) => !existingSlugs.has(t.slug));
    return [...allTours, ...supplements];
  }, [allTours]);

  // Enhanced category filtering with prioritization of is_featured
  const filtered = useMemo(() => {
    let list = [...displayTours];

    if (activeFilter === "safari") {
      const keywords = ["safari", "wildlife", "tarangire", "serengeti", "ngorongoro", "crater"];
      list = list.filter((tour) => {
        const text = `${tour.category || ""} ${tour.title || ""} ${tour.slug || ""} ${tour.short_description || ""}`.toLowerCase();
        return keywords.some((kw) => text.includes(kw));
      });
    } else if (activeFilter === "zanzibar") {
      const keywords = ["zanzibar", "beach", "island", "ocean", "stone town", "mnemba"];
      list = list.filter((tour) => {
        const text = `${tour.category || ""} ${tour.title || ""} ${tour.slug || ""} ${tour.short_description || ""}`.toLowerCase();
        return keywords.some((kw) => text.includes(kw));
      });
    } else if (activeFilter === "trekking") {
      const keywords = ["kilimanjaro", "trekking", "climb", "mountain", "meru"];
      list = list.filter((tour) => {
        const text = `${tour.category || ""} ${tour.title || ""} ${tour.slug || ""} ${tour.short_description || ""}`.toLowerCase();
        return keywords.some((kw) => text.includes(kw));
      });
    }

    // Always prioritize is_featured: true tours first across filters
    list.sort((a, b) => {
      if (a.is_featured && !b.is_featured) return -1;
      if (!a.is_featured && b.is_featured) return 1;
      return 0;
    });

    // Display up to 8 packages
    return list.slice(0, 8);
  }, [displayTours, activeFilter]);

  const getPlaceholderImage = (index: number) => {
    return placeholderImages[index % placeholderImages.length];
  };

  return (
    <section className="py-16 md:py-24 bg-slate-50 border-t border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 sm:mb-12">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-6 h-0.5 bg-amber-600 rounded-full" />
              <span className="text-amber-700 text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Curated Packages & Destinations
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 font-display tracking-tight mb-2">
              Featured Tour Itineraries
            </h2>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl">
              Handpicked bestsellers spanning the Serengeti, Ngorongoro Crater, Mount Kilimanjaro, and Zanzibar beaches.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-200/80 p-1.5 rounded-2xl overflow-x-auto scrollbar-none max-w-full">
            {FILTER_TABS.map((tab) => {
              const isActive = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className={`px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? "bg-slate-900 text-white shadow-md"
                      : "text-slate-700 hover:text-slate-950 hover:bg-white/60"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 sm:gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-slate-200/60 rounded-3xl h-96 animate-pulse" />
            ))}
          </div>
        )}

        {/* Up to 8 Featured Tour Packages Grid */}
        {!isLoading && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 sm:gap-8">
            {filtered.map((tour, index) => {
              const destination = getTourDestination(tour);
              const inclusions = getTourInclusions(tour);

              return (
                <div
                  key={tour.id}
                  className="group bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5"
                >
                  <div>
                    {/* Image container */}
                    <div className="relative h-56 sm:h-60 overflow-hidden bg-slate-100">
                      <img
                        src={tour.featured_image || getPlaceholderImage(index)}
                        alt={tour.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent" />

                      {/* Badges on top */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-1.5 z-10">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {tour.is_featured ? (
                            <Badge className="bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-slate-950 font-bold border-0 text-[11px] shadow-md flex items-center gap-1 px-2.5 py-0.5">
                              <Sparkles className="w-3 h-3 fill-slate-950 text-slate-950" />
                              <span>Featured</span>
                            </Badge>
                          ) : (
                            <Badge className="bg-slate-900/80 backdrop-blur-md text-white border-0 font-semibold text-[11px] px-2.5 py-0.5">
                              {tour.category || "Tour"}
                            </Badge>
                          )}
                        </div>

                        {tour.duration && (
                          <Badge className="bg-slate-950/85 backdrop-blur-md text-white border-0 font-medium text-xs flex items-center gap-1 px-2.5 py-0.5 shadow-sm shrink-0">
                            <Clock className="w-3 h-3 text-amber-400" />
                            <span>{tour.duration}</span>
                          </Badge>
                        )}
                      </div>

                      {/* Destination Overlay */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5 text-xs text-white/95 font-medium drop-shadow-md z-10">
                        <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="truncate">{destination}</span>
                      </div>
                    </div>

                    {/* Content Body */}
                    <div className="p-5 sm:p-6">
                      {/* Rating Stars & Score */}
                      <div className="flex items-center gap-2 mb-2.5">
                        <div className="flex items-center text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        <span className="text-xs font-bold text-slate-900">5.0</span>
                        <span className="text-[11px] text-slate-400 font-medium">(Top Rated)</span>
                      </div>

                      {/* Tour Title */}
                      <h3 className="text-lg font-bold text-slate-900 font-display leading-snug group-hover:text-amber-700 transition-colors mb-2 line-clamp-2">
                        {tour.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed mb-4">
                        {tour.short_description || "Comprehensive all-inclusive Tanzania itinerary with certified native guides."}
                      </p>

                      {/* Inclusions Preview */}
                      <div className="pt-3.5 border-t border-slate-100">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Key Inclusions
                          </span>
                          <span className="text-[11px] font-semibold text-emerald-600">All-Inclusive</span>
                        </div>
                        <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-xs text-slate-600">
                          {inclusions.slice(0, 4).map((item, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 min-w-0">
                              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span className="truncate" title={item}>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: Price + Actions */}
                  <div className="px-5 pb-5 pt-3 sm:px-6 sm:pb-6 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 leading-tight">
                        Starting Price
                      </span>
                      {tour.price ? (
                        <div className="flex items-baseline">
                          <span className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
                            ${tour.price.toLocaleString()}
                          </span>
                          <span className="text-xs text-slate-500 font-normal ml-1">/ person</span>
                        </div>
                      ) : (
                        <span className="text-sm font-bold text-slate-900">Custom Quote</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
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
                        <Button className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3.5 sm:px-4 rounded-xl text-xs sm:text-sm h-10 shadow-sm flex items-center gap-1.5 transition-all duration-200">
                          <span>View Details</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Clean, welcoming empty state when no tours match */}
        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-16 px-6 bg-white rounded-3xl border border-slate-200/90 shadow-sm max-w-2xl mx-auto my-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto mb-4 text-amber-700 shadow-inner">
              <Compass className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 font-display mb-2">
              Looking for a Tailored Adventure?
            </h3>
            <p className="text-slate-600 text-sm sm:text-base mb-6 max-w-md mx-auto leading-relaxed">
              We couldn't find pre-made packages matching this filter, but our safari specialists can craft a bespoke itinerary tailored to your exact dates, budget, and wishlist.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link to="/plan-my-trip">
                <Button className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl px-6 h-11 text-sm shadow-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Plan Custom Trip</span>
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => setActiveFilter("all")}
                className="border-slate-300 text-slate-700 hover:text-slate-950 rounded-xl px-5 h-11 text-sm font-semibold"
              >
                View All Packages
              </Button>
            </div>
          </div>
        )}

        {/* Bottom CTA Row */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/safaris">
            <Button
              variant="outline"
              className="border-slate-300 text-slate-800 hover:bg-slate-900 hover:text-white rounded-xl font-bold px-6 h-12 text-sm shadow-sm transition-all duration-300 flex items-center gap-2"
            >
              <span>Browse All Safari Packages</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link to="/plan-my-trip">
            <Button className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl px-6 h-12 text-sm shadow-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Plan Custom Trip</span>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};