import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Users, Map, Award, Calendar } from "lucide-react";

const stats = [
  { 
    icon: Users, 
    value: 500, 
    suffix: "+", 
    label: "Happy Travelers",
    description: "Satisfied customers worldwide"
  },
  { 
    icon: Map, 
    value: 50, 
    suffix: "+", 
    label: "Tour Packages",
    description: "Curated experiences"
  },
  { 
    icon: Award, 
    value: 10, 
    suffix: "+", 
    label: "Years Experience",
    description: "Of expert service"
  },
  { 
    icon: Calendar, 
    value: 1000, 
    suffix: "+", 
    label: "Tours Completed",
    description: "Successful adventures"
  },
];

interface CounterProps {
  end: number;
  duration?: number;
  suffix?: string;
}

const Counter = ({ end, duration = 2, suffix = "" }: CounterProps) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [end, duration, isInView]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
};

export const StatsCounter = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-safari-night via-safari-night/95 to-primary/20 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-safari-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />

      <div className="container-wide mx-auto px-4 md:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="w-12 h-px bg-gradient-to-r from-transparent to-safari-gold" />
            <span className="text-safari-gold text-sm font-semibold uppercase tracking-[0.25em]">
              Our Achievements
            </span>
            <span className="w-12 h-px bg-gradient-to-r from-safari-gold to-transparent" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-primary-foreground">
            Trusted by Travelers <span className="text-gradient-luxury">Worldwide</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="text-center group"
            >
              <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-safari-gold/20 to-safari-gold/5 mb-6 group-hover:scale-110 transition-transform duration-500">
                <stat.icon className="w-10 h-10 text-safari-gold" />
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-safari-gold/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              
              <p className="text-5xl md:text-6xl font-bold text-primary-foreground mb-2">
                <Counter end={stat.value} suffix={stat.suffix} />
              </p>
              
              <p className="text-xl font-semibold text-safari-gold mb-1">
                {stat.label}
              </p>
              
              <p className="text-sm text-primary-foreground/60">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
