/**
 * Owner Registration - Personal Information Screen
 * First step in the multi-step gym owner registration process
 * Handles initial account creation with Supabase Auth
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { COLORS } from '@/constants/theme';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import RegistrationInput, { InputField } from '@/components/ui/RegistrationInput';
import UiButton from '@/components/ui/UiButton';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase/supabase';

export default function PersonalInfoScreen() {
  const colorScheme = useColorScheme();
  const theme = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];

  const [formData, setFormData] = useState({
    full_name: '',
    mobile_number: '',
    email: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    let tempErrors: Record<string, string> = {};

    if (!formData.full_name) tempErrors.full_name = 'Name is required';
    if (!formData.mobile_number) tempErrors.mobile_number = 'Phone number is required';
    if (!/^\d{10}$/.test(formData.mobile_number))
      tempErrors.mobile_number = 'Enter a valid 10-digit phone number';
    if (!formData.email) tempErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) tempErrors.email = 'Enter a valid email';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleNext = async () => {
    if (validateForm()) {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user) {
          router.replace('/sign-up'); // Redirect to sign-up if no session exists
          return;
        }

        // Insert a new row into the profiles table
        const { error: insertError } = await supabase.from('profiles').upsert(
          {
            id: session.user.id, // User ID from Supabase Auth
            full_name: formData.full_name,
            mobile_number: formData.mobile_number,
            role: 'owner', // Assuming this is the owner registration flow
          },
         
        );

        if (insertError) {
          if (insertError.code === '23505') {
            console.log('Profile already exists. Skipping insertion.');
          } else {
            console.error('Profile creation failed:', insertError);
            setErrors(prev => ({ ...prev, general: 'Failed to create profile' }));
            return;
          }
        }

        // Navigate to the next step in the registration process
        router.push('/(registrations)/(register-owner)/gym-details');
      } catch (error) {
        console.error('Profile handling error:', error);
        setErrors(prev => ({ ...prev, general: 'An unexpected error occurred' }));
      }
    }
  };

  return (
    <SafeAreaView
      className='flex-1'
      style={{ backgroundColor: theme.background }}
    >
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className='flex-1'
      >
        {/* Header */}
        <View className='p-6 mt-5'>
          <TouchableOpacity
            className='flex-row items-center'
            onPress={() => router.back()}
          >
            <MaterialCommunityIcons
              name='arrow-left'
              size={24}
              color={theme.text}
              style={{ marginRight: 8 }}
            />
            <Text
              style={{ color: theme.text }}
              className='text-lg font-medium'
            >
              Personal Information
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView className='flex-1 px-6'>
          <RegistrationInput title='Basic Information'>
            <InputField
              label='Full Name'
              placeholder='e.g. Rajesh Kumar'
              required
              value={formData.full_name}
              onChangeText={text => updateFormData('full_name', text)}
              error={errors.full_name}
            />
            <InputField
              label='Phone Number'
              placeholder='e.g. 9876543210'
              keyboardType='phone-pad'
              required
              value={formData.mobile_number}
              onChangeText={text => updateFormData('mobile_number', text)}
              error={errors.mobile_number}
            />
            <InputField
              label='Email'
              placeholder='e.g. rajesh@gmail.com'
              keyboardType='email-address'
              required
              value={formData.email}
              onChangeText={text => updateFormData('email', text.toLowerCase())}
              error={errors.email}
            />
          </RegistrationInput>
        </ScrollView>

        {/* Next Button */}
        <View className='p-6'>
          <UiButton
            children='Next'
            size='lg'
            onPress={handleNext}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
