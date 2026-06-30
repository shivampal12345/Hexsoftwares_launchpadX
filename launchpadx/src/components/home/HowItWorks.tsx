'use client';

import { motion } from 'framer-motion';
import { UserPlus, ShieldCheck, Flame, CreditCard } from 'lucide-react';

export function HowItWorks() {
  const smoothSpring = { type: 'spring' as const, stiffness: 150, damping: 24, mass: 0.85 };
  const steps = [
    {
      id: 1,
      title: 'Create Startup',
      description: 'Founders build their campaign profile, upload pitch decks, and define investment structures.',
      icon: UserPlus,
      color: 'bg-teal-500/10 text-teal-600 dark:text-teal-400',
      lineColor: 'border-teal-500/30'
    },
    {
      id: 2,
      title: 'Vetting & Verification',
      description: 'Our compliance team checks team credentials, financial status, and audit reports to ensure safety.',
      icon: ShieldCheck,
      color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
      lineColor: 'border-indigo-500/30'
    },
    {
      id: 3,
      title: 'Launch Campaign',
      description: 'Your startup details go public. Investors worldwide browse, review documents, and fund shares.',
      icon: Flame,
      color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
      lineColor: 'border-amber-500/30'
    },
    {
      id: 4,
      title: 'Receive Capital',
      description: 'Once targets are met, equity is distributed instantly to backers while capital gets released to you.',
      icon: CreditCard,
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      lineColor: 'border-transparent'
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-muted/20 border-t border-border/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            How It Works
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            A frictionless workflow built to support high-growth teams and secure investor capital safely.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {steps.map((step, idx) => {
            const IconComponent = step.icon;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '0px 0px -80px 0px' }}
                transition={{ ...smoothSpring, delay: idx * 0.06 }}
                className="relative flex flex-col items-center md:items-start text-center md:text-left space-y-4 group p-6 rounded-2xl border border-transparent hover:border-border hover:bg-card hover:shadow-lg transition-all duration-300"
              >
                {/* Horizontal line connector for desktop */}
                {idx < 3 && (
                  <div className="hidden md:block absolute top-12 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-[2px] bg-gradient-to-r from-teal-500/20 to-indigo-500/20 z-0" />
                )}

                {/* Badge Number */}
                <div className="absolute top-4 right-4 text-xs font-black text-muted-foreground/35 select-none bg-muted/50 rounded-lg px-2 py-0.5">
                  0{step.id}
                </div>

                {/* Icon Container */}
                <div className={`relative z-10 p-4 rounded-2xl ${step.color} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="h-7 w-7 stroke-[2]" />
                </div>

                {/* Content */}
                <div className="space-y-2 relative z-10">
                  <h3 className="font-extrabold text-lg text-foreground group-hover:text-primary transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed font-semibold">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
