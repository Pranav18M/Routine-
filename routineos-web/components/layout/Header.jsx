'use client';
import { useRouter } from 'next/navigation';
import useStore from '../../store/useStore';

const MODE_LABELS = { normal:'Normal', exam:'Exam Mode', travel:'Travel', sick:'Recovery', grind:'Grind Mode' };
const MODE_EMOJIS = { normal:'🌟', exam:'📚', travel:'✈️', sick:'🤒', grind:'🔥' };

export default function Header({ title, subtitle, showMode = false, rightAction }) {
  const { currentMode } = useStore();
  const router = useRouter();

  return (
    <header className="pg-header">
      <div className="pg-header-inner">
        <div style={{ display:'flex', alignItems:'center', gap:10, minWidth:0, flex:1 }}>
          <button
            onClick={() => router.push('/settings')}
            aria-label="Settings"
            style={{
              width:32, height:32, borderRadius:9, overflow:'hidden', flexShrink:0,
              border:'none', padding:0, cursor:'pointer', background:'transparent',
              display:'flex', alignItems:'center', justifyContent:'center',
            }}
          >
            <img
              src="/icons/Routine logo.png"
              alt="RoutineOS"
              style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:9 }}
              onError={e => { e.target.style.display = 'none'; e.target.parentNode.textContent = '🔄'; }}
            />
          </button>
          <div style={{ minWidth: 0, flex: 1 }}>
            <h1 className="pg-header-title" style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
              {title || 'RoutineOS'}
            </h1>
            {subtitle && <p className="pg-header-sub" style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{subtitle}</p>}
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
          {showMode && currentMode && currentMode !== 'normal' && (
            <span className="pg-mode-pill">{MODE_EMOJIS[currentMode]} {MODE_LABELS[currentMode]}</span>
          )}
          {rightAction}
        </div>
      </div>
    </header>
  );
}
