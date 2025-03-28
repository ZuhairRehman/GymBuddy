import { Stack } from 'expo-router';
import '../global.css';
import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider } from '@/contexts/AuthContext';

/**
 * Root App Layout
 * Manages app-wide configuration, authentication state, and navigation
 * Initializes essential providers and handles deep linking
 */

/**
 * RootLayout Component
 * @component
 * Features:
 * - Authentication state management
 * - Font loading and splash screen handling
 * - Theme provider integration
 * - Navigation configuration
 */
export default function RootLayout() {
  // Keep the splash screen visible while we fetch resources
  SplashScreen.preventAutoHideAsync();

  const [fontsLoaded, fontError] = useFonts({
    // Add your custom fonts here if needed
  });

  /**
   * Handle font loading and splash screen
   */
  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Hide splash screen once fonts are loaded or if there's an error
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name='(welcome-screens)'
        options={{ headerShown: false }}
      />
     
        <Stack.Screen
          name='(auth)'
          options={{ headerShown: false }}
        />
    
    </Stack>
  );
}
