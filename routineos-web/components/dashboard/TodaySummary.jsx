'use client';
import { cn } from '../../lib/utils';

export default function TodaySummary({ completed, total, skipped }) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const remaining = total - completed - (skipped || 0);

  return (
    <div className="flex items-center gap-3 px-1">
      <div className="flex-1">
        <div className="h-2 bg-[var(--color-elevated)] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${pct}%`,
              background: pct === 100
                ? '#10B981'
                : 'linear-gradient(90deg, #6C47FF, #A78BFA)',
            }}
          />
        </div>
      </div>
      <div className="text-right shrink-0">
        <span className="text-[13px] font-bold text-primary">{completed}</span>
        <span className="text-[13px] text-muted">/{total}</span>
        {remaining > 0 && (
          <span className="text-[11px] text-secondary ml-2">{remaining} left</span>
        )}
      </div>
    </div>
  );
}