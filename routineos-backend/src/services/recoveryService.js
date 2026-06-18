const supabase = require('../config/supabase');
const { getTodayInTimezone, getDaysAgo } = require('../utils/dateHelper');

/**
 * Checks if a user has missed 2+ consecutive days and needs recovery
 */
async function checkUserNeedsRecovery(userId, timezone = 'Asia/Kolkata') {
  // Get active recovery session — don't create another if one is active
  const { data: activeSession } = await supabase
    .from('recovery_sessions')
    .select('id')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single();

  if (activeSession) return false;

  // Check last 3 days for any completed logs
  const today = getTodayInTimezone(timezone);
  const twoDaysAgo = getDaysAgo(2, timezone);

  const { data: recentLogs, error } = await supabase
    .from('habit_logs')
    .select('date')
    .eq('user_id', userId)
    .in('status', ['completed', 'micro'])
    .gte('date', twoDaysAgo)
    .lt('date', today);

  if (error) throw error;

  // If no completed logs in last 2 days, user needs recovery
  const uniqueDaysWithLogs = new Set(recentLogs?.map(l => l.date) || []);
  const missedDays = 2 - uniqueDaysWithLogs.size;

  return missedDays >= 2;
}

/**
 * Creates a recovery session record in the DB
 */
async function createRecoverySession({ userId, missedDays, reason, recoveryPlan }) {
  const endsAt = new Date();
  endsAt.setDate(endsAt.getDate() + 3);

  const { data, error } = await supabase
    .from('recovery_sessions')
    .insert({
      user_id: userId,
      missed_days: missedDays,
      reason,
      recovery_plan: recoveryPlan,
      status: 'active',
      ends_at: endsAt.toLocaleDateString('en-CA'),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Gets the active recovery session for a user
 */
async function getActiveRecoverySession(userId) {
  const { data, error } = await supabase
    .from('recovery_sessions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('triggered_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}

/**
 * Completes a recovery session
 */
async function completeRecoverySession(sessionId) {
  const { error } = await supabase
    .from('recovery_sessions')
    .update({ status: 'completed' })
    .eq('id', sessionId);

  if (error) throw error;
}

/**
 * Scans all users and flags those who need recovery
 * Returns array of user IDs that need recovery
 */
async function detectUsersNeedingRecovery() {
  const { data: users, error } = await supabase
    .from('users')
    .select('id, timezone')
    .eq('onboarding_done', true);

  if (error) {
    console.error('Recovery detection fetch error:', error.message);
    return [];
  }

  const needsRecovery = [];

  for (const user of users) {
    try {
      const needs = await checkUserNeedsRecovery(user.id, user.timezone);
      if (needs) needsRecovery.push(user.id);
    } catch (err) {
      console.error(`Recovery check failed for user ${user.id}:`, err.message);
    }
  }

  return needsRecovery;
}

module.exports = {
  checkUserNeedsRecovery,
  createRecoverySession,
  getActiveRecoverySession,
  completeRecoverySession,
  detectUsersNeedingRecovery,
};