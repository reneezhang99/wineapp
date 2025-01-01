import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { clearStoredData } from './storage-utils';
import { theme } from './theme';

export default function Profile() {
  const router = useRouter();
  const { profile } = useLocalSearchParams();
  const parsedProfile = JSON.parse(profile);

  const handleReset = async () => {
    try {
      await clearStoredData();
      router.push('/');
    } catch (error) {
      console.error('Error resetting:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>Your Wine Aura ✨</Text>
          
          <Text style={styles.subheading}>
            {parsedProfile.auraName}
          </Text>
          
          <Text style={styles.paragraph}>
            {parsedProfile.personalityDescription}
          </Text>

          <Text style={styles.recommendationTitle}>
            Wine Preferences and Recommendations
          </Text>
          <Text style={styles.paragraph}>
            {parsedProfile.winePreferences}
          </Text>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.continueButton} 
          onPress={() => router.replace('actions')}
        >
          <Text style={styles.continueButtonText}>Continue →</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.devButton} 
          onPress={handleReset}
        >
          <Text style={styles.devButtonText}>Reset Survey (Dev)</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontFamily: theme.fonts.heading,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 40,
  },
  subheading: {
    fontSize: 24,
    fontFamily: theme.fonts.heading,
    color: theme.colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  recommendationTitle: {
    fontSize: 20,
    fontFamily: theme.fonts.heading,
    color: theme.colors.text,
    marginTop: 40,
    marginBottom: 20,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: theme.colors.text,
    marginBottom: 20,
    fontFamily: theme.fonts.body,
  },
  buttonContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  continueButton: {
    backgroundColor: theme.colors.button,
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    width: '100%',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  devButton: {
    backgroundColor: '#666',
    padding: 8,
    borderRadius: 4,
    alignSelf: 'flex-end',
  },
  devButtonText: {
    color: 'white',
    fontSize: 12,
  }
});