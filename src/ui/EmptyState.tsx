import { StyleSheet, Text, View } from 'react-native';
import { BrandMark } from './BrandMark';
import { color, radiusLg, space, type } from './theme';

type Props = {
  title: string;
  body: string;
  mark?: boolean;
};

export function EmptyState({ title, body, mark }: Props) {
  return (
    <View style={styles.wrap} accessibilityRole="text">
      {mark ? (
        <View style={styles.well}>
          <BrandMark size={40} />
        </View>
      ) : null}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    paddingVertical: space[4],
    paddingHorizontal: space[2],
    gap: space[1],
  },
  well: {
    width: 72,
    height: 72,
    borderRadius: radiusLg,
    backgroundColor: color.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: space[1],
  },
  title: {
    ...type.headline,
    textAlign: 'center',
  },
  body: {
    ...type.subhead,
    textAlign: 'center',
    maxWidth: 280,
  },
});
