import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useColorScheme } from 'react-native';
import { COLORS } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Screen from '@/components/ui/Screen';

export default function OwnerProfile() {
  const colorScheme = useColorScheme();
  const theme = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];

  const menuSections = [
    {
      title: 'Personal',
      items: [
        {
          title: 'Edit Profile',
          subtitle: 'Update your personal information',
          icon: 'account-edit',
          onPress: () => {
            /* Navigate to edit profile */
          },
        },
        { 
          title: 'Change Password',
          subtitle: 'Update your security credentials',
          icon: 'lock-reset',
          onPress: () => {
            /* Navigate to change password */
          },
        },
        {
          title: 'Notifications',
          subtitle: 'Manage your notification preferences',
          icon: 'bell-outline',
          onPress: () => {
            /* Navigate to notifications */
          },
        },
      ],
    },
    {
      title: 'Gym Management',
      items: [
        {
          title: 'Gym Details',
          subtitle: 'Update gym information and facilities',
          icon: 'domain',
          onPress: () => {
            /* Navigate to gym details */
          },
        },
        {
          title: 'Business Hours',
          subtitle: 'Manage operating hours',
          icon: 'clock-outline',
          onPress: () => {
            /* Navigate to business hours */
          },
        },
        {
          title: 'Membership Plans',
          subtitle: 'Configure membership options',
          icon: 'card-account-details-outline',
          onPress: () => {
            /* Navigate to membership plans */
          },
        },
      ],
    },
    {
      title: 'App Settings',
      items: [
        {
          title: 'App Preferences',
          subtitle: 'Customize your app experience',
          icon: 'cog-outline',
          onPress: () => {
            /* Navigate to settings */
          },
        },
        {
          title: 'Help & Support',
          subtitle: 'Get assistance and view FAQs',
          icon: 'help-circle-outline',
          onPress: () => {
            /* Navigate to help */
          },
        },
        {
          title: 'Privacy Policy',
          subtitle: 'View our privacy policy',
          icon: 'shield-account-outline',
          onPress: () => {
            /* Navigate to privacy policy */
          },
        },
      ],
    },
  ];

  return (
    <Screen scrollable>
      {/* Profile Header */}
      <View className='items-center mt-6 mb-8'>
        <View className='w-24 h-24 rounded-full bg-gray-200 mb-4 overflow-hidden'>
          <Image
            source={{ uri: 'https://via.placeholder.com/200' }}
            className='w-full h-full'
          />
        </View>
        <Text
          style={{ color: theme.text }}
          className='text-xl font-bold'
        >
          Rajesh Kumar
        </Text>
        <Text
          style={{ color: theme.textSecondary }}
          className='text-base'
        >
          Fitness Hub India
        </Text>
      </View>

      {/* Menu Sections */}
      {menuSections.map((section, sectionIndex) => (
        <View
          key={sectionIndex}
          className='mb-8'
        >
          <Text
            style={{ color: theme.text }}
            className='text-lg font-semibold mb-4'
          >
            {section.title}
          </Text>
          <View className='space-y-3'>
            {section.items.map((item, itemIndex) => (
              <TouchableOpacity
                key={itemIndex}
                onPress={item.onPress}
                className='flex-row items-center p-4 rounded-xl'
                style={{ backgroundColor: theme.surface }}
              >
                <View
                  className='w-10 h-10 rounded-full items-center justify-center mr-4'
                  style={{ backgroundColor: theme.surfaceHighlight }}
                >
                  <MaterialCommunityIcons
                    name={item.icon}
                    size={20}
                    color={theme.primary}
                  />
                </View>
                <View className='flex-1'>
                  <Text
                    style={{ color: theme.text }}
                    className='text-base font-medium'
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={{ color: theme.textSecondary }}
                    className='text-sm'
                  >
                    {item.subtitle}
                  </Text>
                </View>
                <MaterialCommunityIcons
                  name='chevron-right'
                  size={24}
                  color={theme.textSecondary}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      {/* Sign Out Button */}
      <TouchableOpacity
        className='flex-row items-center justify-center p-4 rounded-xl mb-6'
        style={{ backgroundColor: theme.primary }}
      >
        <MaterialCommunityIcons
          name='logout'
          size={20}
          color={theme.danger}
          style={{ marginRight: 8 }}
        />
        <Text
          style={{ color: theme.text }}
          className='text-base font-medium'
        >
          Sign Out
        </Text>
      </TouchableOpacity>
    </Screen>
  );
}
