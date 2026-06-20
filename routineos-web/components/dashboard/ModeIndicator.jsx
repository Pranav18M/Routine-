'use client';

const MODE_LABELS = { normal:'Normal', exam:'Exam Mode', travel:'Travel', sick:'Recovery', grind:'Grind Mode' };
const MODE_EMOJIS = { normal:'🌟', exam:'📚', travel:'✈️', sick:'🤒', grind:'🔥' };
const modeColors = { normal:'rgba(108,71,255,0.15)', exam:'rgba(59,130,246,0.15)', travel:'rgba(16,185,129,0.15)', sick:'rgba(239,68,68,0.15)', grind:'rgba(245,158,11,0.15)' };
const modeText = { normal:'#A78BFA', exam:'#60A5FA', travel:'#10B981', sick:'#F87171', grind:'#F59E0B' };

export default function ModeIndicator({ mode = 'normal', modeUntil, onSwitch }) {
  if (mode === 'normal' && !onSwitch) return null;
  const expiresText = modeUntil ? `until ${new Date(modeUntil).toLocaleDateString('en-US', { month:'short', day:'numeric' })}` : null;

  return (
    <button onClick={onSwitch} style={{
      display:'flex', alignItems:'center', gap:10, width:'100%', padding:12, borderRadius:14,
      border:'none', cursor:'pointer', transition:'all 0.2s', background: modeColors[mode] || modeColors.normal,
      fontFamily:"'Inter',system-ui,sans-serif",
    }}>
      <span style={{ fontSize:20 }}>{MODE_EMOJIS[mode]}</span>
      <div style={{ flex:1, textAlign:'left' }}>
        <p style={{ fontSize:13, fontWeight:600, color: modeText[mode]||modeText.normal, margin:0 }}>{MODE_LABELS[mode]}</p>
        {expiresText && <p style={{ fontSize:11, color:'#9B9BB4', margin:0 }}>{expiresText}</p>}
      </div>
      <span style={{ fontSize:12, color:'#9B9BB4' }}>Switch →</span>
    </button>
  );
}
