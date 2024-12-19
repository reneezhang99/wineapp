import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { generateWineProfile } from './wineProfileGenerator';
import { questions } from './survey';
import { useRouter } from 'expo-router';

export default function Page() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  
  const handleAnswer = (answer) => {
    setAnswers({
      ...answers,
      [currentQuestionIndex]: answer
    });
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
          params: { profile }
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
  }
});