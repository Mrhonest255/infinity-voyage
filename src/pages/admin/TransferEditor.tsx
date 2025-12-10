import { useState, useEffect } from 'react';
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
import { ArrowLeft, Save, Loader2, Plus, X, Car } from 'lucide-react';

interface TransferFormData {
  title: string;
  slug: string;
  description: string;
  short_description: string;
  transfer_type: string;
  route_from: string;
  route_to: string;
  price_small_group: number | null;
  price_large_group: number | null;
  vehicle_type: string;
  max_passengers: number;
  duration: string;
  features: string[];
  featured_image: string;
  gallery: string[];
  is_featured: boolean;
  is_published: boolean;
}

const initialFormData: TransferFormData = {
  title: '',
  slug: '',
  description: '',
  short_description: '',
  transfer_type: 'airport',
  route_from: '',
  route_to: '',
  price_small_group: null,
  price_large_group: null,
  vehicle_type: 'minivan',
  max_passengers: 12,
  duration: '',
  features: [],
  featured_image: '',
  gallery: [],
  is_featured: false,
  is_published: false,
};

const TransferEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isNew = id === 'new';

  const [formData, setFormData] = useState<TransferFormData>(initialFormData);
  const [newFeature, setNewFeature] = useState('');

  // Fetch existing transfer
  const { data: transfer, isLoading } = useQuery({
    queryKey: ['transfer', id],
    queryFn: async () => {
      if (isNew) return null;
      const { data, error } = await (supabase.from('transfers' as any).select('*').eq('id', id).single() as any);
      if (error) throw error;
      return data;
    },
    enabled: !isNew,
  });

  useEffect(() => {
    if (transfer) {
      setFormData({
        title: (transfer as any).title || '',
        slug: (transfer as any).slug || '',
        description: (transfer as any).description || '',
        short_description: (transfer as any).short_description || '',
        transfer_type: (transfer as any).transfer_type || 'airport',
        route_from: (transfer as any).route_from || '',
        route_to: (transfer as any).route_to || '',
        price_small_group: (transfer as any).price_small_group,
        price_large_group: (transfer as any).price_large_group,
        vehicle_type: (transfer as any).vehicle_type || 'minivan',
        max_passengers: (transfer as any).max_passengers || 12,
        duration: (transfer as any).duration || '',
        features: (transfer as any).features || [],
        featured_image: (transfer as any).featured_image || '',
        gallery: (transfer as any).gallery || [],
        is_featured: (transfer as any).is_featured || false,
        is_published: (transfer as any).is_published || false,
      });
    }
  }, [transfer]);

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (data: TransferFormData) => {
      const payload = {
        ...data,
        slug: data.slug || generateSlug(data.title),
      };

      if (isNew) {
        const { error } = await (supabase.from('transfers' as any).insert(payload) as any);
        if (error) throw error;
      } else {
        const { error } = await (supabase.from('transfers' as any).update(payload).eq('id', id) as any);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-transfers'] });
      queryClient.invalidateQueries({ queryKey: ['public-transfers'] });
      toast({ title: 'Success!', description: `Transfer ${isNew ? 'created' : 'updated'} successfully.` });
      navigate('/admin/transfers');
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast({ title: 'Title required', description: 'Please enter a title.', variant: 'destructive' });
      return;
    }
    if (!formData.route_from.trim() || !formData.route_to.trim()) {
      toast({ title: 'Route required', description: 'Please enter pickup and destination locations.', variant: 'destructive' });
      return;
    }
    saveMutation.mutate(formData);
  };

  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData(prev => ({ ...prev, features: [...prev.features, newFeature.trim()] }));
      setNewFeature('');
    }
  };

  const removeFeature = (feature: string) => {
    setFormData(prev => ({ ...prev, features: prev.features.filter(f => f !== feature) }));
  };

  if (isLoading) {
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
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button type="button" variant="ghost" size="icon" onClick={() => navigate('/admin/transfers')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground">
                {isNew ? 'New Transfer' : 'Edit Transfer'}
              </h1>
              <p className="text-muted-foreground mt-1">
                {isNew ? 'Create a new transfer service' : `Editing: ${formData.title}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button type="button" variant="outline" onClick={() => navigate('/admin/transfers')}>
              Cancel
            </Button>
            <Button type="submit" variant="safari" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Transfer
                </>
              )}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList>
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="pricing">Route & Pricing</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
          </TabsList>

          {/* Basic Info */}
          <TabsContent value="basic" className="space-y-6">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5 text-primary" />
                  Basic Information
                </CardTitle>
                <CardDescription>Enter the transfer service details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          title: e.target.value,
                          slug: generateSlug(e.target.value)
                        }));
                      }}
                      placeholder="Airport to Beach Hotels"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">URL Slug</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                      placeholder="airport-beach-hotels"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="short_description">Short Description</Label>
                  <Input
                    id="short_description"
                    value={formData.short_description}
                    onChange={(e) => setFormData(prev => ({ ...prev, short_description: e.target.value }))}
                    placeholder="Brief description for cards and previews"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Full Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Detailed description of the transfer service..."
                    rows={5}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="transfer_type">Transfer Type</Label>
                    <select
                      id="transfer_type"
                      value={formData.transfer_type}
                      onChange={(e) => setFormData(prev => ({ ...prev, transfer_type: e.target.value }))}
                      className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="airport">Airport Transfer</option>
                      <option value="hotel">Hotel to Hotel</option>
                      <option value="port">Port/Ferry Transfer</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vehicle_type">Vehicle Type</Label>
                    <select
                      id="vehicle_type"
                      value={formData.vehicle_type}
                      onChange={(e) => setFormData(prev => ({ ...prev, vehicle_type: e.target.value }))}
                      className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="sedan">Sedan (1-3 passengers)</option>
                      <option value="minivan">Minivan (1-6 passengers)</option>
                      <option value="van">Van (7-12 passengers)</option>
                      <option value="bus">Bus (13+ passengers)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2">
                      <Switch
                        id="is_published"
                        checked={formData.is_published}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_published: checked }))}
                      />
                      <Label htmlFor="is_published">Published</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        id="is_featured"
                        checked={formData.is_featured}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
                      />
                      <Label htmlFor="is_featured">Featured</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Route & Pricing */}
          <TabsContent value="pricing" className="space-y-6">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Route Information</CardTitle>
                <CardDescription>Define pickup and destination locations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="route_from">Pickup Location *</Label>
                    <Input
                      id="route_from"
                      value={formData.route_from}
                      onChange={(e) => setFormData(prev => ({ ...prev, route_from: e.target.value }))}
                      placeholder="Zanzibar Airport (ZNZ)"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="route_to">Destination *</Label>
                    <Input
                      id="route_to"
                      value={formData.route_to}
                      onChange={(e) => setFormData(prev => ({ ...prev, route_to: e.target.value }))}
                      placeholder="Stone Town Hotels"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                      id="duration"
                      value={formData.duration}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                      placeholder="30-45 minutes"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max_passengers">Max Passengers</Label>
                    <Input
                      id="max_passengers"
                      type="number"
                      value={formData.max_passengers}
                      onChange={(e) => setFormData(prev => ({ ...prev, max_passengers: parseInt(e.target.value) || 12 }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
                <CardDescription>Set prices for different group sizes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price_small_group">Price (1-6 passengers) USD</Label>
                    <Input
                      id="price_small_group"
                      type="number"
                      value={formData.price_small_group || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, price_small_group: e.target.value ? parseFloat(e.target.value) : null }))}
                      placeholder="27"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price_large_group">Price (7-12 passengers) USD</Label>
                    <Input
                      id="price_large_group"
                      type="number"
                      value={formData.price_large_group || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, price_large_group: e.target.value ? parseFloat(e.target.value) : null }))}
                      placeholder="54"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Features */}
          <TabsContent value="features" className="space-y-6">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Included Features</CardTitle>
                <CardDescription>What's included in this transfer service</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="e.g., Air-conditioned vehicle"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addFeature();
                      }
                    }}
                  />
                  <Button type="button" onClick={addFeature} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-2"
                    >
                      <span className="text-sm">{feature}</span>
                      <button
                        type="button"
                        onClick={() => removeFeature(feature)}
                        className="hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  {formData.features.length === 0 && (
                    <p className="text-muted-foreground text-sm">No features added yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Media */}
          <TabsContent value="media" className="space-y-6">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Featured Image</CardTitle>
                <CardDescription>Main image for the transfer service</CardDescription>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  value={formData.featured_image}
                  onChange={(url) => setFormData(prev => ({ ...prev, featured_image: url }))}
                  folder="transfers"
                />
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Gallery</CardTitle>
                <CardDescription>Additional images</CardDescription>
              </CardHeader>
              <CardContent>
                <GalleryUpload
                  value={formData.gallery}
                  onChange={(urls) => setFormData(prev => ({ ...prev, gallery: urls }))}
                  folder="transfers"
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </AdminLayout>
  );
};

export default TransferEditor;
