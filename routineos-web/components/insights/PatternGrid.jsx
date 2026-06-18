'use client';
import { cn, getCategoryClass } from '../../lib/utils';

function HabitBar({ habit }) {
  const { name, category, pct } = habit;
  const color = pct >= 80 ? '#10B981' : pct >= 50 ? '#6C47FF' : '#F59E0B';

  return (
    <div className="flex items-center gap-3 py-2">
      <span className={cn('text-[11px] px-2 py-0.5 rounded-pill font-medium shrink-0', getCategoryClass(category))}>
        {category[0].toUpperCase()}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-primary truncate mb-1">{name}</p>
        <div className="h-1.5 bg-[var(--color-elevated)] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${pct}%`, background: color }}
          />
        </div>
      </div>
      <span className="text-[13px] font-bold shrink-0" style={{ color }}>{pct}%</span>
    </div>
  );
}

export default function PatternGrid({ habitData = [] }) {
  if (!habitData.length) {
    return (
      <div className="text-center py-8 text-secondary text-[13px]">
        Log habits for 7+ days to see patterns
      </div>
    );
  }

  const sorted = [...habitData].sort((a, b) => b.pct - a.pct);

  return (
    <div className="divide-y divide-[var(--color-border)]">
      {sorted.map((habit, i) => (
        <HabitBar key={i} habit={habit} />
      ))}
    </div>
  );
}