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

const dummyWorkouts = [
  {
    id: 1,
    date: '15 March 2024',
    name: 'Upper Body Strength',
    exercises: [
      { name: 'Bench Press', sets: '3x12', weight: '60kg' },
      { name: 'Shoulder Press', sets: '3x10', weight: '40kg' },
      { name: 'Tricep Pushdown', sets: '3x15', weight: '25kg' },
    ],
    duration: '45 mins',
    calories: '320',
  },
  // ...more workouts
];

export default function WorkoutsScreen() {
  const colorScheme = useColorScheme();
  const theme = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

      {/* Header */}
      <View className='p-6 flex-row justify-between items-center'>
        <Text
          style={{ color: theme.text }}
          className='text-2xl font-bold'
        >
          My Workouts
        </Text>
        <TouchableOpacity
          className='px-4 py-2 rounded-lg'
          style={{ backgroundColor: theme.primary }}
        >
          <Text className='text-black font-medium'>Log Workout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className='flex-1'>
        {dummyWorkouts.map(workout => (
          <View
            key={workout.id}
            className='mx-6 mb-4 p-4 rounded-xl'
            style={{ backgroundColor: theme.surface }}
          >
            <View className='flex-row justify-between items-center mb-3'>
              <Text
                style={{ color: theme.text }}
                className='text-base font-medium'
              >
                {workout.name}
              </Text>
              <Text
                style={{ color: theme.textSecondary }}
                className='text-sm'
              >
                {workout.date}
              </Text>
            </View>

            {workout.exercises.map((exercise, index) => (
              <View
                key={index}
                className='flex-row justify-between py-2'
              >
                <Text
                  style={{ color: theme.text }}
                  className='flex-1'
                >
                  {exercise.name}
                </Text>
                <Text
                  style={{ color: theme.textSecondary }}
                  className='w-20'
                >
                  {exercise.sets}
                </Text>
                <Text
                  style={{ color: theme.textSecondary }}
                  className='w-20'
                >
                  {exercise.weight}
                </Text>
              </View>
            ))}

            <View
              className='flex-row mt-3 pt-3 border-t'
              style={{ borderColor: theme.border }}
            >
              <View className='flex-row items-center mr-4'>
                <MaterialCommunityIcons
                  name='clock-outline'
                  size={16}
                  color={theme.textSecondary}
                />
                <Text
                  style={{ color: theme.textSecondary }}
                  className='ml-1 text-sm'
                >
                  {workout.duration}
                </Text>
              </View>
              <View className='flex-row items-center'>
                <MaterialCommunityIcons
                  name='fire'
                  size={16}
                  color={theme.textSecondary}
                />
                <Text
                  style={{ color: theme.textSecondary }}
                  className='ml-1 text-sm'
                >
                  {workout.calories} cal
                </Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
