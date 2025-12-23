import { useState, useEffect, useCallback } from "react";
import { Star, Quote, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    id: 1,
    name: "Sarah Jenkins",
    location: "United Kingdom",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
    text: "The Serengeti safari was absolutely magical. Seeing the Big Five in their natural habitat was a dream come true. Infinity Voyage took care of everything perfectly! The guides were incredibly knowledgeable and our accommodations exceeded all expectations.",
    rating: 5,
    tourType: "Serengeti Safari",
  },
  {
    id: 2,
    name: "Michael Chen",
    location: "Singapore",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    text: "Climbing Kilimanjaro was tough but rewarding. The guides were incredibly professional and supportive throughout the entire journey. I couldn't have reached the summit without their expert guidance and constant encouragement.",
    rating: 5,
    tourType: "Kilimanjaro Trek",
  },
  {
    id: 3,
    name: "Emma & David Thompson",
    location: "Australia",
    avatar:
      "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?q=80&w=200&auto=format&fit=crop",
    text: "Zanzibar is paradise on earth! The spice tour and the beaches were amazing. A perfect mix of relaxation and culture. Our honeymoon was absolutely perfect thanks to the team at Infinity Voyage. Highly recommended for any occasion.",
    rating: 5,
    tourType: "Zanzibar Beach Holiday",
  },
  {
    id: 4,
    name: "Hans Mueller",
    location: "Germany",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
    text: "We witnessed the Great Migration and it was beyond words. The timing was perfect, the camps were luxurious, and our guide knew exactly where to find the best wildlife. An experience I'll treasure forever.",
    rating: 5,
    tourType: "Great Migration Safari",
  },
];

export const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="section-padding bg-gradient-to-b from-background via-muted/30 to-background relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-safari-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container-wide mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-12 lg:mb-16"
        >
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <span className="w-8 sm:w-10 h-px bg-safari-gold" />
            <span className="text-safari-gold text-xs sm:text-sm font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em]">
              Testimonials
            </span>
            <span className="w-8 sm:w-10 h-px bg-safari-gold" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground px-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            What Our <span className="text-gradient-gold">Travelers</span> Say
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground mt-3 sm:mt-4 max-w-2xl mx-auto px-4">
            Authentic experiences from guests who've explored Tanzania with us
          </p>
        </motion.div>

        {/* Main Testimonial Card */}
        <div className="max-w-5xl mx-auto">
          <div 
            className="relative"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="bg-card rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12 shadow-luxury border border-border/30 relative overflow-hidden"
              >
                {/* Large Quote decoration */}
                <div className="absolute top-4 sm:top-6 right-4 sm:right-8 opacity-5">
                  <Quote className="w-20 h-20 sm:w-32 sm:h-32 text-safari-gold" strokeWidth={1} />
                </div>

                <div className="grid md:grid-cols-[auto,1fr] gap-6 sm:gap-8 md:gap-12 items-center relative z-10">
                  {/* Avatar Section */}
                  <div className="flex flex-col items-center md:items-start">
                    <div className="relative mb-3 sm:mb-4">
                      <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-full overflow-hidden ring-3 sm:ring-4 ring-safari-gold/30 shadow-gold">
                        <img
                          src={currentTestimonial.avatar}
                          alt={currentTestimonial.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {/* Gold accent circle */}
                      <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-safari-gold to-safari-amber flex items-center justify-center shadow-gold">
                        <Quote className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-safari-night" />
                      </div>
                    </div>
                    
                    {/* Stars */}
                    <div className="flex gap-0.5 sm:gap-1 mb-2 sm:mb-3">
                      {[...Array(currentTestimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 sm:w-5 sm:h-5 fill-safari-gold text-safari-gold"
                        />
                      ))}
                    </div>
                    
                    {/* Tour type badge */}
                    <span className="px-3 sm:px-4 py-1 sm:py-1.5 bg-safari-gold/10 text-safari-gold text-[10px] sm:text-xs font-semibold rounded-full">
                      {currentTestimonial.tourType}
                    </span>
                  </div>

                  {/* Content Section */}
                  <div>
                    <blockquote className="text-base sm:text-lg md:text-xl lg:text-2xl text-foreground leading-relaxed mb-5 sm:mb-8" style={{ fontFamily: "'Inter', sans-serif" }}>
                      "{currentTestimonial.text}"
                    </blockquote>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg sm:text-xl font-semibold text-foreground" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                          {currentTestimonial.name}
                        </h4>
                        <div className="flex items-center gap-1 sm:gap-1.5 text-muted-foreground text-xs sm:text-sm mt-1">
                          <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          {currentTestimonial.location}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative gradient line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-safari-gold via-safari-amber to-safari-gold" />
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between pointer-events-none px-2 sm:px-4 md:-mx-6">
              <Button
                variant="outline"
                size="icon"
                onClick={prevSlide}
                className="pointer-events-auto w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-background/90 backdrop-blur-sm border-2 border-border hover:border-safari-gold hover:bg-safari-gold/10 shadow-soft transition-all duration-300 touch-target"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={nextSlide}
                className="pointer-events-auto w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-background/90 backdrop-blur-sm border-2 border-border hover:border-safari-gold hover:bg-safari-gold/10 shadow-soft transition-all duration-300 touch-target"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </div>
          </div>

          {/* Dots indicator */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 mt-6 sm:mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex
                    ? "w-8 h-2 bg-gradient-to-r from-safari-gold to-safari-amber"
                    : "w-2 h-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
