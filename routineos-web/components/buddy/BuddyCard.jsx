'use client';
import ProgressRing from '../ui/ProgressRing';
import Button from '../ui/Button';
import { getModeEmoji } from '../../lib/utils';
import { cn } from '../../lib/utils';

export default function BuddyCard({ buddy, onNudge, nudging, onRemove }) {
  if (!buddy) return null;

  const initials = buddy.name
    ? buddy.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <div className="solid-card p-5 space-y-4">
      {/* Buddy info */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#6C47FF] to-[#A78BFA]
          flex items-center justify-center text-white text-[18px] font-bold shrink-0">
          {buddy.avatar_url ? (
            <img src={buddy.avatar_url} alt={buddy.name} className="w-full h-full rounded-full object-cover" />
          ) : initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-[16px] font-bold text-primary truncate">{buddy.name || 'Your Buddy'}</p>
            {buddy.current_mode && buddy.current_mode !== 'normal' && (
              <span className="text-base">{getModeEmoji(buddy.current_mode)}</span>
            )}
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className={cn(
              'w-2 h-2 rounded-full',
              buddy.loggedToday ? 'bg-[#10B981]' : 'bg-[var(--color-elevated)]'
            )} />
            <p className="text-[12px] text-secondary">
              {buddy.loggedToday ? 'Logged today ✓' : 'Not logged yet today'}
            </p>
          </div>
        </div>
        <ProgressRing
          percentage={buddy.consistency_score || 0}
          size={60}
          strokeWidth={5}
          color="#6C47FF"
          label={`${Math.round(buddy.consistency_score || 0)}`}
          sublabel="%"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          fullWidth
          variant={buddy.loggedToday ? 'secondary' : 'primary'}
          onClick={onNudge}
          loading={nudging}
        >
          {buddy.loggedToday ? '👊 Send cheer' : '👊 Send nudge'}
        </Button>
        <Button variant="ghost" onClick={onRemove} size="md" className="shrink-0 px-3">
          ✕
        </Button>
      </div>
    </div>
  );
}