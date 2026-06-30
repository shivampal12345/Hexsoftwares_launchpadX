'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { BarChart3, BriefcaseBusiness, Users, ShieldCheck, ArrowRight, ArrowLeft, Plus, CircleDollarSign, ReceiptText, CheckCircle2 } from 'lucide-react';
import { useDashboardSummary, useMyInvestments, usePlatformStats, useStartups } from '@/hooks/useStartups';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { InvestModal } from '@/components/shared/InvestModal';
import { LaunchCampaignModal } from '@/components/shared/LaunchCampaignModal';
import { Startup } from '@/types';
import { useAuth } from '@/components/providers/AuthProvider';
import { formatCurrency } from '@/lib/utils';

const pageVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.04 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 150, damping: 24, mass: 0.85 },
  },
};

const linkButtonClass =
  'inline-flex h-9 items-center justify-center rounded-xl border border-border bg-transparent px-4 text-sm font-semibold text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:bg-muted hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30';

const primaryLinkButtonClass =
  'inline-flex h-9 items-center justify-center rounded-xl bg-gradient-to-r from-primary to-secondary px-4 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:opacity-95 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/30';

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: startups = [] } = useStartups();
  const { data: platformStats } = usePlatformStats();
  const { data: dashboardSummary } = useDashboardSummary();
  const {
    data: myInvestments = [],
    isLoading: investmentsLoading,
    refetch: refetchMyInvestments,
  } = useMyInvestments(Boolean(user));
  const [investingStartup, setInvestingStartup] = React.useState<Startup | null>(null);
  const [isLaunchOpen, setIsLaunchOpen] = React.useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = React.useState(false);

  const recentCampaigns = startups.slice(0, 3);
  const portfolioCampaigns = startups.slice(3);
  const myInvestmentTotal = myInvestments.reduce((sum, investment) => sum + investment.amount, 0);

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      setCheckoutSuccess(new URLSearchParams(window.location.search).get('checkout') === 'success');
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    if (!checkoutSuccess || !user) {
      return;
    }

    const interval = window.setInterval(() => {
      refetchMyInvestments();
    }, 2500);

    const timeout = window.setTimeout(() => {
      window.clearInterval(interval);
    }, 15000);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
  }, [checkoutSuccess, refetchMyInvestments, user]);

  const stats = [
    { label: 'Funding Raised', value: platformStats?.raised ?? '—', icon: CircleDollarSign },
    { label: 'Active Investors', value: platformStats?.investors ?? '—', icon: Users },
    { label: 'Funded Startups', value: platformStats?.fundedStartups ?? '—', icon: BriefcaseBusiness },
    { label: 'Campaign Success', value: platformStats?.successRate ?? '—', icon: ShieldCheck },
  ];

  return (
    <>
      <main className="min-h-screen bg-background text-foreground">
        <section className="border-b border-border/50 bg-muted/20 py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={pageVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
            >
              <motion.div variants={itemVariants} className="max-w-2xl space-y-4">
                <Link href="/" className={linkButtonClass}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
                <Badge variant="outline" className="w-fit">Platform Dashboard</Badge>
                <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
                  Investor and founder workspace
                </h1>
                <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Review live campaigns, portfolio watchlists, and platform performance. Investments and new campaign submissions update this dashboard in real time.
                </p>
              </motion.div>
              <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
                <Link href="/startups" className={linkButtonClass}>
                  Browse campaigns
                </Link>
                <button type="button" onClick={() => setIsLaunchOpen(true)} className={primaryLinkButtonClass}>
                  Launch campaign
                </button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section className="py-10">
          <div className="container mx-auto grid gap-4 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
            {stats.map((item, idx) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.label}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ y: -2 }}
                  transition={{ type: 'spring', stiffness: 180, damping: 24, mass: 0.85, delay: 0.04 * idx }}
                  className="rounded-2xl border border-border bg-card p-5 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-200">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{item.label}</p>
                      <p className="text-2xl font-black">{item.value}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {checkoutSuccess && (
          <section className="pb-6">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-bold text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="h-5 w-5" />
                Payment completed. Your investment will appear below after Stripe webhook confirmation.
              </div>
            </div>
          </section>
        )}

        <section className="pb-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={itemVariants}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <ReceiptText className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold">My Investments</h2>
                    <p className="text-sm text-muted-foreground">Completed Stripe-backed allocations for your account.</p>
                  </div>
                </div>
                <div className="rounded-xl border border-border/70 bg-muted/30 px-4 py-2 text-sm">
                  <span className="font-semibold text-muted-foreground">Total invested </span>
                  <span className="font-black text-primary">{formatCurrency(myInvestmentTotal)}</span>
                </div>
              </div>

              {!user ? (
                <div className="rounded-xl border border-dashed border-border bg-muted/20 px-4 py-8 text-center text-sm font-semibold text-muted-foreground">
                  Log in to view your personal investment history.
                </div>
              ) : investmentsLoading ? (
                <div className="rounded-xl border border-border/70 bg-muted/20 px-4 py-8 text-center text-sm font-semibold text-muted-foreground">
                  Loading your investments...
                </div>
              ) : myInvestments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                      <tr>
                        <th className="py-3 pr-4 font-bold">Campaign</th>
                        <th className="py-3 pr-4 font-bold">Amount</th>
                        <th className="py-3 pr-4 font-bold">Equity</th>
                        <th className="py-3 pr-4 font-bold">Status</th>
                        <th className="py-3 font-bold">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {myInvestments.map((investment) => {
                        const startup =
                          typeof investment.startupId === 'string' ? null : investment.startupId;
                        const startupHref = startup?._id || startup?.id;

                        return (
                          <tr key={investment._id} className="align-middle">
                            <td className="py-4 pr-4">
                              <div>
                                {startupHref ? (
                                  <Link href={`/startups/${startupHref}`} className="font-bold text-foreground hover:text-primary">
                                    {startup?.name || 'Startup campaign'}
                                  </Link>
                                ) : (
                                  <p className="font-bold text-foreground">Startup campaign</p>
                                )}
                                <p className="text-xs text-muted-foreground">{startup?.industry || 'Investment allocation'}</p>
                              </div>
                            </td>
                            <td className="py-4 pr-4 font-black text-primary">{formatCurrency(investment.amount)}</td>
                            <td className="py-4 pr-4 font-semibold">{investment.equity.toFixed(4)}%</td>
                            <td className="py-4 pr-4">
                              <Badge variant={investment.status === 'completed' ? 'primary' : 'muted'}>
                                {investment.status}
                              </Badge>
                            </td>
                            <td className="py-4 text-muted-foreground">
                              {investment.createdAt ? new Date(investment.createdAt).toLocaleDateString() : 'Pending'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-border bg-muted/20 px-4 py-8 text-center text-sm font-semibold text-muted-foreground">
                  No completed investments yet. After Stripe confirms a payment, it will appear here.
                </div>
              )}
            </motion.div>
          </div>
        </section>

        <section className="pb-10">
          <div className="container mx-auto grid gap-6 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.22 }}
              variants={itemVariants}
              className="lg:col-span-7 rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-extrabold">Recent campaign activity</h2>
                  <p className="text-sm text-muted-foreground">Campaigns with the latest fundraising progress.</p>
                </div>
                <Link href="/startups" className={linkButtonClass}>
                  All campaigns <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>

              <div className="space-y-4">
                {recentCampaigns.map((startup, idx) => {
                  const progress = (startup.amountRaised / startup.fundingGoal) * 100;

                  return (
                    <motion.article
                      key={startup.id}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ type: 'spring', stiffness: 150, damping: 24, mass: 0.85, delay: idx * 0.05 }}
                      whileHover={{ y: -2 }}
                      className="rounded-xl border border-border/70 p-4 transition-shadow duration-200 hover:shadow-md"
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base font-bold">{startup.name}</h3>
                            <Badge variant="muted">{startup.industry}</Badge>
                          </div>
                          <p className="max-w-2xl text-sm text-muted-foreground">{startup.tagline}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Link
                            href={`/startups/${startup.id}`}
                            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-border bg-transparent px-4 text-sm font-semibold text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-muted hover:text-primary hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                          >
                            Open profile
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                          <Button variant="gradient" size="sm" className="shadow-md" onClick={() => setInvestingStartup(startup)}>
                            Invest
                          </Button>
                        </div>
                      </div>
                      <div className="mt-4 space-y-2">
                        <ProgressBar value={progress} />
                        <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                          <span>{formatCurrency(startup.amountRaised)} raised</span>
                          <span>{formatCurrency(startup.fundingGoal)} target</span>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            </motion.div>

            <div className="lg:col-span-5 space-y-6">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.22 }}
                variants={itemVariants}
                whileHover={{ y: -2 }}
                transition={{ type: 'spring', stiffness: 150, damping: 24, mass: 0.85 }}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm"
              >
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                    <BarChart3 className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold">Founder workspace</h2>
                    <p className="text-sm text-muted-foreground">Drafts, approvals, and launch prep.</p>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between rounded-xl border border-border/70 px-4 py-3">
                    <span className="font-semibold">Draft campaigns</span>
                    <span className="font-black">{dashboardSummary?.draftCampaigns ?? 2}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-border/70 px-4 py-3">
                    <span className="font-semibold">Awaiting review</span>
                    <span className="font-black">{dashboardSummary?.awaitingReview ?? 1}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-border/70 px-4 py-3">
                    <span className="font-semibold">Ready to launch</span>
                    <span className="font-black">{dashboardSummary?.readyToLaunch ?? 4}</span>
                  </div>
                </div>

                <div className="mt-5">
                  <Button variant="primary" size="md" className="w-full shadow-md" onClick={() => setIsLaunchOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create campaign draft
                  </Button>
                </div>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.22 }}
                variants={itemVariants}
                whileHover={{ y: -2 }}
                transition={{ type: 'spring', stiffness: 150, damping: 24, mass: 0.85 }}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold">Portfolio watchlist</h2>
                    <p className="text-sm text-muted-foreground">Campaigns currently on your radar.</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {portfolioCampaigns.map((startup) => (
                    <div key={startup.id} className="rounded-xl border border-border/70 px-4 py-3">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-bold">{startup.name}</p>
                          <p className="text-xs text-muted-foreground">{startup.industry}</p>
                        </div>
                        <Link href={`/startups/${startup.id}`} className="text-sm font-semibold text-primary hover:text-teal-700 transition-colors">
                          View
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <InvestModal
        startup={investingStartup}
        isOpen={!!investingStartup}
        onClose={() => setInvestingStartup(null)}
      />

      <LaunchCampaignModal
        isOpen={isLaunchOpen}
        onClose={() => setIsLaunchOpen(false)}
      />
    </>
  );
}
