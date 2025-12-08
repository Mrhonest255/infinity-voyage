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
  Save
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
        }
      });
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (key: string, value: GeneralSettings | SocialSettings | HomepageSettings) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({ key, value: value as unknown as Json });
      
      if (error) throw error;
      
      toast.success('Settings saved successfully');
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
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
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
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;