import { StyleSheet, Switch, Text, View } from 'react-native';

export default function SettingsScreen() {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.meta}>Dry-run</Text>
      <Switch value={true} disabled={true} />
      <Text style={styles.meta}>Dry-run is on. Requests are not broadcast.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f4f4f5',
  },
  title: {
    fontSize: 22,
    color: '#111',
    marginBottom: 12,
  },
  meta: {
    fontSize: 16,
    color: '#111',
    marginTop: 12,
  },
});
