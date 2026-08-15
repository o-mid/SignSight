import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootStack';
import { demoSignerConfigured } from '../wallet/demoSigner';
import { loadDemoSignerEnabled } from '../wallet/demoSignerStore';
import { loadHistory } from '../wallet/historyStore';
import { loadSessions } from '../wallet/sessionStore';
import { getState, setState, subscribe } from '../state/appState';
import { Banner } from '../ui/Banner';
import { BrandMark } from '../ui/BrandMark';
import { Button } from '../ui/Button';
import { ListGroup, ListRow } from '../ui/ListRow';
import { FadeIn, PressScale } from '../ui/motion';
import { Screen } from '../ui/Screen';
import { color, lift, radius, radiusLg, space, type } from '../ui/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const [snapshot, setSnapshot] = useState(getState);

  useEffect(() => subscribe(() => setSnapshot(getState())), []);

  useEffect(() => {
    void Promise.all([loadSessions(), loadHistory(), loadDemoSignerEnabled()]).then(
      ([sessions, history, demoSignerEnabled]) => {
        setState({
          sessions,
          history,
          demoSignerEnabled: demoSignerConfigured() && demoSignerEnabled,
        });
      },
    );
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
    <Screen scroll padTop>
      <FadeIn>
        <View style={styles.hero}>
          <View style={styles.well}>
            <BrandMark size={56} />
          </View>
          <Text style={styles.wordmark}>SignSight</Text>
          <Text style={styles.lede}>See the request before you sign.</Text>
        </View>
      </FadeIn>
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
      <FadeIn delay={80}>
        <Button label="Pair a dApp" onPress={() => navigation.navigate('Pair')} />
      </FadeIn>
      <FadeIn delay={140}>
        <View style={styles.sessions}>
          <Text style={styles.section}>Sessions</Text>
          {snapshot.sessions.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>Nothing paired yet</Text>
              <Text style={styles.emptyBody}>A Sepolia test dApp shows up here after you pair.</Text>
            </View>
          ) : (
            <ListGroup>
              {snapshot.sessions.map(row => (
                <ListRow
                  key={row.topic}
                  title={row.name || row.dappUrl || 'Session'}
                  subtitle={row.dappUrl}
                  accessory="Open"
                  onPress={() => navigation.navigate('Session')}
                />
              ))}
            </ListGroup>
          )}
        </View>
      </FadeIn>
      <FadeIn delay={200}>
        <View style={styles.tiles}>
          <View style={styles.tileWrap}>
            <PressScale
              accessibilityLabel="History"
              onPress={() => navigation.navigate('History')}
            >
              <View style={styles.tile}>
                <View style={styles.tileHead}>
                  <Text style={styles.tileTitle}>History</Text>
                  <Text style={styles.chevron}>›</Text>
                </View>
                <Text style={styles.tileBody}>Rejected and dry-run rows</Text>
              </View>
            </PressScale>
          </View>
          <View style={styles.tileWrap}>
            <PressScale
              accessibilityLabel="Settings"
              onPress={() => navigation.navigate('Settings')}
            >
              <View style={styles.tile}>
                <View style={styles.tileHead}>
                  <Text style={styles.tileTitle}>Settings</Text>
                  <Text style={styles.chevron}>›</Text>
                </View>
                <Text style={styles.tileBody}>Dry-run stays locked on</Text>
              </View>
            </PressScale>
          </View>
        </View>
      </FadeIn>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    paddingTop: space[2],
    paddingBottom: space[1],
    gap: space[1],
  },
  well: {
    width: 88,
    height: 88,
    borderRadius: radiusLg,
    backgroundColor: color.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...lift,
    marginBottom: space[1],
  },
  wordmark: {
    ...type.title,
  },
  lede: {
    ...type.subhead,
    textAlign: 'center',
  },
  sessions: {
    gap: space[1],
  },
  section: {
    ...type.footnote,
    fontWeight: '600',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  empty: {
    backgroundColor: color.surface,
    borderRadius: radius,
    paddingHorizontal: space[2],
    paddingVertical: space[3],
    gap: 6,
    ...lift,
  },
  emptyTitle: {
    ...type.body,
    fontWeight: '600',
  },
  emptyBody: {
    ...type.footnote,
  },
  tiles: {
    flexDirection: 'row',
    gap: space[2],
  },
  tileWrap: {
    flex: 1,
  },
  tile: {
    minHeight: 96,
    backgroundColor: color.surface,
    borderRadius: radius,
    padding: space[2],
    gap: 6,
    ...lift,
  },
  tileHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tileTitle: {
    ...type.callout,
    fontWeight: '600',
  },
  chevron: {
    fontSize: 22,
    lineHeight: 24,
    color: color.inkFaint,
  },
  tileBody: {
    ...type.footnote,
  },
});
