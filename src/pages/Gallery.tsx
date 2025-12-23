import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GalleryImageSkeleton } from "@/components/ui/skeleton";
import { 
  Camera, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Loader2, 
  Image as ImageIcon,
  Mountain,
  Waves,
  TreePine,
  Bird
} from "lucide-react";

interface GalleryImage {
  id: string;
  url: string;
  title?: string;
  category?: string;
  description?: string;
}

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  // Fetch gallery images from Supabase or use placeholder images
  const { data: galleryImages, isLoading } = useQuery({
    queryKey: ['gallery-images'],
    queryFn: async () => {
      // Try to fetch from a gallery table if it exists
      const { data, error } = await supabase
        .from('tours')
        .select('id, title, featured_image, category, description')
        .eq('is_published', true)
        .not('featured_image', 'is', null);
      
      if (error) {
        console.error('Gallery fetch error:', error);
        return getPlaceholderImages();
      }
      
      // Transform tour images to gallery format
      const tourImages: GalleryImage[] = (data || []).map((tour: any) => ({
        id: tour.id,
        url: tour.featured_image || '',
        title: tour.title,
        category: tour.category || 'safari',
        description: tour.description
      }));

      // Add placeholder images if not enough
      if (tourImages.length < 12) {
        return [...tourImages, ...getPlaceholderImages().slice(0, 12 - tourImages.length)];
      }

      return tourImages;
    },
  });

  const getPlaceholderImages = (): GalleryImage[] => [
    { id: '1', url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800', title: 'Serengeti Sunset', category: 'safari', description: 'Beautiful sunset over the Serengeti plains' },
    { id: '2', url: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800', title: 'Lion Pride', category: 'wildlife', description: 'Majestic lions in their natural habitat' },
    { id: '3', url: 'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=800', title: 'African Elephant', category: 'wildlife', description: 'Elephant at a watering hole' },
    { id: '4', url: 'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=800', title: 'Zanzibar Beach', category: 'beach', description: 'Crystal clear waters of Zanzibar' },
    { id: '5', url: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=800', title: 'Mount Kilimanjaro', category: 'mountain', description: 'Africa\'s highest peak' },
    { id: '6', url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800', title: 'Safari Drive', category: 'safari', description: 'Game drive in the savanna' },
    { id: '7', url: 'https://images.unsplash.com/photo-1534177616064-ef1f0a6f8b97?w=800', title: 'Giraffe Family', category: 'wildlife', description: 'Graceful giraffes at sunset' },
    { id: '8', url: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800', title: 'Stone Town', category: 'culture', description: 'Historic Stone Town architecture' },
    { id: '9', url: 'https://images.unsplash.com/photo-1504945005722-33670dcaf685?w=800', title: 'Ngorongoro Crater', category: 'safari', description: 'The world\'s largest intact caldera' },
    { id: '10', url: 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=800', title: 'Zanzibar Sunset', category: 'beach', description: 'Magical sunset over the Indian Ocean' },
    { id: '11', url: 'https://images.unsplash.com/photo-1517960413843-0aee8e2b3285?w=800', title: 'Flamingos', category: 'wildlife', description: 'Pink flamingos at Lake Manyara' },
    { id: '12', url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800', title: 'Hot Air Balloon', category: 'safari', description: 'Balloon safari over the Serengeti' },
  ];

  const categories = [
    { id: 'all', label: 'All Photos', icon: Camera },
    { id: 'safari', label: 'Safari', icon: Bird },
    { id: 'wildlife', label: 'Wildlife', icon: TreePine },
    { id: 'beach', label: 'Beach', icon: Waves },
    { id: 'mountain', label: 'Mountains', icon: Mountain },
  ];

  const filteredImages = activeTab === 'all' 
    ? galleryImages 
    : galleryImages?.filter(img => img.category?.toLowerCase().includes(activeTab));

  const currentIndex = selectedImage 
    ? (filteredImages?.findIndex(img => img.id === selectedImage.id) ?? -1)
    : -1;

  const goToPrevious = () => {
    if (currentIndex > 0 && filteredImages) {
      setSelectedImage(filteredImages[currentIndex - 1]);
    }
  };

  const goToNext = () => {
    if (filteredImages && currentIndex < filteredImages.length - 1) {
      setSelectedImage(filteredImages[currentIndex + 1]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      {/* Premium Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-safari-night via-safari-night/95 to-safari-brown/20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-safari-gold/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-safari-sunset/10 rounded-full blur-3xl"></div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-1/4 right-20 w-24 h-24 border border-white/10 rounded-full" />
        <div className="absolute bottom-1/4 left-20 w-16 h-16 border border-safari-gold/20 rounded-full" />
        
        <div className="container-wide mx-auto px-4 md:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-3 mb-8 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-safari-gold to-safari-amber flex items-center justify-center">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <span className="text-white/90 text-sm font-semibold uppercase tracking-[0.2em]">
                Visual Journey
              </span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
            >
              Our Photo <span className="text-safari-gold">Gallery</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto"
            >
              Explore breathtaking moments from our safari adventures and Zanzibar excursions. 
              Every image tells a story of Africa's incredible beauty.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 flex-1">
        <div className="container-wide mx-auto px-4 md:px-8">
          {/* Premium Category Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-16">
            <div className="flex justify-center">
              <TabsList className="bg-white/80 backdrop-blur-md shadow-2xl border border-border/40 p-2 flex-wrap h-auto gap-2 rounded-[2rem]">
                {categories.map((cat) => (
                  <TabsTrigger 
                    key={cat.id} 
                    value={cat.id}
                    className="px-8 py-3.5 rounded-[1.5rem] data-[state=active]:bg-safari-night data-[state=active]:text-white data-[state=active]:shadow-xl font-bold transition-all duration-300"
                  >
                    <cat.icon className="w-4 h-4 mr-2" />
                    {cat.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </Tabs>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {[...Array(12)].map((_, i) => (
                <GalleryImageSkeleton 
                  key={i} 
                  className={i % 5 === 0 ? 'md:col-span-2 md:row-span-2' : ''} 
                />
              ))}
            </div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8"
            >
              <AnimatePresence mode="popLayout">
                {filteredImages?.map((image, index) => (
                  <motion.div
                    key={image.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className={`relative group cursor-pointer overflow-hidden rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all duration-500 ${
                      index % 5 === 0 ? 'md:col-span-2 md:row-span-2' : ''
                    }`}
                    onClick={() => setSelectedImage(image)}
                  >
                    <div className={`aspect-square ${index % 5 === 0 ? 'md:aspect-auto md:h-full' : ''}`}>
                      <img
                        src={image.url}
                        alt={image.title || 'Gallery image'}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        loading="lazy"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-safari-night/90 via-safari-night/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <div className="absolute bottom-0 left-0 right-0 p-8">
                        <h3 className="text-white font-display font-bold text-2xl mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{image.title}</h3>
                        {image.category && (
                          <Badge className="bg-safari-gold/90 backdrop-blur-sm text-safari-night border-0 text-xs font-bold px-4 py-1 rounded-full">
                            {image.category}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                      <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30">
                        <ImageIcon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {(!filteredImages || filteredImages.length === 0) && !isLoading && (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                <ImageIcon className="w-10 h-10 text-muted-foreground/50" />
              </div>
              <p className="text-muted-foreground text-lg">No images found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-6xl w-full h-[90vh] p-0 bg-black/95 border-none overflow-hidden">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-6 h-6" />
            </Button>

            {/* Navigation Buttons */}
            {currentIndex > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20 h-12 w-12"
                onClick={goToPrevious}
              >
                <ChevronLeft className="w-8 h-8" />
              </Button>
            )}
            {filteredImages && currentIndex < filteredImages.length - 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20 h-12 w-12"
                onClick={goToNext}
              >
                <ChevronRight className="w-8 h-8" />
              </Button>
            )}

            {/* Image */}
            <AnimatePresence mode="wait">
              {selectedImage && (
                <motion.div
                  key={selectedImage.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="relative max-h-full max-w-full p-8"
                >
                  <img
                    src={selectedImage.url}
                    alt={selectedImage.title || 'Gallery image'}
                    className="max-h-[70vh] max-w-full object-contain rounded-lg"
                  />
                  {/* Image Info */}
                  <div className="absolute bottom-0 left-8 right-8 p-6 bg-gradient-to-t from-black/80 to-transparent rounded-b-lg">
                    <h3 className="text-white font-display text-2xl font-bold mb-2">
                      {selectedImage.title}
                    </h3>
                    {selectedImage.description && (
                      <p className="text-white/80 text-sm">{selectedImage.description}</p>
                    )}
                    <div className="flex items-center gap-4 mt-3">
                      {selectedImage.category && (
                        <Badge className="bg-safari-gold text-safari-night">
                          {selectedImage.category}
                        </Badge>
                      )}
                      <span className="text-white/60 text-sm">
                        {currentIndex + 1} / {filteredImages?.length}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </DialogContent>
      </Dialog>

      {/* Premium CTA Section */}
      <section className="py-32 bg-safari-night relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-safari-gold/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-safari-sunset/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        
        <div className="container-wide mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-5xl mx-auto bg-white/5 backdrop-blur-xl rounded-[3rem] p-12 md:p-20 border border-white/10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-3 mb-8 px-6 py-3 bg-safari-gold/10 rounded-full border border-safari-gold/20">
                <Camera className="w-5 h-5 text-safari-gold" />
                <span className="text-safari-gold text-sm font-bold uppercase tracking-widest">Your Adventure Awaits</span>
              </div>
              
              <h2 className="font-display text-4xl md:text-6xl font-bold text-white mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Ready to Create Your Own <span className="italic text-safari-gold">Memories</span>?
              </h2>
              <p className="text-white/70 text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
                Join us on an unforgettable African adventure. Book your safari today and capture moments that will last a lifetime.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button 
                  size="xl" 
                  className="bg-safari-gold hover:bg-safari-amber text-safari-night font-bold rounded-full px-10 h-16 text-lg shadow-2xl shadow-safari-gold/20 transition-all duration-300"
                  asChild
                >
                  <a href="/safaris">Explore Safaris</a>
                </Button>
                <Button 
                  size="xl" 
                  variant="outline"
                  className="border-2 border-white/20 text-white hover:bg-white/10 rounded-full px-10 h-16 text-lg font-bold transition-all duration-300"
                  asChild
                >
                  <a href="/contact">Contact Us</a>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Gallery;
