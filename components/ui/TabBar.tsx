import { View, Text, Pressable, useColorScheme, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import Animated, {
  useAnimatedStyle,
  withSpring,
  interpolate,
  withTiming,
} from 'react-native-reanimated';

/**
 * Custom Tab Bar Component
 * Animated bottom navigation bar with smooth transitions and visual feedback
 */

interface TabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

/**
 * TabBar Component
 * @component
 * @param {Object} props
 * @param {Object} props.state - Navigation state
 * @param {Object} props.descriptors - Tab descriptors
 * @param {Object} props.navigation - Navigation object
 *
 * Features:
 * - Animated tab transitions
 * - Theme-aware styling
 * - Custom icons and labels
 * - Touch feedback
 */
export default function TabBar({ state, descriptors, navigation }: TabBarProps) {
  const colorScheme = useColorScheme();
  const theme = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];

  return (
    <View style={[styles.tabBar, { backgroundColor: theme.surface }]}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const label = options.title ?? route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const animatedIconStyle = useAnimatedStyle(() => {
          return {
            transform: [
              {
                scale: withSpring(isFocused ? 1.2 : 1),
              },
            ],
          };
        });

        const animatedTextStyle = useAnimatedStyle(() => {
          const opacity = withTiming(isFocused ? 1 : 0);
          const translateY = withSpring(isFocused ? 0 : 10);
          return {
            opacity,
            transform: [{ translateY }],
          };
        });

        const bgStyle = useAnimatedStyle(() => {
          const scale = withSpring(isFocused ? 1 : 0);
          const opacity = withTiming(isFocused ? 1 : 0);
          return {
            transform: [{ scale }],
            opacity,
          };
        });

        return (
          <Pressable
            key={index}
            onPress={onPress}
            style={styles.tabItem}
          >
            <Animated.View
              style={[styles.activeBackground, { backgroundColor: theme.primary }, bgStyle]}
            />
            <Animated.View style={[styles.iconContainer, animatedIconStyle]}>
              {options.tabBarIcon?.({
                focused: isFocused,
                color: isFocused ? '#151312' : theme.textSecondary,
                size: 25,
              })}
            </Animated.View>
            <Animated.Text
              style={[styles.label, { color: theme.textSecondary }, animatedTextStyle]}
            >
              {label}
            </Animated.Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: 26,
    marginVertical: 5,
    height: 70,
    borderRadius: 30,
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    bottom: 5,
  },
  activeBackground: {
    position: 'absolute',
    width: '55%',
    height: '55%',
    borderRadius: 35,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 9,
    fontWeight: '600',
    position: 'absolute',
    bottom: -2,
    left: 0,
    right: 0,
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
});
