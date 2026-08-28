import { ShieldCheck, MapPin, Compass, Headphones } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Safe & Fully Certified",
    description:
      "Licensed tour operator in Tanzania and Zanzibar. Secure booking, insured safari vehicles, and top safety standards.",
  },
  {
    icon: MapPin,
    title: "Native Expert Guides",
    description:
      "Born and raised in Tanzania. Our guides spot elusive wildlife and share authentic cultural insights throughout your trip.",
  },
  {
    icon: Compass,
    title: "Tailor-Made Itineraries",
    description:
      "From luxury honeymoon escapes to family safaris and budget climbs, every detail is custom-built to match your preferences.",
  },
  {
    icon: Headphones,
    title: "24/7 Dedicated Support",
    description:
      "Personal safari concierge from your first inquiry to your flight back home. Direct WhatsApp & phone assistance anytime.",
  },
];

export const WhyChooseUs = () => {
  return (
    <section className="py-16 md:py-24 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-6 h-0.5 bg-amber-600 rounded-full" />
            <span className="text-amber-700 text-xs sm:text-sm font-bold uppercase tracking-wider">
              The Infinity Difference
            </span>
            <span className="w-6 h-0.5 bg-amber-600 rounded-full" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 font-display tracking-tight mb-4">
            Why Travel with Infinity Voyage?
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            We deliver seamless, memorable adventures across Tanzania's national parks, mountains, and Indian Ocean islands.
          </p>
        </div>

        {/* 4 Feature Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col items-start"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-100/80 text-amber-700 flex items-center justify-center mb-5 flex-shrink-0">
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 font-display">
                {item.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
