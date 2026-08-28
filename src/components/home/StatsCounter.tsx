import { useEffect, useState, useRef } from "react";
import { Users, Compass, Award, CheckCircle2 } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: 1500,
    suffix: "+",
    label: "Happy Travelers",
    description: "From 40+ countries",
  },
  {
    icon: Compass,
    value: 50,
    suffix: "+",
    label: "Tour Packages",
    description: "Safaris, treks & beaches",
  },
  {
    icon: Award,
    value: 10,
    suffix: "+",
    label: "Years Experience",
    description: "In Tanzania tourism",
  },
  {
    icon: CheckCircle2,
    value: 100,
    suffix: "%",
    label: "Tailor-Made",
    description: "Customized journeys",
  },
];

export const StatsCounter = () => {
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-14 bg-slate-900 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center text-center p-4">
              <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3">
                <stat.icon className="w-5 h-5" />
              </div>
              <p className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-amber-400 mb-1">
                {inView ? `${stat.value.toLocaleString()}${stat.suffix}` : `0${stat.suffix}`}
              </p>
              <p className="text-sm font-bold text-white mb-0.5">{stat.label}</p>
              <p className="text-xs text-slate-400">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
