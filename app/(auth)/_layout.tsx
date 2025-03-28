import { AuthProvider } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase/supabase';
import { router, Stack } from 'expo-router';
import { useEffect } from 'react';

export default function AuthLayout() {
  /**
   * Configure auth state change handler
   * Manages navigation based on authentication state
   */
  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Fetch the user's role from the profiles table
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (error || !profile) {
          console.error('Error fetching user role:', error);
          router.push('/(auth)/sign-up'); // Redirect to role selection if no profile exists
          return;
        }

        // Redirect based on the user's role
        switch (profile.role) {
          case 'owner':
            router.replace('/(owner)/dashboard');
            break;
          case 'trainer':
            router.replace('/(registrations)/register-trainer'); // Replace with trainer dashboard if it exists
            break;
          case 'member':
            router.replace('/(registrations)/register-member'); // Replace with member dashboard if it exists
            break;
          default:
            console.error('Unknown role:', profile.role);
            router.replace('/login'); // Redirect to login for unknown roles
        }
      } else if (event === 'SIGNED_OUT') {
        router.replace('/login');
      }
    });
  }, []);

  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name='(owner)'
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='(registrations)'
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='(login)'
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='(sign-up)'
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='(forgot-password)'
          options={{ headerShown: false }}
        />
      </Stack>
    </AuthProvider>
  );
}
