'use client';
import { useState } from 'react';
import BottomSheet from '../ui/BottomSheet';
import Button from '../ui/Button';
import { cn, getCategoryClass } from '../../lib/utils';

const moods = [
  { value: 1, emoji: '😩', label: 'Rough' },
  { value: 2, emoji: '😕', label: 'Meh' },
  { value: 3, emoji: '😐', label: 'Okay' },
  { value: 4, emoji: '🙂', label: 'Good' },
  { value: 5, emoji: '😄', label: 'Great' },
];

export default function HabitCheckoff({ habit, isOpen, onClose, onLog }) {
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  if (!habit) return null;

  const handleLog = async (status) => {
    setLoading(true);
    await onLog(habit.id, status, { moodBefore: selectedMood, note: note || undefined });
    setLoading(false);
    setSelectedMood(null);
    setNote('');
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title={habit.name}>
      <div className="space-y-5">
        {/* Habit info */}
        <div className="flex items-center gap-3 p-3 rounded-[12px] bg-[var(--color-elevated)]">
          <span className="text-2xl">{habit.icon || '✅'}</span>
          <div>
            <span className={cn('text-[11px] px-2 py-0.5 rounded-pill font-medium', getCategoryClass(habit.category))}>
              {habit.category}
            </span>
            {habit.micro_version && (
              <p className="text-[12px] text-secondary mt-1">Micro: {habit.micro_version}</p>
            )}
          </div>
        </div>

        {/* Mood selector */}
        <div>
          <p className="text-[13px] font-semibold text-secondary mb-3">How are you feeling? (optional)</p>
          <div className="flex justify-between">
            {moods.map(mood => (
              <button
                key={mood.value}
                onClick={() => setSelectedMood(prev => prev === mood.value ? null : mood.value)}
                className={cn(
                  'flex flex-col items-center gap-1 p-2 rounded-[12px] flex-1 mx-0.5',
                  'transition-all duration-150',
                  selectedMood === mood.value
                    ? 'bg-[rgba(108,71,255,0.2)] scale-105'
                    : 'bg-[var(--color-elevated)] hover:bg-[var(--color-card)]',
                )}
              >
                <span className="text-xl">{mood.emoji}</span>
                <span className="text-[10px] text-secondary">{mood.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Note */}
        <div>
          <p className="text-[13px] font-semibold text-secondary mb-2">Add a note (optional)</p>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="How did it go?"
            maxLength={200}
            rows={2}
            className="w-full bg-[var(--color-elevated)] border border-[var(--color-border)]
              rounded-[12px] px-3 py-2.5 text-[14px] text-primary placeholder:text-muted
              resize-none focus:outline-none focus:border-[#6C47FF] transition-colors"
          />
        </div>

        {/* Action buttons */}
        <div className="space-y-2">
          <Button fullWidth onClick={() => handleLog('completed')} loading={loading} size="lg">
            ✓ Mark Complete
          </Button>
          {habit.micro_version && (
            <Button fullWidth variant="secondary" onClick={() => handleLog('micro')} disabled={loading}>
              ⚡ Do Micro Version
            </Button>
          )}
          <Button fullWidth variant="ghost" onClick={() => handleLog('skipped')} disabled={loading}>
            Skip for today
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
}