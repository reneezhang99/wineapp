import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { generateWineProfile } from './wineProfileGenerator';
import { questions } from './questions'; // Updated file name for clarity
import { saveSurveyAnswers, getSurveyAnswers, clearStoredData, saveWineProfile, getWineProfile } from './storage-utils';

export default function Survey() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const loadSavedData = async () => {
      try {
        // Check if a profile already exists
        const savedProfile = await getWineProfile();
        if (savedProfile) {
          router.replace({
            pathname: '/profile',
            params: { profile: JSON.stringify(savedProfile) },
          });
          return;
        }

        // Load saved survey answers if no profile exists
        const savedAnswers = await getSurveyAnswers();
        if (savedAnswers) {
          setAnswers(savedAnswers);
          const lastAnsweredIndex = Object.keys(savedAnswers).length - 1;
          setCurrentQuestionIndex(lastAnsweredIndex);
        }
      } catch (error) {
        console.error('Error loading saved data:', error);
      } finally {
        setIsInitialLoading(false);
      }
    };
    loadSavedData();
  }, []);

  const handleAnswer = async (answer) => {
    const updatedAnswers = { ...answers, [currentQuestionIndex]: answer };
    setAnswers(updatedAnswers);
    await saveSurveyAnswers(updatedAnswers); // Save each answer to local storage
  };

  const handleNext = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      try {
        setIsLoading(true);
        const formattedAnswers = {
          phoneHabit: answers[0],
          toxicTrait: answers[1],
          movieScene: answers[2],
          weekendPlans: answers[3],
          screenTime: answers[4],
        };

        console.log('Sending answers to Claude:', formattedAnswers);
        const profile = await generateWineProfile(formattedAnswers);
        console.log('Generated Profile:', profile);

        await saveWineProfile(profile);
        router.push({
          pathname: '/profile',
          params: { profile: JSON.stringify(profile) },
        });
      } catch (error) {
        console.error('Error generating profile:', error);
        Alert.alert(
          'Error',
          'Failed to generate your wine profile. Please try again.'
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleReset = async () => {
    await clearStoredData();
    setAnswers({});
    setCurrentQuestionIndex(0);
    Alert.alert('Reset', 'Survey data has been cleared.');
  };

  const currentQuestion = questions[currentQuestionIndex];
  const selectedAnswer = answers[currentQuestionIndex];

  if (isInitialLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FF1493" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{currentQuestion.text}</Text>
      {currentQuestion.options.map((answer) => (
        <TouchableOpacity
          key={answer}
          style={[
            styles.answerButton,
            selectedAnswer === answer && styles.selectedAnswer,
          ]}
          onPress={() => handleAnswer(answer)}
          disabled={isLoading}
        >
          <Text style={styles.answerText}>{answer}</Text>
        </TouchableOpacity>
      ))}

      {selectedAnswer && (
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.nextButtonText}>
              {currentQuestionIndex === questions.length - 1
                ? 'Generate Profile'
                : 'Next'}
            </Text>
          )}
        </TouchableOpacity>
      )}

      <Text style={styles.progress}>
        {currentQuestionIndex + 1} / {questions.length}
      </Text>

      {/* Development Reset Button */}
      <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
        <Text style={styles.resetButtonText}>Reset Survey (Dev)</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  question: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  answerButton: {
    padding: 15,
    marginVertical: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  selectedAnswer: {
    backgroundColor: '#FFB6C1',
  },
  answerText: {
    fontSize: 16,
    textAlign: 'center',
  },
  nextButton: {
    backgroundColor: '#FF1493',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignSelf: 'flex-end',
    width: 100,
  },
  nextButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  progress: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    color: '#666',
  },
  resetButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: '#666',
    padding: 10,
    borderRadius: 5,
  },
  resetButtonText: {
    color: 'white',
    fontSize: 12,
  },
});
