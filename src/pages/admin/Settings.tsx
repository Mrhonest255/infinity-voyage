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
  Settings, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube,
  Home,
  Loader2,
  Save,
  Palette,
  Users,
  MessageSquare
} from 'lucide-react';

interface GeneralSettings {
  siteName: string;
  tagline: string;
  logo: string | null;
  favicon: string | null;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
}

interface SocialSettings {
  facebook: string;
  instagram: string;
  twitter: string;
  youtube: string;
  tripadvisor: string;
}

interface HomepageSettings {
  heroTitle: string;
  heroSubtitle: string;
  heroVideo: string | null;
  showDestinations: boolean;
  showPackages: boolean;
  showTestimonials: boolean;
  showWhyChooseUs: boolean;
}

interface ThemeSettings {
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
}

interface AboutSettings {
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

interface ContactSettings {
  heroTitle: string;
  heroSubtitle: string;
  officeHours: string;
  responseTime: string;
  mapEmbed: string;
}

const AdminSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [general, setGeneral] = useState<GeneralSettings>({
    siteName: '',
    tagline: '',
    logo: null,
    favicon: null,
    email: '',
    phone: '',
    whatsapp: '',
    address: ''
  });
  
  const [social, setSocial] = useState<SocialSettings>({
    facebook: '',
    instagram: '',
    twitter: '',
    youtube: '',
    tripadvisor: ''
  });
  
  const [homepage, setHomepage] = useState<HomepageSettings>({
    heroTitle: '',
    heroSubtitle: '',
    heroVideo: null,
    showDestinations: true,
    showPackages: true,
    showTestimonials: true,
    showWhyChooseUs: true
  });

  const [theme, setTheme] = useState<ThemeSettings>({
    primaryColor: '#2563eb',
    accentColor: '#eab308',
    backgroundColor: '#ffffff'
  });

  const [about, setAbout] = useState<AboutSettings>({
    heroTitle: 'Our Story',
    heroSubtitle: 'Your gateway to endless exploration in the heart of East Africa.',
    foundedYear: '2009',
    story: 'Founded in 2009 by a group of passionate Tanzanian travel enthusiasts, Infinity Voyage Tours & Safaris was born from a simple belief: everyone deserves to experience the magic of Africa in its purest form.',
    mission: 'We don\'t just show you Tanzania; we invite you to feel it, taste it, and become part of its eternal story.',
    stats: {
      travelers: '5000+',
      experience: '15+',
      destinations: '50+'
    },
    values: [
      { title: 'Authentic Experiences', description: 'We go beyond typical tourist routes to show you the real Tanzania.' },
      { title: 'Sustainable Tourism', description: 'We partner with local communities and conservation projects.' },
      { title: 'Expert Local Guides', description: 'Our guides are passionate Tanzanians with deep knowledge.' },
      { title: 'Personalized Service', description: 'We customize every itinerary to match your interests.' }
    ]
  });

  const [contact, setContact] = useState<ContactSettings>({
    heroTitle: "Let's Plan Your Adventure",
    heroSubtitle: "Have questions? We're here to help create your perfect African experience",
    officeHours: 'Mon-Sat: 8:00 AM - 6:00 PM (EAT)',
    responseTime: '24 hours',
    mapEmbed: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');
      
      if (error) throw error;
      
      data?.forEach((setting) => {
        const value = setting.value as Record<string, unknown>;
        if (setting.key === 'general') {
          setGeneral(value as unknown as GeneralSettings);
        } else if (setting.key === 'social') {
          setSocial(value as unknown as SocialSettings);
        } else if (setting.key === 'homepage') {
          setHomepage(value as unknown as HomepageSettings);
        } else if (setting.key === 'theme') {
          setTheme(value as unknown as ThemeSettings);
        } else if (setting.key === 'about') {
          setAbout(value as unknown as AboutSettings);
        } else if (setting.key === 'contact') {
          setContact(value as unknown as ContactSettings);
        }
      });
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (key: string, value: GeneralSettings | SocialSettings | HomepageSettings | ThemeSettings) => {
    setSaving(true);
    try {
      // First check if the setting exists
      const { data: existing } = await supabase
        .from('site_settings')
        .select('id')
        .eq('key', key)
        .single();
      
      if (existing) {
        // Update existing setting
        const { error } = await supabase
          .from('site_settings')
          .update({ value: value as unknown as Json })
          .eq('key', key);
        
        if (error) throw error;
      } else {
        // Insert new setting
        const { error } = await supabase
          .from('site_settings')
          .insert({ key, value: value as unknown as Json });
        
        if (error) throw error;
      }
      
      toast.success('Settings saved successfully');
      // Refresh settings to show updated values
      await fetchSettings();
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Website Settings</h1>
          <p className="text-muted-foreground mt-1">Control every aspect of your website</p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:inline-grid">
            <TabsTrigger value="general" className="gap-2">
              <Settings className="h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="social" className="gap-2">
              <Globe className="h-4 w-4" />
              Social
            </TabsTrigger>
            <TabsTrigger value="homepage" className="gap-2">
              <Home className="h-4 w-4" />
              Homepage
            </TabsTrigger>
            <TabsTrigger value="about" className="gap-2">
              <Users className="h-4 w-4" />
              About
            </TabsTrigger>
            <TabsTrigger value="contact" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Contact
            </TabsTrigger>
            <TabsTrigger value="theme" className="gap-2">
              <Palette className="h-4 w-4" />
              Colors
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Site Information</CardTitle>
                <CardDescription>Basic information about your website</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input
                      id="siteName"
                      value={general.siteName}
                      onChange={(e) => setGeneral({ ...general, siteName: e.target.value })}
                      placeholder="Your Company Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tagline">Tagline</Label>
                    <Input
                      id="tagline"
                      value={general.tagline}
                      onChange={(e) => setGeneral({ ...general, tagline: e.target.value })}
                      placeholder="Your company tagline"
                    />
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Logo</Label>
                    <ImageUpload
                      value={general.logo || undefined}
                      onChange={(url) => setGeneral({ ...general, logo: url })}
                      folder="branding"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Favicon</Label>
                    <ImageUpload
                      value={general.favicon || undefined}
                      onChange={(url) => setGeneral({ ...general, favicon: url })}
                      folder="branding"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>How customers can reach you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" /> Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={general.email}
                      onChange={(e) => setGeneral({ ...general, email: e.target.value })}
                      placeholder="info@yourcompany.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" /> Phone
                    </Label>
                    <Input
                      id="phone"
                      value={general.phone}
                      onChange={(e) => setGeneral({ ...general, phone: e.target.value })}
                      placeholder="+255 123 456 789"
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <Input
                      id="whatsapp"
                      value={general.whatsapp}
                      onChange={(e) => setGeneral({ ...general, whatsapp: e.target.value })}
                      placeholder="+255 123 456 789"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" /> Address
                    </Label>
                    <Input
                      id="address"
                      value={general.address}
                      onChange={(e) => setGeneral({ ...general, address: e.target.value })}
                      placeholder="Arusha, Tanzania"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button 
              onClick={() => saveSettings('general', general)}
              disabled={saving}
              className="w-full md:w-auto"
            >
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              Save General Settings
            </Button>
          </TabsContent>

          {/* Social Settings */}
          <TabsContent value="social" className="space-y-6">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Social Media Links</CardTitle>
                <CardDescription>Connect your social media profiles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="facebook" className="flex items-center gap-2">
                      <Facebook className="h-4 w-4" /> Facebook
                    </Label>
                    <Input
                      id="facebook"
                      value={social.facebook}
                      onChange={(e) => setSocial({ ...social, facebook: e.target.value })}
                      placeholder="https://facebook.com/yourpage"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instagram" className="flex items-center gap-2">
                      <Instagram className="h-4 w-4" /> Instagram
                    </Label>
                    <Input
                      id="instagram"
                      value={social.instagram}
                      onChange={(e) => setSocial({ ...social, instagram: e.target.value })}
                      placeholder="https://instagram.com/yourpage"
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="twitter" className="flex items-center gap-2">
                      <Twitter className="h-4 w-4" /> Twitter / X
                    </Label>
                    <Input
                      id="twitter"
                      value={social.twitter}
                      onChange={(e) => setSocial({ ...social, twitter: e.target.value })}
                      placeholder="https://twitter.com/yourpage"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="youtube" className="flex items-center gap-2">
                      <Youtube className="h-4 w-4" /> YouTube
                    </Label>
                    <Input
                      id="youtube"
                      value={social.youtube}
                      onChange={(e) => setSocial({ ...social, youtube: e.target.value })}
                      placeholder="https://youtube.com/yourchannel"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tripadvisor">TripAdvisor</Label>
                  <Input
                    id="tripadvisor"
                    value={social.tripadvisor}
                    onChange={(e) => setSocial({ ...social, tripadvisor: e.target.value })}
                    placeholder="https://tripadvisor.com/yourpage"
                  />
                </div>
              </CardContent>
            </Card>

            <Button 
              onClick={() => saveSettings('social', social)}
              disabled={saving}
              className="w-full md:w-auto"
            >
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              Save Social Settings
            </Button>
          </TabsContent>

          {/* Homepage Settings */}
          <TabsContent value="homepage" className="space-y-6">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Hero Section</CardTitle>
                <CardDescription>Customize the main hero section on your homepage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="heroTitle">Hero Title</Label>
                  <Input
                    id="heroTitle"
                    value={homepage.heroTitle}
                    onChange={(e) => setHomepage({ ...homepage, heroTitle: e.target.value })}
                    placeholder="Your main headline"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
                  <Textarea
                    id="heroSubtitle"
                    value={homepage.heroSubtitle}
                    onChange={(e) => setHomepage({ ...homepage, heroSubtitle: e.target.value })}
                    placeholder="Supporting text for the hero"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Hero Background Video URL</Label>
                  <Input
                    value={homepage.heroVideo || ''}
                    onChange={(e) => setHomepage({ ...homepage, heroVideo: e.target.value || null })}
                    placeholder="https://youtube.com/watch?v=... or video file URL"
                  />
                  <p className="text-xs text-muted-foreground">Leave empty to use the default image</p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Section Visibility</CardTitle>
                <CardDescription>Show or hide sections on your homepage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Popular Destinations</Label>
                    <p className="text-sm text-muted-foreground">Show featured tours and destinations</p>
                  </div>
                  <Switch
                    checked={homepage.showDestinations}
                    onCheckedChange={(checked) => setHomepage({ ...homepage, showDestinations: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Tour Packages</Label>
                    <p className="text-sm text-muted-foreground">Show featured tour packages</p>
                  </div>
                  <Switch
                    checked={homepage.showPackages}
                    onCheckedChange={(checked) => setHomepage({ ...homepage, showPackages: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Testimonials</Label>
                    <p className="text-sm text-muted-foreground">Show customer reviews</p>
                  </div>
                  <Switch
                    checked={homepage.showTestimonials}
                    onCheckedChange={(checked) => setHomepage({ ...homepage, showTestimonials: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Why Choose Us</Label>
                    <p className="text-sm text-muted-foreground">Show company benefits section</p>
                  </div>
                  <Switch
                    checked={homepage.showWhyChooseUs}
                    onCheckedChange={(checked) => setHomepage({ ...homepage, showWhyChooseUs: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            <Button 
              onClick={() => saveSettings('homepage', homepage)}
              disabled={saving}
              className="w-full md:w-auto"
            >
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              Save Homepage Settings
            </Button>
          </TabsContent>

          {/* About Page Settings */}
          <TabsContent value="about" className="space-y-6">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>About Page Hero</CardTitle>
                <CardDescription>Customize the About Us page header</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="aboutHeroTitle">Hero Title</Label>
                  <Input
                    id="aboutHeroTitle"
                    value={about.heroTitle}
                    onChange={(e) => setAbout({ ...about, heroTitle: e.target.value })}
                    placeholder="Our Story"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aboutHeroSubtitle">Hero Subtitle</Label>
                  <Textarea
                    id="aboutHeroSubtitle"
                    value={about.heroSubtitle}
                    onChange={(e) => setAbout({ ...about, heroSubtitle: e.target.value })}
                    placeholder="Your gateway to endless exploration..."
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="foundedYear">Founded Year</Label>
                  <Input
                    id="foundedYear"
                    value={about.foundedYear}
                    onChange={(e) => setAbout({ ...about, foundedYear: e.target.value })}
                    placeholder="2009"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Company Statistics</CardTitle>
                <CardDescription>Numbers displayed on the About page</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Happy Travelers</Label>
                    <Input
                      value={about.stats.travelers}
                      onChange={(e) => setAbout({ ...about, stats: { ...about.stats, travelers: e.target.value } })}
                      placeholder="5000+"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Years Experience</Label>
                    <Input
                      value={about.stats.experience}
                      onChange={(e) => setAbout({ ...about, stats: { ...about.stats, experience: e.target.value } })}
                      placeholder="15+"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Destinations</Label>
                    <Input
                      value={about.stats.destinations}
                      onChange={(e) => setAbout({ ...about, stats: { ...about.stats, destinations: e.target.value } })}
                      placeholder="50+"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Company Story</CardTitle>
                <CardDescription>The narrative about your company</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="story">Our Story</Label>
                  <Textarea
                    id="story"
                    value={about.story}
                    onChange={(e) => setAbout({ ...about, story: e.target.value })}
                    placeholder="Tell your company's story..."
                    rows={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mission">Mission Statement / Quote</Label>
                  <Textarea
                    id="mission"
                    value={about.mission}
                    onChange={(e) => setAbout({ ...about, mission: e.target.value })}
                    placeholder="Your company mission or inspiring quote..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Button 
              onClick={() => saveSettings('about', about)}
              disabled={saving}
              className="w-full md:w-auto"
            >
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              Save About Settings
            </Button>
          </TabsContent>

          {/* Contact Page Settings */}
          <TabsContent value="contact" className="space-y-6">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Contact Page Content</CardTitle>
                <CardDescription>Customize the Contact Us page</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contactHeroTitle">Hero Title</Label>
                  <Input
                    id="contactHeroTitle"
                    value={contact.heroTitle}
                    onChange={(e) => setContact({ ...contact, heroTitle: e.target.value })}
                    placeholder="Let's Plan Your Adventure"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactHeroSubtitle">Hero Subtitle</Label>
                  <Textarea
                    id="contactHeroSubtitle"
                    value={contact.heroSubtitle}
                    onChange={(e) => setContact({ ...contact, heroSubtitle: e.target.value })}
                    placeholder="Have questions? We're here to help..."
                    rows={2}
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="officeHours">Office Hours</Label>
                    <Input
                      id="officeHours"
                      value={contact.officeHours}
                      onChange={(e) => setContact({ ...contact, officeHours: e.target.value })}
                      placeholder="Mon-Sat: 8:00 AM - 6:00 PM (EAT)"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="responseTime">Response Time</Label>
                    <Input
                      id="responseTime"
                      value={contact.responseTime}
                      onChange={(e) => setContact({ ...contact, responseTime: e.target.value })}
                      placeholder="24 hours"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mapEmbed">Google Maps Embed URL (optional)</Label>
                  <Input
                    id="mapEmbed"
                    value={contact.mapEmbed}
                    onChange={(e) => setContact({ ...contact, mapEmbed: e.target.value })}
                    placeholder="https://www.google.com/maps/embed?..."
                  />
                  <p className="text-xs text-muted-foreground">Paste the embed URL from Google Maps</p>
                </div>
              </CardContent>
            </Card>

            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Tip:</strong> Contact information (email, phone, address) is managed in the General settings tab.
              </p>
            </div>

            <Button 
              onClick={() => saveSettings('contact', contact)}
              disabled={saving}
              className="w-full md:w-auto"
            >
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              Save Contact Settings
            </Button>
          </TabsContent>

          {/* Theme/Colors Settings */}
          <TabsContent value="theme" className="space-y-6">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Brand Colors</CardTitle>
                <CardDescription>Customize your website's color scheme (Blue, Gold & White)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="space-y-3">
                    <Label htmlFor="primaryColor">Primary Color (Blue)</Label>
                    <div className="flex gap-3 items-center">
                      <input
                        type="color"
                        id="primaryColor"
                        value={theme.primaryColor}
                        onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
                        className="w-16 h-12 rounded-lg border border-border cursor-pointer"
                      />
                      <Input
                        value={theme.primaryColor}
                        onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
                        placeholder="#2563eb"
                        className="flex-1"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Used for buttons, links, headers</p>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="accentColor">Accent Color (Gold)</Label>
                    <div className="flex gap-3 items-center">
                      <input
                        type="color"
                        id="accentColor"
                        value={theme.accentColor}
                        onChange={(e) => setTheme({ ...theme, accentColor: e.target.value })}
                        className="w-16 h-12 rounded-lg border border-border cursor-pointer"
                      />
                      <Input
                        value={theme.accentColor}
                        onChange={(e) => setTheme({ ...theme, accentColor: e.target.value })}
                        placeholder="#eab308"
                        className="flex-1"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Used for highlights, badges, special elements</p>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="backgroundColor">Background Color (White)</Label>
                    <div className="flex gap-3 items-center">
                      <input
                        type="color"
                        id="backgroundColor"
                        value={theme.backgroundColor}
                        onChange={(e) => setTheme({ ...theme, backgroundColor: e.target.value })}
                        className="w-16 h-12 rounded-lg border border-border cursor-pointer"
                      />
                      <Input
                        value={theme.backgroundColor}
                        onChange={(e) => setTheme({ ...theme, backgroundColor: e.target.value })}
                        placeholder="#ffffff"
                        className="flex-1"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Main background color</p>
                  </div>
                </div>

                {/* Color Preview */}
                <div className="mt-6 p-6 rounded-xl border border-border">
                  <Label className="mb-4 block">Preview</Label>
                  <div className="flex gap-4 items-center flex-wrap">
                    <div 
                      className="px-6 py-3 rounded-lg text-white font-medium"
                      style={{ backgroundColor: theme.primaryColor }}
                    >
                      Primary Button
                    </div>
                    <div 
                      className="px-6 py-3 rounded-lg text-black font-medium"
                      style={{ backgroundColor: theme.accentColor }}
                    >
                      Gold Accent
                    </div>
                    <div 
                      className="px-6 py-3 rounded-lg border-2 font-medium"
                      style={{ 
                        backgroundColor: theme.backgroundColor,
                        borderColor: theme.primaryColor,
                        color: theme.primaryColor
                      }}
                    >
                      Outlined
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    <strong>Note:</strong> Color changes require a website rebuild to take effect. 
                    After saving, the changes will be applied on the next deployment.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Button 
              onClick={() => saveSettings('theme', theme)}
              disabled={saving}
              className="w-full md:w-auto"
            >
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              Save Theme Settings
            </Button>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;