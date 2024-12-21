import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { clearStoredData } from './storage-utils';

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
          <Text style={styles.title}>
            <Text>🍷</Text> Your Wine Personality <Text>🍷</Text>
          </Text>
          
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

      {/* Only dev reset button at bottom */}
      <View style={styles.buttonContainer}>
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
    backgroundColor: 'white',
  },
  scrollContent: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 60,
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
  },
  buttonContainer: {
    padding: 20,
    paddingBottom: 40,
    alignItems: 'flex-end', // Aligns reset button to right
  },
  devButton: {
    backgroundColor: '#666',
    padding: 10,
    borderRadius: 5,
  },
  devButtonText: {
    color: 'white',
    fontSize: 12,
  }
});