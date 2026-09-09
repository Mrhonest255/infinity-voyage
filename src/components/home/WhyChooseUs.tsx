import {
  ShieldCheck,
  MapPin,
  Compass,
  Headphones,
  Globe,
  Heart,
  Zap,
  Users,
  Star,
  Phone,
  Clock,
  Award,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const iconMap: Record<string, LucideIcon> = {
  ShieldCheck,
  MapPin,
  Compass,
  Headphones,
  Globe,
  Heart,
  Zap,
  Users,
  Star,
  Phone,
  Clock,
  Award,
  CheckCircle2,
};

const defaultFeatures = [
  {
    icon: "ShieldCheck",
    title: "Safe & Fully Certified",
    description:
      "Licensed tour operator in Tanzania and Zanzibar. Secure booking, insured safari vehicles, and top safety standards.",
  },
  {
    icon: "MapPin",
    title: "Native Expert Guides",
    description:
      "Born and raised in Tanzania. Our guides spot elusive wildlife and share authentic cultural insights throughout your trip.",
  },
  {
    icon: "Compass",
    title: "Tailor-Made Itineraries",
    description:
      "From luxury honeymoon escapes to family safaris and budget climbs, every detail is custom-built to match your preferences.",
  },
  {
    icon: "Headphones",
    title: "24/7 Dedicated Support",
    description:
      "Personal safari concierge from your first inquiry to your flight back home. Direct WhatsApp & phone assistance anytime.",
  },
];

export const WhyChooseUs = () => {
  const { data: settings } = useSiteSettings();

  const whyChooseUs = settings?.whyChooseUs;
  const eyebrow = whyChooseUs?.eyebrow || "The Infinity Difference";
  const heading = whyChooseUs?.heading || "Why Travel with Infinity Voyage?";
  const description =
    whyChooseUs?.description ||
    "We deliver seamless, memorable adventures across Tanzania's national parks, mountains, and Indian Ocean islands.";
  const cards =
    whyChooseUs?.cards && whyChooseUs.cards.length > 0
      ? whyChooseUs.cards
      : defaultFeatures;

  return (
    <section className="py-16 md:py-24 bg-slate-50 border-t border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-6 h-0.5 bg-amber-600 rounded-full" />
            <span className="text-amber-700 text-xs sm:text-sm font-bold uppercase tracking-wider">
              {eyebrow}
            </span>
            <span className="w-6 h-0.5 bg-amber-600 rounded-full" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 font-display tracking-tight mb-3">
            {heading}
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            {description}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {cards.map((card, idx) => {
            const IconComponent = (card.icon && iconMap[card.icon]) || Compass;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-sm hover:shadow-lg transition-shadow duration-300 text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto mb-5">
                  <IconComponent className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 font-display mb-2">
                  {card.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
