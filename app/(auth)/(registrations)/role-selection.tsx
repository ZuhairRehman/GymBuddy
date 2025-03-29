import {
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
  SafeAreaView,
  Image,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { COLORS } from '@/constants/theme';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import RoleCard from '@/components/ui/RoleCard';
import { supabase } from '@/lib/supabase/supabase';

const roles = [
  {
    id: 'owner',
    title: 'Gym Owner',
    description: 'Register your gym and manage operations',
    icon: 'domain',
    benefits: ['Track revenue & memberships', 'Manage trainers & staff', 'AI-powered insights'],
  },
  {
    id: 'trainer',
    title: 'Trainer',
    description: 'Manage clients and training schedules',
    icon: 'whistle',
    benefits: ['Track client progress', 'Schedule classes', 'Create workout plans'],
  },
  {
    id: 'member',
    title: 'Member',
    description: 'Join a gym and track your fitness journey',
    icon: 'run',
    benefits: ['Book classes & trainers', 'Track workouts', 'Monitor progress'],
  },
];

export default function RoleSelectionScreen() {
  const colorScheme = useColorScheme();
  const theme = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];

  const handleRoleSelect = async (roleId: string) => {
    try {
      // Get the current session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.replace('/sign-up'); // Redirect to sign-up if no session exists
        return;
      }

      // Insert a new row into the profiles table with the selected role
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: session.user.id, // User ID from Supabase Auth
        full_name: 'New User', // Provide a default value
        role: roleId as 'owner' | 'trainer' | 'member', // Selected role
      });

      if (profileError) {
        console.error('Error creating profile:', profileError);
        alert('Failed to create profile. Please try again.');
        return;
      }

      // Navigate to the role-specific registration flow
      router.push(`/(registrations)/register-${roleId}`);
    } catch (error) {
      console.error('Role selection error:', error);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <SafeAreaView
      className='flex-1'
      style={{ backgroundColor: theme.background }}
    >
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

      {/* Header with Logo */}
      <View className='items-center pt-4 mt-10'>
        <View className='w-48 h-48 items-center justify-center mb-2'>
          <Image
            source={require('@/assets/images/MainLogo.png')}
            style={{
              width: '100%',
              height: '100%',
            }}
            resizeMode='contain'
          />
        </View>
        <Text
          style={{ color: theme.text }}
          className='text-xl font-bold my-3'
        >
          Choose Your Role
        </Text>
        <Text
          style={{ color: theme.textSecondary }}
          className='text-md mb-10 text-center px-6'
        >
          Select how you want to use GymBuddy
        </Text>
      </View>

      {/* Role Selection */}
      <ScrollView
        className='flex-1 px-4'
        showsVerticalScrollIndicator={false}
      >
        {roles.map(role => (
          <RoleCard
            key={role.id}
            role={role}
            onPress={() => handleRoleSelect(role.id)}
          />
        ))}
      </ScrollView>

      {/* Back to Login */}
      <View className='p-4'>
        <TouchableOpacity
          className='flex-row justify-center items-center'
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons
            name='arrow-left'
            size={18}
            color={theme.textSecondary}
            style={{ marginRight: 6 }}
          />
          <Text
            style={{ color: theme.textSecondary }}
            className='text-sm'
          >
            Back to Login
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
