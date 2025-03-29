import React from 'react';
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
import RegistrationInput, { InputField } from '@/components/ui/RegistrationInput';
import UiButton from '@/components/ui/UiButton';

const peakHours = [
  { start: '06:00', end: '08:00', label: 'Morning' },
  { start: '18:00', end: '20:00', label: 'Evening' },
];

export default function GymCapacityScreen() {
  const colorScheme = useColorScheme();
  const theme = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];

  const handleSubmit = () => {
    // Navigate to owner dashboard or confirmation screen
    router.push('/(owner)/[id]');
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
            Gym Capacity
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView className='flex-1 px-6'>
        {/* Overall Capacity */}
        <RegistrationInput title='Maximum Capacity'>
          <InputField
            label='Total Member Capacity'
            placeholder='e.g. 200'
            keyboardType='numeric'
            required
          />
          <InputField
            label='Simultaneous Users'
            placeholder='e.g. 50'
            keyboardType='numeric'
            required
          />
        </RegistrationInput>

        {/* Peak Hours Capacity */}
        <View className='mb-8'>
          <Text
            style={{ color: theme.text }}
            className='text-lg font-bold mb-4'
          >
            Peak Hours Capacity
          </Text>
          {peakHours.map((period, index) => (
            <View
              key={index}
              className='mb-4 p-4 rounded-xl'
              style={{ backgroundColor: theme.surface }}
            >
              <Text
                style={{ color: theme.text }}
                className='text-base font-medium mb-2'
              >
                {period.label} ({period.start} - {period.end})
              </Text>
              <View className='flex-row gap-4'>
                <View className='flex-1'>
                  <InputField
                    label='Expected Traffic'
                    placeholder='e.g. 40'
                    keyboardType='numeric'
                  />
                </View>
                <View className='flex-1'>
                  <InputField
                    label='Max Allowed'
                    placeholder='e.g. 50'
                    keyboardType='numeric'
                  />
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Batch Timings */}
        <RegistrationInput title='Batch Preferences'>
          <InputField
            label='Batch Duration (minutes)'
            placeholder='e.g. 60'
            keyboardType='numeric'
            required
          />
          <InputField
            label='Gap Between Batches (minutes)'
            placeholder='e.g. 15'
            keyboardType='numeric'
            required
          />
        </RegistrationInput>
      </ScrollView>

      {/* Submit Button */}
      <View className='p-6'>
        <UiButton
          children='Complete Registration'
          size='lg'
          onPress={handleSubmit}
        />
      </View>
    </SafeAreaView>
  );
}
