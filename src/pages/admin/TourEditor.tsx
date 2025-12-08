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
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, Save, Sparkles, Loader2, Plus, X } from 'lucide-react';

interface TourFormData {
  title: string;
  slug: string;
  description: string;
  short_description: string;
  duration: string;
  price: number | null;
  category: string;
  difficulty: string;
  max_group_size: number;
  included: string[];
  excluded: string[];
  highlights: string[];
  itinerary: { day: number; title: string; description: string; activities: string[] }[];
  featured_image: string;
  gallery: string[];
  is_featured: boolean;
  is_published: boolean;
}

const initialFormData: TourFormData = {
  title: '',
  slug: '',
  description: '',
  short_description: '',
  duration: '',
  price: null,
  category: 'safari',
  difficulty: 'moderate',
  max_group_size: 12,
  included: [],
  excluded: [],
  highlights: [],
  itinerary: [],
  featured_image: '',
  gallery: [],
  is_featured: false,
  is_published: false,
};

const TourEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isNew = id === 'new';

  const [formData, setFormData] = useState<TourFormData>(initialFormData);
  const [generating, setGenerating] = useState(false);
  const [newIncluded, setNewIncluded] = useState('');
  const [newExcluded, setNewExcluded] = useState('');
  const [newHighlight, setNewHighlight] = useState('');

  // Fetch existing tour
  const { data: tour, isLoading } = useQuery({
    queryKey: ['tour', id],
    queryFn: async () => {
      if (isNew) return null;
      const { data, error } = await supabase.from('tours').select('*').eq('id', id).single();
      if (error) throw error;
      return data;
    },
    enabled: !isNew,
  });

  useEffect(() => {
    if (tour) {
      setFormData({
        title: tour.title || '',
        slug: tour.slug || '',
        description: tour.description || '',
        short_description: tour.short_description || '',
        duration: tour.duration || '',
        price: tour.price,
        category: tour.category || 'safari',
        difficulty: tour.difficulty || 'moderate',
        max_group_size: tour.max_group_size || 12,
        included: tour.included || [],
        excluded: tour.excluded || [],
        highlights: tour.highlights || [],
        itinerary: (tour.itinerary as TourFormData['itinerary']) || [],
        featured_image: tour.featured_image || '',
        gallery: tour.gallery || [],
        is_featured: tour.is_featured || false,
        is_published: tour.is_published || false,
      });
    }
  }, [tour]);

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  // Handle AI generation
  const generateWithAI = async () => {
    if (!formData.title.trim()) {
      toast({ title: 'Title required', description: 'Please enter a title first.', variant: 'destructive' });
      return;
    }

    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-tour-content', {
        body: { title: formData.title, type: 'safari' }
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      const content = data.content;
      setFormData(prev => ({
        ...prev,
        description: content.description || prev.description,
        short_description: content.short_description || prev.short_description,
        duration: content.duration || prev.duration,
        price: content.price || prev.price,
        difficulty: content.difficulty || prev.difficulty,
        max_group_size: content.max_group_size || prev.max_group_size,
        included: content.included || prev.included,
        excluded: content.excluded || prev.excluded,
        highlights: content.highlights || prev.highlights,
        itinerary: content.itinerary || prev.itinerary,
        slug: generateSlug(formData.title),
      }));

      toast({ title: 'Content generated!', description: 'AI has generated tour content for you.' });
    } catch (error: any) {
      console.error('AI generation error:', error);
      toast({ 
        title: 'Generation failed', 
        description: error.message || 'Failed to generate content.', 
        variant: 'destructive' 
      });
    } finally {
      setGenerating(false);
    }
  };

  // Save tour
  const saveMutation = useMutation({
    mutationFn: async () => {
      const tourData = {
        ...formData,
        slug: formData.slug || generateSlug(formData.title),
        created_by: user?.id,
      };

      if (isNew) {
        const { error } = await supabase.from('tours').insert(tourData);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('tours').update(tourData).eq('id', id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-tours'] });
      toast({ title: 'Tour saved', description: 'Your tour has been saved successfully.' });
      navigate('/admin/tours');
    },
    onError: (error: Error) => {
      toast({ title: 'Save failed', description: error.message, variant: 'destructive' });
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
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/admin/tours')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground">
                {isNew ? 'Create New Tour' : 'Edit Tour'}
              </h1>
              <p className="text-muted-foreground text-sm">
                Fill in the details or use AI to generate content
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={generateWithAI}
              disabled={generating || !formData.title}
            >
              {generating ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              Generate with AI
            </Button>
            <Button
              variant="safari"
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending}
            >
              {saveMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Tour
            </Button>
          </div>
        </div>

        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
          </TabsList>

          {/* Basic Info */}
          <TabsContent value="basic">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Essential tour details</CardDescription>
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
                      placeholder="e.g., Serengeti Migration Safari"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>URL Slug</Label>
                    <Input
                      value={formData.slug}
                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                      placeholder="serengeti-migration-safari"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Short Description</Label>
                  <Textarea
                    value={formData.short_description}
                    onChange={(e) => setFormData(prev => ({ ...prev, short_description: e.target.value }))}
                    placeholder="Brief summary for cards and previews..."
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Full Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Detailed tour description..."
                    rows={6}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Duration</Label>
                    <Input
                      value={formData.duration}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                      placeholder="e.g., 5 Days / 4 Nights"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Price (USD)</Label>
                    <Input
                      type="number"
                      value={formData.price || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || null }))}
                      placeholder="2500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Max Group Size</Label>
                    <Input
                      type="number"
                      value={formData.max_group_size}
                      onChange={(e) => setFormData(prev => ({ ...prev, max_group_size: parseInt(e.target.value) || 12 }))}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-6 pt-4">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={formData.is_featured}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
                    />
                    <Label>Featured Tour</Label>
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

          {/* Details */}
          <TabsContent value="details">
            <div className="space-y-6">
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle>What's Included</CardTitle>
                </CardHeader>
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
                      <div key={index} className="flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
                        {item}
                        <button type="button" onClick={() => removeArrayItem('included', index)} className="ml-1 hover:text-destructive">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle>What's Excluded</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      value={newExcluded}
                      onChange={(e) => setNewExcluded(e.target.value)}
                      placeholder="Add excluded item..."
                      onKeyPress={(e) => e.key === 'Enter' && addArrayItem('excluded', newExcluded, setNewExcluded)}
                    />
                    <Button type="button" variant="outline" onClick={() => addArrayItem('excluded', newExcluded, setNewExcluded)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.excluded.map((item, index) => (
                      <div key={index} className="flex items-center gap-1 bg-destructive/10 text-destructive px-3 py-1 rounded-full text-sm">
                        {item}
                        <button type="button" onClick={() => removeArrayItem('excluded', index)} className="ml-1 hover:text-destructive">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle>Highlights</CardTitle>
                </CardHeader>
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
                        <button type="button" onClick={() => removeArrayItem('highlights', index)} className="ml-1 hover:text-destructive">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Itinerary */}
          <TabsContent value="itinerary">
            <Card className="shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Day-by-Day Itinerary</CardTitle>
                  <CardDescription>Plan each day of the tour</CardDescription>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    itinerary: [...prev.itinerary, { day: prev.itinerary.length + 1, title: '', description: '', activities: [] }]
                  }))}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Day
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.itinerary.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No itinerary days added yet. Click "Add Day" or use AI to generate.
                  </p>
                ) : (
                  formData.itinerary.map((day, index) => (
                    <div key={index} className="border border-border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-primary">Day {day.day}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          onClick={() => setFormData(prev => ({
                            ...prev,
                            itinerary: prev.itinerary.filter((_, i) => i !== index)
                          }))}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <Input
                        value={day.title}
                        onChange={(e) => {
                          const newItinerary = [...formData.itinerary];
                          newItinerary[index].title = e.target.value;
                          setFormData(prev => ({ ...prev, itinerary: newItinerary }));
                        }}
                        placeholder="Day title..."
                      />
                      <Textarea
                        value={day.description}
                        onChange={(e) => {
                          const newItinerary = [...formData.itinerary];
                          newItinerary[index].description = e.target.value;
                          setFormData(prev => ({ ...prev, itinerary: newItinerary }));
                        }}
                        placeholder="Day description..."
                        rows={3}
                      />
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Media */}
          <TabsContent value="media">
            <div className="space-y-6">
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle>Featured Image</CardTitle>
                  <CardDescription>Main image displayed on tour cards</CardDescription>
                </CardHeader>
                <CardContent>
                  <ImageUpload
                    value={formData.featured_image}
                    onChange={(url) => setFormData(prev => ({ ...prev, featured_image: url }))}
                    folder="tours"
                  />
                </CardContent>
              </Card>

              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle>Gallery</CardTitle>
                  <CardDescription>Additional images for the tour page</CardDescription>
                </CardHeader>
                <CardContent>
                  <GalleryUpload
                    value={formData.gallery}
                    onChange={(urls) => setFormData(prev => ({ ...prev, gallery: urls }))}
                    folder="tours/gallery"
                    maxImages={10}
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

export default TourEditor;