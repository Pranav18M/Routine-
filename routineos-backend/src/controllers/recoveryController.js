const supabase = require('../config/supabase');
const { sendSuccess, sendError } = require('../utils/responseHelper');
const { generateRecoveryPlan } = require('../services/geminiService');
const {
  createRecoverySession,
  getActiveRecoverySession,
  completeRecoverySession,
  checkUserNeedsRecovery,
} = require('../services/recoveryService');

/**
 * GET /api/recovery/status
 * Checks if user needs recovery and returns active session
 */
async function getRecoveryStatus(req, res, next) {
  try {
    const activeSession = await getActiveRecoverySession(req.user.id);
    const needsRecovery = !activeSession
      ? await checkUserNeedsRecovery(req.user.id, req.user.timezone)
      : false;

    return sendSuccess(res, {
      needsRecovery,
      activeSession: activeSession || null,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/recovery/generate
 * Generates a recovery plan for a user with AI
 */
async function generateRecovery(req, res, next) {
  try {
    const { reason, missedDays } = req.body;

    const validReasons = ['exam', 'travel', 'sick', 'other'];
    if (!reason || !validReasons.includes(reason)) {
      return sendError(res, `Reason must be one of: ${validReasons.join(', ')}`, 400);
    }

    // Fetch user's active habits
    const { data: habits, error: habitsError } = await supabase
      .from('habits')
      .select('name, category, duration_mins')
      .eq('user_id', req.user.id)
      .eq('is_active', true)
      .order('sort_order');

    if (habitsError) throw habitsError;

    if (!habits || habits.length === 0) {
      return sendError(res, 'No active habits found to build a recovery plan', 400);
    }

    // Generate recovery plan via AI
    const recoveryPlan = await generateRecoveryPlan({
      userName: req.user.name,
      reason,
      habits,
      missedDays: missedDays || 2,
    });

    if (!recoveryPlan?.day1) {
      return sendError(res, 'Failed to generate recovery plan', 500);
    }

    // Save recovery session
    const session = await createRecoverySession({
      userId: req.user.id,
      missedDays: missedDays || 2,
      reason,
      recoveryPlan,
    });

    return sendSuccess(res, session, 'Recovery plan created', 201);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/recovery/:id/complete
 * Marks a recovery session as complete
 */
async function completeRecovery(req, res, next) {
  try {
    // Verify session belongs to user
    const { data: session, error } = await supabase
      .from('recovery_sessions')
      .select('id, user_id')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (error || !session) {
      return sendError(res, 'Recovery session not found', 404);
    }

    await completeRecoverySession(session.id);

    return sendSuccess(res, null, 'Recovery complete — welcome back!');
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/recovery/history
 */
async function getRecoveryHistory(req, res, next) {
  try {
    const { data, error } = await supabase
      .from('recovery_sessions')
      .select('*')
      .eq('user_id', req.user.id)
      .order('triggered_at', { ascending: false })
      .limit(10);

    if (error) throw error;

    return sendSuccess(res, data || []);
  } catch (err) {
    next(err);
  }
}

module.exports = { getRecoveryStatus, generateRecovery, completeRecovery, getRecoveryHistory };