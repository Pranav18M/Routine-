'use client';
import { useState } from 'react';
import { cn, formatTime, formatDuration, getCategoryClass } from '../../lib/utils';

export default function HabitCard({ habit, log, onComplete, onSkip, onMicro, onPress }) {
  const [animating, setAnimating] = useState(false);
  const status = log?.status;
  const isCompleted = status === 'completed';
  const isMicro = status === 'micro';
  const isSkipped = status === 'skipped';
  const isDone = isCompleted || isMicro;

  const handleComplete = async (e) => {
    e.stopPropagation();
    if (isDone) return;
    setAnimating(true);
    await onComplete?.(habit.id);
    setTimeout(() => setAnimating(false), 450);
  };

  const handleMicro = (e) => {
    e.stopPropagation();
    onMicro?.(habit);
  };

  return (
    <div
      className={cn(
        'solid-card p-4 flex items-center gap-3 cursor-pointer',
        'transition-all duration-250',
        isDone && 'opacity-75',
        animating && 'habit-complete-anim',
      )}
      onClick={() => onPress?.(habit)}
    >
      {/* Icon */}
      <div
        className={cn(
          'w-11 h-11 rounded-[12px] flex items-center justify-center text-xl shrink-0',
          'transition-all duration-300',
          isDone
            ? 'bg-[rgba(16,185,129,0.2)]'
            : 'bg-[var(--color-elevated)]',
        )}
      >
        {isDone ? '✓' : habit.icon || '✅'}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p
            className={cn(
              'text-[15px] font-semibold truncate',
              isDone ? 'text-secondary line-through' : 'text-primary',
            )}
          >
            {habit.name}
          </p>
          {habit.micro_version && !isDone && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-pill bg-[rgba(167,139,250,0.15)] text-[#A78BFA] shrink-0">
              micro
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className={cn('text-[11px] px-2 py-0.5 rounded-pill font-medium', getCategoryClass(habit.category))}>
            {habit.category}
          </span>
          {habit.scheduled_time && (
            <span className="text-[12px] text-secondary">{formatTime(habit.scheduled_time)}</span>
          )}
          <span className="text-[12px] text-muted">{formatDuration(habit.duration_mins)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 shrink-0">
        {!isDone && habit.micro_version && (
          <button
            onClick={handleMicro}
            className="w-8 h-8 rounded-full bg-[rgba(167,139,250,0.15)] text-[#A78BFA]
              text-[11px] font-bold flex items-center justify-center
              hover:bg-[rgba(167,139,250,0.25)] transition-colors"
            title="Do micro version"
          >
            2m
          </button>
        )}
        <button
          onClick={handleComplete}
          disabled={isDone}
          className={cn(
            'w-9 h-9 rounded-full flex items-center justify-center',
            'transition-all duration-200 active:scale-90',
            isDone
              ? 'bg-[rgba(16,185,129,0.2)] text-[#10B981]'
              : 'border-2 border-[var(--color-border)] text-secondary hover:border-[#6C47FF] hover:text-[#6C47FF]',
          )}
          aria-label={isDone ? 'Completed' : 'Mark complete'}
        >
          {isDone && <span className="text-lg">✓</span>}
        </button>
      </div>
    </div>
  );
}