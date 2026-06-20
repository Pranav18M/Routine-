'use client';

const catClass = { health:'cat-health', study:'cat-study', skill:'cat-skill', mindfulness:'cat-mindfulness', personal:'cat-personal' };

function HabitBar({ habit }) {
  const { name, category, pct } = habit;
  const color = pct >= 80 ? '#10B981' : pct >= 50 ? '#6C47FF' : '#F59E0B';
  return (
    <div style={{ display:'flex', alignItems:'center', gap:12, padding:'8px 0' }}>
      <span className={'pill ' + (catClass[category]||'cat-personal')} style={{ flexShrink:0 }}>{category[0].toUpperCase()}</span>
      <div style={{ flex:1, minWidth:0 }}>
        <p style={{ fontSize:13, fontWeight:500, color:'#F4F4F8', margin:'0 0 4px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{name}</p>
        <div style={{ height:6, background:'#252540', borderRadius:50, overflow:'hidden' }}>
          <div style={{ height:'100%', borderRadius:50, transition:'width 0.7s', width:`${pct}%`, background:color }} />
        </div>
      </div>
      <span style={{ fontSize:13, fontWeight:700, color, flexShrink:0 }}>{pct}%</span>
    </div>
  );
}

export default function PatternGrid({ habitData = [] }) {
  if (!habitData.length) {
    return <div style={{ textAlign:'center', padding:'32px 0', color:'#9B9BB4', fontSize:13 }}>Log habits for 7+ days to see patterns</div>;
  }
  const sorted = [...habitData].sort((a,b) => b.pct - a.pct);
  return (
    <div>
      {sorted.map((habit, i) => (
        <div key={i} style={{ borderBottom: i < sorted.length-1 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
          <HabitBar habit={habit} />
        </div>
      ))}
    </div>
  );
}
