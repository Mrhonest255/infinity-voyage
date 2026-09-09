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
  showStats: boolean;
  showCallToAction: boolean;
}

export interface AboutSettings {
  heroTitle: string;
  heroSubtitle: string;
  foundedYear: string;
  story: string;
  mission: string;
  stats: {
    travelers: string;
    experience: string;
    destinations: string;
  };
  values: Array<{ title: string; description: string }>;
}

export interface HeroSettings {
  trustBadges: Array<{ icon: string; text: string }>;
  topDestinations: string[];
  searchPlaceholder: string;
  badgeText: string;
}

export interface WhyChooseUsCard {
  icon: string;
  title: string;
  description: string;
}

export interface WhyChooseUsSettings {
  eyebrow: string;
  heading: string;
  description: string;
  cards: WhyChooseUsCard[];
}

export interface TestimonialItem {
  id: number;
  name: string;
  location: string;
  initials: string;
  tourType: string;
  text: string;
  rating: number;
  date: string;
}

export interface TestimonialsSettings {
  eyebrow: string;
  heading: string;
  description: string;
  reviews: TestimonialItem[];
}

export interface CallToActionSettings {
  badgeText: string;
  heading: string;
  body: string;
  primaryButtonText: string;
  whatsappMessage: string;
  valueBadges: string[];
}

export interface FooterSettings {
  companyBlurb: string;
  newsletterTitle: string;
  newsletterSubtitle: string;
  quickLinks: Array<{ label: string; href: string }>;
  destinationLinks: Array<{ label: string; href: string }>;
}

export interface FAQItem {
  question?: string;
  q?: string;
  answer?: string;
  a?: string;
  category?: string;
}

export interface FAQCategoryItem {
  category: string;
  questions: Array<{
    q?: string;
    question?: string;
    a?: string;
    answer?: string;
  }>;
}

export interface FAQSettings {
  title?: string;
  subtitle?: string;
  items?: FAQItem[];
  categories?: FAQCategoryItem[];
}


export interface NavigationSettings {
  links: Array<{ label: string; href: string }>;
}

export interface SiteSettings {
  general: GeneralSettings | null;
  social: SocialSettings | null;
  homepage: HomepageSettings | null;
  about: AboutSettings | null;
  hero: HeroSettings | null;
  whyChooseUs: WhyChooseUsSettings | null;
  testimonials: TestimonialsSettings | null;
  callToAction: CallToActionSettings | null;
  footer: FooterSettings | null;
  faq: FAQSettings | null;
  navigation: NavigationSettings | null;
}

export const useSiteSettings = () => {
  return useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');

      if (error) throw error;

      const settings: SiteSettings = {
        general: null,
        social: null,
        homepage: null,
        about: null,
        hero: null,
        whyChooseUs: null,
        testimonials: null,
        callToAction: null,
        footer: null,
        faq: null,
        navigation: null,
      };

      data?.forEach((setting) => {
        const value = setting.value as Record<string, unknown>;
        switch (setting.key) {
          case 'general':
            settings.general = value as unknown as GeneralSettings;
            break;
          case 'social':
            settings.social = value as unknown as SocialSettings;
            break;
          case 'homepage':
            settings.homepage = value as unknown as HomepageSettings;
            break;
          case 'about':
            settings.about = value as unknown as AboutSettings;
            break;
          case 'hero':
            settings.hero = value as unknown as HeroSettings;
            break;
          case 'whyChooseUs':
            settings.whyChooseUs = value as unknown as WhyChooseUsSettings;
            break;
          case 'testimonials':
            settings.testimonials = value as unknown as TestimonialsSettings;
            break;
          case 'callToAction':
            settings.callToAction = value as unknown as CallToActionSettings;
            break;
          case 'footer':
            settings.footer = value as unknown as FooterSettings;
            break;
          case 'faq':
            settings.faq = value as unknown as FAQSettings;
            break;
          case 'navigation':
            settings.navigation = value as unknown as NavigationSettings;
            break;
        }
      });

      return settings;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export default useSiteSettings;