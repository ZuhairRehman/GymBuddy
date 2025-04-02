/**
 * Onboarding Layout Component
 * @component
 * @description Provides navigation stack configuration for onboarding screens
 */
import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name='index' />
    </Stack>
  );
}
