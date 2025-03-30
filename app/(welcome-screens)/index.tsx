import React, { useState, useRef } from 'react';
import { View, Text, Dimensions, FlatList, TouchableOpacity, useColorScheme } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { COLORS } from '../../constants/theme';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppStorage } from '@/lib/storage/appStorage';

const { width } = Dimensions.get('window');

type SlideType = {
  id: string;
  title: string;
  subtitle: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
};

const slides: SlideType[] = [
  {
    id: '1',
    title: 'For Gym Owners',
    subtitle:
      'Streamline operations, track revenue, and manage your gym efficiently with AI-powered insights',
    icon: 'dumbbell',
  },
  {
    id: '2',
    title: 'For Trainers',
    subtitle:
      'Track client progress, schedule classes, and deliver personalized training plans with our smart trainer dashboard',
    icon: 'calendar-clock',
  },
  {
    id: '3',
    title: 'For Members',
    subtitle:
      'Book classes, track workouts, and achieve your fitness goals with personalized AI recommendations',
    icon: 'account-group',
  },
];

const OnboardingScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const colorScheme = useColorScheme();
  const theme = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];

  const renderItem = ({ item, index }: { item: (typeof slides)[0]; index: number }) => {
    return (
      <View
        style={{ width }}
        className='flex-1'
      >
        <View className='flex-1 px-6'>
          {/* Progress Indicator */}
          <View className='flex-row justify-between items-center mt-12 mb-8'>
            <Text
              style={{ color: theme.textSecondary }}
              className='text-base font-medium'
            >
              {`${(index + 1).toString().padStart(2, '0')}/${slides.length
                .toString()
                .padStart(2, '0')}`}
            </Text>
            {currentIndex !== slides.length - 1 && (
              <TouchableOpacity onPress={() => router.push('/login')}>
                <Text
                  style={{ color: theme.textSecondary }}
                  className='text-base font-medium'
                >
                  Skip
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Icon Section */}
          <Animated.View
            entering={FadeInRight}
            exiting={FadeOutLeft}
            className='w-full h-[200] items-center justify-center'
          >
            <View
              style={{ backgroundColor: theme.surfaceHighlight }}
              className='w-40 h-40 rounded-full items-center justify-center'
            >
              <MaterialCommunityIcons
                name={item.icon}
                size={110}
                color={theme.primary}
              />
            </View>
          </Animated.View>

          {/* Text Content */}
          <View className='flex-1 justify-center'>
            <Text
              style={{ color: theme.text }}
              className='text-4xl font-bold mb-4'
            >
              {item.title}
            </Text>
            <Text
              style={{ color: theme.textSecondary }}
              className='text-lg leading-relaxed'
            >
              {item.subtitle}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const handleNext = async () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      // Mark app as launched and navigate to login
      await AppStorage.setAppLaunched();
      router.push('/(auth)/login');
    }
  };

  const renderProgressBar = () => {
    return (
      <View className='flex-row h-1 mb-12'>
        {slides.map((_, index) => (
          <View
            key={index}
            className='flex-1 h-full mx-1 rounded-full overflow-hidden'
            style={{ backgroundColor: theme.surfaceHighlight }}
          >
            <Animated.View
              className='h-full rounded-full'
              style={{
                backgroundColor: theme.primary,
                width: index <= currentIndex ? '100%' : '0%',
              }}
            />
          </View>
        ))}
      </View>
    );
  };

  return (
    <View
      className='flex-1'
      style={{ backgroundColor: theme.background }}
    >
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={event => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      />

      {/* Bottom Section */}
      <View className='px-6 pb-12'>
        {/* KezAI Technologies Branding */}
        <View className='items-center mb-8'>
          <Text
            style={{ color: theme.textSecondary }}
            className='text-[8px] font-medium'
          >
            Powered by
          </Text>
          <View className='flex-row items-center -ml-3'>
            <Text className='text-xs ml-1'>✨ </Text>
            <Text
              style={{ color: theme.primary }}
              className='text-base font-bold'
            >
              KezAi Technologies
            </Text>
          </View>
          <Text
            style={{ color: theme.textSecondary }}
            className='text-[10px] mt-0.5'
          >
            Next-Gen Gym Management Platform
          </Text>
        </View>

        {renderProgressBar()}
        <TouchableOpacity
          onPress={handleNext}
          className='h-14 rounded-xl items-center justify-center'
          style={{ backgroundColor: theme.primary }}
        >
          <Text
            style={{ color: '#000000' }}
            className='text-lg font-semibold'
          >
            {currentIndex === slides.length - 1 ? 'Get Started' : 'Continue'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OnboardingScreen;
