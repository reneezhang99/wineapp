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
        headerTransparent: true,
        animation: 'slide_from_right'
      }}
    >
      <Stack.Screen 
        name="index"
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen name="survey" />
      <Stack.Screen name="profile" />
    </Stack>
  );
}