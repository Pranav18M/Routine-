const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI = null;

function getGeminiClient() {
  if (genAI) return genAI;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is required');
  }

  genAI = new GoogleGenerativeAI(apiKey);
  return genAI;
}

function getGeminiModel(modelName = 'gemini-2.5-flash') {
  const client = getGeminiClient();
  return client.getGenerativeModel({
    model: modelName,
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 2048,
    },
  });
}

module.exports = { getGeminiClient, getGeminiModel };