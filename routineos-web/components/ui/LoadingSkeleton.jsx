'use client';
import { cn } from '../../lib/utils';

export function Skeleton({ className, ...props }) {
  return <div className={cn('skeleton', className)} {...props} />;
}

export function HabitCardSkeleton() {
  return (
    <div className="solid-card p-4 flex items-center gap-3">
      <Skeleton className="w-11 h-11 rounded-[12px]" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/5" />
        <Skeleton className="h-3 w-2/5" />
      </div>
      <Skeleton className="w-8 h-8 rounded-full" />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      {/* Briefing card */}
      <div className="solid-card p-5 space-y-3">
        <Skeleton className="h-4 w-2/5" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
        <Skeleton className="h-3 w-3/5" />
      </div>
      {/* Consistency ring placeholder */}
      <div className="solid-card p-5 flex items-center gap-5">
        <Skeleton className="w-20 h-20 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-2/5" />
          <Skeleton className="h-3 w-3/5" />
          <Skeleton className="h-3 w-2/5" />
        </div>
      </div>
      {/* Habit list */}
      {[...Array(5)].map((_, i) => <HabitCardSkeleton key={i} />)}
    </div>
  );
}

export function InsightSkeleton() {
  return (
    <div className="space-y-4">
      <div className="solid-card p-5 space-y-3">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-3 w-4/5" />
        <Skeleton className="h-3 w-3/5" />
      </div>
      <div className="solid-card p-5">
        <Skeleton className="h-4 w-2/5 mb-4" />
        <Skeleton className="h-32 w-full rounded-[12px]" />
      </div>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="solid-card p-4 flex items-center gap-3">
          <Skeleton className="h-3 w-1/4" />
          <div className="flex-1">
            <Skeleton className="h-2.5 rounded-full w-full" />
          </div>
          <Skeleton className="h-3 w-8" />
        </div>
      ))}
    </div>
  );
}

export default Skeleton;