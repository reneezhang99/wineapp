import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function Profile() {
  const params = useLocalSearchParams();
  const profile = params.profile;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🍷 Your Wine Personality 🍷</Text>
      <Text style={styles.profile}>{profile}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  profile: {
    fontSize: 16,
    lineHeight: 24,
    padding: 15,
  },
});