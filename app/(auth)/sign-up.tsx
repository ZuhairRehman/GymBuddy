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
import { supabase } from '@/lib/supabase/supabase';

// SignUpScreen component handles user registration functionality
export default function SignUpScreen() {
  const colorScheme = useColorScheme();
  const theme = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];
  const router = useRouter();
  const { signUp, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [signUpError, setSignUpError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  /**
   * Validates form inputs
   * Ensures email and password meet required criteria
   */
  const validateForm = () => {
    let tempErrors: Record<string, string> = {};

    if (!formData.email) {
      tempErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      tempErrors.email = 'Enter a valid email address';
    }

    if (!formData.password) {
      tempErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      tempErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  /**
   * Handles sign-up form submission
   * Registers a new user with provided credentials
   */
  const handleSignUp = async () => {
    setSignUpError(null);

    if (!validateForm()) return;

    try {
      // Only create auth user, no profile creation here
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email.toLowerCase(),
        password: formData.password,
      });

      if (signUpError || !authData.user) {
        setSignUpError(signUpError?.message || 'Failed to create account');
        return;
      }

      // Navigate to role selection
      router.replace('/(registrations)/role-selection');
    } catch (error) {
      console.error('Signup error:', error);
      setSignUpError('An unexpected error occurred');
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
        {/* Logo Section */}
        <View className='flex-1 justify-center'>
          {/* Display app logo */}
          <View className='items-center'>
            <View className='w-48 h-48 items-center justify-center mb-8'>
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
              Create Your Account
            </Text>
          </View>
        </View>

        {/* Form Section */}
        <View className='flex-1 px-6'>
          <View className='space-y-6'>
            {/* Display sign-up error if any */}
            {signUpError && <Text className='text-red-500 text-sm text-center'>{signUpError}</Text>}

            {/* Email Input */}
            <View>
              <TextInput
                value={formData.email}
                onChangeText={text => {
                  setFormData(prev => ({ ...prev, email: text }));
                  if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                }}
                placeholder='Email'
                placeholderTextColor={theme.textSecondary}
                className={`h-16 px-6 rounded-2xl text-base my-5 ${
                  errors.email ? 'border border-red-500' : ''
                }`}
                style={{ backgroundColor: theme.surface, color: theme.text }}
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
            {/* Sign Up Button */}
            <UiButton
              onPress={handleSignUp}
              isLoading={isLoading}
              disabled={isLoading}
              variant='primary'
              size='lg'
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </UiButton>

            {/* Login Link */}
            <View className='flex-row justify-center mt-7'>
              <Text
                style={{ color: theme.textSecondary }}
                className='text-base'
              >
                Already have an account?{' '}
              </Text>
              <TouchableOpacity onPress={() => router.push('/login')}>
                <Text
                  style={{ color: theme.text }}
                  className='text-base font-medium'
                >
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
