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
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-safari-cream via-background to-safari-gold/5 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-20 left-0 w-[500px] h-[500px] bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-tl from-safari-gold/15 to-safari-amber/10 rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-10 w-24 h-24 border border-safari-gold/20 rounded-full" />
        <div className="absolute bottom-1/4 left-20 w-16 h-16 border border-primary/20 rounded-full" />
        
        <div className="container-wide mx-auto px-4 md:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-3 mb-8 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full border border-safari-gold/30 shadow-soft"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-safari-gold to-safari-amber flex items-center justify-center">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <span className="text-safari-brown text-sm font-semibold uppercase tracking-[0.2em]">
                Trip Planner
              </span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-6"
            >
              Plan Your <span className="text-gradient-gold">Dream Trip</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              Let our travel experts create a personalized itinerary for your perfect
              Zanzibar and Tanzania adventure.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Premium Form Section */}
      <section className="py-20 md:py-28">
        <div className="container-wide mx-auto px-4 md:px-8">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="shadow-luxury border border-border/50 rounded-2xl bg-white">
                <CardContent className="p-8 md:p-12">
                  <div className="text-center mb-10">
                    <h2 className="font-display text-2xl font-semibold mb-3">Custom Trip Planning</h2>
                    <p className="text-muted-foreground">
                      Fill out the form below with your preferences, and our travel experts will
                      create a personalized itinerary for your Zanzibar adventure.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-10">
                    {/* Personal Information */}
                    <div>
                      <h3 className="font-display text-lg font-semibold mb-5 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-safari-gold/20 to-safari-amber/10 flex items-center justify-center">
                          <Users className="w-5 h-5 text-safari-gold" />
                        </div>
                        Personal Information
                      </h3>
                      <div className="grid md:grid-cols-2 gap-5">
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
                    <div>
                      <h3 className="font-display text-lg font-semibold mb-5 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-safari-gold/20 to-safari-amber/10 flex items-center justify-center">
                          <CalendarIcon className="w-5 h-5 text-safari-gold" />
                        </div>
                        Trip Details
                      </h3>
                      <div className="grid md:grid-cols-2 gap-5">
                        {/* From Date */}
                        <div>
                          <Label className="text-sm font-medium text-foreground">From Date *</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full mt-2 h-12 justify-start text-left font-normal rounded-xl border-border/50 hover:border-safari-gold"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4 text-safari-gold" />
                                {formData.fromDate ? format(formData.fromDate, "PPP") : "Select start date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 rounded-xl" align="start">
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
                        <div>
                          <Label className="text-sm font-medium text-foreground">To Date *</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full mt-2 h-12 justify-start text-left font-normal rounded-xl border-border/50 hover:border-safari-gold"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4 text-safari-gold" />
                                {formData.toDate ? format(formData.toDate, "PPP") : "Select end date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 rounded-xl" align="start">
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
                        <div>
                          <Label className="text-sm font-medium text-foreground">Number of Travelers *</Label>
                          <Select
                            value={formData.travelers}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, travelers: value }))}
                          >
                            <SelectTrigger className="mt-2 h-12 rounded-xl border-border/50 focus:border-safari-gold">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                <SelectItem key={num} value={num.toString()}>
                                  {num} {num === 1 ? "person" : "people"}
                                </SelectItem>
                              ))}
                              <SelectItem value="10+">10+ people</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Budget */}
                        <div>
                          <Label className="text-sm font-medium text-foreground">Budget Range (USD)</Label>
                          <Select
                            value={formData.budget}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, budget: value }))}
                          >
                            <SelectTrigger className="mt-2 h-12 rounded-xl border-border/50 focus:border-safari-gold">
                              <SelectValue placeholder="Select budget" />
                            </SelectTrigger>
                            <SelectContent>
                              {budgetRanges.map(range => (
                                <SelectItem key={range.value} value={range.value}>
                                  {range.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Accommodation */}
                        <div className="md:col-span-2">
                          <Label className="text-sm font-medium text-foreground">Preferred Accommodation Type</Label>
                          <Select
                            value={formData.accommodation}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, accommodation: value }))}
                          >
                            <SelectTrigger className="mt-2 h-12 rounded-xl border-border/50 focus:border-safari-gold">
                              <SelectValue placeholder="Select accommodation type" />
                            </SelectTrigger>
                            <SelectContent>
                              {accommodationTypes.map(type => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Premium Interests Section */}
                    <div>
                      <h3 className="font-display text-lg font-semibold mb-5 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-green-500/10 flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-green-600" />
                        </div>
                        Interests & Activities *
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {interests.map(interest => (
                          <button
                            key={interest.id}
                            type="button"
                            onClick={() => handleInterestToggle(interest.id)}
                            className={`p-4 rounded-2xl border-2 text-left transition-all flex items-center gap-3 ${
                              formData.interests.includes(interest.id)
                                ? "border-safari-gold bg-safari-gold/5 shadow-soft"
                                : "border-border/50 hover:border-safari-gold/50"
                            }`}
                          >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              formData.interests.includes(interest.id) 
                                ? "bg-safari-gold/20" 
                                : "bg-muted"
                            }`}>
                              <interest.icon className={`w-5 h-5 ${
                                formData.interests.includes(interest.id) ? "text-safari-gold" : "text-muted-foreground"
                              }`} />
                            </div>
                            <span className="text-sm font-medium">{interest.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div>
                      <Label htmlFor="additionalInfo" className="text-sm font-medium text-foreground">Additional Information</Label>
                      <Textarea
                        id="additionalInfo"
                        value={formData.additionalInfo}
                        onChange={(e) => setFormData(prev => ({ ...prev, additionalInfo: e.target.value }))}
                        placeholder="Tell us more about your dream trip, special requirements, or any questions..."
                        className="mt-2 min-h-[140px] rounded-xl border-border/50 focus:border-safari-gold resize-none"
                      />
                    </div>

                    {/* Premium Submit Options */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                      <Button
                        type="submit"
                        size="xl"
                        disabled={loading}
                        className="flex-1 h-14 bg-gradient-to-r from-safari-gold to-safari-amber text-safari-night font-bold shadow-lg hover:shadow-xl rounded-xl"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Mail className="w-5 h-5 mr-2" />
                            Submit via Email
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        size="xl"
                        onClick={handleWhatsAppSubmit}
                        className="flex-1 h-14 bg-gradient-to-r from-green-600 to-green-500 text-white font-bold shadow-lg hover:shadow-xl rounded-xl"
                      >
                        <MessageCircle className="w-5 h-5 mr-2" />
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
