import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { loadHistory } from '../wallet/historyStore';
import { getState, setState, subscribe } from '../state/appState';

export default function HistoryScreen() {
  const [snapshot, setSnapshot] = useState(getState);

  useEffect(() => subscribe(() => setSnapshot(getState())), []);

  useEffect(() => {
    void loadHistory().then((history) => {
      setState({ history });
    });
  }, []);

  return (
    <ScrollView style={styles.wrap} contentContainerStyle={styles.content}>
      <Text style={styles.title}>History</Text>
      {snapshot.history.map((row) => (
        <View key={row.id} style={styles.row}>
          <Text style={styles.meta}>{row.method}</Text>
          <Text style={styles.meta}>{row.summary}</Text>
          <Text style={styles.meta}>{row.outcome}</Text>
          <Text style={styles.meta}>{row.dappUrl}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: '#f4f4f5',
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 22,
    color: '#111',
    marginBottom: 12,
  },
  row: {
    marginBottom: 16,
  },
  meta: {
    fontSize: 16,
    color: '#111',
    marginBottom: 4,
  },
});
