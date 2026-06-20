'use client';
import { useState } from 'react';

const reasons = [
  { key: 'exam', emoji: '📚', label: 'Exams / Deadlines', desc: 'Study pressure took over' },
  { key: 'travel', emoji: '✈️', label: 'Travel', desc: 'Away from home routine' },
  { key: 'sick', emoji: '🤒', label: 'Sick / Unwell', desc: 'Body needed rest' },
  { key: 'other', emoji: '💭', label: 'Other', desc: 'Life just happened' },
];

const styleTag = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  * { box-sizing: border-box; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  @keyframes spin { to { transform: rotate(360deg); } }
  .rec-overlay { position:fixed; inset:0; z-index:90; background:#0F0F1A; display:flex; align-items:center; justify-content:center; padding:24px; font-family:'Inter',system-ui,sans-serif; }
  .rec-wrap { width:100%; max-width:380px; display:flex; flex-direction:column; gap:24px; animation:fadeUp 0.4s ease-out; }
  .rec-header { text-align:center; }
  .rec-emoji { font-size:48px; margin-bottom:16px; }
  .rec-title { font-size:24px; font-weight:800; color:#F4F4F8; margin:0; }
  .rec-sub { font-size:14px; color:#9B9BB4; line-height:1.6; margin-top:8px; }
  .rec-sub strong { color:#F4F4F8; }
  .rec-reasons { display:flex; flex-direction:column; gap:8px; }
  .rec-reason { display:flex; align-items:center; gap:16px; padding:16px; border-radius:16px; text-align:left; cursor:pointer; border:2px solid transparent; background:#1A1A2E; transition:all 0.2s; font-family:'Inter',system-ui,sans-serif; }
  .rec-reason:hover { border-color:rgba(255,255,255,0.12); }
  .rec-reason.selected { background:rgba(108,71,255,0.2); border-color:#6C47FF; }
  .rec-reason.locked { opacity:0.5; cursor:not-allowed; pointer-events:none; }
  .rec-reason-emoji { font-size:24px; }
  .rec-reason-label { font-size:15px; font-weight:600; color:#F4F4F8; margin:0; }
  .rec-reason-desc { font-size:12px; color:#9B9BB4; margin:2px 0 0; }
  .rec-reason-check { margin-left:auto; color:#6C47FF; font-weight:700; font-size:18px; }
  .rec-btn { width:100%; padding:16px; font-size:16px; font-weight:700; border-radius:12px; border:none; cursor:pointer; background:linear-gradient(135deg,#6C47FF,#8B6FFF); color:#fff; font-family:'Inter',system-ui,sans-serif; box-shadow:0 4px 20px rgba(108,71,255,0.4); transition:all 0.2s; display:flex; align-items:center; justify-content:center; gap:8px; }
  .rec-btn:disabled { background:#3A3A5C; box-shadow:none; cursor:not-allowed; }
  .rec-btn:hover:not(:disabled) { transform:translateY(-1px); }
  .rec-footer { text-align:center; font-size:11px; color:#5C5C78; transition:color 0.2s; }
  .rec-footer.waiting { color:#A78BFA; font-weight:600; }
  .rec-spinner { width:16px; height:16px; border:2px solid rgba(255,255,255,0.3); border-top:2px solid white; border-radius:50%; animation:spin 0.8s linear infinite; }
  @keyframes softPulse { 0%,100% { opacity:1; } 50% { opacity:0.55; } }
  .rec-footer.waiting { animation: softPulse 1.6s ease-in-out infinite; }
`;

export default function RecoveryScreen({ missedDays = 2, onGenerate, generating }) {
  const [selectedReason, setSelectedReason] = useState(null);

  return (
    <>
      <style>{styleTag}</style>
      <div className="rec-overlay">
        <div className="rec-wrap">
          <div className="rec-header">
            <div className="rec-emoji">💙</div>
            <h1 className="rec-title">Life happened.</h1>
            <p className="rec-sub">
              You missed <strong>{missedDays} day{missedDays > 1 ? 's' : ''}</strong> — no guilt here.
              Pick what got in the way and we'll build you a gentle comeback plan.
            </p>
          </div>

          <div className="rec-reasons">
            {reasons.map(r => (
              <button
                key={r.key}
                onClick={() => !generating && setSelectedReason(r.key)}
                className={'rec-reason' + (selectedReason === r.key ? ' selected' : '') + (generating ? ' locked' : '')}
              >
                <span className="rec-reason-emoji">{r.emoji}</span>
                <div>
                  <p className="rec-reason-label">{r.label}</p>
                  <p className="rec-reason-desc">{r.desc}</p>
                </div>
                {selectedReason === r.key && <span className="rec-reason-check">✓</span>}
              </button>
            ))}
          </div>

          <button
            className="rec-btn"
            disabled={!selectedReason || generating}
            onClick={() => onGenerate(selectedReason, missedDays)}
          >
            {generating && <span className="rec-spinner" />}
            {generating ? 'Building your plan…' : 'Build my 3-day comeback plan'}
          </button>

          <p className={'rec-footer' + (generating ? ' waiting' : '')}>
            {generating ? 'Hang tight, this takes a few seconds ✨' : 'No streaks broken. Just a fresh start.'}
          </p>
        </div>
      </div>
    </>
  );
}
