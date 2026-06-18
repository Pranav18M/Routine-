import { clsx } from 'clsx';

/**
 * Merges class names conditionally
 */
export function cn(...inputs) {
  return clsx(inputs);
}

/**
 * Formats a HH:MM time string to 12-hour display (e.g., "6:30 AM")
 */
export function formatTime(timeStr) {
  if (!timeStr) return '';
  const [hours, minutes] = timeStr.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHour = hours % 12 || 12;
  return `${displayHour}:${String(minutes).padStart(2, '0')} ${period}`;
}

/**
 * Returns today's date as YYYY-MM-DD in local timezone
 */
export function getTodayString() {
  return new Date().toLocaleDateString('en-CA');
}

/**
 * Formats a date string to human-readable (e.g., "Mon, Dec 2")
 */
export function formatDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

/**
 * Returns a greeting based on the time of day
 */
export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  if (hour < 21) return 'Good evening';
  return 'Good night';
}

/**
 * Maps a category to its Tailwind class name
 */
export function getCategoryClass(category) {
  const map = {
    health: 'cat-health',
    study: 'cat-study',
    skill: 'cat-skill',
    mindfulness: 'cat-mindfulness',
    personal: 'cat-personal',
  };
  return map[category] || 'cat-personal';
}

/**
 * Maps a mode key to its display label
 */
export function getModeLabel(mode) {
  const labels = {
    normal: 'Normal',
    exam: 'Exam Mode',
    travel: 'Travel',
    sick: 'Recovery',
    grind: 'Grind Mode',
  };
  return labels[mode] || 'Normal';
}

/**
 * Maps a mode to its emoji
 */
export function getModeEmoji(mode) {
  const emojis = {
    normal: '🌟',
    exam: '📚',
    travel: '✈️',
    sick: '🤒',
    grind: '🔥',
  };
  return emojis[mode] || '🌟';
}

/**
 * Maps a status to color class
 */
export function getStatusColor(status) {
  const colors = {
    completed: 'text-success',
    micro: 'text-accent',
    skipped: 'text-warning',
    missed: 'text-error',
  };
  return colors[status] || 'text-muted';
}

/**
 * Truncates text to a max length with ellipsis
 */
export function truncate(text, maxLength = 40) {
  if (!text) return '';
  return text.length > maxLength ? `${text.substring(0, maxLength)}…` : text;
}

/**
 * Formats minutes into a readable duration (e.g., "30 min", "1h 30m")
 */
export function formatDuration(mins) {
  if (!mins) return '';
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

/**
 * Sleep helper for async delays
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Clamps a number between min and max
 */
export function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}