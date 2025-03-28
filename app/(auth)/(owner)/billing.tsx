import React from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { useColorScheme } from 'react-native';
import { COLORS } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Screen from '@/components/ui/Screen';

const transactions = [
  {
    id: '1',
    memberName: 'Rahul Sharma',
    amount: 2000,
    date: '2024-02-15',
    status: 'paid',
    type: 'membership',
  },
  {
    id: '2',
    memberName: 'Priya Patel',
    amount: 3500,
    date: '2024-02-14',
    status: 'pending',
    type: 'personal_training',
  },
  // Add more transactions as needed
];

const tabs = ['All', 'Paid', 'Pending', 'Failed'];

export default function BillingScreen() {
  const colorScheme = useColorScheme();
  const theme = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];
  const [activeTab, setActiveTab] = React.useState('All');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return '#22c55e';
      case 'pending':
        return '#eab308';
      case 'failed':
        return '#ef4444';
      default:
        return theme.textSecondary;
    }
  };

  return (
    <Screen>
      {/* Header */}
      <Text
        style={{ color: theme.text }}
        className='text-2xl font-bold'
      >
        Billing
      </Text>
      <Text
        style={{ color: theme.textSecondary }}
        className='text-base mt-1 mb-6'
      >
        Manage payments and transactions
      </Text>

      {/* Summary Cards */}
      <View className='flex-row -mx-2 mb-6'>
        {[
          {
            title: 'Total Revenue',
            value: '₹52,000',
            icon: 'cash-multiple',
          },
          {
            title: 'Pending',
            value: '₹8,500',
            icon: 'clock-outline',
          },
        ].map((item, index) => (
          <View
            key={index}
            className='flex-1 mx-2'
          >
            <View
              className='p-4 rounded-xl'
              style={{ backgroundColor: theme.surface }}
            >
              <MaterialCommunityIcons
                name={item.icon}
                size={24}
                color={theme.primary}
                style={{ marginBottom: 8 }}
              />
              <Text
                style={{ color: theme.text }}
                className='text-lg font-bold'
              >
                {item.value}
              </Text>
              <Text
                style={{ color: theme.textSecondary }}
                className='text-sm'
              >
                {item.title}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Search and Filter */}
      <View className='flex-row items-center mb-6'>
        <View
          className='flex-1 flex-row items-center p-4 rounded-xl'
          style={{ backgroundColor: theme.surface }}
        >
          <MaterialCommunityIcons
            name='magnify'
            size={20}
            color={theme.textSecondary}
          />
          <TextInput
            placeholder='Search transactions...'
            placeholderTextColor={theme.textSecondary}
            className='flex-1 ml-2'
            style={{ color: theme.text }}
          />
        </View>
        <TouchableOpacity
          className='ml-4 p-4 rounded-xl'
          style={{ backgroundColor: theme.primary }}
          onPress={() => router.push('/(owner)/billing/new')}
        >
          <MaterialCommunityIcons
            name='plus'
            size={20}
            color='#000000'
          />
        </TouchableOpacity>
      </View>

      {/* Status Tabs */}
      <View className='flex-row mb-6'>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            className={`mr-4 px-4 py-2 rounded-full ${activeTab === tab ? 'bg-yellow-400' : ''}`}
            style={activeTab !== tab ? { backgroundColor: theme.surface } : {}}
          >
            <Text
              style={{
                color: activeTab === tab ? '#000000' : theme.textSecondary,
              }}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Transactions List */}
      <View className='space-y-4'>
        {transactions.map(transaction => (
          <TouchableOpacity
            key={transaction.id}
            className='p-4 rounded-xl'
            style={{ backgroundColor: theme.surface }}
            onPress={() => router.push(`/(owner)/billing/${transaction.id}`)}
          >
            <View className='flex-row justify-between items-start mb-2'>
              <View>
                <Text
                  style={{ color: theme.text }}
                  className='text-base font-medium'
                >
                  {transaction.memberName}
                </Text>
                <Text
                  style={{ color: theme.textSecondary }}
                  className='text-sm'
                >
                  {new Date(transaction.date).toLocaleDateString()}
                </Text>
              </View>
              <Text
                style={{ color: theme.text }}
                className='text-base font-medium'
              >
                ₹{transaction.amount}
              </Text>
            </View>
            <View className='flex-row justify-between items-center'>
              <Text
                style={{ color: theme.textSecondary }}
                className='text-sm capitalize'
              >
                {transaction.type.replace('_', ' ')}
              </Text>
              <Text
                style={{ color: getStatusColor(transaction.status) }}
                className='text-sm capitalize'
              >
                {transaction.status}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </Screen>
  );
}
