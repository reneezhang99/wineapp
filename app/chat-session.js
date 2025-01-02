// chat-session.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const SESSION_KEY = '@wine_chat_session';
const MESSAGE_HISTORY_KEY = '@wine_chat_messages';

export const initializeSession = async () => {
  const currentDate = new Date().toDateString();
  try {
    const existingSession = await AsyncStorage.getItem(SESSION_KEY);
    
    if (!existingSession || JSON.parse(existingSession).date !== currentDate) {
      // New session for a new day
      const newSession = {
        date: currentDate,
        startTime: new Date().toISOString(),
      };
      await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
      // Clear previous messages when starting new session
      await AsyncStorage.removeItem(MESSAGE_HISTORY_KEY);
      return [];
    } else {
      // Existing session - load messages
      const messages = await AsyncStorage.getItem(MESSAGE_HISTORY_KEY);
      return messages ? JSON.parse(messages) : [];
    }
  } catch (error) {
    console.error('Error initializing session:', error);
    return [];
  }
};

export const saveMessages = async (messages) => {
  try {
    await AsyncStorage.setItem(MESSAGE_HISTORY_KEY, JSON.stringify(messages));
  } catch (error) {
    console.error('Error saving messages:', error);
  }
};

export const getMessageHistory = async () => {
  try {
    const messages = await AsyncStorage.getItem(MESSAGE_HISTORY_KEY);
    return messages ? JSON.parse(messages) : [];
  } catch (error) {
    console.error('Error getting message history:', error);
    return [];
  }
};

// Helper function to format messages for Claude's context
export const formatMessagesForContext = (messages, maxMessages = 5) => {
  return messages
    .slice(-maxMessages) // Get last N messages
    .map(msg => ({
      role: msg.user._id === 2 ? 'assistant' : 'user',
      content: msg.text
    }));
};