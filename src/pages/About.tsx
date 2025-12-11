import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Check, Users, Award, Globe } from "lucide-react";
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
      <section className="relative pt-32 pb-20">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="About Us"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-safari-night/70" />
        </div>
        <div className="relative container-wide mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4">
              About Us
            </h1>
            <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              Your gateway to endless exploration in the heart of East Africa
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 -mt-16 relative z-10">
        <div className="container-wide mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-background rounded-xl p-8 shadow-elevated text-center"
              >
                <stat.icon className="w-10 h-10 text-primary mx-auto mb-4" />
                <p className="text-4xl font-bold text-foreground font-display mb-2">
                  {stat.value}
                </p>
                <p className="text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding">
        <div className="container-wide mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
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
                <p>
                  We don't just show you Tanzania; we invite you to feel it, taste it, 
                  and become part of its story.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src={serengetiImg}
                alt="Safari Experience"
                className="w-full h-96 object-cover rounded-2xl shadow-elevated"
              />
              <div className="absolute -bottom-6 -left-6 bg-safari-gold rounded-xl p-6 shadow-elevated">
                <p className="text-4xl font-bold text-safari-night font-display">15+</p>
                <p className="text-safari-night/80">Years of Excellence</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-muted/30">
        <div className="container-wide mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
              Our Values
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
                className="flex gap-4 p-6 bg-background rounded-xl shadow-soft"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-sunset flex items-center justify-center shrink-0">
                  <Check className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground">{value.description}</p>
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
