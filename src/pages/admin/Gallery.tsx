import { useState, useCallback } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
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
  Filter, 
  Eye, 
  RefreshCw,
  ExternalLink,
  RotateCcw,
  Edit3,
  Camera,
  Search,
  Link as LinkIcon
} from 'lucide-react';

export interface CustomGalleryImage {
  id: string;
  url: string;
  title: string;
  category: string;
  description?: string;
  created_at?: string;
}

export const INITIAL_GALLERY_PHOTOS: CustomGalleryImage[] = [
  { id: 'initial-1', url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800', title: 'Serengeti Sunset', category: 'safari', description: 'Beautiful sunset over the Serengeti plains' },
  { id: 'initial-2', url: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800', title: 'Lion Pride', category: 'wildlife', description: 'Majestic lions in their natural habitat' },
  { id: 'initial-3', url: 'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=800', title: 'African Elephant', category: 'wildlife', description: 'Elephant at a watering hole' },
  { id: 'initial-4', url: 'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=800', title: 'Zanzibar Beach', category: 'beach', description: 'Crystal clear waters of Zanzibar' },
  { id: 'initial-5', url: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=800', title: 'Mount Kilimanjaro', category: 'mountain', description: "Africa's highest peak" },
  { id: 'initial-6', url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800', title: 'Safari Drive', category: 'safari', description: 'Game drive in the savanna' },
  { id: 'initial-7', url: 'https://images.unsplash.com/photo-1534177616064-ef1f0a6f8b97?w=800', title: 'Giraffe Family', category: 'wildlife', description: 'Graceful giraffes at sunset' },
  { id: 'initial-8', url: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800', title: 'Stone Town', category: 'culture', description: 'Historic Stone Town architecture' },
  { id: 'initial-9', url: 'https://images.unsplash.com/photo-1504945005722-33670dcaf685?w=800', title: 'Ngorongoro Crater', category: 'safari', description: "The world's largest intact caldera" },
  { id: 'initial-10', url: 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=800', title: 'Zanzibar Sunset', category: 'beach', description: 'Magical sunset over the Indian Ocean' },
  { id: 'initial-11', url: 'https://images.unsplash.com/photo-1517960413843-0aee8e2b3285?w=800', title: 'Flamingos', category: 'wildlife', description: 'Pink flamingos at Lake Manyara' },
  { id: 'initial-12', url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800', title: 'Hot Air Balloon', category: 'safari', description: 'Balloon safari over the Serengeti' },
];

export const GALLERY_CATEGORIES = [
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
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [saving, setSaving] = useState(false);

  // Edit photo modal state
  const [editingImage, setEditingImage] = useState<CustomGalleryImage | null>(null);
  const [editUploading, setEditUploading] = useState(false);

  // Direct replace file tracker
  const [replacingId, setReplacingId] = useState<string | null>(null);

  // Add single photo modal state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newImage, setNewImage] = useState<{ title: string; category: string; url: string; description: string }>({
    title: '',
    category: 'safari',
    url: '',
    description: '',
  });
  const [addUploading, setAddUploading] = useState(false);

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
        console.error('Error loading gallery from site_settings:', error);
        return INITIAL_GALLERY_PHOTOS;
      }

      // If not configured in site_settings yet, return the 12 original photos
      if (!data || data.value === null || data.value === undefined) {
        return INITIAL_GALLERY_PHOTOS;
      }

      if (Array.isArray(data.value)) {
        return data.value as CustomGalleryImage[];
      }

      return INITIAL_GALLERY_PHOTOS;
    },
  });

  // Save gallery items to site_settings
  const saveGallery = async (items: CustomGalleryImage[]) => {
    try {
      setSaving(true);
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
      queryClient.invalidateQueries({ queryKey: ['admin-gallery-items'] });
      queryClient.invalidateQueries({ queryKey: ['gallery-images'] });
      return true;
    } catch (err: any) {
      console.error('Save error:', err);
      toast.error('Failed to update gallery: ' + (err?.message || 'Unknown error'));
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Helper: Upload a single image file to Supabase storage
  const uploadImageFile = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop() || 'jpg';
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
      const fileName = `gallery/${Date.now()}-${cleanName}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('tour-images')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Upload storage error:', uploadError);
        toast.error('Upload error: ' + uploadError.message);
        return null;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('tour-images')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (err: any) {
      console.error('Storage exception:', err);
      toast.error('Upload failed: ' + (err?.message || 'Error'));
      return null;
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
        const publicUrl = await uploadImageFile(file);
        if (!publicUrl) continue;

        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9]/g, ' ').trim();

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
      const ok = await saveGallery(updated);
      if (ok) {
        toast.success(`Successfully uploaded ${newItems.length} photos!`);
      }
    } else {
      toast.error('Could not upload selected photos. Ensure bucket storage allows writes.');
    }

    setUploading(false);
    e.target.value = '';
  };

  // Quick Replace image file directly from card
  const handleDirectReplaceFile = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setReplacingId(id);
    const publicUrl = await uploadImageFile(file);
    if (publicUrl) {
      const updated = galleryItems.map(item => {
        if (item.id === id) {
          return { ...item, url: publicUrl };
        }
        return item;
      });
      const ok = await saveGallery(updated);
      if (ok) {
        toast.success('Image replaced successfully!');
      }
    }
    setReplacingId(null);
    e.target.value = '';
  };

  // Delete Image
  const handleDelete = async (id: string, title?: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${title || 'this photo'}" from the gallery?`
    );
    if (!confirmed) return;

    const updated = galleryItems.filter(item => item.id !== id);
    const ok = await saveGallery(updated);
    if (ok) {
      toast.success(`Photo "${title || 'item'}" removed successfully`);
    }
  };

  // Reset to default 12 original photos
  const handleResetToDefaults = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to reset the gallery to the 12 original default photos?\n\nThis will restore the original 12 photos (Serengeti Sunset, Lion Pride, Zanzibar Beach, etc.) and overwrite the current gallery list.'
    );
    if (!confirmed) return;

    const ok = await saveGallery(INITIAL_GALLERY_PHOTOS);
    if (ok) {
      toast.success('Successfully restored the 12 default photos!');
    }
  };

  // Save changes from Edit Dialog
  const handleSaveEdit = async () => {
    if (!editingImage) return;
    if (!editingImage.url.trim()) {
      toast.error('Image URL is required');
      return;
    }
    if (!editingImage.title.trim()) {
      toast.error('Title is required');
      return;
    }

    const updated = galleryItems.map(item => {
      if (item.id === editingImage.id) {
        return editingImage;
      }
      return item;
    });

    const ok = await saveGallery(updated);
    if (ok) {
      toast.success('Photo updated successfully');
      setEditingImage(null);
    }
  };

  // Handle uploading replacement image inside Edit Dialog
  const handleEditDialogUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingImage) return;

    setEditUploading(true);
    const publicUrl = await uploadImageFile(file);
    if (publicUrl) {
      setEditingImage(prev => prev ? { ...prev, url: publicUrl } : null);
      toast.success('Uploaded replacement image!');
    }
    setEditUploading(false);
    e.target.value = '';
  };

  // Add single photo handler
  const handleAddSinglePhoto = async () => {
    if (!newImage.url.trim()) {
      toast.error('Please provide an image URL or upload a photo');
      return;
    }
    if (!newImage.title.trim()) {
      toast.error('Please enter a photo title');
      return;
    }

    const photo: CustomGalleryImage = {
      id: `gal-${Date.now()}-${Math.random().toString(36).substring(5)}`,
      url: newImage.url.trim(),
      title: newImage.title.trim(),
      category: newImage.category,
      description: newImage.description.trim() || undefined,
      created_at: new Date().toISOString(),
    };

    const updated = [photo, ...galleryItems];
    const ok = await saveGallery(updated);
    if (ok) {
      toast.success('New photo added to gallery!');
      setIsAddOpen(false);
      setNewImage({ title: '', category: 'safari', url: '', description: '' });
    }
  };

  // Quick inline update for title or category
  const handleQuickUpdate = async (id: string, field: 'title' | 'category', value: string) => {
    const current = galleryItems.find(i => i.id === id);
    if (current && current[field] === value) return;

    const updated = galleryItems.map(item => {
      if (item.id === id) return { ...item, [field]: value };
      return item;
    });
    await saveGallery(updated);
  };

  // Filtering
  const filteredItems = galleryItems.filter(item => {
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchesSearch = !searchQuery.trim() || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-2">
              <Images className="h-8 w-8 text-amber-500" />
              Photo Gallery Manager
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Manage live website photos. Edit titles, replace images, delete photos, or add new high-resolution images.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetToDefaults}
              className="gap-1.5 text-amber-800 border-amber-300 hover:bg-amber-100/60 bg-amber-50"
              disabled={saving}
            >
              <RotateCcw className="w-4 h-4 text-amber-600" />
              Reset to Default 12 Photos
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => window.open('/gallery', '_blank')} 
              className="gap-1.5"
            >
              <Eye className="w-4 h-4" /> View Live Gallery
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => refetch()} 
              className="gap-1.5"
            >
              <RefreshCw className="w-4 h-4" /> Refresh
            </Button>
          </div>
        </div>

        {/* Action / Upload Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bulk Upload Card */}
          <Card className="lg:col-span-2 shadow-soft border-dashed border-2 border-amber-500/40 bg-amber-50/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Upload className="h-5 w-5 text-amber-600" />
                Bulk Upload Photos
              </CardTitle>
              <CardDescription>
                Select multiple photos at once from your device (JPG, PNG, WEBP). They will be automatically saved to your live gallery.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-end gap-4">
                <div className="space-y-1.5 flex-1 min-w-[200px]">
                  <Label className="text-xs font-bold uppercase tracking-wider text-slate-600">Assign Category to Uploads</Label>
                  <select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl border border-slate-300 bg-white text-sm font-medium focus:ring-2 focus:ring-amber-500"
                  >
                    {GALLERY_CATEGORIES.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div className="flex-1 min-w-[250px]">
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

          {/* Single Photo by URL / Upload Card */}
          <Card className="shadow-soft flex flex-col justify-between border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Plus className="h-5 w-5 text-safari-gold" />
                Add Single Photo
              </CardTitle>
              <CardDescription>
                Add a single photo by pasting an image link (e.g. Unsplash) or uploading one file.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => setIsAddOpen(true)}
                className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl gap-2 shadow-sm"
              >
                <Plus className="w-4 h-4" /> Add Photo by URL or File
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Gallery Management Grid */}
        <Card className="shadow-soft">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <span>Gallery Photos</span>
                <Badge variant="secondary" className="font-mono text-xs">
                  {galleryItems.length} total
                </Badge>
              </CardTitle>
              <CardDescription>
                Click <strong>Edit</strong> or <strong>Camera</strong> on any photo to replace its picture or edit title and category.
              </CardDescription>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-48">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search photo..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 h-9 text-xs"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="h-9 px-3 rounded-lg border border-slate-200 text-xs font-medium bg-white"
                >
                  <option value="all">All Categories ({galleryItems.length})</option>
                  {GALLERY_CATEGORIES.map(cat => {
                    const count = galleryItems.filter(i => i.category === cat.id).length;
                    return (
                      <option key={cat.id} value={cat.id}>
                        {cat.label} ({count})
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-16 px-4 border border-dashed rounded-2xl bg-slate-50">
                <Images className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-700">No photos found</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  {searchQuery || filterCategory !== 'all' 
                    ? 'No photos matched your search or category filter. Try clearing filters.'
                    : 'You have no photos in the gallery. Use the buttons above to upload or click "Reset to Default 12 Photos".'}
                </p>
                {galleryItems.length === 0 && (
                  <Button
                    onClick={handleResetToDefaults}
                    variant="outline"
                    size="sm"
                    className="mt-4 gap-2 text-amber-800 border-amber-300 bg-amber-50"
                  >
                    <RotateCcw className="w-4 h-4 text-amber-600" /> Restore 12 Default Photos
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredItems.map((item) => (
                  <div 
                    key={item.id} 
                    className="group relative rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
                  >
                    {/* Image Preview with Hover Actions */}
                    <div className="relative aspect-video bg-slate-100 overflow-hidden">
                      <img 
                        src={item.url} 
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => {
                          // Fallback for broken link
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800';
                        }}
                      />
                      
                      <Badge className="absolute top-2 left-2 bg-slate-950/75 text-amber-400 backdrop-blur-sm text-[10px] uppercase font-bold border-none">
                        {item.category}
                      </Badge>

                      {/* Top Right Action Icons */}
                      <div className="absolute top-2 right-2 flex items-center gap-1.5">
                        {/* Quick Replace Image File Button */}
                        <label 
                          className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-900 text-white cursor-pointer transition-colors shadow-sm"
                          title="Replace photo file from device"
                        >
                          {replacingId === item.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                          ) : (
                            <Camera className="w-3.5 h-3.5" />
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            disabled={Boolean(replacingId)}
                            className="hidden"
                            onChange={(e) => handleDirectReplaceFile(item.id, e)}
                          />
                        </label>

                        {/* Edit details button */}
                        <button
                          onClick={() => setEditingImage(item)}
                          className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-amber-600 text-white transition-colors shadow-sm"
                          title="Edit photo details & URL"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete button */}
                        <button
                          onClick={() => handleDelete(item.id, item.title)}
                          className="p-1.5 rounded-lg bg-red-600/90 text-white hover:bg-red-700 transition-colors shadow-sm"
                          title="Delete photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Metadata & Quick Edit */}
                    <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
                      <div>
                        <input
                          type="text"
                          defaultValue={item.title}
                          key={item.id + item.title}
                          onBlur={(e) => handleQuickUpdate(item.id, 'title', e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              (e.target as HTMLInputElement).blur();
                            }
                          }}
                          className="w-full text-xs font-bold text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-amber-500 focus:outline-none px-1 py-0.5"
                          placeholder="Add title..."
                        />
                        {item.description && (
                          <p className="text-[11px] text-slate-500 px-1 line-clamp-1 mt-0.5">
                            {item.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <select
                          value={item.category}
                          onChange={(e) => handleQuickUpdate(item.id, 'category', e.target.value)}
                          className="text-[11px] font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded px-2 py-1 border-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
                        >
                          {GALLERY_CATEGORIES.map(c => (
                            <option key={c.id} value={c.id}>{c.label}</option>
                          ))}
                        </select>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingImage(item)}
                            className="text-[11px] text-slate-500 hover:text-amber-600 font-medium"
                          >
                            Edit
                          </button>
                          <a 
                            href={item.url} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="text-[10px] text-amber-600 hover:text-amber-700 flex items-center gap-0.5 font-medium"
                          >
                            <ExternalLink className="w-2.5 h-2.5" /> Full
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Photo Modal */}
        <Dialog open={Boolean(editingImage)} onOpenChange={(open) => !open && setEditingImage(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-600" />
                Edit Photo Details
              </DialogTitle>
              <DialogDescription>
                Modify photo title, change its category, edit the image URL directly, or upload a replacement.
              </DialogDescription>
            </DialogHeader>

            {editingImage && (
              <div className="space-y-4 py-2">
                {/* Current Image Preview */}
                <div className="relative aspect-video rounded-xl bg-slate-100 overflow-hidden border border-slate-200">
                  <img
                    src={editingImage.url}
                    alt={editingImage.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 right-2">
                    <label className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/90 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg cursor-pointer shadow-md transition-all">
                      {editUploading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Camera className="w-3.5 h-3.5 text-amber-400" />
                          <span>Replace Image File</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        disabled={editUploading}
                        onChange={handleEditDialogUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Direct URL Input */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <LinkIcon className="w-3.5 h-3.5 text-slate-400" /> Image URL
                  </Label>
                  <Input
                    value={editingImage.url}
                    onChange={(e) => setEditingImage({ ...editingImage, url: e.target.value })}
                    placeholder="https://..."
                    className="text-xs font-mono"
                  />
                  <p className="text-[11px] text-slate-500">
                    Paste any image link (Unsplash, CDN, etc.) or click "Replace Image File" above to upload from your computer.
                  </p>
                </div>

                {/* Title */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Photo Title</Label>
                  <Input
                    value={editingImage.title}
                    onChange={(e) => setEditingImage({ ...editingImage, title: e.target.value })}
                    placeholder="e.g. Serengeti Sunset"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Category</Label>
                  <select
                    value={editingImage.category}
                    onChange={(e) => setEditingImage({ ...editingImage, category: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 bg-white text-sm font-medium focus:ring-2 focus:ring-amber-500"
                  >
                    {GALLERY_CATEGORIES.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">Description (Optional)</Label>
                  <Textarea
                    value={editingImage.description || ''}
                    onChange={(e) => setEditingImage({ ...editingImage, description: e.target.value })}
                    placeholder="Short caption or story about this photo..."
                    rows={2}
                    className="text-sm"
                  />
                </div>
              </div>
            )}

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => setEditingImage(null)}
                disabled={saving || editUploading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveEdit}
                disabled={saving || editUploading}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" /> Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Single Photo Modal */}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-600" />
                Add Single Photo to Gallery
              </DialogTitle>
              <DialogDescription>
                Provide a photo title, choose its category, and paste an image URL or upload an image file.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              {/* Photo Title */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">Photo Title *</Label>
                <Input
                  value={newImage.title}
                  onChange={(e) => setNewImage({ ...newImage, title: e.target.value })}
                  placeholder="e.g. Cheetah on the Lookout"
                />
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">Category *</Label>
                <select
                  value={newImage.category}
                  onChange={(e) => setNewImage({ ...newImage, category: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 bg-white text-sm font-medium focus:ring-2 focus:ring-amber-500"
                >
                  {GALLERY_CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              </div>

              {/* Image Source */}
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-700">Image Source *</Label>
                <div className="flex gap-2">
                  <Input
                    value={newImage.url}
                    onChange={(e) => setNewImage({ ...newImage, url: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="text-xs font-mono flex-1"
                  />
                  <label className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl cursor-pointer border border-slate-300 transition-colors shrink-0">
                    {addUploading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                    ) : (
                      <Upload className="w-4 h-4 text-amber-600" />
                    )}
                    <span>{addUploading ? 'Uploading...' : 'Upload File'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={addUploading}
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setAddUploading(true);
                        const url = await uploadImageFile(file);
                        if (url) {
                          setNewImage(prev => ({ ...prev, url }));
                          if (!newImage.title) {
                            const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9]/g, ' ').trim();
                            setNewImage(prev => ({ ...prev, title: cleanName }));
                          }
                          toast.success('Photo uploaded!');
                        }
                        setAddUploading(false);
                        e.target.value = '';
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Preview if URL exists */}
              {newImage.url && (
                <div className="aspect-video rounded-xl bg-slate-100 overflow-hidden border border-slate-200">
                  <img
                    src={newImage.url}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}

              {/* Description */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">Description (Optional)</Label>
                <Textarea
                  value={newImage.description}
                  onChange={(e) => setNewImage({ ...newImage, description: e.target.value })}
                  placeholder="Short note about this photo..."
                  rows={2}
                  className="text-sm"
                />
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => setIsAddOpen(false)}
                disabled={saving || addUploading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddSinglePhoto}
                disabled={saving || addUploading || !newImage.url || !newImage.title}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" /> Saving...
                  </>
                ) : (
                  'Add to Gallery'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminGallery;
