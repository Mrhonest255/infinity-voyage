import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import AdminSidebar from './AdminSidebar';
import { Loader2 } from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/auth');
      } else if (!isAdmin) {
        navigate('/');
      }
    }
  }, [user, isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <main className="lg:ml-64 min-h-screen p-4 lg:p-6 transition-all duration-300 pt-20 lg:pt-6">
        {children}
      </main>
      {/* Debug overlay - enable by adding ?debug=1 to the URL */}
      {typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('debug') === '1' && (
        <div className="fixed right-4 bottom-4 z-50 bg-card border border-border p-3 rounded-lg text-xs w-64 shadow-lg">
          <div className="font-semibold mb-2">Admin Debug</div>
          <div className="truncate"><strong>Loading:</strong> {String(loading)}</div>
          <div className="truncate"><strong>isAdmin:</strong> {String(isAdmin)}</div>
          <div className="truncate"><strong>User:</strong> {user?.email ?? 'null'}</div>
          <div className="truncate"><strong>User ID:</strong> {user?.id ?? 'null'}</div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;