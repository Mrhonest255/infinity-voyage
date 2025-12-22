import { useState, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import ImageUpload from '@/components/admin/ImageUpload';
import GalleryUpload from '@/components/admin/GalleryUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, Save, Sparkles, Loader2, Plus, X, MapPin, DollarSign, AlertTriangle } from 'lucide-react';

// Error Boundary Component
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ActivityEditorErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ActivityEditor Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <AdminLayout>
          <div className="max-w-2xl mx-auto py-12">
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  Something went wrong
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  An error occurred while loading the activity editor.
                </p>
                {this.state.error && (
                  <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto">
                    {this.state.error.message}
                  </pre>
                )}
                <div className="flex gap-2">
                  <Button onClick={() => window.location.reload()}>
                    Reload Page
                  </Button>
                  <Button variant="outline" onClick={() => window.history.back()}>
                    Go Back
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </AdminLayout>
      );
    }

    return this.props.children;
  }
}

// Define pickup zones for pricing
const PICKUP_ZONES = [
  { id: 'stone_town', name: 'Stone Town Hotels', description: 'Stone Town and central area' },
  { id: 'beach_north', name: 'North Coast (Nungwi/Kendwa)', description: 'Nungwi, Kendwa beaches' },
  { id: 'beach_east', name: 'East Coast (Paje/Jambiani)', description: 'Paje, Jambiani, Bwejuu' },
  { id: 'beach_south', name: 'South Coast (Kizimkazi)', description: 'Kizimkazi and southern beaches' },
];

interface ZonePrices {
  [key: string]: number | null;
}

interface ActivityFormData {
  title: string;
  slug: string;
  description: string;
  short_description: string;
  duration: string;
  price: number | null;
  zone_prices: ZonePrices;
  location: string;
  category: string;
  included: string[];
  excluded: string[];
  highlights: string[];
  featured_image: string;
  gallery: string[];
  is_featured: boolean;
  is_published: boolean;
}

const initialFormData: ActivityFormData = {
  title: '',
  slug: '',
  description: '',
  short_description: '',
  duration: '',
  price: null,
  zone_prices: {},
  location: '',
  category: 'excursion',
  included: [],
  excluded: [],
  highlights: [],
  featured_image: '',
  gallery: [],
  is_featured: false,
  is_published: false,
};

const ActivityEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isNew = id === 'new';

  const [formData, setFormData] = useState<ActivityFormData>(initialFormData);
  const [generating, setGenerating] = useState(false);
  const [newIncluded, setNewIncluded] = useState('');
  const [newExcluded, setNewExcluded] = useState('');
  const [newHighlight, setNewHighlight] = useState('');

  const { data: activity, isLoading } = useQuery({
    queryKey: ['activity', id],
    queryFn: async () => {
      if (isNew) return null;
      const { data, error } = await supabase.from('activities').select('*').eq('id', id).single();
      if (error) throw error;
      return data;
    },
    enabled: !isNew,
  });

  useEffect(() => {
    if (activity) {
      setFormData({
        title: activity.title || '',
        slug: activity.slug || '',
        description: activity.description || '',
        short_description: activity.short_description || '',
        duration: activity.duration || '',
        price: activity.price,
        zone_prices: (activity as any).zone_prices || {},
        location: activity.location || '',
        category: activity.category || 'excursion',
        included: activity.included || [],
        excluded: activity.excluded || [],
        highlights: activity.highlights || [],
        featured_image: activity.featured_image || '',
        gallery: activity.gallery || [],
        is_featured: activity.is_featured || false,
        is_published: activity.is_published || false,
      });
    }
  }, [activity]);

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').trim();
  };

  const generateWithAI = async () => {
    if (!formData.title.trim()) {
      toast({ title: 'Title required', description: 'Please enter a title first.', variant: 'destructive' });
      return;
    }

    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-tour-content', {
        body: { title: formData.title, type: 'activity' }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to call AI function');
      }
      
      if (!data) {
        throw new Error('No data received from AI function');
      }
      
      if (data.error) {
        throw new Error(data.error);
      }

      const content = data.content;
      if (!content) {
        throw new Error('No content in AI response');
      }
      
      setFormData(prev => ({
        ...prev,
        description: content.description || prev.description,
        short_description: content.short_description || prev.short_description,
        duration: content.duration || prev.duration,
        price: content.price || prev.price,
        location: content.location || prev.location,
        included: Array.isArray(content.included) ? content.included : prev.included,
        excluded: Array.isArray(content.excluded) ? content.excluded : prev.excluded,
        highlights: Array.isArray(content.highlights) ? content.highlights : prev.highlights,
        slug: generateSlug(formData.title),
      }));

      toast({ title: 'Content generated!', description: 'AI has generated activity content.' });
    } catch (error: any) {
      console.error('Generate AI error:', error);
      toast({ 
        title: 'Generation failed', 
        description: error?.message || 'An unexpected error occurred. Please try again.', 
        variant: 'destructive' 
      });
    } finally {
      setGenerating(false);
    }
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      // Validate required fields
      if (!formData.title.trim()) {
        throw new Error('Title is required');
      }
      
      const slug = formData.slug || generateSlug(formData.title);
      if (!slug) {
        throw new Error('Could not generate slug from title');
      }

      // Build activity data - exclude zone_prices if not in the database schema
      const activityData: Record<string, any> = {
        title: formData.title.trim(),
        slug: slug,
        description: formData.description || null,
        short_description: formData.short_description || null,
        duration: formData.duration || null,
        price: formData.price,
        location: formData.location || null,
        category: formData.category || 'excursion',
        included: formData.included.length > 0 ? formData.included : null,
        excluded: formData.excluded.length > 0 ? formData.excluded : null,
        highlights: formData.highlights.length > 0 ? formData.highlights : null,
        featured_image: formData.featured_image || null,
        gallery: formData.gallery.length > 0 ? formData.gallery : null,
        is_featured: formData.is_featured,
        is_published: formData.is_published,
      };

      // Only add zone_prices if it has values
      if (Object.keys(formData.zone_prices).length > 0) {
        activityData.zone_prices = formData.zone_prices;
      }

      // Add created_by only for new records
      if (isNew && user?.id) {
        activityData.created_by = user.id;
      }

      console.log('Saving activity:', isNew ? 'INSERT' : 'UPDATE', activityData);

      if (isNew) {
        const { data, error } = await supabase
          .from('activities')
          .insert(activityData as any)
          .select()
          .single();
        
        if (error) {
          console.error('Insert error:', error);
          throw new Error(error.message || 'Failed to create activity');
        }
        return data;
      } else {
        const { data, error } = await supabase
          .from('activities')
          .update(activityData as any)
          .eq('id', id)
          .select()
          .single();
        
        if (error) {
          console.error('Update error:', error);
          throw new Error(error.message || 'Failed to update activity');
        }
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-activities'] });
      toast({ title: 'Activity saved successfully!' });
      navigate('/admin/activities');
    },
    onError: (error: Error) => {
      console.error('Save mutation error:', error);
      toast({ 
        title: 'Save failed', 
        description: error?.message || 'An unexpected error occurred. Please try again.', 
        variant: 'destructive' 
      });
    },
  });

  const addArrayItem = (field: 'included' | 'excluded' | 'highlights', value: string, setter: (v: string) => void) => {
    if (value.trim()) {
      setFormData(prev => ({ ...prev, [field]: [...prev[field], value.trim()] }));
      setter('');
    }
  };

  const removeArrayItem = (field: 'included' | 'excluded' | 'highlights', index: number) => {
    setFormData(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
  };

  if (!isNew && isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/admin/activities')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground">
                {isNew ? 'Create New Activity' : 'Edit Activity'}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={generateWithAI} disabled={generating || !formData.title}>
              {generating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
              Generate with AI
            </Button>
            <Button variant="safari" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
              {saveMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Save Activity
            </Button>
          </div>
        </div>

        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="pricing">Zone Pricing</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Title *</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        title: e.target.value,
                        slug: generateSlug(e.target.value)
                      }))}
                      placeholder="e.g., Stone Town Walking Tour"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="e.g., Stone Town, Zanzibar"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Short Description</Label>
                  <Textarea
                    value={formData.short_description}
                    onChange={(e) => setFormData(prev => ({ ...prev, short_description: e.target.value }))}
                    placeholder="Brief summary..."
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Full Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Detailed description..."
                    rows={5}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Duration</Label>
                    <Input
                      value={formData.duration}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                      placeholder="e.g., Half Day (4-5 hours)"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Price (USD)</Label>
                    <Input
                      type="number"
                      value={formData.price || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || null }))}
                      placeholder="150"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-6 pt-4">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={formData.is_featured}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
                    />
                    <Label>Featured</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={formData.is_published}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_published: checked }))}
                    />
                    <Label>Published</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Zone-Based Pricing Tab */}
          <TabsContent value="pricing">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-safari-gold" />
                  Zone-Based Pricing
                </CardTitle>
                <CardDescription>
                  Set different prices based on pickup location. Leave empty to use the base price.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Base Price */}
                <div className="p-4 bg-muted/50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-base font-semibold">Base Price (Default)</Label>
                    <span className="text-xs text-muted-foreground">Used when no zone price is set</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <Input
                      type="number"
                      value={formData.price || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || null }))}
                      placeholder="0"
                      className="max-w-[150px]"
                    />
                    <span className="text-sm text-muted-foreground">USD per person</span>
                  </div>
                </div>

                {/* Zone Prices */}
                <div className="space-y-4">
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Pickup Zone Prices</h4>
                  <div className="grid gap-4">
                    {PICKUP_ZONES.map((zone) => (
                      <div key={zone.id} className="flex items-center gap-4 p-4 border rounded-xl hover:bg-muted/30 transition-colors">
                        <div className="flex-1">
                          <p className="font-medium">{zone.name}</p>
                          <p className="text-sm text-muted-foreground">{zone.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <Input
                            type="number"
                            value={formData.zone_prices[zone.id] || ''}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              zone_prices: {
                                ...prev.zone_prices,
                                [zone.id]: parseFloat(e.target.value) || null
                              }
                            }))}
                            placeholder={formData.price?.toString() || '0'}
                            className="w-[120px]"
                          />
                          <span className="text-sm text-muted-foreground">USD</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Summary */}
                <div className="p-4 bg-gradient-to-r from-safari-gold/10 to-safari-amber/10 rounded-xl">
                  <h4 className="font-semibold mb-3">Price Summary</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                    <div className="p-2 bg-background rounded-lg">
                      <p className="text-muted-foreground">Base Price</p>
                      <p className="font-bold text-lg">${formData.price || 0}</p>
                    </div>
                    {PICKUP_ZONES.map((zone) => (
                      <div key={zone.id} className="p-2 bg-background rounded-lg">
                        <p className="text-muted-foreground text-xs">{zone.name}</p>
                        <p className="font-bold text-lg">
                          ${formData.zone_prices[zone.id] || formData.price || 0}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details">
            <div className="space-y-6">
              <Card className="shadow-soft">
                <CardHeader><CardTitle>What's Included</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      value={newIncluded}
                      onChange={(e) => setNewIncluded(e.target.value)}
                      placeholder="Add included item..."
                      onKeyPress={(e) => e.key === 'Enter' && addArrayItem('included', newIncluded, setNewIncluded)}
                    />
                    <Button type="button" variant="outline" onClick={() => addArrayItem('included', newIncluded, setNewIncluded)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.included.map((item, index) => (
                      <div key={index} className="flex items-center gap-1 bg-secondary px-3 py-1 rounded-full text-sm">
                        {item}
                        <button type="button" onClick={() => removeArrayItem('included', index)}><X className="h-3 w-3" /></button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-soft">
                <CardHeader><CardTitle>Highlights</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      value={newHighlight}
                      onChange={(e) => setNewHighlight(e.target.value)}
                      placeholder="Add highlight..."
                      onKeyPress={(e) => e.key === 'Enter' && addArrayItem('highlights', newHighlight, setNewHighlight)}
                    />
                    <Button type="button" variant="outline" onClick={() => addArrayItem('highlights', newHighlight, setNewHighlight)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.highlights.map((item, index) => (
                      <div key={index} className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                        {item}
                        <button type="button" onClick={() => removeArrayItem('highlights', index)}><X className="h-3 w-3" /></button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="media">
            <div className="space-y-6">
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle>Featured Image</CardTitle>
                </CardHeader>
                <CardContent>
                  <ImageUpload
                    value={formData.featured_image}
                    onChange={(url) => setFormData(prev => ({ ...prev, featured_image: url }))}
                    folder="activities"
                  />
                </CardContent>
              </Card>

              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle>Gallery</CardTitle>
                </CardHeader>
                <CardContent>
                  <GalleryUpload
                    value={formData.gallery}
                    onChange={(urls) => setFormData(prev => ({ ...prev, gallery: urls }))}
                    folder="activities/gallery"
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

// Wrap the editor with error boundary for better error handling
const ActivityEditorWithErrorBoundary = () => (
  <ActivityEditorErrorBoundary>
    <ActivityEditor />
  </ActivityEditorErrorBoundary>
);

export default ActivityEditorWithErrorBoundary;