import { View, Text, useColorScheme, TouchableOpacity } from 'react-native';
import { COLORS } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Screen from '@/components/ui/Screen';

const workoutCategories = [
  { name: 'Strength Training', icon: 'weight-lifter', count: 12 },
  { name: 'HIIT', icon: 'lightning-bolt', count: 8 },
  { name: 'Cardio', icon: 'run', count: 6 },
  { name: 'Flexibility', icon: 'yoga', count: 4 },
];

export default function TrainerWorkouts() {
  const colorScheme = useColorScheme();
  const theme = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];

  return (
    <Screen scrollable>
      <View className='px-6'>
        <Text
          style={{ color: theme.text }}
          className='text-2xl font-bold mb-6'
        >
          Workout Plans
        </Text>

        {/* Categories */}
        <View className='flex-row flex-wrap -m-2'>
          {workoutCategories.map(category => (
            <TouchableOpacity
              key={category.name}
              className='w-1/2 p-2'
            >
              <View
                className='p-4 rounded-xl'
                style={{ backgroundColor: theme.surface }}
              >
                <MaterialCommunityIcons
                  name={category.icon as any}
                  size={24}
                  color={theme.primary}
                />
                <Text
                  style={{ color: theme.text }}
                  className='text-lg font-medium mt-2'
                >
                  {category.name}
                </Text>
                <Text
                  style={{ color: theme.textSecondary }}
                  className='text-sm'
                >
                  {category.count} workouts
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Workouts */}
        <Text
          style={{ color: theme.text }}
          className='text-lg font-semibold mt-6 mb-4'
        >
          Recent Workouts
        </Text>
        {/* Add recent workouts list here */}
      </View>
    </Screen>
  );
}
