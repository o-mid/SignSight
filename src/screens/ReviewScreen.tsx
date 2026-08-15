import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootStack';
import { explainRequest } from '../explain/explainRequest';
import { decodeErc20Calldata } from '../decode/decodeCalldata';
import { reviewTitle } from '../decode/reviewLabel';
import { evaluateSigningRisk } from '../risk/evaluateSigningRisk';
import { hexToUtf8 } from '../wallet/personalSign';
import { isMalformedSiwe, type SiweFields } from '../wallet/siwe';
import { appendHistory } from '../wallet/historyStore';
import {
  completeDryRun,
  rejectMalformedSiwe,
  rejectSessionRequest,
} from '../wallet/requestActions';
import { getState, setState, subscribe } from '../state/appState';
import { Button } from '../ui/Button';
import { RiskRow } from '../ui/RiskRow';
import { Screen } from '../ui/Screen';
import { type } from '../ui/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Review'>;

const EMPTY_SIWE: SiweFields = {
  domain: undefined,
  address: undefined,
  statement: undefined,
  uri: undefined,
  chain: undefined,
  nonce: undefined,
  issuedAt: undefined,
  expiration: undefined,
};

const SIWE_LABELS: Record<keyof SiweFields, string> = {
  domain: 'Domain',
  address: 'Address',
  statement: 'Statement',
  uri: 'URI',
  chain: 'Chain',
  nonce: 'Nonce',
  issuedAt: 'Issued',
  expiration: 'Expires',
};

function objectRecord(value: unknown): Record<string, unknown> | undefined {
  if (typeof value !== 'object' || value === null) {
    return undefined;
  }
  return value as Record<string, unknown>;
}

function transactionFields(params: unknown): { data?: string; to?: string } {
  if (!Array.isArray(params) || params.length === 0) {
    return {};
  }
  const tx = objectRecord(params[0]);
  return {
    data: typeof tx?.data === 'string' ? tx.data : undefined,
    to: typeof tx?.to === 'string' ? tx.to : undefined,
  };
}

function signPayloadHex(params: unknown): string | undefined {
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

export default function ReviewScreen({ navigation }: Props) {
  const [snapshot, setSnapshot] = useState(getState);
  const [showHex, setShowHex] = useState(false);
  const [explainText, setExplainText] = useState<string | null>(null);
  const [explaining, setExplaining] = useState(false);

  useEffect(() => subscribe(() => setSnapshot(getState())), []);

  const request = snapshot.pendingRequest;
  const auth = snapshot.pendingAuth;
  const siweFields = (auth?.fields as SiweFields | undefined) ?? EMPTY_SIWE;
  const siweKeys: (keyof SiweFields)[] = [
    'domain',
    'address',
    'statement',
    'uri',
    'chain',
    'nonce',
    'issuedAt',
    'expiration',
  ];

  useEffect(() => {
    if (auth && isMalformedSiwe(siweFields)) {
      void rejectMalformedSiwe(auth.id);
    }
  }, [auth, siweFields]);

  const method = request?.method ?? '';
  const tx = request ? transactionFields(request.params) : {};
  const data = tx.data;
  const signHex = request ? signPayloadHex(request.params) : undefined;
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

  let summary = reviewTitle({ kind: decoded.kind, tokenAddress: tx.to });
  if (method === 'personal_sign' && utf8) {
    summary = utf8;
  }

  async function onReject(): Promise<void> {
    if (auth && isMalformedSiwe(siweFields)) {
      await rejectMalformedSiwe(auth.id);
      const row = {
        id: String(auth.id),
        at: Date.now(),
        method: 'session_authenticate',
        dappUrl: auth.dappUrl,
        summary: 'Malformed SIWE.',
        risks: [],
        outcome: 'malformed' as const,
      };
      await appendHistory(row);
      setState({ pendingAuth: null, history: [...getState().history, row] });
      navigation.goBack();
      return;
    }
    if (!request) {
      return;
    }
    await rejectSessionRequest({ topic: request.topic, id: request.id });
    const row = {
      id: String(request.id),
      at: Date.now(),
      method,
      dappUrl: request.dappUrl,
      summary,
      risks: risks.map(item => item.label),
      outcome: 'rejected' as const,
    };
    await appendHistory(row);
    setState({ pendingRequest: null, history: [...getState().history, row] });
    navigation.goBack();
  }

  async function onExplain(): Promise<void> {
    setExplaining(true);
    const result = await explainRequest({
      decode: { kind: decoded.kind },
      risks,
      method: method || 'session_authenticate',
      dappUrl: request?.dappUrl ?? auth?.dappUrl ?? '',
    });
    setExplainText(result.summary);
    setExplaining(false);
  }

  async function onDryRun(): Promise<void> {
    if (!request) {
      return;
    }
    await completeDryRun({ topic: request.topic, id: request.id });
    const row = {
      id: String(request.id),
      at: Date.now(),
      method,
      dappUrl: request.dappUrl,
      summary,
      risks: risks.map(item => item.label),
      outcome: 'dry-run' as const,
    };
    await appendHistory(row);
    setState({ pendingRequest: null, history: [...getState().history, row] });
    navigation.goBack();
  }

  return (
    <Screen
      scroll
      footer={
        <>
          <Button
            role="destructive"
            label="Reject"
            onPress={() => {
              void onReject();
            }}
          />
          {request ? (
            <Button
              role="secondary"
              label="Dry-run"
              onPress={() => {
                void onDryRun();
              }}
            />
          ) : null}
        </>
      }
    >
      <Text style={styles.summary}>{summary}</Text>
      {request?.dappUrl || auth?.dappUrl ? (
        <Text style={styles.meta}>{request?.dappUrl ?? auth?.dappUrl}</Text>
      ) : null}
      {auth ? (
        <View style={styles.stack}>
          {siweKeys.map(key =>
            siweFields[key] ? (
              <Text key={key} style={styles.meta}>
                {SIWE_LABELS[key]}: {siweFields[key]}
              </Text>
            ) : null,
          )}
        </View>
      ) : null}
      {risks.length > 0 ? (
        <View style={styles.stack}>
          {risks.map(row => (
            <RiskRow key={row.code} label={row.label} severity={row.severity} />
          ))}
        </View>
      ) : null}
      <Button
        role="ghost"
        label={explaining ? 'Explaining…' : 'Explain'}
        loading={explaining}
        onPress={() => {
          void onExplain();
        }}
      />
      {explainText ? <Text style={styles.explain}>{explainText}</Text> : null}
      <Button
        role="ghost"
        label={showHex ? 'Hide raw hex' : 'Raw hex'}
        onPress={() => {
          setShowHex(current => !current);
        }}
      />
      {showHex ? <Text selectable style={styles.hex}>{data ?? signHex ?? ''}</Text> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  summary: {
    ...type.headline,
  },
  meta: {
    ...type.subhead,
  },
  explain: {
    ...type.body,
  },
  hex: {
    ...type.footnote,
  },
  stack: {
    gap: 8,
  },
});
