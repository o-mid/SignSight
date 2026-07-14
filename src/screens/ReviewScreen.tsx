import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { decodeErc20Calldata } from '../decode/decodeCalldata';
import { evaluateSigningRisk } from '../risk/evaluateSigningRisk';
import { hexToUtf8 } from '../wallet/personalSign';
import { rejectSessionRequest } from '../wallet/requestActions';
import { getState, setState, subscribe } from '../state/appState';

function asRecord(value: unknown): Record<string, unknown> | undefined {
  if (typeof value !== 'object' || value === null) {
    return undefined;
  }
  return value as Record<string, unknown>;
}

function txData(params: unknown): string | undefined {
  if (!Array.isArray(params) || params.length === 0) {
    return undefined;
  }
  const tx = asRecord(params[0]);
  return typeof tx?.data === 'string' ? tx.data : undefined;
}

function personalSignHex(params: unknown): string | undefined {
  if (!Array.isArray(params)) {
    return undefined;
  }
  const first = params[0];
  if (typeof first === 'string' && first.startsWith('0x')) {
    return first;
  }
  const second = params[1];
  if (typeof second === 'string' && second.startsWith('0x')) {
    return second;
  }
  return undefined;
}

export default function ReviewScreen() {
  const [snapshot, setSnapshot] = useState(getState);

  useEffect(() => subscribe(() => setSnapshot(getState())), []);

  const request = snapshot.pendingRequest;
  const method = request?.method ?? '';
  const data = request ? txData(request.params) : undefined;
  const signHex = request ? personalSignHex(request.params) : undefined;
  const decoded = decodeErc20Calldata(data);
  const utf8 = signHex ? hexToUtf8(signHex) : null;
  const risks = request
    ? evaluateSigningRisk({
        method,
        chainId: request.chainId,
        decode: decoded,
        personalSignHex: signHex,
      }).rows
    : [];

  let summary = 'Could not decode';
  if (decoded.kind === 'transfer') {
    summary = 'Transfer';
  } else if (decoded.kind === 'approve') {
    summary = 'Approve';
  } else if (method === 'personal_sign' && utf8) {
    summary = utf8;
  }

  async function onReject(): Promise<void> {
    if (!request) {
      return;
    }
    await rejectSessionRequest({ topic: request.topic, id: request.id });
    setState({ pendingRequest: null });
  }

  return (
    <ScrollView style={styles.wrap}>
      <Text style={styles.title}>Review</Text>
      <Text style={styles.summary}>{summary}</Text>
      {risks.map((row) => (
        <Text key={row.code} style={styles.risk}>
          {row.label}
        </Text>
      ))}
      <Pressable
        style={styles.button}
        onPress={() => {
          void onReject();
        }}
      >
        <Text style={styles.buttonText}>Reject</Text>
      </Pressable>
    </ScrollView>
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
  summary: {
    fontSize: 18,
    color: '#111',
    marginBottom: 16,
  },
  risk: {
    fontSize: 16,
    color: '#111',
    marginBottom: 8,
  },
  button: {
    paddingVertical: 12,
  },
  buttonText: {
    fontSize: 16,
    color: '#111',
  },
});
