import Anthropic from '@anthropic-ai/sdk';
import { ANTHROPIC_API_KEY } from '@env';

// Initialize Claude client with environment variable
const anthropic = new Anthropic({
  apiKey: ANTHROPIC_API_KEY
});

export async function generateWineProfile(surveyAnswers) {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1000,
      system: "You are a wine expert with a playful, Co-star-like writing style. Generate fun, personality-based wine profiles.",
      messages: [{
        role: 'user',
        content: `Generate a wine personality profile based on these survey answers:
          ${JSON.stringify(surveyAnswers, null, 2)}
          
          Format the response with:
          - An aura name (like "Cosmic Connoisseur but not so cringe")
          - A personality description (co-star style)
          - Wine preferences and recommendations`
      }]
    });

    // Extract the text content from the response
    return response.content[0].text;
  } catch (error) {
    console.error('Error generating profile:', error);
    throw error;
  }
}