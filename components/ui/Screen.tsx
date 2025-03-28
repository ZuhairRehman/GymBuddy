/**
 * Screen Component
 * A reusable screen wrapper that provides consistent layout and behavior
 * Features:
 * - Safe area handling
 * - Keyboard avoiding behavior
 * - Scrollable content option
 * - Theme-aware styling
 * - Status bar management
 */

import React from 'react';
import {
  View,
  SafeAreaView,
  useColorScheme,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ViewStyle,
} from 'react-native';
import { COLORS } from '@/constants/theme';

interface ScreenProps {
  children: React.ReactNode;
  scrollable?: boolean; // Enable scrolling content
  withPadding?: boolean; // Add default padding
  keyboardAvoiding?: boolean; // Handle keyboard behavior
  style?: ViewStyle; // Custom styles
}

/**
 * @component Screen
 * A consistent screen wrapper for the application
 *
 * @example
 * <Screen scrollable keyboardAvoiding>
 *   <YourContent />
 * </Screen>
 */
export default function Screen({
  children,
  scrollable = false,
  withPadding = true,
  keyboardAvoiding = false,
  style,
}: ScreenProps) {
  const colorScheme = useColorScheme();
  const theme = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];

  const Content = () => (
    <View
      className={`flex-1 mt-8 ${withPadding ? 'px-6 pb-24' : ''}`}
      style={[{ backgroundColor: theme.background }, style]}
    >
      {children}
    </View>
  );

  const MainContent = () => {
    if (scrollable) {
      return (
        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={false}
          className='flex-1'
          contentContainerStyle={{ paddingBottom: 90 }}
        >
          <Content />
        </ScrollView>
      );
    }
    return <Content />;
  };

  return (
    <SafeAreaView
      className='flex-1'
      style={{ backgroundColor: theme.background }}
    >
      <StatusBar
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />
      {keyboardAvoiding ? (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className='flex-1'
        >
          <MainContent />
        </KeyboardAvoidingView>
      ) : (
        <MainContent />
      )}
    </SafeAreaView>
  );
}
