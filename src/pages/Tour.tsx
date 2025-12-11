import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Clock, Users, MapPin, Star, CheckCircle2, Calendar, Award, Zap, Heart, Images, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BookingForm from '@/components/tours/BookingForm';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Navbar } from '@/components/layout/Navbar';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import { Footer } from '@/components/layout/Footer';
import { TourReviews } from '@/components/tours/TourReviews';
import { AddToCartButton } from '@/components/cart/AddToCartButton';

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-card to-background">
      <div className="text-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
        <p className="text-muted-foreground font-medium">Loading your adventure...</p>
      </div>
    </div>
  );

  // Tour not found state
  if (!tour) return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex items-center justify-center py-32">
        <div className="text-center space-y-4">
          <p className="text-2xl font-heading text-muted-foreground">Tour not found.</p>
          <p className="text-muted-foreground">The tour you're looking for doesn't exist or has been removed.</p>
          <p className="text-sm text-muted-foreground">Slug: {slug}</p>
          <a href="/safaris" className="inline-block mt-4 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90">
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
        {/* Hero Image Section */}
        <div className="relative w-full h-[60vh] min-h-[500px] overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5">
          <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/50 to-transparent z-10" />
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
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/10" />
          )}
          <div className="absolute bottom-0 left-0 right-0 z-20 container-wide mx-auto px-4 pb-12">
            <div className="max-w-4xl">
              <Badge className="mb-4 bg-safari-gold/90 text-foreground hover:bg-safari-gold border-0">
                <Award className="w-3 h-3 mr-1" />
                {tour.category?.toUpperCase() || 'SAFARI'}
              </Badge>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-tight">
                {tour.title}
              </h1>
              <p className="text-lg md:text-xl text-foreground/90 font-medium max-w-2xl leading-relaxed">
                {tour.short_description}
              </p>
            </div>
          </div>
        </div>

        <div className="container-wide mx-auto px-4 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-10">
              {/* Quick Info Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <Card className="border-2 border-border/50 hover:border-primary/50 transition-all bg-gradient-to-br from-card to-card/50 hover:shadow-lg cursor-pointer">
                      <CardContent className="p-4 text-center">
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                        >
                          <item.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                        </motion.div>
                        <div className="font-heading text-2xl font-bold text-foreground">{item.value}</div>
                        <div className="text-xs text-muted-foreground mt-1">{item.label}</div>
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
                <Card className="border-2 border-border shadow-elevated overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 border-b border-border">
                    <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      >
                        <Zap className="w-6 h-6 text-primary" />
                      </motion.div>
                      Tour Information
                    </h2>
                    <p className="text-muted-foreground mt-2">Complete details about your adventure</p>
                  </div>
                <Table>
                  <TableBody>
                    <TableRow className="hover:bg-muted/50 transition-colors">
                      <TableHead className="font-semibold text-foreground w-1/3">Tour Duration</TableHead>
                      <TableCell className="text-foreground">{tour.duration || 'Not specified'}</TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-muted/50 transition-colors">
                      <TableHead className="font-semibold text-foreground">Price per Person</TableHead>
                      <TableCell className="text-foreground">
                        {tour.price ? (
                          <span className="text-xl font-bold text-primary">
                            ${tour.price.toLocaleString()} {tour.currency || 'USD'}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">Contact for pricing</span>
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-muted/50 transition-colors">
                      <TableHead className="font-semibold text-foreground">Difficulty Level</TableHead>
                      <TableCell>
                        <Badge variant="outline" className="font-medium">
                          {tour.difficulty || 'Moderate'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-muted/50 transition-colors">
                      <TableHead className="font-semibold text-foreground">Maximum Group Size</TableHead>
                      <TableCell className="text-foreground">
                        <span className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-primary" />
                          {tour.max_group_size || 12} people
                        </span>
                      </TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-muted/50 transition-colors">
                      <TableHead className="font-semibold text-foreground">Category</TableHead>
                      <TableCell>
                        <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
                          {tour.category || 'Safari'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-muted/50 transition-colors">
                      <TableHead className="font-semibold text-foreground">Currency</TableHead>
                      <TableCell className="text-foreground">{tour.currency || 'USD'}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Card>
              </motion.div>

              {/* Overview Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Card className="border-2 border-border shadow-elevated hover:shadow-xl transition-shadow">
                  <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 border-b border-border">
                    <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      >
                        <Heart className="w-6 h-6 text-primary" />
                      </motion.div>
                      Overview
                    </h2>
                  </div>
                <CardContent className="p-6">
                  <div className="prose prose-lg max-w-none">
                    <p className="text-foreground/90 leading-relaxed whitespace-pre-line text-base md:text-lg font-body">
                      {tour.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
              </motion.div>

              {/* Gallery Section */}
              {allImages && allImages.length > 0 && (
                <Card className="border-2 border-border shadow-elevated overflow-hidden">
                  <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 border-b border-border">
                    <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
                      <Images className="w-6 h-6 text-primary" />
                      Photo Gallery
                    </h2>
                    <p className="text-muted-foreground mt-2">Explore stunning images from this adventure</p>
                  </div>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {allImages.map((image: string, index: number) => (
                        image && (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
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
                              <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileHover={{ opacity: 1, scale: 1 }}
                                className="text-white"
                              >
                                <Images className="w-8 h-8" />
                              </motion.div>
                            </div>
                            {index === 0 && tour.featured_image && (
                              <div className="absolute top-2 left-2">
                                <Badge className="bg-safari-gold text-safari-night text-xs">
                                  Featured
                                </Badge>
                              </div>
                            )}
                          </motion.div>
                        )
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mt-4 text-center">
                      Click any image to view in full screen
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
                  <Card className="border-2 border-border shadow-elevated">
                    <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 border-b border-border">
                      <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
                        <Star className="w-6 h-6 text-primary" />
                        Tour Highlights
                      </h2>
                      <p className="text-muted-foreground mt-2">What makes this adventure special</p>
                    </div>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {safeHighlights.map((highlight: string, index: number) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-muted/50 to-transparent hover:from-muted hover:to-muted/50 transition-all border border-border/50 hover:border-primary/50 hover:shadow-md"
                          >
                            <motion.div
                              whileHover={{ scale: 1.2, rotate: 360 }}
                              transition={{ duration: 0.5 }}
                            >
                              <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            </motion.div>
                            <span className="text-foreground font-medium">{highlight}</span>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Included/Excluded Table */}
              {(safeIncluded.length > 0 || safeExcluded.length > 0) && (
                <Card className="border-2 border-border shadow-elevated">
                  <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 border-b border-border">
                    <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
                      What's Included & Excluded
                    </h2>
                    <p className="text-muted-foreground mt-2">Know exactly what's covered</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
                    {safeIncluded.length > 0 && (
                      <div className="p-6">
                        <h3 className="font-heading text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                          Included
                        </h3>
                        <Table>
                          <TableBody>
                            {safeIncluded.map((item: string, index: number) => (
                              <TableRow key={index} className="hover:bg-green-50/50 dark:hover:bg-green-950/10">
                                <TableCell className="flex items-center gap-3 text-foreground">
                                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                                  {item}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                    {safeExcluded.length > 0 && (
                      <div className="p-6">
                        <h3 className="font-heading text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                          <span className="text-red-600">✕</span>
                          Excluded
                        </h3>
                        <Table>
                          <TableBody>
                            {safeExcluded.map((item: string, index: number) => (
                              <TableRow key={index} className="hover:bg-red-50/50 dark:hover:bg-red-950/10">
                                <TableCell className="flex items-center gap-3 text-foreground">
                                  <span className="w-4 h-4 text-red-600 flex-shrink-0 flex items-center justify-center">✕</span>
                                  {item}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
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
                  <Card className="border-2 border-border shadow-elevated hover:shadow-xl transition-shadow">
                    <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 border-b border-border">
                      <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
                        <motion.div
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        >
                          <Calendar className="w-6 h-6 text-primary" />
                        </motion.div>
                        Detailed Itinerary
                      </h2>
                      <p className="text-muted-foreground mt-2">Day-by-day breakdown of your adventure</p>
                    </div>
                    <CardContent className="p-6">
                      <div className="space-y-6">
                        {safeItinerary.map((day: any, index: number) => (
                          <motion.div
                            key={day.day || index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            className="relative pl-8 pb-6 border-l-2 border-primary/30 last:border-l-0 last:pb-0"
                          >
                            <motion.div
                              whileHover={{ scale: 1.2 }}
                              className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-primary border-4 border-background shadow-lg flex items-center justify-center"
                            >
                              <span className="text-xs font-bold text-primary-foreground">{day.day || index + 1}</span>
                            </motion.div>
                            <motion.div
                              whileHover={{ scale: 1.02, x: 5 }}
                              className="bg-gradient-to-br from-card to-card/50 rounded-xl p-6 border border-border/50 hover:shadow-md transition-shadow cursor-pointer"
                            >
                              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-3">
                                <h3 className="font-heading text-xl font-bold text-foreground">
                                  Day {day.day || index + 1}: {day.title}
                                </h3>
                              </div>
                              <p className="text-foreground/80 leading-relaxed mb-4">{day.description}</p>
                              {day.activities && day.activities.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-4">
                                  {day.activities.map((activity: string, actIndex: number) => (
                                    <motion.div
                                      key={actIndex}
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.95 }}
                                    >
                                      <Badge 
                                        variant="outline" 
                                        className="text-xs bg-primary/5 border-primary/20 text-primary cursor-pointer"
                                      >
                                        {activity}
                                      </Badge>
                                    </motion.div>
                                  ))}
                                </div>
                              )}
                            </motion.div>
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
                {/* Booking Card */}
                <Card className="border-2 border-primary/20 shadow-elevated bg-gradient-to-br from-card to-card/50">
                  <CardContent className="p-0">
                    <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-white rounded-t-xl">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="text-sm opacity-90">Starting from</div>
                          <div className="text-4xl font-bold">
                            {tour.price ? `$${tour.price.toLocaleString()}` : 'Contact'}
                          </div>
                          <div className="text-sm opacity-90 mt-1">per person</div>
                        </div>
                        {tour.duration && (
                          <div className="text-right">
                            <Clock className="w-5 h-5 mx-auto mb-1 opacity-90" />
                            <div className="text-sm font-semibold">{tour.duration}</div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="p-6">
                      {tour.price && (
                        <div className="mb-4">
                          <AddToCartButton
                            tourId={tour.id}
                            tourName={tour.title}
                            slug={tour.slug || slug || ''}
                            price={tour.price}
                            currency={tour.currency || undefined}
                            duration={tour.duration}
                            featuredImage={tour.featured_image}
                            size="lg"
                            className="w-full"
                          />
                        </div>
                      )}
                      <BookingForm 
                        tourId={tour.id} 
                        tourName={tour.title}
                        basePrice={tour.price}
                        zonePrices={(tour as any).zone_prices || {}}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Contact */}
                <Card className="border-2 border-border bg-gradient-to-br from-muted/30 to-transparent">
                  <CardContent className="p-6">
                    <h3 className="font-heading text-lg font-bold text-foreground mb-3">Need Help?</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      Our travel experts are here to help you plan the perfect adventure. Contact us for:
                    </p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        Custom itineraries
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        Group bookings
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
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