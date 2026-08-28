import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Phone, ArrowRight, MessageSquare, Clock, CheckCircle2 } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export const CallToAction = () => {
  const navigate = useNavigate();
  const { data: settings } = useSiteSettings();
  const phone = settings?.general?.phone || "+255 758 241 294";
  const whatsapp = settings?.general?.whatsapp || "255758241294";

  return (
    <section className="py-16 md:py-20 bg-slate-900 text-white relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-6">
          <Clock className="w-3.5 h-3.5" />
          <span>Quick Response Within 2 Hours</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display tracking-tight text-white mb-6 max-w-3xl mx-auto leading-tight">
          Ready to Start Your African Adventure?
        </h2>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed font-normal">
          Whether you want a private Serengeti migration safari, a Kilimanjaro summit expedition, or a relaxing Zanzibar beach holiday, our local travel experts are ready to craft your personalized quote.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <Button
            onClick={() => navigate("/plan-my-trip")}
            className="w-full sm:w-auto h-12 px-8 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm sm:text-base rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <span>Plan My Custom Trip</span>
            <ArrowRight className="w-4 h-4" />
          </Button>

          <Button
            onClick={() => window.open(`https://wa.me/${whatsapp.replace(/\+/g, "")}?text=Hello! I'd like to plan a safari tour.`, "_blank")}
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
        <div className="flex flex-wrap items-center justify-center gap-6 pt-8 border-t border-slate-800 text-xs sm:text-sm text-slate-400 font-medium">
          <div className="flex items-center gap-1.5 text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            <span>Free Itinerary Consultation</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            <span>Best Price Guarantee</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            <span>Direct Local Booking</span>
          </div>
        </div>
      </div>
    </section>
  );
};
