import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Map, Compass, CalendarCheck, DollarSign, TrendingUp, Users, Clock, CheckCircle, XCircle, Eye, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [toursRes, activitiesRes, bookingsRes, transfersRes] = await Promise.all([
        supabase.from('tours').select('id, is_published', { count: 'exact' }),
        supabase.from('activities').select('id, is_published', { count: 'exact' }),
        supabase.from('bookings').select('*'),
        supabase.from('transfers').select('id, is_active', { count: 'exact' }),
      ]);

      const bookings = bookingsRes.data || [];
      const publishedTours = toursRes.data?.filter(t => t.is_published).length || 0;
      const publishedActivities = activitiesRes.data?.filter(a => a.is_published).length || 0;
      const activeTransfers = transfersRes.data?.filter(t => t.is_active).length || 0;
      
      // Calculate revenue from confirmed bookings only
      const confirmedBookings = bookings.filter((b: any) => b.status === 'confirmed' || b.status === 'completed');
      const totalRevenue = confirmedBookings.reduce((sum: number, b: any) => sum + (Number(b.total_price) || 0), 0);
      
      // This month's stats
      const now = new Date();
      const monthStart = startOfMonth(now);
      const monthEnd = endOfMonth(now);
      const thisMonthBookings = bookings.filter((b: any) => {
        const date = new Date(b.created_at);
        return date >= monthStart && date <= monthEnd;
      });
      const thisMonthRevenue = thisMonthBookings
        .filter((b: any) => b.status === 'confirmed' || b.status === 'completed')
        .reduce((sum: number, b: any) => sum + (Number(b.total_price) || 0), 0);
      
      // Last 7 days bookings
      const last7Days = subDays(now, 7);
      const recentBookings = bookings.filter((b: any) => new Date(b.created_at) >= last7Days);
      
      // Status counts
      const pendingCount = bookings.filter((b: any) => b.status === 'pending').length;
      const confirmedCount = bookings.filter((b: any) => b.status === 'confirmed').length;
      const completedCount = bookings.filter((b: any) => b.status === 'completed').length;
      const cancelledCount = bookings.filter((b: any) => b.status === 'cancelled').length;

      return {
        totalTours: toursRes.count || 0,
        publishedTours,
        totalActivities: activitiesRes.count || 0,
        publishedActivities,
        totalTransfers: transfersRes.count || 0,
        activeTransfers,
        totalBookings: bookings.length,
        pendingBookings: pendingCount,
        confirmedBookings: confirmedCount,
        completedBookings: completedCount,
        cancelledBookings: cancelledCount,
        totalRevenue,
        thisMonthRevenue,
        thisMonthBookings: thisMonthBookings.length,
        recentBookingsCount: recentBookings.length,
        recentBookings: bookings
          .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5),
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
      title: 'Total Bookings', 
      value: stats?.totalBookings || 0, 
      subtitle: `${stats?.pendingBookings || 0} pending review`,
      icon: CalendarCheck, 
      color: 'bg-green-500/10 text-green-600' 
    },
    { 
      title: 'This Month', 
      value: stats?.thisMonthBookings || 0, 
      subtitle: `$${(stats?.thisMonthRevenue || 0).toLocaleString()} revenue`,
      icon: TrendingUp, 
      color: 'bg-purple-500/10 text-purple-600' 
    },
    { 
      title: 'Total Revenue', 
      value: `$${(stats?.totalRevenue || 0).toLocaleString()}`, 
      subtitle: 'From confirmed bookings',
      icon: DollarSign, 
      color: 'bg-blue-500/10 text-blue-600' 
    },
  ];

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800',
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome to your admin dashboard</p>
          </div>
          <div className="flex gap-3">
            <Link to="/admin/bookings">
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                View All Bookings
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <Card key={index} className="shadow-soft hover:shadow-elevated transition-shadow">
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

        {/* Booking Status Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Status Breakdown */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="text-lg">Booking Status</CardTitle>
              <CardDescription>Current status breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">Pending</span>
                  </div>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    {stats?.pendingBookings || 0}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Confirmed</span>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {stats?.confirmedBookings || 0}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Completed</span>
                  </div>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {stats?.completedBookings || 0}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span className="text-sm">Cancelled</span>
                  </div>
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                    {stats?.cancelledBookings || 0}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Bookings */}
          <Card className="shadow-soft lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Recent Bookings</CardTitle>
                <CardDescription>Latest booking requests</CardDescription>
              </div>
              <Link to="/admin/bookings">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowUpRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {stats?.recentBookings?.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentBookings.map((booking: any) => (
                    <div key={booking.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">
                            {booking.customer_name?.charAt(0)?.toUpperCase() || '?'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-sm">{booking.customer_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(booking.created_at), 'MMM dd, yyyy')} • {booking.number_of_guests} guest(s)
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {booking.tracking_code && (
                          <span className="text-xs font-mono text-muted-foreground">{booking.tracking_code}</span>
                        )}
                        <Badge className={getStatusBadge(booking.status)}>
                          {booking.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">No bookings yet</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-soft hover:shadow-elevated transition-shadow">
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
              <Link to="/admin/tours" className="text-primary font-medium hover:underline inline-flex items-center gap-1">
                Manage Tours <ArrowUpRight className="h-4 w-4" />
              </Link>
            </CardContent>
          </Card>

          <Card className="shadow-soft hover:shadow-elevated transition-shadow">
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
              <Link to="/admin/activities" className="text-primary font-medium hover:underline inline-flex items-center gap-1">
                Manage Activities <ArrowUpRight className="h-4 w-4" />
              </Link>
            </CardContent>
          </Card>

          <Card className="shadow-soft hover:shadow-elevated transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                Airport Transfers
              </CardTitle>
              <CardDescription>Manage transfer services</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {stats?.activeTransfers || 0} active transfer routes. Add pickup and drop-off services.
              </p>
              <Link to="/admin/transfers" className="text-primary font-medium hover:underline inline-flex items-center gap-1">
                Manage Transfers <ArrowUpRight className="h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;