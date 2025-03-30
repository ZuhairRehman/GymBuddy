import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import { StatusBar } from 'expo-status-bar';
import TabBar from '@/components/ui/TabBar';

export default function TrainerLayout() {
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
          name='clients'
          options={{
            title: 'Clients',
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
          name='schedule'
          options={{
            title: 'Schedule',
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
