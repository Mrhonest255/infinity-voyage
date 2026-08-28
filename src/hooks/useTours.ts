import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface TourItem {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  featured_image: string | null;
  category: string;
  price: number | null;
  currency: string | null;
  duration: string | null;
  is_featured: boolean | null;
  is_published?: boolean | null;
  highlights: string[] | null;
  included: string[] | null;
  created_at?: string;
}

export const useTours = (options?: { isFeaturedOnly?: boolean; limit?: number }) => {
  return useQuery({
    queryKey: ["tours", options],
    queryFn: async () => {
      let query = supabase
        .from("tours")
        .select("id, title, slug, short_description, featured_image, category, price, currency, duration, is_featured, is_published, highlights, included, created_at")
        .eq("is_published", true)
        .order("is_featured", { ascending: false })
        .order("created_at", { ascending: false });

      if (options?.isFeaturedOnly) {
        query = query.eq("is_featured", true);
      }

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as TourItem[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
};
