import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const STORAGE_KEYS = {
  SURVEY_ANSWERS: 'wine_app_survey_answers',
  WINE_PROFILE: 'wine_app_profile'
};

// Save survey answers
export const saveSurveyAnswers = async (answers) => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.SURVEY_ANSWERS,
      JSON.stringify(answers)
    );
    return true;
  } catch (error) {
    console.error('Error saving survey answers:', error);
    return false;
  }
};

// Get survey answers
export const getSurveyAnswers = async () => {
  try {
    const answers = await AsyncStorage.getItem(STORAGE_KEYS.SURVEY_ANSWERS);
    return answers ? JSON.parse(answers) : null;
  } catch (error) {
    console.error('Error getting survey answers:', error);
    return null;
  }
};

// Clear all stored data
export const clearStoredData = async () => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.SURVEY_ANSWERS,
      STORAGE_KEYS.WINE_PROFILE
    ]);
    return true;
  } catch (error) {
    console.error('Error clearing stored data:', error);
    return false;
  }
};

// Add these functions alongside your existing ones in storage-utils.js
export const saveWineProfile = async (profile) => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.WINE_PROFILE,
        JSON.stringify(profile)
      );
      return true;
    } catch (error) {
      console.error('Error saving wine profile:', error);
      return false;
    }
  };
  
  export const getWineProfile = async () => {
    try {
      const profile = await AsyncStorage.getItem(STORAGE_KEYS.WINE_PROFILE);
      return profile ? JSON.parse(profile) : null;
    } catch (error) {
      console.error('Error getting wine profile:', error);
      return null;
    }
  };