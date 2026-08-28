import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { HelpCircle, MessageCircle, Mail, Phone, Sparkles, Search, Calendar, Plane, Heart, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { useState } from "react";

// Category icons mapping
const categoryIcons: Record<string, React.ElementType> = {
  "Booking & Reservations": Calendar,
  "Safari Experience": Sparkles,
  "Zanzibar Excursions": Plane,
  "Health & Safety": Shield,
  "Practical Information": HelpCircle,
};

const FAQ = () => {
  const faqs = [
    {
      category: "Booking & Reservations",
      questions: [
        {
          q: "How far in advance should I book my safari?",
          a: "We recommend booking at least 3-6 months in advance, especially for peak season (July-October and December-February). For high-demand destinations like the Serengeti during the Great Migration, booking 6-12 months ahead is advisable."
        },
        {
          q: "What payment methods do you accept?",
          a: "We accept major credit cards (Visa, MasterCard, American Express), bank transfers, and PayPal. A 30% deposit is required to confirm your booking, with the balance due 60 days before departure."
        },
        {
          q: "What is your cancellation policy?",
          a: "Cancellations made 60+ days before departure receive a full refund minus a $100 admin fee. 30-59 days: 50% refund. Less than 30 days: No refund. We strongly recommend travel insurance."
        },
        {
          q: "Can I customize my safari itinerary?",
          a: "Absolutely! All our safaris can be customized to your preferences. Contact us with your interests, travel dates, and budget, and we'll create a personalized itinerary for you."
        },
      ]
    },
    {
      category: "Safari Experience",
      questions: [
        {
          q: "What is the best time to visit Tanzania for a safari?",
          a: "The dry season (June-October) offers the best wildlife viewing as animals gather around water sources. The Great Migration in Serengeti is spectacular from July-October. The green season (November-May) offers lush landscapes and fewer crowds."
        },
        {
          q: "What should I pack for a safari?",
          a: "Essential items include: neutral-colored clothing (khaki, olive, brown), comfortable walking shoes, sun hat, sunscreen, insect repellent, binoculars, camera with zoom lens, light jacket for early mornings, and any personal medications."
        },
        {
          q: "Is it safe to go on a safari?",
          a: "Yes, safaris are very safe when conducted with professional guides. Our guides are highly trained and experienced. You'll always be accompanied, and we follow strict safety protocols. Wildlife is observed from safe distances."
        },
        {
          q: "What type of accommodation is available?",
          a: "We offer various options from luxury lodges and tented camps to budget camping. Lodges offer hotel-like amenities, while tented camps provide an authentic bush experience with comfortable beds and en-suite facilities."
        },
      ]
    },
    {
      category: "Zanzibar Excursions",
      questions: [
        {
          q: "How do I get to Zanzibar from mainland Tanzania?",
          a: "You can fly directly to Zanzibar from Dar es Salaam (20 min), Arusha, or Kilimanjaro. Alternatively, take a ferry from Dar es Salaam (2 hours). We can arrange all transfers for you."
        },
        {
          q: "What activities are available in Zanzibar?",
          a: "Popular activities include: Stone Town cultural tours, spice farm visits, dolphin watching, snorkeling and diving, sunset dhow cruises, Prison Island trips, Jozani Forest visits, and beach relaxation."
        },
        {
          q: "Is Zanzibar suitable for families with children?",
          a: "Yes! Zanzibar is family-friendly with many kid-appropriate activities like beach time, swimming with dolphins, visiting the turtle sanctuary, and exploring spice farms. We can customize family-friendly itineraries."
        },
      ]
    },
    {
      category: "Health & Safety",
      questions: [
        {
          q: "Do I need vaccinations to visit Tanzania?",
          a: "Yellow fever vaccination is required if arriving from an endemic country. Recommended vaccines include Hepatitis A & B, Typhoid, and Tetanus. Malaria prophylaxis is strongly advised. Consult your doctor 6-8 weeks before travel."
        },
        {
          q: "Is travel insurance required?",
          a: "Yes, comprehensive travel insurance is mandatory for all our tours. It should cover medical evacuation, trip cancellation, and personal belongings. We can recommend trusted insurance providers."
        },
        {
          q: "What about COVID-19 requirements?",
          a: "Requirements change frequently. Currently, Tanzania has minimal restrictions. Check the latest guidelines before travel. We'll provide updated information during the booking process."
        },
      ]
    },
    {
      category: "Practical Information",
      questions: [
        {
          q: "What currency is used in Tanzania?",
          a: "The Tanzanian Shilling (TZS) is the local currency, but US Dollars are widely accepted. Credit cards work in major hotels and lodges. ATMs are available in cities. Bring some cash for tips and small purchases."
        },
        {
          q: "Do I need a visa to visit Tanzania?",
          a: "Most nationalities need a visa. Tourist visas can be obtained online (e-visa) or on arrival at major entry points. Single-entry visas cost $50 USD. Check requirements for your nationality."
        },
        {
          q: "What language is spoken in Tanzania?",
          a: "Swahili and English are the official languages. English is widely spoken in tourist areas. Our guides speak fluent English. Learning a few Swahili phrases like 'Jambo' (Hello) and 'Asante' (Thank you) is appreciated!"
        },
        {
          q: "How much should I budget for tips?",
          a: "Tipping is customary in Tanzania. Guidelines: Safari guides $20-25/day, camp/lodge staff $10-15/day shared, hotel porters $1-2/bag. Tips are pooled and shared among staff at most establishments."
        },
      ]
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO 
        title="Tanzania Safari FAQ - Common Questions Answered"
        description="Find answers to frequently asked questions about Tanzania safaris and Zanzibar tours. Booking policies, visa requirements, best time to visit, what to pack, and more."
        keywords="Tanzania safari FAQ, safari questions, Tanzania visa, best time safari, what to pack safari, safari cancellation policy"
        url="/faq"
      />
      <Navbar />
      
      {/* Premium Hero Section */}
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
              <HelpCircle className="w-4 h-4" /> Help Center
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Frequently Asked <span className="text-safari-gold italic">Questions</span>
            </h1>
            <p className="text-white/80 text-xl md:text-2xl leading-relaxed max-w-2xl mx-auto">
              Everything you need to know about your upcoming African adventure, from booking to the bush.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Content - Premium Design */}
      <section className="py-24 flex-1 bg-background relative">
        <div className="container-wide mx-auto px-4 md:px-8 max-w-4xl relative z-10">
          {faqs.map((category, categoryIndex) => {
            const CategoryIcon = categoryIcons[category.category] || HelpCircle;
            return (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: categoryIndex * 0.1 }}
                className="mb-20 last:mb-0"
              >
                <div className="flex items-center gap-6 mb-10">
                  <div className="w-16 h-16 rounded-2xl bg-safari-gold/10 flex items-center justify-center shrink-0">
                    <CategoryIcon className="w-8 h-8 text-safari-gold" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-safari-night" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {category.category}
                  </h2>
                </div>
                <Accordion type="single" collapsible className="space-y-6">
                  {category.questions.map((faq, index) => (
                    <AccordionItem 
                      key={index} 
                      value={`${categoryIndex}-${index}`}
                      className="border border-border/40 rounded-[2rem] px-8 bg-white shadow-xl hover:shadow-2xl transition-all duration-500 data-[state=open]:border-safari-gold/30 data-[state=open]:shadow-safari-gold/5 overflow-hidden"
                    >
                      <AccordionTrigger className="text-left font-bold hover:text-safari-gold transition-colors py-7 text-lg md:text-xl no-underline hover:no-underline">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed pb-8 text-lg">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
            );
          })}
        </div>
        
        {/* Decorative background elements */}
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-safari-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-safari-amber/5 rounded-full blur-3xl" />
      </section>

      {/* Contact CTA */}
      <section className="py-24 bg-safari-night relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        </div>
        
        <div className="container-wide mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 bg-safari-gold/20 rounded-full flex items-center justify-center mx-auto mb-8">
              <MessageCircle className="w-10 h-10 text-safari-gold" />
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Still Have <span className="text-safari-gold italic">Questions?</span>
            </h2>
            <p className="text-white/70 text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
              Our travel experts are available 24/7 to help you plan your perfect African adventure. 
              No question is too small for our team.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/contact">
                <Button size="lg" className="bg-safari-gold hover:bg-safari-amber text-safari-night px-10 py-8 rounded-full text-lg font-bold shadow-xl hover:scale-105 transition-all duration-300">
                  <Mail className="w-5 h-5 mr-3" /> Send an Inquiry
                </Button>
              </Link>
              <a href="tel:+255123456789">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-10 py-8 rounded-full text-lg font-bold backdrop-blur-sm">
                  <Phone className="w-5 h-5 mr-3" /> Call Our Experts
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FAQ;
