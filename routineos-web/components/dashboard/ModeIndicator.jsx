'use client';
import { getModeEmoji, getModeLabel } from '../../lib/utils';
import { cn } from '../../lib/utils';

const modeColors = {
  normal: 'rgba(108,71,255,0.15)',
  exam: 'rgba(59,130,246,0.15)',
  travel: 'rgba(16,185,129,0.15)',
  sick: 'rgba(239,68,68,0.15)',
  grind: 'rgba(245,158,11,0.15)',
};

const modeTextColors = {
  normal: '#A78BFA',
  exam: '#60A5FA',
  travel: '#10B981',
  sick: '#F87171',
  grind: '#F59E0B',
};

export default function ModeIndicator({ mode = 'normal', modeUntil, onSwitch }) {
  if (mode === 'normal' && !onSwitch) return null;

  const bg = modeColors[mode] || modeColors.normal;
  const textColor = modeTextColors[mode] || modeTextColors.normal;
  const expiresText = modeUntil
    ? `until ${new Date(modeUntil).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
    : null;

  return (
    <button
      onClick={onSwitch}
      className={cn(
        'flex items-center gap-2.5 w-full p-3 rounded-[14px]',
        'transition-all duration-200 active:scale-[0.98]',
      )}
      style={{ background: bg }}
    >
      <span className="text-xl">{getModeEmoji(mode)}</span>
      <div className="flex-1 text-left">
        <p className="text-[13px] font-semibold" style={{ color: textColor }}>
          {getModeLabel(mode)}
        </p>
        {expiresText && (
          <p className="text-[11px] text-secondary">{expiresText}</p>
        )}
      </div>
      <span className="text-[12px] text-secondary">Switch →</span>
    </button>
  );
}