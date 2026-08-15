import { StyleSheet, Text, View } from 'react-native';
import { color, type } from './theme';

export function LockBadge({ label }: { label: string }) {
  return (
    <View style={styles.wrap} accessibilityRole="text" accessibilityLabel={label}>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    minHeight: 28,
    paddingHorizontal: 10,
    borderRadius: 14,
    backgroundColor: color.bg,
    borderWidth: 1,
    borderColor: color.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...type.footnote,
    fontWeight: '600',
    color: color.inkMuted,
  },
});
