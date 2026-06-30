'use client';

import * as React from 'react';
import { motion, Variants } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/home/Hero';
import { Categories } from '@/components/home/Categories';
import { FeaturedStartups } from '@/components/home/FeaturedStartups';
import { HowItWorks } from '@/components/home/HowItWorks';
import { Statistics } from '@/components/home/Statistics';
import { SuccessStories } from '@/components/home/SuccessStories';
import { Testimonials } from '@/components/home/Testimonials';
import { Articles } from '@/components/home/Articles';
import { Newsletter } from '@/components/home/Newsletter';
import { InvestModal } from '@/components/shared/InvestModal';
import { LaunchCampaignModal } from '@/components/shared/LaunchCampaignModal';
import { StartupDetailsModal } from '@/components/shared/StartupDetailsModal';
import { Startup } from '@/types';

const revealVariants: Variants = {
  hidden: { opacity: 0, y: 22, scale: 0.995 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 140,
      damping: 24,
      mass: 0.9,
      delay,
    },
  }),
};

function ScrollReveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      variants={revealVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.12, margin: '0px 0px -80px 0px' }}
      custom={delay}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  const [selectedStartup, setSelectedStartup] = React.useState<Startup | null>(null);
  const [investingStartup, setInvestingStartup] = React.useState<Startup | null>(null);
  const [isLaunchOpen, setIsLaunchOpen] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);

  const handleExploreStartups = () => {
    const el = document.getElementById('startups');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectCategoryFromHero = (categoryName: string) => {
    setSelectedCategory(categoryName);
    handleExploreStartups();
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation header */}
      <Navbar onLaunchCampaign={() => setIsLaunchOpen(true)} />

      <main className="flex-grow">
        {/* Hero Section */}
        <Hero
          onExploreStartups={handleExploreStartups}
          onLaunchCampaign={() => setIsLaunchOpen(true)}
        />

        {/* Startup Categories grid */}
        <ScrollReveal>
          <Categories
            selectedCategory={selectedCategory}
            onSelectCategory={handleSelectCategoryFromHero}
          />
        </ScrollReveal>

        {/* Featured Campaigns grid with search/filter */}
        <ScrollReveal>
          <FeaturedStartups
            selectedCategory={selectedCategory}
            onClearCategory={() => setSelectedCategory(null)}
            onInvest={(startup) => setInvestingStartup(startup)}
            onViewDetails={(startup) => setSelectedStartup(startup)}
          />
        </ScrollReveal>

        {/* How It Works step timeline */}
        <ScrollReveal>
          <HowItWorks />
        </ScrollReveal>

        {/* Live Counters statistics dashboard banner */}
        <ScrollReveal>
          <Statistics />
        </ScrollReveal>

        {/* Spotlight Success story with Arr AreaChart */}
        <ScrollReveal>
          <SuccessStories />
        </ScrollReveal>

        {/* Reviews Carousel (investors vs founders) */}
        <ScrollReveal>
          <Testimonials />
        </ScrollReveal>

        {/* Knowledge Articles grid */}
        <ScrollReveal>
          <Articles />
        </ScrollReveal>

        {/* Newsletter subscriptions */}
        <ScrollReveal>
          <Newsletter />
        </ScrollReveal>
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Interactive overlays */}
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
