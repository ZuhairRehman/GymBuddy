import { View, ActivityIndicator } from 'react-native';
import { useEffect } from 'react';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase/supabase';
import { AppStorage } from '@/lib/storage/appStorage';
import { COLORS } from '@/constants/theme';
import { useColorScheme } from 'react-native';

export default function Index() {
  const colorScheme = useColorScheme();
  const theme = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];

  useEffect(() => {
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
