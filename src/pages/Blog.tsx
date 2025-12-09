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
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-primary/10 via-background to-safari-gold/5">
        <div className="container-wide mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="w-10 h-px bg-safari-gold" />
              <span className="text-safari-gold text-sm font-semibold uppercase tracking-[0.2em]">
                Our Blog
              </span>
              <span className="w-10 h-px bg-safari-gold" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-6">
              Travel <span className="text-gradient-gold">Stories & Tips</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Expert travel advice, destination guides, and inspiration for your next African adventure.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="py-8 border-b border-border">
        <div className="container-wide mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    activeCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground hover:bg-primary/10"
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
      <section className="py-16 md:py-24">
        <div className="container-wide mx-auto px-4 md:px-8">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No articles found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <Card className="safari-card hover-lift h-full overflow-hidden">
                    {/* Image */}
                    <div className="relative h-56 overflow-hidden img-zoom">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-safari-night/60 via-transparent to-transparent" />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-background/95 text-foreground backdrop-blur-sm">
                          <Tag className="w-3 h-3 mr-1" />
                          {post.category}
                        </Badge>
                      </div>
                    </div>

                    {/* Content */}
                    <CardContent className="p-6">
                      {/* Meta */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {post.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {post.readTime}
                        </span>
                      </div>

                      {/* Title */}
                      <h2 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h2>

                      {/* Excerpt */}
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>

                      {/* Author & Read More */}
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="w-4 h-4 text-primary" />
                          </div>
                          <span className="text-sm font-medium">{post.author}</span>
                        </div>
                        <Button variant="ghost" size="sm" className="text-primary">
                          Read More
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
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
      <section className="py-16 bg-gradient-to-br from-primary/10 to-safari-gold/10">
        <div className="container-wide mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="text-3xl font-semibold mb-4">Stay Updated</h2>
            <p className="text-muted-foreground mb-8">
              Subscribe to our newsletter for the latest travel tips, exclusive offers, and adventure inspiration.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input placeholder="Enter your email" className="flex-1" />
              <Button className="bg-gradient-to-r from-safari-gold to-safari-amber text-safari-night font-bold">
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
