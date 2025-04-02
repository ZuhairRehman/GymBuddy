// Import necessary components and libraries
import { View, Text, useColorScheme, TouchableOpacity } from 'react-native';
import { COLORS } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Screen from '@/components/ui/Screen';

// Dummy data for the trainer's schedule
const dummySchedule = [
  {
    id: '1',
    clientName: 'Priya Sharma',
    type: 'Personal Training',
    time: '10:00 AM',
    duration: '1 hour',
    status: 'upcoming',
  },
  // Add more sessions...
];

// Main component for the Trainer Schedule screen
export default function TrainerSchedule() {
  const colorScheme = useColorScheme(); // Detect current color scheme (light/dark)
  const theme = COLORS[colorScheme === 'dark' ? 'dark' : 'light']; // Set theme colors

  return (
    <Screen scrollable>
      <View className='px-6'>
        {/* Header Section */}
        <Text
          style={{ color: theme.text }}
          className='text-2xl font-bold mb-6'
        >
          Schedule
        </Text>

        {/* Placeholder for Date Filter */}
        <View className='flex-row justify-between items-center mb-6'>
          {/* Add date picker/filter here */}
        </View>

        {/* Display list of scheduled sessions */}
        <View className='space-y-4'>
          {dummySchedule.map(session => (
            <TouchableOpacity
              key={session.id}
              className='p-4 rounded-xl'
              style={{ backgroundColor: theme.surface }}
            >
              {/* Session Header */}
              <View className='flex-row justify-between items-start mb-2'>
                <Text
                  style={{ color: theme.text }}
                  className='text-lg font-medium'
                >
                  {session.clientName}
                </Text>
                {/* Session Time */}
                <View className='bg-blue-500/20 px-3 py-1 rounded-full'>
                  <Text className='text-blue-500 text-sm'>{session.time}</Text>
                </View>
              </View>
              {/* Session Details */}
              <Text
                style={{ color: theme.textSecondary }}
                className='mb-2'
              >
                {session.type} • {session.duration}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Screen>
  );
}
