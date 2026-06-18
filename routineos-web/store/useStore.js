import { create } from 'zustand';

const useStore = create((set, get) => ({
  // ─── Theme ────────────────────────────────────────────────────────────
  isDarkMode: true,
  toggleDarkMode: () => {
    const isDark = !get().isDarkMode;
    set({ isDarkMode: isDark });
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('light', !isDark);
      localStorage.setItem('routineos-theme', isDark ? 'dark' : 'light');
    }
  },
  initTheme: () => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('routineos-theme');
    const isDark = saved ? saved === 'dark' : true;
    set({ isDarkMode: isDark });
    document.documentElement.classList.toggle('light', !isDark);
  },

  // ─── User / Auth ──────────────────────────────────────────────────────
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),

  // ─── Today's habits ───────────────────────────────────────────────────
  todayHabits: [],
  todayLogs: {},  // { habitId: log }
  setTodayHabits: (habits) => set({ todayHabits: habits }),
  setTodayLogs: (logs) => {
    const logMap = {};
    for (const log of logs) logMap[log.habit_id] = log;
    set({ todayLogs: logMap });
  },

  // Optimistic log update
  updateLog: (habitId, logData) => {
    set(state => ({
      todayLogs: { ...state.todayLogs, [habitId]: { ...state.todayLogs[habitId], ...logData } },
    }));
  },

  // ─── Recovery ─────────────────────────────────────────────────────────
  recoverySession: null,
  needsRecovery: false,
  setRecovery: (session, needs) => set({ recoverySession: session, needsRecovery: needs }),
  clearRecovery: () => set({ recoverySession: null, needsRecovery: false }),

  // ─── Morning briefing ─────────────────────────────────────────────────
  briefingText: null,
  setBriefingText: (text) => set({ briefingText: text }),

  // ─── Toast notifications ──────────────────────────────────────────────
  toasts: [],
  addToast: (toast) => {
    const id = Date.now().toString();
    set(state => ({ toasts: [...state.toasts, { id, ...toast }] }));
    setTimeout(() => {
      set(state => ({ toasts: state.toasts.filter(t => t.id !== id) }));
    }, toast.duration || 3500);
  },
  removeToast: (id) => set(state => ({ toasts: state.toasts.filter(t => t.id !== id) })),

  // ─── Current mode ─────────────────────────────────────────────────────
  currentMode: 'normal',
  setCurrentMode: (mode) => set({ currentMode: mode }),
}));

export default useStore;