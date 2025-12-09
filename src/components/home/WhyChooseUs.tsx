import { Shield, Map, Compass, Headphones } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Shield,
    title: "Safe & Secure",
    description:
      "Your safety is our priority. We partner with certified operators and ensure secure payments.",
  },
  {
    icon: Map,
    title: "Expert Local Guides",
    description:
      "Experience Tanzania with guides who know every hidden gem and wildlife hotspot.",
  },
  {
    icon: Compass,
    title: "Tailor-Made Trips",
    description:
      "We customize every detail of your safari or beach holiday to match your dreams.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description:
      "From booking to boarding, our dedicated team is available around the clock.",
  },
];

export const WhyChooseUs = () => {
  return (
    <section className="section-padding bg-background relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      <div className="container-wide mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          {/* Section label */}
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="w-12 h-px bg-gradient-to-r from-transparent to-safari-gold" />
            <span className="text-safari-gold text-sm font-semibold uppercase tracking-[0.25em]">
              Our Promise
            </span>
            <span className="w-12 h-px bg-gradient-to-r from-safari-gold to-transparent" />
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-6">
            Why Travel with <span className="text-gradient-gold">Infinity Voyage?</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We don't just book trips; we craft unforgettable African experiences
            tailored exclusively for you.
          </p>

          {/* Decorative line */}
          <div className="section-divider mx-auto mt-8" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group text-center p-10 rounded-3xl bg-card border border-border/50 hover:border-safari-gold/30 hover:shadow-luxury transition-all duration-500 hover:-translate-y-2"
            >
              <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary via-primary to-primary/80 mb-8 group-hover:scale-110 transition-all duration-500 shadow-elevated group-hover:shadow-gold">
                <feature.icon className="w-9 h-9 text-primary-foreground" />
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-safari-gold/0 group-hover:bg-safari-gold/20 transition-all duration-500" />
              </div>
              <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed text-base">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
