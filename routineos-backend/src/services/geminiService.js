const { getGeminiModel } = require('../config/gemini');
const {
  routineGeneratorPrompt,
  morningBriefingPrompt,
  recoveryPlanPrompt,
  weeklyInsightPrompt,
  microHabitSuggesterPrompt,
  contextAwareReminderPrompt,
} = require('../utils/promptTemplates');

/**
 * Calls Gemini and returns the text response
 */
async function callGemini(prompt, expectJson = false) {
  const model = getGeminiModel();
  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  if (!expectJson) return text;

  // Strip markdown code fences if present
  const cleaned = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    throw new Error(`Gemini returned invalid JSON: ${cleaned.substring(0, 200)}`);
  }
}

/**
 * Generates initial routine habits from onboarding data
 */
async function generateRoutine(userData) {
  const prompt = routineGeneratorPrompt(userData);
  return callGemini(prompt, true);
}

/**
 * Generates the daily morning briefing text
 */
async function generateMorningBriefing(context) {
  const prompt = morningBriefingPrompt(context);
  return callGemini(prompt, false);
}

/**
 * Generates a 3-day recovery plan
 */
async function generateRecoveryPlan(context) {
  const prompt = recoveryPlanPrompt(context);
  return callGemini(prompt, true);
}

/**
 * Generates weekly insight paragraph
 */
async function generateWeeklyInsight(context) {
  const prompt = weeklyInsightPrompt(context);
  return callGemini(prompt, false);
}

/**
 * Suggests a 2-minute micro version of a habit
 */
async function suggestMicroHabit(habitData) {
  const prompt = microHabitSuggesterPrompt(habitData);
  return callGemini(prompt, false);
}

/**
 * Generates a context-aware habit reminder
 */
async function generateContextualReminder(context) {
  const prompt = contextAwareReminderPrompt(context);
  return callGemini(prompt, false);
}

module.exports = {
  generateRoutine,
  generateMorningBriefing,
  generateRecoveryPlan,
  generateWeeklyInsight,
  suggestMicroHabit,
  generateContextualReminder,
};