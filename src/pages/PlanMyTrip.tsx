import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Compass, 
  Calendar as CalendarIcon, 
  Users, 
  DollarSign,
  Send,
  Loader2,
  MapPin,
  Camera,
  Waves,
  Mountain,
  Utensils,
  Music,
  MessageCircle,
  Mail
} from "lucide-react";

const interests = [
  { id: "safari", label: "Wildlife Safari", icon: Camera },
  { id: "beach", label: "Beach & Relaxation", icon: Waves },
  { id: "culture", label: "Culture & History", icon: Music },
  { id: "adventure", label: "Adventure Activities", icon: Mountain },
  { id: "food", label: "Food & Cuisine", icon: Utensils },
  { id: "photography", label: "Photography Tours", icon: Camera },
];

const accommodationTypes = [
  { value: "budget", label: "Budget ($50-100/night)" },
  { value: "mid-range", label: "Mid-Range ($100-200/night)" },
  { value: "luxury", label: "Luxury ($200-400/night)" },
  { value: "ultra-luxury", label: "Ultra Luxury ($400+/night)" },
];

const budgetRanges = [
  { value: "500-1000", label: "$500 - $1,000" },
  { value: "1000-2000", label: "$1,000 - $2,000" },
  { value: "2000-5000", label: "$2,000 - $5,000" },
  { value: "5000-10000", label: "$5,000 - $10,000" },
  { value: "10000+", label: "$10,000+" },
];

export default function PlanMyTrip() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    fromDate: undefined as Date | undefined,
    toDate: undefined as Date | undefined,
    travelers: "2",
    budget: "",
    accommodation: "",
    interests: [] as string[],
    additionalInfo: ""
  });

  const handleInterestToggle = (interestId: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(i => i !== interestId)
        : [...prev.interests, interestId]
    }));
  };

  // Generate WhatsApp message
  const generateWhatsAppMessage = () => {
    const selectedInterests = interests
      .filter(i => formData.interests.includes(i.id))
      .map(i => i.label)
      .join(", ");

    return `
🌴 *NEW TRIP PLANNING REQUEST*

*Personal Information:*
Name: ${formData.fullName}
Email: ${formData.email}
Phone: ${formData.phone || "Not provided"}

*Trip Details:*
From: ${formData.fromDate ? format(formData.fromDate, "PPP") : "Not selected"}
To: ${formData.toDate ? format(formData.toDate, "PPP") : "Not selected"}
Travelers: ${formData.travelers}
Budget: ${formData.budget || "Not specified"}
Accommodation: ${accommodationTypes.find(a => a.value === formData.accommodation)?.label || "Not specified"}

*Interests:*
${selectedInterests || "Not specified"}

*Additional Notes:*
${formData.additionalInfo || "None"}
    `.trim();
  };

  const handleWhatsAppSubmit = () => {
    if (!formData.fullName || !formData.email) {
      toast({
        title: "Missing Information",
        description: "Please provide at least your name and email.",
        variant: "destructive"
      });
      return;
    }
    
    const message = generateWhatsAppMessage();
    window.open(`https://wa.me/255758241294?text=${encodeURIComponent(message)}`, "_blank");
    
    toast({
      title: "Request Sent!",
      description: "We'll contact you shortly with a personalized itinerary.",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.fromDate || !formData.toDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Build message for email submission
      const selectedInterests = interests
        .filter(i => formData.interests.includes(i.id))
        .map(i => i.label)
        .join(", ");

      const tripDetails = `
Trip Planning Request

Personal Information:
- Name: ${formData.fullName}
- Email: ${formData.email}
- Phone: ${formData.phone || 'Not provided'}

Trip Details:
- From: ${formData.fromDate ? format(formData.fromDate, "PPP") : "Not selected"}
- To: ${formData.toDate ? format(formData.toDate, "PPP") : "Not selected"}
- Travelers: ${formData.travelers}
- Budget: ${formData.budget || 'Not specified'}
- Accommodation: ${accommodationTypes.find(a => a.value === formData.accommodation)?.label || "Not specified"}

Interests: ${selectedInterests || 'Not specified'}

Additional Notes: ${formData.additionalInfo || 'None'}
      `.trim();

      // Send email to admin via Edge Function
      const { error } = await supabase.functions.invoke('send-booking-email', {
        body: {
          customerName: formData.fullName,
          customerEmail: formData.email,
          customerPhone: formData.phone || 'Not provided',
          tourName: 'Trip Planning Request',
          travelDate: formData.fromDate ? format(formData.fromDate, 'PPP') : 'TBD',
          numberOfGuests: parseInt(formData.travelers),
          specialRequests: tripDetails,
        },
      });

      if (error) throw error;
      
      toast({
        title: "Request Submitted! 🎉",
        description: "We'll contact you via email with a personalized itinerary.",
      });

      // Reset form
      setFormData({
        fullName: '', email: '', phone: '',
        fromDate: undefined, toDate: undefined,
        travelers: '2', budget: '', accommodation: '',
        interests: [], additionalInfo: ''
      });
    } catch (error: any) {
      console.error('Trip planning error:', error);
      toast({
        title: "Submission Failed",
        description: error.message || "Please try again or contact us directly.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Premium Hero Section */}
      <section className="relative pt-32 pb-24 bg-safari-night overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80" 
            alt="Safari Landscape" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-safari-night/60 via-safari-night/80 to-background"></div>
        </div>
        
        <div className="container-wide mx-auto px-4 md:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-safari-gold/20 text-safari-gold px-6 py-2 rounded-full text-sm font-bold mb-8 border border-safari-gold/30 uppercase tracking-widest"
            >
              <Compass className="w-4 h-4" /> Trip Planner
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Plan Your <span className="text-safari-gold italic">Dream Trip</span>
            </h1>
            <p className="text-white/80 text-xl md:text-2xl leading-relaxed max-w-2xl mx-auto">
              Let our travel experts create a personalized itinerary for your perfect Zanzibar and Tanzania adventure.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Premium Form Section */}
      <section className="py-24 relative">
        <div className="container-wide mx-auto px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="shadow-2xl border border-border/40 rounded-[2.5rem] bg-white/80 backdrop-blur-md overflow-hidden">
                <CardContent className="p-8 md:p-16">
                  <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-safari-night mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Custom Trip Planning</h2>
                    <p className="text-muted-foreground text-lg">
                      Fill out the form below with your preferences, and our travel experts will
                      create a personalized itinerary for your Zanzibar adventure.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-16">
                    {/* Personal Information */}
                    <div className="space-y-8">
                      <h3 className="text-2xl font-bold text-safari-night flex items-center gap-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        <div className="w-12 h-12 rounded-2xl bg-safari-gold/10 flex items-center justify-center">
                          <Users className="w-6 h-6 text-safari-gold" />
                        </div>
                        Personal Information
                      </h3>
                      <div className="grid md:grid-cols-2 gap-8">
                        <div>
                          <Label htmlFor="fullName" className="text-sm font-medium text-foreground">Full Name *</Label>
                          <Input
                            id="fullName"
                            value={formData.fullName}
                            onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                            placeholder="John Doe"
                            className="mt-2 h-12 rounded-xl border-border/50 focus:border-safari-gold"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email" className="text-sm font-medium text-foreground">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="john@example.com"
                            className="mt-2 h-12 rounded-xl border-border/50 focus:border-safari-gold"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label htmlFor="phone" className="text-sm font-medium text-foreground">Phone Number</Label>
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                            placeholder="+255 XXX XXX XXX"
                            className="mt-2 h-12 rounded-xl border-border/50 focus:border-safari-gold"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Trip Details */}
                    <div className="space-y-8">
                      <h3 className="text-2xl font-bold text-safari-night flex items-center gap-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        <div className="w-12 h-12 rounded-2xl bg-safari-gold/10 flex items-center justify-center">
                          <CalendarIcon className="w-6 h-6 text-safari-gold" />
                        </div>
                        Trip Details
                      </h3>
                      <div className="grid md:grid-cols-2 gap-8">
                        {/* From Date */}
                        <div className="space-y-3">
                          <Label className="text-sm font-bold text-safari-night uppercase tracking-wider">From Date *</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full h-14 justify-start text-left font-normal rounded-2xl border-border/50 hover:border-safari-gold hover:bg-safari-gold/5 transition-all"
                              >
                                <CalendarIcon className="mr-3 h-5 w-5 text-safari-gold" />
                                {formData.fromDate ? format(formData.fromDate, "PPP") : "Select start date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 rounded-2xl shadow-2xl border-border/40" align="start">
                              <Calendar
                                mode="single"
                                selected={formData.fromDate}
                                onSelect={(date) => setFormData(prev => ({ ...prev, fromDate: date }))}
                                disabled={(date) => date < new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>

                        {/* To Date */}
                        <div className="space-y-3">
                          <Label className="text-sm font-bold text-safari-night uppercase tracking-wider">To Date *</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full h-14 justify-start text-left font-normal rounded-2xl border-border/50 hover:border-safari-gold hover:bg-safari-gold/5 transition-all"
                              >
                                <CalendarIcon className="mr-3 h-5 w-5 text-safari-gold" />
                                {formData.toDate ? format(formData.toDate, "PPP") : "Select end date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 rounded-2xl shadow-2xl border-border/40" align="start">
                              <Calendar
                                mode="single"
                                selected={formData.toDate}
                                onSelect={(date) => setFormData(prev => ({ ...prev, toDate: date }))}
                                disabled={(date) => date < (formData.fromDate || new Date())}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>

                        {/* Number of Travelers */}
                        <div className="space-y-3">
                          <Label className="text-sm font-bold text-safari-night uppercase tracking-wider">Number of Travelers *</Label>
                          <Select
                            value={formData.travelers}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, travelers: value }))}
                          >
                            <SelectTrigger className="h-14 rounded-2xl border-border/50 focus:ring-safari-gold/20 focus:border-safari-gold">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl shadow-2xl border-border/40">
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                <SelectItem key={num} value={num.toString()} className="rounded-xl">
                                  {num} {num === 1 ? "person" : "people"}
                                </SelectItem>
                              ))}
                              <SelectItem value="10+" className="rounded-xl">10+ people</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Budget */}
                        <div className="space-y-3">
                          <Label className="text-sm font-bold text-safari-night uppercase tracking-wider">Budget Range (USD)</Label>
                          <Select
                            value={formData.budget}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, budget: value }))}
                          >
                            <SelectTrigger className="h-14 rounded-2xl border-border/50 focus:ring-safari-gold/20 focus:border-safari-gold">
                              <SelectValue placeholder="Select budget" />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl shadow-2xl border-border/40">
                              {budgetRanges.map(range => (
                                <SelectItem key={range.value} value={range.value} className="rounded-xl">
                                  {range.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Accommodation */}
                        <div className="md:col-span-2 space-y-3">
                          <Label className="text-sm font-bold text-safari-night uppercase tracking-wider">Preferred Accommodation Type</Label>
                          <Select
                            value={formData.accommodation}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, accommodation: value }))}
                          >
                            <SelectTrigger className="h-14 rounded-2xl border-border/50 focus:ring-safari-gold/20 focus:border-safari-gold">
                              <SelectValue placeholder="Select accommodation type" />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl shadow-2xl border-border/40">
                              {accommodationTypes.map(type => (
                                <SelectItem key={type.value} value={type.value} className="rounded-xl">
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Premium Interests Section */}
                    <div className="space-y-8">
                      <h3 className="text-2xl font-bold text-safari-night flex items-center gap-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        <div className="w-12 h-12 rounded-2xl bg-safari-gold/10 flex items-center justify-center">
                          <MapPin className="w-6 h-6 text-safari-gold" />
                        </div>
                        Interests & Activities *
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {interests.map(interest => (
                          <button
                            key={interest.id}
                            type="button"
                            onClick={() => handleInterestToggle(interest.id)}
                            className={`p-6 rounded-[2rem] border-2 text-left transition-all duration-300 flex items-center gap-4 group ${
                              formData.interests.includes(interest.id)
                                ? "border-safari-gold bg-safari-gold/5 shadow-xl shadow-safari-gold/5"
                                : "border-border/40 hover:border-safari-gold/30 hover:bg-muted/30"
                            }`}
                          >
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                              formData.interests.includes(interest.id) 
                                ? "bg-safari-gold text-safari-night" 
                                : "bg-muted group-hover:bg-safari-gold/10 group-hover:text-safari-gold"
                            }`}>
                              <interest.icon className="w-7 h-7" />
                            </div>
                            <span className={`font-bold transition-colors ${
                              formData.interests.includes(interest.id) ? "text-safari-night" : "text-muted-foreground"
                            }`}>{interest.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="space-y-3">
                      <Label htmlFor="additionalInfo" className="text-sm font-bold text-safari-night uppercase tracking-wider">Additional Information</Label>
                      <Textarea
                        id="additionalInfo"
                        value={formData.additionalInfo}
                        onChange={(e) => setFormData(prev => ({ ...prev, additionalInfo: e.target.value }))}
                        placeholder="Tell us more about your dream trip, special requirements, or any questions..."
                        className="min-h-[180px] rounded-[2rem] border-border/50 focus:ring-safari-gold/20 focus:border-safari-gold resize-none p-6 text-lg"
                      />
                    </div>

                    {/* Premium Submit Options */}
                    <div className="flex flex-col sm:flex-row gap-6 pt-8">
                      <Button
                        type="submit"
                        disabled={loading}
                        className="flex-1 h-20 bg-safari-night hover:bg-safari-gold hover:text-safari-night text-white font-bold shadow-2xl rounded-full text-xl transition-all duration-300 group"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Mail className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                            Submit via Email
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        onClick={handleWhatsAppSubmit}
                        className="flex-1 h-20 bg-green-600 hover:bg-green-500 text-white font-bold shadow-2xl rounded-full text-xl transition-all duration-300 group"
                      >
                        <MessageCircle className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                        Submit via WhatsApp
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
