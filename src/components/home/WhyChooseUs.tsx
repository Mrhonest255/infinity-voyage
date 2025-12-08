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
    <section className="section-padding bg-background">
      <div className="container-wide mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-4">
            Why Travel with Infinity Voyage?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We don't just book trips; we craft unforgettable African experiences
            tailored just for you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group text-center p-8 rounded-2xl bg-card hover:bg-primary/5 transition-all duration-300"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-sunset mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
