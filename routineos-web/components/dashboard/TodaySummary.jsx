'use client';

export default function TodaySummary({ completed, total }) {
  const pct = total > 0 ? Math.round((completed/total)*100) : 0;
  const remaining = total - completed;

  return (
    <div style={{ display:'flex', alignItems:'center', gap:12, padding:'0 4px' }}>
      <div style={{ flex:1, height:8, background:'#252540', borderRadius:50, overflow:'hidden' }}>
        <div style={{
          height:'100%', borderRadius:50, transition:'width 0.7s ease-out', width:`${pct}%`,
          background: pct === 100 ? '#10B981' : 'linear-gradient(90deg,#6C47FF,#A78BFA)',
        }} />
      </div>
      <div style={{ textAlign:'right', flexShrink:0 }}>
        <span style={{ fontSize:13, fontWeight:700, color:'#F4F4F8' }}>{completed}</span>
        <span style={{ fontSize:13, color:'#5C5C78' }}>/{total}</span>
        {remaining > 0 && <span style={{ fontSize:11, color:'#9B9BB4', marginLeft:8 }}>{remaining} left</span>}
      </div>
    </div>
  );
}
