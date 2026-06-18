const cron = require('node-cron');
const supabase = require('../config/supabase');
const { detectUsersNeedingRecovery } = require('../services/recoveryService');
const { sendPushNotification } = require('../services/fcmService');

/**
 * Detects users who missed 2+ days and flags them for recovery
 */
async function runRecoveryDetection() {
  console.log('[Recovery Detection] Cron started at', new Date().toISOString());

  const needsRecovery = await detectUsersNeedingRecovery();

  if (needsRecovery.length === 0) {
    console.log('[Recovery Detection] No users need recovery today');
    return;
  }

  console.log(`[Recovery Detection] ${needsRecovery.length} users need recovery`);

  // Send push notification to prompt recovery
  for (const userId of needsRecovery) {
    try {
      const { data: user } = await supabase
        .from('users')
        .select('fcm_token, name')
        .eq('id', userId)
        .single();

      if (!user?.fcm_token) continue;

      await sendPushNotification({
        fcmToken: user.fcm_token,
        title: `Time to rebuild, ${user.name?.split(' ')[0] || 'there'} 💪`,
        body: "Life got in the way — no guilt. Let's start fresh with a 3-day plan.",
        data: { type: 'recovery_needed' },
      });
    } catch (err) {
      console.error(`[Recovery Detection] Notification failed for ${userId}:`, err.message);
    }
  }
}

/**
 * Runs every day at 8:00 PM
 */
function startRecoveryDetectionCron() {
  cron.schedule('0 20 * * *', () => {
    runRecoveryDetection().catch(err =>
      console.error('[Recovery Detection] Cron error:', err.message)
    );
  });
  console.log('[Recovery Detection] Cron scheduled (daily 8 PM)');
}

module.exports = { startRecoveryDetectionCron, runRecoveryDetection };