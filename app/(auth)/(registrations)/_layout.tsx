import { Stack } from 'expo-router';

export default function RegistrationFormsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name='role-selection' />
      <Stack.Screen name='(register-owner)' />
      <Stack.Screen name='register-member' />
      <Stack.Screen name='register-trainer' />
    </Stack>
  );
}
