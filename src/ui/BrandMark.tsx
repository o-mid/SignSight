import { Image, StyleSheet } from 'react-native';

type Props = {
  size?: number;
};

export function BrandMark({ size = 48 }: Props) {
  return (
    <Image
      source={require('../assets/mark.png')}
      accessibilityLabel="SignSight"
      accessible
      accessibilityRole="image"
      resizeMode="contain"
      style={[styles.image, { width: size, height: size }]}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    flexShrink: 0,
  },
});
