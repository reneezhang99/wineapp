import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { generateWineProfile } from './prompts';
import { questions } from './questions';
import { saveSurveyAnswers, getSurveyAnswers, clearStoredData, saveWineProfile, getWineProfile } from './storage-utils';
import { theme } from './theme';

export default function Survey() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const savedProfile = await getWineProfile();
        if (savedProfile) {
          router.replace({
            pathname: '/profile',
            params: { profile: JSON.stringify(savedProfile) },
          });
          return;
        }

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
    await saveSurveyAnswers(updatedAnswers);
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

        const profile = await generateWineProfile(formattedAnswers);
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

  if (isInitialLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={theme.colors.button} />
      </View>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const selectedAnswer = answers[currentQuestionIndex];

  // Calculate progress percentage (based on current question index)
  const progress = (currentQuestionIndex / (questions.length - 1)) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>{currentQuestionIndex + 1} of {questions.length}</Text>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.question}>{currentQuestion.text}</Text>
        <Text style={styles.helperText}>Help Remi understand your preferences...</Text>
        
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
            <Text style={[
              styles.answerText,
              selectedAnswer === answer && styles.selectedAnswerText
            ]}>
              {answer}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {selectedAnswer && (
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleNext}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.continueButtonText}>
              {currentQuestionIndex === questions.length - 1 ? 'Generate Profile' : 'Continue'}
            </Text>
          )}
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
        <Text style={styles.resetButtonText}>Reset Survey (Dev)</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 20,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: 80,
  },
  progressContainer: {
    marginTop: 60,  // Adjusted to bring the progress bar lower
    marginBottom: 40,  // Space between progress bar and other content
    alignItems: 'center',  // Keep the progress container centered
  },
  progressTextContainer: {
    flexDirection: 'column', // Make sure this is present
    marginBottom: 20,  // Increased margin between text and progress bar
    alignItems: 'flex-start',  // Align text to the left
    width: '100%',  // Ensure it spans the entire width of the container
  },
  progressText: {
    color: '#666666',
    fontSize: 12,
    textAlign: 'left',
    marginLeft: 0,  // Align text left with some padding
    marginTop: 5,
  },
  progressBar: {
    width: '70%',  // Keep the width of the progress bar to 70%
    height: 4,
    backgroundColor: '#E5E5E5',
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 16,  // Adds a little more space between progress bar and text
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.button,
  },
  question: {
    fontSize: 28,
    marginBottom: 12,
    textAlign: 'center',
    color: theme.colors.text,
    fontWeight: '500',
  },
  helperText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666666',
    marginBottom: 40,
  },
  answerButton: {
    padding: 16,
    marginVertical: 6,
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  selectedAnswer: {
    borderColor: theme.colors.button,
    borderWidth: 2,
  },
  answerText: {
    fontSize: 16,
    textAlign: 'center',
    color: theme.colors.text,
  },
  selectedAnswerText: {
    fontWeight: '500',
  },
  continueButton: {
    backgroundColor: 'black',
    padding: 16,
    borderRadius: 8,
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
  },
  continueButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 16,
  },
  resetButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#666',
    padding: 8,
    borderRadius: 4,
  },
  resetButtonText: {
    color: 'white',
    fontSize: 12,
  },
});
