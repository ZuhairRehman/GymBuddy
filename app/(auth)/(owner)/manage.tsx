// Import necessary modules and components
import React from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { useColorScheme } from 'react-native';
import { COLORS } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Screen from '@/components/ui/Screen';
import type { Member } from '@/types/owner-types';

// Mock data for members
const members: Partial<Member>[] = [
  {
    id: '1',
    firstName: 'Rahul',
    lastName: 'Sharma',
    membershipId: 'MEM001',
    phone: '9876543210',
    profileImage: 'https://via.placeholder.com/100',
    status: 'active',
  },
  {
    id: '2',
    firstName: 'Priya',
    lastName: 'Patel',
    membershipId: 'MEM002',
    phone: '9876543211',
    profileImage: 'https://via.placeholder.com/100',
    status: 'pending',
  },
  // Add more mock members as needed
];

const filters = ['All', 'Active', 'Pending', 'Expired'];

// ManageScreen component allows gym owners to manage their members
export default function ManageScreen() {
  const colorScheme = useColorScheme();
  const theme = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];
  const [activeFilter, setActiveFilter] = React.useState('All');

  return (
    <Screen>
      {/* Header Section */}
      <Text
        style={{ color: theme.text }}
        className='text-2xl font-bold'
      >
        Members
      </Text>
      <Text
        style={{ color: theme.textSecondary }}
        className='text-base mt-1 mb-6'
      >
        Manage your gym members
      </Text>

      {/* Search Bar */}
      <View className='flex-row items-center mb-6'>
        {/* Input field for searching members */}
        <View
          className='flex-1 flex-row items-center p-4 rounded-xl'
          style={{ backgroundColor: theme.surface }}
        >
          <MaterialCommunityIcons
            name='magnify'
            size={20}
            color={theme.textSecondary}
          />
          <TextInput
            placeholder='Search members...'
            placeholderTextColor={theme.textSecondary}
            className='flex-1 ml-2'
            style={{ color: theme.text }}
          />
        </View>
        {/* Button to add a new member */}
        <TouchableOpacity
          className='ml-4 p-4 rounded-xl'
          style={{ backgroundColor: theme.primary }}
          onPress={() => router.push('/(owner)/manage/add')}
        >
          <MaterialCommunityIcons
            name='plus'
            size={20}
            color='#000000'
          />
        </TouchableOpacity>
      </View>

      {/* Filters Section */}
      <View className='flex-row mb-6'>
        {/* Filter buttons for member status */}
        {filters.map(filter => (
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

      {/* Member List Section */}
      <View className='space-y-4'>
        {/* Display list of members */}
        {members.map(member => (
          <TouchableOpacity
            key={member.id}
            className='p-4 mb-5 rounded-xl'
            style={{ backgroundColor: theme.surface }}
            onPress={() => router.push(`/(owner)/manage/${member.id}`)}
          >
            <View className='flex-row items-center'>
              {/* Placeholder for profile image */}
              <View
                className='w-12 h-12 rounded-full bg-gray-200 mr-4'
                style={{ backgroundColor: theme.surfaceHighlight }}
              />
              <View className='flex-1'>
                {/* Member name */}
                <Text
                  style={{ color: theme.text }}
                  className='text-base font-medium'
                >
                  {member.firstName} {member.lastName}
                </Text>
                {/* Membership ID */}
                <Text
                  style={{ color: theme.textSecondary }}
                  className='text-sm'
                >
                  {member.membershipId}
                </Text>
              </View>
              {/* Chevron icon for navigation */}
              <MaterialCommunityIcons
                name='chevron-right'
                size={24}
                color={theme.textSecondary}
              />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </Screen>
  );
}
