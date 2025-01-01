import { EXPO_ANTHROPIC_API_KEY } from './config';

export async function generateWineProfile(surveyAnswers) {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'anthropic-api-key': EXPO_ANTHROPIC_API_KEY,
        'x-api-key': EXPO_ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1000,
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
        }],
        system: "You are a wine expert with a playful, Co-star-like writing style..."
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return JSON.parse(data.content[0].text);
  } catch (error) {
    console.error('Error generating profile:', error);
    throw error;
  }
}

export async function generateClaudeResponse(userMessage, wineProfile = null) {
  try {
    let systemPrompt = "You are a friendly and knowledgeable wine assistant named Remi.";
    
    if (wineProfile) {
      systemPrompt += ` Based on their wine profile "${wineProfile.auraName}", and preferences: "${wineProfile.winePreferences}", tailor your recommendations and responses to match their taste profile. The full context of their wine personality is: "${wineProfile.personalityDescription}".`;
    }

    systemPrompt += " Provide engaging responses about wine, including recommendations, pairings, and casual conversation. Keep your responses concise, informative, and accessible - avoid technical jargon unless specifically asked.";

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'anthropic-api-key': EXPO_ANTHROPIC_API_KEY,
        'x-api-key': EXPO_ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: userMessage
        }],
        system: systemPrompt
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.content[0].text;

  } catch (error) {
    console.error('Error fetching response from Claude:', error);
    throw error;
  }
}

export async function analyzeWineImage(imageData, wineProfile = null) {
  try {
    let systemPrompt = "You are Remi, a friendly and knowledgeable wine assistant.";
    
    if (wineProfile) {
      systemPrompt += ` Based on their wine profile "${wineProfile.auraName}" and preferences: "${wineProfile.winePreferences}", analyze this wine menu or label keeping their taste preferences in mind. Consider their profile: "${wineProfile.personalityDescription}".`;
    }

    systemPrompt += " When analyzing wine labels or menus, provide concise and accessible information. For labels, describe the wine's characteristics. For menus, suggest 2-3 options that would be interesting. Keep the tone conversational and avoid technical jargon.";

    const messages = [{
      role: 'user',
      content: [
        {
          type: 'image',
          source: {
            type: 'base64',
            media_type: 'image/jpeg',
            data: imageData.source.data
          }
        },
        {
          type: 'text',
          text: "What can you tell me about this wine menu or label?"
        }
      ]
    }];

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': EXPO_ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1000,
        messages: messages,
        system: systemPrompt
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw error;
  }
}