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
        .select('id, title, image, category, description')
        .eq('published', true)
        .not('image', 'is', null);
      
      if (error) {
        console.error('Gallery fetch error:', error);
        return getPlaceholderImages();
      }
      
      // Transform tour images to gallery format
      const tourImages: GalleryImage[] = (data || []).map(tour => ({
        id: tour.id,
        url: tour.image || '',
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
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 bg-gradient-to-br from-safari-night via-safari-night/95 to-safari-brown/20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-safari-gold/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-safari-sunset/10 rounded-full blur-3xl"></div>
        </div>
        <div className="container-wide mx-auto px-4 md:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge className="bg-safari-gold/20 text-safari-gold border-safari-gold/30 mb-4">
              <Camera className="w-3 h-3 mr-1" /> Visual Journey
            </Badge>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              Our <span className="text-safari-gold">Gallery</span>
            </h1>
            <p className="text-primary-foreground/80 text-lg md:text-xl">
              Explore breathtaking moments from our safari adventures and Zanzibar excursions. 
              Every image tells a story of Africa's incredible beauty.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 flex-1">
        <div className="container-wide mx-auto px-4 md:px-8">
          {/* Category Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-10">
            <div className="flex justify-center">
              <TabsList className="bg-muted/50 p-1 flex-wrap h-auto gap-1">
                {categories.map((cat) => (
                  <TabsTrigger 
                    key={cat.id} 
                    value={cat.id}
                    className="px-4 py-2 data-[state=active]:bg-safari-gold data-[state=active]:text-safari-night"
                  >
                    <cat.icon className="w-4 h-4 mr-2" />
                    {cat.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </Tabs>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-safari-gold" />
            </div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filteredImages?.map((image, index) => (
                  <motion.div
                    key={image.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`relative group cursor-pointer overflow-hidden rounded-xl ${
                      index % 5 === 0 ? 'md:col-span-2 md:row-span-2' : ''
                    }`}
                    onClick={() => setSelectedImage(image)}
                  >
                    <div className={`aspect-square ${index % 5 === 0 ? 'md:aspect-auto md:h-full' : ''}`}>
                      <img
                        src={image.url}
                        alt={image.title || 'Gallery image'}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-white font-semibold text-lg">{image.title}</h3>
                        {image.category && (
                          <Badge variant="secondary" className="mt-2 bg-safari-gold/80 text-safari-night text-xs">
                            {image.category}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="p-2 bg-white/20 backdrop-blur-sm rounded-full">
                        <ImageIcon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {(!filteredImages || filteredImages.length === 0) && !isLoading && (
            <div className="text-center py-20">
              <ImageIcon className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
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

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-safari-night to-safari-brown">
        <div className="container-wide mx-auto px-4 md:px-8 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Create Your Own <span className="text-safari-gold">Memories</span>?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Join us on an unforgettable African adventure. Book your safari today and capture moments that will last a lifetime.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-safari-gold hover:bg-safari-amber text-safari-night"
              asChild
            >
              <a href="/safaris">Explore Safaris</a>
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              asChild
            >
              <a href="/contact">Contact Us</a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Gallery;
