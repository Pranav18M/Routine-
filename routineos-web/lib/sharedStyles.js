// Shared CSS injected once per page — avoids any dependency on Tailwind.
// Every dashboard page imports SHARED_STYLES and renders it in a <style> tag.

export const SHARED_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  * { box-sizing: border-box; }
  html, body { margin:0; padding:0; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes shimmer { 0% { background-position:-200% 0; } 100% { background-position:200% 0; } }
  @keyframes bounceCheck { 0%{transform:scale(1);} 30%{transform:scale(1.15);} 60%{transform:scale(0.95);} 100%{transform:scale(1);} }
  @keyframes slideUp { from { transform:translateY(100%); opacity:0; } to { transform:translateY(0); opacity:1; } }

  body { font-family:'Inter',system-ui,sans-serif; background:#0F0F1A; color:#F4F4F8; }

  /* ── Page shell ─────────────────────────────────────────── */
  .pg-root { min-height:100vh; background:#0F0F1A; font-family:'Inter',system-ui,sans-serif; color:#F4F4F8; }
  .pg-header { position:fixed; top:0; left:0; right:0; z-index:50; height:60px; background:rgba(15,15,26,0.85); backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px); border-bottom:1px solid rgba(255,255,255,0.08); display:flex; align-items:center; }
  .pg-header-inner { max-width:480px; margin:0 auto; width:100%; padding:0 16px; display:flex; align-items:center; justify-content:space-between; gap:12px; }
  .pg-header-title { font-size:17px; font-weight:700; color:#F4F4F8; margin:0; line-height:1.2; }
  .pg-header-sub { font-size:12px; color:#9B9BB4; margin:2px 0 0; line-height:1; }
  .pg-content { max-width:480px; margin:0 auto; padding:76px 16px 92px; }
  .pg-mode-pill { display:flex; align-items:center; gap:4px; padding:5px 10px; border-radius:50px; font-size:11px; font-weight:600; background:rgba(108,71,255,0.15); color:#A78BFA; border:1px solid rgba(108,71,255,0.2); white-space:nowrap; }
  .pg-icon-btn { width:36px; height:36px; display:flex; align-items:center; justify-content:center; border-radius:10px; background:#252540; color:#9B9BB4; border:none; cursor:pointer; font-size:16px; transition:all 0.2s; flex-shrink:0; }
  .pg-icon-btn:hover { color:#F4F4F8; }

  /* ── Bottom nav ─────────────────────────────────────────── */
  .pg-nav { position:fixed; bottom:0; left:0; right:0; height:68px; background:#1A1A2E; border-top:1px solid rgba(255,255,255,0.08); backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px); z-index:100; padding-bottom:env(safe-area-inset-bottom); }
  .pg-nav-inner { max-width:480px; margin:0 auto; height:100%; display:flex; align-items:center; justify-content:space-around; padding:0 8px; }
  .pg-nav-item { display:flex; flex-direction:column; align-items:center; gap:3px; padding:8px 12px; border-radius:12px; text-decoration:none; color:#9B9BB4; transition:color 0.2s; position:relative; min-width:52px; }
  .pg-nav-item.active { color:#6C47FF; }
  .pg-nav-item span.label { font-size:10px; font-weight:600; line-height:1; }
  .pg-nav-dot { position:absolute; bottom:1px; left:50%; transform:translateX(-50%); width:18px; height:2px; background:#6C47FF; border-radius:2px; }

  /* ── Cards ──────────────────────────────────────────────── */
  .card { background:#1A1A2E; border:1px solid rgba(255,255,255,0.08); border-radius:16px; box-shadow:0 2px 12px rgba(0,0,0,0.3); }
  .card-pad { padding:18px; }
  .glass-card { background:rgba(255,255,255,0.04); backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px); border:1px solid rgba(108,71,255,0.18); border-radius:16px; }
  .stagger > * { animation:fadeUp 0.3s ease-out both; }
  .stagger > *:nth-child(1){animation-delay:0ms;} .stagger > *:nth-child(2){animation-delay:60ms;} .stagger > *:nth-child(3){animation-delay:120ms;}
  .stagger > *:nth-child(4){animation-delay:180ms;} .stagger > *:nth-child(5){animation-delay:240ms;} .stagger > *:nth-child(6){animation-delay:300ms;}
  .stagger > *:nth-child(7){animation-delay:360ms;} .stagger > *:nth-child(8){animation-delay:420ms;}

  /* ── Buttons ────────────────────────────────────────────── */
  .btn { display:inline-flex; align-items:center; justify-content:center; gap:8px; font-weight:700; border:none; cursor:pointer; transition:all 0.2s; font-family:'Inter',system-ui,sans-serif; }
  .btn:active { transform:scale(0.97); }
  .btn:disabled { opacity:0.4; cursor:not-allowed; }
  .btn-primary { background:linear-gradient(135deg,#6C47FF,#8B6FFF); color:#fff; box-shadow:0 4px 16px rgba(108,71,255,0.35); }
  .btn-secondary { background:#252540; color:#F4F4F8; }
  .btn-ghost { background:transparent; color:#F4F4F8; }
  .btn-danger { background:rgba(239,68,68,0.15); color:#EF4444; }
  .btn-success { background:rgba(16,185,129,0.15); color:#10B981; }
  .btn-outline { background:transparent; border:1.5px solid rgba(255,255,255,0.12); color:#F4F4F8; }
  .btn-sm { padding:8px 14px; font-size:13px; border-radius:10px; }
  .btn-md { padding:13px 20px; font-size:15px; border-radius:12px; }
  .btn-lg { padding:16px 24px; font-size:16px; border-radius:12px; }
  .btn-full { width:100%; }
  .spinner { width:16px; height:16px; border:2px solid rgba(255,255,255,0.3); border-top:2px solid white; border-radius:50%; animation:spin 0.8s linear infinite; flex-shrink:0; }

  /* ── Inputs ─────────────────────────────────────────────── */
  .field-input { width:100%; background:#252540; border:1.5px solid rgba(255,255,255,0.08); border-radius:12px; padding:13px 16px; font-size:15px; color:#F4F4F8; outline:none; font-family:'Inter',system-ui,sans-serif; transition:border-color 0.2s; }
  .field-input:focus { border-color:#6C47FF; }
  .field-input::placeholder { color:#5C5C78; }
  .field-textarea { width:100%; background:#252540; border:1.5px solid rgba(255,255,255,0.08); border-radius:12px; padding:12px 16px; font-size:14px; color:#F4F4F8; outline:none; resize:none; font-family:'Inter',system-ui,sans-serif; transition:border-color 0.2s; }
  .field-textarea:focus { border-color:#6C47FF; }
  .field-textarea::placeholder { color:#5C5C78; }
  .field-label { font-size:12px; color:#9B9BB4; margin-bottom:6px; display:block; font-weight:500; }

  /* ── Pills / badges ─────────────────────────────────────── */
  .pill { display:inline-flex; align-items:center; padding:3px 10px; border-radius:50px; font-size:11px; font-weight:600; white-space:nowrap; }
  .cat-health { background:rgba(16,185,129,0.15); color:#10B981; }
  .cat-study { background:rgba(59,130,246,0.15); color:#60A5FA; }
  .cat-skill { background:rgba(245,158,11,0.15); color:#F59E0B; }
  .cat-mindfulness { background:rgba(167,139,250,0.15); color:#A78BFA; }
  .cat-personal { background:rgba(236,72,153,0.15); color:#F472B6; }

  /* ── Skeleton ───────────────────────────────────────────── */
  .skel { background:linear-gradient(90deg,#252540 25%,rgba(255,255,255,0.06) 50%,#252540 75%); background-size:200% 100%; animation:shimmer 1.5s infinite; border-radius:8px; }

  /* ── Misc text ──────────────────────────────────────────── */
  .txt-primary { color:#F4F4F8; }
  .txt-secondary { color:#9B9BB4; }
  .txt-muted { color:#5C5C78; }
  .txt-accent { color:#6C47FF; }

  /* ── Toggle switch ──────────────────────────────────────── */
  .toggle { width:48px; height:26px; border-radius:50px; border:none; cursor:pointer; position:relative; transition:background 0.25s; }
  .toggle.on { background:#6C47FF; }
  .toggle.off { background:#252540; }
  .toggle-knob { position:absolute; top:2px; width:22px; height:22px; border-radius:50%; background:#fff; transition:left 0.25s; box-shadow:0 1px 4px rgba(0,0,0,0.3); }
  .toggle.on .toggle-knob { left:24px; }
  .toggle.off .toggle-knob { left:2px; }

  /* ── Modal / sheet backdrop ─────────────────────────────── */
  .overlay-backdrop { position:fixed; inset:0; background:rgba(0,0,0,0.6); backdrop-filter:blur(2px); z-index:150; animation:fadeIn 0.2s ease-out; }
  .modal-panel { position:fixed; inset:0; z-index:151; display:flex; align-items:center; justify-content:center; padding:16px; }
  .modal-card { width:100%; max-width:380px; background:#1A1A2E; border:1px solid rgba(255,255,255,0.08); border-radius:20px; box-shadow:0 20px 60px rgba(0,0,0,0.5); animation:fadeUp 0.25s ease-out; max-height:85vh; overflow-y:auto; }
  .sheet-panel { position:fixed; inset:0; z-index:151; display:flex; align-items:flex-end; }
  .sheet-card { width:100%; max-width:480px; margin:0 auto; background:#1A1A2E; border:1px solid rgba(255,255,255,0.08); border-top-left-radius:24px; border-top-right-radius:24px; box-shadow:0 -10px 40px rgba(0,0,0,0.5); animation:slideUp 0.3s cubic-bezier(0.32,0.72,0,1); max-height:88vh; overflow-y:auto; }
  .sheet-handle { display:flex; justify-content:center; padding:12px 0 4px; }
  .sheet-handle-bar { width:40px; height:4px; border-radius:4px; background:#252540; }

  .scroll-x { display:flex; gap:8px; overflow-x:auto; padding-bottom:4px; -ms-overflow-style:none; scrollbar-width:none; }
  .scroll-x::-webkit-scrollbar { display:none; }
`;
