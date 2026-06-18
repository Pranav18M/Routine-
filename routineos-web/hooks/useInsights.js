'use client';
import { useState, useCallback } from 'react';
import { insightsApi } from '../lib/api';
import useStore from '../store/useStore';

export function useInsights() {
  const { addToast } = useStore();
  const [weeklyInsights, setWeeklyInsights] = useState([]);
  const [chartData, setChartData] = useState({ dailyData: [], habitData: [] });
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  const fetchWeeklyInsights = useCallback(async () => {
    setLoading(true);
    try {
      const res = await insightsApi.getWeekly();
      setWeeklyInsights(res.data || []);
      return res.data;
    } catch {
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchChartData = useCallback(async (days = 30) => {
    try {
      const res = await insightsApi.getCharts(days);
      setChartData(res.data || { dailyData: [], habitData: [] });
      return res.data;
    } catch {
      return { dailyData: [], habitData: [] };
    }
  }, []);

  const generateInsight = async () => {
    setGenerating(true);
    try {
      const res = await insightsApi.generate();
      if (res.data) {
        setWeeklyInsights(prev => {
          const exists = prev.find(i => i.id === res.data.id);
          if (exists) return prev;
          return [res.data, ...prev];
        });
        addToast({ type: 'success', message: 'Weekly insight generated!' });
      } else {
        addToast({ type: 'info', message: res.message });
      }
      return { success: true };
    } catch (err) {
      addToast({ type: 'error', message: err.message || 'Not enough data for insights yet' });
      return { success: false };
    } finally {
      setGenerating(false);
    }
  };

  return {
    weeklyInsights,
    chartData,
    loading,
    generating,
    fetchWeeklyInsights,
    fetchChartData,
    generateInsight,
  };
}