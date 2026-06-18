/**
 * Returns today's date as YYYY-MM-DD in the given timezone
 */
function getTodayInTimezone(timezone = 'Asia/Kolkata') {
  return new Date().toLocaleDateString('en-CA', { timeZone: timezone });
}

/**
 * Returns a date N days ago as YYYY-MM-DD
 */
function getDaysAgo(n, timezone = 'Asia/Kolkata') {
  const date = new Date();
  date.setDate(date.getDate() - n);
  return date.toLocaleDateString('en-CA', { timeZone: timezone });
}

/**
 * Returns the start of the current week (Monday) as YYYY-MM-DD
 */
function getWeekStart(timezone = 'Asia/Kolkata') {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  return monday.toLocaleDateString('en-CA', { timeZone: timezone });
}

/**
 * Returns an array of YYYY-MM-DD strings for the last N days
 */
function getLastNDays(n, timezone = 'Asia/Kolkata') {
  const days = [];
  for (let i = n - 1; i >= 0; i--) {
    days.push(getDaysAgo(i, timezone));
  }
  return days;
}

/**
 * Formats a Date object to HH:MM string
 */
function formatTime(date) {
  return date.toTimeString().slice(0, 5);
}

/**
 * Returns the day name (Monday, Tuesday, etc.) for a YYYY-MM-DD string
 */
function getDayName(dateString) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const date = new Date(dateString + 'T00:00:00');
  return days[date.getDay()];
}

/**
 * Returns how many consecutive days back from today had no logs
 */
function countConsecutiveMissedDays(logDates, timezone = 'Asia/Kolkata') {
  let missedCount = 0;
  let checkDate = new Date();

  while (true) {
    checkDate.setDate(checkDate.getDate() - 1);
    const dateStr = checkDate.toLocaleDateString('en-CA', { timeZone: timezone });
    if (logDates.includes(dateStr)) break;
    missedCount++;
    if (missedCount >= 30) break; // Safety cap
  }

  return missedCount;
}

module.exports = {
  getTodayInTimezone,
  getDaysAgo,
  getWeekStart,
  getLastNDays,
  formatTime,
  getDayName,
  countConsecutiveMissedDays,
};