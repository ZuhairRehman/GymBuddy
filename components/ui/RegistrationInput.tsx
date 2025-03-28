import { InputProps } from '@/types/ui-types';
import React from 'react';
import { View, Text, TextInput, useColorScheme } from 'react-native';
import { COLORS } from '../../constants/theme';

interface RegistrationInputProps {
  title?: string;
  containerStyle?: string; // Now a string
  titleStyle?: string; // Now a string
  children?: React.ReactNode; // Receive children as a prop
  label?: string; // Add the missing label property
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: string; // Added keyboardType property
  required?: boolean;
  helperText?: string;
}

interface InputProps {
  label?: string;
  placeholder?: string;
  keyboardType?: string;
  secureTextEntry?: boolean;
  required?: boolean;
  error?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  helperText?: string;
}

/**
 * Registration Form Components
 * Provides styled input fields and form sections for registration flows
 */

/**
 * InputField Component
 * @component
 * @param {InputProps} props - Input field properties
 *
 * Features:
 * - Form validation
 * - Error states
 * - Helper text
 * - Required field indication
 */
const InputField: React.FC<InputProps> = ({
  label,
  placeholder,
  keyboardType,
  secureTextEntry,
  required,
  error,
  value,
  onChangeText,
  helperText,
  ...otherProps
}) => {
  const colorScheme = useColorScheme();
  const theme = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];

  return (
    <View>
      <Text
        style={{ color: theme.textSecondary }}
        className='text-sm mb-2'
      >
        {label} {required && <Text style={{ color: 'red' }}>*</Text>}
      </Text>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={theme.textSecondary}
        className={`h-12 px-4 rounded-xl text-base ${error ? 'border border-red-500' : ''}`}
        style={{
          backgroundColor: theme.surface,
          color: theme.text,
        }}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        value={value}
        onChangeText={onChangeText}
        {...otherProps}
      />
      {helperText && !error && (
        <Text
          style={{ color: theme.textSecondary }}
          className='text-xs mt-1'
        >
          {helperText}
        </Text>
      )}
      {error && <Text className='text-red-500 text-xs mt-1'>{error}</Text>}
    </View>
  );
};

/**
 * RegistrationInput Component
 * @component
 * @param {RegistrationInputProps} props - Section properties
 *
 * Features:
 * - Groups related inputs
 * - Section titles
 * - Helper text support
 * - Custom styling options
 */
const RegistrationInput: React.FC<RegistrationInputProps> = ({
  title,
  containerStyle,
  titleStyle,
  children, // Receive children as a prop
  helperText,
}) => {
  const colorScheme = useColorScheme();
  const theme = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];
  return (
    <View className={`mb-6 ${containerStyle}`}>
      <Text
        style={{ color: theme.text }}
        className={`text-lg font-bold mb-7 ${titleStyle}`}
      >
        {title}
      </Text>
      {helperText && (
        <Text
          style={{ color: theme.textSecondary }}
          className='text-sm mb-5'
        >
          {helperText}
        </Text>
      )}
      <View className='space-y-4'>{children}</View>
    </View>
  );
};

export default RegistrationInput;
export { InputField };
