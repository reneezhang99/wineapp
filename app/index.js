import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { 
  useFonts,
  PlayfairDisplay_400Regular,
  PlayfairDisplay_400Regular_Italic,
} from '@expo-google-fonts/playfair-display';

const SPLASH_DURATION = 3000; // 3 seconds
const { height } = Dimensions.get('window');

export default function Index() {
  const router = useRouter();
  const translateY = useRef(new Animated.Value(0)).current;

  let [fontsLoaded] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_400Regular_Italic,
  });

  useEffect(() => {
    if (fontsLoaded) {
      // Start background animation
      Animated.timing(translateY, {
        toValue: -200,
        duration: SPLASH_DURATION,
        useNativeDriver: true,
      }).start();

      // Auto-navigate after duration
      const timer = setTimeout(() => {
        router.replace('/survey');
      }, SPLASH_DURATION);

      return () => clearTimeout(timer);
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../assets/images/splashscreen.png')}
        style={[
          styles.backgroundImage,
          {
            transform: [{ translateY }],
          },
        ]}
      />
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundImage: {
    width: '100%',
    height: height * 2, // Double the screen height for scrolling effect
    position: 'absolute',
    resizeMode: 'cover',
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
    color: 'white',
    fontFamily: 'PlayfairDisplay_400Regular',
    letterSpacing: 0.5,
  },
  titleDash: {
    fontSize: 28,
    color: 'white',
    fontFamily: 'PlayfairDisplay_400Regular',
  },
  titleWine: {
    fontSize: 28,
    color: 'white',
    fontFamily: 'PlayfairDisplay_400Regular',
  },
  subtitle: {
    fontSize: 22,
    color: 'white',
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    opacity: 0.9,
    letterSpacing: 0.3,
  },
});