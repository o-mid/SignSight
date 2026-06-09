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

describe('chain_mismatch', () => {
  it('flags eip155:1 as Different chain', () => {
    const input: RiskInput = {
      method: 'eth_sendTransaction',
      chainId: 'eip155:1',
      decode: { kind: 'transfer', to: SPENDER, amount: 1n },
    };

    const row = rowOf(evaluateSigningRisk(input).rows, 'chain_mismatch');
    expect(row.label).toBe('Different chain');
    expect(row.severity).toBe('high');
  });

  it('accepts 11155111 as the wallet chain', () => {
    const input: RiskInput = {
      method: 'eth_sendTransaction',
      chainId: '11155111',
      decode: { kind: 'transfer', to: SPENDER, amount: 1n },
    };

    expect(
      evaluateSigningRisk(input).rows.some((row) => row.code === 'chain_mismatch'),
    ).toBe(false);
  });
});

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
