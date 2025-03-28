import React from 'react';
import { View, Text, TouchableOpacity, useColorScheme } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme'; // Assuming theme constants are here

// Assuming Role type definition
interface Role {
  id: string;
  title: string;
  description: string;
  icon: string;
  benefits: string[];
}

interface RoleCardProps {
  role: Role;
  onPress: () => void;
}

/**
 * Role Selection Card Component
 * Displays user role options with visual representation and benefits
 */

/**
 * RoleCard Component
 * @component
 * @param {Object} props
 * @param {Role} props.role - Role data to display
 * @param {Function} props.onPress - Handler for card selection
 *
 * Features:
 * - Visual role representation
 * - Benefits list
 * - Theme-aware styling
 * - Touch feedback
 */
export default function RoleCard({ role, onPress }: RoleCardProps) {
  const colorScheme = useColorScheme();
  const theme = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];

  return (
    <TouchableOpacity
      className='rounded-2xl p-6 my-5'
      style={{ backgroundColor: theme.surface }}
      onPress={onPress}
    >
      <View className='flex-row items-center mb-2'>
        <View
          className='w-12 h-12 rounded-xl items-center justify-center mr-4'
          style={{ backgroundColor: theme.primary + '20' }}
        >
          <MaterialCommunityIcons
            name={role.icon as any}
            size={24}
            color={theme.primary}
          />
        </View>
        <View className='flex-1'>
          <Text
            style={{ color: theme.text }}
            className='text-base font-bold mb-0.5 ml-2'
          >
            {role.title}
          </Text>
          <Text
            style={{ color: theme.textSecondary }}
            className='text-md'
          >
            {role.description}
          </Text>
        </View>
      </View>
      <View className='space-y-1.5 ml-13'>
        {role.benefits.map((benefit, index) => (
          <View
            key={index}
            className='flex-row items-center'
          >
            <MaterialCommunityIcons
              name='check-circle'
              size={16}
              color={theme.primary}
              style={{ marginRight: 8 }}
            />
            <Text
              style={{ color: theme.textSecondary }}
              className='text-sm'
            >
              {benefit}
            </Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
}
