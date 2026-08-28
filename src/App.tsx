import { lazy, Suspense, Component, ErrorInfo, ReactNode } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import { CartProvider } from "@/hooks/useCart";
import { useKeepAlive } from "@/hooks/useKeepAlive";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { CartDrawer } from "@/components/cart/Cart";
import { Loader2 } from "lucide-react";

// Lazy load public pages
const Index = lazy(() => import("./pages/Index"));
const Safaris = lazy(() => import("./pages/Safaris"));
const Zanzibar = lazy(() => import("./pages/Zanzibar"));
const Contact = lazy(() => import("./pages/Contact"));
const About = lazy(() => import("./pages/About"));
const Auth = lazy(() => import("./pages/Auth"));
const Prices = lazy(() => import("./pages/Prices"));
const Gallery = lazy(() => import("./pages/Gallery"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const TourPage = lazy(() => import("./pages/Tour"));
const ActivityPage = lazy(() => import("./pages/Activity"));
const ThankYou = lazy(() => import("./pages/ThankYou"));
const SafariCalculator = lazy(() => import("./pages/SafariCalculator"));
const Transfers = lazy(() => import("./pages/Transfers"));
const PlanMyTrip = lazy(() => import("./pages/PlanMyTrip"));
const Blog = lazy(() => import("./pages/Blog"));
const TrackBooking = lazy(() => import("./pages/TrackBooking"));
const Checkout = lazy(() => import("./pages/Checkout"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Lazy load heavy admin pages (completely isolated chunks)
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminTours = lazy(() => import("./pages/admin/Tours"));
const TourEditor = lazy(() => import("./pages/admin/TourEditor"));
const AdminActivities = lazy(() => import("./pages/admin/Activities"));
const ActivityEditor = lazy(() => import("./pages/admin/ActivityEditor"));
const AdminBookings = lazy(() => import("./pages/admin/Bookings"));
const AdminSettings = lazy(() => import("./pages/admin/Settings"));
const AdminTransfers = lazy(() => import("./pages/admin/Transfers"));
const TransferEditor = lazy(() => import("./pages/admin/TransferEditor"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 min cache
    },
    mutations: {
      retry: 0,
      onError: (error) => {
        console.error("Mutation error:", error);
      },
    },
  },
});

const PageFallback = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      <span className="text-xs font-semibold text-slate-500 tracking-wider uppercase">Loading experience...</span>
    </div>
  </div>
);

// Global Error Boundary to prevent white screens
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class GlobalErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Global Error Boundary caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-slate-200">
            <div className="text-amber-500 text-5xl mb-4">⚠️</div>
            <h1 className="text-xl font-bold text-slate-900 mb-2">Something went wrong</h1>
            <p className="text-slate-600 mb-6 text-sm">An unexpected error occurred. Please refresh the page to continue.</p>
            {this.state.error && (
              <pre className="bg-slate-100 p-3 rounded-xl text-xs text-left overflow-auto max-h-32 mb-6 text-slate-700">
                {this.state.error.message}
              </pre>
            )}
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-5 py-2.5 bg-slate-900 text-white font-semibold text-sm rounded-xl hover:bg-slate-800 transition-colors"
              >
                Reload Page
              </button>
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.history.back();
                }}
                className="px-5 py-2.5 bg-slate-100 text-slate-700 font-semibold text-sm rounded-xl hover:bg-slate-200 transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const AppRoutes = () => {
  // Silent keep-alive hook to ensure database never sleeps
  useKeepAlive();

  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/safaris" element={<Safaris />} />
        <Route path="/tour/:slug" element={<TourPage />} />
        <Route path="/activity/:slug" element={<ActivityPage />} />
        <Route path="/zanzibar" element={<Zanzibar />} />
        <Route path="/prices" element={<Prices />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/safari-calculator" element={<SafariCalculator />} />
        <Route path="/transfers" element={<Transfers />} />
        <Route path="/plan-my-trip" element={<PlanMyTrip />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/track-booking" element={<TrackBooking />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/auth" element={<Auth />} />
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/tours" element={<AdminTours />} />
        <Route path="/admin/tours/:id" element={<TourEditor />} />
        <Route path="/admin/activities" element={<AdminActivities />} />
        <Route path="/admin/activities/:id" element={<ActivityEditor />} />
        <Route path="/admin/bookings" element={<AdminBookings />} />
        <Route path="/admin/transfers" element={<AdminTransfers />} />
        <Route path="/admin/transfers/:id" element={<TransferEditor />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

const App = () => (
  <GlobalErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppRoutes />
              <CartDrawer />
              <WhatsAppButton phoneNumber="255758241294" />
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  </GlobalErrorBoundary>
);

export default App;