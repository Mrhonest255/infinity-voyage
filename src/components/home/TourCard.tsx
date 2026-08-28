import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, ArrowRight } from "lucide-react";
import { AddToCartButton } from "@/components/cart/Cart";
import { TourItem } from "@/hooks/useTours";

interface TourCardProps {
  tour: TourItem;
  placeholderImage?: string;
}

export const TourCard = ({ tour, placeholderImage }: TourCardProps) => {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      <div>
        <div className="relative h-56 sm:h-64 overflow-hidden bg-slate-100">
          <img
            src={tour.featured_image || placeholderImage || "/placeholder.svg"}
            alt={tour.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

          <div className="absolute top-3 left-3 flex gap-2">
            <Badge className="bg-slate-900/80 backdrop-blur-sm text-white border-0 text-xs">
              {tour.category}
            </Badge>
            {tour.is_featured && (
              <Badge className="bg-amber-500 text-slate-950 font-bold border-0 text-xs">
                Featured
              </Badge>
            )}
          </div>

          {tour.price && (
            <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-xl shadow text-right">
              <span className="block text-[9px] text-slate-500 font-bold uppercase">From</span>
              <span className="text-base font-bold text-slate-900 font-display">
                ${tour.price.toLocaleString()}
              </span>
            </div>
          )}
        </div>

        <div className="p-5">
          <div className="flex items-center gap-3 text-xs text-slate-500 mb-2 font-medium">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span>Tanzania</span>
            </span>
            {tour.duration && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>{tour.duration}</span>
              </span>
            )}
          </div>

          <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-700 transition-colors font-display mb-2 line-clamp-2">
            {tour.title}
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
            {tour.short_description || "Explore breathtaking national parks and pristine beaches."}
          </p>
        </div>
      </div>

      <div className="px-5 pb-5 pt-0 flex items-center justify-between border-t border-slate-100 pt-3">
        <AddToCartButton
          item={{
            id: tour.id,
            type: "tour",
            title: tour.title,
            image: tour.featured_image || undefined,
            price: tour.price || 0,
            duration: tour.duration || undefined,
          }}
          variant="icon"
        />

        <Link
          to={`/tour/${tour.slug}`}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-700 hover:text-amber-800 transition-colors"
        >
          <span>View Tour</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
