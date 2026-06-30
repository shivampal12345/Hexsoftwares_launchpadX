'use client';

import * as React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Calendar, Users, Percent, DollarSign, Bookmark, BookmarkCheck } from 'lucide-react';
import { Startup } from '@/types';
import { useStartups } from '@/hooks/useStartups';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { LoadingSkeleton } from '../ui/LoadingSkeleton';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

const BOOKMARKS_KEY = 'launchpadx-bookmarks';

interface FeaturedStartupsProps {
  onInvest: (startup: Startup) => void;
  onViewDetails: (startup: Startup) => void;
  selectedCategory: string | null;
  onClearCategory: () => void;
}

export function FeaturedStartups({
  onInvest,
  onViewDetails,
  selectedCategory,
  onClearCategory,
}: FeaturedStartupsProps) {
  const { data: startups = [], isLoading } = useStartups();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeFilter, setActiveFilter] = React.useState('All');
  const [bookmarks, setBookmarks] = React.useState<string[]>(() => {
    if (typeof window === 'undefined') {
      return [];
    }

    try {
      const saved = window.localStorage.getItem(BOOKMARKS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const visibleFilter = selectedCategory || activeFilter;

  React.useEffect(() => {
    window.localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  }, [bookmarks]);

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarks((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
    if (selectedCategory || filter === 'All') {
      onClearCategory();
    }
  };

  const industries = ['All', ...Array.from(new Set(startups.map((s) => s.industry)))];

  const filteredStartups = startups.filter((startup) => {
    const matchesSearch =
      startup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      startup.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = visibleFilter === 'All' || startup.industry === visibleFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <section id="startups" className="py-16 border-t border-border/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-4 max-w-xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Featured Campaigns
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Vetted high-growth investment opportunities. Review comprehensive pitch materials, growth charts, and claim your equity shares today.
            </p>
          </div>

          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="flex space-x-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {industries.map((ind) => (
            <button
              key={ind}
              onClick={() => handleFilterClick(ind)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer border shrink-0 ${
                visibleFilter === ind
                  ? 'bg-primary border-primary text-white shadow-md'
                  : 'bg-card border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground/35'
              }`}
            >
              {ind}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <LoadingSkeleton key={index} className="h-[520px] rounded-2xl" />
            ))}
          </div>
        ) : (
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredStartups.map((startup) => {
            const startupId = startup.id || startup._id || '';
            const isBookmarked = bookmarks.includes(startupId);
            const progressPercentage = (startup.amountRaised / startup.fundingGoal) * 100;

            return (
              <motion.div
                key={startupId}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ type: 'spring', stiffness: 150, damping: 24, mass: 0.85 }}
                whileHover={{ y: -3 }}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-muted">
                  <Image
                    src={startup.coverImage}
                    alt={`${startup.name} Cover`}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-transparent to-transparent opacity-90" />

                  <div className="absolute top-4 left-4 flex justify-between right-4 items-center">
                    <Badge variant="accent">{startup.industry}</Badge>
                    <button
                      onClick={(e) => toggleBookmark(startupId, e)}
                      className="p-2 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-black/60 transition-colors cursor-pointer"
                      aria-label="Bookmark campaign"
                    >
                      {isBookmarked ? (
                        <BookmarkCheck className="h-4.5 w-4.5 text-accent" />
                      ) : (
                        <Bookmark className="h-4.5 w-4.5" />
                      )}
                    </button>
                  </div>

                      <div className="absolute -bottom-6 left-6 flex items-end space-x-3">
                        <div className="relative h-14 w-14 overflow-hidden rounded-xl border-2 border-card bg-card shadow-md">
                          <Image
                            src={startup.logo}
                            alt={`${startup.name} Logo`}
                            fill
                            sizes="56px"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-6 pt-10 flex-1 flex flex-col justify-between space-y-6">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <Link href={`/startups/${startup.id}`} className="font-extrabold text-lg text-foreground hover:text-primary transition-colors">
                              {startup.name}
                            </Link>
                            <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-0.5 font-semibold">
                              <span>by {startup.founder}</span>
                              <span>&bull;</span>
                              <span className="flex items-center"><MapPin className="h-3 w-3 mr-0.5" /> {startup.location}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 font-medium">
                          {startup.tagline}
                        </p>
                      </div>

                      <div className="space-y-2.5">
                        <div className="flex justify-between items-center text-xs font-bold">
                          <span className="text-primary">{formatCurrency(startup.amountRaised)} Raised</span>
                          <span className="text-muted-foreground">Target {formatCurrency(startup.fundingGoal)}</span>
                        </div>
                        <ProgressBar value={progressPercentage} />
                        <div className="flex justify-between text-xs text-muted-foreground font-semibold">
                          <span className="flex items-center"><Users className="h-3.5 w-3.5 mr-1" /> {startup.backers} investors</span>
                          <span className="flex items-center"><Calendar className="h-3.5 w-3.5 mr-1" /> {startup.daysLeft} days left</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 py-3 border-t border-b border-border/60 text-center bg-muted/30 rounded-xl">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex justify-center items-center gap-0.5">
                            <DollarSign className="h-3 w-3" /> Min Investment
                          </p>
                          <p className="text-sm font-black text-foreground mt-1">
                            ${startup.minInvestment}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex justify-center items-center gap-0.5">
                            <Percent className="h-3 w-3" /> Est. Equity Pool
                          </p>
                          <p className="text-sm font-black text-foreground mt-1">
                            {(startup.expectedEquity * 100).toFixed(1)}%
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <Button
                          variant="outline"
                          className="flex-1 text-sm font-bold"
                          onClick={() => onViewDetails(startup)}
                        >
                          View Details
                        </Button>
                        <Button
                          variant="gradient"
                          className="flex-1 text-sm font-bold"
                          onClick={() => onInvest(startup)}
                        >
                          Invest Now
                        </Button>
                        <Link
                          href={`/startups/${startupId}`}
                          className="col-span-2 inline-flex h-11 items-center justify-center rounded-xl bg-secondary px-4 text-sm font-bold text-white shadow-md shadow-teal-500/10 transition-all hover:bg-teal-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                        >
                          Open Page
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

        {!isLoading && filteredStartups.length === 0 && (
          <div className="text-center py-20 bg-muted/10 rounded-2xl border border-dashed border-border mt-6">
            <Search className="h-10 w-10 mx-auto text-muted-foreground/60 mb-3" />
            <p className="text-muted-foreground font-semibold">No active campaigns found matching filters.</p>
          </div>
        )}
      </div>
    </section>
  );
}
