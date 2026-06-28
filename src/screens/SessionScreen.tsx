import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { getState, setState, subscribe } from '../state/appState';
import {
  approveSessionProposal,
  rejectSessionProposal,
  type SessionProposal,
} from '../wallet/sessionActions';

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

export default function SessionScreen() {
  const [snapshot, setSnapshot] = useState(getState);

  useEffect(() => subscribe(() => setSnapshot(getState())), []);

  const proposal = snapshot.pendingProposal;

  async function onApprove(): Promise<void> {
    if (!isSessionProposal(proposal)) {
      return;
    }
    await approveSessionProposal(proposal);
    setState({ pendingProposal: null });
  }

  async function onReject(): Promise<void> {
    const id = proposalId(proposal);
    if (id !== undefined) {
      await rejectSessionProposal(id);
    }
    setState({ pendingProposal: null });
  }

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Session</Text>
      <Pressable
        style={styles.button}
        onPress={() => {
          void onApprove();
        }}
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
  button: {
    paddingVertical: 12,
  },
  buttonText: {
    fontSize: 16,
    color: '#111',
  },
});
