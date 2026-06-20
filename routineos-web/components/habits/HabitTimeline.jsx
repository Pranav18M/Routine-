'use client';
import { useMemo } from 'react';
import HabitCard from './HabitCard';

function getTimeSlot(timeStr) {
  if (!timeStr) return 'anytime';
  const [h] = timeStr.split(':').map(Number);
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

const slotConfig = [
  { key: 'morning', label: '🌅 Morning' },
  { key: 'afternoon', label: '☀️ Afternoon' },
  { key: 'evening', label: '🌙 Evening' },
  { key: 'anytime', label: '⏰ Flexible' },
];

export default function HabitTimeline({ habits, logs, onComplete, onMicro, onPress }) {
  const grouped = useMemo(() => {
    const slots = { morning: [], afternoon: [], evening: [], anytime: [] };
    for (const habit of (habits || [])) slots[getTimeSlot(habit.scheduled_time)].push(habit);
    return slots;
  }, [habits]);

  if (!habits?.length) {
    return (
      <div style={{ textAlign:'center', padding:'48px 0' }}>
        <p style={{ fontSize:36, marginBottom:12 }}>📭</p>
        <p style={{ fontSize:15, fontWeight:600, color:'#F4F4F8', margin:0 }}>No habits scheduled</p>
        <p style={{ fontSize:13, color:'#9B9BB4', marginTop:4 }}>Add habits in the Habits tab to get started</p>
      </div>
    );
  }

  return (
    <div className="stagger" style={{ display:'flex', flexDirection:'column', gap:24 }}>
      {slotConfig.map(({ key, label }) => {
        const slotHabits = grouped[key];
        if (!slotHabits?.length) return null;
        return (
          <section key={key}>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:8 }}>
              <span style={{ fontSize:11, fontWeight:700, color:'#5C5C78', textTransform:'uppercase', letterSpacing:'0.08em', flexShrink:0 }}>{label}</span>
              <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.08)' }} />
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {slotHabits.map(habit => (
                <HabitCard key={habit.id} habit={habit} log={logs?.[habit.id]} onComplete={onComplete} onMicro={onMicro} onPress={onPress} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
