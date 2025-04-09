import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { COLORS } from '@/constants/theme';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import RegistrationInput, { InputField } from '@/components/ui/RegistrationInput';
import UiButton from '@/components/ui/UiButton';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '@/lib/supabase/supabase';

interface PlanType {
  id: string;
  name: string;
  duration: string;
  basePrice: string;
  joiningFee: string;
}

interface DiscountType {
  id: string;
  name: string;
  percentage: string;
}

const PlanPreviewCard = ({ plan, discounts }: { plan: PlanType; discounts: DiscountType[] }) => {
  const theme = COLORS[useColorScheme() === 'dark' ? 'dark' : 'light'];
  const basePrice = parseInt(plan.basePrice);
  const joiningFee = parseInt(plan.joiningFee) || 0;

  return (
    <Animated.View
      entering={FadeInDown}
      className='bg-white dark:bg-gray-800 rounded-2xl p-4 mb-4 shadow-sm'
    >
      <LinearGradient
        colors={[theme.primary + '20', 'transparent']}
        className='absolute top-0 left-0 right-0 h-24 rounded-t-2xl'
      />

      <View className='mb-4'>
        <Text
          className='text-xl font-bold mb-1'
          style={{ color: theme.text }}
        >
          {plan.name}
        </Text>
        <Text
          className='text-sm'
          style={{ color: theme.textSecondary }}
        >
          {plan.duration}
        </Text>
      </View>

      <View className='flex-row items-baseline mb-4'>
        <Text
          className='text-3xl font-bold'
          style={{ color: theme.primary }}
        >
          ₹{basePrice}
        </Text>
        <Text
          className='text-sm ml-1'
          style={{ color: theme.textSecondary }}
        >
          /month
        </Text>
      </View>

      {joiningFee > 0 && (
        <View className='flex-row items-center mb-4'>
          <MaterialCommunityIcons
            name='information'
            size={16}
            color={theme.textSecondary}
          />
          <Text
            className='text-sm ml-2'
            style={{ color: theme.textSecondary }}
          >
            One-time joining fee: ₹{joiningFee}
          </Text>
        </View>
      )}

      {discounts.length > 0 && (
        <View className='border-t border-gray-200 dark:border-gray-700 pt-4 mt-4'>
          <Text
            className='text-sm font-medium mb-2'
            style={{ color: theme.text }}
          >
            Available Discounts
          </Text>
          {discounts.map(discount => (
            <View
              key={discount.id}
              className='flex-row items-center mb-2'
            >
              <MaterialCommunityIcons
                name='tag-outline'
                size={16}
                color={theme.primary}
              />
              <Text
                className='text-sm ml-2'
                style={{ color: theme.textSecondary }}
              >
                {discount.name}: {discount.percentage}% off
              </Text>
            </View>
          ))}
        </View>
      )}
    </Animated.View>
  );
};

export default function GymPricingScreen() {
  const colorScheme = useColorScheme();
  const theme = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];

  const [plans, setPlans] = useState<PlanType[]>([]);
  const [discounts, setDiscounts] = useState<DiscountType[]>([]);
  const [currentPlan, setCurrentPlan] = useState<PlanType>({
    id: Date.now().toString(),
    name: '',
    duration: '1 Month',
    basePrice: '',
    joiningFee: '',
  });

  const [newDiscountName, setNewDiscountName] = useState('');
  const [newDiscountPercentage, setNewDiscountPercentage] = useState('');

  const planDurations = ['1 Month', '3 Months', '6 Months', '12 Months'];

  const handleAddPlan = async () => {
    if (!currentPlan.name || !currentPlan.basePrice) {
      Alert.alert('Missing Details', 'Please fill in plan name and base price');
      return;
    }

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      // Get gym ID (you'll need to store this after gym creation)
      const { data: gymData } = await supabase
        .from('gyms')
        .select('id')
        .eq('owner_id', session.user.id)
        .single();

      if (!gymData?.id) {
        Alert.alert('Error', 'Please create your gym first');
        return;
      }

      // Insert plan
      const { error: planError } = await supabase.rpc('insert_membership_plan', {
        _gym_id: gymData.id,
        _name: currentPlan.name,
        _duration_months: parseInt(currentPlan.duration),
        _base_price: parseFloat(currentPlan.basePrice),
        _joining_fee: currentPlan.joiningFee ? parseFloat(currentPlan.joiningFee) : 0,
      });

      if (planError) {
        console.error('Error creating plan:', planError);
        Alert.alert('Error', 'Failed to create plan');
        return;
      }

      // Add plan to local state
      setPlans([...plans, currentPlan]);

      // Reset form
      setCurrentPlan({
        id: Date.now().toString(),
        name: '',
        duration: '1 Month',
        basePrice: '',
        joiningFee: '',
      });
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  const handleAddDiscount = async () => {
    if (!newDiscountName || !newDiscountPercentage) {
      Alert.alert('Missing Details', 'Please fill in discount name and percentage');
      return;
    }

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      // Get gym ID
      const { data: gymData } = await supabase
        .from('gyms')
        .select('id')
        .eq('owner_id', session.user.id)
        .single();

      if (!gymData?.id) {
        Alert.alert('Error', 'Please create your gym first');
        return;
      }

      // Insert discount
      const { error: discountError } = await supabase.rpc('insert_discount', {
        _gym_id: gymData.id,
        _name: newDiscountName,
        _percentage: parseFloat(newDiscountPercentage),
      });

      if (discountError) {
        console.error('Error creating discount:', discountError);
        Alert.alert('Error', 'Failed to create discount');
        return;
      }

      // Add discount to local state
      setDiscounts([
        ...discounts,
        {
          id: Date.now().toString(),
          name: newDiscountName,
          percentage: newDiscountPercentage,
        },
      ]);

      // Reset form
      setNewDiscountName('');
      setNewDiscountPercentage('');
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  const handleDeletePlan = (id: string) => {
    setPlans(plans.filter(plan => plan.id !== id));
  };

  const handleDeleteDiscount = (id: string) => {
    setDiscounts(discounts.filter(discount => discount.id !== id));
  };

  const handleNext = () => {
    if (plans.length === 0) {
      Alert.alert('No Plans', 'Please add at least one membership plan');
      return;
    }
    router.push('/(auth)/(registrations)/(register-owner)/gym-capacity');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

      {/* Header */}
      <View className='p-6 mt-5'>
        <TouchableOpacity
          className='flex-row items-center'
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons
            name='arrow-left'
            size={24}
            color={theme.text}
          />
          <Text
            className='text-lg font-medium ml-2'
            style={{ color: theme.text }}
          >
            Membership Plans
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView className='flex-1 px-6'>
        {/* Add New Plan Section */}
        <RegistrationInput title='Add New Plan'>
          <InputField
            label='Plan Name'
            placeholder='e.g. Basic, Premium, Pro'
            value={currentPlan.name}
            onChangeText={text => setCurrentPlan({ ...currentPlan, name: text })}
          />

          {/* Duration Selection */}
          <View className='mb-4'>
            <Text
              className='text-base font-medium mb-2'
              style={{ color: theme.text }}
            >
              Duration
            </Text>
            <View className='flex-row flex-wrap gap-2'>
              {planDurations.map(duration => (
                <TouchableOpacity
                  key={duration}
                  onPress={() => setCurrentPlan({ ...currentPlan, duration })}
                  className={`px-4 py-2 rounded-xl border ${
                    currentPlan.duration === duration ? 'bg-yellow-400' : 'bg-transparent'
                  }`}
                  style={{ borderColor: theme.primary }}
                >
                  <Text
                    style={{
                      color: currentPlan.duration === duration ? '#000' : theme.text,
                    }}
                  >
                    {duration}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <InputField
            label='Base Price (₹)'
            placeholder='2000'
            keyboardType='numeric'
            value={currentPlan.basePrice}
            onChangeText={text => setCurrentPlan({ ...currentPlan, basePrice: text })}
          />

          <InputField
            label='Joining Fee (₹)'
            placeholder='1000'
            keyboardType='numeric'
            value={currentPlan.joiningFee}
            onChangeText={text => setCurrentPlan({ ...currentPlan, joiningFee: text })}
          />

          <UiButton
            onPress={handleAddPlan}
            size='sm'
            variant='outline'
            className='mt-2'
          >
            Add Plan
          </UiButton>
        </RegistrationInput>

        {/* Added Plans List */}
        {plans.length > 0 && (
          <View className='mb-6'>
            <Text
              className='text-lg font-bold mb-4'
              style={{ color: theme.text }}
            >
              Added Plans
            </Text>
            {plans.map((plan, index) => (
              <Animated.View
                key={plan.id}
                entering={FadeInDown.delay(index * 100)}
                className='bg-gray-100 dark:bg-gray-800 p-4 rounded-xl mb-2'
              >
                <View className='flex-row justify-between items-center'>
                  <View>
                    <Text
                      className='font-medium'
                      style={{ color: theme.text }}
                    >
                      {plan.name}
                    </Text>
                    <Text
                      className='text-sm'
                      style={{ color: theme.textSecondary }}
                    >
                      {plan.duration} • ₹{plan.basePrice}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDeletePlan(plan.id)}
                    className='p-2'
                  >
                    <MaterialCommunityIcons
                      name='delete-outline'
                      size={20}
                      color={theme.danger}
                    />
                  </TouchableOpacity>
                </View>
              </Animated.View>
            ))}
          </View>
        )}

        {/* Preview Section */}
        {plans.length > 0 && (
          <View className='mb-6'>
            <View className='flex-row justify-between items-center mb-4'>
              <Text
                className='text-lg font-bold'
                style={{ color: theme.text }}
              >
                Preview
              </Text>
              <TouchableOpacity
                className='flex-row items-center'
                onPress={() => {
                  /* Handle edit all plans */
                }}
              >
                <MaterialCommunityIcons
                  name='pencil'
                  size={16}
                  color={theme.primary}
                />
                <Text
                  className='ml-1 text-sm'
                  style={{ color: theme.primary }}
                >
                  Edit All
                </Text>
              </TouchableOpacity>
            </View>

            {plans.map(plan => (
              <PlanPreviewCard
                key={plan.id}
                plan={plan}
                discounts={discounts}
              />
            ))}
          </View>
        )}

        {/* Special Discounts Section */}
        <RegistrationInput title='Special Discounts (Optional)'>
          <InputField
            label='Discount Name'
            placeholder='e.g. Student, Senior Citizen'
            value={newDiscountName}
            onChangeText={setNewDiscountName}
          />
          <InputField
            label='Discount Percentage'
            placeholder='10'
            keyboardType='numeric'
            value={newDiscountPercentage}
            onChangeText={setNewDiscountPercentage}
          />
          <UiButton
            onPress={handleAddDiscount}
            size='sm'
            variant='outline'
            className='mt-2'
          >
            Add Discount
          </UiButton>
        </RegistrationInput>

        {/* Added Discounts List */}
        {discounts.length > 0 && (
          <View className='mb-6'>
            <Text
              className='text-lg font-bold mb-4'
              style={{ color: theme.text }}
            >
              Added Discounts
            </Text>
            {discounts.map((discount, index) => (
              <Animated.View
                key={discount.id}
                entering={FadeInDown.delay(index * 100)}
                className='bg-gray-100 dark:bg-gray-800 p-4 rounded-xl mb-2'
              >
                <View className='flex-row justify-between items-center'>
                  <View>
                    <Text
                      className='font-medium'
                      style={{ color: theme.text }}
                    >
                      {discount.name}
                    </Text>
                    <Text
                      className='text-sm'
                      style={{ color: theme.textSecondary }}
                    >
                      {discount.percentage}% off
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDeleteDiscount(discount.id)}
                    className='p-2'
                  >
                    <MaterialCommunityIcons
                      name='delete-outline'
                      size={20}
                      color={theme.danger}
                    />
                  </TouchableOpacity>
                </View>
              </Animated.View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Next Button */}
      <View className='p-6'>
        <UiButton
          size='lg'
          onPress={handleNext}
        >
          Next
        </UiButton>
      </View>
    </SafeAreaView>
  );
}
