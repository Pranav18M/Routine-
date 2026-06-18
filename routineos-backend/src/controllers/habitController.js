const supabase = require('../config/supabase');
const { sendSuccess, sendError } = require('../utils/responseHelper');
const { suggestMicroHabit } = require('../services/geminiService');

/**
 * GET /api/habits
 * Returns all active habits for the current user, filtered by current mode
 */
async function getHabits(req, res, next) {
  try {
    const { mode } = req.query;
    const activeMode = mode || req.user.current_mode || 'normal';

    let query = supabase
      .from('habits')
      .select('*')
      .eq('user_id', req.user.id)
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    // Filter by mode if not fetching all
    if (mode !== 'all') {
      query = query.contains('active_modes', [activeMode]);
    }

    const { data, error } = await query;

    if (error) throw error;

    return sendSuccess(res, data || []);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/habits
 * Creates a new habit
 */
async function createHabit(req, res, next) {
  try {
    const { name, category, icon, scheduled_time, duration_mins, active_modes, sort_order } = req.body;

    if (!name || !category) {
      return sendError(res, 'Name and category are required', 400);
    }

    const validCategories = ['health', 'study', 'skill', 'mindfulness', 'personal'];
    if (!validCategories.includes(category)) {
      return sendError(res, `Category must be one of: ${validCategories.join(', ')}`, 400);
    }

    const { data, error } = await supabase
      .from('habits')
      .insert({
        user_id: req.user.id,
        name,
        category,
        icon: icon || '✅',
        scheduled_time: scheduled_time || null,
        duration_mins: duration_mins || 30,
        active_modes: active_modes || ['normal'],
        sort_order: sort_order ?? 999,
      })
      .select()
      .single();

    if (error) throw error;

    return sendSuccess(res, data, 'Habit created', 201);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/habits/:id
 */
async function getHabit(req, res, next) {
  try {
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (error || !data) {
      return sendError(res, 'Habit not found', 404);
    }

    return sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/habits/:id
 */
async function updateHabit(req, res, next) {
  try {
    const { name, category, icon, scheduled_time, duration_mins, active_modes, sort_order, is_active } = req.body;

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (category !== undefined) updates.category = category;
    if (icon !== undefined) updates.icon = icon;
    if (scheduled_time !== undefined) updates.scheduled_time = scheduled_time;
    if (duration_mins !== undefined) updates.duration_mins = duration_mins;
    if (active_modes !== undefined) updates.active_modes = active_modes;
    if (sort_order !== undefined) updates.sort_order = sort_order;
    if (is_active !== undefined) updates.is_active = is_active;

    const { data, error } = await supabase
      .from('habits')
      .update(updates)
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error || !data) {
      return sendError(res, 'Habit not found or update failed', 404);
    }

    return sendSuccess(res, data, 'Habit updated');
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/habits/:id
 * Soft delete — sets is_active to false
 */
async function deleteHabit(req, res, next) {
  try {
    const { error } = await supabase
      .from('habits')
      .update({ is_active: false })
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);

    if (error) throw error;

    return sendSuccess(res, null, 'Habit removed');
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/habits/:id/suggest-micro
 * AI suggests a 2-minute micro version
 */
async function suggestMicro(req, res, next) {
  try {
    const { data: habit, error } = await supabase
      .from('habits')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (error || !habit) {
      return sendError(res, 'Habit not found', 404);
    }

    const microVersion = await suggestMicroHabit({
      habitName: habit.name,
      durationMins: habit.duration_mins,
      category: habit.category,
    });

    // Save to habit record
    await supabase
      .from('habits')
      .update({ micro_version: microVersion })
      .eq('id', habit.id);

    return sendSuccess(res, { microVersion }, 'Micro habit generated');
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/habits/reorder
 * Updates sort_order for multiple habits in one call
 */
async function reorderHabits(req, res, next) {
  try {
    const { order } = req.body; // Array of { id, sort_order }

    if (!Array.isArray(order)) {
      return sendError(res, 'order must be an array of { id, sort_order }', 400);
    }

    const updates = order.map(({ id, sort_order }) =>
      supabase
        .from('habits')
        .update({ sort_order })
        .eq('id', id)
        .eq('user_id', req.user.id)
    );

    await Promise.all(updates);

    return sendSuccess(res, null, 'Habits reordered');
  } catch (err) {
    next(err);
  }
}

module.exports = { getHabits, createHabit, getHabit, updateHabit, deleteHabit, suggestMicro, reorderHabits };