import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useColorScheme } from 'react-native';
import { COLORS } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Screen from '@/components/ui/Screen';
import type { Member, OwnerDashboardState } from '@/types/owner-types';

interface StatItem {
  title: string;
  value: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  trend: { value: number; isPositive: boolean };
}

// Mock data with proper typing
const stats: StatItem[] = [
  {
    title: 'Total Members',
    value: '234',
    icon: 'account-group',
    trend: { value: 12, isPositive: true },
  },
  {
    title: 'Revenue',
    value: '₹52,000',
    icon: 'currency-inr',
    trend: { value: 8, isPositive: true },
  },
  {
    title: 'Active Classes',
    value: '12',
    icon: 'calendar-check',
    trend: { value: 5, isPositive: false },
  },
  {
    title: "Today's Traffic",
    value: '45/100',
    icon: 'trending-up',
    trend: { value: 15, isPositive: true },
  },
];

const recentMembers: Pick<
  Member,
  'id' | 'firstName' | 'lastName' | 'role' | 'phone' | 'profileImage'
>[] = [
  {
    id: '1',
    firstName: 'Rahul',
    lastName: 'Sharma',
    role: 'member',
    phone: '9876543210',
    profileImage: undefined,
  },
  // ... more members
];

const mockDashboardState: Partial<OwnerDashboardState> = {
  membershipSummary: {
    total: 234,
    active: 180,
    expired: 40,
    pendingRenewal: 14,
    revenueThisMonth: 52000,
    revenueLastMonth: 48000,
    growthRate: 8.33,
  },
  capacityNow: 45,
};

export default function OwnerDashboard() {
  const colorScheme = useColorScheme();
  const theme = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];

  return (
    <Screen scrollable>
      {/* Header */}
      <Text
        style={{ color: theme.text }}
        className='text-2xl font-bold'
      >
        Dashboard
      </Text>
      <Text
        style={{ color: theme.textSecondary }}
        className='text-base mt-1 mb-6'
      >
        Overview of your gym's performance
      </Text>

      {/* Stats Grid */}
      <View className='flex-row flex-wrap -m-2'>
        {stats.map((stat, index) => (
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

      {/* Quick Actions */}
      <Text
        style={{ color: theme.text }}
        className='text-lg font-semibold mt-8 mb-4'
      >
        Quick Actions
      </Text>
      <View className='flex-row flex-wrap -m-2'>
        {['Scan QR', 'Add Member', 'Create Invoice', 'View Reports'].map((action, index) => (
          <TouchableOpacity
            key={index}
            className='w-1/2 p-2'
          >
            <View
              className='p-4 rounded-xl items-center'
              style={{ backgroundColor: theme.surface }}
            >
              <MaterialCommunityIcons
                name={['qrcode-scan', 'account-plus', 'receipt', 'file-chart'][index]}
                size={24}
                color={theme.primary}
              />
              <Text
                style={{ color: theme.text }}
                className='mt-2'
              >
                {action}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Recent Activity */}
      <View className='mt-8'>
        <View className='flex-row justify-between items-center mb-4'>
          <Text
            style={{ color: theme.text }}
            className='text-lg font-semibold'
          >
            Recent Members
          </Text>
          <TouchableOpacity
            onPress={() => router.push(`/(owner)/${mockDashboardState.selectedGym}/manage`)}
          >
            <Text style={{ color: theme.primary }}>View All</Text>
          </TouchableOpacity>
        </View>
        <View className='space-y-4'>
          {recentMembers.map(member => (
            <TouchableOpacity
              key={member.id}
              className='p-4 rounded-xl'
              style={{ backgroundColor: theme.surface }}
              onPress={() =>
                router.push(`/(owner)/${mockDashboardState.selectedGym}/manage/${member.id}`)
              }
            >
              <View className='flex-row justify-between items-center'>
                <View>
                  <Text
                    style={{ color: theme.text }}
                    className='text-base font-medium'
                  >
                    {`${member.firstName} ${member.lastName}`}
                  </Text>
                  <Text
                    style={{ color: theme.textSecondary }}
                    className='text-sm mt-1'
                  >
                    {member.phone}
                  </Text>
                </View>
                {member.profileImage && (
                  <Image
                    source={{ uri: member.profileImage }}
                    className='w-10 h-10 rounded-full'
                  />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Screen>
  );
}
