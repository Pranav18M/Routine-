'use client';
import { useState } from 'react';

export default function MorningBriefing({ text }) {
  const [expanded, setExpanded] = useState(false);
  if (!text) return null;
  const lines = text.split('\n').filter(Boolean);
  const hasMore = lines.length > 1;

  return (
    <div className="glass-card card-pad anim-fade-up" style={{ animation:'fadeUp 0.3s ease-out' }}>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
        <span style={{ fontSize:18 }}>🌅</span>
        <p style={{ fontSize:12, fontWeight:600, color:'#A78BFA', textTransform:'uppercase', letterSpacing:'0.05em', margin:0 }}>Morning Briefing</p>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
        {(expanded ? lines : [lines[0]]).map((line, i) => (
          <p key={i} style={{ fontSize:14, color:'#F4F4F8', lineHeight:1.6, margin:0 }}>{line}</p>
        ))}
      </div>
      {hasMore && (
        <button onClick={() => setExpanded(v => !v)} style={{ marginTop:8, fontSize:12, fontWeight:600, color:'#6C47FF', background:'none', border:'none', cursor:'pointer', padding:0 }}>
          {expanded ? 'Show less ↑' : 'Read more ↓'}
        </button>
      )}
    </div>
  );
}
