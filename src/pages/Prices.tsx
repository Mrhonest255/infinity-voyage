import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Clock, Users, MapPin, Star, ArrowRight, Loader2, Calendar, Plane, Shield, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { SEO, SEO_KEYWORDS } from "@/components/SEO";
import { TourCardSkeleton } from "@/components/ui/skeleton";
import { AddToCartButton } from "@/components/cart/Cart";

const Prices = () => {
  const { data: tours, isLoading } = useQuery({
    queryKey: ['tours-prices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tours')
        .select('*')
        .eq('is_published', true)
        .order('price', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const safariTours = tours?.filter(t => 
    t.category?.toLowerCase().includes('safari') || 
    t.category?.toLowerCase().includes('wildlife') ||
    t.category?.toLowerCase().includes('adventure')
  ) || [];

  const zanzibarTours = tours?.filter(t => 
    t.category?.toLowerCase().includes('beach') || 
    t.category?.toLowerCase().includes('marine') ||
    t.category?.toLowerCase().includes('cultural') ||
    t.category?.toLowerCase().includes('excursion') ||
    t.title?.toLowerCase().includes('zanzibar')
  ) || [];

  const climbingTours = tours?.filter(t => 
    t.category?.toLowerCase().includes('climbing') || 
    t.category?.toLowerCase().includes('trek') ||
    t.title?.toLowerCase().includes('kilimanjaro')
  ) || [];

  const formatPrice = (price: number | null) => {
    if (!price) return "Contact Us";
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
  };

  const TourCard = ({ tour }: { tour: any }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full flex flex-col hover:shadow-elevated transition-all duration-300 border-border/50 overflow-hidden group">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={tour.image || '/placeholder.svg'} 
            alt={tour.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {tour.featured && (
            <Badge className="absolute top-3 left-3 bg-safari-gold text-safari-night">
              <Star className="w-3 h-3 mr-1" /> Featured
            </Badge>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <p className="text-white font-display text-2xl font-bold">
              {formatPrice(tour.price)}
              <span className="text-sm font-normal text-white/80"> / person</span>
            </p>
          </div>
        </div>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg line-clamp-1">{tour.title}</CardTitle>
          <CardDescription className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-safari-gold" />
            {tour.location || "Tanzania"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="flex flex-wrap gap-3 mb-4">
            {tour.duration && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="w-4 h-4 text-safari-gold" />
                {tour.duration}
              </div>
            )}
            {tour.group_size && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Users className="w-4 h-4 text-safari-gold" />
                {tour.group_size}
              </div>
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {tour.description || "Experience the beauty of Tanzania with this amazing tour package."}
          </p>
        </CardContent>
        <CardFooter className="pt-0 flex gap-2">
          <AddToCartButton
            item={{
              id: tour.id,
              type: "tour",
              title: tour.title,
              image: tour.image,
              price: tour.price || 0,
              duration: tour.duration,
            }}
            variant="outline"
            className="flex-shrink-0"
          />
          <Link to={`/tour/${tour.slug || tour.id}`} className="flex-1">
            <Button className="w-full bg-safari-gold hover:bg-safari-amber text-safari-night">
              View <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );

  const pricingInclusions = [
    { icon: Plane, title: "Airport Transfers", description: "Pick-up and drop-off included" },
    { icon: Users, title: "Professional Guide", description: "English-speaking expert guides" },
    { icon: Shield, title: "Travel Insurance", description: "Basic travel coverage included" },
    { icon: Calendar, title: "Flexible Booking", description: "Free cancellation up to 48hrs" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO 
        title="Tanzania Safari & Zanzibar Tour Prices 2025 - Best Rates"
        description="View transparent pricing for Tanzania safaris and Zanzibar tours. Compare packages, check what's included, and find the best deals. Budget to luxury options available. No hidden fees!"
        keywords={SEO_KEYWORDS.prices}
        url="/prices"
      />
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-safari-night via-safari-night/95 to-safari-brown/20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-5"></div>
        <div className="container-wide mx-auto px-4 md:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge className="bg-safari-gold/20 text-safari-gold border-safari-gold/30 mb-4">
              Transparent Pricing
            </Badge>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              Tour <span className="text-safari-gold">Prices</span> & Packages
            </h1>
            <p className="text-primary-foreground/80 text-lg md:text-xl">
              Discover our carefully curated safari packages and Zanzibar excursions. 
              All prices include professional guides, transportation, and unforgettable experiences.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Inclusions Section */}
      <section className="py-12 bg-muted/30 border-b border-border">
        <div className="container-wide mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {pricingInclusions.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 p-4 bg-background rounded-xl shadow-soft"
              >
                <div className="p-3 bg-safari-gold/10 rounded-lg">
                  <item.icon className="w-6 h-6 text-safari-gold" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 flex-1">
        <div className="container-wide mx-auto px-4 md:px-8">
          {isLoading ? (
            <div className="space-y-10">
              {/* Skeleton tabs */}
              <div className="flex justify-center">
                <div className="bg-muted/50 p-1 rounded-xl">
                  <div className="flex gap-2">
                    {['All Tours', 'Safaris', 'Zanzibar', 'Climbing'].map((tab) => (
                      <div key={tab} className="px-6 py-2 text-sm font-medium text-muted-foreground">
                        {tab}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Skeleton grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <TourCardSkeleton key={i} />
                ))}
              </div>
            </div>
          ) : (
            <Tabs defaultValue="all" className="w-full">
              <div className="flex justify-center mb-10">
                <TabsList className="bg-muted/50 p-1">
                  <TabsTrigger value="all" className="px-6">All Tours</TabsTrigger>
                  <TabsTrigger value="safaris" className="px-6">Safaris</TabsTrigger>
                  <TabsTrigger value="zanzibar" className="px-6">Zanzibar</TabsTrigger>
                  <TabsTrigger value="climbing" className="px-6">Climbing</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="all">
                {tours && tours.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {tours.map((tour) => (
                      <TourCard key={tour.id} tour={tour} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <p className="text-muted-foreground text-lg">No tours available at the moment.</p>
                    <Link to="/contact">
                      <Button className="mt-4 bg-safari-gold hover:bg-safari-amber text-safari-night">
                        Contact Us for Custom Packages
                      </Button>
                    </Link>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="safaris">
                {safariTours.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {safariTours.map((tour) => (
                      <TourCard key={tour.id} tour={tour} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <p className="text-muted-foreground">No safari tours found.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="zanzibar">
                {zanzibarTours.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {zanzibarTours.map((tour) => (
                      <TourCard key={tour.id} tour={tour} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <p className="text-muted-foreground">No Zanzibar tours found.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="climbing">
                {climbingTours.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {climbingTours.map((tour) => (
                      <TourCard key={tour.id} tour={tour} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <p className="text-muted-foreground">No climbing tours found.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-safari-gold to-safari-amber">
        <div className="container-wide mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="font-display text-3xl font-bold text-safari-night mb-2">
                Need a Custom Package?
              </h2>
              <p className="text-safari-night/80">
                Contact us for personalized safari experiences tailored to your preferences and budget.
              </p>
            </div>
            <Link to="/contact">
              <Button size="lg" className="bg-safari-night hover:bg-safari-night/90 text-primary-foreground">
                Get Custom Quote <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Prices;
