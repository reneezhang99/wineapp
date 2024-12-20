import Anthropic from '@anthropic-ai/sdk';

interface SurveyAnswers {
  [key: string]: any;
}

// Initialize Claude client with API key
const anthropic = new Anthropic({
  apiKey: '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'
});

export async function generateWineProfile(surveyAnswers: SurveyAnswers): Promise<string> {
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

    return response.content[0].text;
  } catch (error) {
    console.error('Error generating profile:', error);
    throw error;
  }
}