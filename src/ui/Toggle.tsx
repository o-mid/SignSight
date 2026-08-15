import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';
import { color, motion } from './theme';

type Props = {
  value: boolean;
  disabled?: boolean;
  onValueChange: (value: boolean) => void;
  accessibilityLabel: string;
  accessibilityHint?: string;
};

export function Toggle({
  value,
  disabled,
  onValueChange,
  accessibilityLabel,
  accessibilityHint,
}: Props) {
  const offset = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(offset, {
      toValue: value ? 1 : 0,
      duration: motion.fast,
      useNativeDriver: true,
    }).start();
  }, [offset, value]);

  const translateX = offset.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22],
  });

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: Boolean(disabled), checked: value }}
      disabled={disabled}
      onPress={() => {
        if (!disabled) {
          onValueChange(!value);
        }
      }}
      style={[styles.track, value ? styles.on : styles.off, disabled ? styles.idle : null]}
      hitSlop={8}
    >
      <Animated.View style={[styles.thumb, { transform: [{ translateX }] }]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 52,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
  },
  on: {
    backgroundColor: color.ink,
  },
  off: {
    backgroundColor: color.line,
  },
  idle: {
    opacity: 0.45,
  },
  thumb: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: color.surface,
  },
});
