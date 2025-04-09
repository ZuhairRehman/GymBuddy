import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    useColorScheme,
    SafeAreaView,
    ScrollView,
} from 'react-native';
import { COLORS } from '@/constants/theme';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import RegistrationInput, { InputField } from '@/components/ui/RegistrationInput';
import UiButton from '@/components/ui/UiButton';

const planDurations = ['1 Month', '3 Months', '6 Months', '12 Months'];

export default function GymPricingScreen() {
    const colorScheme = useColorScheme();
    const theme = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];
    const [selectedDuration, setSelectedDuration] = React.useState('1 Month');

    const handleNext = () => {
        router.push('/(auth)/register-owner/gym-capacity');
    };

    return (
        <SafeAreaView
            className='flex-1'
            style={{ backgroundColor: theme.background }}
        >
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
                        style={{ marginRight: 8 }}
                    />
                    <Text
                        style={{ color: theme.text }}
                        className='text-lg font-medium'
                    >
                        Membership Plans
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView className='flex-1 px-6'>
                {/* Plan Duration Selection */}
                <View className='mb-8'>
                    <Text
                        style={{ color: theme.text }}
                        className='text-lg font-bold mb-4'
                    >
                        Plan Duration
                    </Text>
                    <View className='flex-row flex-wrap gap-2'>
                        {planDurations.map(duration => (
                            <TouchableOpacity
                                key={duration}
                                onPress={() => setSelectedDuration(duration)}
                                className={`flex-1 min-w-[45%] p-4 rounded-xl border ${
                                    selectedDuration === duration
                                        ? 'bg-yellow-400'
                                        : 'bg-transparent'
                                }`}
                                style={{
                                    borderColor: theme.primary,
                                }}
                            >
                                <Text
                                    style={{
                                        color: selectedDuration === duration ? '#000' : theme.text,
                                        textAlign: 'center',
                                    }}
                                    className='text-base font-medium'
                                >
                                    {duration}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Plan Details */}
                <RegistrationInput title='Plan Details'>
                    <InputField
                        label='Base Price'
                        placeholder='e.g. ₹2000'
                        keyboardType='numeric'
                        required
                    />
                    <InputField
                        label='Joining Fee'
                        placeholder='e.g. ₹1000'
                        keyboardType='numeric'
                        required
                    />
                    <InputField
                        label='Max Members per Batch'
                        placeholder='e.g. 30'
                        keyboardType='numeric'
                        required
                    />
                    <InputField
                        label='Additional Notes'
                        placeholder='Any additional details about the plan'
                        multiline
                        numberOfLines={3}
                    />
                </RegistrationInput>

                {/* Special Offers */}
                <RegistrationInput title='Special Offers (Optional)'>
                    <InputField
                        label='Student Discount (%)'
                        placeholder='e.g. 10'
                        keyboardType='numeric'
                    />
                    <InputField
                        label='Corporate Discount (%)'
                        placeholder='e.g. 15'
                        keyboardType='numeric'
                    />
                </RegistrationInput>
            </ScrollView>

            {/* Next Button */}
            <View className='p-6'>
                <UiButton
                    children='Next'
                    size='lg'
                    onPress={handleNext}
                />
            </View>
        </SafeAreaView>
    );
}
