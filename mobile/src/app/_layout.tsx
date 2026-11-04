import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { configureNotifications } from '@/lib/notifications';
import { StoreProvider } from '@/lib/store';
import { colors } from '@/theme';

configureNotifications();

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StoreProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: colors.bg },
            headerShadowVisible: false,
            headerTintColor: colors.primary,
            headerTitleStyle: { color: colors.ink, fontWeight: '700' },
            contentStyle: { backgroundColor: colors.bg },
            headerBackButtonDisplayMode: 'minimal',
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="senior" options={{ headerShown: false, gestureEnabled: false }} />
          <Stack.Screen name="aidant" options={{ title: 'PilulAmi', headerBackVisible: false }} />
          <Stack.Screen name="medicament" options={{ presentation: 'modal', title: 'Médicament' }} />
          <Stack.Screen name="scan" options={{ presentation: 'modal', title: "Scanner l'ordonnance" }} />
          <Stack.Screen name="reglages" options={{ title: 'Réglages' }} />
        </Stack>
      </StoreProvider>
    </SafeAreaProvider>
  );
}
