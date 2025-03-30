import { AppState } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Initialize Supabase client with secure storage configuration
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: {
      async getItem(key) {
        const item = await SecureStore.getItemAsync(key);
        return item;
      },
      async setItem(key, value) {
        await SecureStore.setItemAsync(key, value);
      },
      async removeItem(key) {
        await SecureStore.deleteItemAsync(key);
      },
    },
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

/**
 * Retrieves the current session state
 * @returns Object containing session and any potential error
 */
export const initSession = async () => {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  return { session, error };
};

/**
 * App state listener for session management
 * Handles token refresh when app comes to foreground
 */
AppState.addEventListener('change', async nextAppState => {
  if (nextAppState === 'active') {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session) {
      await supabase.auth.refreshSession();
    }
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});
