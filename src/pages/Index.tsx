import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { Destinations } from "@/components/home/Destinations";
import { TourPackages } from "@/components/home/TourPackages";
import { Testimonials } from "@/components/home/Testimonials";
import { CallToAction } from "@/components/home/CallToAction";
import { StatsCounter } from "@/components/home/StatsCounter";
import { SEO, SEO_KEYWORDS } from "@/components/SEO";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Best Tanzania Safari Tours & Zanzibar Holidays 2025"
        description="Book the best Tanzania safari tours with Infinity Voyage. Serengeti game drives, Ngorongoro Crater, Mount Kilimanjaro climbing, Zanzibar beach holidays & island excursions. Expert local guides, best prices guaranteed!"
        keywords={SEO_KEYWORDS.home}
        url="/"
      />
      <Navbar />
      <main>
        <Hero />
        <WhyChooseUs />
        <StatsCounter />
        <Destinations />
        <TourPackages />
        <Testimonials />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
