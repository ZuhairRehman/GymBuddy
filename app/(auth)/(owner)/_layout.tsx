/**
 * Owner Dashboard Layout
 * Configures bottom tab navigation for the gym owner section
 * Includes: Dashboard, Members, Analytics, Billing, and Profile tabs
 */

import { Stack, Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import { StatusBar } from 'expo-status-bar';
import TabBar from '@/components/ui/TabBar';

/**
 * OwnerLayout Component
 * @component
 * Features:
 * - Custom tab bar implementation
 * - Protected route handling
 * - Theme-aware navigation
 */
export default function OwnerLayout() {
  const colorScheme = useColorScheme();
  const theme = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];

  return (
    <>
      <StatusBar
        style={colorScheme === 'dark' ? 'light' : 'dark'}
        backgroundColor={theme.background}
      />

      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
        }}
        tabBar={props => <TabBar {...props} />}
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
          name='manage'
          options={{
            title: 'Members',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name='account-group'
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name='analytics'
          options={{
            title: 'Analytics',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name='chart-box'
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name='billing'
          options={{
            title: 'Billing',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name='currency-inr'
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
    </>
  );
}
