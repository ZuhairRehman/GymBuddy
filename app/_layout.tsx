import { Stack } from 'expo-router';
import '../global.css';
import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider } from '@/contexts/AuthContext';

/**
 * Root App Layout
 * This is the main layout component that wraps the entire application.
 * It handles core functionality such as:
 * - Authentication state management through AuthProvider
 * - Font loading and initialization
 * - Splash screen management
 * - Stack navigation configuration
 * - Screen routing and deep linking support
 */

/**
 * RootLayout Component
 * @component
 * @description
 * Core application wrapper that manages essential app configurations and providers.
 * Implements a stack-based navigation system with three main routes:
 * - (welcome-screens): Onboarding and introduction screens
 * - (auth): Authentication related screens (login, register, etc.)
 * - index: Main application entry point
 */
export default function RootLayout() {
  // Prevent splash screen from auto-hiding until fonts are loaded
  SplashScreen.preventAutoHideAsync();

  // Initialize font loading
  const [fontsLoaded, fontError] = useFonts({
    // Custom fonts can be added here
    // Format: 'fontFamily': require('./path/to/font')
  });

  // Handle splash screen visibility based on font loading status
  useEffect(() => {
    // Hide splash screen once fonts are loaded or if there's an error
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Show nothing until fonts are loaded
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <AuthProvider>
      {/* Stack Navigator Configuration */}
      <Stack screenOptions={{ headerShown: false }}>
        {/* Welcome/Onboarding Screens Group */}
        <Stack.Screen
          name='(welcome-screens)'
          options={{ headerShown: false }}
        />
        {/* Authentication Screens Group */}
        <Stack.Screen
          name='(auth)'
          options={{ headerShown: false }}
        />
        {/* Main App Entry Point */}
        <Stack.Screen
          name='index'
          options={{ headerShown: false }}
        />
      </Stack>
    </AuthProvider>
  );
}
