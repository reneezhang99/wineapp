import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { getWineProfile } from './storage-utils';

export default function Layout() {
  const router = useRouter();

  useEffect(() => {
    const checkProfile = async () => {
      const savedProfile = await getWineProfile();
      if (savedProfile) {
        router.replace({
          pathname: "/profile",
          params: { profile: JSON.stringify(savedProfile) }
        });
      }
    };
    checkProfile();
  }, []);

  return (
    <Stack 
      screenOptions={{
        headerTitle: '',
        headerBackTitle: 'Back',    // Custom text
        headerBackTitleVisible: false,  // Removes text, leaves just arrow
        headerTransparent: true,
        animation: 'slide_from_right'
      }}
    >
      <Stack.Screen 
        name="index"
        options={{
          headerShown: false // Welcome screen has no header
        }}
      />
      <Stack.Screen name="survey" />
      <Stack.Screen name="profile" />
    </Stack>
  );
}