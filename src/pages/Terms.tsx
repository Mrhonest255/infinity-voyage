import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";

const Terms = () => {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: `By accessing and using Infinity Voyage Tours & Safaris' website and services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not access or use our services.

These terms apply to all visitors, users, and clients who access or use our services, including safari tours, Zanzibar excursions, and related travel arrangements.`
    },
    {
      title: "2. Booking and Reservations",
      content: `2.1 Booking Confirmation: A booking is confirmed upon receipt of the required deposit (typically 30% of the total cost) and written confirmation from Infinity Voyage Tours & Safaris.

2.2 Payment Terms: The remaining balance is due 60 days before the departure date. For bookings made within 60 days of departure, full payment is required at the time of booking.

2.3 Pricing: All prices are quoted in US Dollars (USD) unless otherwise stated. Prices are subject to change until a booking is confirmed with a deposit.

2.4 Travel Documents: Clients are responsible for ensuring they have valid passports, visas, and any required vaccinations for travel to Tanzania.`
    },
    {
      title: "3. Cancellation Policy",
      content: `3.1 Client Cancellations:
- 60+ days before departure: Full refund minus $100 administrative fee
- 30-59 days before departure: 50% refund
- 15-29 days before departure: 25% refund
- Less than 15 days before departure: No refund

3.2 Company Cancellations: In the unlikely event that we must cancel a tour, clients will receive a full refund or the option to reschedule without penalty.

3.3 Force Majeure: No refunds will be provided for cancellations due to circumstances beyond our control (natural disasters, civil unrest, pandemics, etc.).

3.4 Travel Insurance: We strongly recommend purchasing comprehensive travel insurance to protect against unforeseen cancellations.`
    },
    {
      title: "4. Changes and Modifications",
      content: `4.1 Client Changes: Requests to modify bookings are subject to availability and may incur additional fees. Changes made within 30 days of departure may not be possible.

4.2 Company Changes: We reserve the right to make minor changes to itineraries for operational reasons or circumstances beyond our control. Significant changes will be communicated promptly, and alternatives will be offered.

4.3 Substitutions: Accommodations and vehicles may be substituted with similar quality alternatives if the originally booked option becomes unavailable.`
    },
    {
      title: "5. Health and Safety",
      content: `5.1 Medical Conditions: Clients must inform us of any medical conditions, disabilities, or special requirements at the time of booking. We will make reasonable efforts to accommodate special needs.

5.2 Fitness Level: Some of our tours require a moderate level of fitness. Clients are responsible for assessing their own fitness for the chosen tour.

5.3 Wildlife Safety: Clients must follow all safety instructions provided by guides. Wildlife encounters involve inherent risks, and clients participate at their own risk.

5.4 Insurance Requirement: Comprehensive travel and medical insurance, including emergency evacuation coverage, is mandatory for all clients.`
    },
    {
      title: "6. Liability Limitations",
      content: `6.1 Third-Party Services: We act as intermediaries for various service providers (hotels, airlines, etc.). We are not liable for the acts or omissions of these third parties.

6.2 Personal Belongings: We are not responsible for loss, damage, or theft of personal belongings during tours.

6.3 Maximum Liability: Our maximum liability is limited to the total amount paid for the tour services, excluding any additional expenses such as flights.

6.4 Indemnification: Clients agree to indemnify and hold harmless Infinity Voyage Tours & Safaris from any claims arising from their own negligence or breach of these terms.`
    },
    {
      title: "7. Conduct and Behavior",
      content: `7.1 Responsible Tourism: Clients are expected to behave responsibly and respectfully towards wildlife, local communities, and fellow travelers.

7.2 Guide Authority: Tour guides have the authority to enforce safety rules and may exclude participants who pose a risk to themselves or others.

7.3 Illegal Activities: Any illegal activities during tours are strictly prohibited and will result in immediate termination of services without refund.`
    },
    {
      title: "8. Intellectual Property",
      content: `8.1 Content: All content on our website, including text, images, logos, and designs, is the property of Infinity Voyage Tours & Safaris and is protected by copyright laws.

8.2 Photo Usage: By participating in our tours, clients grant us permission to use photographs taken during tours for marketing purposes, unless written objection is received.`
    },
    {
      title: "9. Privacy",
      content: `Your privacy is important to us. Please refer to our Privacy Policy for information on how we collect, use, and protect your personal data.`
    },
    {
      title: "10. Governing Law",
      content: `These Terms of Service shall be governed by and construed in accordance with the laws of the United Republic of Tanzania. Any disputes shall be resolved through the courts of Tanzania.`
    },
    {
      title: "11. Contact Information",
      content: `For any questions regarding these Terms of Service, please contact us:

Infinity Voyage Tours & Safaris
Email: info@infinityvoyagetours.com
Phone: +255 123 456 789
Address: Arusha, Tanzania`
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 bg-gradient-to-br from-safari-night via-safari-night/95 to-safari-brown/20">
        <div className="container-wide mx-auto px-4 md:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge className="bg-safari-gold/20 text-safari-gold border-safari-gold/30 mb-4">
              <FileText className="w-3 h-3 mr-1" /> Legal
            </Badge>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              Terms of <span className="text-safari-gold">Service</span>
            </h1>
            <p className="text-primary-foreground/80 text-lg">
              Last updated: December 2025
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 flex-1">
        <div className="container-wide mx-auto px-4 md:px-8 max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <p className="text-muted-foreground mb-8 text-lg">
              Welcome to Infinity Voyage Tours & Safaris. These Terms of Service govern your use of our 
              website and services. Please read them carefully before booking.
            </p>

            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="mb-10"
              >
                <h2 className="font-display text-xl font-bold mb-4 text-foreground">
                  {section.title}
                </h2>
                <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {section.content}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Terms;
