import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { useColorScheme } from 'react-native';
import { COLORS } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Screen from '@/components/ui/Screen';
import { supabase } from '@/lib/supabase/supabase';
import { router } from 'expo-router';

const dummyProfile = {
  name: 'Amit Kumar',
  email: 'amit.kumar@gmail.com',
  phone: '+91 98765 43210',
  trainerId: 'TR001',
  joinDate: '10 January 2024',
  specializations: ['Weight Training', 'CrossFit', 'HIIT'],
  yearsExperience: '5+ years',
};

const menuItems = [
  { icon: 'account-edit', label: 'Edit Profile', route: 'edit-profile' },
  { icon: 'certificate', label: 'Certifications', route: 'certifications' },
  { icon: 'bell-outline', label: 'Notifications', route: 'notifications' },
  { icon: 'cog', label: 'Settings', route: 'settings' },
  { icon: 'help-circle', label: 'Help & Support', route: 'support' },
  { icon: 'logout', label: 'Logout', route: 'logout' },
];

export default function TrainerProfile() {
  const colorScheme = useColorScheme();
  const theme = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await supabase.auth.signOut();
              router.replace('/(auth)/login/');
            } catch (error) {
              console.error('Error signing out:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <Screen scrollable>
      {/* Profile Header */}
      <View className='p-6 items-center'>
        <View className='w-24 h-24 rounded-full bg-gray-300 mb-4'>
          <Image
            source={require('@/assets/images/member_avatar.png')}
            className='w-full h-full rounded-full'
          />
        </View>
        <Text
          style={{ color: theme.text }}
          className='text-2xl font-bold mb-1'
        >
          {dummyProfile.name}
        </Text>
        <Text
          style={{ color: theme.textSecondary }}
          className='text-base mb-4'
        >
          Trainer ID: {dummyProfile.trainerId}
        </Text>
      </View>

      {/* Specializations */}
      <View className='mx-6 mb-6'>
        <Text
          style={{ color: theme.text }}
          className='text-base font-medium mb-3'
        >
          Specializations
        </Text>
        <View className='flex-row flex-wrap gap-2'>
          {dummyProfile.specializations.map(spec => (
            <View
              key={spec}
              className='px-3 py-1 rounded-full'
              style={{ backgroundColor: theme.surfaceHighlight }}
            >
              <Text
                style={{ color: theme.primary }}
                className='text-sm'
              >
                {spec}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Menu Items */}
      <View className='mx-6'>
        {menuItems.map(item => (
          <TouchableOpacity
            key={item.label}
            className='flex-row items-center py-4 border-b'
            style={{ borderColor: theme.border }}
            onPress={() => {
              if (item.label === 'Logout') {
                handleSignOut();
              } else {
                router.push(item.route as any);
              }
            }}
          >
            <MaterialCommunityIcons
              name={item.icon}
              size={24}
              color={item.label === 'Logout' ? '#EF4444' : theme.text}
            />
            <Text
              style={{ color: item.label === 'Logout' ? '#EF4444' : theme.text }}
              className='flex-1 ml-3 text-base'
            >
              {item.label}
            </Text>
            <MaterialCommunityIcons
              name='chevron-right'
              size={20}
              color={theme.textSecondary}
            />
          </TouchableOpacity>
        ))}
      </View>
    </Screen>
  );
}
