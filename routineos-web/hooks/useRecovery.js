'use client';
import { useState, useCallback } from 'react';
import { recoveryApi } from '../lib/api';
import useStore from '../store/useStore';

export function useRecovery() {
  const { setRecovery, clearRecovery, addToast } = useStore();
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  const checkRecoveryStatus = useCallback(async () => {
    try {
      const res = await recoveryApi.getStatus();
      const { needsRecovery, activeSession } = res.data;
      setRecovery(activeSession, needsRecovery);
      return { needsRecovery, activeSession };
    } catch {
      return { needsRecovery: false, activeSession: null };
    }
  }, [setRecovery]);

  const generateRecoveryPlan = async (reason, missedDays = 2) => {
    setGenerating(true);
    try {
      const res = await recoveryApi.generate({ reason, missedDays });
      setRecovery(res.data, false);
      addToast({ type: 'success', message: "Recovery plan created — you've got this! 💪" });
      return { success: true, session: res.data };
    } catch (err) {
      addToast({ type: 'error', message: err.message || 'Failed to generate plan' });
      return { success: false };
    } finally {
      setGenerating(false);
    }
  };

  const completeRecovery = async (sessionId) => {
    try {
      await recoveryApi.complete(sessionId);
      clearRecovery();
      addToast({ type: 'success', message: "You're back! Welcome to your full routine. 🎉" });
      return { success: true };
    } catch {
      addToast({ type: 'error', message: 'Failed to complete recovery' });
      return { success: false };
    }
  };

  return {
    loading,
    generating,
    checkRecoveryStatus,
    generateRecoveryPlan,
    completeRecovery,
  };
}