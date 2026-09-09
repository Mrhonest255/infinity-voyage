import { SEO, SEO_KEYWORDS } from "@/components/SEO";
import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/home/Hero";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { StatsCounter } from "@/components/home/StatsCounter";
import { Destinations } from "@/components/home/Destinations";
import { TourPackages } from "@/components/home/TourPackages";
import { Testimonials } from "@/components/home/Testimonials";
import { CallToAction } from "@/components/home/CallToAction";
import { Footer } from "@/components/layout/Footer";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const Index = () => {
  const { data: settings } = useSiteSettings();
  const homepage = settings?.homepage;

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
        {homepage?.showWhyChooseUs !== false && <WhyChooseUs />}
        {homepage?.showStats !== false && <StatsCounter />}
        {homepage?.showDestinations !== false && <Destinations />}
        {homepage?.showPackages !== false && <TourPackages />}
        {homepage?.showTestimonials !== false && <Testimonials />}
        {homepage?.showCallToAction !== false && <CallToAction />}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
