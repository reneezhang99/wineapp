import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { clearStoredData } from './storage-utils';  // Add this import


export default function Profile() {
  const router = useRouter();
  const { profile } = useLocalSearchParams();
  
  // Add error handling for JSON parsing
  let parsedProfile;
  try {
    parsedProfile = JSON.parse(profile);
  } catch (error) {
    console.error('Error parsing profile:', error);
    // If parsing fails, redirect to survey
    router.replace('/survey');
    return <Text>Loading...</Text>;  // Add Text wrapper here
  }

// Use handleReset instead of handleRestart to actually clear the data
const handleReset = async () => {
  try {
    await clearStoredData();  // Clear the stored data
    router.push('/');  // Go back to index/welcome screen
  } catch (error) {
    console.error('Error resetting:', error);
  }
};

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
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

      <TouchableOpacity 
        style={styles.devButton} 
        onPress={handleReset}
      >
        <Text style={styles.devButtonText}>Restart Survey (Dev)</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 80,
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
  devButton: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    backgroundColor: '#666',
    padding: 10,
    borderRadius: 5,
  },
  devButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  }
});