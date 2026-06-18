const cron = require('node-cron');
const { recalculateAllScores } = require('../services/consistencyService');

/**
 * Runs every night at 11:30 PM to recalculate all consistency scores
 */
function startConsistencyCalculatorCron() {
  cron.schedule('30 23 * * *', () => {
    console.log('[Consistency Calculator] Starting nightly recalculation');
    recalculateAllScores().catch(err =>
      console.error('[Consistency Calculator] Cron error:', err.message)
    );
  });
  console.log('[Consistency Calculator] Cron scheduled (nightly 11:30 PM)');
}

module.exports = { startConsistencyCalculatorCron };