import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Clock, Users, MapPin, Star, CheckCircle2, Calendar, Award, Zap, Heart } from 'lucide-react';
import BookingForm from '@/components/tours/BookingForm';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const TourPage = () => {
  const { slug } = useParams();
  const [tour, setTour] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    supabase.from('tours').select('*').eq('slug', slug).maybeSingle()
      .then(({ data, error }) => {
        if (error) {
          console.error('Error fetching tour', error);
        } else {
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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-card to-background">
      <div className="text-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
        <p className="text-muted-foreground font-medium">Loading your adventure...</p>
      </div>
    </div>
  );

  if (!tour) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <p className="text-2xl font-heading text-muted-foreground">Tour not found.</p>
        <p className="text-muted-foreground">The tour you're looking for doesn't exist or has been removed.</p>
      </div>
    </div>
  );

  return (
    <>
      {/* SEO Structured Data is added via useEffect */}
      <div className="min-h-screen bg-gradient-to-br from-background via-card/30 to-background">
        {/* Hero Image Section */}
        <div className="relative w-full h-[60vh] min-h-[500px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/50 to-transparent z-10" />
          <img 
            src={tour.featured_image} 
            alt={tour.title} 
            className="w-full h-full object-cover"
          />
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
                <Card className="border-2 border-border/50 hover:border-primary/50 transition-colors bg-gradient-to-br from-card to-card/50">
                  <CardContent className="p-4 text-center">
                    <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
                    <div className="font-heading text-2xl font-bold text-foreground">{tour.duration}</div>
                    <div className="text-xs text-muted-foreground mt-1">Duration</div>
                  </CardContent>
                </Card>
                <Card className="border-2 border-border/50 hover:border-primary/50 transition-colors bg-gradient-to-br from-card to-card/50">
                  <CardContent className="p-4 text-center">
                    <Users className="w-6 h-6 text-primary mx-auto mb-2" />
                    <div className="font-heading text-2xl font-bold text-foreground">
                      {tour.max_group_size || 12}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">Max Group</div>
                  </CardContent>
                </Card>
                <Card className="border-2 border-border/50 hover:border-primary/50 transition-colors bg-gradient-to-br from-card to-card/50">
                  <CardContent className="p-4 text-center">
                    <Star className="w-6 h-6 text-primary mx-auto mb-2" />
                    <div className="font-heading text-2xl font-bold text-foreground">
                      {tour.difficulty || 'Moderate'}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">Difficulty</div>
                  </CardContent>
                </Card>
                <Card className="border-2 border-border/50 hover:border-primary/50 transition-colors bg-gradient-to-br from-card to-card/50">
                  <CardContent className="p-4 text-center">
                    <MapPin className="w-6 h-6 text-primary mx-auto mb-2" />
                    <div className="font-heading text-2xl font-bold text-foreground">TZ</div>
                    <div className="text-xs text-muted-foreground mt-1">Location</div>
                  </CardContent>
                </Card>
              </div>

              {/* Tour Information Table */}
              <Card className="border-2 border-border shadow-elevated overflow-hidden">
                <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 border-b border-border">
                  <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
                    <Zap className="w-6 h-6 text-primary" />
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

              {/* Overview Section */}
              <Card className="border-2 border-border shadow-elevated">
                <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 border-b border-border">
                  <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
                    <Heart className="w-6 h-6 text-primary" />
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

              {/* Highlights Section */}
              {tour.highlights && tour.highlights.length > 0 && (
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
                      {tour.highlights.map((highlight: string, index: number) => (
                        <div 
                          key={index}
                          className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-muted/50 to-transparent hover:from-muted hover:to-muted/50 transition-all border border-border/50"
                        >
                          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-foreground font-medium">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Included/Excluded Table */}
              {(tour.included || tour.excluded) && (
                <Card className="border-2 border-border shadow-elevated">
                  <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 border-b border-border">
                    <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
                      What's Included & Excluded
                    </h2>
                    <p className="text-muted-foreground mt-2">Know exactly what's covered</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
                    {tour.included && tour.included.length > 0 && (
                      <div className="p-6">
                        <h3 className="font-heading text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                          Included
                        </h3>
                        <Table>
                          <TableBody>
                            {tour.included.map((item: string, index: number) => (
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
                    {tour.excluded && tour.excluded.length > 0 && (
                      <div className="p-6">
                        <h3 className="font-heading text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                          <span className="text-red-600">✕</span>
                          Excluded
                        </h3>
                        <Table>
                          <TableBody>
                            {tour.excluded.map((item: string, index: number) => (
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
              {tour.itinerary && tour.itinerary.length > 0 && (
                <Card className="border-2 border-border shadow-elevated">
                  <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 border-b border-border">
                    <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
                      <Calendar className="w-6 h-6 text-primary" />
                      Detailed Itinerary
                    </h2>
                    <p className="text-muted-foreground mt-2">Day-by-day breakdown of your adventure</p>
                  </div>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      {tour.itinerary.map((day: any, index: number) => (
                        <div 
                          key={day.day || index}
                          className="relative pl-8 pb-6 border-l-2 border-primary/30 last:border-l-0 last:pb-0"
                        >
                          <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-primary border-4 border-background shadow-lg flex items-center justify-center">
                            <span className="text-xs font-bold text-primary-foreground">{day.day || index + 1}</span>
                          </div>
                          <div className="bg-gradient-to-br from-card to-card/50 rounded-xl p-6 border border-border/50 hover:shadow-md transition-shadow">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-3">
                              <h3 className="font-heading text-xl font-bold text-foreground">
                                Day {day.day || index + 1}: {day.title}
                              </h3>
                            </div>
                            <p className="text-foreground/80 leading-relaxed mb-4">{day.description}</p>
                            {day.activities && day.activities.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-4">
                                {day.activities.map((activity: string, actIndex: number) => (
                                  <Badge 
                                    key={actIndex} 
                                    variant="outline" 
                                    className="text-xs bg-primary/5 border-primary/20 text-primary"
                                  >
                                    {activity}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
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
                      <BookingForm tourId={tour.id} tourName={tour.title} />
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
      </div>
    </>
  );
};

export default TourPage;