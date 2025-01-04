import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { generateWineProfile } from './prompts';
import { questions } from './questions';
import { saveSurveyAnswers, getSurveyAnswers, clearStoredData, saveWineProfile, getWineProfile } from './storage-utils';
import { theme } from './theme';

export default function Survey() {
  const router = useRouter();
  const [showWelcome, setShowWelcome] = useState(true);
  const [showNameInput, setShowNameInput] = useState(false);
  const [name, setName] = useState('');
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
          setShowWelcome(false);
          setShowNameInput(false);
        }
      } catch (error) {
        console.error('Error loading saved data:', error);
      } finally {
        setIsInitialLoading(false);
      }
    };
    loadSavedData();
  }, []);

  const handleGetStarted = () => {
    setShowWelcome(false);
    setShowNameInput(true);
  };

  const handleNameSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Please enter your name');
      return;
    }
    await saveSurveyAnswers({ ...answers, name: name.trim() });
    setShowNameInput(false);
  };

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
          name: answers.name,
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
    setShowWelcome(true);
    setShowNameInput(false);
    setName('');
    Alert.alert('Reset', 'Survey data has been cleared.');
  };

  if (isInitialLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={theme.colors.button} />
      </View>
    );
  }

  if (showWelcome) {
    return (
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <Text style={[styles.question, { fontSize: 32 }]}>Remi is your personal wine AI.</Text>
          <Text style={styles.helperText}>Get help choosing from a wine menu, or what bottle to gift a friend – just ask Remi. </Text>
          
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleGetStarted}
          >
            <Text style={styles.continueButtonText}>Get started</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (showNameInput) {
    return (
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <Text style={styles.question}>Firstly, lets get to know each other ...</Text>
          <Text style={styles.helperText}>What can Remi call you?</Text>
          
          <TextInput
            style={styles.nameInput}
            placeholder="Name"
            value={name}
            onChangeText={setName}
            placeholderTextColor="#999"
          />
          
          <TouchableOpacity
            style={[styles.continueButton, !name.trim() && styles.disabledButton]}
            onPress={handleNameSubmit}
            disabled={!name.trim()}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const selectedAnswer = answers[currentQuestionIndex];
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
    marginTop: 60,
    marginBottom: 40,
    alignItems: 'center',
  },
  progressTextContainer: {
    flexDirection: 'column',
    marginBottom: 20,
    alignItems: 'flex-start',
    width: '100%',
  },
  progressText: {
    color: '#666666',
    fontSize: 12,
    textAlign: 'left',
    marginLeft: 0,
    marginTop: 5,
  },
  progressBar: {
    width: '70%',
    height: 4,
    backgroundColor: '#E5E5E5',
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 16,
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
    maxWidth: '90%',
    alignSelf: 'center',
    color: '#666666',
    marginBottom: 40,
  },
  nameInput: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    marginBottom: 20,
    color: theme.colors.text,
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
  disabledButton: {
    opacity: 0.5,
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