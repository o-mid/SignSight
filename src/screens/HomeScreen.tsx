import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootStack';
import { loadHistory } from '../wallet/historyStore';
import { loadSessions } from '../wallet/sessionStore';
import { getState, setState, subscribe } from '../state/appState';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const [snapshot, setSnapshot] = useState(getState);

  useEffect(() => subscribe(() => setSnapshot(getState())), []);

  useEffect(() => {
    void Promise.all([loadSessions(), loadHistory()]).then(([sessions, history]) => {
      setState({ sessions, history });
    });
  }, []);

  const pending = snapshot.pendingCount > 0;

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>SignSight</Text>
      <Text style={styles.meta}>Sessions: {snapshot.sessions.length}</Text>
      {pending ? <Text style={styles.badge}>Pending: {snapshot.pendingCount}</Text> : null}
      <Pressable style={styles.link} onPress={() => navigation.navigate('Pair')}>
        <Text style={styles.linkText}>Pair</Text>
      </Pressable>
      <Pressable style={styles.link} onPress={() => navigation.navigate('History')}>
        <Text style={styles.linkText}>History</Text>
      </Pressable>
      <Pressable style={styles.link} onPress={() => navigation.navigate('Settings')}>
        <Text style={styles.linkText}>Settings</Text>
      </Pressable>
      {snapshot.pendingProposal !== null ? (
        <Pressable style={styles.link} onPress={() => navigation.navigate('Session')}>
          <Text style={styles.linkText}>Session</Text>
        </Pressable>
      ) : null}
      {snapshot.pendingRequest !== null || snapshot.pendingAuth !== null ? (
        <Pressable style={styles.link} onPress={() => navigation.navigate('Review')}>
          <Text style={styles.linkText}>Review</Text>
        </Pressable>
      ) : null}
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
    color: '#333',
    marginBottom: 12,
  },
  badge: {
    fontSize: 16,
    color: '#111',
    marginBottom: 12,
  },
  link: {
    paddingVertical: 10,
  },
  linkText: {
    fontSize: 16,
    color: '#111',
  },
});
