import {
  View,
  Text,
  SafeAreaView,
  useColorScheme,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { COLORS } from '@/constants/theme';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const dummyData = {
  membershipDetails: {
    type: 'Premium',
    amount: '₹2,999',
    validTill: '30 April 2024',
    nextPayment: '1 April 2024',
  },
  paymentHistory: [
    {
      id: 1,
      date: '1 March 2024',
      amount: '₹2,999',
      type: 'Monthly Membership',
      status: 'Paid',
    },
    {
      id: 2,
      date: '1 February 2024',
      amount: '₹2,999',
      type: 'Monthly Membership',
      status: 'Paid',
    },
    {
      id: 3,
      date: '15 January 2024',
      amount: '₹1,500',
      type: 'Personal Training',
      status: 'Paid',
    },
  ],
};

export default function PaymentsScreen() {
  const colorScheme = useColorScheme();
  const theme = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

      {/* Header */}
      <View className='p-6'>
        <Text
          style={{ color: theme.text }}
          className='text-2xl font-bold mb-2'
        >
          Payments
        </Text>
      </View>

      <ScrollView className='flex-1'>
        {/* Current Membership Card */}
        <View
          className='mx-6 mb-6 p-4 rounded-xl'
          style={{ backgroundColor: theme.surface }}
        >
          <Text
            style={{ color: theme.text }}
            className='text-lg font-medium mb-4'
          >
            Current Membership
          </Text>

          <View className='flex-row justify-between items-center mb-4'>
            <View>
              <Text
                style={{ color: theme.textSecondary }}
                className='text-sm mb-1'
              >
                {dummyData.membershipDetails.type}
              </Text>
              <Text
                style={{ color: theme.text }}
                className='text-2xl font-bold'
              >
                {dummyData.membershipDetails.amount}
              </Text>
            </View>
            <TouchableOpacity
              className='px-4 py-2 rounded-lg'
              style={{ backgroundColor: theme.primary }}
            >
              <Text className='text-black font-medium'>Pay Now</Text>
            </TouchableOpacity>
          </View>

          <View
            className='flex-row justify-between items-center pt-3 border-t'
            style={{ borderColor: theme.border }}
          >
            <Text
              style={{ color: theme.textSecondary }}
              className='text-sm'
            >
              Valid till: {dummyData.membershipDetails.validTill}
            </Text>
            <Text
              style={{ color: theme.textSecondary }}
              className='text-sm'
            >
              Next payment: {dummyData.membershipDetails.nextPayment}
            </Text>
          </View>
        </View>

        {/* Payment History */}
        <View className='mx-6'>
          <Text
            style={{ color: theme.text }}
            className='text-lg font-medium mb-4'
          >
            Payment History
          </Text>

          {dummyData.paymentHistory.map(payment => (
            <View
              key={payment.id}
              className='mb-4 p-4 rounded-xl'
              style={{ backgroundColor: theme.surface }}
            >
              <View className='flex-row justify-between items-start mb-2'>
                <View>
                  <Text
                    style={{ color: theme.text }}
                    className='text-base font-medium mb-1'
                  >
                    {payment.type}
                  </Text>
                  <Text
                    style={{ color: theme.textSecondary }}
                    className='text-sm'
                  >
                    {payment.date}
                  </Text>
                </View>
                <Text
                  style={{ color: theme.text }}
                  className='text-base font-medium'
                >
                  {payment.amount}
                </Text>
              </View>
              <View className='flex-row items-center'>
                <View className='bg-green-500/20 px-2 py-1 rounded-full'>
                  <Text className='text-green-500 text-xs'>{payment.status}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
