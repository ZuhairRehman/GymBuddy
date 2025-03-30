/**
 * Owner Registration Layout
 * Manages navigation stack for the multi-step registration process
 * Provides consistent navigation behavior between registration steps
 */

import { Stack } from 'expo-router';

/**
 * RegisterOwnerLayout Component
 * @component
 * Features:
 * - Stack navigation for registration steps
 * - Headerless navigation
 * - Consistent screen transitions
 */
export default function RegisterOwnerLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name='index' />
      <Stack.Screen name='gym-details' />
      <Stack.Screen name='gym-facilities' />
      <Stack.Screen name='gym-pricing' />
      <Stack.Screen name='gym-capacity' />
    </Stack>
  );
}
