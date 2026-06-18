'use client';
import { useState, useCallback } from 'react';
import { buddyApi } from '../lib/api';
import useStore from '../store/useStore';

export function useBuddy() {
  const { addToast } = useStore();
  const [buddy, setBuddy] = useState(null);
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [nudging, setNudging] = useState(false);

  const fetchBuddy = useCallback(async () => {
    setLoading(true);
    try {
      const res = await buddyApi.get();
      setBuddy(res.data);
      return res.data;
    } catch {
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchInviteCode = useCallback(async () => {
    try {
      const res = await buddyApi.getInviteCode();
      setInviteCode(res.data?.code || '');
      return res.data?.code;
    } catch {
      return '';
    }
  }, []);

  const connectBuddy = async (code) => {
    try {
      const res = await buddyApi.connect(code.trim().toUpperCase());
      addToast({ type: 'success', message: `Connected with ${res.data?.buddyName}! 🤝` });
      await fetchBuddy();
      return { success: true };
    } catch (err) {
      addToast({ type: 'error', message: err.message || 'Invalid invite code' });
      return { success: false };
    }
  };

  const removeBuddy = async () => {
    try {
      await buddyApi.remove();
      setBuddy(null);
      addToast({ type: 'info', message: 'Buddy removed' });
      return { success: true };
    } catch {
      addToast({ type: 'error', message: 'Failed to remove buddy' });
      return { success: false };
    }
  };

  const nudgeBuddy = async () => {
    setNudging(true);
    try {
      await buddyApi.nudge();
      addToast({ type: 'success', message: 'Nudge sent! 👊' });
      return { success: true };
    } catch (err) {
      addToast({ type: 'error', message: err.message || 'Could not send nudge' });
      return { success: false };
    } finally {
      setNudging(false);
    }
  };

  return {
    buddy,
    inviteCode,
    loading,
    nudging,
    fetchBuddy,
    fetchInviteCode,
    connectBuddy,
    removeBuddy,
    nudgeBuddy,
  };
}