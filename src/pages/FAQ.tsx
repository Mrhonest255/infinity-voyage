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
import { HelpCircle, MessageCircle, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";

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
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 bg-gradient-to-br from-safari-night via-safari-night/95 to-safari-brown/20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-10 w-72 h-72 bg-safari-gold/10 rounded-full blur-3xl"></div>
        </div>
        <div className="container-wide mx-auto px-4 md:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge className="bg-safari-gold/20 text-safari-gold border-safari-gold/30 mb-4">
              <HelpCircle className="w-3 h-3 mr-1" /> Help Center
            </Badge>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              Frequently Asked <span className="text-safari-gold">Questions</span>
            </h1>
            <p className="text-primary-foreground/80 text-lg md:text-xl">
              Find answers to common questions about our safaris, Zanzibar excursions, 
              booking process, and travel tips.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 flex-1">
        <div className="container-wide mx-auto px-4 md:px-8 max-w-4xl">
          {faqs.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.1 }}
              className="mb-12"
            >
              <h2 className="font-display text-2xl font-bold mb-6 text-foreground border-b border-border pb-3">
                {category.category}
              </h2>
              <Accordion type="single" collapsible className="space-y-4">
                {category.questions.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`${categoryIndex}-${index}`}
                    className="border border-border rounded-xl px-6 data-[state=open]:bg-muted/30"
                  >
                    <AccordionTrigger className="text-left font-semibold hover:text-safari-gold transition-colors">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-muted/30">
        <div className="container-wide mx-auto px-4 md:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <MessageCircle className="w-12 h-12 mx-auto text-safari-gold mb-4" />
            <h2 className="font-display text-3xl font-bold mb-4">
              Still Have Questions?
            </h2>
            <p className="text-muted-foreground mb-8">
              Our friendly team is here to help you plan your perfect African adventure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button size="lg" className="bg-safari-gold hover:bg-safari-amber text-safari-night">
                  <Mail className="w-4 h-4 mr-2" /> Contact Us
                </Button>
              </Link>
              <a href="tel:+255123456789">
                <Button size="lg" variant="outline">
                  <Phone className="w-4 h-4 mr-2" /> Call Us
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
