// Import the Stack component from expo-router to manage navigation
import { Stack } from 'expo-router';

// RegistrationFormsLayout Component
// This layout manages the navigation stack for the registration process.
// It hides the header for all screens and defines the navigation flow.
export default function RegistrationFormsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Default screen for the registration process */}
      <Stack.Screen name='index' />
      {/* Screen for selecting a role */}
      <Stack.Screen name='role-selection' />
      {/* Nested group for gym owner registration */}
      <Stack.Screen name='(register-owner)' />
      {/* Screen for member registration */}
      <Stack.Screen name='register-member' />
      {/* Screen for trainer registration */}
      <Stack.Screen name='register-trainer' />
    </Stack>
  );
}
