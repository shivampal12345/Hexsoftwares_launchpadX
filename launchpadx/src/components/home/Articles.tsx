'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowUpRight, Calendar, Clock } from 'lucide-react';
import { articles } from '@/constants/dummyData';
import { Badge } from '../ui/Badge';

export function Articles() {
  const smoothSpring = { type: 'spring' as const, stiffness: 150, damping: 24, mass: 0.85 };

  return (
    <section id="insights" className="py-24 border-t border-border/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="space-y-4 max-w-xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Latest Insights
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base font-semibold">
              Master the mechanics of early-stage valuations, SEC regulations, cap table updates, and fundraising strategies.
            </p>
          </div>
          <div>
            <a href="/faq" className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:text-teal-800 transition-colors">
              Browse all guides <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.slice(0, 3).map((article, idx) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -80px 0px' }}
              transition={{ ...smoothSpring, delay: idx * 0.06 }}
              whileHover={{ y: -3 }}
              className="group cursor-pointer flex flex-col bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
            >
              {/* Cover Image */}
              <div className="relative aspect-video overflow-hidden bg-muted">
                <Image
                  src={article.coverImage}
                  alt={article.title}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary">{article.category}</Badge>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 text-xs text-muted-foreground font-bold">
                    <span className="flex items-center"><Calendar className="h-3.5 w-3.5 mr-1" /> {article.date}</span>
                    <span>&bull;</span>
                    <span className="flex items-center"><Clock className="h-3.5 w-3.5 mr-1" /> {article.readTime}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-extrabold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 font-medium">
                    {article.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground font-bold">
                  <span>By {article.author}</span>
                  <span className="text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform flex items-center gap-0.5">
                    Read article <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
