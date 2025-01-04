import { EXPO_ANTHROPIC_API_KEY } from './config';

export async function generateWineProfile(surveyAnswers) {
  try {
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
        temperature: 0.7,
        messages: [{
          role: 'user',
          content: `You are a friendly wine expert. Based on the survey answers, generate a wine persona based on their preferences. Your response must follow these EXACT rules:

1. Respond with EXACTLY these 5 lines in this EXACT format with no extra text or variations:

Line 1: DESCRIPTION: [a 70-80 word wine preference description]
Line 2: ACIDITY: [must be exactly Low, Medium, or High]
Line 3: BODY: [must be exactly Light, Medium, or Full]
Line 4: SWEETNESS: [must be exactly Low, Medium, or High]
Line 5: FLAVOURS: [must be exactly three from this list, separated by commas: Cherry, Vanilla, Mineral, Lychee, Peach, Citrus, Floral, Oak, Tropical, Stone fruit, Herbs]

Do not add any extra words, labels, or variations to the values.
Each line must start with exactly the label specified (e.g., "DESCRIPTION:", "ACIDITY:") followed by a single space and then just the value.
Don't include "ACIDITY:", "BODY:", etc. within the actual values themselves.

Here are the survey answers to analyze:
${JSON.stringify(surveyAnswers, null, 2)}`
        }]
      })
    });

    if (!response.ok) {
      throw new Error('API error');
    }

    const data = await response.json();
    const text = data.content[0].text;
    
    // Parse the text response into lines, removing empty lines and extra whitespace
    const lines = text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    console.log('Raw response from Claude:', text);
    console.log('Split lines:', lines);

    // Strict parsing function with better error handling
    const parseProfileLine = (line, expectedLabel) => {
      if (!line) {
        console.error(`Missing line for "${expectedLabel}"`);
        return '';
      }
      if (!line.startsWith(expectedLabel)) {
        console.error(`Line should start with "${expectedLabel}": ${line}`);
        return '';
      }
      return line.substring(expectedLabel.length + 1).trim();
    };
    
    // Create the profile object with validation and fallbacks
    const profile = {
      personalityDescription: parseProfileLine(lines[0], 'DESCRIPTION'),
      preferences: {
        acidity: parseProfileLine(lines[1], 'ACIDITY') || 'Medium',
        body: parseProfileLine(lines[2], 'BODY') || 'Medium',
        sweetness: parseProfileLine(lines[3], 'SWEETNESS') || 'Medium',
        flavours: parseProfileLine(lines[4], 'FLAVOURS') || 'Citrus, Stone fruit, Floral'
      }
    };

    // Validate the profile
    if (!profile.personalityDescription) {
      console.error('Missing personality description');
    }
    if (!profile.preferences.acidity || !profile.preferences.body || 
        !profile.preferences.sweetness || !profile.preferences.flavours) {
      console.error('Missing required preferences:', profile);
    }

    console.log('Parsed profile:', JSON.stringify(profile, null, 2));
    return profile;

  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export async function generateClaudeResponse(userMessage, wineProfile = null, messageHistory = []) {
  try {
    let systemPrompt = `You are Remi, a friendly person who has knowledge about wine and can describe it in a way that non-wine drinkers understand.

Follow these guidelines:
* Length: Respond in 50 words or less.
* Tone: Your tone should be friendly, casual, concise, and informative.
* Language: Use simple, everyday language that anyone can understand.
* Response structure: The first sentence should be to the point and include what is being recommended to the user. The next lines should describe why the user would like the wine and how it matches their palette, including the wine's flavour and how it might match the mood for the user.

When discussing wine:
* Focus on: How the wine fits the vibe and mood of the person, rather than the specifics of the wine itself. Give a simple description of the wine like whether it's red, white, sparkling, but don't get too technical.
* Avoid: Do not use any wine jargon or technical words. For example, don't use words like tannins, mouthfeel, instead use words like how it feels on your mouth.
* Describe flavors as: How it actually tastes and make it easy to understand, words like fruity, citrusy, peachy, spicy, peppery, buttery, easy words like that.`;

    if (wineProfile) {
      systemPrompt += `\n\nConsider their profile:
* Aura: "${wineProfile.auraName}"
* Personality: "${wineProfile.personalityDescription}"
* Preferences: "${wineProfile.winePreferences}"`;
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': EXPO_ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 200,
        temperature: 0.7,
        system: systemPrompt,
        messages: [
          ...messageHistory.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          {
            role: 'user',
            content: userMessage + "\n\nIMPORTANT: Keep your response to 50 words or less."
          }
        ]
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
    let systemPrompt = `You are Remi, a friendly person who has knowledge about wine and can describe it in a way that non-wine drinkers understand.

Follow these guidelines:
* Length: Respond in 50 words or less.
* Tone: Your tone should be friendly, casual, concise, and informative.
* Language: Use simple, everyday language that anyone can understand.

When analyzing wine images:
* Start with what type of wine it is (red, white, sparkling, etc.)
* Focus on: How the wine fits the vibe and mood, rather than technical details
* Avoid: Do not use any wine jargon or technical words
* Describe flavors in basic terms (fruity, citrusy, peachy, spicy, etc.)
* If it's a menu, suggest 2-3 options based on mood and occasion`;

    if (wineProfile) {
      systemPrompt += `\n\nConsider their profile:
* Aura: "${wineProfile.auraName}"
* Personality: "${wineProfile.personalityDescription}"
* Preferences: "${wineProfile.winePreferences}"`;
    }

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
          text: "What can you tell me about this wine? Keep your response to 50 words or less."
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
        max_tokens: 200,
        temperature: 0.7,
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