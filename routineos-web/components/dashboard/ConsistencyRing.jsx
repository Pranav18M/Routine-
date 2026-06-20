'use client';
import ProgressRing from '../ui/ProgressRing';

function scoreInfo(score) {
  if (score >= 80) return { label: 'Excellent', color: '#10B981' };
  if (score >= 60) return { label: 'Good', color: '#6C47FF' };
  if (score >= 40) return { label: 'Building', color: '#F59E0B' };
  return { label: 'Getting started', color: '#A78BFA' };
}

export default function ConsistencyRing({ score = 0, todayCompleted = 0, todayTotal = 0 }) {
  const { label, color } = scoreInfo(score);
  return (
    <div className="card card-pad" style={{ display:'flex', alignItems:'center', gap:20 }}>
      <ProgressRing percentage={score} size={88} strokeWidth={8} color={color} label={`${Math.round(score)}`} sublabel="score" animate />
      <div style={{ flex:1, minWidth:0 }}>
        <p style={{ fontSize:18, fontWeight:700, color:'#F4F4F8', margin:0, lineHeight:1.2 }}>{label}</p>
        <p style={{ fontSize:13, color:'#9B9BB4', marginTop:2 }}>30-day consistency</p>
        {todayTotal > 0 && (
          <div style={{ marginTop:12 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
              <span style={{ fontSize:12, color:'#9B9BB4' }}>Today</span>
              <span style={{ fontSize:12, fontWeight:600, color:'#F4F4F8' }}>{todayCompleted}/{todayTotal}</span>
            </div>
            <div style={{ height:6, background:'#252540', borderRadius:50, overflow:'hidden' }}>
              <div style={{ height:'100%', background:'#6C47FF', borderRadius:50, transition:'width 0.7s', width:`${todayTotal > 0 ? (todayCompleted/todayTotal)*100 : 0}%` }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
