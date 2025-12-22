import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { CartProvider } from "@/hooks/useCart";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { CartDrawer } from "@/components/cart/Cart";
import { Component, ErrorInfo, ReactNode } from "react";
import Index from "./pages/Index";
import Safaris from "./pages/Safaris";
import Zanzibar from "./pages/Zanzibar";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Auth from "./pages/Auth";
import Prices from "./pages/Prices";
import Gallery from "./pages/Gallery";
import FAQ from "./pages/FAQ";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminTours from "./pages/admin/Tours";
import TourEditor from "./pages/admin/TourEditor";
import AdminActivities from "./pages/admin/Activities";
import ActivityEditor from "./pages/admin/ActivityEditor";
import AdminBookings from "./pages/admin/Bookings";
import AdminSettings from "./pages/admin/Settings";
import AdminTransfers from "./pages/admin/Transfers";
import TransferEditor from "./pages/admin/TransferEditor";
import NotFound from "./pages/NotFound";
import TourPage from "./pages/Tour";
import ThankYou from "./pages/ThankYou";
import SafariCalculator from "./pages/SafariCalculator";
import Transfers from "./pages/Transfers";
import PlanMyTrip from "./pages/PlanMyTrip";
import Blog from "./pages/Blog";
import TrackBooking from "./pages/TrackBooking";
import Checkout from "./pages/Checkout";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
      onError: (error) => {
        console.error('Mutation error:', error);
      },
    },
  },
});

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
    console.error('Global Error Boundary caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h1>
            <p className="text-gray-600 mb-4">An unexpected error occurred. Please try again.</p>
            {this.state.error && (
              <pre className="bg-gray-100 p-3 rounded text-xs text-left overflow-auto max-h-32 mb-4">
                {this.state.error.message}
              </pre>
            )}
            <div className="flex gap-2 justify-center">
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Reload Page
              </button>
              <button 
                onClick={() => { this.setState({ hasError: false, error: null }); window.history.back(); }} 
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
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

const App = () => (
  <GlobalErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/safaris" element={<Safaris />} />
                <Route path="/tour/:slug" element={<TourPage />} />
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