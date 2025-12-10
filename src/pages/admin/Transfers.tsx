import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Search, Edit, Trash2, Eye, EyeOff, Loader2, Car, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Transfer {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  transfer_type: string;
  route_from: string;
  route_to: string;
  price_small_group: number | null;
  price_large_group: number | null;
  duration: string | null;
  is_featured: boolean;
  is_published: boolean;
  featured_image: string | null;
  created_at: string;
}

const AdminTransfers = () => {
  const [search, setSearch] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: transfers, isLoading } = useQuery({
    queryKey: ['admin-transfers'],
    queryFn: async () => {
      const { data, error } = await (supabase
        .from('transfers' as any)
        .select('*')
        .order('created_at', { ascending: false }) as any);
      
      if (error) throw error;
      return data as Transfer[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase.from('transfers' as any).delete().eq('id', id) as any);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-transfers'] });
      toast({ title: 'Transfer deleted', description: 'The transfer service has been deleted.' });
    },
    onError: (error: Error) => {
      toast({ title: 'Delete failed', description: error.message, variant: 'destructive' });
    },
  });

  const togglePublishMutation = useMutation({
    mutationFn: async ({ id, is_published }: { id: string; is_published: boolean }) => {
      const { error } = await (supabase.from('transfers' as any).update({ is_published: !is_published }).eq('id', id) as any);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-transfers'] });
      toast({ title: 'Status updated', description: 'Transfer visibility has been updated.' });
    },
  });

  const filteredTransfers = transfers?.filter(transfer => 
    transfer.title.toLowerCase().includes(search.toLowerCase()) ||
    transfer.route_from.toLowerCase().includes(search.toLowerCase()) ||
    transfer.route_to.toLowerCase().includes(search.toLowerCase())
  );

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'airport': return 'bg-blue-500/10 text-blue-500';
      case 'hotel': return 'bg-green-500/10 text-green-500';
      case 'port': return 'bg-purple-500/10 text-purple-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Transfer Services</h1>
            <p className="text-muted-foreground mt-1">Manage airport and hotel transfer packages</p>
          </div>
          <Button onClick={() => navigate('/admin/transfers/new')} variant="safari">
            <Plus className="h-4 w-4 mr-2" />
            Add Transfer
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transfers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Transfers Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredTransfers?.length === 0 ? (
          <Card className="shadow-soft">
            <CardContent className="py-12 text-center">
              <Car className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No transfers found. Create your first transfer service!</p>
              <Button onClick={() => navigate('/admin/transfers/new')} variant="safari" className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Create Transfer
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTransfers?.map((transfer) => (
              <Card key={transfer.id} className="shadow-soft overflow-hidden">
                <div className="aspect-video relative bg-gradient-to-br from-primary/10 to-safari-gold/10">
                  {transfer.featured_image ? (
                    <img src={transfer.featured_image} alt={transfer.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                      <Car className="h-12 w-12 mb-2" />
                      <span className="text-sm">No image</span>
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    <Badge className={getTypeColor(transfer.transfer_type)}>
                      {transfer.transfer_type}
                    </Badge>
                  </div>
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Badge variant={transfer.is_published ? 'default' : 'secondary'}>
                      {transfer.is_published ? 'Published' : 'Draft'}
                    </Badge>
                    {transfer.is_featured && <Badge variant="outline" className="bg-accent/20">Featured</Badge>}
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-foreground truncate">{transfer.title}</h3>
                  
                  {/* Route */}
                  <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate">{transfer.route_from} → {transfer.route_to}</span>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                    {transfer.short_description || 'No description'}
                  </p>
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className="text-sm">
                      <span className="text-muted-foreground">{transfer.duration || 'N/A'}</span>
                    </div>
                    <div className="text-right">
                      {transfer.price_small_group && (
                        <span className="font-semibold text-primary">
                          ${transfer.price_small_group}
                          <span className="text-xs text-muted-foreground ml-1">/ 1-6 pax</span>
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/admin/transfers/${transfer.id}`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => togglePublishMutation.mutate({ id: transfer.id, is_published: transfer.is_published })}
                    >
                      {transfer.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this transfer?')) {
                          deleteMutation.mutate(transfer.id);
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

export default AdminTransfers;
