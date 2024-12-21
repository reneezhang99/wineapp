import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();

  const navigateToSurvey = () => {
    router.push('/survey');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Remi</Text>
      <Text style={styles.subtitle}>
        The right wine for your vibe.
      </Text>
      <TouchableOpacity style={styles.startButton} onPress={navigateToSurvey}>
        <Text style={styles.startButtonText}>Start sipping</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#FF1493',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  startButton: {
    backgroundColor: '#FF1493',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
