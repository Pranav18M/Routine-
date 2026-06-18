'use client';
import { cn } from '../../lib/utils';
import useStore from '../../store/useStore';
import { getModeEmoji, getModeLabel } from '../../lib/utils';

export default function Header({ title, subtitle, showMode = false, rightAction }) {
  const { user, currentMode } = useStore();

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        'bg-[var(--color-bg)]/80 backdrop-blur-[20px]',
        'border-b border-[var(--color-border)]',
        'safe-top',
      )}
      style={{ height: 'var(--header-height)' }}
    >
      <div className="max-w-lg mx-auto px-4 h-full flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h1 className="text-[17px] font-bold text-primary leading-tight truncate">
            {title || 'RoutineOS'}
          </h1>
          {subtitle && (
            <p className="text-[12px] text-secondary leading-none mt-0.5 truncate">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {showMode && currentMode && currentMode !== 'normal' && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-pill text-[11px] font-semibold
              bg-[rgba(108,71,255,0.15)] text-[#A78BFA] border border-[rgba(108,71,255,0.2)]">
              {getModeEmoji(currentMode)} {getModeLabel(currentMode)}
            </span>
          )}
          {rightAction && rightAction}
        </div>
      </div>
    </header>
  );
}