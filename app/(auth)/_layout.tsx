// Import necessary modules and components
import { AuthProvider } from '@/contexts/AuthContext';
import { Stack } from 'expo-router';

// AuthLayout component wraps authentication-related screens with the AuthProvider
export default function AuthLayout() {
  return (
    // Provide authentication context to all child screens
    <AuthProvider>
      {/* Stack navigator for managing screen transitions */}
      <Stack screenOptions={{ headerShown: false }}>
        {/* Protected Routes */}
        {/* These routes are accessible only to authenticated users */}
        <Stack.Screen
          name='(owner)'
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='(member)'
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='(trainer)'
          options={{ headerShown: false }}
        />

        {/* Registration Routes */}
        {/* Routes for user registration and related flows */}
        <Stack.Screen
          name='(registrations)'
          options={{ headerShown: false }}
        />

        {/* Auth Routes */}
        {/* Routes for login, sign-up, and password recovery */}
        <Stack.Screen
          name='index'
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='login'
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='sign-up'
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='forgot-password'
          options={{ headerShown: false }}
        />
      </Stack>
    </AuthProvider>
  );
}
