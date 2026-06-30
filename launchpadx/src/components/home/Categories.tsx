'use client';

import * as Icons from 'lucide-react';
import { motion, Variants } from 'framer-motion';
import { categories } from '@/constants/dummyData';

interface CategoriesProps {
  onSelectCategory: (categoryName: string) => void;
  selectedCategory: string | null;
}

export function Categories({ onSelectCategory, selectedCategory }: CategoriesProps) {
  const smoothSpring = { type: 'spring' as const, stiffness: 150, damping: 24, mass: 0.85 };
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.035 }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 14, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: smoothSpring }
  };

  return (
    <section id="categories" className="py-16 border-t border-border/40 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Explore Hot Sectors
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            Find and support early-stage ventures in the industries shaping the future of global SaaS and Fintech.
          </p>
        </div>

        {/* Categories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {categories.map((category) => {
            const LucideIcon = Icons[
              category.icon as keyof typeof Icons
            ] as React.ComponentType<Icons.LucideProps> | undefined;
            const isSelected = selectedCategory === category.name;

            return (
              <motion.div
                key={category.id}
                variants={itemVariants}
                whileHover={{ y: -3 }}
                transition={smoothSpring}
                onClick={() => onSelectCategory(isSelected ? '' : category.name)}
                className={`group cursor-pointer rounded-2xl border p-6 flex flex-col items-center justify-between text-center transition-all duration-300 relative overflow-hidden select-none ${
                  isSelected
                    ? 'border-primary bg-primary/5 shadow-md shadow-primary/5'
                    : 'border-border bg-card hover:border-primary/50 hover:shadow-lg'
                }`}
              >
                {/* Background Hover Accent */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div className={`p-4 rounded-2xl mb-4 transition-colors ${
                  isSelected ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                }`}>
                  {LucideIcon && <LucideIcon className="h-7 w-7" />}
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-foreground text-base group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-xs text-muted-foreground font-semibold">
                    {category.count} campaigns
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
