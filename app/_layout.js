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
    <Stack>
      <Stack.Screen name="index" options={{ title: "Wine Profile Survey" }} />
      <Stack.Screen name="profile" options={{ title: "Your Wine Profile" }} />
    </Stack>
  );
}