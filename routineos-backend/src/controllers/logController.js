const supabase = require('../config/supabase');
const { sendSuccess, sendError } = require('../utils/responseHelper');
const { getTodayInTimezone } = require('../utils/dateHelper');

/**
 * GET /api/logs/today
 * Returns today's log entries for all habits
 */
async function getTodayLogs(req, res, next) {
  try {
    const today = getTodayInTimezone(req.user.timezone || 'Asia/Kolkata');

    const { data, error } = await supabase
      .from('habit_logs')
      .select('*, habits(name, icon, category, scheduled_time, duration_mins, micro_version)')
      .eq('user_id', req.user.id)
      .eq('date', today);

    if (error) throw error;

    return sendSuccess(res, data || []);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/logs?from=YYYY-MM-DD&to=YYYY-MM-DD
 * Returns logs for a date range
 */
async function getLogs(req, res, next) {
  try {
    const { from, to, habit_id } = req.query;

    if (!from || !to) {
      return sendError(res, 'from and to query parameters are required (YYYY-MM-DD)', 400);
    }

    let query = supabase
      .from('habit_logs')
      .select('*, habits(name, icon, category)')
      .eq('user_id', req.user.id)
      .gte('date', from)
      .lte('date', to)
      .order('date', { ascending: false });

    if (habit_id) query = query.eq('habit_id', habit_id);

    const { data, error } = await query;

    if (error) throw error;

    return sendSuccess(res, data || []);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/logs
 * Creates or updates a habit log entry (upsert)
 * Optimistic: client-driven, we trust client timestamps
 */
async function logHabit(req, res, next) {
  try {
    const { habit_id, status, date, mood_before, note } = req.body;

    if (!habit_id || !status) {
      return sendError(res, 'habit_id and status are required', 400);
    }

    const validStatuses = ['completed', 'skipped', 'micro', 'missed'];
    if (!validStatuses.includes(status)) {
      return sendError(res, `Status must be one of: ${validStatuses.join(', ')}`, 400);
    }

    // Verify habit belongs to user
    const { data: habit, error: habitError } = await supabase
      .from('habits')
      .select('id')
      .eq('id', habit_id)
      .eq('user_id', req.user.id)
      .single();

    if (habitError || !habit) {
      return sendError(res, 'Habit not found', 404);
    }

    const logDate = date || getTodayInTimezone(req.user.timezone || 'Asia/Kolkata');

    const { data, error } = await supabase
      .from('habit_logs')
      .upsert({
        habit_id,
        user_id: req.user.id,
        date: logDate,
        status,
        completed_at: status === 'completed' || status === 'micro' ? new Date().toISOString() : null,
        mood_before: mood_before || null,
        note: note || null,
        active_mode: req.user.current_mode || 'normal',
      }, { onConflict: 'habit_id,date' })
      .select()
      .single();

    if (error) throw error;

    return sendSuccess(res, data, 'Habit logged', 201);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/logs/bulk
 * Logs multiple habits at once (end-of-day batch)
 */
async function bulkLogHabits(req, res, next) {
  try {
    const { logs } = req.body;

    if (!Array.isArray(logs) || logs.length === 0) {
      return sendError(res, 'logs must be a non-empty array', 400);
    }

    const today = getTodayInTimezone(req.user.timezone || 'Asia/Kolkata');
    const currentMode = req.user.current_mode || 'normal';

    // Verify all habits belong to user
    const habitIds = [...new Set(logs.map(l => l.habit_id))];
    const { data: validHabits } = await supabase
      .from('habits')
      .select('id')
      .eq('user_id', req.user.id)
      .in('id', habitIds);

    const validIds = new Set((validHabits || []).map(h => h.id));
    const validLogs = logs.filter(l => validIds.has(l.habit_id));

    if (validLogs.length === 0) {
      return sendError(res, 'No valid habit IDs found', 400);
    }

    const rows = validLogs.map(log => ({
      habit_id: log.habit_id,
      user_id: req.user.id,
      date: log.date || today,
      status: log.status,
      completed_at: log.status === 'completed' ? new Date().toISOString() : null,
      mood_before: log.mood_before || null,
      note: log.note || null,
      active_mode: currentMode,
    }));

    const { data, error } = await supabase
      .from('habit_logs')
      .upsert(rows, { onConflict: 'habit_id,date' })
      .select();

    if (error) throw error;

    return sendSuccess(res, data, `${data.length} habits logged`, 201);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/logs/stats
 * Returns completion stats for charts
 */
async function getLogStats(req, res, next) {
  try {
    const { days = 30 } = req.query;
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - parseInt(days));
    const fromStr = fromDate.toLocaleDateString('en-CA');

    const { data, error } = await supabase
      .from('habit_logs')
      .select('date, status')
      .eq('user_id', req.user.id)
      .gte('date', fromStr);

    if (error) throw error;

    // Group by date
    const byDate = {};
    for (const log of (data || [])) {
      if (!byDate[log.date]) byDate[log.date] = { completed: 0, total: 0 };
      byDate[log.date].total++;
      if (log.status === 'completed' || log.status === 'micro') byDate[log.date].completed++;
    }

    const stats = Object.entries(byDate)
      .map(([date, counts]) => ({
        date,
        completed: counts.completed,
        total: counts.total,
        pct: counts.total > 0 ? Math.round((counts.completed / counts.total) * 100) : 0,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return sendSuccess(res, stats);
  } catch (err) {
    next(err);
  }
}

module.exports = { getTodayLogs, getLogs, logHabit, bulkLogHabits, getLogStats };