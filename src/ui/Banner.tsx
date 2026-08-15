import { StyleSheet, Text, View } from 'react-native';
import { FadeIn, PressScale } from './motion';
import { color, hit, radius, space, type } from './theme';

type Props = {
  title: string;
  body: string;
  onPress: () => void;
};

export function Banner({ title, body, onPress }: Props) {
  return (
    <FadeIn>
      <PressScale accessibilityLabel={title} accessibilityHint={body} onPress={onPress}>
        <View style={styles.wrap}>
          <View style={styles.dot} />
          <View style={styles.copy}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.body}>{body}</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </View>
      </PressScale>
    </FadeIn>
  );
}

const styles = StyleSheet.create({
  wrap: {
    minHeight: hit,
    backgroundColor: color.warningBg,
    borderRadius: radius,
    paddingHorizontal: space[2],
    paddingVertical: space[2],
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: color.warning,
  },
  copy: {
    flex: 1,
    gap: 4,
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
  chevron: {
    fontSize: 22,
    lineHeight: 24,
    color: color.warning,
  },
});
