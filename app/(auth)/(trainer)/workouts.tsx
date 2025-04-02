// Import necessary components and libraries
import { View, Text, useColorScheme, TouchableOpacity } from 'react-native';
import { COLORS } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Screen from '@/components/ui/Screen';

// Define workout categories with name, icon, and count
const workoutCategories = [
  { name: 'Strength Training', icon: 'weight-lifter', count: 12 },
  { name: 'HIIT', icon: 'lightning-bolt', count: 8 },
  { name: 'Cardio', icon: 'run', count: 6 },
  { name: 'Flexibility', icon: 'yoga', count: 4 },
];

// Main component for the Trainer Workouts screen
export default function TrainerWorkouts() {
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
          Workout Plans
        </Text>

        {/* Display workout categories */}
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
                {/* Category Icon */}
                <MaterialCommunityIcons
                  name={category.icon as any}
                  size={24}
                  color={theme.primary}
                />
                {/* Category Name */}
                <Text
                  style={{ color: theme.text }}
                  className='text-lg font-medium mt-2'
                >
                  {category.name}
                </Text>
                {/* Workout Count */}
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

        {/* Placeholder for Recent Workouts Section */}
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
