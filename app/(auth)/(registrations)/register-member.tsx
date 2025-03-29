import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
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

// Dummy data for fitness goals
const fitnessGoals = [
  'Weight Loss',
  'Muscle Gain',
  'Strength Training',
  'General Fitness',
  'Flexibility',
  'Endurance',
];

export default function RegisterMemberScreen() {
  const colorScheme = useColorScheme();
  const theme = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form state
  const [formData, setFormData] = useState({
    full_name: '',
    mobile_number: '',
    email: '',
    age: '',
    height: '',
    weight: '',
    selectedGoals: [] as string[],
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

  // Toggle fitness goal selection
  const toggleGoal = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      selectedGoals: prev.selectedGoals.includes(goal)
        ? prev.selectedGoals.filter(g => g !== goal)
        : [...prev.selectedGoals, goal],
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
    if (formData.age && isNaN(Number(formData.age))) tempErrors.age = 'Enter valid age';
    if (formData.height && isNaN(Number(formData.height))) tempErrors.height = 'Enter valid height';
    if (formData.weight && isNaN(Number(formData.weight))) tempErrors.weight = 'Enter valid weight';

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
          role: 'member',
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

        // Insert into member_profiles table
        const { error: memberError } = await supabase.from('member_profiles').upsert({
          id: session.user.id,
          age: formData.age ? parseInt(formData.age) : null,
          height: formData.height ? parseFloat(formData.height) : null,
          weight: formData.weight ? parseFloat(formData.weight) : null,
          fitness_goals: formData.selectedGoals,
        });

        if (memberError) {
          console.error('Error creating member profile:', memberError);
          alert('Failed to create member profile. Please try again.');
          return;
        }

        // Navigate to success screen or dashboard
        router.push('/member-dashboard');
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
              Register as Member
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView className='flex-1 px-6'>
          {/* Personal Information */}
          <RegistrationInput title='Personal Information'>
            <InputField
              label='Full Name'
              placeholder='e.g. Priya Patel'
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
              placeholder='e.g. priya@gmail.com'
              keyboardType='email-address'
              required
              value={formData.email}
              onChangeText={text => updateFormData('email', text.toLowerCase())}
              error={errors.email}
            />
          </RegistrationInput>

          {/* Fitness Profile */}
          <RegistrationInput title='Fitness Profile'>
            <InputField
              label='Age'
              placeholder='e.g. 25'
              keyboardType='number-pad'
              value={formData.age}
              onChangeText={text => updateFormData('age', text)}
              error={errors.age}
            />
            <InputField
              label='Height (cm)'
              placeholder='e.g. 165'
              keyboardType='number-pad'
              value={formData.height}
              onChangeText={text => updateFormData('height', text)}
              error={errors.height}
            />
            <InputField
              label='Weight (kg)'
              placeholder='e.g. 60'
              keyboardType='number-pad'
              value={formData.weight}
              onChangeText={text => updateFormData('weight', text)}
              error={errors.weight}
            />

            {/* Fitness Goals */}
            <View className='mb-4'>
              <Text
                style={{ color: theme.text }}
                className='text-base font-medium mb-2'
              >
                Fitness Goals
              </Text>
              <View className='flex-row flex-wrap gap-2'>
                {fitnessGoals.map(goal => (
                  <TouchableOpacity
                    key={goal}
                    onPress={() => toggleGoal(goal)}
                    className={`px-4 py-2 rounded-lg border ${
                      formData.selectedGoals.includes(goal) ? 'bg-yellow-400' : 'bg-transparent'
                    }`}
                    style={{
                      borderColor: theme.primary,
                    }}
                  >
                    <Text
                      style={{
                        color: formData.selectedGoals.includes(goal) ? '#000' : theme.text,
                      }}
                    >
                      {goal}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
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
