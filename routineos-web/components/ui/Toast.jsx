'use client';
import useStore from '../../store/useStore';

const icons = { success:'✓', error:'✕', info:'ℹ', warning:'⚠' };
const styles = {
  success: { border:'#10B981', bg:'rgba(16,185,129,0.12)', color:'#10B981' },
  error: { border:'#EF4444', bg:'rgba(239,68,68,0.12)', color:'#EF4444' },
  info: { border:'#6C47FF', bg:'rgba(108,71,255,0.12)', color:'#A78BFA' },
  warning: { border:'#F59E0B', bg:'rgba(245,158,11,0.12)', color:'#F59E0B' },
};

function Toast({ id, type = 'info', message }) {
  const { removeToast } = useStore();
  const s = styles[type] || styles.info;
  return (
    <div
      onClick={() => removeToast(id)}
      style={{
        display:'flex', alignItems:'center', gap:12, padding:'12px 16px', borderRadius:14,
        border:`1px solid ${s.border}`, background:'#1A1A2E', boxShadow:'0 8px 24px rgba(0,0,0,0.4)',
        maxWidth:340, width:'100%', cursor:'pointer', fontFamily:"'Inter',system-ui,sans-serif",
      }}
    >
      <span style={{ fontSize:15, fontWeight:700, color:s.color, width:20, height:20, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{icons[type]}</span>
      <p style={{ fontSize:14, fontWeight:500, color:'#F4F4F8', flex:1, lineHeight:1.4, margin:0 }}>{message}</p>
    </div>
  );
}

export default function ToastContainer() {
  const { toasts } = useStore();
  if (!toasts.length) return null;
  return (
    <div style={{ position:'fixed', top:16, left:0, right:0, zIndex:200, display:'flex', flexDirection:'column', alignItems:'center', gap:8, padding:'0 16px', pointerEvents:'none' }}>
      {toasts.map(toast => (
        <div key={toast.id} style={{ pointerEvents:'auto', width:'100%', display:'flex', justifyContent:'center' }}>
          <Toast {...toast} />
        </div>
      ))}
    </div>
  );
}
