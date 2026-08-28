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
      className="h-full"
    >
      <Card className="h-full flex flex-col hover:shadow-2xl transition-all duration-500 border-border/40 overflow-hidden group bg-white/80 backdrop-blur-sm">
        <div className="relative h-56 overflow-hidden">
          <img 
            src={tour.image || '/placeholder.svg'} 
            alt={tour.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-safari-night/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
          
          {tour.featured && (
            <Badge className="absolute top-4 left-4 bg-safari-gold text-safari-night font-bold shadow-lg">
              <Star className="w-3.5 h-3.5 mr-1 fill-current" /> Featured
            </Badge>
          )}
          
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-baseline gap-1">
              <span className="text-white font-display text-3xl font-bold drop-shadow-md">
                {formatPrice(tour.price)}
              </span>
              <span className="text-sm font-medium text-white/90 drop-shadow-sm">/ person</span>
            </div>
          </div>
        </div>

        <CardHeader className="pb-3">
          <div className="flex justify-between items-start gap-2 mb-1">
            <CardTitle className="text-xl font-display font-bold group-hover:text-safari-gold transition-colors line-clamp-1">
              {tour.title}
            </CardTitle>
          </div>
          <CardDescription className="flex items-center gap-1.5 text-safari-gold font-medium">
            <MapPin className="w-4 h-4" />
            {tour.location || "Tanzania"}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-1 pb-4">
          <div className="flex flex-wrap gap-4 mb-4">
            {tour.duration && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-full">
                <Clock className="w-4 h-4 text-safari-gold" />
                {tour.duration}
              </div>
            )}
            {tour.group_size && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-full">
                <Users className="w-4 h-4 text-safari-gold" />
                {tour.group_size}
              </div>
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            {tour.description || "Experience the beauty of Tanzania with this amazing tour package."}
          </p>
        </CardContent>

        <CardFooter className="pt-0 pb-6 px-6 flex gap-3">
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
            className="border-safari-gold/30 hover:bg-safari-gold/10 text-safari-gold"
          />
          <Link to={`/tour/${tour.slug || tour.id}`} className="flex-1">
            <Button className="w-full bg-safari-night hover:bg-safari-gold hover:text-safari-night text-white transition-all duration-300 group/btn">
              Details <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
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
      <section className="relative pt-32 pb-24 bg-safari-night overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80" 
            alt="Safari Landscape" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-safari-night/60 via-safari-night/80 to-background"></div>
        </div>
        
        <div className="container-wide mx-auto px-4 md:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge className="bg-safari-gold/20 text-safari-gold border-safari-gold/30 mb-6 px-4 py-1 text-sm uppercase tracking-widest">
              Transparent Pricing
            </Badge>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
              Tour <span className="text-safari-gold italic">Prices</span> & Packages
            </h1>
            <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Discover our carefully curated safari packages and Zanzibar excursions. 
              All prices include professional guides, transportation, and unforgettable experiences with no hidden fees.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Inclusions Section */}
      <section className="py-12 -mt-12 relative z-20">
        <div className="container-wide mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricingInclusions.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.4 }}
                className="flex items-center gap-4 p-6 bg-white rounded-2xl shadow-xl border border-border/50 hover:border-safari-gold/30 transition-colors group"
              >
                <div className="p-4 bg-safari-gold/10 rounded-xl group-hover:bg-safari-gold group-hover:text-safari-night transition-all duration-300">
                  <item.icon className="w-6 h-6 text-safari-gold group-hover:text-inherit" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-safari-night">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-tight">{item.description}</p>
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
              <div className="flex justify-center mb-12">
                <TabsList className="bg-muted/50 p-1.5 rounded-full border border-border/50 backdrop-blur-sm">
                  <TabsTrigger value="all" className="px-8 py-2.5 rounded-full data-[state=active]:bg-safari-gold data-[state=active]:text-safari-night transition-all duration-300">All Tours</TabsTrigger>
                  <TabsTrigger value="safaris" className="px-8 py-2.5 rounded-full data-[state=active]:bg-safari-gold data-[state=active]:text-safari-night transition-all duration-300">Safaris</TabsTrigger>
                  <TabsTrigger value="zanzibar" className="px-8 py-2.5 rounded-full data-[state=active]:bg-safari-gold data-[state=active]:text-safari-night transition-all duration-300">Zanzibar</TabsTrigger>
                  <TabsTrigger value="climbing" className="px-8 py-2.5 rounded-full data-[state=active]:bg-safari-gold data-[state=active]:text-safari-night transition-all duration-300">Climbing</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="all" className="mt-0">
                {tours && tours.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {tours.map((tour) => (
                      <TourCard key={tour.id} tour={tour} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-24 bg-muted/20 rounded-3xl border-2 border-dashed border-border">
                    <p className="text-muted-foreground text-xl font-display">No tours available at the moment.</p>
                    <Link to="/contact">
                      <Button className="mt-6 bg-safari-gold hover:bg-safari-amber text-safari-night px-8 py-6 rounded-full text-lg font-bold">
                        Contact Us for Custom Packages
                      </Button>
                    </Link>
                  </div>
                )}
              </TabsContent>
              {/* ... other TabsContent follow the same grid pattern ... */}
              <TabsContent value="safaris" className="mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {safariTours.map((tour) => (
                    <TourCard key={tour.id} tour={tour} />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="zanzibar" className="mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {zanzibarTours.map((tour) => (
                    <TourCard key={tour.id} tour={tour} />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="climbing" className="mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {climbingTours.map((tour) => (
                    <TourCard key={tour.id} tour={tour} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-safari-night">
          <img 
            src="https://images.unsplash.com/photo-1523805081730-6144a777a660?auto=format&fit=crop&q=80" 
            alt="Tanzania Sunset" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-safari-night via-safari-night/80 to-transparent"></div>
        </div>
        
        <div className="container-wide mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-3xl">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Ready to Start Your <span className="text-safari-gold italic">African Adventure?</span>
            </h2>
            <p className="text-white/80 text-lg mb-10 leading-relaxed">
              Our travel experts are ready to help you design the perfect itinerary tailored to your budget and preferences. 
              Whether it's a luxury safari or a budget-friendly beach escape, we've got you covered.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/contact">
                <Button className="w-full sm:w-auto bg-safari-gold hover:bg-safari-amber text-safari-night px-10 py-7 rounded-full text-lg font-bold shadow-xl hover:scale-105 transition-all duration-300">
                  Get a Custom Quote
                </Button>
              </Link>
              <Link to="/safaris">
                <Button variant="outline" className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 px-10 py-7 rounded-full text-lg font-bold backdrop-blur-sm">
                  Explore All Safaris
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Prices;
