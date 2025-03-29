import {
  View,
  Text,
  SafeAreaView,
  useColorScheme,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { COLORS } from '@/constants/theme';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase/supabase';
import { router } from 'expo-router';

const dummyProfile = {
  name: 'Rahul Sharma',
  email: 'rahul.sharma@gmail.com',
  phone: '+91 98765 43210',
  membershipId: 'MEM001',
  joinDate: '15 January 2024',
  stats: {
    workouts: '24',
    classes: '12',
    streak: '5 days',
  },
  goals: ['Weight Loss', 'Muscle Gain'],
};

const menuItems = [
  { icon: 'account-edit', label: 'Edit Profile', route: 'edit-profile' },
  { icon: 'file-document', label: 'Documents', route: 'documents' },
  { icon: 'bell-outline', label: 'Notifications', route: 'notifications' },
  { icon: 'help-circle', label: 'Help & Support', route: 'support' },
  { icon: 'cog', label: 'Settings', route: 'settings' },
  { icon: 'logout', label: 'Logout', route: 'logout' },
];

const handleSignOut = async () => {
  Alert.alert(
    'Sign Out',
    'Are you sure you want to sign out?',
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            router.replace('/login');
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

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const theme = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

      <ScrollView className='flex-1'>
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
            Member ID: {dummyProfile.membershipId}
          </Text>
        </View>

        {/* Stats */}
        <View className='mx-6 flex-row justify-between mb-6'>
          {Object.entries(dummyProfile.stats).map(([key, value]) => (
            <View
              key={key}
              className='items-center p-4 rounded-xl flex-1 mx-2'
              style={{ backgroundColor: theme.surface }}
            >
              <Text
                style={{ color: theme.primary }}
                className='text-lg font-bold mb-1'
              >
                {value}
              </Text>
              <Text
                style={{ color: theme.textSecondary }}
                className='text-xs capitalize'
              >
                {key}
              </Text>
            </View>
          ))}
        </View>

        {/* Goals */}
        <View className='mx-6 mb-6'>
          <Text
            style={{ color: theme.text }}
            className='text-base font-medium mb-3'
          >
            Fitness Goals
          </Text>
          <View className='flex-row flex-wrap gap-2'>
            {dummyProfile.goals.map(goal => (
              <View
                key={goal}
                className='px-3 py-1 rounded-full'
                style={{ backgroundColor: theme.surfaceHighlight }}
              >
                <Text
                  style={{ color: theme.primary }}
                  className='text-sm'
                >
                  {goal}
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
      </ScrollView>
    </SafeAreaView>
  );
}
