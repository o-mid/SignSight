import { StyleSheet, Switch, Text, View } from 'react-native';
import { Screen } from '../ui/Screen';
import { color, hit, radius, space, type } from '../ui/theme';

export default function SettingsScreen() {
  return (
    <Screen>
      <View style={styles.row}>
        <View style={styles.copy}>
          <Text style={styles.title}>Dry-run</Text>
          <Text style={styles.body}>On. Requests are recorded locally and never broadcast.</Text>
        </View>
        <Switch
          value={true}
          disabled={true}
          accessibilityLabel="Dry-run"
          accessibilityHint="Dry-run is locked on."
          accessibilityState={{ disabled: true, checked: true }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: hit,
    backgroundColor: color.surface,
    borderRadius: radius,
    borderWidth: 1,
    borderColor: color.line,
    paddingHorizontal: space[2],
    paddingVertical: space[2],
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2],
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  title: {
    ...type.body,
    fontWeight: '600',
  },
  body: {
    ...type.footnote,
  },
});
