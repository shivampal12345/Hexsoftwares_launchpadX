'use client';

import { motion, Variants } from 'framer-motion';
import { Rocket, TrendingUp, Users, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';

interface HeroProps {
  onExploreStartups: () => void;
  onLaunchCampaign: () => void;
}

export function Hero({ onExploreStartups, onLaunchCampaign }: HeroProps) {
  const smoothSpring = { type: 'spring' as const, stiffness: 120, damping: 24, mass: 0.8 };
  const statCardClass =
    "flex min-h-[96px] items-center gap-3 rounded-2xl border border-border/70 bg-background/55 p-4 shadow-sm";
  const statLabelClass =
    "text-[11px] font-semibold leading-none text-muted-foreground";
  const statValueClass = "mt-1.5 text-xl font-black leading-none text-foreground";

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.08 }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 18, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: smoothSpring }
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-28 md:pb-36 bg-gradient-to-b from-primary/10 via-background to-background">
      {/* Background Animated Circles */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 20, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            x: [0, -30, 0],
            y: [0, 40, 0],
          }}
          transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-60 -left-40 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Left Column: Text & CTAs */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 space-y-8 text-center lg:text-left"
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold uppercase tracking-wider text-primary"
            >
              <Rocket className="h-4.5 w-4.5 text-primary" />
              <span>Next-Gen Equity Crowdfunding</span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-foreground"
            >
              Invest in Tomorrow&apos;s <br />
              <span className="bg-gradient-to-r from-primary via-secondary to-teal-600 bg-clip-text text-transparent">
                Most Promising Startups
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0"
            >
              Connect visionary founders with investors around the world. Secure institutional-grade dealflow, trade private equity, and support world-changing ideas.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-4 pt-2"
            >
              <Button variant="gradient" size="lg" onClick={onExploreStartups} className="w-full sm:w-auto font-bold">
                Explore Startups
              </Button>
              <Button variant="outline" size="lg" onClick={onLaunchCampaign} className="w-full sm:w-auto font-bold border-2">
                Launch Campaign
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Column: Dashboard visual */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.97, rotate: -1 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ ...smoothSpring, delay: 0.18 }}
              className="w-full max-w-[460px] rounded-3xl bg-gradient-to-tr from-primary/25 to-secondary/35 p-[1px] shadow-2xl relative overflow-hidden"
            >
              <div className="w-full bg-card rounded-3xl overflow-hidden relative p-6 sm:p-8 flex flex-col gap-6 border border-border">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Dashboard Preview</span>
                  </div>
                  <div className="h-[2px] w-full bg-gradient-to-r from-border/10 via-border/50 to-border/10" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <motion.div
                    initial={{ y: 16, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ ...smoothSpring, delay: 0.3 }}
                    className={`${statCardClass} sm:col-span-2`}
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className={statLabelClass}>Funding Raised</p>
                      <p className="mt-2 text-2xl font-black leading-none text-foreground">$250M+</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ y: 16, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ ...smoothSpring, delay: 0.38 }}
                    className={statCardClass}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                      <Users className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className={statLabelClass}>Active Investors</p>
                      <p className={statValueClass}>15K+</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ y: 16, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ ...smoothSpring, delay: 0.46 }}
                    className={statCardClass}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className={statLabelClass}>Campaign Success</p>
                      <p className={statValueClass}>98%</p>
                    </div>
                  </motion.div>
                </div>

                <div className="rounded-2xl bg-background/55 border border-border/70 p-5">
                  <div className="text-center space-y-2">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Target Allocation</span>
                    <h3 className="text-2xl sm:text-3xl font-black text-foreground">$1,245,000 Raised</h3>
                    <div className="h-3 w-full bg-muted rounded-full overflow-hidden mt-4">
                      <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full w-[83%]" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>890 Backers</span>
                  <span className="font-bold text-primary">83% Completed</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
