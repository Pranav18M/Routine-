'use client';
import { cn } from '../../lib/utils';

export default function MicroHabitBadge({ text, onAccept, onDismiss }) {
  if (!text) return null;

  return (
    <div className="p-3 rounded-[14px] border border-[rgba(167,139,250,0.3)]
      bg-[rgba(167,139,250,0.08)] flex items-start gap-3 anim-fade-up">
      <span className="text-lg shrink-0 pulse-soft">⚡</span>
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-semibold text-[#A78BFA] mb-0.5">2-min micro version</p>
        <p className="text-[13px] text-primary leading-snug">{text}</p>
      </div>
      <div className="flex flex-col gap-1">
        <button
          onClick={onAccept}
          className="text-[11px] font-bold text-[#10B981] hover:opacity-80 transition-opacity"
        >
          Do it
        </button>
        <button
          onClick={onDismiss}
          className="text-[11px] text-muted hover:opacity-80 transition-opacity"
        >
          Skip
        </button>
      </div>
    </div>
  );
}