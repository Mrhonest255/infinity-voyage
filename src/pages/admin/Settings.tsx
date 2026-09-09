import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import ImageUpload from '@/components/admin/ImageUpload';
import { Json } from '@/integrations/supabase/types';
import {
  Settings, Globe, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube,
  Home, Loader2, Save, Palette, Users, MessageSquare, Eye, Plus, Trash2, Star,
  ShieldCheck, Compass, Headphones, Award, CheckCircle2, Clock, Heart, Zap,
  Quote, ChevronUp, ChevronDown, FootprintsIcon
} from 'lucide-react';

// ── Interfaces ──────────────────────────────────────────
interface GeneralSettings {
  siteName: string; tagline: string; logo: string | null; favicon: string | null;
  email: string; phone: string; whatsapp: string; address: string;
}
interface SocialSettings {
  facebook: string; instagram: string; twitter: string; youtube: string; tripadvisor: string;
}
interface HomepageSettings {
  heroTitle: string; heroSubtitle: string; heroVideo: string | null;
  showDestinations: boolean; showPackages: boolean; showTestimonials: boolean;
  showWhyChooseUs: boolean; showStats: boolean; showCallToAction: boolean;
}
interface ThemeSettings { primaryColor: string; accentColor: string; backgroundColor: string; }
interface AboutSettings {
  heroTitle: string; heroSubtitle: string; foundedYear: string; story: string; mission: string;
  stats: { travelers: string; experience: string; destinations: string; };
  values: Array<{ title: string; description: string }>;
}
interface ContactSettings {
  heroTitle: string; heroSubtitle: string; officeHours: string; responseTime: string; mapEmbed: string;
}
interface HeroSettings {
  badgeText: string; searchPlaceholder: string;
  trustBadges: Array<{ icon: string; text: string }>;
  topDestinations: string[];
}
interface WhyChooseUsSettings {
  eyebrow: string; heading: string; description: string;
  cards: Array<{ icon: string; title: string; description: string }>;
}
interface TestimonialItem {
  id: number; name: string; location: string; initials: string;
  tourType: string; text: string; rating: number; date: string;
}
interface TestimonialsSettings {
  eyebrow: string; heading: string; description: string; reviews: TestimonialItem[];
}
interface CallToActionSettings {
  badgeText: string; heading: string; body: string;
  primaryButtonText: string; whatsappMessage: string; valueBadges: string[];
}
interface FooterSettings {
  companyBlurb: string; newsletterTitle: string; newsletterSubtitle: string;
  quickLinks: Array<{ label: string; href: string }>;
  destinationLinks: Array<{ label: string; href: string }>;
}

const ICON_OPTIONS = ['ShieldCheck','MapPin','Compass','Headphones','Globe','Heart','Zap','Users','Star','Phone','Clock','Award','CheckCircle2','Eye'];

// ── Defaults ──────────────────────────────────────────
const defaultHero: HeroSettings = {
  badgeText: 'Tanzania & Zanzibar Luxury Tour Operator',
  searchPlaceholder: 'Serengeti, Zanzibar, Kilimanjaro...',
  trustBadges: [
    { icon: 'ShieldCheck', text: '100% Tailor-Made' },
    { icon: 'Star', text: 'Top Rated Guides' },
    { icon: 'MapPin', text: 'Local Experts in Arusha & Zanzibar' },
  ],
  topDestinations: ['Serengeti National Park','Ngorongoro Crater','Zanzibar Island','Mount Kilimanjaro','Tarangire National Park','Stone Town'],
};
const defaultWhyChooseUs: WhyChooseUsSettings = {
  eyebrow: 'The Infinity Difference', heading: 'Why Travel with Infinity Voyage?',
  description: "We deliver seamless, memorable adventures across Tanzania's national parks, mountains, and Indian Ocean islands.",
  cards: [
    { icon: 'ShieldCheck', title: 'Safe & Fully Certified', description: 'Licensed tour operator in Tanzania and Zanzibar. Secure booking, insured safari vehicles, and top safety standards.' },
    { icon: 'MapPin', title: 'Native Expert Guides', description: 'Born and raised in Tanzania. Our guides spot elusive wildlife and share authentic cultural insights throughout your trip.' },
    { icon: 'Compass', title: 'Tailor-Made Itineraries', description: 'From luxury honeymoon escapes to family safaris and budget climbs, every detail is custom-built to match your preferences.' },
    { icon: 'Headphones', title: '24/7 Dedicated Support', description: 'Personal safari concierge from your first inquiry to your flight back home. Direct WhatsApp & phone assistance anytime.' },
  ],
};
const defaultTestimonials: TestimonialsSettings = {
  eyebrow: 'Traveler Reviews', heading: 'What Our Guests Say',
  description: 'Real feedback from international travelers who experienced Tanzania and Zanzibar with us.',
  reviews: [
    { id: 1, name: 'Sarah Jenkins', location: 'London, United Kingdom', initials: 'SJ', tourType: '7-Day Serengeti & Ngorongoro Safari', text: 'The Serengeti safari was absolutely magical. Our guide Dennis had eagle eyes and incredible wildlife knowledge.', rating: 5, date: 'July 2025' },
    { id: 2, name: 'Dr. Michael Chen', location: 'Singapore', initials: 'MC', tourType: 'Machame Route Kilimanjaro Climb', text: 'Summiting Uhuru Peak with the Infinity team was the best adventure of my life.', rating: 5, date: 'August 2025' },
  ],
};
const defaultCTA: CallToActionSettings = {
  badgeText: 'Quick Response Within 2 Hours', heading: 'Ready to Start Your African Adventure?',
  body: "Whether you want a private Serengeti migration safari, a Kilimanjaro summit expedition, or a relaxing Zanzibar beach holiday, our local travel experts are ready to craft your personalized quote.",
  primaryButtonText: 'Plan My Custom Trip', whatsappMessage: "Hello! I'd like to plan a safari tour.",
  valueBadges: ['Free Itinerary Consultation', 'Best Price Guarantee', 'Direct Local Booking'],
};
const defaultFooter: FooterSettings = {
  companyBlurb: 'Premier Tanzania & Zanzibar tour operator. We create unforgettable tailor-made wildlife safaris, Kilimanjaro climbs, and tropical beach getaways with licensed expert local guides.',
  newsletterTitle: 'Subscribe for Safari Travel Deals & Guides',
  newsletterSubtitle: 'Get seasonal migration updates, park fee tips, and exclusive package discounts.',
  quickLinks: [
    { label: 'Home', href: '/' },{ label: 'Safari Tours', href: '/safaris' },{ label: 'Zanzibar Excursions', href: '/zanzibar' },
    { label: 'Airport Transfers', href: '/transfers' },{ label: 'Safari Calculator', href: '/safari-calculator' },
    { label: 'Plan Custom Trip', href: '/plan-my-trip' },{ label: 'Photo Gallery', href: '/gallery' },
    { label: 'Track My Booking', href: '/track-booking' },{ label: 'About Infinity', href: '/about' },{ label: 'Contact Us', href: '/contact' },
  ],
  destinationLinks: [
    { label: 'Serengeti National Park', href: '/safaris?destination=Serengeti' },
    { label: 'Ngorongoro Crater', href: '/safaris?destination=Ngorongoro' },
    { label: 'Mount Kilimanjaro', href: '/safaris?destination=Kilimanjaro' },
    { label: 'Tarangire National Park', href: '/safaris?destination=Tarangire' },
    { label: 'Lake Manyara', href: '/safaris?destination=Manyara' },
  ],
};

// ── Live Preview Components ─────────────────────────────
const PreviewWhyChooseUs = ({ data }: { data: WhyChooseUsSettings }) => (
  <div className="bg-slate-50 rounded-xl p-4 border">
    <p className="text-amber-700 text-[10px] font-bold uppercase tracking-wider mb-1">{data.eyebrow}</p>
    <h3 className="text-sm font-bold text-slate-900 mb-1">{data.heading}</h3>
    <p className="text-[10px] text-slate-500 mb-3">{data.description}</p>
    <div className="grid grid-cols-2 gap-2">
      {data.cards.map((c, i) => (
        <div key={i} className="bg-white rounded-lg p-2 border text-center">
          <p className="text-[10px] font-bold text-slate-800">{c.title}</p>
          <p className="text-[8px] text-slate-500 line-clamp-2">{c.description}</p>
        </div>
      ))}
    </div>
  </div>
);

const PreviewTestimonial = ({ data }: { data: TestimonialsSettings }) => {
  const r = data.reviews[0];
  if (!r) return <div className="text-xs text-slate-400 italic p-4">No reviews added</div>;
  return (
    <div className="bg-slate-50 rounded-xl p-4 border">
      <p className="text-amber-700 text-[10px] font-bold uppercase tracking-wider mb-1">{data.eyebrow}</p>
      <h3 className="text-sm font-bold text-slate-900 mb-2">{data.heading}</h3>
      <div className="bg-white rounded-lg p-3 border">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center">{r.initials}</div>
          <div>
            <p className="text-xs font-bold text-slate-900">{r.name}</p>
            <p className="text-[9px] text-slate-500">{r.location}</p>
          </div>
        </div>
        <div className="flex gap-0.5 mb-1">{[...Array(r.rating)].map((_, i) => <Star key={i} className="w-3 h-3 fill-amber-500 text-amber-500" />)}</div>
        <p className="text-[10px] text-slate-700 line-clamp-3">"{r.text}"</p>
      </div>
      {data.reviews.length > 1 && <p className="text-[9px] text-slate-400 mt-2 text-center">+{data.reviews.length - 1} more reviews</p>}
    </div>
  );
};

const PreviewCTA = ({ data }: { data: CallToActionSettings }) => (
  <div className="bg-slate-900 rounded-xl p-4 text-white text-center">
    <span className="text-[9px] text-amber-400 font-medium">{data.badgeText}</span>
    <h3 className="text-sm font-bold mt-1 mb-1">{data.heading}</h3>
    <p className="text-[9px] text-slate-300 line-clamp-2 mb-2">{data.body}</p>
    <div className="bg-amber-500 text-slate-950 text-[10px] font-bold px-3 py-1.5 rounded-lg inline-block">{data.primaryButtonText}</div>
    <div className="flex flex-wrap gap-2 mt-2 justify-center">
      {data.valueBadges.map((b, i) => <span key={i} className="text-[8px] text-slate-400 flex items-center gap-0.5"><CheckCircle2 className="w-2 h-2 text-emerald-400" />{b}</span>)}
    </div>
  </div>
);

const PreviewFooter = ({ data }: { data: FooterSettings }) => (
  <div className="bg-slate-950 rounded-xl p-4 text-white">
    <p className="text-[10px] text-amber-500 font-bold mb-1">{data.newsletterTitle}</p>
    <p className="text-[8px] text-slate-400 mb-2">{data.newsletterSubtitle}</p>
    <div className="border-t border-slate-800 pt-2 mt-2">
      <p className="text-[9px] text-slate-300 line-clamp-2 mb-2">{data.companyBlurb}</p>
      <div className="flex gap-4">
        <div><p className="text-[8px] font-bold text-slate-400 mb-1">Quick Links</p>{data.quickLinks.slice(0,3).map((l,i) => <p key={i} className="text-[8px] text-slate-500">{l.label}</p>)}</div>
        <div><p className="text-[8px] font-bold text-slate-400 mb-1">Destinations</p>{data.destinationLinks.slice(0,3).map((l,i) => <p key={i} className="text-[8px] text-slate-500">{l.label}</p>)}</div>
      </div>
    </div>
  </div>
);

// ── Main Component ──────────────────────────────────────
const AdminSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [general, setGeneral] = useState<GeneralSettings>({ siteName: '', tagline: '', logo: null, favicon: null, email: '', phone: '', whatsapp: '', address: '' });
  const [social, setSocial] = useState<SocialSettings>({ facebook: '', instagram: '', twitter: '', youtube: '', tripadvisor: '' });
  const [homepage, setHomepage] = useState<HomepageSettings>({ heroTitle: '', heroSubtitle: '', heroVideo: null, showDestinations: true, showPackages: true, showTestimonials: true, showWhyChooseUs: true, showStats: true, showCallToAction: true });
  const [theme, setTheme] = useState<ThemeSettings>({ primaryColor: '#2563eb', accentColor: '#eab308', backgroundColor: '#ffffff' });
  const [about, setAbout] = useState<AboutSettings>({ heroTitle: 'Our Story', heroSubtitle: 'Your gateway to endless exploration in the heart of East Africa.', foundedYear: '2009', story: 'Founded in 2009 by a group of passionate Tanzanian travel enthusiasts, Infinity Voyage Tours & Safaris was born from a simple belief: everyone deserves to experience the magic of Africa in its purest form.', mission: "We don't just show you Tanzania; we invite you to feel it, taste it, and become part of its eternal story.", stats: { travelers: '5000+', experience: '15+', destinations: '50+' }, values: [{ title: 'Authentic Experiences', description: 'We go beyond typical tourist routes to show you the real Tanzania.' },{ title: 'Sustainable Tourism', description: 'We partner with local communities and conservation projects.' },{ title: 'Expert Local Guides', description: 'Our guides are passionate Tanzanians with deep knowledge.' },{ title: 'Personalized Service', description: 'We customize every itinerary to match your interests.' }] });
  const [contact, setContact] = useState<ContactSettings>({ heroTitle: "Let's Plan Your Adventure", heroSubtitle: "Have questions? We're here to help create your perfect African experience", officeHours: 'Mon-Sat: 8:00 AM - 6:00 PM (EAT)', responseTime: '24 hours', mapEmbed: '' });
  const [hero, setHero] = useState<HeroSettings>(defaultHero);
  const [whyChooseUs, setWhyChooseUs] = useState<WhyChooseUsSettings>(defaultWhyChooseUs);
  const [testimonials, setTestimonials] = useState<TestimonialsSettings>(defaultTestimonials);
  const [callToAction, setCallToAction] = useState<CallToActionSettings>(defaultCTA);
  const [footer, setFooter] = useState<FooterSettings>(defaultFooter);

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase.from('site_settings').select('*');
      if (error) throw error;
      data?.forEach((setting) => {
        const v = setting.value as Record<string, unknown>;
        switch (setting.key) {
          case 'general': setGeneral(v as unknown as GeneralSettings); break;
          case 'social': setSocial(v as unknown as SocialSettings); break;
          case 'homepage': setHomepage(v as unknown as HomepageSettings); break;
          case 'theme': setTheme(v as unknown as ThemeSettings); break;
          case 'about': setAbout(v as unknown as AboutSettings); break;
          case 'contact': setContact(v as unknown as ContactSettings); break;
          case 'hero': setHero(v as unknown as HeroSettings); break;
          case 'whyChooseUs': setWhyChooseUs(v as unknown as WhyChooseUsSettings); break;
          case 'testimonials': setTestimonials(v as unknown as TestimonialsSettings); break;
          case 'callToAction': setCallToAction(v as unknown as CallToActionSettings); break;
          case 'footer': setFooter(v as unknown as FooterSettings); break;
        }
      });
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    } finally { setLoading(false); }
  };

  const saveSettings = async (key: string, value: any) => {
    setSaving(true);
    try {
      const { data: existing } = await supabase.from('site_settings').select('id').eq('key', key).single();
      if (existing) {
        const { error } = await supabase.from('site_settings').update({ value: value as unknown as Json }).eq('key', key);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('site_settings').insert({ key, value: value as unknown as Json });
        if (error) throw error;
      }
      toast.success('Settings saved successfully');
      await fetchSettings();
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally { setSaving(false); }
  };

  // Testimonial helpers
  const addReview = () => {
    const newId = Math.max(0, ...testimonials.reviews.map(r => r.id)) + 1;
    setTestimonials({ ...testimonials, reviews: [...testimonials.reviews, { id: newId, name: '', location: '', initials: '', tourType: '', text: '', rating: 5, date: '' }] });
  };
  const removeReview = (id: number) => setTestimonials({ ...testimonials, reviews: testimonials.reviews.filter(r => r.id !== id) });
  const updateReview = (id: number, field: string, value: string | number) => {
    setTestimonials({ ...testimonials, reviews: testimonials.reviews.map(r => {
      if (r.id !== id) return r;
      const updated = { ...r, [field]: value };
      if (field === 'name') { const parts = (value as string).split(' '); updated.initials = parts.map(p => p[0] || '').join('').toUpperCase().slice(0, 2); }
      return updated;
    })});
  };

  // Footer link helpers
  const addQuickLink = () => setFooter({ ...footer, quickLinks: [...footer.quickLinks, { label: '', href: '/' }] });
  const removeQuickLink = (i: number) => setFooter({ ...footer, quickLinks: footer.quickLinks.filter((_, idx) => idx !== i) });
  const addDestLink = () => setFooter({ ...footer, destinationLinks: [...footer.destinationLinks, { label: '', href: '/safaris?destination=' }] });
  const removeDestLink = (i: number) => setFooter({ ...footer, destinationLinks: footer.destinationLinks.filter((_, idx) => idx !== i) });

  // WhyChooseUs helpers
  const updateCard = (i: number, field: string, value: string) => {
    const cards = [...whyChooseUs.cards];
    cards[i] = { ...cards[i], [field]: value };
    setWhyChooseUs({ ...whyChooseUs, cards });
  };
  const addCard = () => setWhyChooseUs({ ...whyChooseUs, cards: [...whyChooseUs.cards, { icon: 'Star', title: '', description: '' }] });
  const removeCard = (i: number) => setWhyChooseUs({ ...whyChooseUs, cards: whyChooseUs.cards.filter((_, idx) => idx !== i) });

  // CTA helpers
  const addValueBadge = () => setCallToAction({ ...callToAction, valueBadges: [...callToAction.valueBadges, ''] });
  const removeValueBadge = (i: number) => setCallToAction({ ...callToAction, valueBadges: callToAction.valueBadges.filter((_, idx) => idx !== i) });

  // Hero helpers
  const addTrustBadge = () => setHero({ ...hero, trustBadges: [...hero.trustBadges, { icon: 'Star', text: '' }] });
  const removeTrustBadge = (i: number) => setHero({ ...hero, trustBadges: hero.trustBadges.filter((_, idx) => idx !== i) });
  const addDestination = () => setHero({ ...hero, topDestinations: [...hero.topDestinations, ''] });
  const removeDestination = (i: number) => setHero({ ...hero, topDestinations: hero.topDestinations.filter((_, idx) => idx !== i) });

  if (loading) return <AdminLayout><div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Website Settings</h1>
          <p className="text-muted-foreground mt-1">Control every aspect of your website</p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="flex flex-wrap gap-1 h-auto">
            <TabsTrigger value="general" className="gap-2"><Settings className="h-4 w-4" />General</TabsTrigger>
            <TabsTrigger value="social" className="gap-2"><Globe className="h-4 w-4" />Social</TabsTrigger>
            <TabsTrigger value="homepage" className="gap-2"><Home className="h-4 w-4" />Homepage</TabsTrigger>
            <TabsTrigger value="footer" className="gap-2"><FootprintsIcon className="h-4 w-4" />Footer</TabsTrigger>
            <TabsTrigger value="about" className="gap-2"><Users className="h-4 w-4" />About</TabsTrigger>
            <TabsTrigger value="contact" className="gap-2"><MessageSquare className="h-4 w-4" />Contact</TabsTrigger>
            <TabsTrigger value="theme" className="gap-2"><Palette className="h-4 w-4" />Colors</TabsTrigger>
          </TabsList>

          {/* ═══════════════════════ GENERAL ═══════════════════════ */}
          <TabsContent value="general" className="space-y-6">
            <Card className="shadow-soft">
              <CardHeader><CardTitle>Site Information</CardTitle><CardDescription>Basic information about your website</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2"><Label>Site Name</Label><Input value={general.siteName} onChange={e => setGeneral({ ...general, siteName: e.target.value })} placeholder="Infinity Voyage" /></div>
                  <div className="space-y-2"><Label>Tagline</Label><Input value={general.tagline} onChange={e => setGeneral({ ...general, tagline: e.target.value })} placeholder="Tours & Safaris" /></div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2"><Label>Logo</Label><ImageUpload value={general.logo} onChange={url => setGeneral({ ...general, logo: url })} bucket="branding" folder="logos" /></div>
                  <div className="space-y-2"><Label>Favicon</Label><ImageUpload value={general.favicon} onChange={url => setGeneral({ ...general, favicon: url })} bucket="branding" folder="favicons" /></div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-soft">
              <CardHeader><CardTitle>Contact Details</CardTitle><CardDescription>How customers can reach you</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2"><Label><Mail className="inline w-4 h-4 mr-1" />Email</Label><Input value={general.email} onChange={e => setGeneral({ ...general, email: e.target.value })} placeholder="info@infinityvoyagetours.com" /></div>
                  <div className="space-y-2"><Label><Phone className="inline w-4 h-4 mr-1" />Phone</Label><Input value={general.phone} onChange={e => setGeneral({ ...general, phone: e.target.value })} placeholder="+255 758 241 294" /></div>
                  <div className="space-y-2"><Label>WhatsApp</Label><Input value={general.whatsapp} onChange={e => setGeneral({ ...general, whatsapp: e.target.value })} placeholder="+255758241294" /></div>
                  <div className="space-y-2"><Label><MapPin className="inline w-4 h-4 mr-1" />Address</Label><Input value={general.address} onChange={e => setGeneral({ ...general, address: e.target.value })} placeholder="Stone Town, Zanzibar" /></div>
                </div>
              </CardContent>
            </Card>
            <Button onClick={() => saveSettings('general', general)} disabled={saving} className="w-full md:w-auto">
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}Save General Settings
            </Button>
          </TabsContent>

          {/* ═══════════════════════ SOCIAL ═══════════════════════ */}
          <TabsContent value="social" className="space-y-6">
            <Card className="shadow-soft">
              <CardHeader><CardTitle>Social Media Links</CardTitle><CardDescription>Connect your social media profiles</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2"><Label><Facebook className="inline w-4 h-4 mr-1" />Facebook</Label><Input value={social.facebook} onChange={e => setSocial({ ...social, facebook: e.target.value })} placeholder="https://facebook.com/..." /></div>
                  <div className="space-y-2"><Label><Instagram className="inline w-4 h-4 mr-1" />Instagram</Label><Input value={social.instagram} onChange={e => setSocial({ ...social, instagram: e.target.value })} placeholder="https://instagram.com/..." /></div>
                  <div className="space-y-2"><Label><Twitter className="inline w-4 h-4 mr-1" />Twitter / X</Label><Input value={social.twitter} onChange={e => setSocial({ ...social, twitter: e.target.value })} placeholder="https://twitter.com/..." /></div>
                  <div className="space-y-2"><Label><Youtube className="inline w-4 h-4 mr-1" />YouTube</Label><Input value={social.youtube} onChange={e => setSocial({ ...social, youtube: e.target.value })} placeholder="https://youtube.com/..." /></div>
                  <div className="space-y-2"><Label>TripAdvisor</Label><Input value={social.tripadvisor} onChange={e => setSocial({ ...social, tripadvisor: e.target.value })} placeholder="https://tripadvisor.com/..." /></div>
                </div>
              </CardContent>
            </Card>
            <Button onClick={() => saveSettings('social', social)} disabled={saving} className="w-full md:w-auto">
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}Save Social Settings
            </Button>
          </TabsContent>

          {/* ═══════════════════════ HOMEPAGE ═══════════════════════ */}
          <TabsContent value="homepage" className="space-y-6">
            {/* Hero Section */}
            <Card className="shadow-soft">
              <CardHeader><CardTitle>🦁 Hero Section</CardTitle><CardDescription>The first thing visitors see</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2"><Label>Hero Title</Label><Input value={homepage.heroTitle} onChange={e => setHomepage({ ...homepage, heroTitle: e.target.value })} placeholder="Discover Tanzania's Untamed Beauty" /></div>
                <div className="space-y-2"><Label>Hero Subtitle</Label><Textarea value={homepage.heroSubtitle} onChange={e => setHomepage({ ...homepage, heroSubtitle: e.target.value })} rows={2} /></div>
                <div className="space-y-2"><Label>Badge Text</Label><Input value={hero.badgeText} onChange={e => setHero({ ...hero, badgeText: e.target.value })} placeholder="Tanzania & Zanzibar Luxury Tour Operator" /></div>
                <div className="space-y-2"><Label>Search Placeholder</Label><Input value={hero.searchPlaceholder} onChange={e => setHero({ ...hero, searchPlaceholder: e.target.value })} /></div>

                {/* Trust Badges */}
                <div className="space-y-2">
                  <Label>Trust Badges</Label>
                  {hero.trustBadges.map((b, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <select value={b.icon} onChange={e => { const t = [...hero.trustBadges]; t[i] = { ...t[i], icon: e.target.value }; setHero({ ...hero, trustBadges: t }); }} className="w-40 h-9 border rounded-md px-2 text-sm">
                        {ICON_OPTIONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
                      </select>
                      <Input value={b.text} onChange={e => { const t = [...hero.trustBadges]; t[i] = { ...t[i], text: e.target.value }; setHero({ ...hero, trustBadges: t }); }} className="flex-1" />
                      <Button variant="ghost" size="icon" onClick={() => removeTrustBadge(i)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={addTrustBadge}><Plus className="h-4 w-4 mr-1" />Add Badge</Button>
                </div>

                {/* Top Destinations */}
                <div className="space-y-2">
                  <Label>Search Autocomplete Destinations</Label>
                  {hero.topDestinations.map((d, i) => (
                    <div key={i} className="flex gap-2">
                      <Input value={d} onChange={e => { const t = [...hero.topDestinations]; t[i] = e.target.value; setHero({ ...hero, topDestinations: t }); }} />
                      <Button variant="ghost" size="icon" onClick={() => removeDestination(i)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={addDestination}><Plus className="h-4 w-4 mr-1" />Add Destination</Button>
                </div>
              </CardContent>
            </Card>
            <div className="flex gap-2">
              <Button onClick={() => { saveSettings('homepage', homepage); saveSettings('hero', hero); }} disabled={saving} className="flex-1 md:flex-none">
                {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}Save Hero Settings
              </Button>
            </div>

            {/* Section Visibility */}
            <Card className="shadow-soft">
              <CardHeader><CardTitle><Eye className="inline w-5 h-5 mr-2" />Section Visibility</CardTitle><CardDescription>Show or hide sections on the homepage</CardDescription></CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    { key: 'showWhyChooseUs', label: 'Why Choose Us' },
                    { key: 'showStats', label: 'Stats Counter' },
                    { key: 'showDestinations', label: 'Destinations' },
                    { key: 'showPackages', label: 'Tour Packages' },
                    { key: 'showTestimonials', label: 'Testimonials' },
                    { key: 'showCallToAction', label: 'Call to Action' },
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center justify-between p-3 rounded-lg border bg-white">
                      <Label>{label}</Label>
                      <Switch checked={(homepage as any)[key]} onCheckedChange={checked => setHomepage({ ...homepage, [key]: checked })} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Button onClick={() => saveSettings('homepage', homepage)} disabled={saving} className="w-full md:w-auto">
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}Save Visibility
            </Button>

            {/* Why Choose Us */}
            <Card className="shadow-soft">
              <CardHeader><CardTitle>⭐ Why Choose Us Section</CardTitle><CardDescription>Feature cards shown on homepage</CardDescription></CardHeader>
              <CardContent className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2"><Label>Eyebrow Text</Label><Input value={whyChooseUs.eyebrow} onChange={e => setWhyChooseUs({ ...whyChooseUs, eyebrow: e.target.value })} /></div>
                    <div className="space-y-2"><Label>Heading</Label><Input value={whyChooseUs.heading} onChange={e => setWhyChooseUs({ ...whyChooseUs, heading: e.target.value })} /></div>
                  </div>
                  <div className="space-y-2"><Label>Description</Label><Textarea value={whyChooseUs.description} onChange={e => setWhyChooseUs({ ...whyChooseUs, description: e.target.value })} rows={2} /></div>
                  <Label className="font-bold">Feature Cards</Label>
                  {whyChooseUs.cards.map((card, i) => (
                    <div key={i} className="p-4 border rounded-xl bg-white space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400">Card {i + 1}</span>
                        <Button variant="ghost" size="sm" onClick={() => removeCard(i)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="space-y-1"><Label className="text-xs">Icon</Label>
                          <select value={card.icon} onChange={e => updateCard(i, 'icon', e.target.value)} className="w-full h-9 border rounded-md px-2 text-sm">
                            {ICON_OPTIONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
                          </select>
                        </div>
                        <div className="space-y-1"><Label className="text-xs">Title</Label><Input value={card.title} onChange={e => updateCard(i, 'title', e.target.value)} /></div>
                      </div>
                      <div className="space-y-1"><Label className="text-xs">Description</Label><Textarea value={card.description} onChange={e => updateCard(i, 'description', e.target.value)} rows={2} /></div>
                    </div>
                  ))}
                  <Button variant="outline" onClick={addCard}><Plus className="h-4 w-4 mr-1" />Add Card</Button>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500 flex items-center gap-1"><Eye className="w-3 h-3" />LIVE PREVIEW</Label>
                  <PreviewWhyChooseUs data={whyChooseUs} />
                </div>
              </CardContent>
            </Card>
            <Button onClick={() => saveSettings('whyChooseUs', whyChooseUs)} disabled={saving} className="w-full md:w-auto">
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}Save Why Choose Us
            </Button>

            {/* Testimonials */}
            <Card className="shadow-soft">
              <CardHeader><CardTitle>💬 Testimonials Section</CardTitle><CardDescription>Customer reviews shown on homepage</CardDescription></CardHeader>
              <CardContent className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2"><Label>Eyebrow</Label><Input value={testimonials.eyebrow} onChange={e => setTestimonials({ ...testimonials, eyebrow: e.target.value })} /></div>
                    <div className="space-y-2"><Label>Heading</Label><Input value={testimonials.heading} onChange={e => setTestimonials({ ...testimonials, heading: e.target.value })} /></div>
                    <div className="space-y-2"><Label>Description</Label><Input value={testimonials.description} onChange={e => setTestimonials({ ...testimonials, description: e.target.value })} /></div>
                  </div>
                  <Label className="font-bold">Reviews</Label>
                  {testimonials.reviews.map((r) => (
                    <div key={r.id} className="p-4 border rounded-xl bg-white space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center">{r.initials || '??'}</div>
                          <span className="text-sm font-bold">{r.name || 'New Review'}</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => removeReview(r.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="space-y-1"><Label className="text-xs">Full Name</Label><Input value={r.name} onChange={e => updateReview(r.id, 'name', e.target.value)} placeholder="Sarah Jenkins" /></div>
                        <div className="space-y-1"><Label className="text-xs">Location</Label><Input value={r.location} onChange={e => updateReview(r.id, 'location', e.target.value)} placeholder="London, UK" /></div>
                        <div className="space-y-1"><Label className="text-xs">Tour Taken</Label><Input value={r.tourType} onChange={e => updateReview(r.id, 'tourType', e.target.value)} placeholder="7-Day Serengeti Safari" /></div>
                        <div className="space-y-1"><Label className="text-xs">Date</Label><Input value={r.date} onChange={e => updateReview(r.id, 'date', e.target.value)} placeholder="July 2025" /></div>
                      </div>
                      <div className="space-y-1"><Label className="text-xs">Review Text</Label><Textarea value={r.text} onChange={e => updateReview(r.id, 'text', e.target.value)} rows={2} placeholder="Write the customer review..." /></div>
                      <div className="space-y-1">
                        <Label className="text-xs">Rating</Label>
                        <div className="flex gap-1">{[1,2,3,4,5].map(s => <button key={s} type="button" onClick={() => updateReview(r.id, 'rating', s)} className="p-0.5"><Star className={`w-5 h-5 ${s <= r.rating ? 'fill-amber-500 text-amber-500' : 'text-slate-300'}`} /></button>)}</div>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" onClick={addReview}><Plus className="h-4 w-4 mr-1" />Add Review</Button>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500 flex items-center gap-1"><Eye className="w-3 h-3" />LIVE PREVIEW</Label>
                  <PreviewTestimonial data={testimonials} />
                </div>
              </CardContent>
            </Card>
            <Button onClick={() => saveSettings('testimonials', testimonials)} disabled={saving} className="w-full md:w-auto">
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}Save Testimonials
            </Button>

            {/* Call to Action */}
            <Card className="shadow-soft">
              <CardHeader><CardTitle>🚀 Call to Action Section</CardTitle><CardDescription>The conversion section at the bottom</CardDescription></CardHeader>
              <CardContent className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <div className="space-y-2"><Label>Badge Text</Label><Input value={callToAction.badgeText} onChange={e => setCallToAction({ ...callToAction, badgeText: e.target.value })} /></div>
                  <div className="space-y-2"><Label>Heading</Label><Input value={callToAction.heading} onChange={e => setCallToAction({ ...callToAction, heading: e.target.value })} /></div>
                  <div className="space-y-2"><Label>Body Text</Label><Textarea value={callToAction.body} onChange={e => setCallToAction({ ...callToAction, body: e.target.value })} rows={3} /></div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2"><Label>Button Text</Label><Input value={callToAction.primaryButtonText} onChange={e => setCallToAction({ ...callToAction, primaryButtonText: e.target.value })} /></div>
                    <div className="space-y-2"><Label>WhatsApp Message</Label><Input value={callToAction.whatsappMessage} onChange={e => setCallToAction({ ...callToAction, whatsappMessage: e.target.value })} /></div>
                  </div>
                  <div className="space-y-2">
                    <Label>Value Badges</Label>
                    {callToAction.valueBadges.map((b, i) => (
                      <div key={i} className="flex gap-2">
                        <Input value={b} onChange={e => { const v = [...callToAction.valueBadges]; v[i] = e.target.value; setCallToAction({ ...callToAction, valueBadges: v }); }} />
                        <Button variant="ghost" size="icon" onClick={() => removeValueBadge(i)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={addValueBadge}><Plus className="h-4 w-4 mr-1" />Add Badge</Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500 flex items-center gap-1"><Eye className="w-3 h-3" />LIVE PREVIEW</Label>
                  <PreviewCTA data={callToAction} />
                </div>
              </CardContent>
            </Card>
            <Button onClick={() => saveSettings('callToAction', callToAction)} disabled={saving} className="w-full md:w-auto">
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}Save Call to Action
            </Button>
          </TabsContent>

          {/* ═══════════════════════ FOOTER ═══════════════════════ */}
          <TabsContent value="footer" className="space-y-6">
            <Card className="shadow-soft">
              <CardHeader><CardTitle>Footer Content</CardTitle><CardDescription>Customize footer text and links</CardDescription></CardHeader>
              <CardContent className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <div className="space-y-2"><Label>Company Description</Label><Textarea value={footer.companyBlurb} onChange={e => setFooter({ ...footer, companyBlurb: e.target.value })} rows={3} /></div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2"><Label>Newsletter Title</Label><Input value={footer.newsletterTitle} onChange={e => setFooter({ ...footer, newsletterTitle: e.target.value })} /></div>
                    <div className="space-y-2"><Label>Newsletter Subtitle</Label><Input value={footer.newsletterSubtitle} onChange={e => setFooter({ ...footer, newsletterSubtitle: e.target.value })} /></div>
                  </div>

                  {/* Quick Links */}
                  <div className="space-y-2">
                    <Label className="font-bold">Quick Links</Label>
                    {footer.quickLinks.map((l, i) => (
                      <div key={i} className="flex gap-2">
                        <Input value={l.label} onChange={e => { const q = [...footer.quickLinks]; q[i] = { ...q[i], label: e.target.value }; setFooter({ ...footer, quickLinks: q }); }} placeholder="Link Label" className="flex-1" />
                        <Input value={l.href} onChange={e => { const q = [...footer.quickLinks]; q[i] = { ...q[i], href: e.target.value }; setFooter({ ...footer, quickLinks: q }); }} placeholder="/safaris" className="flex-1" />
                        <Button variant="ghost" size="icon" onClick={() => removeQuickLink(i)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={addQuickLink}><Plus className="h-4 w-4 mr-1" />Add Link</Button>
                  </div>

                  {/* Destination Links */}
                  <div className="space-y-2">
                    <Label className="font-bold">Destination Links</Label>
                    {footer.destinationLinks.map((l, i) => (
                      <div key={i} className="flex gap-2">
                        <Input value={l.label} onChange={e => { const d = [...footer.destinationLinks]; d[i] = { ...d[i], label: e.target.value }; setFooter({ ...footer, destinationLinks: d }); }} placeholder="Serengeti National Park" className="flex-1" />
                        <Input value={l.href} onChange={e => { const d = [...footer.destinationLinks]; d[i] = { ...d[i], href: e.target.value }; setFooter({ ...footer, destinationLinks: d }); }} placeholder="/safaris?destination=Serengeti" className="flex-1" />
                        <Button variant="ghost" size="icon" onClick={() => removeDestLink(i)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={addDestLink}><Plus className="h-4 w-4 mr-1" />Add Destination</Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500 flex items-center gap-1"><Eye className="w-3 h-3" />LIVE PREVIEW</Label>
                  <PreviewFooter data={footer} />
                </div>
              </CardContent>
            </Card>
            <Button onClick={() => saveSettings('footer', footer)} disabled={saving} className="w-full md:w-auto">
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}Save Footer Settings
            </Button>
          </TabsContent>

          {/* ═══════════════════════ ABOUT ═══════════════════════ */}
          <TabsContent value="about" className="space-y-6">
            <Card className="shadow-soft">
              <CardHeader><CardTitle>About Page Hero</CardTitle><CardDescription>Customize the About Us page header</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2"><Label>Hero Title</Label><Input value={about.heroTitle} onChange={e => setAbout({ ...about, heroTitle: e.target.value })} /></div>
                <div className="space-y-2"><Label>Hero Subtitle</Label><Textarea value={about.heroSubtitle} onChange={e => setAbout({ ...about, heroSubtitle: e.target.value })} rows={2} /></div>
                <div className="space-y-2"><Label>Founded Year</Label><Input value={about.foundedYear} onChange={e => setAbout({ ...about, foundedYear: e.target.value })} placeholder="2009" /></div>
              </CardContent>
            </Card>
            <Card className="shadow-soft">
              <CardHeader><CardTitle>Company Statistics</CardTitle><CardDescription>Numbers displayed on the homepage & About page</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2"><Label>Happy Travelers</Label><Input value={about.stats.travelers} onChange={e => setAbout({ ...about, stats: { ...about.stats, travelers: e.target.value } })} placeholder="5000+" /></div>
                  <div className="space-y-2"><Label>Years Experience</Label><Input value={about.stats.experience} onChange={e => setAbout({ ...about, stats: { ...about.stats, experience: e.target.value } })} placeholder="15+" /></div>
                  <div className="space-y-2"><Label>Destinations</Label><Input value={about.stats.destinations} onChange={e => setAbout({ ...about, stats: { ...about.stats, destinations: e.target.value } })} placeholder="50+" /></div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-soft">
              <CardHeader><CardTitle>Company Story</CardTitle><CardDescription>The narrative about your company</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2"><Label>Our Story</Label><Textarea value={about.story} onChange={e => setAbout({ ...about, story: e.target.value })} rows={4} /></div>
                <div className="space-y-2"><Label>Mission Statement</Label><Textarea value={about.mission} onChange={e => setAbout({ ...about, mission: e.target.value })} rows={3} /></div>
              </CardContent>
            </Card>
            <Button onClick={() => saveSettings('about', about)} disabled={saving} className="w-full md:w-auto">
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}Save About Settings
            </Button>
          </TabsContent>

          {/* ═══════════════════════ CONTACT ═══════════════════════ */}
          <TabsContent value="contact" className="space-y-6">
            <Card className="shadow-soft">
              <CardHeader><CardTitle>Contact Page Settings</CardTitle><CardDescription>Customize the contact page</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2"><Label>Hero Title</Label><Input value={contact.heroTitle} onChange={e => setContact({ ...contact, heroTitle: e.target.value })} /></div>
                <div className="space-y-2"><Label>Hero Subtitle</Label><Textarea value={contact.heroSubtitle} onChange={e => setContact({ ...contact, heroSubtitle: e.target.value })} rows={2} /></div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2"><Label>Office Hours</Label><Input value={contact.officeHours} onChange={e => setContact({ ...contact, officeHours: e.target.value })} /></div>
                  <div className="space-y-2"><Label>Response Time</Label><Input value={contact.responseTime} onChange={e => setContact({ ...contact, responseTime: e.target.value })} /></div>
                </div>
                <div className="space-y-2"><Label>Google Maps Embed URL</Label><Input value={contact.mapEmbed} onChange={e => setContact({ ...contact, mapEmbed: e.target.value })} placeholder="https://www.google.com/maps/embed?..." /></div>
              </CardContent>
            </Card>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800"><strong>Tip:</strong> Contact information (email, phone, address) is managed in the General settings tab.</p>
            </div>
            <Button onClick={() => saveSettings('contact', contact)} disabled={saving} className="w-full md:w-auto">
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}Save Contact Settings
            </Button>
          </TabsContent>

          {/* ═══════════════════════ THEME ═══════════════════════ */}
          <TabsContent value="theme" className="space-y-6">
            <Card className="shadow-soft">
              <CardHeader><CardTitle>Brand Colors</CardTitle><CardDescription>Customize your website's color scheme</CardDescription></CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-3">
                  {[
                    { key: 'primaryColor' as const, label: 'Primary Color (Blue)', desc: 'Used for buttons, links, headers', placeholder: '#2563eb' },
                    { key: 'accentColor' as const, label: 'Accent Color (Gold)', desc: 'Used for highlights, badges', placeholder: '#eab308' },
                    { key: 'backgroundColor' as const, label: 'Background Color', desc: 'Main background color', placeholder: '#ffffff' },
                  ].map(({ key, label, desc, placeholder }) => (
                    <div key={key} className="space-y-3">
                      <Label>{label}</Label>
                      <div className="flex gap-3 items-center">
                        <input type="color" value={theme[key]} onChange={e => setTheme({ ...theme, [key]: e.target.value })} className="w-16 h-12 rounded-lg border cursor-pointer" />
                        <Input value={theme[key]} onChange={e => setTheme({ ...theme, [key]: e.target.value })} placeholder={placeholder} className="flex-1" />
                      </div>
                      <p className="text-xs text-muted-foreground">{desc}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-6 rounded-xl border">
                  <Label className="mb-4 block">Preview</Label>
                  <div className="flex gap-4 items-center flex-wrap">
                    <div className="px-6 py-3 rounded-lg text-white font-medium" style={{ backgroundColor: theme.primaryColor }}>Primary Button</div>
                    <div className="px-6 py-3 rounded-lg text-black font-medium" style={{ backgroundColor: theme.accentColor }}>Gold Accent</div>
                    <div className="px-6 py-3 rounded-lg border-2 font-medium" style={{ backgroundColor: theme.backgroundColor, borderColor: theme.primaryColor, color: theme.primaryColor }}>Outlined</div>
                  </div>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-sm text-amber-800"><strong>Note:</strong> Color changes require a website rebuild to take effect.</p>
                </div>
              </CardContent>
            </Card>
            <Button onClick={() => saveSettings('theme', theme)} disabled={saving} className="w-full md:w-auto">
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}Save Theme Settings
            </Button>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;