'use client';
import ProgressRing from '../ui/ProgressRing';
import { cn } from '../../lib/utils';

function ScoreLabel({ score }) {
  if (score >= 80) return { label: 'Excellent', color: '#10B981' };
  if (score >= 60) return { label: 'Good', color: '#6C47FF' };
  if (score >= 40) return { label: 'Building', color: '#F59E0B' };
  return { label: 'Getting started', color: '#A78BFA' };
}

export default function ConsistencyRing({ score = 0, todayCompleted = 0, todayTotal = 0 }) {
  const { label, color } = ScoreLabel({ score });

  return (
    <div className="solid-card p-5 flex items-center gap-5">
      <ProgressRing
        percentage={score}
        size={88}
        strokeWidth={8}
        color={color}
        label={`${Math.round(score)}`}
        sublabel="score"
        animate
      />
      <div className="flex-1 min-w-0">
        <p className="text-[18px] font-bold text-primary leading-tight">{label}</p>
        <p className="text-[13px] text-secondary mt-0.5">30-day consistency</p>

        {todayTotal > 0 && (
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[12px] text-secondary">Today</span>
              <span className="text-[12px] font-semibold text-primary">
                {todayCompleted}/{todayTotal}
              </span>
            </div>
            <div className="h-1.5 bg-[var(--color-elevated)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#6C47FF] rounded-full transition-all duration-700"
                style={{ width: `${todayTotal > 0 ? (todayCompleted / todayTotal) * 100 : 0}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}