import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { generateWineProfile } from './wineProfileGenerator';
import { questions } from './survey';
import { useRouter } from 'expo-router';
import { saveSurveyAnswers, getSurveyAnswers, clearStoredData } from './storage-utils';

export default function Page() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Load saved answers when component mounts
  useEffect(() => {
    loadSavedAnswers();
  }, []);

  const loadSavedAnswers = async () => {
    try {
      const savedAnswers = await getSurveyAnswers();
      if (savedAnswers) {
        setAnswers(savedAnswers);
      }
    } catch (error) {
      console.error("Error loading saved answers:", error);
    } finally {
      setIsInitialLoading(false);
    }
  };

  useEffect(() => {
    const loadSavedAnswers = async () => {
        const savedAnswers = await getSurveyAnswers();
        if (savedAnswers) {
            setAnswers(savedAnswers);
            // Find the last answered question
            const lastAnsweredIndex = Object.keys(savedAnswers).length - 1;
            setCurrentQuestionIndex(lastAnsweredIndex);
        }
    };
    loadSavedAnswers();
}, []);

  const handleAnswer = async (answer) => {
    const newAnswers = {
      ...answers,
      [currentQuestionIndex]: answer
    };
    setAnswers(newAnswers);
    await saveSurveyAnswers(newAnswers); // Save to AsyncStorage after each answer
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
        screenTime: answers[4]
      };

      console.log("Sending answers to Claude:", formattedAnswers);
      
      const profile = await generateWineProfile(formattedAnswers);
      console.log("Generated Profile:", profile);
      
      router.push({
        pathname: "/profile",
        params: { profile: JSON.stringify(profile) }  // Changed this line
      });
    } catch (error) {
      console.error("Error generating profile:", error);
      Alert.alert(
        "Error",
        "Failed to generate your wine profile. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }
};

  // Add reset function for development
  const handleReset = async () => {
    await clearStoredData();
    setAnswers({});
    setCurrentQuestionIndex(0);
    Alert.alert("Reset", "Survey data has been cleared");
  };

  // Show loading screen while checking for saved answers
  if (isInitialLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FF1493" />
      </View>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const selectedAnswer = answers[currentQuestionIndex];

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{currentQuestion.text}</Text>
      
      {currentQuestion.options.map((answer) => (
        <TouchableOpacity
          key={answer}
          style={[
            styles.answerButton,
            selectedAnswer === answer && styles.selectedAnswer
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
              {currentQuestionIndex === questions.length - 1 ? 'Generate Profile' : 'Next'}
            </Text>
          )}
        </TouchableOpacity>
      )}

      <Text style={styles.progress}>
        {currentQuestionIndex + 1} / {questions.length}
      </Text>

      {/* Add Reset button for development */}
      <TouchableOpacity 
        style={styles.resetButton} 
        onPress={handleReset}
      >
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
  // Add styles for reset button
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
  }
});