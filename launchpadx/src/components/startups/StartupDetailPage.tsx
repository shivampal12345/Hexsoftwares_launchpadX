'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar, MapPin, Users, DollarSign, Percent, TrendingUp, ReceiptText } from 'lucide-react';
import { Startup } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { InvestModal } from '@/components/shared/InvestModal';
import { useCampaignInvestments, useStartup } from '@/hooks/useStartups';
import { formatCurrency } from '@/lib/utils';

interface StartupDetailPageProps {
  startupId: string;
  initialStartup: Startup;
}

export function StartupDetailPage({ startupId, initialStartup }: StartupDetailPageProps) {
  const [isInvestOpen, setIsInvestOpen] = React.useState(false);
  const { data: startup = initialStartup } = useStartup(startupId, initialStartup);
  const { data: investmentTrack, isLoading: investmentsLoading } = useCampaignInvestments(startupId);

  const progress = (startup.amountRaised / startup.fundingGoal) * 100;
  const campaignInvestments = investmentTrack?.data ?? [];
  const investmentSummary = investmentTrack?.summary ?? {
    count: 0,
    totalAmount: 0,
    totalEquity: 0,
  };

  return (
    <>
      <main className="min-h-screen bg-background text-foreground">
        <section className="relative overflow-hidden border-b border-border/50">
          <div className="absolute inset-0">
            <Image
              src={startup.coverImage}
              alt={startup.name}
              fill
              sizes="100vw"
              className="object-cover opacity-20"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/70 to-background" />
          </div>

          <div className="container relative mx-auto px-4 py-14 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-wrap gap-3">
              <Link
                href="/"
                className="inline-flex h-9 w-fit items-center justify-center rounded-xl border border-border bg-card px-4 text-sm font-semibold text-foreground transition-all hover:bg-muted"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
              <Link
                href="/startups"
                className="inline-flex h-9 w-fit items-center justify-center rounded-xl border border-border bg-transparent px-4 text-sm font-medium text-foreground transition-all hover:bg-muted"
              >
                Back to campaigns
              </Link>
            </div>

            <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-8 space-y-5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="accent">{startup.industry}</Badge>
                  <Badge variant="muted">{startup.location}</Badge>
                </div>
                <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
                  {startup.name}
                </h1>
                <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground">
                  {startup.description}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button variant="gradient" onClick={() => setIsInvestOpen(true)}>
                    Invest now
                  </Button>
                  <a
                    href={`mailto:support@launchpadx.com?subject=Pitch deck request: ${startup.name}`}
                    className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-transparent px-6 text-base font-medium text-foreground transition-all hover:bg-muted"
                  >
                    Request pitch deck
                  </a>
                </div>
              </div>

              <div className="lg:col-span-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="relative h-14 w-14 overflow-hidden rounded-xl border border-border bg-muted">
                    <Image src={startup.logo} alt={startup.name} fill sizes="56px" className="object-cover" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Founder</p>
                    <p className="text-lg font-black">{startup.founder}</p>
                  </div>
                </div>
                <div className="mt-5 space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Funding goal</span>
                    <span className="font-bold">{formatCurrency(startup.fundingGoal)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Raised</span>
                    <span className="font-bold">{formatCurrency(startup.amountRaised)}</span>
                  </div>
                  <ProgressBar value={progress} />
                  <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                    <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {startup.backers} backers</span>
                    <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {startup.daysLeft} days left</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto grid gap-6 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
            <div className="lg:col-span-8 space-y-6">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h2 className="text-xl font-extrabold">Campaign story</h2>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{startup.story || 'Coming soon...'}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Min investment</p>
                  <p className="mt-1 text-2xl font-black">${startup.minInvestment}</p>
                </div>
                <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                  <Percent className="h-5 w-5 text-secondary" />
                  <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Equity pool</p>
                  <p className="mt-1 text-2xl font-black">{(startup.expectedEquity * 100).toFixed(1)}%</p>
                </div>
                <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                  <TrendingUp className="h-5 w-5 text-accent" />
                  <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Revenue</p>
                  <p className="mt-1 text-2xl font-black">{startup.monthlyRevenue ? `${formatCurrency(startup.monthlyRevenue)}/mo` : 'N/A'}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="flex items-center gap-2 text-xl font-extrabold">
                      <ReceiptText className="h-5 w-5 text-primary" />
                      Investment tracker
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Completed Stripe-confirmed investments for this campaign.
                    </p>
                  </div>
                  <Badge variant="outline">{investmentSummary.count} completed</Badge>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-border/70 bg-muted/20 p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Tracked amount</p>
                    <p className="mt-1 text-xl font-black text-primary">{formatCurrency(investmentSummary.totalAmount)}</p>
                  </div>
                  <div className="rounded-xl border border-border/70 bg-muted/20 p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Tracked equity</p>
                    <p className="mt-1 text-xl font-black">{investmentSummary.totalEquity.toFixed(4)}%</p>
                  </div>
                  <div className="rounded-xl border border-border/70 bg-muted/20 p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Average ticket</p>
                    <p className="mt-1 text-xl font-black">
                      {investmentSummary.count > 0
                        ? formatCurrency(investmentSummary.totalAmount / investmentSummary.count)
                        : '$0'}
                    </p>
                  </div>
                </div>

                <div className="mt-5 overflow-hidden rounded-xl border border-border/70">
                  {investmentsLoading ? (
                    <div className="bg-muted/20 px-4 py-8 text-center text-sm font-semibold text-muted-foreground">
                      Loading investment activity...
                    </div>
                  ) : campaignInvestments.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="border-b border-border bg-muted/20 text-xs uppercase tracking-wider text-muted-foreground">
                          <tr>
                            <th className="px-4 py-3 font-bold">Investor</th>
                            <th className="px-4 py-3 font-bold">Amount</th>
                            <th className="px-4 py-3 font-bold">Equity</th>
                            <th className="px-4 py-3 font-bold">Date</th>
                            <th className="px-4 py-3 font-bold">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {campaignInvestments.map((investment, index) => (
                            <tr key={investment._id}>
                              <td className="px-4 py-3 font-bold">
                                {investment.investorName || `Investor ${index + 1}`}
                              </td>
                              <td className="px-4 py-3 font-black text-primary">{formatCurrency(investment.amount)}</td>
                              <td className="px-4 py-3 font-semibold">{investment.equity.toFixed(4)}%</td>
                              <td className="px-4 py-3 text-muted-foreground">
                                {investment.createdAt ? new Date(investment.createdAt).toLocaleDateString() : 'Pending'}
                              </td>
                              <td className="px-4 py-3">
                                <Badge variant={investment.status === 'completed' ? 'primary' : 'muted'}>
                                  {investment.status}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="bg-muted/20 px-4 py-8 text-center text-sm font-semibold text-muted-foreground">
                      No completed investments yet. Stripe-confirmed investments will appear here.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <aside className="lg:col-span-4 space-y-6">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h2 className="text-xl font-extrabold">Snapshot</h2>
                <div className="mt-5 space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Team size</span>
                    <span className="font-bold">{startup.teamSize || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Customers</span>
                    <span className="font-bold">{typeof startup.customers === 'number' ? startup.customers.toLocaleString() : startup.customers || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">HQ</span>
                    <span className="font-bold flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {startup.location}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h2 className="text-xl font-extrabold">Invest in this campaign</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Secure your allocation with a minimum investment of ${startup.minInvestment}. Progress and backer counts update live after each investment.
                </p>
                <div className="mt-5">
                  <Button variant="gradient" className="w-full" onClick={() => setIsInvestOpen(true)}>
                    Back this campaign
                  </Button>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>

      <InvestModal
        startup={startup}
        isOpen={isInvestOpen}
        onClose={() => setIsInvestOpen(false)}
      />
    </>
  );
}
