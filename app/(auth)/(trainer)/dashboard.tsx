import { View, Text, useColorScheme } from 'react-native';
import { COLORS } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Screen from '@/components/ui/Screen';

const dummyData = {
  trainerName: 'Amit Kumar',
  stats: [
    {
      title: 'Total Clients',
      value: '24',
      icon: 'account-group',
      trend: { value: 8, isPositive: true },
    },
    {
      title: "Today's Sessions",
      value: '6',
      icon: 'calendar-today',
      trend: { value: 2, isPositive: true },
    },
    {
      title: 'Hours Trained',
      value: '180',
      icon: 'clock-outline',
      trend: { value: 12, isPositive: true },
    },
    {
      title: 'Avg. Rating',
      value: '4.8',
      icon: 'star',
      trend: { value: 0.2, isPositive: true },
    },
  ],
};

export default function TrainerDashboard() {
  const colorScheme = useColorScheme();
  const theme = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];

  return (
    <Screen scrollable>
      {/* Header */}
      <View className='px-6 mb-6'>
        <Text
          style={{ color: theme.text }}
          className='text-2xl font-bold mb-2'
        >
          Welcome back,
        </Text>
        <Text
          style={{ color: theme.primary }}
          className='text-lg font-medium'
        >
          {dummyData.trainerName}
        </Text>
      </View>

      {/* Stats Grid */}
      <View className='flex-row flex-wrap px-4'>
        {dummyData.stats.map((stat, index) => (
          <View
            key={index}
            className='w-1/2 p-2'
          >
            <View
              className='p-4 rounded-xl'
              style={{ backgroundColor: theme.surface }}
            >
              <View className='flex-row justify-between items-center mb-2'>
                <MaterialCommunityIcons
                  name={stat.icon as any}
                  size={24}
                  color={theme.primary}
                />
                <View className='flex-row items-center'>
                  <MaterialCommunityIcons
                    name={stat.trend.isPositive ? 'trending-up' : 'trending-down'}
                    size={16}
                    color={stat.trend.isPositive ? '#22c55e' : '#ef4444'}
                  />
                  <Text
                    className='ml-1'
                    style={{
                      color: stat.trend.isPositive ? '#22c55e' : '#ef4444',
                    }}
                  >
                    {stat.trend.value}%
                  </Text>
                </View>
              </View>
              <Text
                style={{ color: theme.textSecondary }}
                className='text-sm'
              >
                {stat.title}
              </Text>
              <Text
                style={{ color: theme.text }}
                className='text-xl font-bold mt-1'
              >
                {stat.value}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Today's Schedule */}
      {/* Add schedule section here */}

      {/* Recent Client Activity */}
      {/* Add client activity section here */}
    </Screen>
  );
}
