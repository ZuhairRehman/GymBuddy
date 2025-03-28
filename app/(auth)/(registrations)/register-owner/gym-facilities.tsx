import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { COLORS } from '@/constants/theme';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import RegistrationInput from '@/components/ui/RegistrationInput';
import UiButton from '@/components/ui/UiButton';
import { supabase } from '@/lib/supabase/supabase';

const facilities = [
  'Cardio Area',
  'Weight Training',
  'CrossFit Zone',
  'Yoga Studio',
  'Steam Room',
  'Locker Room',
  'Parking',
  'Shower',
  'WiFi',
  'Cafe',
  'Pro Shop',
  'Personal Training',
];

const operatingDays = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export default function GymFacilitiesScreen() {
  const colorScheme = useColorScheme();
  const theme = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];

  const [formData, setFormData] = useState({
    facilities: [] as string[],
    operatingHours: {} as Record<string, { open: string; close: string }>,
  });

  const toggleFacility = (facility: string) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter(f => f !== facility)
        : [...prev.facilities, facility],
    }));
  };

  const handleNext = async () => {
    if (formData.facilities.length === 0) {
      alert('Please select at least one facility.');
      return;
    }

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.replace('/sign-up'); // Redirect to sign-up if no session exists
        return;
      }

      // Fetch the gym ID for the authenticated user
      const { data: gym, error: gymError } = await supabase
        .from('gyms')
        .select('id')
        .eq('owner_id', session.user.id)
        .single();

      if (gymError || !gym) {
        console.error('Error fetching gym ID:', gymError);
        alert('Failed to fetch gym details. Please try again.');
        return;
      }

      // Insert selected facilities into the gym_facilities table
      const facilitiesData = formData.facilities.map(facility => ({
        gym_id: gym.id,
        facility_name: facility,
      }));

      const { error: insertError } = await supabase.from('gym_facilities').insert(facilitiesData);

      if (insertError) {
        console.error('Error inserting facilities:', insertError);
        alert('Failed to save facilities. Please try again.');
        return;
      }

      // Navigate to the next step in the registration process
      router.push('/(auth)/register-owner/gym-pricing');
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <SafeAreaView
      className='flex-1'
      style={{ backgroundColor: theme.background }}
    >
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

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
            Gym Facilities
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView className='flex-1 px-6'>
        {/* Facilities Selection */}
        <View className='mb-8'>
          <Text
            style={{ color: theme.text }}
            className='text-lg font-bold mb-4'
          >
            Available Facilities
          </Text>
          <View className='flex-row flex-wrap gap-2'>
            {facilities.map(facility => (
              <TouchableOpacity
                key={facility}
                onPress={() => toggleFacility(facility)}
                className={`px-4 py-2 rounded-lg border ${
                  formData.facilities.includes(facility) ? 'bg-yellow-400' : 'bg-transparent'
                }`}
                style={{
                  borderColor: theme.primary,
                }}
              >
                <Text
                  style={{
                    color: formData.facilities.includes(facility) ? '#000' : theme.text,
                  }}
                >
                  {facility}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Operating Hours */}
        <View className='mb-8'>
          <Text
            style={{ color: theme.text }}
            className='text-lg font-bold mb-4'
          >
            Operating Hours
          </Text>
          {operatingDays.map(day => (
            <View
              key={day}
              className='flex-row items-center justify-between py-4 border-b'
              style={{ borderColor: theme.surfaceHighlight }}
            >
              <Text
                style={{ color: theme.text }}
                className='text-base'
              >
                {day}
              </Text>
              <View className='flex-row items-center'>
                <TouchableOpacity className='bg-gray-100 px-4 py-2 rounded-lg'>
                  <Text>09:00 AM</Text>
                </TouchableOpacity>
                <Text
                  style={{ color: theme.text }}
                  className='mx-2'
                >
                  to
                </Text>
                <TouchableOpacity className='bg-gray-100 px-4 py-2 rounded-lg'>
                  <Text>10:00 PM</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Next Button */}
      <View className='p-6'>
        <UiButton
          children='Next'
          size='lg'
          onPress={handleNext}
        />
      </View>
    </SafeAreaView>
  );
}
