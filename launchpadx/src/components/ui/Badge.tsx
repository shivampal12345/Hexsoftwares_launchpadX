import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'muted';
}

export function Badge({ className, variant = 'primary', ...props }: BadgeProps) {
  const baseStyles = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none';
  
  const variants = {
    primary: 'bg-primary/10 text-primary border border-primary/20',
    secondary: 'bg-secondary/10 text-secondary border border-secondary/20',
    accent: 'bg-accent/10 text-amber-700 dark:text-accent border border-accent/20',
    outline: 'border border-border text-foreground',
    muted: 'bg-muted text-muted-foreground border border-transparent',
  };

  return (
    <div className={cn(baseStyles, variants[variant], className)} {...props} />
  );
}
