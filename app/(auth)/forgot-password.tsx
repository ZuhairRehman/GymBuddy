import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
} from 'react-native';
import { COLORS } from '@/constants/theme';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import UiButton from '@/components/ui/UiButton';

export default function ForgotPasswordScreen() {
  const colorScheme = useColorScheme();
  const theme = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];

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
              className='text-lg font-medium '
            >
              Back
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View className='flex-1 px-6'>
          <Text
            style={{ color: theme.text }}
            className='text-2xl font-bold mb-6'
          >
            Forgot Password
          </Text>
          <Text
            style={{ color: theme.textSecondary }}
            className='text-base mb-8'
          >
            Enter your email address below, and we'll send you a link to reset your password.
          </Text>

          {/* Email Input */}
          <TextInput
            placeholder='Email'
            placeholderTextColor={theme.textSecondary}
            keyboardType='email-address'
            className='h-16 px-6 rounded-2xl text-base mb-6'
            style={{
              backgroundColor: theme.surface,
              color: theme.text,
            }}
          />

          {/* Submit Button */}
          <UiButton
            children='Send reset link'
            size='lg'
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
