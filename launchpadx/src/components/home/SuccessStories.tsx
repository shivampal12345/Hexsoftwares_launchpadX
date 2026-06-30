'use client';

import * as React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Quote, Trophy, TrendingUp, Users2, ShieldCheck } from 'lucide-react';
import { successStory } from '@/constants/dummyData';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export function SuccessStories() {
  const [mounted, setMounted] = React.useState(false);
  const smoothSpring = { type: 'spring' as const, stiffness: 150, damping: 24, mass: 0.85 };

  React.useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 0);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section id="success-stories" className="py-24 border-t border-border/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Success Stories
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            See how LaunchPadX startups leverage community seed investments to scale into global category leaders.
          </p>
        </div>

        {/* Highlight Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.99, y: 14 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -80px 0px' }}
          transition={smoothSpring}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-card border border-border rounded-3xl p-8 lg:p-12 shadow-xl relative overflow-hidden"
        >
          {/* Decorative Corner Badge */}
          <div className="absolute top-0 right-0 bg-accent text-zinc-950 font-bold px-6 py-2 rounded-bl-2xl flex items-center gap-1.5 text-sm shadow-md">
            <Trophy className="h-4.5 w-4.5" />
            <span>Alumni Spotlight</span>
          </div>

          {/* Left Side: Founder & Quote */}
          <div className="lg:col-span-6 space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ ...smoothSpring, delay: 0.1 }}
              className="flex items-center space-x-4"
            >
              <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-primary bg-muted">
                <Image
                  src={successStory.founderImage}
                  alt={successStory.founder}
                  fill
                  sizes="64px"
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-foreground">{successStory.name}</h3>
                <p className="text-xs font-bold text-primary">Elena Rostova, CEO & Founder</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...smoothSpring, delay: 0.14 }}
              className="relative"
            >
              <Quote className="absolute -top-6 -left-6 h-12 w-12 text-primary/10 -z-10" />
              <p className="text-lg md:text-xl text-foreground font-semibold leading-relaxed italic">
                &ldquo;{successStory.quote}&rdquo;
              </p>
            </motion.div>

            {/* Growth metrics grid */}
            <motion.div 
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...smoothSpring, delay: 0.18 }}
              className="grid grid-cols-3 gap-6 pt-4 border-t border-border/80"
            >
              <div className="space-y-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5 text-primary" /> ARR
                </p>
                <p className="text-lg font-black text-foreground">{successStory.growthMetrics.revenue}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <Users2 className="h-3.5 w-3.5 text-secondary" /> Growth
                </p>
                <p className="text-lg font-black text-foreground">{successStory.growthMetrics.customers.split(' ')[0]}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-accent" /> Team
                </p>
                <p className="text-lg font-black text-foreground">{successStory.growthMetrics.teamSize.split(' ')[0]}</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...smoothSpring, delay: 0.22 }}
            >
              <Button variant="primary" size="md" className="font-bold">
                Read Solace Story
              </Button>
            </motion.div>
          </div>

          {/* Right Side: Recharts Chart & Visuals */}
          <motion.div 
            initial={{ opacity: 0, x: 12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ ...smoothSpring, delay: 0.14 }}
            className="lg:col-span-6 space-y-6"
          >
            <div className="rounded-2xl border border-border bg-muted/30 p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h4 className="font-bold text-foreground text-sm">ARR Growth Trend</h4>
                  <p className="text-xs text-muted-foreground">Annual Recurring Revenue in Millions (USD)</p>
                </div>
                <Badge variant="primary">Up 142x since launch</Badge>
              </div>

              {/* Chart container */}
              <div className="h-64 w-full">
                {mounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={successStory.chartData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                      <XAxis dataKey="year" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} />
                      <YAxis stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{
                          background: 'var(--card)',
                          borderColor: 'var(--border)',
                          borderRadius: '12px',
                          fontSize: '12px',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="var(--primary)"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-muted/20 animate-pulse rounded-xl" />
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
