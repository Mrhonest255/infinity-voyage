import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Map, Compass, CalendarCheck, DollarSign, TrendingUp, Users } from 'lucide-react';

const AdminDashboard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [toursRes, activitiesRes, bookingsRes] = await Promise.all([
        supabase.from('tours').select('id, is_published', { count: 'exact' }),
        supabase.from('activities').select('id, is_published', { count: 'exact' }),
        supabase.from('bookings').select('id, status, total_price', { count: 'exact' }),
      ]);

      const publishedTours = toursRes.data?.filter(t => t.is_published).length || 0;
      const publishedActivities = activitiesRes.data?.filter(a => a.is_published).length || 0;
      const pendingBookings = bookingsRes.data?.filter(b => b.status === 'pending').length || 0;
      const totalRevenue = bookingsRes.data?.reduce((sum, b) => sum + (Number(b.total_price) || 0), 0) || 0;

      return {
        totalTours: toursRes.count || 0,
        publishedTours,
        totalActivities: activitiesRes.count || 0,
        publishedActivities,
        totalBookings: bookingsRes.count || 0,
        pendingBookings,
        totalRevenue,
      };
    },
  });

  const statCards = [
    { 
      title: 'Total Tours', 
      value: stats?.totalTours || 0, 
      subtitle: `${stats?.publishedTours || 0} published`,
      icon: Map, 
      color: 'bg-primary/10 text-primary' 
    },
    { 
      title: 'Total Activities', 
      value: stats?.totalActivities || 0, 
      subtitle: `${stats?.publishedActivities || 0} published`,
      icon: Compass, 
      color: 'bg-accent/10 text-accent' 
    },
    { 
      title: 'Total Bookings', 
      value: stats?.totalBookings || 0, 
      subtitle: `${stats?.pendingBookings || 0} pending`,
      icon: CalendarCheck, 
      color: 'bg-green-500/10 text-green-600' 
    },
    { 
      title: 'Total Revenue', 
      value: `$${(stats?.totalRevenue || 0).toLocaleString()}`, 
      subtitle: 'All time',
      icon: DollarSign, 
      color: 'bg-blue-500/10 text-blue-600' 
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome to your admin dashboard</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <Card key={index} className="shadow-soft">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Map className="h-5 w-5 text-primary" />
                Safari Tours
              </CardTitle>
              <CardDescription>Manage mainland safari packages</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Create and manage safari tours with AI-generated content, pricing, and itineraries.
              </p>
              <a href="/admin/tours" className="text-primary font-medium hover:underline">
                Manage Tours →
              </a>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Compass className="h-5 w-5 text-accent" />
                Zanzibar Activities
              </CardTitle>
              <CardDescription>Manage island excursions and activities</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Add day trips, beach activities, and cultural experiences in Zanzibar.
              </p>
              <a href="/admin/activities" className="text-primary font-medium hover:underline">
                Manage Activities →
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;