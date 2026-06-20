'use client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:'#1A1A2E', border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, padding:'8px 12px', boxShadow:'0 4px 12px rgba(0,0,0,0.4)' }}>
      <p style={{ fontSize:12, fontWeight:600, color:'#F4F4F8', margin:0 }}>{label}</p>
      <p style={{ fontSize:13, color:'#6C47FF', fontWeight:700, margin:0 }}>{payload[0]?.value}%</p>
    </div>
  );
}

export default function HabitCompletionChart({ data = [] }) {
  if (!data.length) {
    return <div style={{ height:144, display:'flex', alignItems:'center', justifyContent:'center', color:'#9B9BB4', fontSize:13 }}>No data yet — keep logging!</div>;
  }
  const chartData = data.slice(-14).map(d => ({ date: d.date.slice(5), pct: d.pct }));

  return (
    <div style={{ height:144 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} barSize={16} margin={{ top:4, right:4, left:-20, bottom:0 }}>
          <XAxis dataKey="date" tick={{ fontSize:10, fill:'#9B9BB4', fontFamily:'Inter' }} axisLine={false} tickLine={false} interval={2} />
          <YAxis domain={[0,100]} tick={{ fontSize:10, fill:'#9B9BB4', fontFamily:'Inter' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill:'rgba(108,71,255,0.06)' }} />
          <Bar dataKey="pct" radius={[4,4,0,0]}>
            {chartData.map((entry, index) => (
              <Cell key={index} fill={entry.pct >= 80 ? '#10B981' : entry.pct >= 50 ? '#6C47FF' : '#A78BFA'} fillOpacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
