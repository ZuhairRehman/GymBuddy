import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useColorScheme } from 'react-native';
import { COLORS } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Screen from '@/components/ui/Screen';

const insights = [
  {
    title: 'Member Retention',
    value: '85%',
    trend: '+5%',
    icon: 'account-convert',
    description: 'Higher than last month',
  },
  {
    title: 'Revenue Growth',
    value: '₹62,000',
    trend: '+12%',
    icon: 'trending-up',
    description: 'Compared to last month',
  },
  {
    title: 'Class Attendance',
    value: '78%',
    trend: '-3%',
    icon: 'calendar-check',
    description: 'Lower than usual',
  },
  {
    title: 'New Members',
    value: '24',
    trend: '+8',
    icon: 'account-plus',
    description: 'This month',
  },
];

const timeFilters = ['Week', 'Month', 'Quarter', 'Year'];

export default function AnalyticsScreen() {
  const colorScheme = useColorScheme();
  const theme = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];
  const [activeFilter, setActiveFilter] = React.useState('Month');

  return (
    <Screen>
      {/* Header */}
      <Text
        style={{ color: theme.text }}
        className='text-2xl font-bold'
      >
        Analytics
      </Text>
      <Text
        style={{ color: theme.textSecondary }}
        className='text-base mt-1 mb-6'
      >
        Track your gym's performance
      </Text>

      {/* Time Filter */}
      <View className='flex-row mb-6'>
        {timeFilters.map(filter => (
          <TouchableOpacity
            key={filter}
            onPress={() => setActiveFilter(filter)}
            className={`mr-4 px-4 py-2 rounded-full ${
              activeFilter === filter ? 'bg-yellow-400' : ''
            }`}
            style={activeFilter !== filter ? { backgroundColor: theme.surface } : {}}
          >
            <Text
              style={{
                color: activeFilter === filter ? '#000000' : theme.textSecondary,
              }}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Insights Grid */}
      <View className='flex-row flex-wrap -m-2'>
        {insights.map((insight, index) => (
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
                  name={insight.icon}
                  size={24}
                  color={theme.primary}
                />
                <View className='flex-row items-center'>
                  <MaterialCommunityIcons
                    name={insight.trend.startsWith('+') ? 'trending-up' : 'trending-down'}
                    size={16}
                    color={insight.trend.startsWith('+') ? '#22c55e' : '#ef4444'}
                  />
                  <Text
                    className='ml-1'
                    style={{
                      color: insight.trend.startsWith('+') ? '#22c55e' : '#ef4444',
                    }}
                  >
                    {insight.trend}
                  </Text>
                </View>
              </View>
              <Text
                style={{ color: theme.text }}
                className='text-2xl font-bold'
              >
                {insight.value}
              </Text>
              <Text
                style={{ color: theme.textSecondary }}
                className='text-sm mt-1'
              >
                {insight.title}
              </Text>
              <Text
                style={{ color: theme.textSecondary }}
                className='text-xs mt-1'
              >
                {insight.description}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* AI Insights */}
      <View className='mt-6'>
        <Text
          style={{ color: theme.text }}
          className='text-lg font-semibold mb-4'
        >
          AI Insights
        </Text>
        <View
          className='p-4 rounded-xl'
          style={{ backgroundColor: theme.surface }}
        >
          <View className='flex-row items-center mb-3'>
            <MaterialCommunityIcons
              name='robot'
              size={24}
              color={theme.primary}
            />
            <Text
              style={{ color: theme.text }}
              className='text-base font-medium ml-2'
            >
              Recommendations
            </Text>
          </View>
          <Text
            style={{ color: theme.textSecondary }}
            className='text-sm'
          >
            • Consider introducing new evening classes as peak hours show high demand
          </Text>
          <Text
            style={{ color: theme.textSecondary }}
            className='text-sm mt-2'
          >
            • Member retention could be improved by focusing on beginner-friendly programs
          </Text>
        </View>
      </View>
    </Screen>
  );
}
