'use client';
import { useState } from 'react';

function formatTime(timeStr) {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const dh = h % 12 || 12;
  return `${dh}:${String(m).padStart(2,'0')} ${period}`;
}
function formatDuration(mins) {
  if (!mins) return '';
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins/60), m = mins%60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}
const catClass = { health:'cat-health', study:'cat-study', skill:'cat-skill', mindfulness:'cat-mindfulness', personal:'cat-personal' };

export default function HabitCard({ habit, log, onComplete, onMicro, onPress }) {
  const [animating, setAnimating] = useState(false);
  const status = log?.status;
  const isDone = status === 'completed' || status === 'micro';

  const handleComplete = async (e) => {
    e.stopPropagation();
    if (isDone) return;
    setAnimating(true);
    await onComplete?.(habit.id);
    setTimeout(() => setAnimating(false), 450);
  };

  return (
    <div
      onClick={() => onPress?.(habit)}
      className="card card-pad"
      style={{
        display:'flex', alignItems:'center', gap:12, cursor:'pointer',
        opacity: isDone ? 0.75 : 1, transition:'opacity 0.25s',
        animation: animating ? 'bounceCheck 0.45s cubic-bezier(0.36,0.07,0.19,0.97)' : undefined,
      }}
    >
      <div style={{
        width:44, height:44, borderRadius:12, flexShrink:0, fontSize:20,
        display:'flex', alignItems:'center', justifyContent:'center',
        background: isDone ? 'rgba(16,185,129,0.2)' : '#252540', transition:'background 0.3s',
      }}>
        {isDone ? '✓' : (habit.icon || '✅')}
      </div>

      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:2 }}>
          <p style={{
            fontSize:15, fontWeight:600, margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
            color: isDone ? '#9B9BB4' : '#F4F4F8', textDecoration: isDone ? 'line-through' : 'none',
          }}>
            {habit.name}
          </p>
          {habit.micro_version && !isDone && (
            <span className="pill" style={{ background:'rgba(167,139,250,0.15)', color:'#A78BFA', flexShrink:0 }}>micro</span>
          )}
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
          <span className={'pill ' + (catClass[habit.category]||'cat-personal')}>{habit.category}</span>
          {habit.scheduled_time && <span style={{ fontSize:12, color:'#9B9BB4' }}>{formatTime(habit.scheduled_time)}</span>}
          <span style={{ fontSize:12, color:'#5C5C78' }}>{formatDuration(habit.duration_mins)}</span>
        </div>
      </div>

      <div style={{ display:'flex', alignItems:'center', gap:6, flexShrink:0 }}>
        {!isDone && habit.micro_version && (
          <button onClick={(e) => { e.stopPropagation(); onMicro?.(habit); }} title="Do micro version"
            style={{ width:32, height:32, borderRadius:'50%', border:'none', cursor:'pointer', fontSize:11, fontWeight:700,
              background:'rgba(167,139,250,0.15)', color:'#A78BFA' }}>
            2m
          </button>
        )}
        <button onClick={handleComplete} disabled={isDone} aria-label={isDone ? 'Completed' : 'Mark complete'}
          style={{
            width:36, height:36, borderRadius:'50%', cursor: isDone ? 'default' : 'pointer',
            display:'flex', alignItems:'center', justifyContent:'center', fontSize:17, transition:'all 0.2s',
            background: isDone ? 'rgba(16,185,129,0.2)' : 'transparent',
            color: isDone ? '#10B981' : '#9B9BB4',
            border: isDone ? 'none' : '2px solid rgba(255,255,255,0.12)',
          }}>
          {isDone && '✓'}
        </button>
      </div>
    </div>
  );
}
