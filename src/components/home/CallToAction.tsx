import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Phone, ArrowRight, MessageSquare, Clock, CheckCircle2 } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export const CallToAction = () => {
  const navigate = useNavigate();
  const { data: settings } = useSiteSettings();

  const phone = settings?.general?.phone || "+255 758 241 294";
  const whatsapp = settings?.general?.whatsapp || "255758241294";

  const cta = settings?.callToAction;
  const badgeText = cta?.badgeText || "Quick Response Within 2 Hours";
  const heading = cta?.heading || "Ready to Start Your African Adventure?";
  const body =
    cta?.body ||
    "Whether you want a private Serengeti migration safari, a Kilimanjaro summit expedition, or a relaxing Zanzibar beach holiday, our local travel experts are ready to craft your personalized quote.";
  const primaryButtonText = cta?.primaryButtonText || "Plan My Custom Trip";
  const whatsappMessage =
    cta?.whatsappMessage || "Hello! I'd like to plan a safari tour.";
  const valueBadges =
    cta?.valueBadges && cta.valueBadges.length > 0
      ? cta.valueBadges
      : [
          "Free Itinerary Consultation",
          "Best Price Guarantee",
          "Direct Local Booking",
        ];

  return (
    <section className="py-16 md:py-24 bg-slate-900 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 text-amber-400 rounded-full text-sm font-medium mb-6">
          <Clock className="w-4 h-4" />
          <span>{badgeText}</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display tracking-tight mb-4">
          {heading}
        </h2>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
          {body}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <Button
            onClick={() => navigate("/plan-my-trip")}
            className="w-full sm:w-auto h-12 px-8 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm sm:text-base rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <span>{primaryButtonText}</span>
            <ArrowRight className="w-4 h-4" />
          </Button>

          <Button
            onClick={() =>
              window.open(
                `https://wa.me/${whatsapp.replace(/\+/g, "")}?text=${encodeURIComponent(whatsappMessage)}`,
                "_blank"
              )
            }
            variant="outline"
            className="w-full sm:w-auto h-12 px-7 border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-white hover:text-amber-400 font-semibold text-sm sm:text-base rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>Chat on WhatsApp</span>
          </Button>

          <a
            href={`tel:${phone.replace(/\s/g, "")}`}
            className="w-full sm:w-auto h-12 px-6 border border-slate-700 bg-transparent hover:bg-white/5 text-slate-200 hover:text-white font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <Phone className="w-4 h-4 text-amber-400" />
            <span>Call {phone}</span>
          </a>
        </div>

        {/* Value badges */}
        <div className="flex flex-wrap justify-center gap-4 mt-10 pt-8 border-t border-slate-700/50">
          {valueBadges.map((badge, index) => (
            <div
              key={index}
              className="inline-flex items-center gap-2 text-sm text-slate-300"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{badge}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
