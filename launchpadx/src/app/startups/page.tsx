'use client';

import * as React from 'react';
import { motion, Variants } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Categories } from '@/components/home/Categories';
import { FeaturedStartups } from '@/components/home/FeaturedStartups';
import { InvestModal } from '@/components/shared/InvestModal';
import { LaunchCampaignModal } from '@/components/shared/LaunchCampaignModal';
import { StartupDetailsModal } from '@/components/shared/StartupDetailsModal';
import { usePlatformStats, useStartups } from '@/hooks/useStartups';
import { Startup } from '@/types';

const revealVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function StartupsPage() {
  const { data: startups = [] } = useStartups();
  const { data: platformStats } = usePlatformStats();
  const [selectedStartup, setSelectedStartup] = React.useState<Startup | null>(null);
  const [investingStartup, setInvestingStartup] = React.useState<Startup | null>(null);
  const [isLaunchOpen, setIsLaunchOpen] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);

  const handleSelectCategory = (categoryName: string) => {
    setSelectedCategory(categoryName);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar onLaunchCampaign={() => setIsLaunchOpen(true)} />

      <main className="flex-1">
        <section className="border-b border-border/50 bg-muted/20 py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={revealVariants}
              initial="hidden"
              animate="visible"
              className="max-w-3xl space-y-5"
            >
              <Link
                href="/"
                className="inline-flex h-9 w-fit items-center justify-center rounded-xl border border-border bg-card px-4 text-sm font-semibold text-foreground transition-all hover:bg-muted"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
              <Badge variant="outline" className="w-fit">Campaign Browser</Badge>
              <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
                Browse live startup campaigns
              </h1>
              <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                Explore all available campaigns, filter by category, and open each startup profile from one dedicated place.
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Campaigns</p>
                  <p className="mt-1 text-2xl font-black">{startups.length}</p>
                </div>
                <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Funding Raised</p>
                  <p className="mt-1 text-2xl font-black">{platformStats?.raised ?? '—'}</p>
                </div>
                <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Success Rate</p>
                  <p className="mt-1 text-2xl font-black">{platformStats?.successRate ?? '—'}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <Categories
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
        />

        <div className="py-8">
          <FeaturedStartups
            selectedCategory={selectedCategory}
            onClearCategory={() => setSelectedCategory(null)}
            onInvest={(startup) => setInvestingStartup(startup)}
            onViewDetails={(startup) => setSelectedStartup(startup)}
          />
        </div>
      </main>

      <Footer />

      <InvestModal
        startup={investingStartup}
        isOpen={!!investingStartup}
        onClose={() => setInvestingStartup(null)}
      />

      <LaunchCampaignModal
        isOpen={isLaunchOpen}
        onClose={() => setIsLaunchOpen(false)}
      />

      <StartupDetailsModal
        startup={selectedStartup}
        isOpen={!!selectedStartup}
        onClose={() => setSelectedStartup(null)}
        onInvest={(startup) => setInvestingStartup(startup)}
      />
    </div>
  );
}
