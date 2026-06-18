'use client';
import { useState, useCallback } from 'react';
import { logsApi } from '../lib/api';
import useStore from '../store/useStore';

export function useLogs() {
  const { setTodayLogs, updateLog, addToast } = useStore();
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);

  const fetchTodayLogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await logsApi.getToday();
      setTodayLogs(res.data || []);
      return res.data;
    } catch (err) {
      console.error('Failed to fetch today logs:', err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [setTodayLogs]);

  const fetchLogs = async (from, to, habitId) => {
    setLoading(true);
    try {
      const res = await logsApi.getRange(from, to, habitId);
      setLogs(res.data || []);
      return res.data;
    } catch (err) {
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async (days = 30) => {
    setStatsLoading(true);
    try {
      const res = await logsApi.getStats(days);
      setStats(res.data || []);
      return res.data;
    } catch {
      return [];
    } finally {
      setStatsLoading(false);
    }
  };

  /**
   * Logs a habit with optimistic update
   */
  const logHabit = async (habitId, status, options = {}) => {
    // Optimistic update immediately
    updateLog(habitId, {
      habit_id: habitId,
      status,
      completed_at: status === 'completed' ? new Date().toISOString() : null,
      mood_before: options.moodBefore || null,
      note: options.note || null,
    });

    try {
      const res = await logsApi.log({
        habit_id: habitId,
        status,
        mood_before: options.moodBefore,
        note: options.note,
      });
      // Sync actual server response
      updateLog(habitId, res.data);
      return { success: true, data: res.data };
    } catch (err) {
      // Revert optimistic update
      updateLog(habitId, { status: null });
      addToast({ type: 'error', message: 'Failed to save — check your connection' });
      return { success: false };
    }
  };

  const completionSummary = (todayLogs, habits) => {
    if (!habits?.length) return { completed: 0, total: 0, pct: 0 };
    const total = habits.length;
    const completed = Object.values(todayLogs).filter(
      l => l.status === 'completed' || l.status === 'micro'
    ).length;
    return { completed, total, pct: total > 0 ? Math.round((completed / total) * 100) : 0 };
  };

  return {
    logs,
    stats,
    loading,
    statsLoading,
    fetchTodayLogs,
    fetchLogs,
    fetchStats,
    logHabit,
    completionSummary,
  };
}