import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";

const Privacy = () => {
  const sections = [
    {
      title: "1. Information We Collect",
      content: `We collect information you provide directly to us, including:

Personal Information:
• Name and contact details (email, phone number, address)
• Passport and travel document information
• Payment and billing information
• Travel preferences and special requirements
• Emergency contact information

Automatically Collected Information:
• Device and browser information
• IP address and location data
• Website usage and analytics data
• Cookies and similar tracking technologies`
    },
    {
      title: "2. How We Use Your Information",
      content: `We use the information we collect to:

• Process and manage your bookings and reservations
• Communicate with you about your travel arrangements
• Send booking confirmations, updates, and travel documents
• Process payments and refunds
• Provide customer support and respond to inquiries
• Send marketing communications (with your consent)
• Improve our services and website experience
• Comply with legal obligations and prevent fraud
• Share with third-party service providers to fulfill your booking`
    },
    {
      title: "3. Information Sharing",
      content: `We may share your information with:

Service Providers:
• Hotels, lodges, and accommodation partners
• Transportation and transfer companies
• Local tour operators and guides
• Airlines and ferry services
• Payment processors

Legal Requirements:
• When required by law or legal process
• To protect our rights and safety
• To prevent fraud or illegal activities

We do NOT sell your personal information to third parties for marketing purposes.`
    },
    {
      title: "4. Data Security",
      content: `We implement appropriate technical and organizational measures to protect your personal information:

• Secure socket layer (SSL) encryption for data transmission
• Secure servers and databases with restricted access
• Regular security assessments and updates
• Employee training on data protection
• Secure payment processing through certified providers

While we strive to protect your information, no method of transmission over the internet is 100% secure.`
    },
    {
      title: "5. Cookies and Tracking",
      content: `Our website uses cookies and similar technologies to:

• Remember your preferences and settings
• Understand how you use our website
• Analyze traffic and improve our services
• Provide personalized content and recommendations

Types of Cookies We Use:
• Essential cookies: Required for website functionality
• Analytics cookies: Help us understand website usage
• Marketing cookies: Used for targeted advertising

You can control cookie preferences through your browser settings.`
    },
    {
      title: "6. Your Rights",
      content: `You have the right to:

• Access: Request a copy of your personal data
• Correction: Update or correct inaccurate information
• Deletion: Request deletion of your personal data
• Restriction: Limit how we process your data
• Portability: Receive your data in a structured format
• Objection: Object to certain processing activities
• Withdraw Consent: Withdraw consent for marketing communications

To exercise these rights, contact us at info@infinityvoyagetours.com`
    },
    {
      title: "7. Data Retention",
      content: `We retain your personal information for:

• Booking records: 7 years after the travel date
• Marketing preferences: Until you unsubscribe
• Website analytics: 26 months
• Legal compliance: As required by law

After the retention period, data is securely deleted or anonymized.`
    },
    {
      title: "8. International Transfers",
      content: `Your information may be transferred to and processed in countries other than your own, including Tanzania and other countries where our service providers operate.

We ensure appropriate safeguards are in place to protect your data in accordance with applicable data protection laws.`
    },
    {
      title: "9. Children's Privacy",
      content: `Our services are not directed to children under 16. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.

For family bookings, parents or guardians must provide consent for their children's information.`
    },
    {
      title: "10. Third-Party Links",
      content: `Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to read their privacy policies before providing any personal information.`
    },
    {
      title: "11. Changes to This Policy",
      content: `We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date. For significant changes, we will notify you by email or through our website.

We encourage you to review this policy periodically.`
    },
    {
      title: "12. Contact Us",
      content: `If you have questions or concerns about this Privacy Policy or our data practices, please contact us:

Infinity Voyage Tours & Safaris
Data Protection Officer
Email: privacy@infinityvoyagetours.com
General: info@infinityvoyagetours.com
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
              <Shield className="w-3 h-3 mr-1" /> Your Privacy Matters
            </Badge>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              Privacy <span className="text-safari-gold">Policy</span>
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
              Infinity Voyage Tours & Safaris ("we," "our," or "us") is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when 
              you visit our website or use our services.
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

export default Privacy;
