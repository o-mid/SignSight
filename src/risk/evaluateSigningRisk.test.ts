import { maxUint256 } from 'viem';
import { evaluateSigningRisk, WALLET_CHAIN_ID } from './evaluateSigningRisk';
import type { RiskInput, RiskRow } from './types';

const SPENDER = '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45';

function rowOf(rows: RiskRow[], code: RiskRow['code']): RiskRow {
  const row = rows.find((candidate) => candidate.code === code);
  if (row === undefined) {
    throw new Error(`missing risk row ${code}`);
  }
  return row;
}

describe('unknown_spender', () => {
  it('flags any approve spender against an empty allowlist', () => {
    const input: RiskInput = {
      method: 'eth_sendTransaction',
      chainId: WALLET_CHAIN_ID,
      decode: {
        kind: 'approve',
        spender: SPENDER,
        amount: 1n,
      },
    };

    const row = rowOf(evaluateSigningRisk(input).rows, 'unknown_spender');
    expect(row.label).toBe('Unknown spender');
    expect(row.severity).toBe('high');
  });
});

describe('infinite_approve', () => {
  it('flags approve of maxUint256 as Unlimited approval', () => {
    const input: RiskInput = {
      method: 'eth_sendTransaction',
      chainId: WALLET_CHAIN_ID,
      decode: {
        kind: 'approve',
        spender: SPENDER,
        amount: maxUint256,
      },
    };

    const row = rowOf(evaluateSigningRisk(input).rows, 'infinite_approve');
    expect(row.label).toBe('Unlimited approval');
    expect(row.severity).toBe('high');
  });
});
