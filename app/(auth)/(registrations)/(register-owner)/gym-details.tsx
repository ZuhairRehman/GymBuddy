/**
 * Gym Details Registration Screen
 * Second step in the gym owner registration process
 * Collects gym-specific information and business contact details
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
import { supabase } from '@/lib/supabase/supabase';

/**
 * GymDetailsScreen Component
 * @component
 * Features:
 * - Collects gym business information
 * - Handles address and contact details
 * - Validates business email format
 * - Form validation with error messages
 */
export default function GymDetailsScreen() {
  const colorScheme = useColorScheme();
  const theme = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];

  const [formData, setFormData] = useState({
    gymName: '',
    description: '',
    businessEmail: '',
    businessPhone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pinCode: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  /**
   * Validates form fields
   * Checks required fields and format validation
   * @returns boolean indicating if form is valid
   */
  const validateForm = () => {
    let tempErrors: Record<string, string> = {};

    // Basic Information
    if (!formData.gymName) tempErrors.gymName = 'Gym name is required';

    // Contact Information
    if (!formData.businessEmail) tempErrors.businessEmail = 'Business email is required';
    // Simpler email validation that accepts both personal and custom domains
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.businessEmail))
      tempErrors.businessEmail = 'Enter valid email address';
    if (!formData.businessPhone) tempErrors.businessPhone = 'Business phone is required';
    if (!/^\d{10}$/.test(formData.businessPhone))
      tempErrors.businessPhone = 'Enter valid 10-digit number';

    // Location Information
    if (!formData.addressLine1) tempErrors.addressLine1 = 'Address is required';
    if (!formData.city) tempErrors.city = 'City is required';
    if (!formData.state) tempErrors.state = 'State is required';
    if (!formData.pinCode) tempErrors.pinCode = 'PIN code is required';
    if (!/^\d{5}$/.test(formData.pinCode)) tempErrors.pinCode = 'Enter valid 6-digit PIN code';

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

        // Insert gym details into the gyms table
        const { error: insertError } = await supabase.from('gyms').insert({
          owner_id: session.user.id, // User ID from Supabase Auth
          name: formData.gymName,
          description: formData.description,
          business_email: formData.businessEmail,
          business_phone_number: formData.businessPhone,
          address_line1: formData.addressLine1,
          address_line2: formData.addressLine2,
          city: formData.city,
          state: formData.state,
          pin_code: formData.pinCode,
        });

        if (insertError) {
          // Handle specific database constraint violations
          if (insertError.code === '23505') {
            // Unique constraint violation (e.g., duplicate gym name for the same owner)
            alert('A gym with this name already exists. Please choose a different name.');
          } else {
            // General error handling
            console.error('Error inserting gym details:', insertError);
            alert('Failed to save gym details. Please try again.');
          }
          return;
        }

        // Navigate to the next step in the registration process
        router.push('/(auth)/(registrations)/(register-owner)/gym-facilities');
      } catch (error) {
        console.error('Unexpected error:', error);
        alert('An unexpected error occurred. Please try again.');
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
              Gym Details
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView className='flex-1 px-6'>
          {/* Basic Gym Information */}
          <RegistrationInput title='Basic Information'>
            <InputField
              label='Gym Name'
              placeholder='e.g. Fitness Hub India'
              required
              value={formData.gymName}
              onChangeText={text => updateFormData('gymName', text)}
              error={errors.gymName}
            />
            <InputField
              label='Description'
              placeholder='Brief description of your gym'
              multiline
              numberOfLines={3}
              value={formData.description}
              onChangeText={text => updateFormData('description', text)}
            />
          </RegistrationInput>

          {/* Contact Information */}
          <RegistrationInput
            title='Contact Information'
            helperText='You can use your personal email (e.g. @gmail.com) or business domain email'
          >
            <InputField
              label='Business Email'
              placeholder='e.g. gym@gmail.com or contact@yourgym.com'
              keyboardType='email-address'
              required
              value={formData.businessEmail}
              onChangeText={text => updateFormData('businessEmail', text.toLowerCase())}
              error={errors.businessEmail}
              helperText='This email will be used for business communications'
            />
            <InputField
              label='Business Phone'
              placeholder='e.g. 9876543210'
              keyboardType='phone-pad'
              required
              value={formData.businessPhone}
              onChangeText={text => updateFormData('businessPhone', text)}
              error={errors.businessPhone}
            />
          </RegistrationInput>

          {/* Address Information */}
          <RegistrationInput title='Location'>
            <InputField
              label='Address Line 1'
              placeholder='Building name, Street'
              required
              value={formData.addressLine1}
              onChangeText={text => updateFormData('addressLine1', text)}
              error={errors.addressLine1}
            />
            <InputField
              label='Address Line 2'
              placeholder='Area, Landmark'
              value={formData.addressLine2}
              onChangeText={text => updateFormData('addressLine2', text)}
            />
            <InputField
              label='City'
              placeholder='e.g. Mumbai'
              required
              value={formData.city}
              onChangeText={text => updateFormData('city', text)}
              error={errors.city}
            />
            <InputField
              label='State'
              placeholder='e.g. Maharashtra'
              required
              value={formData.state}
              onChangeText={text => updateFormData('state', text)}
              error={errors.state}
            />
            <InputField
              label='PIN Code'
              placeholder='e.g. 400001'
              keyboardType='numeric'
              required
              value={formData.pinCode}
              onChangeText={text => updateFormData('pinCode', text)}
              error={errors.pinCode}
              maxLength={5}
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
