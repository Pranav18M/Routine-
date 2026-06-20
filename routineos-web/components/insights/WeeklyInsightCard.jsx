'use client';

export default function WeeklyInsightCard({ insight }) {
  if (!insight) return null;
  const weekDate = new Date(insight.week_start + 'T00:00:00');
  const weekLabel = weekDate.toLocaleDateString('en-US', { month:'short', day:'numeric' });

  return (
    <div className="glass-card card-pad">
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:16 }}>
        <div>
          <p style={{ fontSize:11, fontWeight:600, color:'#A78BFA', textTransform:'uppercase', letterSpacing:'0.05em', margin:0 }}>Week of {weekLabel}</p>
          {insight.consistency_pct !== null && (
            <div style={{ display:'flex', alignItems:'baseline', gap:6, marginTop:8 }}>
              <span style={{ fontSize:22, fontWeight:700, color:'#F4F4F8' }}>{Math.round(insight.consistency_pct)}%</span>
              <span style={{ fontSize:12, color:'#9B9BB4' }}>completion</span>
            </div>
          )}
        </div>
        <span style={{ fontSize:28 }}>📊</span>
      </div>

      {insight.insight_text && <p style={{ fontSize:14, color:'#F4F4F8', lineHeight:1.6, marginBottom:16 }}>{insight.insight_text}</p>}

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
        {insight.best_day && (
          <div style={{ padding:10, borderRadius:10, background:'rgba(16,185,129,0.1)' }}>
            <p style={{ fontSize:10, fontWeight:600, color:'#10B981', textTransform:'uppercase', margin:0 }}>Best day</p>
            <p style={{ fontSize:13, fontWeight:700, color:'#F4F4F8', margin:'2px 0 0' }}>{insight.best_day}</p>
          </div>
        )}
        {insight.worst_day && (
          <div style={{ padding:10, borderRadius:10, background:'rgba(245,158,11,0.1)' }}>
            <p style={{ fontSize:10, fontWeight:600, color:'#F59E0B', textTransform:'uppercase', margin:0 }}>Toughest day</p>
            <p style={{ fontSize:13, fontWeight:700, color:'#F4F4F8', margin:'2px 0 0' }}>{insight.worst_day}</p>
          </div>
        )}
        {insight.top_habit && (
          <div style={{ gridColumn:'span 2', padding:10, borderRadius:10, background:'rgba(108,71,255,0.1)' }}>
            <p style={{ fontSize:10, fontWeight:600, color:'#A78BFA', textTransform:'uppercase', margin:0 }}>Most consistent</p>
            <p style={{ fontSize:13, fontWeight:700, color:'#F4F4F8', margin:'2px 0 0' }}>{insight.top_habit}</p>
          </div>
        )}
      </div>
    </div>
  );
}
