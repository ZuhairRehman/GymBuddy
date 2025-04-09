import React from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface MemberTrendsProps {
  current: number; // Current month's members
  previous: number; // Previous month's members
}

const MemberTrends: React.FC<MemberTrendsProps> = ({ current, previous }) => {
  const trendValue = previous ? Math.round(((current - previous) / previous) * 100) : 100; // If no previous data, assume 100% growth
  const isPositive = current >= previous;

  return (
    <View className='flex-row items-center'>
      <MaterialCommunityIcons
        name={isPositive ? 'trending-up' : 'trending-down'}
        size={16}
        color={isPositive ? '#22c55e' : '#ef4444'}
      />
      <Text
        className='ml-1'
        style={{
          color: isPositive ? '#22c55e' : '#ef4444',
        }}
      >
        {trendValue}%
      </Text>
    </View>
  );
};

export default MemberTrends;
