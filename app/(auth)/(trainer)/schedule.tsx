import { View, Text, useColorScheme, TouchableOpacity } from 'react-native';
import { COLORS } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Screen from '@/components/ui/Screen';

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

export default function TrainerSchedule() {
  const colorScheme = useColorScheme();
  const theme = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];

  return (
    <Screen scrollable>
      <View className='px-6'>
        <Text
          style={{ color: theme.text }}
          className='text-2xl font-bold mb-6'
        >
          Schedule
        </Text>

        {/* Date Filter */}
        <View className='flex-row justify-between items-center mb-6'>
          {/* Add date picker/filter here */}
        </View>

        {/* Sessions List */}
        <View className='space-y-4'>
          {dummySchedule.map(session => (
            <TouchableOpacity
              key={session.id}
              className='p-4 rounded-xl'
              style={{ backgroundColor: theme.surface }}
            >
              <View className='flex-row justify-between items-start mb-2'>
                <Text
                  style={{ color: theme.text }}
                  className='text-lg font-medium'
                >
                  {session.clientName}
                </Text>
                <View className='bg-blue-500/20 px-3 py-1 rounded-full'>
                  <Text className='text-blue-500 text-sm'>{session.time}</Text>
                </View>
              </View>
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
