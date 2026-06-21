'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../hooks/useAuth';
import InstallBanner from '../../../components/layout/InstallBanner';

export default function LoginPage() {
  const router = useRouter();
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, isAuthenticated } = useAuth();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isAuthenticated) router.replace('/today');
  }, [isAuthenticated, router]);

  const validate = () => {
    const errs = {};
    if (!email.includes('@')) errs.email = 'Enter a valid email';
    if (password.length < 8) errs.password = 'Password must be 8+ characters';
    if (mode === 'signup' && !name.trim()) errs.name = 'Name is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    if (mode === 'login') {
      const res = await signInWithEmail(email, password);
      if (res.success) router.replace('/today');
    } else {
      const res = await signUpWithEmail(email, password, name);
      if (res.success) router.replace('/onboarding');
    }
    setSubmitting(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .rtn-page { min-height:100vh; background:#0F0F1A; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:32px 20px; font-family:'Inter',system-ui,sans-serif; }
        .rtn-wrap { width:100%; max-width:380px; display:flex; flex-direction:column; gap:24px; animation:fadeUp 0.4s ease-out; }
        .rtn-logo-box { width:72px; height:72px; border-radius:20px; display:flex; align-items:center; justify-content:center; margin:0 auto 16px; box-shadow:0 0 24px rgba(108,71,255,0.35); overflow:hidden; } .rtn-logo-box img { width:100%; height:100%; object-fit:cover; border-radius:20px; }
        .rtn-title { font-size:28px; font-weight:800; background:linear-gradient(135deg,#6C47FF,#A78BFA); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; text-align:center; }
        .rtn-sub { font-size:14px; color:#9B9BB4; text-align:center; margin-top:6px; }
        .rtn-tabs { display:flex; background:#252540; padding:4px; border-radius:14px; gap:4px; }
        .rtn-tab { flex:1; padding:10px; font-size:14px; font-weight:600; border-radius:11px; border:none; cursor:pointer; transition:all 0.2s; font-family:'Inter',system-ui,sans-serif; }
        .rtn-tab.active { background:#1A1A2E; color:#F4F4F8; box-shadow:0 2px 8px rgba(0,0,0,0.3); }
        .rtn-tab.inactive { background:transparent; color:#9B9BB4; }
        .rtn-tab.inactive:hover { color:#F4F4F8; }
        .rtn-form { display:flex; flex-direction:column; gap:12px; }
        .rtn-field { display:flex; flex-direction:column; gap:4px; }
        .rtn-input { width:100%; background:#252540; border:1.5px solid rgba(255,255,255,0.08); border-radius:12px; padding:14px 16px; font-size:15px; color:#F4F4F8; outline:none; font-family:'Inter',system-ui,sans-serif; transition:border-color 0.2s; }
        .rtn-input::placeholder { color:#5C5C78; }
        .rtn-input:focus { border-color:#6C47FF; }
        .rtn-input.err { border-color:#EF4444; }
        .rtn-err { font-size:12px; color:#EF4444; margin-left:4px; }
        .rtn-btn { width:100%; padding:16px; font-size:16px; font-weight:700; border-radius:12px; border:none; cursor:pointer; background:linear-gradient(135deg,#6C47FF,#8B6FFF); color:#fff; font-family:'Inter',system-ui,sans-serif; box-shadow:0 4px 20px rgba(108,71,255,0.4); transition:all 0.2s; display:flex; align-items:center; justify-content:center; gap:8px; }
        .rtn-btn:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 6px 28px rgba(108,71,255,0.5); }
        .rtn-btn:disabled { background:#3A3A5C; box-shadow:none; cursor:not-allowed; }
        .rtn-divider { display:flex; align-items:center; gap:12px; }
        .rtn-line { flex:1; height:1px; background:rgba(255,255,255,0.08); }
        .rtn-or { font-size:12px; color:#5C5C78; }
        .rtn-google { width:100%; padding:14px; font-size:15px; font-weight:600; border-radius:12px; border:1.5px solid rgba(255,255,255,0.08); cursor:pointer; background:transparent; color:#F4F4F8; font-family:'Inter',system-ui,sans-serif; display:flex; align-items:center; justify-content:center; gap:10px; transition:all 0.2s; }
        .rtn-google:hover { background:rgba(108,71,255,0.1); border-color:#6C47FF; }
        .rtn-footer { text-align:center; font-size:11px; color:#5C5C78; line-height:1.6; }
        .rtn-accent { color:#6C47FF; }
        .rtn-spinner { width:16px; height:16px; border:2px solid rgba(255,255,255,0.3); border-top:2px solid white; border-radius:50%; animation:spin 0.8s linear infinite; }
      `}</style>

      <div className="rtn-page">
        <div className="rtn-wrap">
          <div style={{textAlign:'center'}}>
            <div className="rtn-logo-box"><img src="/icons/Routine logo.png" alt="RoutineOS" onError={e => { e.target.style.display="none"; e.target.parentNode.textContent="🔄"; }} /></div>
            <h1 className="rtn-title">RoutineOS</h1>
            <p className="rtn-sub">The routine that adapts to your real life</p>
          </div>

          <div className="rtn-tabs">
            <button className={'rtn-tab ' + (mode==='login' ? 'active' : 'inactive')} onClick={() => { setMode('login'); setErrors({}); }}>Sign in</button>
            <button className={'rtn-tab ' + (mode==='signup' ? 'active' : 'inactive')} onClick={() => { setMode('signup'); setErrors({}); }}>Create account</button>
          </div>

          <form onSubmit={handleSubmit} className="rtn-form">
            {mode === 'signup' && (
              <div className="rtn-field">
                <input type="text" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} className={'rtn-input' + (errors.name ? ' err' : '')} />
                {errors.name && <p className="rtn-err">{errors.name}</p>}
              </div>
            )}
            <div className="rtn-field">
              <input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} className={'rtn-input' + (errors.email ? ' err' : '')} />
              {errors.email && <p className="rtn-err">{errors.email}</p>}
            </div>
            <div className="rtn-field">
              <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className={'rtn-input' + (errors.password ? ' err' : '')} />
              {errors.password && <p className="rtn-err">{errors.password}</p>}
            </div>
            <button type="submit" disabled={submitting} className="rtn-btn">
              {submitting && <span className="rtn-spinner" />}
              {mode === 'login' ? 'Sign in' : 'Create account'}
            </button>
          </form>

          <div className="rtn-divider">
            <div className="rtn-line" />
            <span className="rtn-or">or</span>
            <div className="rtn-line" />
          </div>

          <button className="rtn-google" onClick={signInWithGoogle} disabled={submitting}>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <p className="rtn-footer">
            By continuing you agree to our <span className="rtn-accent">Terms</span> and <span className="rtn-accent">Privacy Policy</span>
          </p>
        </div>
      </div>
      <InstallBanner />
    </>
  );
}
