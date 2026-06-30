'use client';

import * as React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquareQuote } from 'lucide-react';
import { testimonials } from '@/constants/dummyData';

export function Testimonials() {
  const [activeTab, setActiveTab] = React.useState<'investor' | 'founder'>('investor');

  const filteredReviews = testimonials.filter((t) => t.type === activeTab);

  return (
    <section className="py-24 border-t border-border/40 bg-muted/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Trusted by Leaders
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            Hear from our global network of active angel backers and venture-backed founders.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex space-x-1 rounded-xl bg-muted p-1 border border-border">
            <button
              onClick={() => setActiveTab('investor')}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'investor'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Investor Reviews
            </button>
            <button
              onClick={() => setActiveTab('founder')}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'founder'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Founder Reviews
            </button>
          </div>
        </div>

        {/* Reviews Cards Grid */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {filteredReviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-card border border-border p-8 rounded-2xl shadow-sm flex flex-col justify-between space-y-6 relative overflow-hidden group hover:border-primary/50 transition-colors"
                >
                  {/* Decorative Icon */}
                  <MessageSquareQuote className="absolute right-6 top-6 h-12 w-12 text-primary/5 group-hover:text-primary/10 transition-colors pointer-events-none" />

                  {/* Rating */}
                  <div className="flex space-x-1">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="h-4.5 w-4.5 fill-accent text-accent" />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-sm sm:text-base text-foreground font-semibold leading-relaxed leading-6 flex-1">
                    &ldquo;{review.quote}&rdquo;
                  </p>

                  {/* User Info */}
                  <div className="flex items-center space-x-4 pt-4 border-t border-border/60">
                    <div className="relative h-11 w-11 overflow-hidden rounded-xl bg-muted shrink-0">
                      <Image
                        src={review.avatar}
                        alt={review.name}
                        fill
                        sizes="44px"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-foreground">{review.name}</h4>
                      <p className="text-xs text-muted-foreground font-semibold">
                        {review.role}, <span className="text-primary font-bold">{review.company}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
