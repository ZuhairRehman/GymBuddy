import React from 'react';
import { TouchableOpacity, Text, View, ActivityIndicator } from 'react-native';
import { ButtonProps } from '../../types/ui-types';
import { useColorScheme } from 'react-native';
import { COLORS } from '../../constants/theme';

const UiButton: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  textClassName = '',
  children,
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  title,

  ...props
}) => {
  const colorScheme = useColorScheme();
  const theme = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          bg: theme.primary,
          text: '#000000',
          border: 'transparent',
        };
      case 'secondary':
        return {
          bg: theme.surface,
          text: theme.text,
          border: theme.surfaceHighlight,
        };
      case 'outline':
        return {
          bg: 'transparent',
          text: theme.text,
          border: theme.text,
        };
      case 'ghost':
        return {
          bg: 'transparent',
          text: theme.text,
          border: 'transparent',
        };
      default:
        return {
          bg: theme.primary,
          text: '#000000',
          border: 'transparent',
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          height: 32,
          px: 12,
          text: 14,
        };
      case 'lg':
        return {
          height: 48,
          px: 24,
          text: 16,
        };
      default:
        return {
          height: 40,
          px: 16,
          text: 15,
        };
    }
  };

  const variantStyle = getVariantStyles();
  const sizeStyle = getSizeStyles();

  return (
    <TouchableOpacity
      onPress={props.onPress}
      className={`flex-row items-center justify-center rounded-xl mt-5 ${
        disabled ? 'opacity-50' : ''
      } ${className}`}
      style={{
        backgroundColor: variantStyle.bg,
        borderColor: variantStyle.border,
        borderWidth: variantStyle.border !== 'transparent' ? 1 : 0,
        height: sizeStyle.height,
        paddingHorizontal: sizeStyle.px,
      }}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={variantStyle.text} />
      ) : (
        <>
          {leftIcon && <View className='mr-2'>{leftIcon}</View>}
          <Text
            className={`font-medium ${textClassName}`}
            style={{
              color: variantStyle.text,
              fontSize: sizeStyle.text,
            }}
          >
            {children}
          </Text>
          {rightIcon && <View className='ml-2'>{rightIcon}</View>}
        </>
      )}
    </TouchableOpacity>
  );
};

export default UiButton;
