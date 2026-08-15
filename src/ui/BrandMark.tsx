import { useEffect, useRef } from 'react';
import { Animated, Easing, Image, StyleSheet } from 'react-native';
import { motion } from './theme';

type Props = {
  size?: number;
};

export function BrandMark({ size = 48 }: Props) {
  const scale = useRef(new Animated.Value(0.92)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: motion.base,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 8,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, scale]);

  return (
    <Animated.View style={{ opacity, transform: [{ scale }] }}>
      <Image
        source={require('../assets/mark.png')}
        accessibilityLabel="SignSight"
        accessible
        accessibilityRole="image"
        resizeMode="contain"
        style={[styles.image, { width: size, height: size }]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  image: {
    flexShrink: 0,
  },
});
