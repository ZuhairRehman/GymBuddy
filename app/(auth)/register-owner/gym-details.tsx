import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    useColorScheme,
    SafeAreaView,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { COLORS } from '@/constants/theme';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import RegistrationInput, { InputField } from '@/components/ui/RegistrationInput';
import UiButton from '@/components/ui/UiButton';

export default function GymDetailsScreen() {
    const colorScheme = useColorScheme();
    const theme = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];

    const handleNext = () => {
        router.push('/(auth)/register-owner/gym-facilities');
    };

    return (
        <SafeAreaView
            className='flex-1'
            style={{ backgroundColor: theme.background }}
        >
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className='flex-1'
            >
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
                            Gym Details
                        </Text>
                    </TouchableOpacity>
                </View>

                <ScrollView className='flex-1 px-6'>
                    {/* Basic Gym Information */}
                    <RegistrationInput title='Basic Information'>
                        <InputField
                            label='Gym Name'
                            placeholder='e.g. Fitness Hub India'
                            required
                        />
                        <InputField
                            label='Description'
                            placeholder='Brief description of your gym'
                            multiline
                            numberOfLines={3}
                        />
                    </RegistrationInput>

                    {/* Contact Information */}
                    <RegistrationInput title='Contact Information'>
                        <InputField
                            label='Business Email'
                            placeholder='e.g. contact@fitnesshub.com'
                            keyboardType='email-address'
                            required
                        />
                        <InputField
                            label='Business Phone'
                            placeholder='e.g. 9876543210'
                            keyboardType='phone-pad'
                            required
                        />
                    </RegistrationInput>

                    {/* Address Information */}
                    <RegistrationInput title='Location'>
                        <InputField
                            label='Address Line 1'
                            placeholder='Building name, Street'
                            required
                        />
                        <InputField
                            label='Address Line 2'
                            placeholder='Area, Landmark'
                        />
                        <InputField
                            label='City'
                            placeholder='e.g. Mumbai'
                            required
                        />
                        <InputField
                            label='State'
                            placeholder='e.g. Maharashtra'
                            required
                        />
                        <InputField
                            label='PIN Code'
                            placeholder='e.g. 400001'
                            keyboardType='numeric'
                            required
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
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
