import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import BookingForm from '@/components/tours/BookingForm';

const TourPage = () => {
  const { slug } = useParams();
  const [tour, setTour] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    supabase.from('tours').select('*').eq('slug', slug).maybeSingle()
      .then(({ data, error }) => {
        if (error) {
          console.error('Error fetching tour', error);
        } else {
          setTour(data || null);
        }
      }).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );

  if (!tour) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <p className="text-muted-foreground">Tour not found.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container-wide mx-auto py-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl overflow-hidden">
            <img src={tour.featured_image} alt={tour.title} className="w-full h-96 object-cover" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">{tour.title}</h1>
            <p className="text-muted-foreground">{tour.short_description}</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Overview</h3>
            <p className="text-muted-foreground whitespace-pre-line">{tour.description}</p>
          </div>

          {tour.itinerary && tour.itinerary.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Itinerary</h3>
              <div className="space-y-3">
                {tour.itinerary.map((day: any) => (
                  <div key={day.day} className="p-4 bg-background rounded-lg border border-border">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">Day {day.day}: {day.title}</div>
                      <div className="text-sm text-muted-foreground">{day.activities?.join(', ')}</div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{day.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        <aside>
          <div className="sticky top-24 space-y-6">
            <div className="bg-card p-6 rounded-2xl border border-border">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-sm text-muted-foreground">From</div>
                  <div className="text-2xl font-bold text-primary">${tour.price?.toLocaleString() || 'Contact'}</div>
                </div>
                <div className="text-sm text-muted-foreground">{tour.duration}</div>
              </div>
              <div className="mb-4">
                <strong>Highlights</strong>
                <div className="mt-2 flex flex-wrap gap-2">
                  {tour.highlights?.slice(0,4).map((h: string, i: number) => (
                    <span key={i} className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground">{h}</span>
                  ))}
                </div>
              </div>
              <BookingForm tourId={tour.id} />
            </div>

            <div className="p-4 text-sm text-muted-foreground">
              <p>Need help? Contact our travel experts for bespoke itineraries and group bookings.</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default TourPage;
