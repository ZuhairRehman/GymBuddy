/**
 * Root Index Component
 * @component
 * @description
 * Entry point of the application that handles:
 * - Initial route determination
 * - Authentication status checking
 * - User role-based routing
 * - First launch detection
 */

import { View, ActivityIndicator } from 'react-native';
import { useEffect } from 'react';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase/supabase';
import { AppStorage } from '@/lib/storage/appStorage';
import { COLORS } from '@/constants/theme';
import { useColorScheme } from 'react-native';

/**
 * Index Component
 * Displays loading indicator while determining initial route
 * Routes users based on:
 * 1. First launch status
 * 2. Authentication state
 * 3. User role (if authenticated)
 */
export default function Index() {
  const colorScheme = useColorScheme();
  const theme = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];

  useEffect(() => {
    /**
     * Determines and navigates to appropriate initial route
     * Checks authentication, user role, and first launch status
     */
    const checkInitialRoute = async () => {
      try {
        // Check if this is first launch
        const isFirstLaunch = await AppStorage.isFirstLaunch();

        // Check authentication status
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) throw error;

        if (session) {
          // User is logged in - check their role and redirect
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

          if (profile?.role) {
            router.replace(`/(auth)/(${profile.role})/dashboard`);
          } else {
            router.replace('/(auth)/sign-up');
          }
        } else {
          // User is not logged in
          if (isFirstLaunch) {
            router.replace('/(welcome-screens)');
          } else {
            router.replace('/(auth)/login');
          }
        }
      } catch (error) {
        console.error('Initial route error:', error);
        router.replace('/(auth)/login');
      }
    };

    checkInitialRoute();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.background,
      }}
    >
      <ActivityIndicator
        size='large'
        color={theme.primary}
      />
    </View>
  );
}
