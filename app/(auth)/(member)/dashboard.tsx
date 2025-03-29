import { View, Text, ScrollView, SafeAreaView, useColorScheme } from 'react-native';
import { COLORS } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

const dummyData = {
  memberName: 'Rahul Sharma',
  membershipType: 'Premium',
  expiryDate: '30 April 2024',
  todayTraffic: '42% Capacity',
  upcomingClass: {
    name: 'Yoga with Priya',
    time: '6:00 PM Today',
  },
  lastWorkout: {
    name: 'Upper Body Strength',
    date: 'Yesterday',
    duration: '45 mins',
  },
};

export default function MemberDashboard() {
  const colorScheme = useColorScheme();
  const theme = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

      <ScrollView className='flex-1'>
        {/* Header Section */}
        <View className='p-6'>
          <Text
            style={{ color: theme.text }}
            className='text-2xl font-bold mb-2'
          >
            Welcome back,
          </Text>
          <Text
            style={{ color: theme.primary }}
            className='text-lg font-medium'
          >
            {dummyData.memberName}
          </Text>
        </View>

        {/* Membership Status Card */}
        <View
          className='mx-6 p-4 rounded-xl mb-4'
          style={{ backgroundColor: theme.surface }}
        >
          <View className='flex-row justify-between items-center mb-3'>
            <Text
              style={{ color: theme.text }}
              className='text-base font-medium'
            >
              Membership Status
            </Text>
            <View className='bg-green-500/20 px-3 py-1 rounded-full'>
              <Text className='text-green-500 text-sm'>Active</Text>
            </View>
          </View>
          <View className='flex-row justify-between items-center'>
            <Text
              style={{ color: theme.textSecondary }}
              className='text-sm'
            >
              {dummyData.membershipType}
            </Text>
            <Text
              style={{ color: theme.textSecondary }}
              className='text-sm'
            >
              Expires: {dummyData.expiryDate}
            </Text>
          </View>
        </View>

        {/* Gym Traffic Card */}
        <View
          className='mx-6 p-4 rounded-xl mb-4'
          style={{ backgroundColor: theme.surface }}
        >
          <View className='flex-row items-center justify-between'>
            <View>
              <Text
                style={{ color: theme.text }}
                className='text-base font-medium mb-1'
              >
                Current Gym Traffic
              </Text>
              <Text
                style={{ color: theme.textSecondary }}
                className='text-sm'
              >
                {dummyData.todayTraffic}
              </Text>
            </View>
            <MaterialCommunityIcons
              name='account-group'
              size={24}
              color={theme.primary}
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View className='mx-6 mb-4'>
          <Text
            style={{ color: theme.text }}
            className='text-lg font-medium mb-3'
          >
            Quick Actions
          </Text>
          <View className='flex-row justify-between'>
            {[
              { icon: 'qrcode-scan', label: 'Scan QR' },
              { icon: 'calendar-plus', label: 'Book Class' },
              { icon: 'dumbbell', label: 'Log Workout' },
              { icon: 'wallet', label: 'Pay Now' },
            ].map((action, index) => (
              <View
                key={index}
                className='items-center p-4 rounded-xl'
                style={{ backgroundColor: theme.surface }}
              >
                <MaterialCommunityIcons
                  name={action.icon}
                  size={24}
                  color={theme.primary}
                />
                <Text
                  style={{ color: theme.textSecondary }}
                  className='text-xs mt-2'
                >
                  {action.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Upcoming Class */}
        <View
          className='mx-6 p-4 rounded-xl mb-4'
          style={{ backgroundColor: theme.surface }}
        >
          <Text
            style={{ color: theme.text }}
            className='text-base font-medium mb-3'
          >
            Next Class
          </Text>
          <View className='flex-row items-center justify-between'>
            <View>
              <Text
                style={{ color: theme.text }}
                className='text-sm font-medium'
              >
                {dummyData.upcomingClass.name}
              </Text>
              <Text
                style={{ color: theme.textSecondary }}
                className='text-xs mt-1'
              >
                {dummyData.upcomingClass.time}
              </Text>
            </View>
            <MaterialCommunityIcons
              name='chevron-right'
              size={24}
              color={theme.textSecondary}
            />
          </View>
        </View>

        {/* Last Workout */}
        <View
          className='mx-6 p-4 rounded-xl mb-6'
          style={{ backgroundColor: theme.surface }}
        >
          <Text
            style={{ color: theme.text }}
            className='text-base font-medium mb-3'
          >
            Last Workout
          </Text>
          <View className='flex-row items-center justify-between'>
            <View>
              <Text
                style={{ color: theme.text }}
                className='text-sm font-medium'
              >
                {dummyData.lastWorkout.name}
              </Text>
              <Text
                style={{ color: theme.textSecondary }}
                className='text-xs mt-1'
              >
                {dummyData.lastWorkout.date} • {dummyData.lastWorkout.duration}
              </Text>
            </View>
            <MaterialCommunityIcons
              name='chevron-right'
              size={24}
              color={theme.textSecondary}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
