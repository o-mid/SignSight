import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootStack';
import { getState, setState, subscribe } from '../state/appState';
import {
  approveSessionProposal,
  disconnectSession,
  formatCountdown,
  isApproveExpired,
  listActiveSessions,
  proposalExpiryMs,
  rejectSessionProposal,
  type ProposalExpirySource,
  type SessionProposal,
} from '../wallet/sessionActions';
import { saveSessions, type SessionSnapshot } from '../wallet/sessionStore';
import { Button } from '../ui/Button';
import { FadeIn } from '../ui/motion';
import { Screen } from '../ui/Screen';
import { color, lift, radius, space, type } from '../ui/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Session'>;

function asRecord(value: unknown): Record<string, unknown> | undefined {
  if (typeof value !== 'object' || value === null) {
    return undefined;
  }
  return value as Record<string, unknown>;
}

function proposalId(proposal: unknown): number | undefined {
  const id = asRecord(proposal)?.id;
  return typeof id === 'number' ? id : undefined;
}

function isSessionProposal(value: unknown): value is SessionProposal {
  return proposalId(value) !== undefined && asRecord(asRecord(value)?.params) !== undefined;
}

function expirySource(proposal: unknown): ProposalExpirySource {
  const params = asRecord(asRecord(proposal)?.params);
  return {
    params: {
      expiryTimestamp:
        typeof params?.expiryTimestamp === 'number' ? params.expiryTimestamp : undefined,
      expiry: typeof params?.expiry === 'number' ? params.expiry : undefined,
    },
  };
}

function dappUrlFromProposal(proposal: unknown): string {
  const metadata = asRecord(asRecord(asRecord(asRecord(proposal)?.params)?.proposer)?.metadata);
  const url = metadata?.url;
  return typeof url === 'string' ? url : '';
}

export default function SessionScreen({ navigation }: Props) {
  const [snapshot, setSnapshot] = useState(getState);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => subscribe(() => setSnapshot(getState())), []);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  const proposal = snapshot.pendingProposal;
  const msLeft = proposalExpiryMs(expirySource(proposal)) - now;
  const approveExpired = isApproveExpired(msLeft);
  const dappUrl = dappUrlFromProposal(proposal) || snapshot.sessions[0]?.dappUrl || '';
  const hasProposal = proposalId(proposal) !== undefined;
  const hasSession = Boolean(snapshot.sessions[0]?.topic);

  async function onApprove(): Promise<void> {
    if (!isSessionProposal(proposal) || approveExpired) {
      return;
    }
    await approveSessionProposal(proposal);
    const sessions: SessionSnapshot[] = Object.values(listActiveSessions()).map(session => ({
      topic: session.topic,
      dappUrl: session.peer.metadata.url ?? '',
      name: session.peer.metadata.name ?? '',
    }));
    await saveSessions(sessions);
    setState({ pendingProposal: null, sessions });
    navigation.goBack();
  }

  async function onReject(): Promise<void> {
    const id = proposalId(proposal);
    if (id !== undefined) {
      await rejectSessionProposal(id);
    }
    setState({ pendingProposal: null });
    navigation.goBack();
  }

  async function onDisconnect(): Promise<void> {
    const topic = snapshot.sessions[0]?.topic;
    if (!topic) {
      return;
    }
    await disconnectSession(topic);
    const sessions = snapshot.sessions.filter(row => row.topic !== topic);
    await saveSessions(sessions);
    setState({ sessions });
    navigation.goBack();
  }

  function confirmDisconnect(): void {
    Alert.alert('Disconnect this dApp?', 'The session ends. You can pair again later.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Disconnect',
        style: 'destructive',
        onPress: () => {
          void onDisconnect();
        },
      },
    ]);
  }

  return (
    <Screen
      footer={
        <>
          {hasProposal ? (
            <Button
              label="Approve"
              disabled={approveExpired}
              accessibilityHint={approveExpired ? 'Approve expired' : 'Approve this session'}
              onPress={() => {
                void onApprove();
              }}
            />
          ) : null}
          {hasProposal ? (
            <Button
              role="secondary"
              label="Reject"
              onPress={() => {
                void onReject();
              }}
            />
          ) : null}
          {hasSession ? (
            <Button role="ghost" label="Disconnect" onPress={confirmDisconnect} />
          ) : null}
        </>
      }
    >
      <FadeIn>
        <View style={styles.card}>
          <Text style={styles.kicker}>dApp</Text>
          <Text style={styles.url}>{dappUrl || 'No pending session.'}</Text>
          {hasProposal ? (
            <>
              <Text
                style={[styles.countdown, approveExpired ? styles.expired : null]}
                accessibilityRole="text"
                accessibilityLiveRegion="polite"
                accessibilityLabel={`Time left ${formatCountdown(msLeft)}`}
              >
                {formatCountdown(msLeft)}
              </Text>
              <Text style={styles.hint}>
                {approveExpired
                  ? 'Approve expired. Reject or Disconnect still work.'
                  : 'Approve before the timer reaches 00:00.'}
              </Text>
            </>
          ) : (
            <Text style={styles.hint}>
              {hasSession
                ? 'This dApp is paired. Disconnect ends the session.'
                : 'Pair a dApp to start a session.'}
            </Text>
          )}
        </View>
      </FadeIn>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: color.surface,
    borderRadius: radius,
    padding: space[3],
    gap: space[1],
    ...lift,
  },
  kicker: {
    ...type.footnote,
    fontWeight: '600',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  url: {
    ...type.headline,
  },
  countdown: {
    ...type.display,
    fontVariant: ['tabular-nums'],
    marginTop: space[1],
  },
  expired: {
    color: color.danger,
  },
  hint: {
    ...type.subhead,
  },
});
