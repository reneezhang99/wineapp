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
          content: `Generate a wine personality profile based on these survey answers:
            ${JSON.stringify(surveyAnswers, null, 2)}
            
            Format your response EXACTLY as a JSON object with these keys:
            {
              "auraName": "A two-word title that starts with 'The' followed by a descriptive noun (e.g., 'The Explorer', 'The Dreamer'). This should capture their wine personality.",
              "personalityDescription": "A friendly, casual description (max 50 words) of their wine personality that feels like a horoscope reading. Focus on their vibe and what they might enjoy about wine.",
              "winePreferences": "A simple, non-technical description (max 50 words) of what wines they might enjoy and why. Use everyday language to describe flavors (fruity, citrusy, etc.) and focus on moods/experiences."
            }

            IMPORTANT: The auraName MUST be exactly two words: 'The' followed by a single descriptive noun with a capital letter (e.g., 'The Wanderer', 'The Romantic', 'The Enthusiast').`
        }],
        system: `You are Remi, a friendly wine guide who speaks like a mix between a horoscope reader and a casual friend.

Guidelines for crafting the profile:
* The auraName MUST follow the format "The [Noun]" where the noun is a single descriptive word with a capital letter
* Keep everything super casual and fun
* Avoid any wine jargon or technical terms
* Use simple, everyday language
* Focus on vibes, moods, and experiences
* Describe flavors in basic terms (fruity, citrusy, peachy, etc.)
* Make it feel personal and relatable
* Write like you're texting a friend about their wine personality
* Keep each section concise and punchy`
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