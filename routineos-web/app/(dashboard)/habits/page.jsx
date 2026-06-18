'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../../components/layout/Header';
import PageWrapper from '../../../components/layout/PageWrapper';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import { HabitCardSkeleton } from '../../../components/ui/LoadingSkeleton';
import { useHabits } from '../../../hooks/useHabits';
import { getCategoryClass, formatTime, formatDuration, cn } from '../../../lib/utils';

const CATEGORIES = ['health', 'study', 'skill', 'mindfulness', 'personal'];
const MODES = ['normal', 'grind', 'exam', 'travel', 'sick'];
const CATEGORY_EMOJIS = { health: '💪', study: '📚', skill: '🎯', mindfulness: '🧘', personal: '✨' };

function HabitRow({ habit, onPress, onDelete }) {
  return (
    <div
      className="solid-card p-4 flex items-center gap-3 cursor-pointer active:scale-[0.98] transition-transform"
      onClick={() => onPress(habit)}
    >
      <div className="w-11 h-11 rounded-[12px] bg-[var(--color-elevated)] flex items-center justify-center text-xl shrink-0">
        {habit.icon || CATEGORY_EMOJIS[habit.category] || '✅'}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-semibold text-primary truncate">{habit.name}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className={cn('text-[11px] px-2 py-0.5 rounded-pill font-medium', getCategoryClass(habit.category))}>
            {habit.category}
          </span>
          {habit.scheduled_time && (
            <span className="text-[12px] text-secondary">{formatTime(habit.scheduled_time)}</span>
          )}
          <span className="text-[12px] text-muted">{formatDuration(habit.duration_mins)}</span>
        </div>
      </div>
      <button
        onClick={e => { e.stopPropagation(); onDelete(habit.id); }}
        className="w-8 h-8 flex items-center justify-center rounded-full text-muted
          hover:bg-[rgba(239,68,68,0.15)] hover:text-[#EF4444] transition-all"
      >
        ✕
      </button>
    </div>
  );
}

function HabitForm({ initial, onSave, onClose, saving }) {
  const [form, setForm] = useState({
    name: '',
    category: 'health',
    icon: '',
    scheduled_time: '',
    duration_mins: 30,
    active_modes: ['normal'],
    ...initial,
  });

  const toggle = (field, val) =>
    setForm(f => ({
      ...f,
      [field]: f[field].includes(val) ? f[field].filter(v => v !== val) : [...f[field], val],
    }));

  const valid = form.name.trim().length > 0;

  return (
    <div className="space-y-4">
      <input
        placeholder="Habit name *"
        value={form.name}
        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
        maxLength={60}
        className="w-full bg-[var(--color-elevated)] border border-[var(--color-border)]
          rounded-[12px] px-4 py-3 text-[15px] text-primary placeholder:text-muted
          focus:outline-none focus:border-[#6C47FF] transition-colors"
      />

      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-[12px] text-secondary mb-1.5">Category</p>
          <select
            value={form.category}
            onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            className="w-full bg-[var(--color-elevated)] border border-[var(--color-border)]
              rounded-[10px] px-3 py-2.5 text-[14px] text-primary focus:outline-none focus:border-[#6C47FF]"
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <p className="text-[12px] text-secondary mb-1.5">Duration (min)</p>
          <input
            type="number"
            min={1}
            max={240}
            value={form.duration_mins}
            onChange={e => setForm(f => ({ ...f, duration_mins: parseInt(e.target.value) || 30 }))}
            className="w-full bg-[var(--color-elevated)] border border-[var(--color-border)]
              rounded-[10px] px-3 py-2.5 text-[14px] text-primary focus:outline-none focus:border-[#6C47FF]"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-[12px] text-secondary mb-1.5">Time (optional)</p>
          <input
            type="time"
            value={form.scheduled_time}
            onChange={e => setForm(f => ({ ...f, scheduled_time: e.target.value }))}
            className="w-full bg-[var(--color-elevated)] border border-[var(--color-border)]
              rounded-[10px] px-3 py-2.5 text-[14px] text-primary focus:outline-none focus:border-[#6C47FF]"
          />
        </div>
        <div>
          <p className="text-[12px] text-secondary mb-1.5">Icon (emoji)</p>
          <input
            placeholder="✅"
            value={form.icon}
            onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}
            maxLength={2}
            className="w-full bg-[var(--color-elevated)] border border-[var(--color-border)]
              rounded-[10px] px-3 py-2.5 text-[18px] text-center focus:outline-none focus:border-[#6C47FF]"
          />
        </div>
      </div>

      <div>
        <p className="text-[12px] text-secondary mb-2">Active in modes</p>
        <div className="flex flex-wrap gap-1.5">
          {MODES.map(m => (
            <button
              key={m}
              onClick={() => toggle('active_modes', m)}
              className={cn(
                'px-3 py-1.5 rounded-pill text-[12px] font-semibold transition-all',
                form.active_modes.includes(m)
                  ? 'bg-[#6C47FF] text-white'
                  : 'bg-[var(--color-elevated)] text-secondary',
              )}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <Button variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
        <Button onClick={() => onSave(form)} disabled={!valid} loading={saving} className="flex-1">
          {initial?.id ? 'Save changes' : 'Add habit'}
        </Button>
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
    if (editHabit?.id) {
      await updateHabit(editHabit.id, form);
    } else {
      await createHabit(form);
    }
    setSaving(false);
    setModalOpen(false);
    setEditHabit(null);
  };

  const handlePress = (habit) => {
    router.push(`/habits/${habit.id}`);
  };

  const filtered = filter === 'all'
    ? habits
    : habits.filter(h => h.category === filter);

  return (
    <>
      <Header
        title="My Habits"
        subtitle={`${habits.length} habit${habits.length !== 1 ? 's' : ''} in your routine`}
        rightAction={
          <Button
            size="sm"
            onClick={() => { setEditHabit(null); setModalOpen(true); }}
          >
            + Add
          </Button>
        }
      />

      <PageWrapper>
        <div className="space-y-4">
          {/* Category filter */}
          <div className="flex gap-2 overflow-x-auto pb-1 no-select">
            {['all', ...CATEGORIES].map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={cn(
                  'px-3 py-1.5 rounded-pill text-[12px] font-semibold whitespace-nowrap transition-all shrink-0',
                  filter === cat
                    ? 'bg-[#6C47FF] text-white'
                    : 'bg-[var(--color-elevated)] text-secondary',
                )}
              >
                {cat === 'all' ? 'All' : cat}
              </button>
            ))}
          </div>

          {/* Habit list */}
          {loading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => <HabitCardSkeleton key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">📝</p>
              <p className="text-[16px] font-semibold text-primary">No habits yet</p>
              <p className="text-[13px] text-secondary mt-1 mb-5">
                {filter === 'all' ? 'Add your first habit to get started' : `No ${filter} habits yet`}
              </p>
              {filter === 'all' && (
                <Button onClick={() => setModalOpen(true)}>+ Add your first habit</Button>
              )}
            </div>
          ) : (
            <div className="space-y-2 stagger-children">
              {filtered.map(habit => (
                <HabitRow
                  key={habit.id}
                  habit={habit}
                  onPress={handlePress}
                  onDelete={deleteHabit}
                />
              ))}
            </div>
          )}
        </div>
      </PageWrapper>

      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditHabit(null); }}
        title={editHabit ? 'Edit habit' : 'New habit'}
      >
        <HabitForm
          initial={editHabit}
          onSave={handleSave}
          onClose={() => { setModalOpen(false); setEditHabit(null); }}
          saving={saving}
        />
      </Modal>
    </>
  );
}