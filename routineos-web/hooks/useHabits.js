'use client';
import { useState, useCallback } from 'react';
import { habitsApi } from '../lib/api';
import useStore from '../store/useStore';

export function useHabits() {
  const { currentMode, addToast } = useStore();
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHabits = useCallback(async (mode) => {
    setLoading(true);
    setError(null);
    try {
      const res = await habitsApi.getAll(mode || currentMode);
      setHabits(res.data || []);
      return res.data;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [currentMode]);

  const createHabit = async (habitData) => {
    try {
      const res = await habitsApi.create(habitData);
      setHabits(prev => [...prev, res.data].sort((a, b) => a.sort_order - b.sort_order));
      addToast({ type: 'success', message: `"${res.data.name}" added to your routine` });
      return { success: true, data: res.data };
    } catch (err) {
      addToast({ type: 'error', message: err.message || 'Failed to create habit' });
      return { success: false };
    }
  };

  const updateHabit = async (id, updates) => {
    // Optimistic update
    setHabits(prev => prev.map(h => h.id === id ? { ...h, ...updates } : h));
    try {
      const res = await habitsApi.update(id, updates);
      setHabits(prev => prev.map(h => h.id === id ? res.data : h));
      return { success: true, data: res.data };
    } catch (err) {
      // Revert on failure
      await fetchHabits();
      addToast({ type: 'error', message: 'Failed to update habit' });
      return { success: false };
    }
  };

  const deleteHabit = async (id) => {
    const original = habits;
    setHabits(prev => prev.filter(h => h.id !== id));
    try {
      await habitsApi.delete(id);
      addToast({ type: 'success', message: 'Habit removed' });
      return { success: true };
    } catch (err) {
      setHabits(original);
      addToast({ type: 'error', message: 'Failed to remove habit' });
      return { success: false };
    }
  };

  const reorderHabits = async (reordered) => {
    setHabits(reordered);
    try {
      const order = reordered.map((h, index) => ({ id: h.id, sort_order: index }));
      await habitsApi.reorder(order);
    } catch {
      await fetchHabits();
    }
  };

  const getMicroSuggestion = async (habitId) => {
    try {
      const res = await habitsApi.suggestMicro(habitId);
      const microVersion = res.data?.microVersion;
      setHabits(prev => prev.map(h => h.id === habitId ? { ...h, micro_version: microVersion } : h));
      return microVersion;
    } catch (err) {
      addToast({ type: 'error', message: 'Could not generate micro habit' });
      return null;
    }
  };

  return {
    habits,
    loading,
    error,
    fetchHabits,
    createHabit,
    updateHabit,
    deleteHabit,
    reorderHabits,
    getMicroSuggestion,
  };
}