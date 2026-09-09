import { useState, useCallback } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  Images, 
  Upload, 
  Trash2, 
  Loader2, 
  Plus, 
  FolderPlus, 
  Check, 
  Filter, 
  Eye, 
  RefreshCw,
  ExternalLink
} from 'lucide-react';

export interface CustomGalleryImage {
  id: string;
  url: string;
  title: string;
  category: string;
  description?: string;
  created_at?: string;
}

const CATEGORIES = [
  { id: 'safari', label: 'Safari' },
  { id: 'wildlife', label: 'Wildlife' },
  { id: 'beach', label: 'Beach & Island' },
  { id: 'mountain', label: 'Kilimanjaro & Mountains' },
  { id: 'culture', label: 'Culture & Towns' },
];

export const AdminGallery = () => {
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ total: number; done: number }>({ total: 0, done: 0 });
  const [selectedCategory, setSelectedCategory] = useState<string>('safari');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Load custom gallery items from site_settings (key: 'custom_gallery')
  const { data: galleryItems = [], isLoading, refetch } = useQuery({
    queryKey: ['admin-gallery-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', 'custom_gallery')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading gallery:', error);
        return [];
      }

      if (!data?.value) return [];
      return (data.value as unknown as CustomGalleryImage[]) || [];
    },
  });

  // Save gallery items to site_settings
  const saveGallery = async (items: CustomGalleryImage[]) => {
    try {
      const { data: existing } = await supabase
        .from('site_settings')
        .select('id')
        .eq('key', 'custom_gallery')
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('site_settings')
          .update({ value: items as any, updated_at: new Date().toISOString() })
          .eq('key', 'custom_gallery');
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('site_settings')
          .insert({ key: 'custom_gallery', value: items as any });
        if (error) throw error;
      }

      queryClient.setQueryData(['admin-gallery-items'], items);
      queryClient.invalidateQueries({ queryKey: ['gallery-images'] });
      toast.success('Gallery updated successfully');
    } catch (err: any) {
      console.error('Save error:', err);
      toast.error('Failed to update gallery');
    }
  };

  // Bulk Upload Handler
  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadProgress({ total: files.length, done: 0 });

    const newItems: CustomGalleryImage[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const fileExt = file.name.split('.').pop() || 'jpg';
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9]/g, ' ').trim();
        const fileName = `gallery/${Date.now()}-${Math.random().toString(36).substring(5)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('tour-images')
          .upload(fileName, file);

        if (uploadError) {
          console.error(`Failed uploading ${file.name}:`, uploadError);
          continue;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('tour-images')
          .getPublicUrl(fileName);

        newItems.push({
          id: `gal-${Date.now()}-${Math.random().toString(36).substring(5)}`,
          url: publicUrl,
          title: cleanName || 'Safari Moment',
          category: selectedCategory,
          description: `Captured in Tanzania - ${selectedCategory}`,
          created_at: new Date().toISOString(),
        });
      } catch (err) {
        console.error('Error on file index', i, err);
      } finally {
        setUploadProgress(prev => ({ ...prev, done: prev.done + 1 }));
      }
    }

    if (newItems.length > 0) {
      const updated = [...newItems, ...galleryItems];
      await saveGallery(updated);
      toast.success(`Successfully uploaded ${newItems.length} photos!`);
    } else {
      toast.error('Could not upload selected photos. Ensure bucket allows storage.');
    }

    setUploading(false);
    e.target.value = '';
  };

  // Delete Image
  const handleDelete = async (id: string) => {
    const updated = galleryItems.filter(item => item.id !== id);
    await saveGallery(updated);
  };

  // Update item details
  const handleUpdateItem = async (id: string, field: 'title' | 'category', value: string) => {
    const updated = galleryItems.map(item => {
      if (item.id === id) return { ...item, [field]: value };
      return item;
    });
    await saveGallery(updated);
  };

  const filteredItems = filterCategory === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.category === filterCategory);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-2">
              <Images className="h-8 w-8 text-amber-500" />
              Photo Gallery Manager
            </h1>
            <p className="text-muted-foreground mt-1">
              Upload multiple high-resolution photos in bulk to show on the public gallery.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => window.open('/gallery', '_blank')} className="gap-1.5">
              <Eye className="w-4 h-4" /> View Live Gallery
            </Button>
            <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-1.5">
              <RefreshCw className="w-4 h-4" /> Refresh
            </Button>
          </div>
        </div>

        {/* Upload Card */}
        <Card className="shadow-soft border-dashed border-2 border-amber-500/40 bg-amber-50/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Upload className="h-5 w-5 text-amber-600" />
              Bulk Upload Photos
            </CardTitle>
            <CardDescription>
              Select multiple photos at once (JPG, PNG, WEBP). They will be automatically stored and added to your website gallery.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="space-y-1.5 flex-1 min-w-[200px]">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-600">Assign Category to Uploads</Label>
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 bg-white text-sm font-medium focus:ring-2 focus:ring-amber-500"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex-1 min-w-[250px] pt-5">
                <label className="relative flex items-center justify-center gap-2 w-full h-11 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm cursor-pointer shadow-md hover:shadow-lg transition-all">
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Uploading ({uploadProgress.done}/{uploadProgress.total})...</span>
                    </>
                  ) : (
                    <>
                      <FolderPlus className="w-4 h-4" />
                      <span>Choose Multiple Photos to Upload</span>
                    </>
                  )}
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleBulkUpload}
                    disabled={uploading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  />
                </label>
              </div>
            </div>

            {uploading && (
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden mt-3">
                <div 
                  className="bg-amber-500 h-2 transition-all duration-300"
                  style={{ width: `${(uploadProgress.done / (uploadProgress.total || 1)) * 100}%` }}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Gallery Management Grid */}
        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Uploaded Photos ({galleryItems.length})</CardTitle>
              <CardDescription>Manage titles, change categories, or remove photos.</CardDescription>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="h-9 px-3 rounded-lg border border-slate-200 text-xs font-medium bg-white"
              >
                <option value="all">All Categories ({galleryItems.length})</option>
                {CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
            </div>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-16 px-4 border border-dashed rounded-2xl bg-slate-50">
                <Images className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-700">No custom photos uploaded yet</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Use the green upload button above to upload photos from your device. They will immediately appear on the public /gallery page.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredItems.map((item) => (
                  <div key={item.id} className="group relative rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
                    {/* Image Preview */}
                    <div className="relative aspect-video bg-slate-100 overflow-hidden">
                      <img 
                        src={item.url} 
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <Badge className="absolute top-2 left-2 bg-slate-950/70 text-amber-400 backdrop-blur-sm text-[10px] uppercase font-bold border-none">
                        {item.category}
                      </Badge>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-600/90 text-white hover:bg-red-700 transition-colors shadow-sm"
                        title="Delete photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Meta / Edit */}
                    <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
                      <input
                        type="text"
                        defaultValue={item.title}
                        onBlur={(e) => handleUpdateItem(item.id, 'title', e.target.value)}
                        className="w-full text-xs font-bold text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-amber-500 focus:outline-none px-1 py-0.5"
                        placeholder="Add title..."
                      />
                      <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                        <select
                          value={item.category}
                          onChange={(e) => handleUpdateItem(item.id, 'category', e.target.value)}
                          className="text-[11px] font-medium text-slate-600 bg-slate-100 rounded px-2 py-1 border-none focus:ring-1 focus:ring-amber-500"
                        >
                          {CATEGORIES.map(c => (
                            <option key={c.id} value={c.id}>{c.label}</option>
                          ))}
                        </select>
                        <a 
                          href={item.url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-[10px] text-amber-600 hover:text-amber-700 flex items-center gap-0.5"
                        >
                          <ExternalLink className="w-2.5 h-2.5" /> Full
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminGallery;
