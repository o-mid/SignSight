import { type ReactNode, useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, type StyleProp, type ViewStyle } from 'react-native';
import { motion } from './theme';

type FadeInProps = {
  children: ReactNode;
  delay?: number;
  style?: StyleProp<ViewStyle>;
};

export function FadeIn({ children, delay = 0, style }: FadeInProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(14)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: motion.base,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: motion.base,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [delay, opacity, translateY]);

  return (
    <Animated.View style={[style, { opacity, transform: [{ translateY }] }]}>{children}</Animated.View>
  );
}

type PressScaleProps = {
  children: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  accessibilityRole?: 'button';
  accessibilityLabel?: string;
  accessibilityHint?: string;
  style?: StyleProp<ViewStyle>;
};

export function PressScale({
  children,
  onPress,
  disabled,
  accessibilityRole = 'button',
  accessibilityLabel,
  accessibilityHint,
  style,
}: PressScaleProps) {
  const scale = useRef(new Animated.Value(1)).current;

  function to(value: number): void {
    Animated.spring(scale, {
      toValue: value,
      friction: 7,
      tension: 140,
      useNativeDriver: true,
    }).start();
  }

  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <Pressable
        accessibilityRole={accessibilityRole}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled: Boolean(disabled) }}
        disabled={disabled}
        onPress={onPress}
        onPressIn={() => {
          if (!disabled) {
            to(0.97);
          }
        }}
        onPressOut={() => {
          to(1);
        }}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}
