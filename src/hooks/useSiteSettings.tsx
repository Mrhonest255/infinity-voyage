import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface GeneralSettings {
  siteName: string;
  tagline: string;
  logo: string | null;
  favicon: string | null;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
}

export interface SocialSettings {
  facebook: string;
  instagram: string;
  twitter: string;
  youtube: string;
  tripadvisor: string;
  tiktok: string;
}

export interface HomepageSettings {
  heroTitle: string;
  heroSubtitle: string;
  heroVideo: string | null;
  showDestinations: boolean;
  showPackages: boolean;
  showTestimonials: boolean;
  showWhyChooseUs: boolean;
}

export const useSiteSettings = () => {
  return useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');
      
      if (error) throw error;
      
      const settings: {
        general: GeneralSettings | null;
        social: SocialSettings | null;
        homepage: HomepageSettings | null;
      } = {
        general: null,
        social: null,
        homepage: null,
      };
      
      data?.forEach((setting) => {
        const value = setting.value as Record<string, unknown>;
        if (setting.key === 'general') {
          settings.general = value as unknown as GeneralSettings;
        } else if (setting.key === 'social') {
          settings.social = value as unknown as SocialSettings;
        } else if (setting.key === 'homepage') {
          settings.homepage = value as unknown as HomepageSettings;
        }
      });
      
      return settings;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};

export default useSiteSettings;