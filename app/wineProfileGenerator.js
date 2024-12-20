import Anthropic from '@anthropic-ai/sdk';

// Initialize Claude client with API key
const anthropic = new Anthropic({
  apiKey: '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'
});

export async function generateWineProfile(surveyAnswers) {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1000,
      system: "You are a wine expert with a playful, Co-star-like writing style. Generate fun, personality-based wine profiles. ALWAYS format your response as a JSON object with exactly these keys: auraName, personalityDescription, winePreferences.",
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

    try {
      // First, try to parse it as JSON directly
      return JSON.parse(response.content[0].text);
    } catch {
      // If that fails, try to extract the sections manually
      const text = response.content[0].text;
      
      // Basic parsing fallback
      const profile = {
        auraName: text.split('Aura Name:')[1]?.split('\n')[0]?.trim() || 'Mysterious Wine Lover',
        personalityDescription: text.split('personality description')[1]?.split('Wine Preferences')[0]?.trim() || 'A complex individual with refined tastes',
        winePreferences: text.split('Wine Preferences')[1]?.trim() || 'Recommendations will be personalized soon'
      };
      
      return profile;
    }
  } catch (error) {
    console.error('Error generating profile:', error);
    throw error;
  }
}