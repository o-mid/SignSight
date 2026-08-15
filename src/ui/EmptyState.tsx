import { StyleSheet, Text, View } from 'react-native';
import { space, type } from './theme';

type Props = {
  title: string;
  body: string;
};

export function EmptyState({ title, body }: Props) {
  return (
    <View style={styles.wrap} accessibilityRole="text">
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingVertical: space[3],
    gap: space[1],
  },
  title: {
    ...type.body,
    fontWeight: '600',
  },
  body: {
    ...type.subhead,
  },
});
