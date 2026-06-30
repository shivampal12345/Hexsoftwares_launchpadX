'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number; // percentage from 0 to 100+
  className?: string;
  showText?: boolean;
}

export function ProgressBar({ value, className, showText = false }: ProgressBarProps) {
  const percentage = Math.min(Math.max(value, 0), 100);
  
  return (
    <div className={cn("w-full", className)}>
      <div className="h-3 w-full bg-muted rounded-full overflow-hidden relative">
        <motion.div
          className="h-full bg-gradient-to-r from-primary via-secondary to-teal-400 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </div>
      {showText && (
        <div className="flex justify-between items-center mt-2 text-xs font-semibold">
          <span className="text-primary">{percentage.toFixed(0)}% Raised</span>
          <span className="text-muted-foreground">Target Met</span>
        </div>
      )}
    </div>
  );
}
