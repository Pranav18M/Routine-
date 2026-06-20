'use client';
import { useState } from 'react';
import BottomSheet from '../ui/BottomSheet';
import Button from '../ui/Button';

const catClass = { health:'cat-health', study:'cat-study', skill:'cat-skill', mindfulness:'cat-mindfulness', personal:'cat-personal' };
const moods = [
  { value:1, emoji:'😩', label:'Rough' },
  { value:2, emoji:'😕', label:'Meh' },
  { value:3, emoji:'😐', label:'Okay' },
  { value:4, emoji:'🙂', label:'Good' },
  { value:5, emoji:'😄', label:'Great' },
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
      <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12, padding:12, borderRadius:12, background:'#252540' }}>
          <span style={{ fontSize:24 }}>{habit.icon || '✅'}</span>
          <div>
            <span className={'pill ' + (catClass[habit.category]||'cat-personal')}>{habit.category}</span>
            {habit.micro_version && <p style={{ fontSize:12, color:'#9B9BB4', marginTop:4 }}>Micro: {habit.micro_version}</p>}
          </div>
        </div>

        <div>
          <p style={{ fontSize:13, fontWeight:600, color:'#9B9BB4', marginBottom:12 }}>How are you feeling? (optional)</p>
          <div style={{ display:'flex', justifyContent:'space-between' }}>
            {moods.map(mood => (
              <button key={mood.value} onClick={() => setSelectedMood(p => p === mood.value ? null : mood.value)}
                style={{
                  display:'flex', flexDirection:'column', alignItems:'center', gap:4, padding:8, borderRadius:12, flex:1, margin:'0 2px',
                  border:'none', cursor:'pointer', transition:'all 0.15s',
                  background: selectedMood === mood.value ? 'rgba(108,71,255,0.2)' : '#252540',
                  transform: selectedMood === mood.value ? 'scale(1.05)' : 'scale(1)',
                }}>
                <span style={{ fontSize:20 }}>{mood.emoji}</span>
                <span style={{ fontSize:10, color:'#9B9BB4' }}>{mood.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="field-label">Add a note (optional)</label>
          <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="How did it go?" maxLength={200} rows={2} className="field-textarea" />
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          <Button fullWidth onClick={() => handleLog('completed')} loading={loading} size="lg">✓ Mark Complete</Button>
          {habit.micro_version && (
            <Button fullWidth variant="secondary" onClick={() => handleLog('micro')} disabled={loading}>⚡ Do Micro Version</Button>
          )}
          <Button fullWidth variant="ghost" onClick={() => handleLog('skipped')} disabled={loading}>Skip for today</Button>
        </div>
      </div>
    </BottomSheet>
  );
}
