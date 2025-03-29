import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { COLORS } from '@/constants/theme';

export default function MemberLayout() {
  const colorScheme = useColorScheme();
  const theme = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: theme.border,
          height: 60,
          paddingBottom: 8,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name='dashboard'
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name='view-dashboard'
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='workouts'
        options={{
          title: 'Workouts',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name='dumbbell'
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='classes'
        options={{
          title: 'Classes',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name='calendar-clock'
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='payments'
        options={{
          title: 'Payments',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name='wallet'
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name='account'
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
