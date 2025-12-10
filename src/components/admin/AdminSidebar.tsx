import { NavLink, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  LayoutDashboard, 
  Map, 
  Compass, 
  CalendarCheck, 
  Settings, 
  LogOut,
  ChevronLeft,
  Menu,
  ExternalLink,
  X,
  Car
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: Map, label: 'Safari Tours', path: '/admin/tours' },
  { icon: Compass, label: 'Activities', path: '/admin/activities' },
  { icon: Car, label: 'Transfers', path: '/admin/transfers' },
  { icon: CalendarCheck, label: 'Bookings', path: '/admin/bookings' },
  { icon: Settings, label: 'Settings', path: '/admin/settings' },
];

const AdminSidebar = () => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Fetch pending bookings count for badge
  const { data: pendingCount } = useQuery({
    queryKey: ['pending-bookings-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');
      
      if (error) return 0;
      return count || 0;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const SidebarContent = () => (
    <>
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        {!collapsed && (
          <h1 className="font-display text-lg font-bold text-foreground truncate">
            Admin Panel
          </h1>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            if (mobileOpen) {
              setMobileOpen(false);
            } else {
              setCollapsed(!collapsed);
            }
          }}
          className="shrink-0 hidden lg:flex"
        >
          {collapsed ? <Menu className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileOpen(false)}
          className="shrink-0 lg:hidden"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/admin'}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
              isActive 
                ? "bg-primary text-primary-foreground" 
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {!collapsed && (
              <span className="truncate flex-1">{item.label}</span>
            )}
            {/* Show pending badge for Bookings */}
            {item.label === 'Bookings' && pendingCount && pendingCount > 0 && (
              <Badge 
                variant="destructive" 
                className={cn(
                  "h-5 min-w-5 flex items-center justify-center text-xs px-1.5",
                  collapsed && "absolute -top-1 -right-1"
                )}
              >
                {pendingCount > 99 ? '99+' : pendingCount}
              </Badge>
            )}
          </NavLink>
        ))}
        
        {/* View Website Link */}
        <Link
          to="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-muted-foreground hover:bg-secondary hover:text-foreground mt-4"
        >
          <ExternalLink className="h-5 w-5 shrink-0" />
          {!collapsed && <span className="truncate">View Website</span>}
        </Link>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border space-y-3">
        {!collapsed && user && (
          <div className="text-sm text-muted-foreground truncate">
            {user.email}
          </div>
        )}
        <Button
          variant="ghost"
          onClick={handleSignOut}
          className={cn(
            "w-full justify-start gap-3 text-muted-foreground hover:text-destructive",
            collapsed && "justify-center"
          )}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b border-border flex items-center justify-between px-4 z-40">
        <h1 className="font-display text-lg font-bold text-foreground">Admin Panel</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 h-screen bg-card border-r border-border flex flex-col transition-all duration-300 z-50",
        // Desktop
        "hidden lg:flex",
        collapsed ? "lg:w-16" : "lg:w-64"
      )}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <aside className={cn(
        "lg:hidden fixed left-0 top-0 h-screen w-64 bg-card border-r border-border flex flex-col transition-transform duration-300 z-50",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <SidebarContent />
      </aside>

      {/* Mobile spacer */}
      <div className="lg:hidden h-16" />
    </>
  );
};

export default AdminSidebar;
