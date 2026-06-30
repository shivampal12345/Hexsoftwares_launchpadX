'use client';

import * as React from 'react';
import Image from 'next/image';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { ShieldCheck, MapPin, Users, Calendar, Award, Info, FileText } from 'lucide-react';
import { Startup } from '@/types';
import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import { formatCurrency } from '@/lib/utils';

interface StartupDetailsModalProps {
  startup: Startup | null;
  isOpen: boolean;
  onClose: () => void;
  onInvest: (startup: Startup) => void;
}

export function StartupDetailsModal({ startup, isOpen, onClose, onInvest }: StartupDetailsModalProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 0);
    return () => window.clearTimeout(timer);
  }, []);

  if (!startup) return null;

  const progressPercentage = (startup.amountRaised / startup.fundingGoal) * 100;

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={startup.name} className="max-w-2xl">
      <div className="space-y-6">
        {/* Cover Image */}
        <div className="relative h-48 w-full overflow-hidden rounded-xl bg-muted">
          <Image
            src={startup.coverImage}
            alt={startup.name}
            fill
            sizes="(min-width: 768px) 672px, 100vw"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 to-transparent" />
          <div className="absolute bottom-4 left-4 flex items-center space-x-3 text-white">
            <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-white/20 bg-card">
              <Image
                src={startup.logo}
                alt={startup.name}
                fill
                sizes="48px"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h4 className="text-lg font-black">{startup.name}</h4>
              <p className="text-xs text-zinc-200 font-semibold">{startup.tagline}</p>
            </div>
          </div>
        </div>

        {/* Dynamic Vetting Flags */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-xl border border-border bg-emerald-500/5 flex items-center gap-2">
            <ShieldCheck className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400" />
            <div className="text-left">
              <p className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400">Reg CF Approved</p>
              <p className="text-xs text-muted-foreground font-semibold">SEC compliant</p>
            </div>
          </div>
          <div className="p-3 rounded-xl border border-border bg-primary/5 flex items-center gap-2">
            <Award className="h-4.5 w-4.5 text-primary" />
            <div className="text-left">
              <p className="text-[10px] font-black uppercase text-primary">Financial Audited</p>
              <p className="text-xs text-muted-foreground font-semibold">Verified ledgers</p>
            </div>
          </div>
          <div className="p-3 rounded-xl border border-border bg-amber-500/5 flex items-center gap-2">
            <Info className="h-4.5 w-4.5 text-amber-600 dark:text-amber-400" />
            <div className="text-left">
              <p className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400">Verified Founder</p>
              <p className="text-xs text-muted-foreground font-semibold">KYC verified</p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Panel: Pitch story & charts */}
          <div className="md:col-span-7 space-y-6">
            {/* Story Description */}
            <div className="space-y-2">
              <h5 className="font-extrabold text-sm text-foreground uppercase tracking-wider">Startup Pitch</h5>
              <p className="text-sm text-muted-foreground leading-relaxed leading-6 font-semibold">
                {startup.story || startup.description}
              </p>
            </div>

            {/* Recharts Area Chart representing funding over time */}
            <div className="p-4 rounded-xl border border-border bg-muted/20">
              <div className="mb-4">
                <h6 className="font-bold text-foreground text-xs">Funding Accumulation Trend</h6>
                <p className="text-[10px] text-muted-foreground">Cumulative investment growth over the current campaign round (USD)</p>
              </div>
              <div className="h-44 w-full">
                {mounted && startup.fundingTimeline ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={startup.fundingTimeline}
                      margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.25}/>
                          <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                      <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={8} tickLine={false} />
                      <YAxis stroke="var(--muted-foreground)" fontSize={8} tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{
                          background: 'var(--card)',
                          borderColor: 'var(--border)',
                          borderRadius: '8px',
                          fontSize: '10px',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="amount"
                        stroke="var(--primary)"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#colorAmount)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-muted/20 animate-pulse rounded-lg" />
                )}
              </div>
            </div>
          </div>

          {/* Right Panel: Funding figures & team info */}
          <div className="md:col-span-5 space-y-6 border-t md:border-t-0 md:border-l border-border/80 pt-6 md:pt-0 md:pl-6">
            {/* Funding Status */}
            <div className="space-y-3">
              <h5 className="font-extrabold text-sm text-foreground uppercase tracking-wider">Campaign Target</h5>
              <div className="space-y-1">
                <div className="flex justify-between items-baseline">
                  <span className="text-2xl font-black text-foreground">{formatCurrency(startup.amountRaised)}</span>
                  <span className="text-xs text-muted-foreground font-semibold">of {formatCurrency(startup.fundingGoal)}</span>
                </div>
                <ProgressBar value={progressPercentage} />
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-muted-foreground pt-1">
                <span className="flex items-center"><Users className="h-4 w-4 mr-1 text-primary" /> {startup.backers} investors</span>
                <span className="flex items-center"><Calendar className="h-4 w-4 mr-1 text-secondary" /> {startup.daysLeft} days left</span>
              </div>
            </div>

            {/* Campaign Summary Stats */}
            <div className="space-y-3 pt-4 border-t border-border/60">
              <h5 className="font-extrabold text-sm text-foreground uppercase tracking-wider">Key Indicators</h5>
              <div className="space-y-2 text-xs font-bold">
                <div className="flex justify-between py-1.5 border-b border-border/40">
                  <span className="text-muted-foreground">Min Investment</span>
                  <span className="text-foreground">${startup.minInvestment.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border/40">
                  <span className="text-muted-foreground">Est. Equity Shares</span>
                  <span className="text-primary">{(startup.expectedEquity * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border/40">
                  <span className="text-muted-foreground">Team Size</span>
                  <span className="text-foreground">{startup.teamSize} employees</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-muted-foreground">HQ Location</span>
                  <span className="text-foreground flex items-center gap-0.5"><MapPin className="h-3.5 w-3.5" /> {startup.location.split(',')[0]}</span>
                </div>
              </div>
            </div>

            {/* Pitch Deck Button */}
            <div className="pt-2">
              <Button variant="outline" className="w-full text-xs font-bold flex items-center justify-center gap-2">
                <FileText className="h-4 w-4" /> Download Pitch Deck (PDF)
              </Button>
            </div>
          </div>
        </div>

        {/* Investment CTA Action Footer */}
        <div className="flex gap-4 pt-4 border-t border-border mt-4">
          <Button variant="outline" onClick={onClose} className="flex-1 text-sm font-bold">
            Close
          </Button>
          <Button variant="gradient" onClick={() => { onClose(); onInvest(startup); }} className="flex-1 text-sm font-bold">
            Invest in {startup.name}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
