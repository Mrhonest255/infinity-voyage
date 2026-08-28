import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Clock, Users, MapPin, Star, CheckCircle2, Calendar, Award, Zap, Heart, Images, ChevronLeft, ChevronRight, X, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BookingForm from '@/components/tours/BookingForm';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import { Footer } from '@/components/layout/Footer';
import { TourReviews } from '@/components/tours/TourReviews';
import { AddToCartButton } from '@/components/cart/Cart';

const TourPage = () => {
  const { slug } = useParams();
  const [tour, setTour] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    supabase.from('tours').select('*').eq('slug', slug).maybeSingle()
      .then(({ data, error }) => {
        if (error) {
          console.error('Error fetching tour', error);
        } else {
          console.debug('Tour fetched from supabase:', data);
          setTour(data || null);
        }
      }).finally(() => setLoading(false));
  }, [slug]);

  // Generate SEO Structured Data (JSON-LD) for Google ranking
  useEffect(() => {
    if (!tour) return;

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "TouristTrip",
      "name": tour.title,
      "description": tour.short_description || tour.description,
      "image": tour.featured_image ? [tour.featured_image] : [],
      "tourBookingPage": window.location.href,
      "offers": {
        "@type": "Offer",
        "price": tour.price?.toString() || "0",
        "priceCurrency": tour.currency || "USD",
        "availability": "https://schema.org/InStock",
        "validFrom": new Date().toISOString().split('T')[0]
      },
      "itinerary": tour.itinerary?.map((day: any) => ({
        "@type": "ItemList",
        "name": `Day ${day.day}: ${day.title}`,
        "description": day.description,
        "itemListElement": day.activities?.map((activity: string, index: number) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": activity
        }))
      })) || [],
      "duration": tour.duration,
      "touristType": tour.category || "Safari",
      "includesAttraction": tour.highlights?.map((h: string) => ({
        "@type": "TouristAttraction",
        "name": h
      })) || []
    };

    // Remove existing schema script if any
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Add new schema script
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    // Update page title and meta for SEO
    document.title = `${tour.title} | Infinity Voyage Tours & Safaris`;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', tour.short_description || tour.description || '');
    }

    return () => {
      const scriptToRemove = document.querySelector('script[type="application/ld+json"]');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [tour]);

  // Combine featured image with gallery images (featured image first)
  const galleryArray = Array.isArray(tour?.gallery) ? tour.gallery.filter(Boolean) : [];
  const allImages = tour?.featured_image 
    ? [tour.featured_image, ...galleryArray]
    : galleryArray;

  // Normalize array-like fields to avoid runtime errors
  const safeIncluded = Array.isArray(tour?.included) ? tour.included : [];
  const safeExcluded = Array.isArray(tour?.excluded) ? tour.excluded : [];
  const safeHighlights = Array.isArray(tour?.highlights) ? tour.highlights : [];
  const safeItinerary = Array.isArray(tour?.itinerary) ? tour.itinerary : [];

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
    setLightboxOpen(true);
  };

  const debugMode = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('debug') === '1';

  const navigateImage = (direction: 'prev' | 'next') => {
    const totalImages = allImages.length;
    if (totalImages === 0) return;
    
    if (direction === 'prev') {
      setSelectedImageIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
    } else {
      setSelectedImageIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
    }
  };

  // Handle keyboard navigation - must be called before any early returns
  useEffect(() => {
    if (!lightboxOpen || allImages.length === 0) return;
    const handleKeyPress = (e: KeyboardEvent) => {
      const totalImages = allImages.length;
      if (e.key === 'ArrowLeft') {
        setSelectedImageIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
      }
      if (e.key === 'ArrowRight') {
        setSelectedImageIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
      }
      if (e.key === 'Escape') setLightboxOpen(false);
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [lightboxOpen, allImages.length]);

  // Loading state
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-safari-cream via-background to-safari-gold/5">
      <div className="text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-safari-gold/20 to-safari-amber/10 flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-safari-gold" />
        </div>
        <div>
          <p className="text-lg font-semibold text-foreground">Loading your adventure...</p>
          <p className="text-sm text-muted-foreground mt-1">Preparing an amazing experience</p>
        </div>
      </div>
    </div>
  );

  // Tour not found state
  if (!tour) return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex items-center justify-center py-32">
        <div className="text-center space-y-6 max-w-md mx-auto px-4">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
            <MapPin className="w-12 h-12 text-muted-foreground" />
          </div>
          <h2 className="font-display text-3xl font-semibold text-foreground">Tour not found</h2>
          <p className="text-muted-foreground">The tour you're looking for doesn't exist or has been removed.</p>
          <a href="/safaris" className="inline-flex items-center gap-2 mt-4 px-8 py-4 bg-gradient-to-r from-safari-gold to-safari-amber text-safari-night rounded-xl font-semibold hover:shadow-lg transition-all">
            <MapPin className="w-5 h-5" />
            Browse All Tours
          </a>
        </div>
      </div>
      <Footer />
    </div>
  );

  return (
    <ErrorBoundary>
      {/* SEO Structured Data is added via useEffect */}
      <div className="min-h-screen bg-gradient-to-br from-background via-card/30 to-background">
        {debugMode && (
          <div className="fixed bottom-4 right-4 z-50 bg-white p-3 rounded shadow-lg max-w-md w-full text-xs text-left overflow-auto border border-muted">
            <div className="font-semibold mb-1">Tour Debug</div>
            <div className="text-foreground text-xs">
              <pre className="whitespace-pre-wrap">{JSON.stringify({
                id: tour?.id,
                title: tour?.title,
                slug: tour?.slug,
                published: tour?.is_published,
                featured_image: tour?.featured_image,
                gallery_count: Array.isArray(tour?.gallery) ? tour.gallery.length : 0,
                price: tour?.price
              }, null, 2)}</pre>
            </div>
          </div>
        )}
        <Navbar />
        {/* Premium Hero Image Section */}
        <div className="relative w-full h-[50vh] sm:h-[65vh] min-h-[400px] sm:min-h-[550px] overflow-hidden bg-gradient-to-br from-safari-cream to-safari-gold/10">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent z-10" />
          {tour.featured_image ? (
            <img 
              src={tour.featured_image} 
              alt={tour.title} 
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-safari-cream to-safari-gold/20" />
          )}
          
          {/* Decorative Elements */}
          <div className="absolute top-20 right-10 w-24 sm:w-32 h-24 sm:h-32 border border-white/20 rounded-full z-5 hidden sm:block" />
          <div className="absolute bottom-40 left-10 w-16 sm:w-24 h-16 sm:h-24 border border-safari-gold/30 rounded-full z-5 hidden sm:block" />
          
          <div className="absolute bottom-0 left-0 right-0 z-20 container-wide mx-auto px-4 pb-8 sm:pb-16">
            <div className="max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Badge className="mb-3 sm:mb-4 bg-white/90 backdrop-blur-sm text-safari-brown font-semibold border-0 shadow-lg px-3 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs">
                  <Award className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 sm:mr-1.5 text-safari-gold" />
                  {tour.category?.toUpperCase() || 'SAFARI'}
                </Badge>
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-3 sm:mb-4 leading-tight"
              >
                {tour.title}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-base sm:text-lg md:text-xl text-foreground/80 font-medium max-w-2xl leading-relaxed line-clamp-3 sm:line-clamp-none"
              >
                {tour.short_description}
              </motion.p>
            </div>
          </div>
        </div>

        <div className="container-wide mx-auto px-4 py-8 sm:py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8 sm:space-y-10">
              {/* Premium Quick Info Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {[
                  { icon: Clock, value: tour.duration, label: 'Duration' },
                  { icon: Users, value: tour.max_group_size || 12, label: 'Max Group' },
                  { icon: Star, value: tour.difficulty || 'Moderate', label: 'Difficulty' },
                  { icon: MapPin, value: 'TZ', label: 'Location' },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -3 }}
                  >
                    <Card className="border border-border/50 hover:border-safari-gold/50 transition-all bg-white rounded-xl sm:rounded-2xl hover:shadow-luxury cursor-pointer h-full">
                      <CardContent className="p-4 sm:p-5 text-center flex flex-col items-center justify-center h-full">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 rounded-lg sm:rounded-xl bg-gradient-to-br from-safari-gold/20 to-safari-amber/10 flex items-center justify-center">
                          <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-safari-gold" />
                        </div>
                        <div className="font-display text-lg sm:text-2xl font-bold text-foreground leading-tight">{item.value}</div>
                        <div className="text-[10px] sm:text-xs text-muted-foreground mt-1 font-medium uppercase tracking-wider">{item.label}</div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Tour Information Table */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Card className="border border-border/50 shadow-soft overflow-hidden hover:shadow-elevated transition-all duration-300 rounded-2xl">
                  <div className="bg-gradient-to-r from-safari-gold/10 via-safari-gold/5 to-transparent p-5 sm:p-6 border-b border-border/50">
                    <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground flex items-center gap-3">
                      <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-safari-gold" />
                      Tour Information
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">Complete details about your adventure</p>
                  </div>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableBody>
                        <TableRow className="hover:bg-muted/30 transition-colors">
                          <TableHead className="font-semibold text-foreground w-1/3 text-xs sm:text-sm">Tour Duration</TableHead>
                          <TableCell className="text-foreground text-xs sm:text-sm">{tour.duration || 'Not specified'}</TableCell>
                        </TableRow>
                        <TableRow className="hover:bg-muted/30 transition-colors">
                          <TableHead className="font-semibold text-foreground text-xs sm:text-sm">Price per Person</TableHead>
                          <TableCell className="text-foreground">
                            {tour.price ? (
                              <span className="text-lg sm:text-xl font-bold text-safari-gold">
                                ${tour.price.toLocaleString()} {tour.currency || 'USD'}
                              </span>
                            ) : (
                              <span className="text-muted-foreground text-xs sm:text-sm">Contact for pricing</span>
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow className="hover:bg-muted/30 transition-colors">
                          <TableHead className="font-semibold text-foreground text-xs sm:text-sm">Difficulty Level</TableHead>
                          <TableCell>
                            <Badge variant="outline" className="font-medium text-[10px] sm:text-xs">
                              {tour.difficulty || 'Moderate'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow className="hover:bg-muted/30 transition-colors">
                          <TableHead className="font-semibold text-foreground text-xs sm:text-sm">Max Group Size</TableHead>
                          <TableCell className="text-foreground">
                            <span className="flex items-center gap-2 text-xs sm:text-sm">
                              <Users className="w-3.5 h-3.5 text-safari-gold" />
                              {tour.max_group_size || 12} people
                            </span>
                          </TableCell>
                        </TableRow>
                        <TableRow className="hover:bg-muted/30 transition-colors">
                          <TableHead className="font-semibold text-foreground text-xs sm:text-sm">Category</TableHead>
                          <TableCell>
                            <Badge className="bg-safari-gold/10 text-safari-brown hover:bg-safari-gold/20 border-safari-gold/20 text-[10px] sm:text-xs">
                              {tour.category || 'Safari'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </Card>
              </motion.div>

              {/* Overview Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Card className="border border-border/50 shadow-soft hover:shadow-elevated transition-all duration-300 rounded-2xl">
                  <div className="bg-gradient-to-r from-safari-gold/10 via-safari-gold/5 to-transparent p-5 sm:p-6 border-b border-border/50">
                    <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground flex items-center gap-3">
                      <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-safari-gold" />
                      Overview
                    </h2>
                  </div>
                  <CardContent className="p-5 sm:p-6">
                    <div className="prose prose-sm sm:prose-base max-w-none">
                      <p className="text-foreground/90 leading-relaxed whitespace-pre-line font-body">
                        {tour.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Gallery Section */}
              {allImages && allImages.length > 0 && (
                <Card className="border border-border/50 shadow-soft overflow-hidden rounded-2xl">
                  <div className="bg-gradient-to-r from-safari-gold/10 via-safari-gold/5 to-transparent p-5 sm:p-6 border-b border-border/50">
                    <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground flex items-center gap-3">
                      <Images className="w-5 h-5 sm:w-6 sm:h-6 text-safari-gold" />
                      Photo Gallery
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">Explore stunning images from this adventure</p>
                  </div>
                  <CardContent className="p-4 sm:p-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                      {allImages.map((image: string, index: number) => (
                        image && (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group touch-target"
                            onClick={() => openLightbox(index)}
                          >
                            <img
                              src={image}
                              alt={`${tour.title} - Image ${index + 1}`}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                              <Images className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            {index === 0 && tour.featured_image && (
                              <div className="absolute top-2 left-2">
                                <Badge className="bg-safari-gold text-safari-night text-[10px] px-2 py-0">
                                  Featured
                                </Badge>
                              </div>
                            )}
                          </motion.div>
                        )
                      ))}
                    </div>
                    <p className="text-[10px] sm:text-xs text-muted-foreground mt-4 text-center">
                      Tap any image to view in full screen
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Highlights Section */}
              {safeHighlights.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <Card className="border border-border/50 shadow-soft rounded-2xl">
                    <div className="bg-gradient-to-r from-safari-gold/10 via-safari-gold/5 to-transparent p-5 sm:p-6 border-b border-border/50">
                      <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground flex items-center gap-3">
                        <Star className="w-5 h-5 sm:w-6 sm:h-6 text-safari-gold" />
                        Tour Highlights
                      </h2>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1">What makes this adventure special</p>
                    </div>
                    <CardContent className="p-4 sm:p-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        {safeHighlights.map((highlight: string, index: number) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                            className="flex items-start gap-3 p-3 sm:p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all border border-border/30 hover:border-safari-gold/30"
                          >
                            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-safari-gold flex-shrink-0 mt-0.5" />
                            <span className="text-foreground font-medium text-xs sm:text-sm">{highlight}</span>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Included/Excluded Table */}
              {(safeIncluded.length > 0 || safeExcluded.length > 0) && (
                <Card className="border border-border/50 shadow-soft rounded-2xl overflow-hidden">
                  <div className="bg-gradient-to-r from-safari-gold/10 via-safari-gold/5 to-transparent p-5 sm:p-6 border-b border-border/50">
                    <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground">
                      What's Included & Excluded
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">Know exactly what's covered</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border/50">
                    {safeIncluded.length > 0 && (
                      <div className="p-4 sm:p-6">
                        <h3 className="font-display text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          Included
                        </h3>
                        <div className="space-y-2">
                          {safeIncluded.map((item: string, index: number) => (
                            <div key={index} className="flex items-start gap-3 text-xs sm:text-sm text-foreground/80 py-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {safeExcluded.length > 0 && (
                      <div className="p-4 sm:p-6">
                        <h3 className="font-display text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                          <X className="w-4 h-4 text-red-600" />
                          Excluded
                        </h3>
                        <div className="space-y-2">
                          {safeExcluded.map((item: string, index: number) => (
                            <div key={index} className="flex items-start gap-3 text-xs sm:text-sm text-foreground/80 py-1">
                              <X className="w-3.5 h-3.5 text-red-600 flex-shrink-0 mt-0.5" />
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              )}

              {/* Itinerary Section */}
              {safeItinerary.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <Card className="border border-border/50 shadow-soft hover:shadow-elevated transition-all duration-300 rounded-2xl">
                    <div className="bg-gradient-to-r from-safari-gold/10 via-safari-gold/5 to-transparent p-5 sm:p-6 border-b border-border/50">
                      <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground flex items-center gap-3">
                        <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-safari-gold" />
                        Detailed Itinerary
                      </h2>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1">Day-by-day breakdown of your adventure</p>
                    </div>
                    <CardContent className="p-4 sm:p-6">
                      <div className="space-y-6">
                        {safeItinerary.map((day: any, index: number) => (
                          <motion.div
                            key={day.day || index}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                            className="relative pl-6 sm:pl-8 pb-6 border-l-2 border-safari-gold/30 last:border-l-0 last:pb-0"
                          >
                            <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-safari-gold border-4 border-background shadow-sm flex items-center justify-center">
                              <span className="text-[8px] font-bold text-safari-night">{day.day || index + 1}</span>
                            </div>
                            <div className="bg-muted/20 rounded-xl p-4 sm:p-6 border border-border/30 hover:border-safari-gold/20 transition-all">
                              <h3 className="font-display text-lg sm:text-xl font-bold text-foreground mb-2">
                                Day {day.day || index + 1}: {day.title}
                              </h3>
                              <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed mb-4">{day.description}</p>
                              {day.activities && day.activities.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-4">
                                  {day.activities.map((activity: string, actIndex: number) => (
                                    <Badge 
                                      key={actIndex}
                                      variant="outline" 
                                      className="text-[10px] sm:text-xs bg-white/50 border-border/50 text-foreground/70"
                                    >
                                      {activity}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Reviews */}
              <TourReviews tourId={tour.id} tourTitle={tour.title} />
            </div>

            {/* Sidebar */}
            <aside>
              <div className="sticky top-24 space-y-6">
                {/* Premium Booking Card */}
                <Card className="border border-safari-gold/30 shadow-luxury bg-white rounded-2xl overflow-hidden">
                  <CardContent className="p-0">
                    <div className="bg-gradient-to-r from-safari-gold to-safari-amber p-5 sm:p-6 text-safari-night">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-[10px] sm:text-xs opacity-80 font-medium uppercase tracking-wider">Starting from</div>
                          <div className="text-3xl sm:text-4xl font-bold mt-1">
                            {tour.price ? `$${tour.price.toLocaleString()}` : 'Contact'}
                          </div>
                          <div className="text-[10px] sm:text-xs opacity-80 mt-1">per person</div>
                        </div>
                        {tour.duration && (
                          <div className="text-right bg-white/20 backdrop-blur-sm rounded-xl px-3 sm:px-4 py-2 sm:py-3">
                            <Clock className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1" />
                            <div className="text-[10px] sm:text-xs font-semibold">{tour.duration}</div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="p-5 sm:p-6 space-y-4">
                      {/* Add to Cart Button */}
                      <AddToCartButton
                        item={{
                          id: tour.id,
                          type: "tour",
                          title: tour.title,
                          image: tour.featured_image,
                          price: tour.price || 0,
                          duration: tour.duration,
                        }}
                        className="w-full h-11 sm:h-12 rounded-xl font-bold"
                      />
                      
                      <div className="relative py-2">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-border/50"></div>
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
                          <span className="bg-white px-2 text-muted-foreground">or book now</span>
                        </div>
                      </div>
                      
                      <BookingForm 
                        tourId={tour.id} 
                        tourName={tour.title}
                        basePrice={tour.price}
                        zonePrices={(tour as any).zone_prices || {}}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Premium Quick Contact */}
                <Card className="border border-border/50 bg-gradient-to-br from-safari-cream/30 to-transparent rounded-2xl">
                  <CardContent className="p-5 sm:p-6">
                    <h3 className="font-display text-base sm:text-lg font-bold text-foreground mb-3">Need Help?</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4">
                      Our travel experts are here to help you plan the perfect adventure. Contact us for:
                    </p>
                    <ul className="space-y-3 text-xs sm:text-sm text-muted-foreground">
                      <li className="flex items-center gap-3">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-safari-gold/10 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-safari-gold" />
                        </div>
                        Custom itineraries
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-safari-gold/10 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-safari-gold" />
                        </div>
                        Group bookings
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-safari-gold/10 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-safari-gold" />
                        </div>
                        Special requests
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </aside>
          </div>
        </div>
        <Footer />
      </div>

      {/* Image Lightbox Modal */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-7xl w-full h-[90vh] p-0 bg-black/95 border-none">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 z-50 text-white hover:text-primary transition-colors p-2 rounded-full hover:bg-white/10"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Previous Button */}
            {allImages.length > 1 && (
              <button
                onClick={() => navigateImage('prev')}
                className="absolute left-4 z-50 text-white hover:text-primary transition-colors p-3 rounded-full hover:bg-white/10 backdrop-blur-sm"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
            )}

            {/* Image */}
            <AnimatePresence mode="wait">
              {allImages[selectedImageIndex] && (
                <motion.img
                  key={selectedImageIndex}
                  src={allImages[selectedImageIndex]}
                  alt={`${tour.title} - Image ${selectedImageIndex + 1}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-full max-h-full object-contain"
                />
              )}
            </AnimatePresence>

            {/* Next Button */}
            {allImages.length > 1 && (
              <button
                onClick={() => navigateImage('next')}
                className="absolute right-4 z-50 text-white hover:text-primary transition-colors p-3 rounded-full hover:bg-white/10 backdrop-blur-sm"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            )}

            {/* Image Counter */}
            {allImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
                {selectedImageIndex + 1} / {allImages.length}
              </div>
            )}

            {/* Thumbnail Strip */}
            {allImages && allImages.length > 1 && (
              <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-50 flex gap-2 max-w-4xl overflow-x-auto px-4 pb-2">
                {allImages.map((image: string, index: number) => (
                  image && (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        index === selectedImageIndex
                          ? 'border-primary scale-110'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </button>
                  )
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </ErrorBoundary>
  );
};

export default TourPage;