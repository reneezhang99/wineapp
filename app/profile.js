import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function Profile() {
  const { profile } = useLocalSearchParams();
  const parsedProfile = JSON.parse(profile);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>🍷 Your Wine Personality 🍷</Text>
        
        <Text style={styles.subheading}>Aura Name: {parsedProfile.auraName}</Text>
        
        <Text style={styles.paragraph}>
          {parsedProfile.personalityDescription}
        </Text>

        <Text style={styles.subheading}>Wine Preferences and Recommendations:</Text>
        <Text style={styles.paragraph}>
          {parsedProfile.winePreferences}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  subheading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  }
});