'use client';

import * as React from 'react';
import { motion, useInView } from 'framer-motion';

interface CountUpProps {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number; // in seconds
}

function CountUp({ end, suffix = '', prefix = '', duration = 1.5 }: CountUpProps) {
  const [count, setCount] = React.useState(0);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  React.useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      setCount(Math.floor(progress * end));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [isInView, end, duration]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

export function Statistics() {
  const smoothSpring = { type: 'spring' as const, stiffness: 150, damping: 24, mass: 0.85 };
  const stats = [
    { label: 'Total Raised Capital', val: 250, suffix: 'M+', prefix: '$' },
    { label: 'Active Retail Investors', val: 15, suffix: 'K+', prefix: '' },
    { label: 'Fully Funded Startups', val: 1200, suffix: '+', prefix: '' },
    { label: 'Campaign Success Rate', val: 98, suffix: '%', prefix: '' },
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-teal-900 to-teal-800 text-white relative overflow-hidden">
      {/* Background Shapes */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-white blur-2xl" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-secondary blur-2xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...smoothSpring, delay: idx * 0.05 }}
              className="space-y-2 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-md"
            >
              <p className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-accent">
                <CountUp end={stat.val} suffix={stat.suffix} prefix={stat.prefix} />
              </p>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-teal-100">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
