import { supabase } from './supabase';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * Gets the current session access token
 */
async function getAccessToken() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || null;
}

/**
 * Core fetch wrapper with auth headers and error handling
 */
async function apiFetch(path, options = {}) {
  const token = await getAccessToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || `Request failed: ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

// ─── Auth ─────────────────────────────────────────────────────────────
export const authApi = {
  signup: (body) => apiFetch('/api/auth/signup', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => apiFetch('/api/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  logout: () => apiFetch('/api/auth/logout', { method: 'POST' }),
};

// ─── User ─────────────────────────────────────────────────────────────
export const userApi = {
  getProfile: () => apiFetch('/api/user/me'),
  updateProfile: (body) => apiFetch('/api/user/me', { method: 'PATCH', body: JSON.stringify(body) }),
  completeOnboarding: (body) => apiFetch('/api/user/onboarding', { method: 'POST', body: JSON.stringify(body) }),
  switchMode: (body) => apiFetch('/api/user/mode', { method: 'PATCH', body: JSON.stringify(body) }),
  deleteAccount: () => apiFetch('/api/user/me', { method: 'DELETE' }),
};

// ─── Habits ───────────────────────────────────────────────────────────
export const habitsApi = {
  getAll: (mode) => apiFetch(`/api/habits${mode ? `?mode=${mode}` : ''}`),
  getById: (id) => apiFetch(`/api/habits/${id}`),
  create: (body) => apiFetch('/api/habits', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => apiFetch(`/api/habits/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (id) => apiFetch(`/api/habits/${id}`, { method: 'DELETE' }),
  reorder: (order) => apiFetch('/api/habits/reorder', { method: 'PATCH', body: JSON.stringify({ order }) }),
  suggestMicro: (id) => apiFetch(`/api/habits/${id}/suggest-micro`, { method: 'POST' }),
};

// ─── Logs ─────────────────────────────────────────────────────────────
export const logsApi = {
  getToday: () => apiFetch('/api/logs/today'),
  getRange: (from, to, habit_id) => {
    const params = new URLSearchParams({ from, to });
    if (habit_id) params.set('habit_id', habit_id);
    return apiFetch(`/api/logs?${params}`);
  },
  log: (body) => apiFetch('/api/logs', { method: 'POST', body: JSON.stringify(body) }),
  bulkLog: (logs) => apiFetch('/api/logs/bulk', { method: 'POST', body: JSON.stringify({ logs }) }),
  getStats: (days = 30) => apiFetch(`/api/logs/stats?days=${days}`),
};

// ─── Recovery ─────────────────────────────────────────────────────────
export const recoveryApi = {
  getStatus: () => apiFetch('/api/recovery/status'),
  generate: (body) => apiFetch('/api/recovery/generate', { method: 'POST', body: JSON.stringify(body) }),
  complete: (id) => apiFetch(`/api/recovery/${id}/complete`, { method: 'POST' }),
  getHistory: () => apiFetch('/api/recovery/history'),
};

// ─── Insights ─────────────────────────────────────────────────────────
export const insightsApi = {
  getWeekly: () => apiFetch('/api/insights/weekly'),
  generate: () => apiFetch('/api/insights/generate', { method: 'POST' }),
  getCharts: (days = 30) => apiFetch(`/api/insights/charts?days=${days}`),
};

// ─── Buddy ────────────────────────────────────────────────────────────
export const buddyApi = {
  get: () => apiFetch('/api/buddy'),
  getInviteCode: () => apiFetch('/api/buddy/invite-code'),
  connect: (inviteCode) => apiFetch('/api/buddy/connect', { method: 'POST', body: JSON.stringify({ inviteCode }) }),
  remove: () => apiFetch('/api/buddy', { method: 'DELETE' }),
  nudge: () => apiFetch('/api/buddy/nudge', { method: 'POST' }),
};