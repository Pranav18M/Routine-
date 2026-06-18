const supabase = require('../config/supabase');
const { sendSuccess, sendError } = require('../utils/responseHelper');
const { sendBuddyNudge } = require('../services/fcmService');
const { v4: uuidv4 } = require('uuid');

/**
 * GET /api/buddy
 * Returns buddy info + their consistency score
 */
async function getBuddy(req, res, next) {
  try {
    if (!req.user.buddy_id) {
      return sendSuccess(res, null, 'No buddy connected');
    }

    const { data: buddy, error } = await supabase
      .from('users')
      .select('id, name, avatar_url, consistency_score, current_mode')
      .eq('id', req.user.buddy_id)
      .single();

    if (error || !buddy) {
      return sendSuccess(res, null, 'Buddy not found');
    }

    // Check if buddy has logged anything today
    const today = new Date().toLocaleDateString('en-CA');
    const { data: todayLogs } = await supabase
      .from('habit_logs')
      .select('id')
      .eq('user_id', buddy.id)
      .eq('date', today)
      .limit(1);

    return sendSuccess(res, {
      ...buddy,
      loggedToday: (todayLogs || []).length > 0,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/buddy/connect
 * Connects to a buddy using their 6-digit invite code
 */
async function connectBuddy(req, res, next) {
  try {
    const { inviteCode } = req.body;

    if (!inviteCode || inviteCode.length !== 6) {
      return sendError(res, 'A valid 6-character invite code is required', 400);
    }

    // Find user with this code stored in their profile
    // The invite code is derived from the user's ID for simplicity
    const { data: users, error } = await supabase
      .from('users')
      .select('id, name, buddy_id')
      .filter('id::text', 'like', `${inviteCode.toLowerCase()}%`);

    // Alternative: look up by a dedicated invite_code field
    // For now we search by UUID prefix
    if (error || !users || users.length === 0) {
      return sendError(res, 'No user found with that invite code', 404);
    }

    const targetUser = users[0];

    if (targetUser.id === req.user.id) {
      return sendError(res, 'You cannot buddy with yourself', 400);
    }

    if (req.user.buddy_id) {
      return sendError(res, 'You already have a buddy. Remove them first.', 409);
    }

    // Set buddy relationship both ways
    const [meUpdate, themUpdate] = await Promise.all([
      supabase.from('users').update({ buddy_id: targetUser.id }).eq('id', req.user.id),
      supabase.from('users').update({ buddy_id: req.user.id }).eq('id', targetUser.id),
    ]);

    if (meUpdate.error || themUpdate.error) {
      return sendError(res, 'Failed to connect buddy', 500);
    }

    return sendSuccess(res, { buddyName: targetUser.name }, 'Buddy connected!');
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/buddy
 * Removes buddy connection
 */
async function removeBuddy(req, res, next) {
  try {
    if (!req.user.buddy_id) {
      return sendError(res, 'No buddy to remove', 400);
    }

    await Promise.all([
      supabase.from('users').update({ buddy_id: null }).eq('id', req.user.id),
      supabase.from('users').update({ buddy_id: null }).eq('id', req.user.buddy_id),
    ]);

    return sendSuccess(res, null, 'Buddy removed');
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/buddy/nudge
 * Sends a push notification nudge to buddy
 */
async function nudgeBuddy(req, res, next) {
  try {
    if (!req.user.buddy_id) {
      return sendError(res, 'No buddy to nudge', 400);
    }

    const { data: buddy, error } = await supabase
      .from('users')
      .select('fcm_token, name')
      .eq('id', req.user.buddy_id)
      .single();

    if (error || !buddy) {
      return sendError(res, 'Buddy not found', 404);
    }

    if (!buddy.fcm_token) {
      return sendError(res, 'Buddy has not enabled notifications', 400);
    }

    await sendBuddyNudge({
      fcmToken: buddy.fcm_token,
      senderName: req.user.name || 'Your buddy',
    });

    return sendSuccess(res, null, 'Nudge sent!');
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/buddy/invite-code
 * Returns the user's 6-char invite code (first 6 chars of UUID)
 */
async function getInviteCode(req, res, next) {
  try {
    const code = req.user.id.replace(/-/g, '').substring(0, 6).toUpperCase();
    return sendSuccess(res, { code });
  } catch (err) {
    next(err);
  }
}

module.exports = { getBuddy, connectBuddy, removeBuddy, nudgeBuddy, getInviteCode };