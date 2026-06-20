'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { habitsApi, logsApi } from '../../../../lib/api';
import Header from '../../../../components/layout/Header';
import PageWrapper from '../../../../components/layout/PageWrapper';
import Button from '../../../../components/ui/Button';
import { Skeleton } from '../../../../components/ui/LoadingSkeleton';
import useStore from '../../../../store/useStore';

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

function MiniCalendar({ logs }) {
  const today = new Date().toLocaleDateString('en-CA');
  const days = [];
  for (let i = 29; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate()-i); days.push(d.toLocaleDateString('en-CA')); }
  const logMap = {}; for (const log of (logs||[])) logMap[log.date] = log.status;

  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(10, 1fr)', gap:4 }}>
      {days.map(date => {
        const status = logMap[date];
        const isToday = date === today;
        const color = status === 'completed' ? '#10B981' : status === 'micro' ? '#A78BFA' : status === 'skipped' ? '#F59E0B' : '#252540';
        const opacity = status === 'skipped' ? 0.5 : 1;
        return <div key={date} title={date} style={{ aspectRatio:'1', borderRadius:4, background:color, opacity, outline: isToday ? '1px solid #6C47FF' : 'none' }} />;
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
          logsApi.getRange(new Date(Date.now()-30*24*60*60*1000).toLocaleDateString('en-CA'), new Date().toLocaleDateString('en-CA'), id),
        ]);
        setHabit(habitRes.data);
        setLogs(logsRes.data || []);
      } catch { router.push('/habits'); }
      finally { setLoading(false); }
    };
    load();
  }, [id, router]);

  const handleGenerateMicro = async () => {
    setGeneratingMicro(true);
    try {
      const res = await habitsApi.suggestMicro(id);
      setHabit(prev => ({ ...prev, micro_version: res.data?.microVersion }));
      addToast({ type:'success', message:'Micro habit generated!' });
    } catch { addToast({ type:'error', message:'Could not generate micro habit' }); }
    finally { setGeneratingMicro(false); }
  };

  const completedCount = logs.filter(l => l.status === 'completed' || l.status === 'micro').length;
  const completionPct = logs.length > 0 ? Math.round((completedCount/logs.length)*100) : 0;

  if (loading) {
    return (
      <>
        <Header title="Habit Detail" />
        <PageWrapper>
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <Skeleton style={{ height:112, borderRadius:16 }} />
            <Skeleton style={{ height:96, borderRadius:16 }} />
            <Skeleton style={{ height:192, borderRadius:16 }} />
          </div>
        </PageWrapper>
      </>
    );
  }
  if (!habit) return null;

  return (
    <>
      <Header title={habit.name} rightAction={
        <button onClick={() => router.back()} style={{ fontSize:13, color:'#9B9BB4', padding:'6px 12px', borderRadius:10, background:'#252540', border:'none', cursor:'pointer' }}>← Back</button>
      } />

      <PageWrapper>
        <div className="stagger" style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div className="card card-pad">
            <div style={{ display:'flex', alignItems:'flex-start', gap:16 }}>
              <div style={{ width:56, height:56, borderRadius:16, background:'#252540', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, flexShrink:0 }}>{habit.icon || '✅'}</div>
              <div style={{ flex:1 }}>
                <h1 style={{ fontSize:20, fontWeight:700, color:'#F4F4F8', margin:0 }}>{habit.name}</h1>
                <div style={{ display:'flex', flexWrap:'wrap', alignItems:'center', gap:8, marginTop:6 }}>
                  <span className={'pill ' + (catClass[habit.category]||'cat-personal')}>{habit.category}</span>
                  {habit.scheduled_time && <span style={{ fontSize:13, color:'#9B9BB4' }}>{formatTime(habit.scheduled_time)}</span>}
                  <span style={{ fontSize:13, color:'#5C5C78' }}>{formatDuration(habit.duration_mins)}</span>
                </div>
              </div>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginTop:16 }}>
              {[
                { label:'Completed', value:completedCount, color:'#10B981' },
                { label:'Total logged', value:logs.length, color:'#6C47FF' },
                { label:'Success rate', value:`${completionPct}%`, color:'#A78BFA' },
              ].map(stat => (
                <div key={stat.label} style={{ background:'#252540', borderRadius:12, padding:12, textAlign:'center' }}>
                  <p style={{ fontSize:20, fontWeight:700, color:stat.color, margin:0 }}>{stat.value}</p>
                  <p style={{ fontSize:11, color:'#9B9BB4', margin:'2px 0 0' }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card card-pad">
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
              <p style={{ fontSize:14, fontWeight:600, color:'#F4F4F8', margin:0 }}>⚡ Micro version</p>
              {!habit.micro_version && <Button size="sm" variant="secondary" onClick={handleGenerateMicro} loading={generatingMicro}>Generate</Button>}
            </div>
            {habit.micro_version ? (
              <p style={{ fontSize:14, color:'#9B9BB4', lineHeight:1.6, margin:0 }}>{habit.micro_version}</p>
            ) : (
              <p style={{ fontSize:13, color:'#5C5C78', margin:0 }}>Generate a 2-minute version for tough days when the full habit feels too much.</p>
            )}
          </div>

          <div className="card card-pad">
            <p style={{ fontSize:14, fontWeight:600, color:'#F4F4F8', marginBottom:12 }}>Last 30 days</p>
            <MiniCalendar logs={logs} />
            <div style={{ display:'flex', alignItems:'center', gap:16, marginTop:12, flexWrap:'wrap' }}>
              {[['#10B981','Completed',1],['#A78BFA','Micro',1],['#F59E0B','Skipped',0.5],['#252540','No log',1]].map(([color,label,opacity]) => (
                <div key={label} style={{ display:'flex', alignItems:'center', gap:4 }}>
                  <div style={{ width:12, height:12, borderRadius:3, background:color, opacity }} />
                  <span style={{ fontSize:11, color:'#5C5C78' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card card-pad">
            <p style={{ fontSize:14, fontWeight:600, color:'#F4F4F8', marginBottom:8 }}>Active in modes</p>
            <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
              {(habit.active_modes||[]).map(mode => (
                <span key={mode} className="pill" style={{ background:'rgba(108,71,255,0.15)', color:'#A78BFA', padding:'4px 12px' }}>{mode}</span>
              ))}
            </div>
          </div>
        </div>
      </PageWrapper>
    </>
  );
}
