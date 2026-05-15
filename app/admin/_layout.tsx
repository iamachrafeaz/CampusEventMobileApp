import { useAuthStore } from '@/store/useAuthStore';
import { Redirect, Stack } from 'expo-router';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function AdminLayout() {
  const { isLoggedIn, userType } = useAuthStore();

  if (!isLoggedIn || userType !== "ADMIN") {
    return <Redirect href="/auth/login" />;
  }

  return (
    <SafeAreaProvider>
      <Stack>
        <Stack.Screen name="home" options={{ headerShown: false }} />
        <Stack.Screen name="eventForm" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaProvider>

  );
}
