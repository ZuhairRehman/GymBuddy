import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
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

// Dummy data for fitness goals
const fitnessGoals = [
  'Weight Loss',
  'Muscle Gain',
  'Strength Training',
  'General Fitness',
  'Flexibility',
  'Endurance',
];

export default function RegisterMemberScreen() {
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
              className='text-lg font-medium'
            >
              Register as Member
            </Text>
          </TouchableOpacity>
        </View>

        <View className='flex-1 px-6'>
          {/* Personal Information */}
          <RegistrationInput title='Personal Information'>
            <InputField
              label='Full Name'
              placeholder='e.g. Priya Patel'
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
              placeholder='e.g. priya@gmail.com'
              keyboardType='email-address'
              required
            />
          </RegistrationInput>

          {/* Fitness Profile */}
          <RegistrationInput title='Fitness Profile'>
            <InputField
              label='Age'
              placeholder='e.g. 25'
              keyboardType='number-pad'
            />
            <InputField
              label='Height (cm)'
              placeholder='e.g. 165'
              keyboardType='number-pad'
            />
            <InputField
              label='Weight (kg)'
              placeholder='e.g. 60'
              keyboardType='number-pad'
            />
          </RegistrationInput>

          {/* Password */}
          <RegistrationInput title='Set Password'>
            <InputField
              label='Password'
              placeholder='Enter password'
              secureTextEntry
            />
            <InputField
              label='Confirm Password'
              placeholder='Confirm password'
              secureTextEntry
            />
          </RegistrationInput>
        </View>

        {/* Register Button */}
        <View className='p-6'>
          <UiButton
            children='Create Account'
            size='lg'
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
