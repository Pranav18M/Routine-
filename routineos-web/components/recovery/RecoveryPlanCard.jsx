'use client';
import Button from '../ui/Button';
import { cn } from '../../lib/utils';

function DayPill({ day, habits, intensity }) {
  const colors = {
    1: { bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)', text: '#F59E0B', label: `Day 1 · ${intensity}%` },
    2: { bg: 'rgba(108,71,255,0.12)', border: 'rgba(108,71,255,0.3)', text: '#A78BFA', label: `Day 2 · ${intensity}%` },
    3: { bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)', text: '#10B981', label: `Day 3 · Full routine` },
  };
  const c = colors[day];

  return (
    <div className="p-4 rounded-[14px] border" style={{ background: c.bg, borderColor: c.border }}>
      <p className="text-[12px] font-bold mb-2" style={{ color: c.text }}>{c.label}</p>
      <div className="space-y-1">
        {habits.map((name, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: c.text }} />
            <p className="text-[13px] text-primary">{name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RecoveryPlanCard({ session, onComplete }) {
  if (!session) return null;

  const { recovery_plan: plan, reason } = session;

  return (
    <div className="solid-card p-5 space-y-4 anim-fade-up">
      <div>
        <p className="text-[12px] font-semibold text-[#A78BFA] uppercase tracking-wider mb-1">
          Recovery Plan Active
        </p>
        <h2 className="text-[20px] font-bold text-primary">Your comeback starts now</h2>
        {plan.message && (
          <p className="text-[13px] text-secondary mt-2 leading-relaxed">{plan.message}</p>
        )}
      </div>

      <div className="space-y-3">
        {plan.day1 && <DayPill day={1} habits={plan.day1} intensity={40} />}
        {plan.day2 && <DayPill day={2} habits={plan.day2} intensity={70} />}
        {plan.day3 && <DayPill day={3} habits={plan.day3} intensity={100} />}
      </div>

      <Button fullWidth variant="success" onClick={() => onComplete(session.id)}>
        I'm back — complete recovery 🎉
      </Button>
    </div>
  );
}