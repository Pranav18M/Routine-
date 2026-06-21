'use client';
import { useState, useEffect } from 'react';
import { useInstallPrompt } from '../../hooks/useInstallPrompt';

const STORAGE_KEY = 'routineos-install-dismissed';

export default function InstallBanner() {
  const { isInstallable, isInstalled, isIOS, promptInstall } = useInstallPrompt();
  const [dismissed, setDismissed] = useState(true); // start hidden until we check localStorage
  const [showIOSSheet, setShowIOSSheet] = useState(false);

  useEffect(() => {
    const wasDismissed = localStorage.getItem(STORAGE_KEY) === 'true';
    setDismissed(wasDismissed);
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem(STORAGE_KEY, 'true');
  };

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSSheet(true);
      return;
    }
    const choice = await promptInstall();
    if (choice.outcome === 'accepted' || choice.outcome === 'dismissed') {
      handleDismiss();
    }
  };

  // Don't show if: already installed, user dismissed it, or (not iOS AND not installable yet)
  const shouldShow = !isInstalled && !dismissed && (isInstallable || isIOS);

  if (!shouldShow && !showIOSSheet) return null;

  return (
    <>
      <style>{`
        @keyframes installSlideUp { from { transform:translateY(100%); opacity:0; } to { transform:translateY(0); opacity:1; } }
        @keyframes installFadeIn { from { opacity:0; } to { opacity:1; } }
        .install-banner {
          position:fixed; left:12px; right:12px; bottom:84px; z-index:120;
          max-width:456px; margin:0 auto;
          background:linear-gradient(135deg,#1A1A2E,#1F1F3A);
          border:1px solid rgba(108,71,255,0.3);
          border-radius:18px; padding:14px;
          box-shadow:0 12px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(108,71,255,0.1);
          display:flex; align-items:center; gap:12px;
          animation:installSlideUp 0.4s cubic-bezier(0.32,0.72,0,1);
          font-family:'Inter',system-ui,sans-serif;
        }
        .install-banner-icon { width:44px; height:44px; border-radius:12px; overflow:hidden; flex-shrink:0; box-shadow:0 0 16px rgba(108,71,255,0.3); }
        .install-banner-icon img { width:100%; height:100%; object-fit:cover; }
        .install-banner-text { flex:1; min-width:0; }
        .install-banner-title { font-size:14px; font-weight:700; color:#F4F4F8; margin:0; }
        .install-banner-sub { font-size:12px; color:#9B9BB4; margin:1px 0 0; }
        .install-banner-btn { padding:9px 16px; border-radius:10px; border:none; cursor:pointer; font-size:13px; font-weight:700; background:linear-gradient(135deg,#6C47FF,#8B6FFF); color:#fff; flex-shrink:0; white-space:nowrap; font-family:'Inter',system-ui,sans-serif; }
        .install-banner-close { width:26px; height:26px; border-radius:50%; border:none; background:rgba(255,255,255,0.06); color:#9B9BB4; cursor:pointer; font-size:13px; flex-shrink:0; display:flex; align-items:center; justify-content:center; }

        .ios-sheet-backdrop { position:fixed; inset:0; z-index:200; background:rgba(0,0,0,0.6); animation:installFadeIn 0.2s ease-out; }
        .ios-sheet { position:fixed; left:0; right:0; bottom:0; z-index:201; max-width:480px; margin:0 auto; background:#1A1A2E; border-top-left-radius:24px; border-top-right-radius:24px; padding:24px 20px 32px; animation:installSlideUp 0.3s cubic-bezier(0.32,0.72,0,1); font-family:'Inter',system-ui,sans-serif; }
        .ios-sheet-title { font-size:18px; font-weight:700; color:#F4F4F8; margin:0 0 4px; text-align:center; }
        .ios-sheet-sub { font-size:13px; color:#9B9BB4; margin:0 0 24px; text-align:center; }
        .ios-step { display:flex; align-items:center; gap:14px; padding:12px 0; border-bottom:1px solid rgba(255,255,255,0.06); }
        .ios-step:last-child { border-bottom:none; }
        .ios-step-num { width:26px; height:26px; border-radius:50%; background:rgba(108,71,255,0.18); color:#A78BFA; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; flex-shrink:0; }
        .ios-step-icon { font-size:20px; flex-shrink:0; }
        .ios-step-text { font-size:14px; color:#F4F4F8; line-height:1.4; }
        .ios-step-text strong { color:#A78BFA; }
        .ios-sheet-close { width:100%; margin-top:20px; padding:14px; border-radius:12px; border:none; background:#252540; color:#F4F4F8; font-size:14px; font-weight:700; cursor:pointer; font-family:'Inter',system-ui,sans-serif; }
      `}</style>

      {shouldShow && !showIOSSheet && (
        <div className="install-banner">
          <div className="install-banner-icon">
            <img src="/icons/Routine logo.png" alt="RoutineOS" onError={e => { e.target.style.display = 'none'; }} />
          </div>
          <div className="install-banner-text">
            <p className="install-banner-title">Install RoutineOS</p>
            <p className="install-banner-sub">Add to your home screen — works like an app</p>
          </div>
          <button className="install-banner-btn" onClick={handleInstallClick}>Install</button>
          <button className="install-banner-close" onClick={handleDismiss} aria-label="Dismiss">✕</button>
        </div>
      )}

      {showIOSSheet && (
        <>
          <div className="ios-sheet-backdrop" onClick={() => { setShowIOSSheet(false); handleDismiss(); }} />
          <div className="ios-sheet">
            <p className="ios-sheet-title">Install RoutineOS</p>
            <p className="ios-sheet-sub">Add it to your Home Screen in two taps</p>
            <div className="ios-step">
              <span className="ios-step-icon">⬆️</span>
              <p className="ios-step-text">Tap the <strong>Share</strong> button in Safari's toolbar</p>
            </div>
            <div className="ios-step">
              <span className="ios-step-icon">➕</span>
              <p className="ios-step-text">Scroll down and tap <strong>"Add to Home Screen"</strong></p>
            </div>
            <div className="ios-step">
              <span className="ios-step-icon">✅</span>
              <p className="ios-step-text">Tap <strong>Add</strong> — RoutineOS now opens like a real app</p>
            </div>
            <button className="ios-sheet-close" onClick={() => { setShowIOSSheet(false); handleDismiss(); }}>Got it</button>
          </div>
        </>
      )}
    </>
  );
}
