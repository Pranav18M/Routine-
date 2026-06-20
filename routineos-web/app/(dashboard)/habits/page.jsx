'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../../components/layout/Header';
import PageWrapper from '../../../components/layout/PageWrapper';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import { HabitCardSkeleton } from '../../../components/ui/LoadingSkeleton';
import { useHabits } from '../../../hooks/useHabits';

const CATEGORIES = ['health','study','skill','mindfulness','personal'];
const MODES = ['normal','grind','exam','travel','sick'];
const CATEGORY_EMOJIS = { health:'💪', study:'📚', skill:'🎯', mindfulness:'🧘', personal:'✨' };
const catClass = { health:'cat-health', study:'cat-study', skill:'cat-skill', mindfulness:'cat-mindfulness', personal:'cat-personal' };

function formatTime(timeStr) {
  if (!timeStr) return '';
  const [h,m] = timeStr.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  return `${h%12||12}:${String(m).padStart(2,'0')} ${period}`;
}
function formatDuration(mins) {
  if (!mins) return '';
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins/60), m = mins%60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function HabitRow({ habit, onPress, onDelete }) {
  return (
    <div onClick={() => onPress(habit)} className="card card-pad" style={{ display:'flex', alignItems:'center', gap:12, cursor:'pointer' }}>
      <div style={{ width:44, height:44, borderRadius:12, background:'#252540', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>
        {habit.icon || CATEGORY_EMOJIS[habit.category] || '✅'}
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <p style={{ fontSize:15, fontWeight:600, color:'#F4F4F8', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{habit.name}</p>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:2 }}>
          <span className={'pill ' + (catClass[habit.category]||'cat-personal')}>{habit.category}</span>
          {habit.scheduled_time && <span style={{ fontSize:12, color:'#9B9BB4' }}>{formatTime(habit.scheduled_time)}</span>}
          <span style={{ fontSize:12, color:'#5C5C78' }}>{formatDuration(habit.duration_mins)}</span>
        </div>
      </div>
      <button onClick={e => { e.stopPropagation(); onDelete(habit.id); }}
        style={{ width:32, height:32, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:'50%', color:'#5C5C78', background:'none', border:'none', cursor:'pointer' }}>✕</button>
    </div>
  );
}

function HabitForm({ initial, onSave, onClose, saving }) {
  const [form, setForm] = useState({ name:'', category:'health', icon:'', scheduled_time:'', duration_mins:30, active_modes:['normal'], ...initial });
  const toggle = (field, val) => setForm(f => ({ ...f, [field]: f[field].includes(val) ? f[field].filter(v=>v!==val) : [...f[field], val] }));
  const valid = form.name.trim().length > 0;

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
      <input placeholder="Habit name *" value={form.name} onChange={e => setForm(f=>({...f, name:e.target.value}))} maxLength={60} className="field-input" />

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
        <div>
          <label className="field-label">Category</label>
          <select value={form.category} onChange={e => setForm(f=>({...f, category:e.target.value}))} className="field-input">
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="field-label">Duration (min)</label>
          <input type="number" min={1} max={240} value={form.duration_mins} onChange={e => setForm(f=>({...f, duration_mins: parseInt(e.target.value)||30}))} className="field-input" />
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
        <div>
          <label className="field-label">Time (optional)</label>
          <input type="time" value={form.scheduled_time} onChange={e => setForm(f=>({...f, scheduled_time:e.target.value}))} className="field-input" />
        </div>
        <div>
          <label className="field-label">Icon (emoji)</label>
          <input placeholder="✅" value={form.icon} onChange={e => setForm(f=>({...f, icon:e.target.value}))} maxLength={2} className="field-input" style={{ textAlign:'center', fontSize:18 }} />
        </div>
      </div>

      <div>
        <label className="field-label" style={{ marginBottom:8 }}>Active in modes</label>
        <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
          {MODES.map(m => (
            <button key={m} onClick={() => toggle('active_modes', m)} style={{
              padding:'6px 12px', borderRadius:50, fontSize:12, fontWeight:600, border:'none', cursor:'pointer',
              background: form.active_modes.includes(m) ? '#6C47FF' : '#252540', color: form.active_modes.includes(m) ? '#fff' : '#9B9BB4',
            }}>{m}</button>
          ))}
        </div>
      </div>

      <div style={{ display:'flex', gap:8, paddingTop:8 }}>
        <Button variant="secondary" onClick={onClose} fullWidth>Cancel</Button>
        <Button onClick={() => onSave(form)} disabled={!valid} loading={saving} fullWidth>{initial?.id ? 'Save changes' : 'Add habit'}</Button>
      </div>
    </div>
  );
}

export default function HabitsPage() {
  const router = useRouter();
  const { habits, loading, fetchHabits, createHabit, updateHabit, deleteHabit } = useHabits();
  const [modalOpen, setModalOpen] = useState(false);
  const [editHabit, setEditHabit] = useState(null);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => { fetchHabits('all'); }, []);

  const handleSave = async (form) => {
    setSaving(true);
    if (editHabit?.id) await updateHabit(editHabit.id, form); else await createHabit(form);
    setSaving(false);
    setModalOpen(false);
    setEditHabit(null);
  };

  const filtered = filter === 'all' ? habits : habits.filter(h => h.category === filter);

  return (
    <>
      <Header title="My Habits" subtitle={`${habits.length} habit${habits.length!==1?'s':''} in your routine`}
        rightAction={<Button size="sm" onClick={() => { setEditHabit(null); setModalOpen(true); }}>+ Add</Button>} />

      <PageWrapper>
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div className="scroll-x">
            {['all', ...CATEGORIES].map(cat => (
              <button key={cat} onClick={() => setFilter(cat)} style={{
                padding:'6px 12px', borderRadius:50, fontSize:12, fontWeight:600, whiteSpace:'nowrap', flexShrink:0, border:'none', cursor:'pointer',
                background: filter === cat ? '#6C47FF' : '#252540', color: filter === cat ? '#fff' : '#9B9BB4',
              }}>{cat === 'all' ? 'All' : cat}</button>
            ))}
          </div>

          {loading ? (
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>{[...Array(5)].map((_,i) => <HabitCardSkeleton key={i} />)}</div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign:'center', padding:'64px 0' }}>
              <p style={{ fontSize:36, marginBottom:12 }}>📝</p>
              <p style={{ fontSize:16, fontWeight:600, color:'#F4F4F8', margin:0 }}>No habits yet</p>
              <p style={{ fontSize:13, color:'#9B9BB4', margin:'4px 0 20px' }}>{filter === 'all' ? 'Add your first habit to get started' : `No ${filter} habits yet`}</p>
              {filter === 'all' && <Button onClick={() => setModalOpen(true)}>+ Add your first habit</Button>}
            </div>
          ) : (
            <div className="stagger" style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {filtered.map(habit => (
                <HabitRow key={habit.id} habit={habit} onPress={(h) => router.push(`/habits/${h.id}`)} onDelete={deleteHabit} />
              ))}
            </div>
          )}
        </div>
      </PageWrapper>

      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditHabit(null); }} title={editHabit ? 'Edit habit' : 'New habit'}>
        <HabitForm initial={editHabit} onSave={handleSave} onClose={() => { setModalOpen(false); setEditHabit(null); }} saving={saving} />
      </Modal>
    </>
  );
}