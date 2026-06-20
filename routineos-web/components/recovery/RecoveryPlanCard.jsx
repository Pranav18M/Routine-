'use client';
import Button from '../ui/Button';

const dayColors = {
  1: { bg:'rgba(245,158,11,0.12)', border:'rgba(245,158,11,0.3)', text:'#F59E0B' },
  2: { bg:'rgba(108,71,255,0.12)', border:'rgba(108,71,255,0.3)', text:'#A78BFA' },
  3: { bg:'rgba(16,185,129,0.12)', border:'rgba(16,185,129,0.3)', text:'#10B981' },
};

function DayBlock({ day, habits, label }) {
  const c = dayColors[day];
  return (
    <div style={{ padding:14, borderRadius:14, border:`1px solid ${c.border}`, background:c.bg }}>
      <p style={{ fontSize:12, fontWeight:700, color:c.text, marginBottom:8 }}>{label}</p>
      <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
        {habits.map((name, i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:c.text, flexShrink:0 }} />
            <p style={{ fontSize:13, color:'#F4F4F8', margin:0 }}>{name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RecoveryPlanCard({ session, onComplete }) {
  if (!session) return null;
  const { recovery_plan: plan } = session;

  return (
    <div className="card card-pad" style={{ display:'flex', flexDirection:'column', gap:16 }}>
      <div>
        <p style={{ fontSize:12, fontWeight:600, color:'#A78BFA', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:4 }}>Recovery Plan Active</p>
        <h2 style={{ fontSize:20, fontWeight:700, color:'#F4F4F8', margin:0 }}>Your comeback starts now</h2>
        {plan.message && <p style={{ fontSize:13, color:'#9B9BB4', marginTop:8, lineHeight:1.5 }}>{plan.message}</p>}
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {plan.day1 && <DayBlock day={1} habits={plan.day1} label="Day 1 · 40%" />}
        {plan.day2 && <DayBlock day={2} habits={plan.day2} label="Day 2 · 70%" />}
        {plan.day3 && <DayBlock day={3} habits={plan.day3} label="Day 3 · Full routine" />}
      </div>
      <Button fullWidth variant="success" onClick={() => onComplete(session.id)}>I'm back — complete recovery 🎉</Button>
    </div>
  );
}
