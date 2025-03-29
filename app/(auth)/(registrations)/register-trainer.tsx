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
import UiButton from '@/components/ui/UiButton';
import RegistrationInput, { InputField } from '@/components/ui/RegistrationInput';
import { supabase } from '@/lib/supabase/supabase';

// Predefined specializations for trainers
const specializations = [
  'Weight Training',
  'Yoga',
  'CrossFit',
  'HIIT',
  'Calisthenics',
  'Zumba',
  'Boxing',
  'Pilates',
];

export default function RegisterTrainerScreen() {
  const colorScheme = useColorScheme();
  const theme = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form state
  const [formData, setFormData] = useState({
    full_name: '',
    mobile_number: '',
    email: '',
    years_experience: '',
    certifications: [] as string[],
    selectedSpecializations: [] as string[],
  });

  // Update form data
  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Toggle specialization selection
  const toggleSpecialization = (specialization: string) => {
    setFormData(prev => ({
      ...prev,
      selectedSpecializations: prev.selectedSpecializations.includes(specialization)
        ? prev.selectedSpecializations.filter(s => s !== specialization)
        : [...prev.selectedSpecializations, specialization],
    }));
  };

  // Form validation
  const validateForm = () => {
    const tempErrors: Record<string, string> = {};

    if (!formData.full_name) tempErrors.full_name = 'Name is required';
    if (!formData.mobile_number) tempErrors.mobile_number = 'Phone number is required';
    if (!/^\d{10}$/.test(formData.mobile_number))
      tempErrors.mobile_number = 'Enter valid 10-digit number';
    if (!formData.email) tempErrors.email = 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      tempErrors.email = 'Enter valid email address';
    if (!formData.years_experience) tempErrors.years_experience = 'Years of experience is required';
    if (formData.selectedSpecializations.length === 0)
      tempErrors.specializations = 'Select at least one specialization';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (validateForm()) {
      setLoading(true);
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user) {
          router.replace('/sign-up');
          return;
        }

        // Insert into profiles table
        const { error: profileError } = await supabase.from('profiles').upsert({
          id: session.user.id,
          full_name: formData.full_name,
          mobile_number: formData.mobile_number,
          role: 'trainer',
        });

        if (profileError) {
          if (profileError.code === '23505') {
            alert('This phone number is already registered.');
          } else {
            console.error('Error creating profile:', profileError);
            alert('Failed to create profile. Please try again.');
          }
          return;
        }

        // Insert into trainer_profiles table
        const { error: trainerError } = await supabase.from('trainer_profiles').upsert({
          id: session.user.id,
          years_experience: parseInt(formData.years_experience),
          certifications: formData.certifications,
          specializations: formData.selectedSpecializations,
        });

        if (trainerError) {
          console.error('Error creating trainer profile:', trainerError);
          if (trainerError.code === '42501') {
            alert('Permission denied. Please contact support.');
          } else {
            alert('Failed to create trainer profile. Please try again.');
          }
          return;
        }

        // Navigate to success screen or dashboard
        router.push('/trainer-dashboard');
      } catch (error) {
        console.error('Unexpected error:', error);
        alert('An unexpected error occurred. Please try again.');
      } finally {
        setLoading(false);
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
              Register as Trainer
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView className='flex-1 px-6'>
          {/* Personal Information */}
          <RegistrationInput title='Personal Information'>
            <InputField
              label='Full Name'
              placeholder='e.g. Amit Sharma'
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
              placeholder='e.g. amit@gmail.com'
              keyboardType='email-address'
              required
              value={formData.email}
              onChangeText={text => updateFormData('email', text.toLowerCase())}
              error={errors.email}
            />
          </RegistrationInput>

          {/* Professional Information */}
          <RegistrationInput title='Professional Information'>
            <InputField
              label='Years of Experience'
              placeholder='Put 0 if no experience'
              keyboardType='number-pad'
              required
              value={formData.years_experience}
              onChangeText={text => updateFormData('years_experience', text)}
              error={errors.years_experience}
            />
            <InputField
              label='Certifications'
              placeholder='e.g. ACE, NSCA, ISSA'
              onChangeText={text => {
                const certs = text
                  .split(',')
                  .map(cert => cert.trim())
                  .filter(cert => cert);
                setFormData(prev => ({ ...prev, certifications: certs }));
              }}
            />

            {/* Specializations */}
            <View className='mb-4'>
              <Text
                style={{ color: theme.text }}
                className='text-base font-medium mb-2'
              >
                Specializations
              </Text>
              <View className='flex-row flex-wrap gap-2'>
                {specializations.map(specialization => (
                  <TouchableOpacity
                    key={specialization}
                    onPress={() => toggleSpecialization(specialization)}
                    className={`px-4 py-2 rounded-lg border ${
                      formData.selectedSpecializations.includes(specialization)
                        ? 'bg-yellow-400'
                        : 'bg-transparent'
                    }`}
                    style={{
                      borderColor: theme.primary,
                    }}
                  >
                    <Text
                      style={{
                        color: formData.selectedSpecializations.includes(specialization)
                          ? '#000'
                          : theme.text,
                      }}
                    >
                      {specialization}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {errors.specializations && (
                <Text className='text-red-500 text-sm mt-1'>{errors.specializations}</Text>
              )}
            </View>
          </RegistrationInput>
        </ScrollView>

        {/* Register Button */}
        <View className='p-6'>
          <UiButton
            children='Create Account'
            size='lg'
            onPress={handleSubmit}
            loading={loading}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
