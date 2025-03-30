import { View, Text, useColorScheme, TouchableOpacity, Image, TextInput } from 'react-native';
import { COLORS } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Screen from '@/components/ui/Screen';

const dummyClients = [
  {
    id: '1',
    name: 'Rahul Verma',
    plan: 'Strength Training',
    progress: 'On Track',
    nextSession: 'Tomorrow, 10:00 AM',
    image: null,
  },
  // Add more clients...
];

export default function TrainerClients() {
  const colorScheme = useColorScheme();
  const theme = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];

  return (
    <Screen scrollable>
      <View className='px-6'>
        <Text
          style={{ color: theme.text }}
          className='text-2xl font-bold mb-6'
        >
          My Clients
        </Text>

        {/* Search Bar */}
        <View
          className='flex-row items-center p-4 rounded-xl mb-6'
          style={{ backgroundColor: theme.surface }}
        >
          <MaterialCommunityIcons
            name='magnify'
            size={24}
            color={theme.textSecondary}
          />
          <TextInput
            placeholder='Search clients...'
            placeholderTextColor={theme.textSecondary}
            className='flex-1 ml-2'
            style={{ color: theme.text }}
          />
        </View>

        {/* Clients List */}
        <View className='space-y-4'>
          {dummyClients.map(client => (
            <TouchableOpacity
              key={client.id}
              className='p-4 rounded-xl'
              style={{ backgroundColor: theme.surface }}
            >
              <View className='flex-row items-center'>
                <Image
                  source={client.image || require('@/assets/images/member_avatar.png')}
                  className='w-12 h-12 rounded-full'
                />
                <View className='flex-1 ml-3'>
                  <Text
                    style={{ color: theme.text }}
                    className='text-lg font-medium'
                  >
                    {client.name}
                  </Text>
                  <Text
                    style={{ color: theme.textSecondary }}
                    className='text-sm'
                  >
                    {client.plan}
                  </Text>
                </View>
                <MaterialCommunityIcons
                  name='chevron-right'
                  size={24}
                  color={theme.textSecondary}
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Screen>
  );
}
