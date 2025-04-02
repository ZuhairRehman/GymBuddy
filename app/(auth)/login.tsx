// Import necessary modules and components
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  useColorScheme,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { COLORS } from '@/constants/theme';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import UiButton from '@/components/ui/UiButton';
import { useAuth } from '@/contexts/AuthContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

/**
 * Login Screen Component
 * Handles user authentication flow, form validation, and error handling
 * Integrates with Supabase authentication through AuthContext
 */

/**
 * LoginScreen Component
 * @component
 * Features:
 * - Email and password authentication
 * - Real-time form validation
 * - Error handling with user feedback
 * - Seamless navigation to registration and password recovery
 */

// LoginScreen component handles user authentication and login functionality
export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const theme = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];
  const router = useRouter();
  const { signIn, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loginError, setLoginError] = useState<string | null>(null);
  // Add this with other state declarations
  const [showPassword, setShowPassword] = useState(false);

  /**
   * Validates form inputs
   * Ensures email and password meet required criteria
   * @returns boolean indicating if form is valid
   */
  const validateForm = () => {
    let tempErrors: Record<string, string> = {};

    // Email validation
    if (!formData.email) {
      tempErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      tempErrors.email = 'Enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      tempErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      tempErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  /**
   * Handles login form submission
   * Attempts to authenticate the user with provided credentials
   */
  const handleLogin = async () => {
    setLoginError(null);

    if (!validateForm()) return;

    try {
      const { error } = await signIn(formData.email.toLowerCase(), formData.password);

      if (error) {
        setLoginError(error.message);
      }
      // Navigation handled by auth state listener
    } catch (error) {
      setLoginError('An unexpected error occurred');
    }
  };

  return (
    <SafeAreaView
      className='flex-1'
      style={{ backgroundColor: theme.background }}
    >
      {/* Set the status bar style based on the theme */}
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className='flex-1'
      >
        {/* Top Section with Logo */}
        <View className='flex-1 justify-center'>
          {/* Display app logo */}
          <View className='items-center'>
            <View
              className='w-48 h-48 items-center justify-center mb-8'
              style={{ backgroundColor: theme.background }}
            >
              <Image
                source={require('@/assets/images/MainLogo.png')}
                style={{
                  width: '100%',
                  height: '100%',
                  maxWidth: 180,
                  maxHeight: 180,
                }}
                resizeMode='contain'
              />
            </View>
            <Text
              style={{ color: theme.textSecondary }}
              className='text-xl font-bold mt-20'
            >
              Your Fitness Journey Starts Here
            </Text>
          </View>
        </View>

        {/* Bottom Section with Form */}
        <View className='flex-1 px-6'>
          <View className='space-y-6'>
            {/* Display login error if any */}
            {loginError && <Text className='text-red-500 text-sm text-center'>{loginError}</Text>}

            {/* Email Input */}
            <View>
              <TextInput
                value={formData.email}
                onChangeText={text => {
                  setFormData(prev => ({ ...prev, email: text }));
                  if (errors.email) {
                    setErrors(prev => ({ ...prev, email: '' }));
                  }
                }}
                placeholder='Email'
                placeholderTextColor={theme.textSecondary}
                className={`h-16 px-6 rounded-2xl text-base my-5 ${
                  errors.email ? 'border border-red-500' : ''
                }`}
                style={{
                  backgroundColor: theme.surface,
                  color: theme.text,
                }}
                keyboardType='email-address'
                autoCapitalize='none'
                autoComplete='email'
              />
              {errors.email && (
                <Text className='text-red-500 text-xs ml-2 -mt-4'>{errors.email}</Text>
              )}
            </View>

            {/* Password Input */}
            <View>
              <View className='relative'>
                <TextInput
                  value={formData.password}
                  onChangeText={text => {
                    setFormData(prev => ({ ...prev, password: text }));
                    if (errors.password) {
                      setErrors(prev => ({ ...prev, password: '' }));
                    }
                  }}
                  placeholder='Password'
                  placeholderTextColor={theme.textSecondary}
                  secureTextEntry={!showPassword}
                  className={`h-16 px-6 pr-12 rounded-2xl text-base my-5 ${
                    errors.password ? 'border border-red-500' : ''
                  }`}
                  style={{
                    backgroundColor: theme.surface,
                    color: theme.text,
                  }}
                  autoComplete='password'
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-10'
                  style={{ top: 35 }}
                >
                  <MaterialCommunityIcons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color={theme.textSecondary}
                  />
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text className='text-red-500 text-xs ml-2 -mt-4'>{errors.password}</Text>
              )}
            </View>

            {/* Forgot Password */}
            <TouchableOpacity
              onPress={() => router.push('/forgot-password')}
              className='self-end'
            >
              <Text
                style={{ color: theme.textSecondary }}
                className='text-base'
              >
                Forgot Password?
              </Text>
            </TouchableOpacity>

            {/* Login Button */}
            <UiButton
              onPress={handleLogin}
              isLoading={isLoading}
              disabled={isLoading}
              variant='primary'
              size='lg'
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </UiButton>

            {/* Register Link */}
            <View className='flex-row justify-center mt-7'>
              <Text
                style={{ color: theme.textSecondary }}
                className='text-base'
              >
                Don't have an account?{' '}
              </Text>
              <TouchableOpacity onPress={() => router.push('/sign-up')}>
                <Text
                  style={{ color: theme.text }}
                  className='text-base font-medium'
                >
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
