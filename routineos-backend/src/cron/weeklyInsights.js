const cron = require('node-cron');
const supabase = require('../config/supabase');
const { generateWeeklyInsight } = require('../services/geminiService');
const { aggregateWeeklyStats, saveWeeklyInsight } = require('../services/insightService');
const { getWeekStart } = require('../utils/dateHelper');

/**
 * Generates weekly insights for all users
 */
async function runWeeklyInsights() {
  console.log('[Weekly Insights] Cron started at', new Date().toISOString());

  const { data: users, error } = await supabase
    .from('users')
    .select('id, name, timezone')
    .eq('onboarding_done', true);

  if (error) {
    console.error('[Weekly Insights] Failed to fetch users:', error.message);
    return;
  }

  let successCount = 0;
  let errorCount = 0;

  for (const user of (users || [])) {
    try {
      const weekStart = getWeekStart(user.timezone || 'Asia/Kolkata');

      // Skip if already generated this week
      const { data: existing } = await supabase
        .from('weekly_insights')
        .select('id')
        .eq('user_id', user.id)
        .eq('week_start', weekStart)
        .single();

      if (existing) continue;

      const weekData = await aggregateWeeklyStats(user.id, weekStart);
      if (!weekData) continue;

      const insightText = await generateWeeklyInsight({
        userName: user.name,
        weekData,
      });

      await saveWeeklyInsight({
        userId: user.id,
        weekStart,
        insightText,
        weekData,
      });

      successCount++;

      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (err) {
      console.error(`[Weekly Insights] Failed for user ${user.id}:`, err.message);
      errorCount++;
    }
  }

  console.log(`[Weekly Insights] Done: ${successCount} generated, ${errorCount} failed`);
}

/**
 * Runs every Sunday at 9:00 PM
 */
function startWeeklyInsightsCron() {
  cron.schedule('0 21 * * 0', () => {
    runWeeklyInsights().catch(err =>
      console.error('[Weekly Insights] Cron error:', err.message)
    );
  });
  console.log('[Weekly Insights] Cron scheduled (Sunday 9 PM)');
}

module.exports = { startWeeklyInsightsCron, runWeeklyInsights };