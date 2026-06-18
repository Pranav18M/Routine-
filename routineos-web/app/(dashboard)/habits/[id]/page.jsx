'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { habitsApi } from '../../../../lib/api';
import { logsApi } from '../../../../lib/api';
import Header from '../../../../components/layout/Header';
import PageWrapper from '../../../../components/layout/PageWrapper';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import { Skeleton } from '../../../../components/ui/LoadingSkeleton';
import { getCategoryClass, formatTime, formatDuration, getDayName, cn } from '../../../../lib/utils';
import useStore from '../../../../store/useStore';

function MiniCalendar({ logs }) {
  const today = new Date().toLocaleDateString('en-CA');
  const days = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toLocaleDateString('en-CA'));
  }

  const logMap = {};
  for (const log of (logs || [])) logMap[log.date] = log.status;

  return (
    <div className="grid grid-cols-10 gap-1">
      {days.map(date => {
        const status = logMap[date];
        const isToday = date === today;
        return (
          <div
            key={date}
            title={date}
            className={cn(
              'w-full aspect-square rounded-[4px] transition-all',
              isToday && 'ring-1 ring-[#6C47FF]',
              status === 'completed' ? 'bg-[#10B981]' :
              status === 'micro' ? 'bg-[#A78BFA]' :
              status === 'skipped' ? 'bg-[#F59E0B] opacity-50' :
              'bg-[var(--color-elevated)]',
            )}
          />
        );
      })}
    </div>
  );
}

export default function HabitDetailPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const { addToast } = useStore();
  const [habit, setHabit] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generatingMicro, setGeneratingMicro] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [habitRes, logsRes] = await Promise.all([
          habitsApi.getById(id),
          logsApi.getRange(
            new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-CA'),
            new Date().toLocaleDateString('en-CA'),
            id,
          ),
        ]);
        setHabit(habitRes.data);
        setLogs(logsRes.data || []);
      } catch {
        router.push('/habits');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, router]);

  const handleGenerateMicro = async () => {
    setGeneratingMicro(true);
    try {
      const res = await habitsApi.suggestMicro(id);
      setHabit(prev => ({ ...prev, micro_version: res.data?.microVersion }));
      addToast({ type: 'success', message: 'Micro habit generated!' });
    } catch {
      addToast({ type: 'error', message: 'Could not generate micro habit' });
    } finally {
      setGeneratingMicro(false);
    }
  };

  const completedCount = logs.filter(l => l.status === 'completed' || l.status === 'micro').length;
  const completionPct = logs.length > 0 ? Math.round((completedCount / logs.length) * 100) : 0;

  if (loading) {
    return (
      <>
        <Header title="Habit Detail" />
        <PageWrapper>
          <div className="space-y-4">
            <Skeleton className="h-28 rounded-[16px]" />
            <Skeleton className="h-24 rounded-[16px]" />
            <Skeleton className="h-48 rounded-[16px]" />
          </div>
        </PageWrapper>
      </>
    );
  }

  if (!habit) return null;

  return (
    <>
      <Header
        title={habit.name}
        rightAction={
          <button
            onClick={() => router.back()}
            className="text-[13px] text-secondary px-3 py-1.5 rounded-[10px] bg-[var(--color-elevated)]"
          >
            ← Back
          </button>
        }
      />

      <PageWrapper>
        <div className="space-y-4 stagger-children">
          {/* Habit info card */}
          <div className="solid-card p-5">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-[16px] bg-[var(--color-elevated)] flex items-center justify-center text-2xl shrink-0">
                {habit.icon || '✅'}
              </div>
              <div className="flex-1">
                <h1 className="text-[20px] font-bold text-primary">{habit.name}</h1>
                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                  <span className={cn('text-[12px] px-2.5 py-0.5 rounded-pill font-semibold', getCategoryClass(habit.category))}>
                    {habit.category}
                  </span>
                  {habit.scheduled_time && (
                    <span className="text-[13px] text-secondary">{formatTime(habit.scheduled_time)}</span>
                  )}
                  <span className="text-[13px] text-muted">{formatDuration(habit.duration_mins)}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                { label: 'Completed', value: completedCount, color: '#10B981' },
                { label: 'Total logged', value: logs.length, color: '#6C47FF' },
                { label: 'Success rate', value: `${completionPct}%`, color: '#A78BFA' },
              ].map(stat => (
                <div key={stat.label} className="bg-[var(--color-elevated)] rounded-[12px] p-3 text-center">
                  <p className="text-[20px] font-bold" style={{ color: stat.color }}>{stat.value}</p>
                  <p className="text-[11px] text-secondary mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Micro habit */}
          <div className="solid-card p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[14px] font-semibold text-primary">⚡ Micro version</p>
              {!habit.micro_version && (
                <Button size="sm" variant="secondary" onClick={handleGenerateMicro} loading={generatingMicro}>
                  Generate
                </Button>
              )}
            </div>
            {habit.micro_version ? (
              <p className="text-[14px] text-secondary leading-relaxed">{habit.micro_version}</p>
            ) : (
              <p className="text-[13px] text-muted">
                Generate a 2-minute version for tough days when the full habit feels too much.
              </p>
            )}
          </div>

          {/* 30-day calendar */}
          <div className="solid-card p-4">
            <p className="text-[14px] font-semibold text-primary mb-3">Last 30 days</p>
            <MiniCalendar logs={logs} />
            <div className="flex items-center gap-4 mt-3">
              {[
                { color: '#10B981', label: 'Completed' },
                { color: '#A78BFA', label: 'Micro' },
                { color: '#F59E0B', label: 'Skipped', opacity: 0.5 },
                { color: 'var(--color-elevated)', label: 'No log' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-[3px]" style={{ background: item.color, opacity: item.opacity || 1 }} />
                  <span className="text-[11px] text-muted">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Modes */}
          <div className="solid-card p-4">
            <p className="text-[14px] font-semibold text-primary mb-2">Active in modes</p>
            <div className="flex flex-wrap gap-1.5">
              {(habit.active_modes || []).map(mode => (
                <span key={mode} className="px-3 py-1 rounded-pill text-[12px] font-semibold
                  bg-[rgba(108,71,255,0.15)] text-[#A78BFA]">
                  {mode}
                </span>
              ))}
            </div>
          </div>
        </div>
      </PageWrapper>
    </>
  );
}