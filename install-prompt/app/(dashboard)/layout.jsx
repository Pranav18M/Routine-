'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import BottomNav from '../../components/layout/BottomNav';
import InstallBanner from '../../components/layout/InstallBanner';

export default function DashboardLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.replace('/login');
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') router.replace('/login');
    });

    return () => subscription.unsubscribe();
  }, [router]);

  return (
    <div style={{ background:'#0F0F1A', minHeight:'100vh' }}>
      {children}
      <InstallBanner />
      <BottomNav />
    </div>
  );
}
