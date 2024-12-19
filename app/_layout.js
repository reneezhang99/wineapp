import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Wine Profile Survey" }} />
      <Stack.Screen name="profile" options={{ title: "Your Wine Profile" }} />
    </Stack>
  );
}