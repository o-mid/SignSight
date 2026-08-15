import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
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
  const metadata = asRecord(asRecord(asRecord(proposal)?.params)?.proposer)?.metadata;
  const url = metadata?.url;
  return typeof url === 'string' ? url : '';
}

export default function SessionScreen() {
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

  async function onApprove(): Promise<void> {
    if (!isSessionProposal(proposal) || approveExpired) {
      return;
    }
    await approveSessionProposal(proposal);
    const sessions: SessionSnapshot[] = Object.values(listActiveSessions()).map(
      (session) => ({
        topic: session.topic,
        dappUrl: session.peer.metadata.url ?? '',
        name: session.peer.metadata.name ?? '',
      }),
    );
    await saveSessions(sessions);
    setState({ pendingProposal: null, sessions });
  }

  async function onReject(): Promise<void> {
    const id = proposalId(proposal);
    if (id !== undefined) {
      await rejectSessionProposal(id);
    }
    setState({ pendingProposal: null });
  }

  async function onDisconnect(): Promise<void> {
    const topic = snapshot.sessions[0]?.topic;
    if (!topic) {
      return;
    }
    await disconnectSession(topic);
    const sessions = snapshot.sessions.filter((row) => row.topic !== topic);
    await saveSessions(sessions);
    setState({ sessions });
  }

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Session</Text>
      <Text style={styles.meta}>
        {dappUrlFromProposal(proposal) || snapshot.sessions[0]?.dappUrl || ''}
      </Text>
      <Text style={styles.countdown}>
        {formatCountdown(msLeft)}
      </Text>
      <Pressable
        style={[styles.button, approveExpired ? styles.buttonDisabled : null]}
        onPress={() => {
          void onApprove();
        }}
        disabled={approveExpired}
      >
        <Text style={styles.buttonText}>Approve</Text>
      </Pressable>
      <Pressable
        style={styles.button}
        onPress={() => {
          void onReject();
        }}
      >
        <Text style={styles.buttonText}>Reject</Text>
      </Pressable>
      {snapshot.sessions[0]?.topic ? (
        <Pressable
          style={styles.button}
          onPress={() => {
            void onDisconnect();
          }}
        >
          <Text style={styles.buttonText}>Disconnect</Text>
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
    color: '#111',
    marginBottom: 8,
  },
  countdown: {
    fontSize: 20,
    color: '#111',
    marginBottom: 24,
  },
  button: {
    paddingVertical: 12,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    fontSize: 16,
    color: '#111',
  },
});
