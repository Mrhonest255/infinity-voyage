import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Calendar,
  Clock,
  User,
  Search,
  ArrowRight,
  Tag
} from "lucide-react";
import { Link } from "react-router-dom";

// Sample blog posts - in production, these would come from Supabase
const blogPosts = [
  {
    id: 1,
    title: "Top 10 Things to Do in Zanzibar",
    slug: "top-10-things-to-do-in-zanzibar",
    excerpt: "Discover the best experiences Zanzibar has to offer, from pristine beaches to historic Stone Town, spice tours, and unforgettable water activities.",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80",
    category: "Travel Tips",
    author: "Sarah Johnson",
    date: "December 5, 2025",
    readTime: "5 min read"
  },
  {
    id: 2,
    title: "Best Time to Visit Serengeti for the Great Migration",
    slug: "best-time-serengeti-migration",
    excerpt: "Planning your safari? Learn when to visit the Serengeti to witness one of nature's most spectacular events - the Great Wildebeest Migration.",
    image: "https://images.unsplash.com/photo-1547970810-dc1eac37d174?w=800&q=80",
    category: "Safari Guide",
    author: "Michael Chen",
    date: "December 3, 2025",
    readTime: "7 min read"
  },
  {
    id: 3,
    title: "A Complete Guide to Stone Town",
    slug: "complete-guide-stone-town",
    excerpt: "Explore the narrow streets, historic buildings, and vibrant markets of Stone Town, Zanzibar's UNESCO World Heritage cultural heart.",
    image: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=800&q=80",
    category: "Destinations",
    author: "Emma Rodriguez",
    date: "November 28, 2025",
    readTime: "6 min read"
  },
  {
    id: 4,
    title: "Safari Packing List: What to Bring",
    slug: "safari-packing-list",
    excerpt: "Don't forget anything! Our comprehensive packing list covers everything you need for an unforgettable African safari adventure.",
    image: "https://images.unsplash.com/photo-1516298773066-c48f8e9bd92b?w=800&q=80",
    category: "Travel Tips",
    author: "David Wilson",
    date: "November 25, 2025",
    readTime: "4 min read"
  },
  {
    id: 5,
    title: "Zanzibar Spice Tour: A Sensory Journey",
    slug: "zanzibar-spice-tour",
    excerpt: "Discover why Zanzibar is called the Spice Island. Learn about cloves, vanilla, cinnamon, and the island's fascinating spice trade history.",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80",
    category: "Experiences",
    author: "Sarah Johnson",
    date: "November 20, 2025",
    readTime: "5 min read"
  },
  {
    id: 6,
    title: "Ngorongoro Crater: The World's Largest Caldera",
    slug: "ngorongoro-crater-guide",
    excerpt: "Everything you need to know about visiting the Ngorongoro Crater, home to an incredible density of wildlife including the Big Five.",
    image: "https://images.unsplash.com/photo-1534177616064-ef1dbdf46760?w=800&q=80",
    category: "Safari Guide",
    author: "Michael Chen",
    date: "November 15, 2025",
    readTime: "8 min read"
  }
];

const categories = ["All", "Travel Tips", "Safari Guide", "Destinations", "Experiences"];

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [filteredPosts, setFilteredPosts] = useState(blogPosts);

  useEffect(() => {
    let filtered = blogPosts;
    
    if (activeCategory !== "All") {
      filtered = filtered.filter(post => post.category === activeCategory);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredPosts(filtered);
  }, [searchQuery, activeCategory]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 bg-safari-night overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80" 
            alt="Safari Landscape" 
            className="w-full h-full object-cover opacity-20"
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
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-safari-gold/20 text-safari-gold px-6 py-2 rounded-full text-sm font-bold mb-8 border border-safari-gold/30 uppercase tracking-widest"
            >
              <Sparkles className="w-4 h-4" /> Our Blog
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Travel <span className="text-safari-gold italic">Stories & Tips</span>
            </h1>
            <p className="text-white/80 text-xl md:text-2xl leading-relaxed max-w-2xl mx-auto">
              Expert travel advice, destination guides, and inspiration for your next African adventure.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="py-12 bg-white border-b border-border/50 sticky top-20 z-30 backdrop-blur-md bg-white/80">
        <div className="container-wide mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row gap-8 items-center justify-between">
            {/* Search */}
            <div className="relative w-full lg:w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-safari-gold transition-colors" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-6 rounded-full border-border/50 focus:border-safari-gold/50 focus:ring-safari-gold/20 bg-muted/30"
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                    activeCategory === category
                      ? "bg-safari-gold text-safari-night shadow-lg shadow-safari-gold/20"
                      : "bg-muted/50 text-muted-foreground hover:bg-safari-gold/10 hover:text-safari-gold"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-24">
        <div className="container-wide mx-auto px-4 md:px-8">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-32 bg-muted/20 rounded-[3rem] border-2 border-dashed border-border">
              <p className="text-muted-foreground text-2xl font-display">No articles found matching your criteria.</p>
              <Button 
                variant="link" 
                onClick={() => {setSearchQuery(""); setActiveCategory("All");}}
                className="mt-4 text-safari-gold font-bold text-lg"
              >
                Clear all filters
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group h-full"
                >
                  <Card className="h-full flex flex-col bg-white rounded-[2rem] overflow-hidden border-border/40 hover:shadow-2xl transition-all duration-500 group">
                    {/* Image */}
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-safari-night/60 via-transparent to-transparent opacity-60" />
                      <div className="absolute top-6 left-6">
                        <Badge className="bg-safari-gold text-safari-night font-bold px-4 py-1.5 rounded-full shadow-lg">
                          {post.category}
                        </Badge>
                      </div>
                    </div>

                    {/* Content */}
                    <CardContent className="p-8 flex-1 flex flex-col">
                      {/* Meta */}
                      <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
                        <span className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-safari-gold" />
                          {post.date}
                        </span>
                        <span className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-safari-gold" />
                          {post.readTime}
                        </span>
                      </div>

                      {/* Title */}
                      <h2 className="text-2xl font-bold mb-4 group-hover:text-safari-gold transition-colors line-clamp-2 leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        {post.title}
                      </h2>

                      {/* Excerpt */}
                      <p className="text-muted-foreground leading-relaxed mb-8 line-clamp-3">
                        {post.excerpt}
                      </p>

                      {/* Author & Read More */}
                      <div className="flex items-center justify-between pt-6 border-t border-border/50 mt-auto">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-safari-gold/10 flex items-center justify-center">
                            <User className="w-5 h-5 text-safari-gold" />
                          </div>
                          <span className="text-sm font-bold text-safari-night">{post.author}</span>
                        </div>
                        <Link to={`/blog/${post.slug}`}>
                          <Button variant="ghost" className="text-safari-gold hover:text-safari-amber hover:bg-transparent p-0 font-bold group/btn">
                            Read More
                            <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-24 bg-safari-night relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        </div>
        
        <div className="container-wide mx-auto px-4 md:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="w-20 h-20 bg-safari-gold/20 rounded-full flex items-center justify-center mx-auto mb-8">
              <Mail className="w-10 h-10 text-safari-gold" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Stay <span className="text-safari-gold italic">Updated</span>
            </h2>
            <p className="text-white/70 text-xl mb-12 leading-relaxed">
              Subscribe to our newsletter for the latest travel tips, exclusive offers, and adventure inspiration delivered straight to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <Input 
                placeholder="Enter your email address" 
                className="flex-1 py-7 px-6 rounded-full bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-safari-gold/50" 
              />
              <Button className="bg-safari-gold hover:bg-safari-amber text-safari-night font-bold px-10 py-7 rounded-full shadow-xl hover:scale-105 transition-all duration-300">
                Subscribe
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
