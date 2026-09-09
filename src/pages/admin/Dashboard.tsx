import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Map, 
  Compass, 
  CalendarCheck, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  ArrowUpRight, 
  Images, 
  Car, 
  Settings, 
  ExternalLink, 
  RefreshCw,
  Layers,
  Sparkles
} from 'lucide-react';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { data: stats, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [toursRes, activitiesRes, bookingsRes, transfersRes, galleryRes] = await Promise.all([
        supabase.from('tours').select('id, is_published, price', { count: 'exact' }),
        supabase.from('activities').select('id, is_published, price', { count: 'exact' }),
        supabase.from('bookings').select(`
          id,
          customer_name,
          customer_email,
          customer_phone,
          created_at,
          travel_date,
          number_of_guests,
          status,
          total_price,
          tour_id,
          activity_id,
          tours:tour_id(title),
          activities:activity_id(title)
        `),
        supabase.from('transfers').select('id, is_published', { count: 'exact' }),
        supabase.from('site_settings').select('value').eq('key', 'custom_gallery').maybeSingle(),
      ]);

      const bookings = (bookingsRes.data as any[]) || [];
      const tours = (toursRes.data as any[]) || [];
      const activities = (activitiesRes.data as any[]) || [];
      const transfers = (transfersRes.data as any[]) || [];

      const publishedTours = tours.filter(t => Boolean(t.is_published)).length;
      const publishedActivities = activities.filter(a => Boolean(a.is_published)).length;
      const activeTransfers = transfers.filter(t => Boolean(t.is_published)).length;
      
      const galleryItems = Array.isArray(galleryRes.data?.value) ? (galleryRes.data.value as any[]) : [];
      const totalGalleryImages = galleryItems.length;

      // Calculate revenue from confirmed and completed bookings
      const confirmedBookings = bookings.filter((b: any) => b.status === 'confirmed' || b.status === 'completed');
      const totalRevenue = confirmedBookings.reduce((sum: number, b: any) => sum + (Number(b.total_price) || 0), 0);
      const avgOrderValue = confirmedBookings.length > 0 ? Math.round(totalRevenue / confirmedBookings.length) : 0;
      
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
      const totalBookings = bookings.length;
      const conversionRate = totalBookings > 0 
        ? Math.round(((confirmedCount + completedCount) / totalBookings) * 100) 
        : 0;

      const totalCatalog = (toursRes.count || 0) + (activitiesRes.count || 0) + (transfersRes.count || 0);
      const totalPublishedCatalog = publishedTours + publishedActivities + activeTransfers;

      return {
        totalTours: toursRes.count || 0,
        publishedTours,
        totalActivities: activitiesRes.count || 0,
        publishedActivities,
        totalTransfers: transfersRes.count || 0,
        activeTransfers,
        totalGalleryImages,
        totalCatalog,
        totalPublishedCatalog,
        totalBookings,
        pendingBookings: pendingCount,
        confirmedBookings: confirmedCount,
        completedBookings: completedCount,
        cancelledBookings: cancelledCount,
        conversionRate,
        avgOrderValue,
        totalRevenue,
        thisMonthRevenue,
        thisMonthBookings: thisMonthBookings.length,
        recentBookingsCount: recentBookings.length,
        recentBookings: [...bookings]
          .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5),
      };
    },
  });

  const statCards = [
    { 
      title: 'Total Bookings', 
      value: (stats?.totalBookings || 0).toLocaleString(), 
      subtitle: `${stats?.pendingBookings || 0} pending review`,
      highlight: `${stats?.conversionRate || 0}% confirmed rate`,
      icon: CalendarCheck, 
      color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
    },
    { 
      title: 'Total Revenue', 
      value: `$${(stats?.totalRevenue || 0).toLocaleString()}`, 
      subtitle: 'From confirmed bookings',
      highlight: stats?.avgOrderValue ? `$${stats.avgOrderValue.toLocaleString()} avg/trip` : 'No confirmed orders',
      icon: DollarSign, 
      color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' 
    },
    { 
      title: "This Month's Sales", 
      value: `$${(stats?.thisMonthRevenue || 0).toLocaleString()}`, 
      subtitle: `${stats?.thisMonthBookings || 0} booking${(stats?.thisMonthBookings || 0) === 1 ? '' : 's'} this month`,
      highlight: `${stats?.recentBookingsCount || 0} in last 7 days`,
      icon: TrendingUp, 
      color: 'bg-purple-500/10 text-purple-600 border-purple-500/20' 
    },
    { 
      title: 'Active Catalog', 
      value: `${stats?.totalPublishedCatalog || 0} / ${stats?.totalCatalog || 0}`, 
      subtitle: 'Published tours, activities & routes',
      highlight: `${stats?.totalGalleryImages || 0} gallery photos`,
      icon: Layers, 
      color: 'bg-amber-500/10 text-amber-600 border-amber-500/20' 
    },
  ];

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      confirmed: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
      completed: 'bg-blue-100 text-blue-800 border-blue-200',
    };
    return styles[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome to your administration and content management center</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => refetch()} 
              disabled={isRefetching}
              className="gap-1.5"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefetching ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Link to="/admin/gallery">
              <Button variant="outline" size="sm" className="gap-1.5">
                <Images className="h-3.5 w-3.5 text-primary" />
                <span>Photo Gallery</span>
              </Button>
            </Link>
            <Link to="/admin/settings">
              <Button variant="outline" size="sm" className="gap-1.5">
                <Settings className="h-3.5 w-3.5 text-primary" />
                <span>Website Settings</span>
              </Button>
            </Link>
            <Link to="/admin/bookings">
              <Button size="sm" className="gap-1.5">
                <Eye className="h-3.5 w-3.5" />
                <span>View Bookings</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Primary KPI Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <Card key={index} className="shadow-soft hover:shadow-elevated transition-shadow border-border/70">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
                    <div className="mt-3 inline-flex items-center text-[11px] font-semibold text-muted-foreground/80 bg-muted/60 px-2 py-0.5 rounded-md">
                      {stat.highlight}
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.color} border`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Secondary Quick Catalog Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/admin/tours" className="group">
            <div className="p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-all shadow-sm flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-primary/10 text-primary group-hover:scale-105 transition-transform">
                <Map className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground font-medium truncate">Safari Tours</p>
                <p className="text-sm font-bold text-foreground">
                  {stats?.publishedTours || 0} <span className="text-xs font-normal text-muted-foreground">/ {stats?.totalTours || 0} published</span>
                </p>
              </div>
            </div>
          </Link>

          <Link to="/admin/activities" className="group">
            <div className="p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-all shadow-sm flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-accent/15 text-accent-foreground group-hover:scale-105 transition-transform">
                <Compass className="h-5 w-5 text-amber-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground font-medium truncate">Zanzibar Activities</p>
                <p className="text-sm font-bold text-foreground">
                  {stats?.publishedActivities || 0} <span className="text-xs font-normal text-muted-foreground">/ {stats?.totalActivities || 0} published</span>
                </p>
              </div>
            </div>
          </Link>

          <Link to="/admin/transfers" className="group">
            <div className="p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-all shadow-sm flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600 group-hover:scale-105 transition-transform">
                <Car className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground font-medium truncate">Transfer Routes</p>
                <p className="text-sm font-bold text-foreground">
                  {stats?.activeTransfers || 0} <span className="text-xs font-normal text-muted-foreground">/ {stats?.totalTransfers || 0} active</span>
                </p>
              </div>
            </div>
          </Link>

          <Link to="/admin/gallery" className="group">
            <div className="p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-all shadow-sm flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-600 group-hover:scale-105 transition-transform">
                <Images className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground font-medium truncate">Photo Gallery</p>
                <p className="text-sm font-bold text-foreground">
                  {stats?.totalGalleryImages || 0} <span className="text-xs font-normal text-muted-foreground">photos online</span>
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Booking Status Overview & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Status Breakdown */}
          <Card className="shadow-soft flex flex-col justify-between">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Booking Status</CardTitle>
                  <CardDescription>Pipeline & fulfillment breakdown</CardDescription>
                </div>
                <Badge variant="outline" className="font-mono text-xs">
                  {stats?.totalBookings || 0} total
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Visual Segmented Progress Bar */}
              <div className="space-y-1.5">
                <div className="h-3 w-full bg-muted rounded-full overflow-hidden flex">
                  {stats?.totalBookings && stats.totalBookings > 0 ? (
                    <>
                      <div 
                        className="bg-yellow-500 transition-all" 
                        style={{ width: `${(stats.pendingBookings / stats.totalBookings) * 100}%` }}
                        title={`Pending: ${stats.pendingBookings}`}
                      />
                      <div 
                        className="bg-green-500 transition-all" 
                        style={{ width: `${(stats.confirmedBookings / stats.totalBookings) * 100}%` }}
                        title={`Confirmed: ${stats.confirmedBookings}`}
                      />
                      <div 
                        className="bg-blue-500 transition-all" 
                        style={{ width: `${(stats.completedBookings / stats.totalBookings) * 100}%` }}
                        title={`Completed: ${stats.completedBookings}`}
                      />
                      <div 
                        className="bg-red-400 transition-all" 
                        style={{ width: `${(stats.cancelledBookings / stats.totalBookings) * 100}%` }}
                        title={`Cancelled: ${stats.cancelledBookings}`}
                      />
                    </>
                  ) : (
                    <div className="w-full bg-muted" />
                  )}
                </div>
                <div className="flex justify-between text-[11px] text-muted-foreground pt-1">
                  <span>{stats?.pendingBookings || 0} Pending</span>
                  <span>{stats?.confirmedBookings || 0} Confirmed</span>
                  <span>{stats?.completedBookings || 0} Completed</span>
                </div>
              </div>

              {/* Status Breakdown Items */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-yellow-50/50 dark:bg-yellow-950/20 border border-yellow-200/50">
                  <div className="flex items-center gap-2.5">
                    <Clock className="h-4 w-4 text-yellow-600" />
                    <div>
                      <p className="text-sm font-medium">Pending Review</p>
                      <p className="text-[11px] text-muted-foreground">Awaiting operator confirmation</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300 font-semibold">
                    {stats?.pendingBookings || 0}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-green-50/50 dark:bg-green-950/20 border border-green-200/50">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">Confirmed</p>
                      <p className="text-[11px] text-muted-foreground">Booked & ready for travel</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 font-semibold">
                    {stats?.confirmedBookings || 0}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50">
                  <div className="flex items-center gap-2.5">
                    <Users className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">Completed</p>
                      <p className="text-[11px] text-muted-foreground">Safaris & trips fulfilled</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300 font-semibold">
                    {stats?.completedBookings || 0}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-red-50/50 dark:bg-red-950/20 border border-red-200/50">
                  <div className="flex items-center gap-2.5">
                    <XCircle className="h-4 w-4 text-red-500" />
                    <div>
                      <p className="text-sm font-medium">Cancelled</p>
                      <p className="text-[11px] text-muted-foreground">Voided or refunded requests</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300 font-semibold">
                    {stats?.cancelledBookings || 0}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Bookings */}
          <Card className="shadow-soft lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-lg">Recent Bookings</CardTitle>
                <CardDescription>Latest customer requests and orders</CardDescription>
              </div>
              <Link to="/admin/bookings">
                <Button variant="ghost" size="sm" className="gap-1 text-primary">
                  View All
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {stats?.recentBookings && stats.recentBookings.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentBookings.map((booking: any) => {
                    const bookedItemTitle = booking.tours?.title || booking.activities?.title || 'Tour Booking';
                    return (
                      <div key={booking.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-muted/40 hover:bg-muted/70 transition-colors border border-border/40 gap-3">
                        <div className="flex items-start sm:items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                            {booking.customer_name?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-semibold text-sm text-foreground truncate">{booking.customer_name}</p>
                              {booking.customer_email && (
                                <span className="text-xs text-muted-foreground truncate">({booking.customer_email})</span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                              <span className="font-medium text-foreground">{bookedItemTitle}</span> • {booking.number_of_guests || 1} guest{(booking.number_of_guests || 1) === 1 ? '' : 's'} • {booking.created_at ? format(new Date(booking.created_at), 'MMM dd, yyyy') : 'Recently'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                          {booking.total_price != null && (
                            <span className="text-sm font-bold text-foreground">
                              ${Number(booking.total_price).toLocaleString()}
                            </span>
                          )}
                          <Badge className={getStatusBadge(booking.status || 'pending')}>
                            {booking.status || 'pending'}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <CalendarCheck className="h-10 w-10 text-muted-foreground/40 mx-auto mb-2" />
                  <p className="text-sm font-medium text-muted-foreground">No bookings recorded yet</p>
                  <p className="text-xs text-muted-foreground mt-1">Bookings made via the website will appear here.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Action Cards */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-display font-bold text-foreground">Quick Actions & Catalog</h2>
              <p className="text-sm text-muted-foreground">Manage your travel packages, excursions, transfers, and visual media.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 1. Safari Tours */}
            <Card className="shadow-soft hover:shadow-elevated transition-shadow flex flex-col justify-between group border-border/80">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                    <Map className="h-5 w-5" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {stats?.publishedTours || 0} Published
                  </Badge>
                </div>
                <CardTitle className="text-base font-bold">Safari Tours</CardTitle>
                <CardDescription>Mainland safari packages & circuits</CardDescription>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <p className="text-xs text-muted-foreground">
                  Create and manage safari tours with AI-generated content, pricing tiers, and daily itineraries.
                </p>
                <Link to="/admin/tours" className="text-primary font-medium text-sm hover:underline inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Manage Tours <ArrowUpRight className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>

            {/* 2. Zanzibar Activities */}
            <Card className="shadow-soft hover:shadow-elevated transition-shadow flex flex-col justify-between group border-border/80">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="p-2.5 rounded-lg bg-accent/15 text-accent-foreground">
                    <Compass className="h-5 w-5 text-amber-600" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {stats?.publishedActivities || 0} Published
                  </Badge>
                </div>
                <CardTitle className="text-base font-bold">Zanzibar Activities</CardTitle>
                <CardDescription>Island excursions & cultural tours</CardDescription>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <p className="text-xs text-muted-foreground">
                  Add day trips, beach adventures, spice farm experiences, and ocean sports in Zanzibar.
                </p>
                <Link to="/admin/activities" className="text-primary font-medium text-sm hover:underline inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Manage Activities <ArrowUpRight className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>

            {/* 3. Airport Transfers */}
            <Card className="shadow-soft hover:shadow-elevated transition-shadow flex flex-col justify-between group border-border/80">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600">
                    <Car className="h-5 w-5" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {stats?.activeTransfers || 0} Active Routes
                  </Badge>
                </div>
                <CardTitle className="text-base font-bold">Airport Transfers</CardTitle>
                <CardDescription>Pickup & drop-off route services</CardDescription>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <p className="text-xs text-muted-foreground">
                  Manage airport, hotel, and ferry transfer routes with vehicle sizes and group pricing.
                </p>
                <Link to="/admin/transfers" className="text-primary font-medium text-sm hover:underline inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Manage Transfers <ArrowUpRight className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>

            {/* 4. Photo Gallery (Requirement 1) */}
            <Card className="shadow-soft hover:shadow-elevated transition-shadow flex flex-col justify-between group border-border/80 border-primary/20 bg-primary/[0.02]">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-600">
                    <Images className="h-5 w-5" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {stats?.totalGalleryImages || 0} Photos
                  </Badge>
                </div>
                <CardTitle className="text-base font-bold">Photo Gallery</CardTitle>
                <CardDescription>Upload bulk photos & manage gallery</CardDescription>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <p className="text-xs text-muted-foreground">
                  Upload bulk photos & manage gallery categories, high-resolution imagery, and album highlights.
                </p>
                <Link to="/admin/gallery" className="text-primary font-medium text-sm hover:underline inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Manage Gallery <ArrowUpRight className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Website Settings & CMS Banner (Requirement 2) */}
        <Card className="border border-border/80 bg-gradient-to-r from-card via-card to-primary/[0.04] shadow-soft">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0 mt-1 md:mt-0">
                  <Settings className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-foreground">Website Settings & CMS Management</h3>
                    <Badge variant="outline" className="text-[10px] bg-primary/5 text-primary border-primary/20">
                      Live CMS
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 max-w-2xl leading-relaxed">
                    Customize branding, homepage hero banners, company contacts, WhatsApp integration, TripAdvisor reviews, trust badges, and SEO meta tags in real-time.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
                <Link to="/admin/settings" className="flex-1 md:flex-initial">
                  <Button className="w-full gap-2">
                    <Settings className="h-4 w-4" />
                    Website Settings
                  </Button>
                </Link>
                <a 
                  href="/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex-1 md:flex-initial"
                >
                  <Button variant="outline" className="w-full gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Preview Site
                  </Button>
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;