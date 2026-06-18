'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import BottomNav from '../../components/layout/BottomNav';
import useStore from '../../store/useStore';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const { initTheme } = useStore();

  useEffect(() => {
    initTheme();

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.replace('/login');
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') router.replace('/login');
    });

    return () => subscription.unsubscribe();
  }, [router, initTheme]);

  return (
    <div className="min-h-dvh bg-[var(--color-bg)]">
      {children}
      <BottomNav />
    </div>
  );
}