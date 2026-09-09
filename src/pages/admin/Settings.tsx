import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import ImageUpload from '@/components/admin/ImageUpload';
import { Json } from '@/integrations/supabase/types';
import {
  Settings, Globe, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube,
  Home, Loader2, Save, Palette, Users, MessageSquare, Eye, Plus, Trash2, Star,
  ShieldCheck, Compass, Headphones, Award, CheckCircle2, Clock, Heart, Zap,
  Quote, ChevronUp, ChevronDown, FootprintsIcon, HelpCircle, Menu, Search,
  RotateCcw, Sparkles, Plane, ExternalLink, Link2, Filter
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
export interface AdminFAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}
export interface AdminFAQSettings {
  title: string;
  subtitle: string;
  items: AdminFAQItem[];
}
export interface AdminNavLink {
  id?: string;
  label: string;
  href: string;
}
export interface AdminNavigationSettings {
  links: AdminNavLink[];
}

const ICON_OPTIONS = ['ShieldCheck','MapPin','Compass','Headphones','Globe','Heart','Zap','Users','Star','Phone','Clock','Award','CheckCircle2','Eye'];

const SUGGESTED_FAQ_CATEGORIES = [
  'Booking & Reservations',
  'Safari Experience',
  'Zanzibar Excursions',
  'Health & Safety',
  'Practical Information',
  'General Information',
];

const COMMON_NAV_SUGGESTIONS = [
  { label: 'Zanzibar', href: '/zanzibar' },
  { label: 'Safaris', href: '/safaris' },
  { label: 'Transfers', href: '/transfers' },
  { label: 'Safari Calculator', href: '/safari-calculator' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Plan Trip', href: '/plan-my-trip' },
  { label: 'Track Booking', href: '/track-booking' },
  { label: 'FAQ', href: '/faq' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

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

const defaultFAQItems: AdminFAQItem[] = [
  {
    id: 'faq-1',
    category: 'Booking & Reservations',
    question: 'How far in advance should I book my safari?',
    answer: 'We recommend booking at least 3-6 months in advance, especially for peak season (July-October and December-February). For high-demand destinations like the Serengeti during the Great Migration, booking 6-12 months ahead is advisable.',
  },
  {
    id: 'faq-2',
    category: 'Booking & Reservations',
    question: 'What payment methods do you accept?',
    answer: 'We accept major credit cards (Visa, MasterCard, American Express), bank transfers, and PayPal. A 30% deposit is required to confirm your booking, with the balance due 60 days before departure.',
  },
  {
    id: 'faq-3',
    category: 'Booking & Reservations',
    question: 'What is your cancellation policy?',
    answer: 'Cancellations made 60+ days before departure receive a full refund minus a $100 admin fee. 30-59 days: 50% refund. Less than 30 days: No refund. We strongly recommend travel insurance.',
  },
  {
    id: 'faq-4',
    category: 'Booking & Reservations',
    question: 'Can I customize my safari itinerary?',
    answer: "Absolutely! All our safaris can be customized to your preferences. Contact us with your interests, travel dates, and budget, and we'll create a personalized itinerary for you.",
  },
  {
    id: 'faq-5',
    category: 'Safari Experience',
    question: 'What is the best time to visit Tanzania for a safari?',
    answer: 'The dry season (June-October) offers the best wildlife viewing as animals gather around water sources. The Great Migration in Serengeti is spectacular from July-October. The green season (November-May) offers lush landscapes and fewer crowds.',
  },
  {
    id: 'faq-6',
    category: 'Safari Experience',
    question: 'What should I pack for a safari?',
    answer: 'Essential items include: neutral-colored clothing (khaki, olive, brown), comfortable walking shoes, sun hat, sunscreen, insect repellent, binoculars, camera with zoom lens, light jacket for early mornings, and any personal medications.',
  },
  {
    id: 'faq-7',
    category: 'Safari Experience',
    question: 'Is it safe to go on a safari?',
    answer: "Yes, safaris are very safe when conducted with professional guides. Our guides are highly trained and experienced. You'll always be accompanied, and we follow strict safety protocols. Wildlife is observed from safe distances.",
  },
  {
    id: 'faq-8',
    category: 'Safari Experience',
    question: 'What type of accommodation is available?',
    answer: 'We offer various options from luxury lodges and tented camps to budget camping. Lodges offer hotel-like amenities, while tented camps provide an authentic bush experience with comfortable beds and en-suite facilities.',
  },
  {
    id: 'faq-9',
    category: 'Zanzibar Excursions',
    question: 'How do I get to Zanzibar from mainland Tanzania?',
    answer: 'You can fly directly to Zanzibar from Dar es Salaam (20 min), Arusha, or Kilimanjaro. Alternatively, take a ferry from Dar es Salaam (2 hours). We can arrange all transfers for you.',
  },
  {
    id: 'faq-10',
    category: 'Zanzibar Excursions',
    question: 'What activities are available in Zanzibar?',
    answer: 'Popular activities include: Stone Town cultural tours, spice farm visits, dolphin watching, snorkeling and diving, sunset dhow cruises, Prison Island trips, Jozani Forest visits, and beach relaxation.',
  },
  {
    id: 'faq-11',
    category: 'Zanzibar Excursions',
    question: 'Is Zanzibar suitable for families with children?',
    answer: 'Yes! Zanzibar is family-friendly with many kid-appropriate activities like beach time, swimming with dolphins, visiting the turtle sanctuary, and exploring spice farms. We can customize family-friendly itineraries.',
  },
  {
    id: 'faq-12',
    category: 'Health & Safety',
    question: 'Do I need vaccinations to visit Tanzania?',
    answer: 'Yellow fever vaccination is required if arriving from an endemic country. Recommended vaccines include Hepatitis A & B, Typhoid, and Tetanus. Malaria prophylaxis is strongly advised. Consult your doctor 6-8 weeks before travel.',
  },
  {
    id: 'faq-13',
    category: 'Health & Safety',
    question: 'Is travel insurance required?',
    answer: 'Yes, comprehensive travel insurance is mandatory for all our tours. It should cover medical evacuation, trip cancellation, and personal belongings. We can recommend trusted insurance providers.',
  },
  {
    id: 'faq-14',
    category: 'Health & Safety',
    question: 'What about COVID-19 requirements?',
    answer: "Requirements change frequently. Currently, Tanzania has minimal restrictions. Check the latest guidelines before travel. We'll provide updated information during the booking process.",
  },
  {
    id: 'faq-15',
    category: 'Practical Information',
    question: 'What currency is used in Tanzania?',
    answer: 'The Tanzanian Shilling (TZS) is the local currency, but US Dollars are widely accepted. Credit cards work in major hotels and lodges. ATMs are available in cities. Bring some cash for tips and small purchases.',
  },
  {
    id: 'faq-16',
    category: 'Practical Information',
    question: 'Do I need a visa to visit Tanzania?',
    answer: 'Most nationalities need a visa. Tourist visas can be obtained online (e-visa) or on arrival at major entry points. Single-entry visas cost $50 USD. Check requirements for your nationality.',
  },
  {
    id: 'faq-17',
    category: 'Practical Information',
    question: 'What language is spoken in Tanzania?',
    answer: "Swahili and English are the official languages. English is widely spoken in tourist areas. Our guides speak fluent English. Learning a few Swahili phrases like 'Jambo' (Hello) and 'Asante' (Thank you) is appreciated!",
  },
  {
    id: 'faq-18',
    category: 'Practical Information',
    question: 'How much should I budget for tips?',
    answer: 'Tipping is customary in Tanzania. Guidelines: Safari guides $20-25/day, camp/lodge staff $10-15/day shared, hotel porters $1-2/bag. Tips are pooled and shared among staff at most establishments.',
  },
];

const defaultFAQ: AdminFAQSettings = {
  title: 'Frequently Asked Questions',
  subtitle: 'Find answers to common questions about our safari tours, Zanzibar holidays, booking process, and travel preparation in Tanzania.',
  items: defaultFAQItems,
};

const defaultNavigation: AdminNavigationSettings = {
  links: [
    { label: 'Zanzibar', href: '/zanzibar' },
    { label: 'Safaris', href: '/safaris' },
    { label: 'Transfers', href: '/transfers' },
    { label: 'Calculator', href: '/safari-calculator' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Plan Trip', href: '/plan-my-trip' },
    { label: 'Track Booking', href: '/track-booking' },
    { label: 'Contact', href: '/contact' },
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

const PreviewFAQ = ({ data }: { data: AdminFAQSettings }) => {
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const categories = Array.from(new Set(data.items.map(i => i.category || 'General Information')));
  const filteredItems = selectedCat === 'all'
    ? data.items
    : data.items.filter(i => (i.category || 'General Information') === selectedCat);

  return (
    <div className="bg-slate-900 text-white rounded-xl p-4 border border-slate-800 space-y-3">
      <div>
        <span className="text-[9px] font-bold uppercase tracking-wider text-amber-400">Help & Support Preview</span>
        <h4 className="text-xs font-bold text-white mt-0.5">{data.title || 'FAQ'}</h4>
        <p className="text-[9px] text-slate-400 line-clamp-2 mt-0.5">{data.subtitle}</p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-1">
        <button
          type="button"
          onClick={() => setSelectedCat('all')}
          className={`text-[8px] px-2 py-0.5 rounded-full font-medium transition-colors ${
            selectedCat === 'all' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          All ({data.items.length})
        </button>
        {categories.slice(0, 4).map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCat(cat)}
            className={`text-[8px] px-2 py-0.5 rounded-full font-medium transition-colors truncate max-w-[120px] ${
              selectedCat === cat ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Accordion List */}
      <div className="space-y-1.5 max-h-[360px] overflow-y-auto pr-1">
        {filteredItems.length === 0 ? (
          <p className="text-[9px] text-slate-400 italic py-2 text-center">No questions in this category</p>
        ) : (
          filteredItems.slice(0, 6).map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={item.id || idx} className="rounded-lg border border-slate-800 bg-slate-950/60 overflow-hidden text-left">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left p-2 flex items-start justify-between gap-2 hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex-1">
                    <span className="text-[7px] text-amber-400 font-semibold uppercase block">{item.category}</span>
                    <span className="text-[10px] font-medium text-slate-200 line-clamp-1">{item.question || 'Untitled Question'}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-0.5">{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen && (
                  <div className="px-2 pb-2 pt-0 text-[9px] text-slate-400 border-t border-slate-800/50">
                    <p className="line-clamp-3 mt-1">{item.answer || 'No answer provided yet.'}</p>
                  </div>
                )}
              </div>
            );
          })
        )}
        {filteredItems.length > 6 && (
          <p className="text-[8px] text-slate-500 text-center pt-1">+{filteredItems.length - 6} more questions in list</p>
        )}
      </div>

      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[8px] text-slate-400">
        <span>Total: {data.items.length} questions</span>
        <span className="text-emerald-400 font-medium">✓ Ready for public FAQ page</span>
      </div>
    </div>
  );
};

const PreviewNavigation = ({ data, siteName }: { data: AdminNavigationSettings; siteName: string }) => {
  return (
    <div className="bg-slate-900 text-white rounded-xl p-4 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <span className="text-[9px] font-bold uppercase tracking-wider text-amber-400">Navbar Preview</span>
        <span className="text-[8px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">{data.links.length} Links</span>
      </div>

      {/* Mock Desktop Navbar */}
      <div className="space-y-1">
        <span className="text-[8px] text-slate-400 font-medium">Desktop View</span>
        <div className="bg-slate-950 rounded-lg p-2.5 border border-slate-800 flex items-center justify-between gap-2 overflow-hidden">
          {/* Logo / Site Name */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <div className="w-5 h-5 rounded bg-amber-500 flex items-center justify-center text-slate-950 font-black text-[9px]">IV</div>
            <span className="text-[10px] font-bold text-white tracking-tight truncate max-w-[80px]">
              {siteName || 'Infinity Voyage'}
            </span>
          </div>

          {/* Nav Links */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
            {data.links.map((link, idx) => (
              <span
                key={idx}
                className={`text-[8px] whitespace-nowrap px-1.5 py-0.5 rounded transition-colors ${
                  idx === 0 ? 'text-amber-400 font-bold bg-amber-400/10' : 'text-slate-300 hover:text-white'
                }`}
              >
                {link.label || 'Link'}
              </span>
            ))}
          </div>

          {/* Action button */}
          <div className="bg-amber-500 text-slate-950 font-bold text-[7px] px-2 py-1 rounded flex-shrink-0">
            Book
          </div>
        </div>
      </div>

      {/* Mock Mobile Navigation Drawer */}
      <div className="space-y-1">
        <span className="text-[8px] text-slate-400 font-medium">Mobile Drawer Links</span>
        <div className="bg-slate-950 rounded-lg p-2 border border-slate-800 divide-y divide-slate-800/60 max-h-[160px] overflow-y-auto">
          {data.links.map((link, idx) => (
            <div key={idx} className="py-1 flex items-center justify-between text-[9px]">
              <span className="text-slate-200">{link.label || 'Untitled Link'}</span>
              <span className="text-[8px] text-slate-500 font-mono">{link.href || '#'}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-[8px] text-slate-400 text-center">
        Navbar updates automatically reflect across the entire website.
      </p>
    </div>
  );
};

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

  // New states for FAQ Manager & Navigation
  const [faq, setFaq] = useState<AdminFAQSettings>(defaultFAQ);
  const [navigation, setNavigation] = useState<AdminNavigationSettings>(defaultNavigation);
  const [faqSearchQuery, setFaqSearchQuery] = useState<string>('');
  const [faqFilterCategory, setFaqFilterCategory] = useState<string>('all');

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
          case 'faq': {
            const faqData = v as any;
            let parsedItems: AdminFAQItem[] = [];
            if (faqData?.items && Array.isArray(faqData.items) && faqData.items.length > 0) {
              parsedItems = faqData.items.map((item: any, idx: number) => ({
                id: item.id ? String(item.id) : `faq-${idx + 1}`,
                category: item.category || 'General Information',
                question: item.question || item.q || '',
                answer: item.answer || item.a || '',
              }));
            } else if (faqData?.categories && Array.isArray(faqData.categories) && faqData.categories.length > 0) {
              let count = 1;
              faqData.categories.forEach((cat: any) => {
                const catName = cat.category || 'General Information';
                (cat.questions || []).forEach((q: any) => {
                  parsedItems.push({
                    id: `faq-${count++}`,
                    category: catName,
                    question: q.question || q.q || '',
                    answer: q.answer || q.a || '',
                  });
                });
              });
            }
            setFaq({
              title: faqData?.title || defaultFAQ.title,
              subtitle: faqData?.subtitle || defaultFAQ.subtitle,
              items: parsedItems.length > 0 ? parsedItems : defaultFAQ.items,
            });
            break;
          }
          case 'navigation': {
            const navData = v as any;
            if (navData?.links && Array.isArray(navData.links) && navData.links.length > 0) {
              setNavigation({
                links: navData.links.map((link: any) => ({
                  label: link.label || link.name || '',
                  href: link.href || link.path || '',
                })),
              });
            }
            break;
          }
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
      const { data: existing } = await supabase.from('site_settings').select('id').eq('key', key).maybeSingle();
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

  // ── FAQ helpers ───────────────────────────────────────
  const addFaqItem = (category?: string) => {
    const newId = `faq-${Date.now()}`;
    const newItem: AdminFAQItem = {
      id: newId,
      category: category || (faqFilterCategory !== 'all' ? faqFilterCategory : 'Booking & Reservations'),
      question: '',
      answer: '',
    };
    setFaq({ ...faq, items: [newItem, ...faq.items] });
  };

  const removeFaqItem = (id: string) => {
    setFaq({ ...faq, items: faq.items.filter(item => item.id !== id) });
  };

  const updateFaqItem = (id: string, field: keyof AdminFAQItem, value: string) => {
    setFaq({
      ...faq,
      items: faq.items.map(item => (item.id === id ? { ...item, [field]: value } : item)),
    });
  };

  const moveFaqItem = (id: string, direction: 'up' | 'down') => {
    const index = faq.items.findIndex(i => i.id === id);
    if (index === -1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= faq.items.length) return;
    const newItems = [...faq.items];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    setFaq({ ...faq, items: newItems });
  };

  const resetFaqToDefaults = () => {
    if (window.confirm('Reset all FAQs to the default 18 items? Any unsaved edits will be replaced.')) {
      setFaq(defaultFAQ);
    }
  };

  const saveFAQSettings = async () => {
    // Generate both nested categories array and flat items array so any hook/page works seamlessly
    const categoryMap: Record<string, Array<{ q: string; question: string; a: string; answer: string }>> = {};
    faq.items.forEach(item => {
      const cat = item.category?.trim() || 'General Information';
      if (!categoryMap[cat]) categoryMap[cat] = [];
      categoryMap[cat].push({
        q: item.question,
        question: item.question,
        a: item.answer,
        answer: item.answer,
      });
    });

    const categories = Object.entries(categoryMap).map(([category, questions]) => ({
      category,
      questions,
    }));

    const payload = {
      title: faq.title,
      subtitle: faq.subtitle,
      items: faq.items.map(item => ({
        id: item.id,
        category: item.category,
        question: item.question,
        q: item.question,
        answer: item.answer,
        a: item.answer,
      })),
      categories,
    };

    await saveSettings('faq', payload);
  };

  // ── Navigation helpers ────────────────────────────────
  const addNavLink = (custom?: { label: string; href: string }) => {
    setNavigation({
      ...navigation,
      links: [...navigation.links, custom || { label: '', href: '/' }],
    });
  };

  const removeNavLink = (index: number) => {
    setNavigation({
      ...navigation,
      links: navigation.links.filter((_, i) => i !== index),
    });
  };

  const updateNavLink = (index: number, field: keyof AdminNavLink, value: string) => {
    const updated = [...navigation.links];
    updated[index] = { ...updated[index], [field]: value };
    setNavigation({ ...navigation, links: updated });
  };

  const moveNavLink = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= navigation.links.length) return;
    const newLinks = [...navigation.links];
    const temp = newLinks[index];
    newLinks[index] = newLinks[targetIndex];
    newLinks[targetIndex] = temp;
    setNavigation({ ...navigation, links: newLinks });
  };

  const resetNavigationToDefaults = () => {
    if (window.confirm('Reset navigation links to the default menu items?')) {
      setNavigation(defaultNavigation);
    }
  };

  const saveNavigationSettings = async () => {
    const payload = {
      links: navigation.links.map(l => ({
        label: l.label.trim(),
        href: l.href.trim(),
      })),
    };
    await saveSettings('navigation', payload);
  };

  // ── Testimonial helpers ───────────────────────────────
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

  // ── Footer link helpers ───────────────────────────────
  const addQuickLink = () => setFooter({ ...footer, quickLinks: [...footer.quickLinks, { label: '', href: '/' }] });
  const removeQuickLink = (i: number) => setFooter({ ...footer, quickLinks: footer.quickLinks.filter((_, idx) => idx !== i) });
  const addDestLink = () => setFooter({ ...footer, destinationLinks: [...footer.destinationLinks, { label: '', href: '/safaris?destination=' }] });
  const removeDestLink = (i: number) => setFooter({ ...footer, destinationLinks: footer.destinationLinks.filter((_, idx) => idx !== i) });

  // ── WhyChooseUs helpers ───────────────────────────────
  const updateCard = (i: number, field: string, value: string) => {
    const cards = [...whyChooseUs.cards];
    cards[i] = { ...cards[i], [field]: value };
    setWhyChooseUs({ ...whyChooseUs, cards });
  };
  const addCard = () => setWhyChooseUs({ ...whyChooseUs, cards: [...whyChooseUs.cards, { icon: 'Star', title: '', description: '' }] });
  const removeCard = (i: number) => setWhyChooseUs({ ...whyChooseUs, cards: whyChooseUs.cards.filter((_, idx) => idx !== i) });

  // ── CTA helpers ───────────────────────────────────────
  const addValueBadge = () => setCallToAction({ ...callToAction, valueBadges: [...callToAction.valueBadges, ''] });
  const removeValueBadge = (i: number) => setCallToAction({ ...callToAction, valueBadges: callToAction.valueBadges.filter((_, idx) => idx !== i) });

  // ── Hero helpers ──────────────────────────────────────
  const addTrustBadge = () => setHero({ ...hero, trustBadges: [...hero.trustBadges, { icon: 'Star', text: '' }] });
  const removeTrustBadge = (i: number) => setHero({ ...hero, trustBadges: hero.trustBadges.filter((_, idx) => idx !== i) });
  const addDestination = () => setHero({ ...hero, topDestinations: [...hero.topDestinations, ''] });
  const removeDestination = (i: number) => setHero({ ...hero, topDestinations: hero.topDestinations.filter((_, idx) => idx !== i) });

  // Filtered FAQs for editor
  const allFaqCategories = Array.from(new Set(faq.items.map(i => i.category || 'General Information')));
  const displayedFaqItems = faq.items.filter(item => {
    const qLower = faqSearchQuery.toLowerCase();
    const matchesSearch = !faqSearchQuery ||
      item.question.toLowerCase().includes(qLower) ||
      item.answer.toLowerCase().includes(qLower) ||
      item.category.toLowerCase().includes(qLower);
    const matchesCategory = faqFilterCategory === 'all' || item.category === faqFilterCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) return <AdminLayout><div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Website Settings</h1>
          <p className="text-muted-foreground mt-1">Control and customize every aspect of your website</p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="flex flex-wrap gap-1 h-auto bg-muted/60 p-1">
            <TabsTrigger value="general" className="gap-2"><Settings className="h-4 w-4" />General</TabsTrigger>
            <TabsTrigger value="navigation" className="gap-2"><Menu className="h-4 w-4" />Navigation / Menus</TabsTrigger>
            <TabsTrigger value="faq" className="gap-2"><HelpCircle className="h-4 w-4" />FAQ Manager</TabsTrigger>
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

          {/* ═══════════════════════ NAVIGATION / MENUS ═══════════════════════ */}
          <TabsContent value="navigation" className="space-y-6">
            <Card className="shadow-soft">
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Menu className="h-5 w-5 text-primary" />
                      Header Navigation Menu
                    </CardTitle>
                    <CardDescription>
                      Customize the links and order of items displayed on the top navigation bar and mobile drawer.
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="text-xs bg-amber-500/10 text-amber-600 border-amber-500/20 font-medium">
                    {navigation.links.length} Links Active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  {/* Quick Add Common Links */}
                  <div className="p-3 bg-muted/40 rounded-xl border space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                      <Plus className="w-3.5 h-3.5" />
                      Quick-Add Standard Site Routes:
                    </Label>
                    <div className="flex flex-wrap gap-1.5">
                      {COMMON_NAV_SUGGESTIONS.map((sug) => {
                        const exists = navigation.links.some(l => l.href === sug.href);
                        return (
                          <button
                            key={sug.href}
                            type="button"
                            onClick={() => addNavLink(sug)}
                            className={`text-xs px-2.5 py-1 rounded-md border font-medium transition-all ${
                              exists 
                                ? 'bg-secondary/40 text-muted-foreground border-border opacity-60 hover:opacity-100'
                                : 'bg-background hover:bg-primary/10 hover:text-primary hover:border-primary/40 text-foreground shadow-xs'
                            }`}
                          >
                            + {sug.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Links List */}
                  <div className="space-y-2.5">
                    {navigation.links.map((link, idx) => (
                      <div key={idx} className="p-3 bg-card border rounded-xl shadow-xs flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-md bg-muted text-foreground/80 font-bold text-xs flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <div className="flex sm:flex-col gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              disabled={idx === 0}
                              onClick={() => moveNavLink(idx, 'up')}
                              title="Move up"
                            >
                              <ChevronUp className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              disabled={idx === navigation.links.length - 1}
                              onClick={() => moveNavLink(idx, 'down')}
                              title="Move down"
                            >
                              <ChevronDown className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1">
                          <div className="space-y-1">
                            <Label className="text-[11px] text-muted-foreground">Label</Label>
                            <Input
                              value={link.label}
                              onChange={e => updateNavLink(idx, 'label', e.target.value)}
                              placeholder="Menu title (e.g. Safaris)"
                              className="h-9"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[11px] text-muted-foreground">Destination URL / Path</Label>
                            <Input
                              value={link.href}
                              onChange={e => updateNavLink(idx, 'href', e.target.value)}
                              placeholder="/safaris or https://..."
                              className="h-9 font-mono text-xs"
                            />
                          </div>
                        </div>

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeNavLink(idx)}
                          className="h-9 w-9 text-red-500 hover:text-red-700 hover:bg-red-50 sm:self-center"
                          title="Delete link"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}

                    {navigation.links.length === 0 && (
                      <div className="p-8 text-center border border-dashed rounded-xl bg-muted/20">
                        <p className="text-sm text-muted-foreground">No navigation links added yet.</p>
                        <Button variant="outline" size="sm" onClick={() => addNavLink()} className="mt-3">
                          <Plus className="h-4 w-4 mr-1.5" />Add First Link
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    <Button variant="outline" onClick={() => addNavLink()}>
                      <Plus className="h-4 w-4 mr-1.5" />Add Custom Link
                    </Button>
                    <Button variant="ghost" onClick={resetNavigationToDefaults} className="text-muted-foreground hover:text-foreground">
                      <RotateCcw className="h-4 w-4 mr-1.5" />Restore Standard Defaults
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-primary" />LIVE NAVBAR PREVIEW
                  </Label>
                  <PreviewNavigation data={navigation} siteName={general.siteName} />
                </div>
              </CardContent>
            </Card>

            <Button onClick={saveNavigationSettings} disabled={saving} className="w-full md:w-auto">
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}Save Navigation Settings
            </Button>
          </TabsContent>

          {/* ═══════════════════════ FAQ MANAGER ═══════════════════════ */}
          <TabsContent value="faq" className="space-y-6">
            {/* FAQ Page Header Card */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  FAQ Page Header & Meta
                </CardTitle>
                <CardDescription>
                  Configure the banner text shown at the top of the public /faq page
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Page Title</Label>
                  <Input
                    value={faq.title}
                    onChange={e => setFaq({ ...faq, title: e.target.value })}
                    placeholder="Frequently Asked Questions"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Subtitle / Description</Label>
                  <Textarea
                    value={faq.subtitle}
                    onChange={e => setFaq({ ...faq, subtitle: e.target.value })}
                    placeholder="Find answers to common questions about our safari tours, Zanzibar holidays, booking process, and travel preparation in Tanzania."
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* FAQ Items Editor Card */}
            <Card className="shadow-soft">
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      Questions & Answers Manager
                    </CardTitle>
                    <CardDescription>
                      Add, edit, reorder, categorize, and delete frequently asked questions.
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs bg-amber-500/10 text-amber-600 border-amber-500/20 font-medium">
                      {faq.items.length} Questions
                    </Badge>
                    <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-600 border-blue-500/20 font-medium">
                      {allFaqCategories.length} Categories
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  {/* Search and Category Filter Toolbar */}
                  <div className="p-3 bg-muted/40 rounded-xl border space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          value={faqSearchQuery}
                          onChange={e => setFaqSearchQuery(e.target.value)}
                          placeholder="Search questions, answers, or tags..."
                          className="pl-9 h-9 bg-background"
                        />
                      </div>
                      {faqSearchQuery && (
                        <Button variant="ghost" size="sm" onClick={() => setFaqSearchQuery('')} className="h-9 px-2 text-xs">
                          Clear
                        </Button>
                      )}
                      <Button size="sm" onClick={() => addFaqItem()} className="h-9">
                        <Plus className="w-4 h-4 mr-1" />Add FAQ
                      </Button>
                    </div>

                    {/* Category Filter Pills */}
                    <div className="flex flex-wrap gap-1.5 items-center">
                      <span className="text-[11px] text-muted-foreground font-medium mr-1 flex items-center gap-1">
                        <Filter className="w-3 h-3" />Category:
                      </span>
                      <button
                        type="button"
                        onClick={() => setFaqFilterCategory('all')}
                        className={`text-xs px-2.5 py-1 rounded-md font-medium transition-all ${
                          faqFilterCategory === 'all'
                            ? 'bg-primary text-primary-foreground shadow-xs'
                            : 'bg-background hover:bg-muted text-muted-foreground border'
                        }`}
                      >
                        All ({faq.items.length})
                      </button>
                      {allFaqCategories.map(cat => {
                        const count = faq.items.filter(i => (i.category || 'General Information') === cat).length;
                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setFaqFilterCategory(cat)}
                            className={`text-xs px-2.5 py-1 rounded-md font-medium transition-all truncate max-w-[170px] ${
                              faqFilterCategory === cat
                                ? 'bg-primary text-primary-foreground shadow-xs'
                                : 'bg-background hover:bg-muted text-muted-foreground border'
                            }`}
                          >
                            {cat} ({count})
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* FAQ Items List */}
                  <div className="space-y-4">
                    {displayedFaqItems.length === 0 ? (
                      <div className="p-8 text-center border border-dashed rounded-xl bg-muted/20 space-y-2">
                        <p className="text-sm font-medium text-foreground">No questions found</p>
                        <p className="text-xs text-muted-foreground">
                          {faqSearchQuery ? `No FAQ matches "${faqSearchQuery}". Try clearing search or add a new question.` : 'No questions in this category.'}
                        </p>
                        <div className="flex justify-center gap-2 pt-2">
                          {faqSearchQuery && (
                            <Button variant="outline" size="sm" onClick={() => setFaqSearchQuery('')}>Clear Search</Button>
                          )}
                          <Button size="sm" onClick={() => addFaqItem(faqFilterCategory !== 'all' ? faqFilterCategory : undefined)}>
                            <Plus className="w-4 h-4 mr-1" />Add FAQ Here
                          </Button>
                        </div>
                      </div>
                    ) : (
                      displayedFaqItems.map((item) => {
                        const originalIndex = faq.items.findIndex(i => i.id === item.id);
                        return (
                          <div key={item.id} className="p-4 border rounded-xl bg-card space-y-3 shadow-xs">
                            {/* Card Header Row */}
                            <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-border/60">
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="font-mono text-xs font-semibold">
                                  #{originalIndex + 1}
                                </Badge>
                                <Badge variant="outline" className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30 text-xs">
                                  {item.category || 'General Information'}
                                </Badge>
                              </div>

                              <div className="flex items-center gap-1">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  disabled={originalIndex === 0}
                                  onClick={() => moveFaqItem(item.id, 'up')}
                                  title="Move up in list"
                                >
                                  <ChevronUp className="h-4 w-4" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  disabled={originalIndex === faq.items.length - 1}
                                  onClick={() => moveFaqItem(item.id, 'down')}
                                  title="Move down in list"
                                >
                                  <ChevronDown className="h-4 w-4" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeFaqItem(item.id)}
                                  className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                                  title="Delete question"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            {/* Question and Category */}
                            <div className="grid gap-3 sm:grid-cols-3">
                              <div className="sm:col-span-2 space-y-1">
                                <Label className="text-xs font-semibold">Question</Label>
                                <Input
                                  value={item.question}
                                  onChange={e => updateFaqItem(item.id, 'question', e.target.value)}
                                  placeholder="e.g. What should I pack for a safari?"
                                  className="h-9 font-medium"
                                />
                              </div>

                              <div className="space-y-1">
                                <Label className="text-xs font-semibold">Category Tag</Label>
                                <Input
                                  value={item.category}
                                  onChange={e => updateFaqItem(item.id, 'category', e.target.value)}
                                  placeholder="Category Name"
                                  className="h-9"
                                />
                              </div>
                            </div>

                            {/* Suggested Category Quick Tags */}
                            <div className="flex flex-wrap items-center gap-1 text-[10px]">
                              <span className="text-muted-foreground mr-1">Tag Suggestions:</span>
                              {SUGGESTED_FAQ_CATEGORIES.map(cat => (
                                <button
                                  key={cat}
                                  type="button"
                                  onClick={() => updateFaqItem(item.id, 'category', cat)}
                                  className={`px-1.5 py-0.5 rounded border transition-colors ${
                                    item.category === cat
                                      ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-500/40 font-semibold'
                                      : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                                  }`}
                                >
                                  {cat}
                                </button>
                              ))}
                            </div>

                            {/* Answer */}
                            <div className="space-y-1">
                              <Label className="text-xs font-semibold">Answer</Label>
                              <Textarea
                                value={item.answer}
                                onChange={e => updateFaqItem(item.id, 'answer', e.target.value)}
                                placeholder="Detailed answer displayed when visitor opens this question..."
                                rows={3}
                                className="text-xs leading-relaxed"
                              />
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Actions Footer */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Button variant="outline" onClick={() => addFaqItem()}>
                      <Plus className="h-4 w-4 mr-1.5" />Add Another Question
                    </Button>
                    <Button variant="ghost" onClick={resetFaqToDefaults} className="text-muted-foreground hover:text-foreground">
                      <RotateCcw className="h-4 w-4 mr-1.5" />Reset to Default 18 FAQs
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-primary" />LIVE FAQ PREVIEW
                  </Label>
                  <PreviewFAQ data={faq} />
                </div>
              </CardContent>
            </Card>

            <Button onClick={saveFAQSettings} disabled={saving} className="w-full md:w-auto">
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}Save FAQ Settings
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
                      <select value={b.icon} onChange={e => { const t = [...hero.trustBadges]; t[i] = { ...t[i], icon: e.target.value }; setHero({ ...hero, trustBadges: t }); }} className="w-40 h-9 border rounded-md px-2 text-sm bg-background">
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
                    <div key={key} className="flex items-center justify-between p-3 rounded-lg border bg-white dark:bg-card">
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
                    <div key={i} className="p-4 border rounded-xl bg-card space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-muted-foreground">Card {i + 1}</span>
                        <Button variant="ghost" size="sm" onClick={() => removeCard(i)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="space-y-1"><Label className="text-xs">Icon</Label>
                          <select value={card.icon} onChange={e => updateCard(i, 'icon', e.target.value)} className="w-full h-9 border rounded-md px-2 text-sm bg-background">
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
                  <Label className="text-xs font-bold text-muted-foreground flex items-center gap-1"><Eye className="w-3 h-3" />LIVE PREVIEW</Label>
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
                    <div key={r.id} className="p-4 border rounded-xl bg-card space-y-3">
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
                  <Label className="text-xs font-bold text-muted-foreground flex items-center gap-1"><Eye className="w-3 h-3" />LIVE PREVIEW</Label>
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
                  <Label className="text-xs font-bold text-muted-foreground flex items-center gap-1"><Eye className="w-3 h-3" />LIVE PREVIEW</Label>
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
                  <Label className="text-xs font-bold text-muted-foreground flex items-center gap-1"><Eye className="w-3 h-3" />LIVE PREVIEW</Label>
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
            <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
              <p className="text-sm text-blue-800 dark:text-blue-300"><strong>Tip:</strong> Contact information (email, phone, address) is managed in the General settings tab.</p>
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
                <div className="mt-6 p-6 rounded-xl border bg-card">
                  <Label className="mb-4 block">Preview</Label>
                  <div className="flex gap-4 items-center flex-wrap">
                    <div className="px-6 py-3 rounded-lg text-white font-medium shadow-xs" style={{ backgroundColor: theme.primaryColor }}>Primary Button</div>
                    <div className="px-6 py-3 rounded-lg text-black font-medium shadow-xs" style={{ backgroundColor: theme.accentColor }}>Gold Accent</div>
                    <div className="px-6 py-3 rounded-lg border-2 font-medium" style={{ backgroundColor: theme.backgroundColor, borderColor: theme.primaryColor, color: theme.primaryColor }}>Outlined</div>
                  </div>
                </div>
                <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-lg p-4">
                  <p className="text-sm text-amber-800 dark:text-amber-300"><strong>Note:</strong> Color changes require a website rebuild to take effect.</p>
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