'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { userApi } from '../../../lib/api';
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

const styleTag = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  * { box-sizing: border-box; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  @keyframes spin { to { transform: rotate(360deg); } }
  .ob-page { min-height:100vh; background:#0F0F1A; padding:32px 20px; font-family:'Inter',system-ui,sans-serif; color:#F4F4F8; }
  .ob-wrap { max-width:420px; margin:0 auto; display:flex; flex-direction:column; gap:24px; animation:fadeUp 0.4s ease-out; }
  .ob-step { font-size:12px; font-weight:700; color:#A78BFA; text-transform:uppercase; letter-spacing:0.06em; }
  .ob-title { font-size:26px; font-weight:800; margin-top:8px; line-height:1.25; }
  .ob-sub { font-size:14px; color:#9B9BB4; margin-top:8px; line-height:1.5; }
  .ob-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
  .ob-goal { display:flex; flex-direction:column; align-items:flex-start; gap:8px; padding:16px; border-radius:16px; text-align:left; cursor:pointer; border:2px solid transparent; background:#252540; transition:all 0.2s; font-family:'Inter',system-ui,sans-serif; }
  .ob-goal:hover:not(.maxed) { border-color:rgba(255,255,255,0.12); }
  .ob-goal.selected { background:rgba(108,71,255,0.2); border-color:#6C47FF; }
  .ob-goal.maxed { opacity:0.4; cursor:not-allowed; }
  .ob-goal-emoji { font-size:24px; }
  .ob-goal-label { font-size:13px; font-weight:600; line-height:1.35; color:#F4F4F8; }
  .ob-goal-check { font-size:10px; font-weight:700; color:#6C47FF; }
  .ob-btn { width:100%; padding:16px; font-size:16px; font-weight:700; border-radius:12px; border:none; cursor:pointer; background:linear-gradient(135deg,#6C47FF,#8B6FFF); color:#fff; font-family:'Inter',system-ui,sans-serif; box-shadow:0 4px 20px rgba(108,71,255,0.4); transition:all 0.2s; display:flex; align-items:center; justify-content:center; gap:8px; }
  .ob-btn:disabled { background:#3A3A5C; box-shadow:none; cursor:not-allowed; }
  .ob-btn:hover:not(:disabled) { transform:translateY(-1px); }
  .ob-back { background:none; border:none; color:#9B9BB4; font-size:13px; cursor:pointer; display:flex; align-items:center; gap:4px; padding:0; margin-bottom:8px; font-family:'Inter',system-ui,sans-serif; }
  .ob-card { background:#1A1A2E; border:1px solid rgba(255,255,255,0.08); border-radius:16px; padding:16px; display:flex; flex-direction:column; gap:16px; }
  .ob-row { display:flex; align-items:center; justify-content:space-between; }
  .ob-row-label { font-size:14px; font-weight:600; color:#F4F4F8; }
  .ob-row-sub { font-size:12px; color:#9B9BB4; margin-top:2px; }
  .ob-time-input { background:#252540; border:1px solid rgba(255,255,255,0.08); border-radius:10px; padding:8px 12px; font-size:15px; font-weight:600; color:#F4F4F8; font-family:'Inter',system-ui,sans-serif; }
  .ob-textarea { width:100%; background:#252540; border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:12px 16px; font-size:14px; color:#F4F4F8; resize:none; font-family:'Inter',system-ui,sans-serif; outline:none; }
  .ob-textarea:focus { border-color:#6C47FF; }
  .ob-textarea::placeholder { color:#5C5C78; }
  .ob-label-sm { font-size:14px; font-weight:600; margin-bottom:8px; }
  .ob-center { display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:100vh; text-align:center; gap:20px; }
  .ob-spinner-lg { width:64px; height:64px; border:4px solid #6C47FF; border-top:4px solid transparent; border-radius:50%; animation:spin 0.9s linear infinite; position:relative; }
  .ob-spinner-emoji { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font-size:22px; }
  .ob-gen-title { font-size:20px; font-weight:700; }
  .ob-gen-sub { font-size:13px; color:#9B9BB4; margin-top:4px; }
  .ob-preview-list { display:flex; flex-direction:column; gap:8px; max-height:50vh; overflow-y:auto; }
  .ob-habit-row { background:#1A1A2E; border:1px solid rgba(255,255,255,0.08); border-radius:14px; padding:14px; display:flex; align-items:center; gap:12px; }
  .ob-habit-emoji { font-size:20px; }
  .ob-habit-name { font-size:14px; font-weight:600; color:#F4F4F8; }
  .ob-habit-meta { font-size:12px; color:#9B9BB4; margin-top:2px; }
  .ob-habit-cat { font-size:10px; padding:3px 8px; border-radius:50px; font-weight:600; background:rgba(167,139,250,0.15); color:#A78BFA; white-space:nowrap; }
`;

export default function OnboardingPage() {
  const router = useRouter();
  const { addToast } = useStore();
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
      <>
        <style>{styleTag}</style>
        <div className="ob-page">
          <div className="ob-wrap">
            <div>
              <p className="ob-step">Step 1 of 2</p>
              <h1 className="ob-title">What do you want to focus on?</h1>
              <p className="ob-sub">Pick up to 3 goals. Your AI routine will be built around these.</p>
            </div>

            <div className="ob-grid">
              {GOALS.map(goal => {
                const selected = selectedGoals.includes(goal.key);
                const maxed = selectedGoals.length === 3 && !selected;
                return (
                  <button
                    key={goal.key}
                    onClick={() => toggleGoal(goal.key)}
                    disabled={maxed}
                    className={'ob-goal' + (selected ? ' selected' : '') + (maxed ? ' maxed' : '')}
                  >
                    <span className="ob-goal-emoji">{goal.emoji}</span>
                    <span className="ob-goal-label">{goal.label}</span>
                    {selected && <span className="ob-goal-check">✓ Selected</span>}
                  </button>
                );
              })}
            </div>

            <button
              className="ob-btn"
              disabled={selectedGoals.length === 0}
              onClick={() => setStep('schedule')}
            >
              Continue → ({selectedGoals.length}/3 selected)
            </button>
          </div>
        </div>
      </>
    );
  }

  if (step === 'schedule') {
    return (
      <>
        <style>{styleTag}</style>
        <div className="ob-page">
          <div className="ob-wrap">
            <div>
              <button onClick={() => setStep('goals')} className="ob-back">← Back</button>
              <p className="ob-step">Step 2 of 2</p>
              <h1 className="ob-title">Tell us about your day</h1>
              <p className="ob-sub">This helps the AI schedule habits in realistic time slots.</p>
            </div>

            <div className="ob-card">
              <div className="ob-row">
                <div>
                  <p className="ob-row-label">Wake up time</p>
                  <p className="ob-row-sub">When do you usually get up?</p>
                </div>
                <input
                  type="time"
                  value={wakeTime}
                  onChange={e => setWakeTime(e.target.value)}
                  className="ob-time-input"
                />
              </div>
              <div className="ob-row">
                <div>
                  <p className="ob-row-label">Sleep time</p>
                  <p className="ob-row-sub">Ideal bedtime?</p>
                </div>
                <input
                  type="time"
                  value={sleepTime}
                  onChange={e => setSleepTime(e.target.value)}
                  className="ob-time-input"
                />
              </div>
            </div>

            <div>
              <p className="ob-label-sm">Work / College schedule (optional)</p>
              <textarea
                value={workSchedule}
                onChange={e => setWorkSchedule(e.target.value)}
                placeholder="e.g. College 9am–5pm weekdays, work from home Thursdays"
                rows={3}
                className="ob-textarea"
              />
            </div>

            <button className="ob-btn" onClick={handleGenerateRoutine} disabled={loading}>
              ✨ Generate my AI routine
            </button>
          </div>
        </div>
      </>
    );
  }

  if (step === 'generating') {
    return (
      <>
        <style>{styleTag}</style>
        <div className="ob-page">
          <div className="ob-center">
            <div className="ob-spinner-lg">
              <span className="ob-spinner-emoji">✨</span>
            </div>
            <div>
              <h2 className="ob-gen-title">Building your routine</h2>
              <p className="ob-gen-sub">AI is crafting habits that fit your life...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (step === 'preview') {
    return (
      <>
        <style>{styleTag}</style>
        <div className="ob-page">
          <div className="ob-wrap">
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '40px' }}>🎉</span>
              <h1 className="ob-title" style={{ marginTop: '12px' }}>Your routine is ready!</h1>
              <p className="ob-sub">Here's what the AI built for you. You can edit anything later.</p>
            </div>

            <div className="ob-preview-list">
              {generatedHabits.map((habit, i) => (
                <div key={i} className="ob-habit-row">
                  <span className="ob-habit-emoji">{habit.icon || '✅'}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p className="ob-habit-name">{habit.name}</p>
                    <p className="ob-habit-meta">{habit.scheduled_time} · {habit.duration_mins}min</p>
                  </div>
                  <span className="ob-habit-cat">{habit.category}</span>
                </div>
              ))}
            </div>

            <button className="ob-btn" onClick={handleFinish}>
              Let's start 🚀
            </button>
          </div>
        </div>
      </>
    );
  }

  return null;
}