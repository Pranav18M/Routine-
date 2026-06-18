'use client';
import { useMemo } from 'react';
import { cn, formatTime } from '../../lib/utils';
import HabitCard from './HabitCard';

function TimeSlotLabel({ label }) {
  return (
    <div className="flex items-center gap-3 mb-2">
      <span className="text-[11px] font-semibold text-muted uppercase tracking-widest shrink-0">
        {label}
      </span>
      <div className="flex-1 h-px bg-[var(--color-border)]" />
    </div>
  );
}

function getTimeSlot(timeStr) {
  if (!timeStr) return 'anytime';
  const [h] = timeStr.split(':').map(Number);
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

export default function HabitTimeline({ habits, logs, onComplete, onSkip, onMicro, onPress }) {
  const grouped = useMemo(() => {
    const slots = { morning: [], afternoon: [], evening: [], anytime: [] };
    for (const habit of (habits || [])) {
      const slot = getTimeSlot(habit.scheduled_time);
      slots[slot].push(habit);
    }
    return slots;
  }, [habits]);

  const slotConfig = [
    { key: 'morning', label: '🌅 Morning' },
    { key: 'afternoon', label: '☀️ Afternoon' },
    { key: 'evening', label: '🌙 Evening' },
    { key: 'anytime', label: '⏰ Flexible' },
  ];

  const hasAny = habits?.length > 0;

  if (!hasAny) {
    return (
      <div className="text-center py-12">
        <p className="text-4xl mb-3">📭</p>
        <p className="text-[15px] font-semibold text-primary">No habits scheduled</p>
        <p className="text-[13px] text-secondary mt-1">Add habits in the Habits tab to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 stagger-children">
      {slotConfig.map(({ key, label }) => {
        const slotHabits = grouped[key];
        if (!slotHabits?.length) return null;
        return (
          <section key={key}>
            <TimeSlotLabel label={label} />
            <div className="space-y-2">
              {slotHabits.map(habit => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  log={logs?.[habit.id]}
                  onComplete={onComplete}
                  onSkip={onSkip}
                  onMicro={onMicro}
                  onPress={onPress}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}