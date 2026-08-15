import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootStack';
import { loadHistory } from '../wallet/historyStore';
import { loadSessions } from '../wallet/sessionStore';
import { getState, setState, subscribe } from '../state/appState';
import { Banner } from '../ui/Banner';
import { EmptyState } from '../ui/EmptyState';
import { ListGroup, ListRow } from '../ui/ListRow';
import { Screen } from '../ui/Screen';
import { type } from '../ui/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const [snapshot, setSnapshot] = useState(getState);

  useEffect(() => subscribe(() => setSnapshot(getState())), []);

  useEffect(() => {
    void Promise.all([loadSessions(), loadHistory()]).then(([sessions, history]) => {
      setState({ sessions, history });
    });
  }, []);

  const pendingReview = snapshot.pendingRequest !== null || snapshot.pendingAuth !== null;
  const pendingSession = snapshot.pendingProposal !== null;

  useFocusEffect(
    useCallback(() => {
      if (pendingReview) {
        navigation.navigate('Review');
        return;
      }
      if (pendingSession) {
        navigation.navigate('Session');
      }
    }, [navigation, pendingReview, pendingSession]),
  );

  return (
    <Screen scroll>
      <Text style={styles.lede}>See the request before you sign.</Text>
      {pendingReview ? (
        <Banner
          title="Request waiting"
          body="Open the review sheet to reject or dry-run."
          onPress={() => navigation.navigate('Review')}
        />
      ) : null}
      {pendingSession && !pendingReview ? (
        <Banner
          title="Session waiting"
          body="Open the session sheet to approve or reject."
          onPress={() => navigation.navigate('Session')}
        />
      ) : null}
      <Text style={styles.section}>Sessions</Text>
      {snapshot.sessions.length === 0 ? (
        <EmptyState title="No paired dApps" body="Pair with a test dApp to review requests." />
      ) : (
        <ListGroup>
          {snapshot.sessions.map(row => (
            <ListRow
              key={row.topic}
              title={row.name || row.dappUrl || 'Session'}
              subtitle={row.dappUrl}
              accessory="View"
              onPress={() => navigation.navigate('Session')}
            />
          ))}
        </ListGroup>
      )}
      <ListGroup>
        <ListRow title="Pair" subtitle="Paste a URI or scan a QR" onPress={() => navigation.navigate('Pair')} />
        <ListRow title="History" subtitle="Rejected and dry-run rows" onPress={() => navigation.navigate('History')} />
        <ListRow title="Settings" subtitle="Dry-run is locked on" onPress={() => navigation.navigate('Settings')} />
      </ListGroup>
    </Screen>
  );
}

const styles = StyleSheet.create({
  lede: {
    ...type.subhead,
  },
  section: {
    ...type.footnote,
    fontWeight: '600',
  },
});
