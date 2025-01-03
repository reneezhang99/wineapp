import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  useFonts,
  PlayfairDisplay_400Regular,
  PlayfairDisplay_400Regular_Italic,
} from '@expo-google-fonts/playfair-display';

export default function Index() {
  const router = useRouter();

  let [fontsLoaded] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_400Regular_Italic,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={() => router.push('/survey')}
      activeOpacity={0.9}
    >
      <LinearGradient
        colors={[
          '#FFA07A',  // Light salmon
          '#FFC4D6',  // Cotton candy pink
          '#DCD0FF',  // Soft periwinkle
        ]}
        locations={[0.2, 0.5, 0.8]}
        style={styles.gradient}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.content}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Remi</Text>
              <Text style={styles.titleDash}> — </Text>
              <Text style={styles.titleWine}>wine</Text>
            </View>
            <Text style={styles.subtitle}>uncomplicated.</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    color: '#2B2B2B',
    fontFamily: 'PlayfairDisplay_400Regular',
    letterSpacing: 0.5,
  },
  titleDash: {
    fontSize: 28,
    color: '#2B2B2B',
    fontFamily: 'PlayfairDisplay_400Regular',
  },
  titleWine: {
    fontSize: 28,
    color: '#2B2B2B',
    fontFamily: 'PlayfairDisplay_400Regular',
  },
  subtitle: {
    fontSize: 22,
    color: '#2B2B2B',
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    opacity: 0.9,
    letterSpacing: 0.3,
  },
});