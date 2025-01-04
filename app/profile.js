import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { clearStoredData } from './storage-utils';

export default function Profile() {
  const router = useRouter();
  const { profile } = useLocalSearchParams();
  const parsedProfile = JSON.parse(profile);
  console.log('Parsed Profile Data:', parsedProfile);

  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: '2-digit'
  }).replace(/ /g, ' ').toUpperCase();

  const preferences = parsedProfile.preferences;

  const handleReset = async () => {
    try {
      await clearStoredData();
      router.replace('/');
    } catch (error) {
      console.error('Error resetting:', error);
      Alert.alert('Error', 'Failed to reset. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/background.png')}
        style={StyleSheet.absoluteFill}
      />
      
      <View style={styles.contentContainer}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.dateText}>WINE PERSONA</Text>
            <Text style={styles.headerText}>{formattedDate}</Text>
          </View>

          <Text style={styles.title}>Your Wine Persona</Text>
          
          <Text style={styles.description}>
            {parsedProfile.personalityDescription}
          </Text>

          <Text style={styles.preferencesTitle}>TASTE PREFERENCES</Text>
          
          <View style={styles.preferenceRow}>
            <Text style={styles.preferenceLabel}>Acidity</Text>
            <Text style={styles.preferenceValue}>{parsedProfile.preferences.acidity}</Text>
          </View>

          <View style={styles.preferenceRow}>
            <Text style={styles.preferenceLabel}>Body</Text>
            <Text style={styles.preferenceValue}>{parsedProfile.preferences.body}</Text>
          </View>

          <View style={styles.preferenceRow}>
            <Text style={styles.preferenceLabel}>Sweetness</Text>
            <Text style={styles.preferenceValue}>{parsedProfile.preferences.sweetness}</Text>
          </View>

          <View style={styles.preferenceRow}>
            <Text style={styles.preferenceLabel}>Flavours</Text>
            <Text style={styles.preferenceValue}>{parsedProfile.preferences.flavours}</Text>
          </View>
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          onPress={handleReset}
          style={styles.retakeButton}
        >
          <Text style={styles.retakeText}>Retake the quiz</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.continueButton} 
          onPress={() => router.replace('actions')}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dateText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#000',
  },
  headerText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#000',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
    color: '#000',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 30,
    color: '#000',
  },
  preferencesTitle: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#000',
    marginBottom: 20,
  },
  preferenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    paddingVertical: 15,
  },
  preferenceLabel: {
    fontSize: 16,
    color: '#000',
  },
  preferenceValue: {
    fontSize: 16,
    color: '#000',
  },
  bottomContainer: {
    gap: 12,
    marginTop: 'auto',
    marginBottom: 20,
  },
  retakeButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  retakeText: {
    color: '#fff',
    fontSize: 16,
  },
  continueButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
  },
});