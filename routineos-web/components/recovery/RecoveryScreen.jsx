'use client';
import { useState } from 'react';
import Button from '../ui/Button';
import { cn } from '../../lib/utils';

const reasons = [
  { key: 'exam', emoji: '📚', label: 'Exams / Deadlines', desc: 'Study pressure took over' },
  { key: 'travel', emoji: '✈️', label: 'Travel', desc: 'Away from home routine' },
  { key: 'sick', emoji: '🤒', label: 'Sick / Unwell', desc: 'Body needed rest' },
  { key: 'other', emoji: '💭', label: 'Other', desc: 'Life just happened' },
];

export default function RecoveryScreen({ missedDays = 2, onGenerate, generating }) {
  const [selectedReason, setSelectedReason] = useState(null);

  return (
    <div className="fixed inset-0 z-[90] bg-[var(--color-bg)] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6 anim-fade-up">
        {/* Header */}
        <div className="text-center">
          <div className="text-5xl mb-4">💙</div>
          <h1 className="text-[24px] font-bold text-primary mb-2">Life happened.</h1>
          <p className="text-[14px] text-secondary leading-relaxed">
            You missed <strong className="text-primary">{missedDays} day{missedDays > 1 ? 's' : ''}</strong> — no guilt here.
            Pick what got in the way and we'll build you a gentle comeback plan.
          </p>
        </div>

        {/* Reason picker */}
        <div className="space-y-2">
          {reasons.map(r => (
            <button
              key={r.key}
              onClick={() => setSelectedReason(r.key)}
              className={cn(
                'w-full flex items-center gap-4 p-4 rounded-[16px] text-left',
                'transition-all duration-200 active:scale-[0.98]',
                selectedReason === r.key
                  ? 'bg-[rgba(108,71,255,0.2)] border-2 border-[#6C47FF]'
                  : 'solid-card border-2 border-transparent',
              )}
            >
              <span className="text-2xl">{r.emoji}</span>
              <div>
                <p className="text-[15px] font-semibold text-primary">{r.label}</p>
                <p className="text-[12px] text-secondary">{r.desc}</p>
              </div>
              {selectedReason === r.key && (
                <span className="ml-auto text-[#6C47FF] font-bold text-lg">✓</span>
              )}
            </button>
          ))}
        </div>

        {/* CTA */}
        <Button
          fullWidth
          size="lg"
          disabled={!selectedReason}
          loading={generating}
          onClick={() => onGenerate(selectedReason, missedDays)}
        >
          Build my 3-day comeback plan
        </Button>

        <p className="text-center text-[11px] text-muted">
          No streaks broken. Just a fresh start.
        </p>
      </div>
    </div>
  );
}