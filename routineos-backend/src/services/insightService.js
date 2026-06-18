const supabase = require('../config/supabase');
const { getDayName, getLastNDays } = require('../utils/dateHelper');

/**
 * Aggregates last 7 days of habit logs for a user into insight stats
 */
async function aggregateWeeklyStats(userId, weekStart) {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);
  const weekEndStr = weekEnd.toLocaleDateString('en-CA');

  const { data: logs, error } = await supabase
    .from('habit_logs')
    .select('date, status, habit_id, habits(name)')
    .eq('user_id', userId)
    .gte('date', weekStart)
    .lt('date', weekEndStr);

  if (error) throw error;
  if (!logs || logs.length === 0) return null;

  // Group by date
  const byDate = {};
  for (const log of logs) {
    if (!byDate[log.date]) byDate[log.date] = { completed: 0, total: 0 };
    byDate[log.date].total++;
    if (log.status === 'completed' || log.status === 'micro') {
      byDate[log.date].completed++;
    }
  }

  // Find best and worst days
  let bestDay = null;
  let worstDay = null;
  let bestPct = -1;
  let worstPct = 101;

  for (const [date, stats] of Object.entries(byDate)) {
    const pct = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
    if (pct > bestPct) { bestPct = pct; bestDay = date; }
    if (pct < worstPct) { worstPct = pct; worstDay = date; }
  }

  // Find top and worst habits by completion rate
  const byHabit = {};
  for (const log of logs) {
    const habitName = log.habits?.name || 'Unknown';
    if (!byHabit[habitName]) byHabit[habitName] = { completed: 0, total: 0 };
    byHabit[habitName].total++;
    if (log.status === 'completed' || log.status === 'micro') {
      byHabit[habitName].completed++;
    }
  }

  let topHabit = null;
  let worstHabit = null;
  let topRate = -1;
  let worstRate = 101;

  for (const [name, stats] of Object.entries(byHabit)) {
    const rate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
    if (rate > topRate) { topRate = rate; topHabit = name; }
    if (rate < worstRate) { worstRate = rate; worstHabit = name; }
  }

  const totalCompleted = logs.filter(l => l.status === 'completed' || l.status === 'micro').length;
  const completionPct = logs.length > 0 ? Math.round((totalCompleted / logs.length) * 100) : 0;

  return {
    bestDay: getDayName(bestDay),
    bestDayPct: Math.round(bestPct),
    worstDay: getDayName(worstDay),
    worstDayPct: Math.round(worstPct),
    topHabit,
    worstHabit,
    completionPct,
    completedCount: totalCompleted,
    totalCount: logs.length,
  };
}

/**
 * Saves a weekly insight record
 */
async function saveWeeklyInsight({ userId, weekStart, insightText, weekData }) {
  const { data, error } = await supabase
    .from('weekly_insights')
    .upsert({
      user_id: userId,
      week_start: weekStart,
      insight_text: insightText,
      best_day: weekData.bestDay,
      worst_day: weekData.worstDay,
      top_habit: weekData.topHabit,
      consistency_pct: weekData.completionPct,
    }, { onConflict: 'user_id,week_start' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Gets the last N weekly insights for a user
 */
async function getRecentInsights(userId, limit = 4) {
  const { data, error } = await supabase
    .from('weekly_insights')
    .select('*')
    .eq('user_id', userId)
    .order('week_start', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

module.exports = {
  aggregateWeeklyStats,
  saveWeeklyInsight,
  getRecentInsights,
};