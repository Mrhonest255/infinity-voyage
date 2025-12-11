import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Check, Users, Award, Globe, Sparkles, Heart, Compass, MapPin } from "lucide-react";
import { SEO } from "@/components/SEO";

import heroImage from "@/assets/hero-safari.jpg";
import serengetiImg from "@/assets/serengeti.jpg";

const stats = [
  { icon: Users, value: "5000+", label: "Happy Travelers" },
  { icon: Award, value: "15+", label: "Years Experience" },
  { icon: Globe, value: "50+", label: "Destinations" },
];

const values = [
  {
    title: "Authentic Experiences",
    description: "We go beyond typical tourist routes to show you the real Tanzania, from remote villages to hidden wildlife gems.",
  },
  {
    title: "Sustainable Tourism",
    description: "We partner with local communities and conservation projects to ensure our tours benefit both wildlife and people.",
  },
  {
    title: "Expert Local Guides",
    description: "Our guides are passionate Tanzanians with deep knowledge of wildlife, culture, and the land.",
  },
  {
    title: "Personalized Service",
    description: "No two travelers are alike. We customize every itinerary to match your interests, pace, and dreams.",
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="About Us - Tanzania Safari & Zanzibar Tour Experts"
        description="Infinity Voyage Tours & Safaris - Your trusted Tanzania tour operator since 2015. 5000+ happy travelers, expert local guides, sustainable tourism practices. Discover why we're the best choice for your African adventure."
        keywords="about Infinity Voyage, Tanzania tour operator, local safari guides, sustainable tourism Tanzania, experienced safari company"
        url="/about"
      />
      <Navbar />
      
      {/* Hero */}
      <section className="relative pt-32 pb-24 min-h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="About Us"
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-safari-night/80 via-safari-night/60 to-safari-night/90" />
          {/* Decorative overlay pattern */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>
        <div className="relative container-wide mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/90 px-5 py-2 rounded-full text-sm font-medium mb-6 border border-white/10"
            >
              <Sparkles className="w-4 h-4 text-safari-gold" />
              Since 2009
            </motion.div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Our <span className="text-gradient-gold">Story</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed font-light">
              Your gateway to endless exploration in the heart of East Africa
            </p>
          </motion.div>
        </div>
        {/* Decorative floating elements */}
        <motion.div 
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 left-10 w-20 h-20 rounded-full bg-safari-gold/10 blur-xl hidden lg:block" 
        />
        <motion.div 
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-40 right-20 w-32 h-32 rounded-full bg-safari-amber/10 blur-2xl hidden lg:block" 
        />
      </section>

      {/* Stats */}
      <section className="py-16 -mt-20 relative z-10">
        <div className="container-wide mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="bg-background/95 backdrop-blur-sm rounded-2xl p-8 shadow-luxury border border-border/50 text-center hover:shadow-elevated transition-all duration-500 group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-safari-gold/20 to-safari-amber/10 mb-4 group-hover:scale-110 transition-transform duration-500">
                  <stat.icon className="w-8 h-8 text-safari-gold" />
                </div>
                <p className="text-4xl md:text-5xl font-bold text-foreground mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {stat.value}
                </p>
                <p className="text-muted-foreground font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding">
        <div className="container-wide mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center gap-2 bg-safari-gold/10 text-safari-gold px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <Heart className="w-4 h-4" />
                Our Journey
              </div>
              <h2 className="text-4xl md:text-5xl font-semibold text-foreground mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Crafting <span className="text-gradient-gold">Unforgettable</span> Adventures
              </h2>
              <div className="space-y-5 text-muted-foreground leading-relaxed text-lg">
                <p>
                  Founded in 2009 by a group of passionate Tanzanian travel enthusiasts, 
                  Infinity Voyage Tours & Safaris was born from a simple belief: everyone 
                  deserves to experience the magic of Africa.
                </p>
                <p>
                  What started as a small operation with just two Land Cruisers has grown 
                  into one of Tanzania's most trusted tour operators, serving thousands 
                  of travelers from around the globe.
                </p>
                <p>
                  Our team of over 50 dedicated professionals—from expert guides to 
                  logistics coordinators—works tirelessly to ensure every journey with 
                  us becomes a cherished memory.
                </p>
                <p className="font-medium text-foreground">
                  We don't just show you Tanzania; we invite you to feel it, taste it, 
                  and become part of its story.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="relative">
                <img
                  src={serengetiImg}
                  alt="Safari Experience"
                  className="w-full h-[500px] object-cover rounded-3xl shadow-luxury"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-safari-night/30 to-transparent" />
              </div>
              {/* Floating badge */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="absolute -bottom-8 -left-8 bg-gradient-to-br from-safari-gold to-safari-amber rounded-2xl p-6 shadow-luxury"
              >
                <p className="text-5xl font-bold text-safari-night" style={{ fontFamily: "'Cormorant Garamond', serif" }}>15+</p>
                <p className="text-safari-night/80 font-medium">Years of Excellence</p>
              </motion.div>
              {/* Decorative element */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-safari-gold/10 rounded-full blur-2xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-safari-gold/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-safari-amber/5 rounded-full blur-3xl" />
        </div>
        
        <div className="container-wide mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-safari-gold/10 text-safari-gold px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Compass className="w-4 h-4" />
              What We Stand For
            </div>
            <h2 className="text-4xl md:text-5xl font-semibold text-foreground mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Our <span className="text-gradient-gold">Values</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The principles that guide every safari we plan and every experience we create
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group flex gap-5 p-8 bg-background/80 backdrop-blur-sm rounded-2xl shadow-soft border border-border/50 hover:shadow-luxury hover:border-safari-gold/20 transition-all duration-500"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-safari-gold to-safari-amber flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500">
                  <Check className="w-7 h-7 text-safari-night" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
