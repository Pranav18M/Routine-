'use client';
import { useState } from 'react';
import BottomSheet from '../ui/BottomSheet';
import Button from '../ui/Button';

const modes = [
  { key:'normal', emoji:'🌟', label:'Normal', desc:'Your full routine, all habits active' },
  { key:'grind', emoji:'🔥', label:'Grind', desc:'Extra hustle mode — maximum habits' },
  { key:'exam', emoji:'📚', label:'Exam', desc:'Study focus, lighter on wellness' },
  { key:'travel', emoji:'✈️', label:'Travel', desc:'Portable habits only' },
  { key:'sick', emoji:'🤒', label:'Recovery', desc:'Rest mode — essentials only' },
];
const durationOptions = [1,2,3,5,7,14];

export default function ModeSwitcher({ currentMode, isOpen, onClose, onSwitch, switching }) {
  const [selected, setSelected] = useState(currentMode || 'normal');
  const [duration, setDuration] = useState(null);

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Switch Life Mode">
      <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {modes.map(mode => (
            <button key={mode.key} onClick={() => setSelected(mode.key)}
              style={{
                display:'flex', alignItems:'center', gap:14, padding:14, borderRadius:14, textAlign:'left',
                cursor:'pointer', transition:'all 0.2s', fontFamily:"'Inter',system-ui,sans-serif",
                background: selected === mode.key ? 'rgba(108,71,255,0.18)' : '#252540',
                border: selected === mode.key ? '2px solid #6C47FF' : '2px solid transparent',
              }}>
              <span style={{ fontSize:22 }}>{mode.emoji}</span>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:15, fontWeight:600, color:'#F4F4F8', margin:0 }}>{mode.label}</p>
                <p style={{ fontSize:12, color:'#9B9BB4', margin:0 }}>{mode.desc}</p>
              </div>
              {selected === mode.key && <span style={{ color:'#6C47FF', fontWeight:700 }}>✓</span>}
            </button>
          ))}
        </div>

        {selected !== 'normal' && (
          <div>
            <p style={{ fontSize:13, fontWeight:600, color:'#9B9BB4', marginBottom:8 }}>Duration (optional)</p>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
              <button onClick={() => setDuration(null)} style={{
                padding:'7px 13px', borderRadius:50, fontSize:12, fontWeight:600, border:'none', cursor:'pointer',
                background: !duration ? '#6C47FF' : '#252540', color: !duration ? '#fff' : '#9B9BB4',
              }}>Until I switch</button>
              {durationOptions.map(d => (
                <button key={d} onClick={() => setDuration(d)} style={{
                  padding:'7px 13px', borderRadius:50, fontSize:12, fontWeight:600, border:'none', cursor:'pointer',
                  background: duration === d ? '#6C47FF' : '#252540', color: duration === d ? '#fff' : '#9B9BB4',
                }}>{d}d</button>
              ))}
            </div>
          </div>
        )}

        <Button fullWidth size="lg" onClick={() => onSwitch(selected, duration)} loading={switching}>
          Switch to {modes.find(m=>m.key===selected)?.label}
        </Button>
      </div>
    </BottomSheet>
  );
}
