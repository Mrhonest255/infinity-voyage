import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface SectionHeaderProps {
  label: string;
  title: string;
  highlight?: string;
  description?: string;
  centered?: boolean;
  icon?: LucideIcon;
  variant?: "default" | "light" | "dark";
}

export const SectionHeader = ({
  label,
  title,
  highlight,
  description,
  centered = true,
  icon: Icon,
  variant = "default",
}: SectionHeaderProps) => {
  const textColor = variant === "dark" ? "text-primary-foreground" : "text-foreground";
  const labelColor = "text-safari-gold";
  const descColor = variant === "dark" ? "text-primary-foreground/80" : "text-muted-foreground";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`mb-12 md:mb-16 ${centered ? "text-center max-w-3xl mx-auto" : ""}`}
    >
      {/* Label with decorative lines */}
      <div className={`flex items-center gap-3 mb-4 ${centered ? "justify-center" : ""}`}>
        <span className="w-10 h-px bg-safari-gold" />
        <span className={`${labelColor} text-sm font-semibold uppercase tracking-[0.2em] flex items-center gap-2`}>
          {Icon && <Icon className="w-4 h-4" />}
          {label}
        </span>
        <span className="w-10 h-px bg-safari-gold" />
      </div>

      {/* Title with optional highlight */}
      <h2 
        className={`text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold ${textColor}`}
        style={{ fontFamily: "'Cormorant Garamond', serif" }}
      >
        {title}{" "}
        {highlight && <span className="text-gradient-gold">{highlight}</span>}
      </h2>

      {/* Description */}
      {description && (
        <p className={`text-lg mt-4 ${descColor} max-w-2xl ${centered ? "mx-auto" : ""}`}>
          {description}
        </p>
      )}

      {/* Decorative dots */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className={`flex items-center gap-2 mt-6 ${centered ? "justify-center" : ""}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-safari-gold/40" />
        <span className="w-2 h-2 rounded-full bg-safari-gold" />
        <span className="w-1.5 h-1.5 rounded-full bg-safari-gold/40" />
      </motion.div>
    </motion.div>
  );
};

export default SectionHeader;
