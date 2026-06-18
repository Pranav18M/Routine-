const supabase = require('../config/supabase');
const { sendSuccess, sendError } = require('../utils/responseHelper');
const { generateWeeklyInsight } = require('../services/geminiService');
const { aggregateWeeklyStats, saveWeeklyInsight, getRecentInsights } = require('../services/insightService');
const { getWeekStart } = require('../utils/dateHelper');

/**
 * GET /api/insights/weekly
 * Returns recent weekly insights
 */
async function getWeeklyInsights(req, res, next) {
  try {
    const insights = await getRecentInsights(req.user.id, 6);
    return sendSuccess(res, insights);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/insights/generate
 * Manually triggers weekly insight generation for current user
 */
async function generateInsight(req, res, next) {
  try {
    const weekStart = getWeekStart(req.user.timezone || 'Asia/Kolkata');

    // Check if insight already exists for this week
    const { data: existing } = await supabase
      .from('weekly_insights')
      .select('id, created_at')
      .eq('user_id', req.user.id)
      .eq('week_start', weekStart)
      .single();

    if (existing) {
      return sendSuccess(res, existing, 'Insight already generated for this week');
    }

    const weekData = await aggregateWeeklyStats(req.user.id, weekStart);

    if (!weekData) {
      return sendError(res, 'Not enough data to generate insights yet — keep logging!', 400);
    }

    const insightText = await generateWeeklyInsight({
      userName: req.user.name,
      weekData,
    });

    const saved = await saveWeeklyInsight({
      userId: req.user.id,
      weekStart,
      insightText,
      weekData,
    });

    return sendSuccess(res, saved, 'Weekly insight generated', 201);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/insights/charts
 * Returns data for the completion charts (last 30 days by default)
 */
async function getChartData(req, res, next) {
  try {
    const { days = 30 } = req.query;
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - parseInt(days));
    const fromStr = fromDate.toLocaleDateString('en-CA');

    const { data: logs, error } = await supabase
      .from('habit_logs')
      .select('date, status, habits(name, category)')
      .eq('user_id', req.user.id)
      .gte('date', fromStr)
      .order('date', { ascending: true });

    if (error) throw error;

    // Daily completion rate
    const dailyStats = {};
    const habitStats = {};

    for (const log of (logs || [])) {
      // Daily
      if (!dailyStats[log.date]) dailyStats[log.date] = { completed: 0, total: 0 };
      dailyStats[log.date].total++;
      if (['completed', 'micro'].includes(log.status)) dailyStats[log.date].completed++;

      // Per-habit
      const habitName = log.habits?.name;
      if (habitName) {
        if (!habitStats[habitName]) habitStats[habitName] = { completed: 0, total: 0, category: log.habits?.category };
        habitStats[habitName].total++;
        if (['completed', 'micro'].includes(log.status)) habitStats[habitName].completed++;
      }
    }

    const dailyData = Object.entries(dailyStats).map(([date, s]) => ({
      date,
      completed: s.completed,
      total: s.total,
      pct: s.total > 0 ? Math.round((s.completed / s.total) * 100) : 0,
    }));

    const habitData = Object.entries(habitStats).map(([name, s]) => ({
      name,
      category: s.category,
      completed: s.completed,
      total: s.total,
      pct: s.total > 0 ? Math.round((s.completed / s.total) * 100) : 0,
    })).sort((a, b) => b.pct - a.pct);

    return sendSuccess(res, { dailyData, habitData });
  } catch (err) {
    next(err);
  }
}

module.exports = { getWeeklyInsights, generateInsight, getChartData };