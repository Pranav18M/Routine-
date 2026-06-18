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
    <div className="min-h-dvh flex items-center justify-center bg-[#0F0F1A]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-[20px] bg-gradient-to-br from-[#6C47FF] to-[#A78BFA]
          flex items-center justify-center text-3xl shadow-glow">
          🔄
        </div>
        <div className="w-6 h-6 border-2 border-[#6C47FF] border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );
}