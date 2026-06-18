'use client';
import { cn } from '../../lib/utils';

export default function WeeklyInsightCard({ insight }) {
  if (!insight) return null;

  const weekDate = new Date(insight.week_start + 'T00:00:00');
  const weekLabel = weekDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <div className="glass-card p-5" style={{ borderColor: 'rgba(108,71,255,0.2)' }}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-[11px] font-semibold text-[#A78BFA] uppercase tracking-wider">
            Week of {weekLabel}
          </p>
          <div className="flex items-center gap-3 mt-2">
            {insight.consistency_pct !== null && (
              <div className="flex items-center gap-1.5">
                <span className="text-[22px] font-bold text-primary">
                  {Math.round(insight.consistency_pct)}%
                </span>
                <span className="text-[12px] text-secondary">completion</span>
              </div>
            )}
          </div>
        </div>
        <span className="text-3xl">📊</span>
      </div>

      {insight.insight_text && (
        <p className="text-[14px] text-primary leading-relaxed mb-4">
          {insight.insight_text}
        </p>
      )}

      <div className="grid grid-cols-2 gap-2">
        {insight.best_day && (
          <div className="p-2.5 rounded-[10px] bg-[rgba(16,185,129,0.1)]">
            <p className="text-[10px] font-semibold text-[#10B981] uppercase tracking-wide">Best day</p>
            <p className="text-[13px] font-bold text-primary mt-0.5">{insight.best_day}</p>
          </div>
        )}
        {insight.worst_day && (
          <div className="p-2.5 rounded-[10px] bg-[rgba(245,158,11,0.1)]">
            <p className="text-[10px] font-semibold text-[#F59E0B] uppercase tracking-wide">Toughest day</p>
            <p className="text-[13px] font-bold text-primary mt-0.5">{insight.worst_day}</p>
          </div>
        )}
        {insight.top_habit && (
          <div className="col-span-2 p-2.5 rounded-[10px] bg-[rgba(108,71,255,0.1)]">
            <p className="text-[10px] font-semibold text-[#A78BFA] uppercase tracking-wide">Most consistent</p>
            <p className="text-[13px] font-bold text-primary mt-0.5">{insight.top_habit}</p>
          </div>
        )}
      </div>
    </div>
  );
}