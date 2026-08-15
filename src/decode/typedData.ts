import { maxUint256 } from 'viem';
import { tokenSymbol } from './tokens';

export type TypedDataView = {
  name?: string;
  verifyingContract?: string;
  chainId?: string;
  primaryType?: string;
  domain: Record<string, unknown>;
  types: Record<string, unknown>;
  message: Record<string, unknown>;
  raw: string;
  malformed: boolean;
  value?: bigint;
  spender?: string;
};

function asRecord(value: unknown): Record<string, unknown> | undefined {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return undefined;
  }
  return value as Record<string, unknown>;
}

function payloadFromParams(params: unknown): unknown {
  // WalletConnect puts the typed payload in params[1]. Sometimes it's already an object.
  if (!Array.isArray(params) || params.length < 2) {
    return undefined;
  }
  const second = params[1];
  if (typeof second === 'string') {
    try {
      return JSON.parse(second) as unknown;
    } catch {
      return undefined;
    }
  }
  return second;
}

function readString(record: Record<string, unknown>, key: string): string | undefined {
  const value = record[key];
  if (typeof value === 'string' && value.length > 0) {
    return value;
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value);
  }
  return undefined;
}

function normalizeChainId(value: string | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }
  return value.includes(':') ? value : `eip155:${value}`;
}

function readBigInt(value: unknown): bigint | undefined {
  if (typeof value === 'bigint') {
    return value;
  }
  if (typeof value === 'number' && Number.isInteger(value) && value >= 0) {
    return BigInt(value);
  }
  if (typeof value === 'string' && value.length > 0) {
    try {
      return BigInt(value);
    } catch {
      return undefined;
    }
  }
  return undefined;
}

function messageAmount(message: Record<string, unknown>): bigint | undefined {
  // Permit uses value. Some Permit2-style payloads use allowed or amount.
  return readBigInt(message.value) ?? readBigInt(message.allowed) ?? readBigInt(message.amount);
}

function messageSpender(message: Record<string, unknown>): string | undefined {
  const spender = message.spender;
  return typeof spender === 'string' ? spender : undefined;
}

export function parseTypedData(params: unknown): TypedDataView {
  const payload = payloadFromParams(params);
  const record = asRecord(payload);
  if (record === undefined) {
    return { domain: {}, types: {}, message: {}, raw: '', malformed: true };
  }

  const domain = asRecord(record.domain);
  const types = asRecord(record.types);
  const primaryType = readString(record, 'primaryType');
  const message = asRecord(record.message) ?? {};
  const name = domain ? readString(domain, 'name') : undefined;
  const verifyingContract = domain ? readString(domain, 'verifyingContract') : undefined;
  const chainId = normalizeChainId(domain ? readString(domain, 'chainId') : undefined);
  const malformed =
    domain === undefined ||
    types === undefined ||
    primaryType === undefined ||
    (primaryType !== undefined && types[primaryType] === undefined);

  let raw = '';
  try {
    raw = JSON.stringify(record, null, 2);
  } catch {
    raw = '';
  }

  return {
    name,
    verifyingContract,
    chainId,
    primaryType,
    domain: domain ?? {},
    types: types ?? {},
    message,
    raw,
    malformed,
    value: messageAmount(message),
    spender: messageSpender(message),
  };
}

export function isEip2612Permit(typed: TypedDataView): boolean {
  if (typed.malformed || typed.primaryType !== 'Permit') {
    return false;
  }
  return (
    typed.message.owner !== undefined &&
    typed.message.spender !== undefined &&
    typed.message.value !== undefined &&
    typed.message.nonce !== undefined
  );
}

export function isKnownVerifyingContract(address: string | undefined): boolean {
  if (address === undefined) {
    return false;
  }
  return tokenSymbol(address) !== undefined;
}

export function isPermitInfinite(value: bigint | undefined): boolean {
  return value === maxUint256;
}

export function typedReviewTitle(typed: TypedDataView): string {
  if (typed.malformed || typed.primaryType === undefined) {
    return 'Could not decode';
  }
  const symbol = typed.verifyingContract
    ? tokenSymbol(typed.verifyingContract)
    : undefined;
  if (isEip2612Permit(typed) && symbol) {
    return `Permit ${symbol}`;
  }
  if (symbol) {
    return `${typed.primaryType} ${symbol}`;
  }
  return typed.primaryType;
}
