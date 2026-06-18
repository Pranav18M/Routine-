'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { userApi } from '../../../lib/api';
import Button from '../../../components/ui/Button';
import { cn } from '../../../lib/utils';
import useStore from '../../../store/useStore';

const GOALS = [
  { key: 'fitness', emoji: '💪', label: 'Get fit & healthy' },
  { key: 'study', emoji: '📚', label: 'Study consistently' },
  { key: 'productivity', emoji: '⚡', label: 'Be more productive' },
  { key: 'mindfulness', emoji: '🧘', label: 'Reduce stress & meditate' },
  { key: 'skills', emoji: '🎯', label: 'Build new skills' },
  { key: 'sleep', emoji: '😴', label: 'Fix my sleep schedule' },
  { key: 'nutrition', emoji: '🥗', label: 'Eat better' },
  { key: 'reading', emoji: '📖', label: 'Read more books' },
];

const STEPS = ['goals', 'schedule', 'generating', 'preview'];

export default function OnboardingPage() {
  const router = useRouter();
  const { setUser, addToast } = useStore();
  const [step, setStep] = useState('goals');
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [wakeTime, setWakeTime] = useState('06:30');
  const [sleepTime, setSleepTime] = useState('23:00');
  const [workSchedule, setWorkSchedule] = useState('');
  const [generatedHabits, setGeneratedHabits] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleGoal = (key) => {
    setSelectedGoals(prev =>
      prev.includes(key) ? prev.filter(g => g !== key) : prev.length < 3 ? [...prev, key] : prev
    );
  };

  const handleGenerateRoutine = async () => {
    setStep('generating');
    setLoading(true);
    try {
      const goalLabels = selectedGoals.map(k => GOALS.find(g => g.key === k)?.label).filter(Boolean);
      const res = await userApi.completeOnboarding({
        wakeTime,
        sleepTime,
        goals: goalLabels,
        workSchedule,
      });
      setGeneratedHabits(res.data?.habits || []);
      setStep('preview');
    } catch (err) {
      addToast({ type: 'error', message: 'Failed to generate routine. Try again.' });
      setStep('schedule');
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = () => {
    router.replace('/today');
  };

  if (step === 'goals') {
    return (
      <div className="min-h-dvh flex flex-col px-5 py-8 bg-[var(--color-bg)]">
        <div className="max-w-sm mx-auto w-full space-y-6 anim-fade-up">
          <div>
            <p className="text-[12px] font-semibold text-[#A78BFA] uppercase tracking-wider">Step 1 of 2</p>
            <h1 className="text-[26px] font-bold text-primary mt-2 leading-tight">
              What do you want to focus on?
            </h1>
            <p className="text-[14px] text-secondary mt-2">Pick up to 3 goals. Your AI routine will be built around these.</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {GOALS.map(goal => {
              const selected = selectedGoals.includes(goal.key);
              const maxed = selectedGoals.length === 3 && !selected;
              return (
                <button
                  key={goal.key}
                  onClick={() => toggleGoal(goal.key)}
                  disabled={maxed}
                  className={cn(
                    'flex flex-col items-start gap-2 p-4 rounded-[16px] text-left',
                    'transition-all duration-200 active:scale-[0.97]',
                    selected
                      ? 'bg-[rgba(108,71,255,0.2)] border-2 border-[#6C47FF]'
                      : maxed
                        ? 'bg-[var(--color-elevated)] border-2 border-transparent opacity-40'
                        : 'bg-[var(--color-elevated)] border-2 border-transparent hover:border-[var(--color-border)]',
                  )}
                >
                  <span className="text-2xl">{goal.emoji}</span>
                  <p className="text-[13px] font-semibold text-primary leading-snug">{goal.label}</p>
                  {selected && (
                    <span className="text-[10px] font-bold text-[#6C47FF]">✓ Selected</span>
                  )}
                </button>
              );
            })}
          </div>

          <Button
            fullWidth
            size="lg"
            disabled={selectedGoals.length === 0}
            onClick={() => setStep('schedule')}
          >
            Continue → ({selectedGoals.length}/3 selected)
          </Button>
        </div>
      </div>
    );
  }

  if (step === 'schedule') {
    return (
      <div className="min-h-dvh flex flex-col px-5 py-8 bg-[var(--color-bg)]">
        <div className="max-w-sm mx-auto w-full space-y-6 anim-fade-up">
          <div>
            <button onClick={() => setStep('goals')} className="text-[13px] text-secondary mb-4 flex items-center gap-1">
              ← Back
            </button>
            <p className="text-[12px] font-semibold text-[#A78BFA] uppercase tracking-wider">Step 2 of 2</p>
            <h1 className="text-[26px] font-bold text-primary mt-2 leading-tight">
              Tell us about your day
            </h1>
            <p className="text-[14px] text-secondary mt-2">
              This helps the AI schedule habits in realistic time slots.
            </p>
          </div>

          <div className="space-y-4">
            <div className="solid-card p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[14px] font-semibold text-primary">Wake up time</p>
                  <p className="text-[12px] text-secondary">When do you usually get up?</p>
                </div>
                <input
                  type="time"
                  value={wakeTime}
                  onChange={e => setWakeTime(e.target.value)}
                  className="bg-[var(--color-elevated)] border border-[var(--color-border)] rounded-[10px]
                    px-3 py-2 text-[15px] font-semibold text-primary focus:outline-none focus:border-[#6C47FF]"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[14px] font-semibold text-primary">Sleep time</p>
                  <p className="text-[12px] text-secondary">Ideal bedtime?</p>
                </div>
                <input
                  type="time"
                  value={sleepTime}
                  onChange={e => setSleepTime(e.target.value)}
                  className="bg-[var(--color-elevated)] border border-[var(--color-border)] rounded-[10px]
                    px-3 py-2 text-[15px] font-semibold text-primary focus:outline-none focus:border-[#6C47FF]"
                />
              </div>
            </div>

            <div>
              <p className="text-[14px] font-semibold text-primary mb-2">Work / College schedule (optional)</p>
              <textarea
                value={workSchedule}
                onChange={e => setWorkSchedule(e.target.value)}
                placeholder="e.g. College 9am–5pm weekdays, work from home Thursdays"
                rows={3}
                className="w-full bg-[var(--color-elevated)] border border-[var(--color-border)]
                  rounded-[12px] px-4 py-3 text-[14px] text-primary placeholder:text-muted
                  resize-none focus:outline-none focus:border-[#6C47FF] transition-colors"
              />
            </div>
          </div>

          <Button fullWidth size="lg" loading={loading} onClick={handleGenerateRoutine}>
            ✨ Generate my AI routine
          </Button>
        </div>
      </div>
    );
  }

  if (step === 'generating') {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-5 bg-[var(--color-bg)]">
        <div className="text-center space-y-5 anim-fade-up">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-[#6C47FF] border-t-transparent rounded-full animate-spin mx-auto" />
            <div className="absolute inset-0 flex items-center justify-center text-2xl">✨</div>
          </div>
          <div>
            <h2 className="text-[20px] font-bold text-primary">Building your routine</h2>
            <p className="text-[13px] text-secondary mt-1">AI is crafting habits that fit your life...</p>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'preview') {
    return (
      <div className="min-h-dvh flex flex-col px-5 py-8 bg-[var(--color-bg)]">
        <div className="max-w-sm mx-auto w-full space-y-5 anim-fade-up">
          <div className="text-center">
            <span className="text-4xl">🎉</span>
            <h1 className="text-[24px] font-bold text-primary mt-3">Your routine is ready!</h1>
            <p className="text-[13px] text-secondary mt-1">
              Here's what the AI built for you. You can edit anything later.
            </p>
          </div>

          <div className="space-y-2 stagger-children max-h-[50dvh] overflow-y-auto">
            {generatedHabits.map((habit, i) => (
              <div key={i} className="solid-card p-3.5 flex items-center gap-3">
                <span className="text-xl">{habit.icon || '✅'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-primary truncate">{habit.name}</p>
                  <p className="text-[12px] text-secondary">
                    {habit.scheduled_time} · {habit.duration_mins}min
                  </p>
                </div>
                <span className={cn(
                  'text-[10px] px-2 py-0.5 rounded-pill font-medium',
                  `cat-${habit.category}`
                )}>
                  {habit.category}
                </span>
              </div>
            ))}
          </div>

          <Button fullWidth size="lg" onClick={handleFinish}>
            Let's start 🚀
          </Button>
        </div>
      </div>
    );
  }

  return null;
}