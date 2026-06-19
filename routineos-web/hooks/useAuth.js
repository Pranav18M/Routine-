'use client';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { userApi } from '../lib/api';
import useStore from '../store/useStore';

export function useAuth() {
  const { user, setUser, clearUser, addToast } = useStore();
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(true);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await userApi.getProfile();
      setUser(res.data);
      return res.data;
    } catch {
      return null;
    }
  }, [setUser]);

  useEffect(() => {
    // On mount, check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        fetchProfile().finally(() => {
          setLoading(false);
          setInitializing(false);
        });
      } else {
        setLoading(false);
        setInitializing(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        await fetchProfile();
      } else if (event === 'SIGNED_OUT') {
        clearUser();
      } else if (event === 'TOKEN_REFRESHED') {
        // Token silently refreshed — no action needed
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile, clearUser]);

  const signInWithGoogle = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/` },
    });
    if (error) {
      addToast({ type: 'error', message: 'Google sign-in failed. Try again.' });
      setLoading(false);
    }
  };

  const signInWithEmail = async (email, password) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      await fetchProfile();
      return { success: true };
    } catch (err) {
      addToast({ type: 'error', message: 'Invalid email or password' });
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (email, password, name) => {
    setLoading(true);
    try {
      // Create the account via backend (admin-created, auto email-confirmed)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || 'Sign up failed');
      }

      // Immediately sign in to establish a real session
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;

      await fetchProfile();
      addToast({ type: 'success', message: 'Account created! Welcome to RoutineOS.' });
      return { success: true };
    } catch (err) {
      addToast({ type: 'error', message: err.message || 'Sign up failed' });
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    clearUser();
  };

  const refreshProfile = () => fetchProfile();

  return {
    user,
    loading,
    initializing,
    isAuthenticated: !!user,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    refreshProfile,
  };
}