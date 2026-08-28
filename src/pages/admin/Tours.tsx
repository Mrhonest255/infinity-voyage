import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Search, Edit, Trash2, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface Tour {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  duration: string | null;
  price: number | null;
  category: string;
  is_featured: boolean;
  is_published: boolean;
  featured_image: string | null;
  created_at: string;
}

const AdminTours = () => {
  const [search, setSearch] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: tours, isLoading } = useQuery({
    queryKey: ['admin-tours'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tours')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Tour[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('tours').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-tours'] });
      toast({ title: 'Tour deleted', description: 'The tour has been deleted successfully.' });
    },
    onError: (error: Error) => {
      toast({ title: 'Delete failed', description: error.message, variant: 'destructive' });
    },
  });

  const togglePublishMutation = useMutation({
    mutationFn: async ({ id, is_published }: { id: string; is_published: boolean }) => {
      const { error } = await supabase.from('tours').update({ is_published: !is_published }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-tours'] });
      toast({ title: 'Status updated', description: 'Tour visibility has been updated.' });
    },
  });

  const filteredTours = tours?.filter(tour => 
    tour.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Safari Tours</h1>
            <p className="text-muted-foreground mt-1">Manage your mainland safari packages</p>
          </div>
          <Button onClick={() => navigate('/admin/tours/new')} variant="safari">
            <Plus className="h-4 w-4 mr-2" />
            Add Tour
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tours..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Tours Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredTours?.length === 0 ? (
          <Card className="shadow-soft">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No tours found. Create your first tour!</p>
              <Button onClick={() => navigate('/admin/tours/new')} variant="safari" className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Create Tour
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTours?.map((tour) => (
              <Card key={tour.id} className="shadow-soft overflow-hidden">
                <div className="aspect-video relative bg-secondary">
                  {tour.featured_image ? (
                    <img src={tour.featured_image} alt={tour.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      No image
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Badge variant={tour.is_published ? 'default' : 'secondary'}>
                      {tour.is_published ? 'Published' : 'Draft'}
                    </Badge>
                    {tour.is_featured && <Badge variant="outline" className="bg-accent/20">Featured</Badge>}
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-foreground truncate">{tour.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {tour.short_description || 'No description'}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="text-sm">
                      <span className="text-muted-foreground">{tour.duration || 'N/A'}</span>
                      {tour.price && (
                        <span className="ml-2 font-semibold text-primary">
                          ${tour.price}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/admin/tours/${tour.id}`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => togglePublishMutation.mutate({ id: tour.id, is_published: tour.is_published })}
                    >
                      {tour.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this tour?')) {
                          deleteMutation.mutate(tour.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminTours;