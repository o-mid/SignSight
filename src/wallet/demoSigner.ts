import { createWalletClient, http, type Hex } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { foundry } from 'viem/chains';
import { demoSignerKey, demoSignerRpc } from '../app/env';
import { parseTypedData } from '../decode/typedData';

function asRecord(value: unknown): Record<string, unknown> | undefined {
  if (typeof value !== 'object' || value === null) {
    return undefined;
  }
  return value as Record<string, unknown>;
}

function accountFromEnv() {
  const key = demoSignerKey();
  if (!/^0x[0-9a-fA-F]{64}$/.test(key)) {
    throw new Error('Demo signer key is missing.');
  }
  return privateKeyToAccount(key as Hex);
}

function signPayloadHex(params: unknown): Hex | undefined {
  if (!Array.isArray(params)) {
    return undefined;
  }
  const first = params[0];
  if (typeof first === 'string' && first.startsWith('0x')) {
    return first as Hex;
  }
  const second = params[1];
  if (typeof second === 'string' && second.startsWith('0x')) {
    return second as Hex;
  }
  return undefined;
}

function signingTypes(
  types: Record<string, unknown>,
): Record<string, { name: string; type: string }[]> {
  const out: Record<string, { name: string; type: string }[]> = {};
  for (const [key, value] of Object.entries(types)) {
    if (key === 'EIP712Domain' || !Array.isArray(value)) {
      continue;
    }
    out[key] = value as { name: string; type: string }[];
  }
  return out;
}

function domainChainId(value: unknown): number | undefined {
  if (typeof value === 'number') {
    return value;
  }
  if (typeof value === 'string') {
    const raw = value.includes(':') ? value.split(':')[1] : value;
    const parsed = Number.parseInt(raw ?? '', 10);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
}

async function signTyped(params: unknown): Promise<Hex> {
  const typed = parseTypedData(params);
  if (typed.malformed || typed.primaryType === undefined) {
    throw new Error('Typed data is malformed.');
  }
  const account = accountFromEnv();
  return account.signTypedData({
    domain: {
      name: typed.name,
      version:
        typeof typed.domain.version === 'string' ? typed.domain.version : undefined,
      chainId: domainChainId(typed.domain.chainId),
      verifyingContract: typed.verifyingContract as Hex | undefined,
    },
    types: signingTypes(typed.types),
    primaryType: typed.primaryType,
    message: typed.message,
  });
}

async function sendLocal(params: unknown): Promise<Hex> {
  if (!Array.isArray(params) || params.length === 0) {
    throw new Error('Transaction is missing.');
  }
  const tx = asRecord(params[0]);
  if (tx === undefined) {
    throw new Error('Transaction is missing.');
  }
  const account = accountFromEnv();
  const client = createWalletClient({
    account,
    chain: foundry,
    transport: http(demoSignerRpc()),
  });
  return client.sendTransaction({
    to: typeof tx.to === 'string' ? (tx.to as Hex) : undefined,
    data: typeof tx.data === 'string' ? (tx.data as Hex) : undefined,
    value:
      typeof tx.value === 'string' || typeof tx.value === 'number' ? BigInt(tx.value) : undefined,
  });
}

export function demoSignerConfigured(): boolean {
  return /^0x[0-9a-fA-F]{64}$/.test(demoSignerKey());
}

export async function signDemoRequest(method: string, params: unknown): Promise<Hex> {
  if (method === 'personal_sign') {
    const hex = signPayloadHex(params);
    if (hex === undefined) {
      throw new Error('Sign payload is missing.');
    }
    return accountFromEnv().signMessage({ message: { raw: hex } });
  }
  if (method === 'eth_signTypedData_v4') {
    return signTyped(params);
  }
  if (method === 'eth_sendTransaction') {
    return sendLocal(params);
  }
  throw new Error('Method is not supported.');
}
