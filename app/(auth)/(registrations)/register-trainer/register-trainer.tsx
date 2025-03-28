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
import UiButton from '@/components/ui/UiButton';
import RegistrationInput, { InputField } from '@/components/ui/RegistrationInput';

// Dummy data for specializations
const specializations = [
  'Weight Training',
  'Yoga',
  'CrossFit',
  'HIIT',
  'Calisthenics',
  'Zumba',
  'Boxing',
  'Pilates',
];

export default function RegisterTrainerScreen() {
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
              Register as Trainer
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView className='flex-1 px-6'>
          {/* Personal Information */}
          <RegistrationInput title='Personal Information'>
            <InputField
              label='Full Name'
              placeholder='e.g. Amit Sharma'
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
              placeholder='e.g. amit@gmail.com'
              keyboardType='email-address'
              required
            />
          </RegistrationInput>

          {/* Professional Information */}
          <RegistrationInput title='Professional Information'>
            <InputField
              label='Years of Experience'
              placeholder='Put 0 if no experience'
              keyboardType='number-pad'
              required
            />
            <InputField
              label='Certifications'
              placeholder='e.g. ACE, NSCA, ISSA'
            />
            <InputField
              label='Specializations'
              placeholder='e.g. Weight Training, Yoga'
            />
          </RegistrationInput>

          {/* Password */}
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
