const supabase = require('../config/supabase');

const MODE_WEIGHTS = {
  normal: 1.0,
  grind: 1.0,
  exam: 0.3,
  travel: 0.5,
  sick: 0.2,
};

/**
 * Calculates consistency score for a single user based on last 30 days of logs.
 * Score = weighted completion percentage (0–100).
 */
async function calculateConsistencyScore(userId) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const fromDate = thirtyDaysAgo.toLocaleDateString('en-CA');

  const { data: logs, error } = await supabase
    .from('habit_logs')
    .select('status, active_mode')
    .eq('user_id', userId)
    .gte('date', fromDate);

  if (error) throw error;
  if (!logs || logs.length === 0) return 0;

  let weightedCompleted = 0;
  let weightedTotal = 0;

  for (const log of logs) {
    const weight = MODE_WEIGHTS[log.active_mode] ?? 1.0;
    weightedTotal += weight;
    if (log.status === 'completed' || log.status === 'micro') {
      weightedCompleted += weight;
    }
  }

  if (weightedTotal === 0) return 0;

  const score = (weightedCompleted / weightedTotal) * 100;
  return Math.min(100, Math.max(0, Math.round(score * 10) / 10));
}

/**
 * Saves the consistency score to the users table
 */
async function saveConsistencyScore(userId, score) {
  const { error } = await supabase
    .from('users')
    .update({ consistency_score: score })
    .eq('id', userId);

  if (error) throw error;
  return score;
}

/**
 * Calculates and saves consistency scores for all users
 */
async function recalculateAllScores() {
  const { data: users, error } = await supabase
    .from('users')
    .select('id')
    .eq('onboarding_done', true);

  if (error) {
    console.error('Failed to fetch users for consistency calculation:', error.message);
    return;
  }

  let successCount = 0;
  let errorCount = 0;

  for (const user of users) {
    try {
      const score = await calculateConsistencyScore(user.id);
      await saveConsistencyScore(user.id, score);
      successCount++;
    } catch (err) {
      console.error(`Score calculation failed for user ${user.id}:`, err.message);
      errorCount++;
    }
  }

  console.log(`Consistency scores updated: ${successCount} success, ${errorCount} errors`);
}

module.exports = {
  calculateConsistencyScore,
  saveConsistencyScore,
  recalculateAllScores,
};