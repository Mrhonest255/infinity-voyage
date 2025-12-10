import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { CalendarIcon, Loader2, CheckCircle2, Users, Mail, Phone, MapPin, Clock, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const WHATSAPP_NUMBER = '255758241294';

const bookingSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  date: z.date({
    required_error: 'Please select a travel date',
  }).refine((date) => date >= new Date(new Date().setHours(0, 0, 0, 0)), {
    message: 'Travel date must be in the future',
  }),
  guests: z.string().min(1, 'Please select number of guests'),
  notes: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

interface Props {
  tourId?: string | null;
  tourName?: string;
}

const BookingForm = ({ tourId, tourName }: Props) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Generate WhatsApp booking message
  const generateWhatsAppMessage = () => {
    const formData = form.getValues();
    const message = `🦁 *BOOKING INQUIRY*
━━━━━━━━━━━━━━━━━
*Tour/Activity:* ${tourName || 'General Inquiry'}
*Name:* ${formData.name || 'Not specified'}
*Email:* ${formData.email || 'Not specified'}
*Phone:* ${formData.phone || 'Not specified'}
*Travel Date:* ${formData.date ? format(formData.date, 'PPP') : 'Not selected'}
*Guests:* ${formData.guests || '2'}
*Special Requests:* ${formData.notes || 'None'}
━━━━━━━━━━━━━━━━━
I would like to book this adventure!`;
    
    return encodeURIComponent(message);
  };

  const handleWhatsAppBooking = () => {
    const message = generateWhatsAppMessage();
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      date: undefined,
      guests: '2',
      notes: '',
    },
  });

  const onSubmit = async (data: BookingFormValues) => {
    setIsSubmitting(true);
    setIsSuccess(false);

    try {
      const payload = {
        customer_name: data.name,
        customer_email: data.email,
        customer_phone: data.phone || null,
        travel_date: format(data.date, 'yyyy-MM-dd'),
        number_of_guests: parseInt(data.guests),
        special_requests: data.notes || null,
        status: 'pending',
        tour_id: tourId || null,
      };

      const { data: insertedBooking, error } = await supabase
        .from('bookings')
        .insert(payload)
        .select('tracking_code')
        .single();
      
      if (error) throw error;

      const trackingCode = insertedBooking?.tracking_code;

      // Send email notifications via Edge Function (fire-and-forget, don't wait)
      supabase.functions.invoke('send-booking-email', {
        body: {
          customerName: data.name,
          customerEmail: data.email,
          customerPhone: data.phone || 'Not provided',
          travelDate: format(data.date, 'PPP'),
          numberOfGuests: parseInt(data.guests),
          specialRequests: data.notes || 'None',
          tourName: tourName || 'General Inquiry',
          trackingCode: trackingCode || '',
        },
      }).catch((emailErr) => {
        // Don't fail the booking if email fails, just log it
        console.error('Email notification failed:', emailErr);
      });

      // Send SMS notification to admin via Edge Function (fire-and-forget)
      supabase.functions.invoke('send-booking-sms', {
        body: {
          customerName: data.name,
          customerPhone: data.phone || '',
          travelDate: format(data.date, 'PPP'),
          numberOfGuests: parseInt(data.guests),
          tourName: tourName || 'General Inquiry',
          trackingCode: trackingCode || '',
        },
      }).catch((smsErr) => {
        // Don't fail the booking if SMS fails, just log it
        console.error('SMS notification failed:', smsErr);
      });

      setIsSuccess(true);
      toast({
        title: 'Booking Request Sent! 🎉',
        description: 'We received your booking request. Our team will reach out to you soon to confirm your adventure.',
        duration: 5000,
      });

      // Navigate to ThankYou page with tracking code and booking details
      setTimeout(() => {
        form.reset();
        const params = new URLSearchParams({
          code: trackingCode || '',
          name: data.name,
          email: data.email,
          tour: tourName || 'General Inquiry',
          date: format(data.date, 'PPP'),
          guests: data.guests,
        });
        navigate(`/thank-you?${params.toString()}`);
      }, 1500);
    } catch (err: any) {
      console.error('Booking error', err);
      toast({
        title: 'Booking Failed',
        description: err.message || 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-8 rounded-2xl border-2 border-green-200 dark:border-green-800 shadow-elevated">
        <div className="text-center space-y-4 animate-scale-in">
          <div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-display font-semibold text-green-900 dark:text-green-100">
            Booking Request Submitted!
          </h3>
          <p className="text-green-700 dark:text-green-300">
            We'll contact you shortly to confirm your adventure.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-background via-card to-background/50 p-6 md:p-8 rounded-2xl border border-border shadow-elevated backdrop-blur-sm">
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl md:text-3xl font-display font-bold mb-2 bg-gradient-to-r from-safari-gold to-safari-amber bg-clip-text text-transparent">
            Book Your Adventure
          </h3>
          {tourName && (
            <p className="text-muted-foreground flex items-center gap-2">
              <MapPin className="w-4 h-4 text-safari-gold" />
              <span className="font-medium">{tourName}</span>
            </p>
          )}
          <p className="text-sm text-muted-foreground mt-2">
            Fill out the form below and our team will get back to you within 24 hours
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="flex items-center gap-2 text-base font-semibold">
                      <Users className="w-4 h-4 text-safari-gold" />
                      Full Name *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
                        className="h-12 text-base border-2 focus:border-safari-gold transition-colors"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-base font-semibold">
                      <Mail className="w-4 h-4 text-safari-gold" />
                      Email Address *
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        className="h-12 text-base border-2 focus:border-safari-gold transition-colors"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone Field */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-base font-semibold">
                      <Phone className="w-4 h-4 text-safari-gold" />
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="+255 123 456 789"
                        className="h-12 text-base border-2 focus:border-safari-gold transition-colors"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Optional - helps us reach you faster
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Date Field */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="flex items-center gap-2 text-base font-semibold">
                      <Clock className="w-4 h-4 text-safari-gold" />
                      Travel Date *
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'h-12 w-full text-left font-normal text-base border-2 hover:border-safari-gold transition-colors',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span className="flex items-center gap-2">
                                <CalendarIcon className="w-4 h-4 text-safari-gold" />
                                Pick a date
                              </span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription className="text-xs">
                      Select your preferred travel date
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Guests Field */}
              <FormField
                control={form.control}
                name="guests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-base font-semibold">
                      <Users className="w-4 h-4 text-safari-gold" />
                      Number of Guests *
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 text-base border-2 focus:border-safari-gold transition-colors">
                          <SelectValue placeholder="Select guests" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} {num === 1 ? 'Guest' : 'Guests'}
                          </SelectItem>
                        ))}
                        <SelectItem value="13">13+ Guests (Group)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-xs">
                      Maximum group size: 12 (contact us for larger groups)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Notes Field */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="text-base font-semibold">Special Requests or Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about any dietary requirements, accessibility needs, or special preferences..."
                        className="min-h-24 text-base border-2 focus:border-safari-gold transition-colors resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Optional - help us customize your experience
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Dual Booking Options */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 h-14 text-base font-semibold bg-gradient-to-r from-safari-gold to-safari-amber hover:from-safari-amber hover:to-safari-gold text-foreground shadow-glow hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5 mr-2" />
                    Book via Email
                  </>
                )}
              </Button>

              <Button
                type="button"
                onClick={handleWhatsAppBooking}
                className="flex-1 h-14 text-base font-semibold bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-600 text-white shadow-lg hover:shadow-2xl transition-all duration-300"
                size="lg"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Book via WhatsApp
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              By submitting this form, you agree to our terms of service and privacy policy.
              We respect your data and will never share it with third parties.
            </p>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default BookingForm;