import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from './theme';


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
    backgroundColor: theme.colors.background,
    padding: theme.spacing.medium,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: theme.fonts.heading,
    color: theme.colors.text,
    fontSize: 32,
    textAlign: 'center',
  },
  button: {
    backgroundColor: theme.colors.button,
    padding: theme.spacing.medium,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  }
});
