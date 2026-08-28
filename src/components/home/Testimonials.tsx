import { useState, useEffect, useCallback } from "react";
import { Star, ChevronLeft, ChevronRight, Quote, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const reviews = [
  {
    id: 1,
    name: "Sarah Jenkins",
    location: "London, United Kingdom",
    initials: "SJ",
    tourType: "7-Day Serengeti & Ngorongoro Safari",
    text: "The Serengeti safari was absolutely magical. Seeing the Big Five and the Great Migration up close was a lifelong dream. Our guide Dennis had eagle eyes and incredible wildlife knowledge. Infinity Voyage handled every single detail with perfection!",
    rating: 5,
    date: "July 2025",
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    location: "Singapore",
    initials: "MC",
    tourType: "Machame Route Kilimanjaro Climb",
    text: "Summiting Uhuru Peak with the Infinity team was the best adventure of my life. The mountain guides, porters, and camp chef were top class. Safety checks every morning and evening made all the difference.",
    rating: 5,
    date: "August 2025",
  },
  {
    id: 3,
    name: "Emma & David Thompson",
    location: "Sydney, Australia",
    initials: "ET",
    tourType: "Zanzibar Luxury Honeymoon",
    text: "Zanzibar was pure paradise! The private spice tour, dhow sunset cruise, and snorkeling around Mnemba Island were unforgettable. Super responsive team on WhatsApp throughout our entire stay.",
    rating: 5,
    date: "June 2025",
  },
  {
    id: 4,
    name: "Hans & Greta Mueller",
    location: "Munich, Germany",
    initials: "HM",
    tourType: "5-Day Tarangire & Manyara Wildlife Safari",
    text: "Unbelievable herds of elephants in Tarangire and tree-climbing lions in Lake Manyara. The 4x4 land cruiser was very comfortable with pop-up roof for photography. Will definitely travel with them again!",
    rating: 5,
    date: "September 2025",
  },
];

export const Testimonials = () => {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % reviews.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + reviews.length) % reviews.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 7000);
    return () => clearInterval(timer);
  }, [next]);

  const active = reviews[current];

  return (
    <section className="py-16 md:py-24 bg-white border-b border-slate-200/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-6 h-0.5 bg-amber-600 rounded-full" />
            <span className="text-amber-700 text-xs sm:text-sm font-bold uppercase tracking-wider">
              Traveler Reviews
            </span>
            <span className="w-6 h-0.5 bg-amber-600 rounded-full" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 font-display tracking-tight mb-3">
            What Our Guests Say
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Real feedback from international travelers who experienced Tanzania and Zanzibar with us.
          </p>
        </div>

        {/* Featured Review Card */}
        <div className="max-w-4xl mx-auto bg-slate-50 rounded-3xl p-6 sm:p-10 md:p-12 border border-slate-200/90 shadow-sm relative">
          <Quote className="w-12 h-12 text-amber-500/20 absolute top-6 right-6 pointer-events-none" />

          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-center">
            {/* Avatar with Initials */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-500 text-slate-950 font-display font-bold text-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
              {active.initials}
            </div>

            <div className="flex-1">
              {/* Star Rating & Tour Badge */}
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <div className="flex text-amber-500">
                  {[...Array(active.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500" />
                  ))}
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-amber-100/80 text-amber-800 rounded-md">
                  {active.tourType}
                </span>
              </div>

              {/* Review Text */}
              <blockquote className="text-base sm:text-lg text-slate-800 leading-relaxed font-normal mb-6">
                "{active.text}"
              </blockquote>

              {/* Reviewer Details */}
              <div className="flex items-center justify-between flex-wrap gap-2 pt-4 border-t border-slate-200">
                <div>
                  <h4 className="font-bold text-slate-900 font-display text-lg flex items-center gap-1.5">
                    <span>{active.name}</span>
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">
                    {active.location} • Traveled {active.date}
                  </p>
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={prev}
                    className="w-10 h-10 rounded-xl border-slate-300 hover:bg-white text-slate-700"
                    aria-label="Previous review"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={next}
                    className="w-10 h-10 rounded-xl border-slate-300 hover:bg-white text-slate-700"
                    aria-label="Next review"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Indicator dots */}
        <div className="flex justify-center gap-2 mt-6">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all duration-200 ${
                current === i ? "w-6 bg-amber-500" : "w-2 bg-slate-300"
              }`}
              aria-label={`Go to review ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
