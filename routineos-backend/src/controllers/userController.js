const supabase = require('../config/supabase');
const { sendSuccess, sendError } = require('../utils/responseHelper');
const { generateRoutine } = require('../services/geminiService');

/**
 * GET /api/user/me
 */
async function getProfile(req, res, next) {
  try {
    return sendSuccess(res, req.user);
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/user/me
 */
async function updateProfile(req, res, next) {
  try {
    const { name, avatar_url, wake_time, sleep_time, timezone, fcm_token } = req.body;

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (avatar_url !== undefined) updates.avatar_url = avatar_url;
    if (wake_time !== undefined) updates.wake_time = wake_time;
    if (sleep_time !== undefined) updates.sleep_time = sleep_time;
    if (timezone !== undefined) updates.timezone = timezone;
    if (fcm_token !== undefined) updates.fcm_token = fcm_token;

    if (Object.keys(updates).length === 0) {
      return sendError(res, 'No valid fields to update', 400);
    }

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', req.user.id)
      .select()
      .single();

    if (error) throw error;

    return sendSuccess(res, data, 'Profile updated');
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/user/onboarding
 * Completes onboarding: saves schedule + generates AI routine
 */
async function completeOnboarding(req, res, next) {
  try {
    const { name, wakeTime, sleepTime, goals, workSchedule, timezone } = req.body;

    if (!wakeTime || !sleepTime || !goals?.length) {
      return sendError(res, 'Wake time, sleep time, and goals are required', 400);
    }

    // Update user schedule
    const { error: userError } = await supabase
      .from('users')
      .update({
        name: name || req.user.name,
        wake_time: wakeTime,
        sleep_time: sleepTime,
        timezone: timezone || 'Asia/Kolkata',
      })
      .eq('id', req.user.id);

    if (userError) throw userError;

    // Generate routine via Gemini
    const habits = await generateRoutine({
      name: name || req.user.name,
      wakeTime,
      sleepTime,
      goals,
      workSchedule,
    });

    if (!Array.isArray(habits)) {
      return sendError(res, 'AI routine generation failed', 500);
    }

    // Insert generated habits
    const habitRows = habits.map((habit, index) => ({
      user_id: req.user.id,
      name: habit.name,
      category: habit.category || 'personal',
      icon: habit.icon || '✅',
      scheduled_time: habit.scheduled_time,
      duration_mins: habit.duration_mins || 30,
      active_modes: habit.active_modes || ['normal'],
      sort_order: habit.sort_order ?? index,
    }));

    const { data: insertedHabits, error: habitError } = await supabase
      .from('habits')
      .insert(habitRows)
      .select();

    if (habitError) throw habitError;

    // Mark onboarding as complete
    await supabase
      .from('users')
      .update({ onboarding_done: true })
      .eq('id', req.user.id);

    return sendSuccess(res, { habits: insertedHabits }, 'Onboarding complete', 201);
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/user/mode
 * Switches life mode
 */
async function switchMode(req, res, next) {
  try {
    const { mode, durationDays } = req.body;
    const validModes = ['normal', 'exam', 'travel', 'sick', 'grind'];

    if (!validModes.includes(mode)) {
      return sendError(res, `Invalid mode. Must be one of: ${validModes.join(', ')}`, 400);
    }

    const updates = { current_mode: mode };

    if (durationDays && durationDays > 0) {
      const modeUntil = new Date();
      modeUntil.setDate(modeUntil.getDate() + parseInt(durationDays));
      updates.mode_until = modeUntil.toLocaleDateString('en-CA');
    } else {
      updates.mode_until = null;
    }

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', req.user.id)
      .select('id, current_mode, mode_until')
      .single();

    if (error) throw error;

    return sendSuccess(res, data, `Switched to ${mode} mode`);
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/user/me
 * Deletes user account and all data
 */
async function deleteAccount(req, res, next) {
  try {
    // Cascade deletes handle habits, logs, etc.
    const { error } = await supabase.auth.admin.deleteUser(req.user.id);
    if (error) throw error;

    return sendSuccess(res, null, 'Account deleted');
  } catch (err) {
    next(err);
  }
}

module.exports = { getProfile, updateProfile, completeOnboarding, switchMode, deleteAccount };