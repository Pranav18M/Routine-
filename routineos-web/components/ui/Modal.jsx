'use client';
import { useEffect } from 'react';

export default function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    if (isOpen) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div className="overlay-backdrop" onClick={onClose} />
      <div className="modal-panel">
        <div className="modal-card">
          {title && (
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:20, borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
              <h2 style={{ fontSize:18, fontWeight:700, color:'#F4F4F8', margin:0 }}>{title}</h2>
              <button onClick={onClose} className="pg-icon-btn" style={{ borderRadius:'50%' }}>✕</button>
            </div>
          )}
          <div style={{ padding:20 }}>{children}</div>
        </div>
      </div>
    </>
  );
}
