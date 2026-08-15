import { Pressable, StyleSheet, Text } from 'react-native';
import { color, hit, radius, space, type } from './theme';

type Props = {
  title: string;
  body: string;
  onPress: () => void;
};

export function Banner({ title, body, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={body}
      onPress={onPress}
      style={({ pressed }) => [styles.wrap, pressed ? styles.pressed : null]}
    >
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    minHeight: hit,
    backgroundColor: color.warningBg,
    borderRadius: radius,
    paddingHorizontal: space[2],
    paddingVertical: space[2],
    gap: 4,
  },
  pressed: {
    opacity: 0.72,
  },
  title: {
    ...type.callout,
    fontWeight: '600',
    color: color.warning,
  },
  body: {
    ...type.footnote,
    color: color.warning,
  },
});
