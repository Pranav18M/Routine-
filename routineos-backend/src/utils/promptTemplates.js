/**
 * Generates the prompt for creating a user's initial routine
 */
function routineGeneratorPrompt({ name, wakeTime, sleepTime, goals, workSchedule }) {
  return `You are an expert productivity coach and routine designer.

Create a realistic, balanced daily routine for ${name || 'this user'} based on their schedule:
- Wake time: ${wakeTime}
- Sleep time: ${sleepTime}
- Work/college schedule: ${workSchedule || 'flexible'}
- Top 3 goals: ${goals.join(', ')}

Return ONLY a valid JSON array of habit objects. No explanation, no markdown, just raw JSON.

Each habit object must have exactly these fields:
{
  "name": "string (habit name, max 40 chars)",
  "category": "health|study|skill|mindfulness|personal",
  "icon": "emoji",
  "scheduled_time": "HH:MM (24h format)",
  "duration_mins": number,
  "active_modes": ["normal", "grind"] (include relevant modes),
  "sort_order": number (0-based ascending by time)
}

Rules:
- Create 6-10 habits total
- Distribute across morning, afternoon, and evening
- Keep habits realistic and achievable
- Don't overlap with work/sleep schedule
- Include at least one mindfulness habit
- active_modes should include "normal" always; add "grind" for productive habits; "travel" only for portable habits; "sick" only for very light habits

Return the JSON array only.`;
}

/**
 * Generates the morning briefing message
 */
function morningBriefingPrompt({ userName, todayHabits, last7DaysLogs, consistencyScore, currentMode }) {
  const completedRecently = last7DaysLogs.filter(l => l.status === 'completed').length;
  const totalRecently = last7DaysLogs.length;

  return `You are a warm, motivating personal coach for ${userName}.

Context:
- Today's habits scheduled: ${todayHabits.map(h => h.name).join(', ')}
- Habits completed in last 7 days: ${completedRecently} out of ${totalRecently}
- Current consistency score: ${consistencyScore?.toFixed(0) || 'N/A'}/100
- Current life mode: ${currentMode || 'normal'}

Write a personalised morning briefing message. Must be:
- Exactly 4-5 lines
- Warm and encouraging, not preachy
- Reference 1-2 specific habits from today's list by name
- Acknowledge their consistency honestly (don't over-praise if score is low)
- End with a short motivating line specific to their mode
- No emojis, no bullet points, plain conversational text

Return only the message text, nothing else.`;
}

/**
 * Generates a recovery plan for missed days
 */
function recoveryPlanPrompt({ userName, reason, habits, missedDays }) {
  return `You are a compassionate productivity coach helping ${userName} get back on track after ${missedDays} missed day(s).

Reason for missing: ${reason}

Their full habit list:
${habits.map(h => `- ${h.name} (${h.category}, ${h.duration_mins} mins)`).join('\n')}

Create a 3-day graduated recovery plan:
- Day 1: 40% of habits (easiest/shortest first)
- Day 2: 70% of habits
- Day 3: 100% back to normal

Return ONLY valid JSON in this exact structure, no explanation:
{
  "message": "1-2 sentence compassionate message for why this approach helps",
  "day1": ["habit name 1", "habit name 2"],
  "day2": ["habit name 1", "habit name 2", "habit name 3"],
  "day3": ["all habit names here"]
}

Select habit names exactly as given in the list. No new habits. No markdown.`;
}

/**
 * Generates weekly insight paragraph
 */
function weeklyInsightPrompt({ userName, weekData }) {
  return `You are a data-driven wellness coach reviewing ${userName}'s week.

Weekly stats:
- Best day: ${weekData.bestDay} (${weekData.bestDayPct}% completion)
- Worst day: ${weekData.worstDay} (${weekData.worstDayPct}% completion)
- Most consistent habit: ${weekData.topHabit}
- Hardest habit: ${weekData.worstHabit}
- Overall completion: ${weekData.completionPct}%
- Habits completed: ${weekData.completedCount} / ${weekData.totalCount}

Write a 4-line weekly insight paragraph. Requirements:
- Line 1: Acknowledge the overall week (be honest)
- Line 2: Highlight the best day or habit specifically
- Line 3: Address the struggle area constructively
- Line 4: Set an intention for next week

Plain text only. No bullet points. No emojis. Return only the paragraph.`;
}

/**
 * Suggests a micro version of a struggling habit
 */
function microHabitSuggesterPrompt({ habitName, durationMins, category }) {
  return `You are a habit design expert.

The user is struggling with this habit:
- Name: ${habitName}
- Category: ${category}
- Original duration: ${durationMins} minutes

Suggest a 2-minute micro version of this habit that:
- Takes 2 minutes or less
- Keeps the spirit of the original habit
- Is achievable even on the worst day
- Feels like a win, not a defeat

Return ONLY a single sentence (max 60 chars) describing the micro habit action. No explanation. No quotation marks.`;
}

/**
 * Generates context-aware reminder message
 */
function contextAwareReminderPrompt({ habitName, streakDays, recentPattern, userName }) {
  return `Write a short push notification reminder for ${userName} about their habit: "${habitName}".

Context:
- Consecutive days completed: ${streakDays}
- Recent pattern: ${recentPattern} (consistent/inconsistent/recovering)

Requirements:
- Max 80 characters total
- Warm and personal, not robotic
- Reference streak if it's 3+ days
- Be gentle if pattern is inconsistent
- Be encouraging if recovering

Return only the notification message text. No quotes.`;
}

module.exports = {
  routineGeneratorPrompt,
  morningBriefingPrompt,
  recoveryPlanPrompt,
  weeklyInsightPrompt,
  microHabitSuggesterPrompt,
  contextAwareReminderPrompt,
};