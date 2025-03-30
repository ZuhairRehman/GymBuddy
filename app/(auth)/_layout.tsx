import { AuthProvider } from '@/contexts/AuthContext';
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Protected Routes */}
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
        <Stack.Screen
          name='(registrations)'
          options={{ headerShown: false }}
        />

        {/* Auth Routes */}
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
