'use client';
import { useState } from 'react';
import BottomSheet from '../ui/BottomSheet';
import Button from '../ui/Button';
import { cn, getModeEmoji, getModeLabel } from '../../lib/utils';

const modes = [
  { key: 'normal', emoji: '🌟', label: 'Normal', desc: 'Your full routine, all habits active' },
  { key: 'grind', emoji: '🔥', label: 'Grind', desc: 'Extra hustle mode — maximum habits' },
  { key: 'exam', emoji: '📚', label: 'Exam', desc: 'Study focus, lighter on wellness' },
  { key: 'travel', emoji: '✈️', label: 'Travel', desc: 'Portable habits only' },
  { key: 'sick', emoji: '🤒', label: 'Recovery', desc: 'Rest mode — essentials only' },
];

const durationOptions = [1, 2, 3, 5, 7, 14];

export default function ModeSwitcher({ currentMode, isOpen, onClose, onSwitch, switching }) {
  const [selected, setSelected] = useState(currentMode || 'normal');
  const [duration, setDuration] = useState(null);

  const handleSwitch = () => {
    onSwitch(selected, duration);
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Switch Life Mode">
      <div className="space-y-4">
        {/* Mode grid */}
        <div className="space-y-2">
          {modes.map(mode => (
            <button
              key={mode.key}
              onClick={() => setSelected(mode.key)}
              className={cn(
                'w-full flex items-center gap-4 p-4 rounded-[14px] text-left',
                'transition-all duration-200 active:scale-[0.98]',
                selected === mode.key
                  ? 'bg-[rgba(108,71,255,0.18)] border-2 border-[#6C47FF]'
                  : 'bg-[var(--color-elevated)] border-2 border-transparent hover:border-[var(--color-border)]',
              )}
            >
              <span className="text-2xl">{mode.emoji}</span>
              <div className="flex-1">
                <p className="text-[15px] font-semibold text-primary">{mode.label}</p>
                <p className="text-[12px] text-secondary">{mode.desc}</p>
              </div>
              {selected === mode.key && (
                <span className="text-[#6C47FF] font-bold">✓</span>
              )}
            </button>
          ))}
        </div>

        {/* Duration picker (not for normal) */}
        {selected !== 'normal' && (
          <div>
            <p className="text-[13px] font-semibold text-secondary mb-2">Duration (optional)</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setDuration(null)}
                className={cn(
                  'px-3 py-1.5 rounded-pill text-[12px] font-semibold transition-all',
                  !duration
                    ? 'bg-[#6C47FF] text-white'
                    : 'bg-[var(--color-elevated)] text-secondary',
                )}
              >
                Until I switch
              </button>
              {durationOptions.map(d => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={cn(
                    'px-3 py-1.5 rounded-pill text-[12px] font-semibold transition-all',
                    duration === d
                      ? 'bg-[#6C47FF] text-white'
                      : 'bg-[var(--color-elevated)] text-secondary',
                  )}
                >
                  {d}d
                </button>
              ))}
            </div>
          </div>
        )}

        <Button
          fullWidth
          size="lg"
          onClick={handleSwitch}
          loading={switching}
          disabled={selected === currentMode && !duration}
        >
          Switch to {getModeLabel(selected)} {getModeEmoji(selected)}
        </Button>
      </div>
    </BottomSheet>
  );
}