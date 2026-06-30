import * as React from 'react';
import { cn } from '@/lib/utils';

type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

export function LoadingSkeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-xl bg-muted border border-border/10", className)}
      {...props}
    />
  );
}

export function StartupCardSkeleton() {
  return (
    <div className="border border-border rounded-2xl p-4 bg-card space-y-4">
      <LoadingSkeleton className="h-48 w-full rounded-xl" />
      <div className="flex space-x-3 items-center">
        <LoadingSkeleton className="h-10 w-10 rounded-lg" />
        <div className="space-y-2 flex-1">
          <LoadingSkeleton className="h-4 w-1/3" />
          <LoadingSkeleton className="h-3 w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <LoadingSkeleton className="h-3 w-full" />
        <LoadingSkeleton className="h-3 w-5/6" />
      </div>
      <div className="space-y-3 pt-2">
        <LoadingSkeleton className="h-2 w-full" />
        <div className="flex justify-between">
          <LoadingSkeleton className="h-3 w-16" />
          <LoadingSkeleton className="h-3 w-16" />
        </div>
      </div>
      <div className="flex space-x-2 pt-2">
        <LoadingSkeleton className="h-10 flex-1 rounded-xl" />
        <LoadingSkeleton className="h-10 w-10 rounded-xl" />
      </div>
    </div>
  );
}
