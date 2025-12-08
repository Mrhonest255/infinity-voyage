import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Search, Edit, Trash2, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Activity {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  duration: string | null;
  price: number | null;
  location: string | null;
  is_featured: boolean;
  is_published: boolean;
  featured_image: string | null;
  created_at: string;
}

const AdminActivities = () => {
  const [search, setSearch] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: activities, isLoading } = useQuery({
    queryKey: ['admin-activities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Activity[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('activities').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-activities'] });
      toast({ title: 'Activity deleted', description: 'The activity has been deleted.' });
    },
    onError: (error: Error) => {
      toast({ title: 'Delete failed', description: error.message, variant: 'destructive' });
    },
  });

  const togglePublishMutation = useMutation({
    mutationFn: async ({ id, is_published }: { id: string; is_published: boolean }) => {
      const { error } = await supabase.from('activities').update({ is_published: !is_published }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-activities'] });
      toast({ title: 'Status updated' });
    },
  });

  const filteredActivities = activities?.filter(activity => 
    activity.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Zanzibar Activities</h1>
            <p className="text-muted-foreground mt-1">Manage island excursions and activities</p>
          </div>
          <Button onClick={() => navigate('/admin/activities/new')} variant="safari">
            <Plus className="h-4 w-4 mr-2" />
            Add Activity
          </Button>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search activities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredActivities?.length === 0 ? (
          <Card className="shadow-soft">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No activities found. Create your first activity!</p>
              <Button onClick={() => navigate('/admin/activities/new')} variant="safari" className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Create Activity
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActivities?.map((activity) => (
              <Card key={activity.id} className="shadow-soft overflow-hidden">
                <div className="aspect-video relative bg-secondary">
                  {activity.featured_image ? (
                    <img src={activity.featured_image} alt={activity.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      No image
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Badge variant={activity.is_published ? 'default' : 'secondary'}>
                      {activity.is_published ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-foreground truncate">{activity.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {activity.short_description || 'No description'}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="text-sm">
                      <span className="text-muted-foreground">{activity.duration || 'N/A'}</span>
                      {activity.price && (
                        <span className="ml-2 font-semibold text-primary">${activity.price}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                    <Button variant="outline" size="sm" onClick={() => navigate(`/admin/activities/${activity.id}`)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => togglePublishMutation.mutate({ id: activity.id, is_published: activity.is_published })}
                    >
                      {activity.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => {
                        if (confirm('Delete this activity?')) {
                          deleteMutation.mutate(activity.id);
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

export default AdminActivities;