const cron = require('node-cron');
const supabase = require('../config/supabase');
const { generateMorningBriefing } = require('../services/geminiService');
const { sendMorningBriefing } = require('../services/fcmService');
const { getTodayInTimezone } = require('../utils/dateHelper');

/**
 * Generates and sends morning briefings for all users
 * Runs at 6:00 AM per user timezone (approximated by running every 30 min)
 */
async function runMorningBriefings() {
  console.log('[Morning Briefing] Cron started at', new Date().toISOString());

  const currentHour = new Date().getUTCHours();

  // Fetch users where it's approximately 6 AM in their timezone
  const { data: users, error } = await supabase
    .from('users')
    .select('id, name, fcm_token, timezone, current_mode, consistency_score')
    .eq('onboarding_done', true)
    .not('fcm_token', 'is', null);

  if (error) {
    console.error('[Morning Briefing] Failed to fetch users:', error.message);
    return;
  }

  let successCount = 0;
  let errorCount = 0;

  for (const user of (users || [])) {
    try {
      // Check if it's approximately 6 AM in user's timezone
      const localHour = new Date().toLocaleTimeString('en-US', {
        timeZone: user.timezone || 'Asia/Kolkata',
        hour12: false,
        hour: '2-digit',
      });

      if (parseInt(localHour) !== 6) continue;

      const today = getTodayInTimezone(user.timezone);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const fromDate = sevenDaysAgo.toLocaleDateString('en-CA');

      // Fetch last 7 days of logs + today's habits
      const [{ data: recentLogs }, { data: todayHabits }] = await Promise.all([
        supabase
          .from('habit_logs')
          .select('status, date')
          .eq('user_id', user.id)
          .gte('date', fromDate),
        supabase
          .from('habits')
          .select('name, category')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .contains('active_modes', [user.current_mode || 'normal']),
      ]);

      if (!todayHabits || todayHabits.length === 0) continue;

      const briefingText = await generateMorningBriefing({
        userName: user.name,
        todayHabits: todayHabits || [],
        last7DaysLogs: recentLogs || [],
        consistencyScore: user.consistency_score,
        currentMode: user.current_mode,
      });

      await sendMorningBriefing({
        fcmToken: user.fcm_token,
        userName: user.name,
        briefingText,
      });

      successCount++;
    } catch (err) {
      console.error(`[Morning Briefing] Failed for user ${user.id}:`, err.message);
      errorCount++;
    }
  }

  console.log(`[Morning Briefing] Done: ${successCount} sent, ${errorCount} failed`);
}

/**
 * Starts the morning briefing cron — runs every 30 minutes to catch all timezones
 */
function startCronJobs() {
  cron.schedule('0,30 * * * *', () => {
    runMorningBriefings().catch(err =>
      console.error('[Morning Briefing] Cron error:', err.message)
    );
  });
  console.log('[Morning Briefing] Cron scheduled (every 30 minutes)');
}

module.exports = { startCronJobs, runMorningBriefings };