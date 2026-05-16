import { toastConfig } from '@/config/ToastConfig';
import { initDatabase } from '@/database/init';
import { useAuthStore } from '@/store/useAuthStore';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

export default function RootLayout() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initDatabase();
    void initializeAuth();
  }, []);

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="admin" />
        <Stack.Screen name="student" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="events/[id]" options={{ headerShown: false }} />
      </Stack>
      <Toast config={toastConfig} />
    </SafeAreaProvider>
  );
}
