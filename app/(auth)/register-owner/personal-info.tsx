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

export default function PersonalInfoScreen() {
    const colorScheme = useColorScheme();
    const theme = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];

    const handleNext = () => {
        router.push('/(auth)/register-owner/gym-details');
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
                            Personal Information
                        </Text>
                    </TouchableOpacity>
                </View>

                <ScrollView className='flex-1 px-6'>
                    <RegistrationInput title='Basic Information'>
                        <InputField
                            label='Full Name'
                            placeholder='e.g. Rajesh Kumar'
                            required
                        />
                        <InputField
                            label='Phone Number'
                            placeholder='e.g. 9876543210'
                            keyboardType='phone-pad'
                            required
                        />
                        <InputField
                            label='Email'
                            placeholder='e.g. rajesh@gmail.com'
                            keyboardType='email-address'
                            required
                        />
                    </RegistrationInput>

                    <RegistrationInput title='Set Password'>
                        <InputField
                            label='Password'
                            placeholder='Enter password'
                            secureTextEntry
                            required
                        />
                        <InputField
                            label='Confirm Password'
                            placeholder='Confirm password'
                            secureTextEntry
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
