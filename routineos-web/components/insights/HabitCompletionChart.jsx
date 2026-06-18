'use client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[10px] px-3 py-2 shadow-lg">
      <p className="text-[12px] font-semibold text-primary">{label}</p>
      <p className="text-[13px] text-[#6C47FF] font-bold">{payload[0]?.value}%</p>
    </div>
  );
}

export default function HabitCompletionChart({ data = [] }) {
  if (!data.length) {
    return (
      <div className="h-36 flex items-center justify-center text-secondary text-[13px]">
        No data yet — keep logging!
      </div>
    );
  }

  // Show last 14 days, label every 3rd
  const chartData = data.slice(-14).map(d => ({
    date: d.date.slice(5), // MM-DD
    pct: d.pct,
    full: d.date,
  }));

  return (
    <div className="h-36">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} barSize={16} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: 'var(--color-text-secondary)', fontFamily: 'Inter' }}
            axisLine={false}
            tickLine={false}
            interval={2}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 10, fill: 'var(--color-text-secondary)', fontFamily: 'Inter' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(108,71,255,0.06)' }} />
          <Bar dataKey="pct" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell
                key={index}
                fill={entry.pct >= 80 ? '#10B981' : entry.pct >= 50 ? '#6C47FF' : '#A78BFA'}
                fillOpacity={0.85}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}