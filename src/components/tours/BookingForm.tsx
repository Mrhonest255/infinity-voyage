import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface Props {
  tourId?: string | null;
}

const BookingForm = ({ tourId }: Props) => {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState<Date | undefined>();
  const [guests, setGuests] = useState(2);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!name || !email || !date) {
      toast({ title: 'Missing fields', description: 'Please provide name, email and date', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        customer_name: name,
        customer_email: email,
        customer_phone: phone || null,
        travel_date: format(date, 'yyyy-MM-dd'),
        number_of_guests: guests,
        special_requests: notes || null,
        status: 'pending',
        tour_id: tourId || null,
      };

      const { error } = await supabase.from('bookings').insert(payload);
      if (error) throw error;

      toast({ title: 'Request sent', description: 'We received your booking request. We will reach out soon.' });
      setName(''); setEmail(''); setPhone(''); setDate(undefined); setGuests(2); setNotes('');
    } catch (err: any) {
      console.error('Booking error', err);
      toast({ title: 'Booking failed', description: err.message || 'Please try again', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background/80 p-6 rounded-2xl shadow-soft">
      <h3 className="text-lg font-semibold mb-4">Request a Booking</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Input placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input placeholder="Phone (optional)" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <div>
          <p className="text-xs text-muted-foreground mb-1">Travel date</p>
          <Calendar mode="single" selected={date} onSelect={setDate} />
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Guests</p>
          <Select onValueChange={(v) => setGuests(parseInt(v))}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={`${guests} guests`} />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 10 }).map((_, i) => (
                <SelectItem key={i} value={`${i+1}`}>{i+1} guest{i>0 ? 's' : ''}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2">
          <Textarea placeholder="Any special requests?" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <Button onClick={submit} disabled={loading}>{loading ? 'Sending...' : 'Send Request'}</Button>
      </div>
    </div>
  );
};

export default BookingForm;
