import { maxUint256 } from 'viem';
import {
  isKnownVerifyingContract,
  isPermitInfinite,
} from '../decode/typedData';
import type { RiskCode, RiskInput, RiskResult, RiskRow, RiskSeverity } from './types';

export const WALLET_CHAIN_ID = 'eip155:11155111';

const SPENDER_ALLOWLIST: readonly string[] = [];
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

const RISK_LABELS: Record<RiskCode, string> = {
  infinite_approve: 'Unlimited approval',
  chain_mismatch: 'Different chain',
  undecoded: 'Could not decode',
  unknown_spender: 'Unknown spender',
  zero_address: 'Zero address',
  personal_sign_opaque: 'Not plain text',
  typed_chain_mismatch: 'Typed chain mismatch',
  typed_domain_untrusted: 'Unknown verifying contract',
  permit_infinite: 'Unlimited permit',
};

const RISK_SEVERITY: Record<RiskCode, RiskSeverity> = {
  infinite_approve: 'high',
  chain_mismatch: 'high',
  undecoded: 'high',
  unknown_spender: 'high',
  zero_address: 'high',
  personal_sign_opaque: 'medium',
  typed_chain_mismatch: 'high',
  typed_domain_untrusted: 'high',
  permit_infinite: 'high',
};

function riskRow(code: RiskCode): RiskRow {
  return {
    code,
    label: RISK_LABELS[code],
    severity: RISK_SEVERITY[code],
  };
}

function normalizeChainId(chainId: string): string {
  return chainId.includes(':') ? chainId : `eip155:${chainId}`;
}

function isPlainUtf8FromHex(hex: string): boolean {
  const raw = hex.startsWith('0x') || hex.startsWith('0X') ? hex.slice(2) : hex;
  if (raw.length === 0 || raw.length % 2 !== 0) {
    return false;
  }
  if (!/^[0-9a-fA-F]+$/.test(raw)) {
    return false;
  }

  const bytes = new Uint8Array(raw.length / 2);
  for (let i = 0; i < raw.length; i += 2) {
    bytes[i / 2] = Number.parseInt(raw.slice(i, i + 2), 16);
  }

  try {
    const text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
    return text.length > 0 && !text.includes('\uFFFD');
  } catch {
    return false;
  }
}

function evaluateTypedRisk(input: RiskInput): RiskResult {
  const rows: RiskRow[] = [];
  const typed = input.typed;
  if (typed === undefined || typed.malformed) {
    rows.push(riskRow('undecoded'));
    return { rows };
  }
  if (typed.chainId !== undefined && normalizeChainId(typed.chainId) !== WALLET_CHAIN_ID) {
    rows.push(riskRow('typed_chain_mismatch'));
  }
  if (!isKnownVerifyingContract(typed.verifyingContract)) {
    rows.push(riskRow('typed_domain_untrusted'));
  }
  if (isPermitInfinite(typed.value)) {
    rows.push(riskRow('permit_infinite'));
  }
  return { rows };
}

export function evaluateSigningRisk(input: RiskInput): RiskResult {
  if (input.method === 'eth_signTypedData_v4') {
    return evaluateTypedRisk(input);
  }

  const rows: RiskRow[] = [];
  const { decode } = input;

  const allowance =
    decode.kind === 'approve' ||
    decode.kind === 'increase_allowance' ||
    decode.kind === 'decrease_allowance';

  if (allowance && decode.amount === maxUint256) {
    rows.push(riskRow('infinite_approve'));
  }

  if (
    allowance &&
    decode.spender !== undefined &&
    !SPENDER_ALLOWLIST.some(
      (allowed) => allowed.toLowerCase() === decode.spender?.toLowerCase(),
    )
  ) {
    rows.push(riskRow('unknown_spender'));
  }

  if (input.chainId !== undefined && normalizeChainId(input.chainId) !== WALLET_CHAIN_ID) {
    rows.push(riskRow('chain_mismatch'));
  }

  if (decode.kind === 'undecoded') {
    rows.push(riskRow('undecoded'));
  }

  if (decode.kind === 'transfer' && decode.to !== undefined && decode.to.toLowerCase() === ZERO_ADDRESS) {
    rows.push(riskRow('zero_address'));
  }
  if (allowance && decode.spender !== undefined && decode.spender.toLowerCase() === ZERO_ADDRESS) {
    rows.push(riskRow('zero_address'));
  }

  if (input.method === 'personal_sign' && !isPlainUtf8FromHex(input.personalSignHex ?? '')) {
    rows.push(riskRow('personal_sign_opaque'));
  }

  return { rows };
}
