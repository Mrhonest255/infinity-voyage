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
      <section className="relative pt-32 pb-24 min-h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="About Us"
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-safari-night/90 via-safari-night/70 to-background" />
          {/* Decorative overlay pattern */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>
        <div className="relative container-wide mx-auto px-4 md:px-8">
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
              className="inline-flex items-center gap-2 bg-safari-gold/20 backdrop-blur-md text-safari-gold px-6 py-2 rounded-full text-sm font-bold mb-8 border border-safari-gold/30 uppercase tracking-widest"
            >
              <Sparkles className="w-4 h-4" />
              Since 2009
            </motion.div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Our <span className="text-safari-gold italic">Story</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed font-light">
              Your gateway to endless exploration in the heart of East Africa. We craft journeys that transcend the ordinary.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 -mt-16 relative z-10">
        <div className="container-wide mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="bg-white/95 backdrop-blur-md rounded-3xl p-10 shadow-2xl border border-border/50 text-center hover:shadow-safari-gold/10 transition-all duration-500 group"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-safari-gold/20 to-safari-amber/10 mb-6 group-hover:scale-110 transition-transform duration-500">
                  <stat.icon className="w-10 h-10 text-safari-gold" />
                </div>
                <p className="text-5xl md:text-6xl font-bold text-safari-night mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {stat.value}
                </p>
                <p className="text-muted-foreground font-bold uppercase tracking-widest text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 overflow-hidden">
        <div className="container-wide mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 bg-safari-gold/10 text-safari-gold px-5 py-2 rounded-full text-sm font-bold mb-8 uppercase tracking-widest">
                <Heart className="w-4 h-4" />
                Our Journey
              </div>
              <h2 className="text-5xl md:text-6xl font-bold text-safari-night mb-10 leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Crafting <span className="text-safari-gold italic">Unforgettable</span> Adventures
              </h2>
              <div className="space-y-8 text-muted-foreground leading-relaxed text-lg">
                <p>
                  Founded in 2009 by a group of passionate Tanzanian travel enthusiasts, 
                  Infinity Voyage Tours & Safaris was born from a simple belief: everyone 
                  deserves to experience the magic of Africa in its purest form.
                </p>
                <p>
                  What started as a small operation with just two Land Cruisers has grown 
                  into one of Tanzania's most trusted tour operators, serving thousands 
                  of travelers from around the globe while maintaining our boutique, personal touch.
                </p>
                <p>
                  Our team of over 50 dedicated professionals—from expert guides to 
                  logistics coordinators—works tirelessly to ensure every journey with 
                  us becomes a cherished memory that lasts a lifetime.
                </p>
                <div className="pt-6 border-t border-border/50">
                  <p className="font-display text-2xl text-safari-night font-bold italic">
                    "We don't just show you Tanzania; we invite you to feel it, taste it, 
                    and become part of its eternal story."
                  </p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative z-10">
                <img
                  src={serengetiImg}
                  alt="Safari Experience"
                  className="w-full h-[600px] object-cover rounded-[2rem] shadow-2xl"
                />
                <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-t from-safari-night/40 to-transparent" />
              </div>
              
              {/* Floating badge */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, type: "spring" }}
                className="absolute -bottom-10 -left-10 z-20 bg-safari-gold p-10 rounded-3xl shadow-2xl"
              >
                <p className="text-6xl font-bold text-safari-night leading-none" style={{ fontFamily: "'Cormorant Garamond', serif" }}>15+</p>
                <p className="text-safari-night/80 font-bold uppercase tracking-widest text-xs mt-2">Years of Excellence</p>
              </motion.div>
              
              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-safari-gold/10 rounded-full blur-3xl" />
              <div className="absolute top-1/2 -right-4 w-24 h-24 border-4 border-safari-gold/20 rounded-full" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-muted/30 relative overflow-hidden">
        <div className="container-wide mx-auto px-4 md:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 bg-safari-gold/10 text-safari-gold px-5 py-2 rounded-full text-sm font-bold mb-6 uppercase tracking-widest">
              <Compass className="w-4 h-4" />
              What We Stand For
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-safari-night mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Our <span className="text-safari-gold italic">Values</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              The principles that guide every safari we plan and every experience we create for our guests.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-10">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group flex flex-col sm:flex-row gap-8 p-10 bg-white rounded-[2rem] shadow-xl border border-border/50 hover:border-safari-gold/30 hover:shadow-2xl transition-all duration-500"
              >
                <div className="w-20 h-20 rounded-2xl bg-safari-gold/10 flex items-center justify-center shrink-0 group-hover:bg-safari-gold group-hover:text-safari-night transition-all duration-500">
                  <Check className="w-10 h-10 text-safari-gold group-hover:text-inherit" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-safari-night mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-lg">{value.description}</p>
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
