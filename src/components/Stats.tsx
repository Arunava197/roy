import { useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { PROJECTS, CERTIFICATIONS } from '../data';

interface StatItemProps {
  endValue: number;
  label: string;
  suffix?: string;
}

function StatItem({ endValue, label, suffix = '' }: StatItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 50,
    stiffness: 100,
  });

  useEffect(() => {
    if (isInView) {
      motionValue.set(endValue);
    }
  }, [isInView, motionValue, endValue]);

  useEffect(() => {
    springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Math.round(latest).toString() + suffix;
      }
    });
  }, [springValue, suffix]);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white/50 dark:bg-white/5 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-white/10 shadow-lg hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all duration-300">
      <div className="flex items-baseline">
        <span ref={ref} className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-blue to-brand-cyan">
          0{suffix}
        </span>
      </div>
      <span className="mt-2 text-sm text-slate-600 dark:text-slate-400 font-medium uppercase tracking-wider text-center">
        {label}
      </span>
    </div>
  );
}

export default function Stats() {
  return (
    <section className="py-8 md:py-12 relative z-20 -mt-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
          <StatItem endValue={PROJECTS.length} label="Projects Completed" suffix="+" />
          <StatItem endValue={1} label="Years Experience" suffix="+" />
          <StatItem endValue={10} label="Satisfied Clients" suffix="+" />
        </div>
      </div>
    </section>
  );
}
