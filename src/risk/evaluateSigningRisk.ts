import { maxUint256 } from 'viem';
import type { RiskCode, RiskInput, RiskResult, RiskRow, RiskSeverity } from './types';

export const WALLET_CHAIN_ID = 'eip155:11155111';

const SPENDER_ALLOWLIST: readonly string[] = [];

const RISK_LABELS: Record<RiskCode, string> = {
  infinite_approve: 'Unlimited approval',
  chain_mismatch: 'Different chain',
  undecoded: 'Could not decode',
  unknown_spender: 'Unknown spender',
  zero_address: 'Zero address',
  personal_sign_opaque: 'Not plain text',
};

const RISK_SEVERITY: Record<RiskCode, RiskSeverity> = {
  infinite_approve: 'high',
  chain_mismatch: 'high',
  undecoded: 'high',
  unknown_spender: 'high',
  zero_address: 'high',
  personal_sign_opaque: 'medium',
};

function riskRow(code: RiskCode): RiskRow {
  return {
    code,
    label: RISK_LABELS[code],
    severity: RISK_SEVERITY[code],
  };
}

export function evaluateSigningRisk(input: RiskInput): RiskResult {
  const rows: RiskRow[] = [];
  const { decode } = input;

  if (decode.kind === 'approve' && decode.amount === maxUint256) {
    rows.push(riskRow('infinite_approve'));
  }

  if (
    decode.kind === 'approve' &&
    decode.spender !== undefined &&
    !SPENDER_ALLOWLIST.some(
      (allowed) => allowed.toLowerCase() === decode.spender?.toLowerCase(),
    )
  ) {
    rows.push(riskRow('unknown_spender'));
  }

  return { rows };
}
