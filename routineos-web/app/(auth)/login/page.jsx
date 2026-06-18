'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../hooks/useAuth';
import Button from '../../../components/ui/Button';
import { cn } from '../../../lib/utils';

export default function LoginPage() {
  const router = useRouter();
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, isAuthenticated, loading } = useAuth();
  const [mode, setMode] = useState('login'); // login | signup
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
    <div className="min-h-dvh flex flex-col items-center justify-center px-5 py-8 bg-[var(--color-bg)]">
      <div className="w-full max-w-sm space-y-8 anim-fade-up">
        {/* Logo */}
        <div className="text-center">
          <div className="w-16 h-16 rounded-[20px] bg-gradient-to-br from-[#6C47FF] to-[#A78BFA]
            flex items-center justify-center text-3xl shadow-glow mx-auto mb-5">
            🔄
          </div>
          <h1 className="text-[28px] font-bold gradient-text">RoutineOS</h1>
          <p className="text-[14px] text-secondary mt-1">The routine that adapts to your real life</p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-[var(--color-elevated)] p-1 rounded-[14px]">
          {['login', 'signup'].map(tab => (
            <button
              key={tab}
              onClick={() => { setMode(tab); setErrors({}); }}
              className={cn(
                'flex-1 py-2.5 text-[14px] font-semibold rounded-[11px] transition-all duration-200 capitalize',
                mode === tab
                  ? 'bg-[var(--color-card)] text-primary shadow-card'
                  : 'text-secondary hover:text-primary',
              )}
            >
              {tab === 'login' ? 'Sign in' : 'Create account'}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={e => setName(e.target.value)}
                className={cn(
                  'w-full bg-[var(--color-elevated)] rounded-[12px] px-4 py-3.5',
                  'text-[15px] text-primary placeholder:text-muted',
                  'border focus:outline-none focus:border-[#6C47FF] transition-colors',
                  errors.name ? 'border-[#EF4444]' : 'border-[var(--color-border)]',
                )}
              />
              {errors.name && <p className="text-[12px] text-[#EF4444] mt-1 ml-1">{errors.name}</p>}
            </div>
          )}

          <div>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className={cn(
                'w-full bg-[var(--color-elevated)] rounded-[12px] px-4 py-3.5',
                'text-[15px] text-primary placeholder:text-muted',
                'border focus:outline-none focus:border-[#6C47FF] transition-colors',
                errors.email ? 'border-[#EF4444]' : 'border-[var(--color-border)]',
              )}
            />
            {errors.email && <p className="text-[12px] text-[#EF4444] mt-1 ml-1">{errors.email}</p>}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className={cn(
                'w-full bg-[var(--color-elevated)] rounded-[12px] px-4 py-3.5',
                'text-[15px] text-primary placeholder:text-muted',
                'border focus:outline-none focus:border-[#6C47FF] transition-colors',
                errors.password ? 'border-[#EF4444]' : 'border-[var(--color-border)]',
              )}
            />
            {errors.password && <p className="text-[12px] text-[#EF4444] mt-1 ml-1">{errors.password}</p>}
          </div>

          <Button type="submit" fullWidth size="lg" loading={submitting}>
            {mode === 'login' ? 'Sign in' : 'Create account'}
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-[var(--color-border)]" />
          <span className="text-[12px] text-muted">or</span>
          <div className="flex-1 h-px bg-[var(--color-border)]" />
        </div>

        {/* Google */}
        <Button
          fullWidth
          variant="outline"
          size="lg"
          onClick={signInWithGoogle}
          disabled={submitting}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" className="shrink-0">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </Button>

        <p className="text-center text-[11px] text-muted leading-relaxed">
          By continuing you agree to our{' '}
          <span className="text-[#6C47FF]">Terms</span> and{' '}
          <span className="text-[#6C47FF]">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
}