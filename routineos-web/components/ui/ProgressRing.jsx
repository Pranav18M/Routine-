'use client';
import { useEffect, useRef } from 'react';

export default function ProgressRing({ percentage = 0, size = 80, strokeWidth = 7, color = '#6C47FF', trackColor = 'rgba(255,255,255,0.06)', label, sublabel, animate = true }) {
  const circleRef = useRef(null);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedPct = Math.min(100, Math.max(0, percentage));
  const offset = circumference - (clampedPct / 100) * circumference;

  useEffect(() => {
    if (!circleRef.current || !animate) return;
    const el = circleRef.current;
    el.style.strokeDashoffset = circumference;
    requestAnimationFrame(() => {
      el.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)';
      el.style.strokeDashoffset = offset;
    });
  }, [percentage, circumference, offset, animate]);

  return (
    <div style={{ position:'relative', display:'flex', alignItems:'center', justifyContent:'center', width:size, height:size, flexShrink:0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform:'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={trackColor} strokeWidth={strokeWidth} />
        <circle ref={circleRef} cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeLinecap="round" strokeDasharray={circumference}
          strokeDashoffset={animate ? circumference : offset}
          style={!animate ? { strokeDashoffset: offset } : undefined} />
      </svg>
      {(label !== undefined || sublabel) && (
        <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
          {label !== undefined && <span style={{ fontWeight:700, color:'#F4F4F8', lineHeight:1, fontSize:size*0.22 }}>{label}</span>}
          {sublabel && <span style={{ color:'#9B9BB4', lineHeight:1, marginTop:2, fontSize:size*0.13 }}>{sublabel}</span>}
        </div>
      )}
    </div>
  );
}
