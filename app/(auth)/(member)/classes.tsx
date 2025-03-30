import {
  View,
  Text,
  SafeAreaView,
  useColorScheme,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { COLORS } from '@/constants/theme';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Screen from '@/components/ui/Screen';

const dummyClasses = [
  {
    id: 1,
    name: 'Morning Yoga',
    trainer: 'Priya Singh',
    time: '6:00 AM - 7:00 AM',
    day: 'Tomorrow',
    spots: '8/15',
    level: 'Beginner',
  },
  {
    id: 2,
    name: 'HIIT Training',
    trainer: 'Vikram Mehta',
    time: '7:30 AM - 8:30 AM',
    day: 'Tomorrow',
    spots: '12/20',
    level: 'Advanced',
  },
  // ...more classes
];

export default function ClassesScreen() {
  const colorScheme = useColorScheme();
  const theme = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];

  return (
    <Screen scrollable>
      {/* Header */}
      <View className='p-6'>
        <Text
          style={{ color: theme.text }}
          className='text-2xl font-bold mb-2'
        >
          Group Classes
        </Text>
        <Text
          style={{ color: theme.textSecondary }}
          className='text-base'
        >
          Book your next workout session
        </Text>
      </View>

      <ScrollView className='flex-1'>
        {dummyClasses.map(classItem => (
          <View
            key={classItem.id}
            className='mx-6 mb-4 p-4 rounded-xl'
            style={{ backgroundColor: theme.surface }}
          >
            <View className='flex-row justify-between items-start mb-3'>
              <View>
                <Text
                  style={{ color: theme.text }}
                  className='text-lg font-medium mb-1'
                >
                  {classItem.name}
                </Text>
                <Text
                  style={{ color: theme.textSecondary }}
                  className='text-sm'
                >
                  with {classItem.trainer}
                </Text>
              </View>
              <View className='bg-yellow-400/20 px-3 py-1 rounded-full'>
                <Text
                  style={{ color: theme.primary }}
                  className='text-sm font-medium'
                >
                  {classItem.level}
                </Text>
              </View>
            </View>

            <View className='flex-row items-center mb-4'>
              <MaterialCommunityIcons
                name='clock-outline'
                size={16}
                color={theme.textSecondary}
              />
              <Text
                style={{ color: theme.textSecondary }}
                className='ml-1 text-sm'
              >
                {classItem.day} • {classItem.time}
              </Text>
            </View>

            <View className='flex-row justify-between items-center'>
              <Text
                style={{ color: theme.textSecondary }}
                className='text-sm'
              >
                {classItem.spots} spots available
              </Text>
              <TouchableOpacity
                className='px-4 py-2 rounded-lg'
                style={{ backgroundColor: theme.primary }}
              >
                <Text className='text-black font-medium'>Book Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
}
