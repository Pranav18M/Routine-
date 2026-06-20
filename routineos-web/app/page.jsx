'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace('/today');
      } else {
        router.replace('/login');
      }
    });
  }, [router]);

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .root-loading-page { min-height:100vh; display:flex; align-items:center; justify-content:center; background:#0F0F1A; }
        .root-loading-wrap { display:flex; flex-direction:column; align-items:center; gap:16px; }
        .root-loading-logo { width:64px; height:64px; border-radius:20px; overflow:hidden; box-shadow:0 0 24px rgba(108,71,255,0.4); }
        .root-loading-logo img { width:100%; height:100%; object-fit:cover; }
        .root-loading-spinner { width:24px; height:24px; border:2px solid #6C47FF; border-top:2px solid transparent; border-radius:50%; animation:spin 0.8s linear infinite; }
      `}</style>
      <div className="root-loading-page">
        <div className="root-loading-wrap">
          <div className="root-loading-logo">
            <img
              src="/icons/Routine logo.png"
              alt="RoutineOS"
              onError={e => { e.target.parentNode.style.background = 'linear-gradient(135deg,#6C47FF,#A78BFA)'; e.target.remove(); }}
            />
          </div>
          <div className="root-loading-spinner" />
        </div>
      </div>
    </>
  );
}