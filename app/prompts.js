import Anthropic from '@anthropic-ai/sdk';
import { ANTHROPIC_API_KEY } from './config';

const anthropic = new Anthropic({
  apiKey: ANTHROPIC_API_KEY,
});

export async function generateWineProfile(surveyAnswers) {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1000,
      system: "You are a wine expert with a playful, Co-star-like writing style...",
      messages: [{
        role: 'user',
        content: `Generate a wine personality profile based on these survey answers:
          ${JSON.stringify(surveyAnswers, null, 2)}
          
          Format your response EXACTLY as a JSON object with these keys:
          {
            "auraName": "the aura name",
            "personalityDescription": "the personality description",
            "winePreferences": "the wine preferences and recommendations"
          }`
      }]
    });

    return JSON.parse(response.content[0].text);
  } catch (error) {
    console.error('Error generating profile:', error);
    throw error;
  }
}

export async function generateClaudeResponse(userMessage) {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1000,
      system: "You are a friendly and knowledgeable wine assistant named Remi. Answer questions about wine, including pairings, suggestions, and trivia, in a conversational and helpful manner. Don't use jargon, make it as accessible but informative as possible.",
      messages: [{
        role: 'user',
        content: userMessage,
      }],
    });

    // Extract just the text from the response, assuming it's in response.content[0].text
    const textResponse = response.content[0]?.text || "Sorry, I couldn't understand that.";

    // Limit the response to 50 words
    const wordLimit = 50;
    const words = textResponse.split(' ');
    const truncatedResponse = words.slice(0, wordLimit).join(' ');

    return truncatedResponse; // Return the truncated text response
  } catch (error) {
    console.error('Error fetching response from Claude:', error);
    throw error;
  }
}

