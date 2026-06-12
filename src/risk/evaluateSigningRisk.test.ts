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

describe('personal_sign_opaque', () => {
  it('does not flag plain UTF-8 hex', () => {
    const input: RiskInput = {
      method: 'personal_sign',
      chainId: WALLET_CHAIN_ID,
      decode: { kind: 'undecoded' },
      personalSignHex: '0x68656c6c6f',
    };

    expect(
      evaluateSigningRisk(input).rows.some((row) => row.code === 'personal_sign_opaque'),
    ).toBe(false);
  });

  it('flags invalid UTF-8 as Not plain text', () => {
    const input: RiskInput = {
      method: 'personal_sign',
      chainId: WALLET_CHAIN_ID,
      decode: { kind: 'undecoded' },
      personalSignHex: '0xff',
    };

    const row = rowOf(evaluateSigningRisk(input).rows, 'personal_sign_opaque');
    expect(row.label).toBe('Not plain text');
    expect(row.severity).toBe('medium');
  });
});

describe('zero_address', () => {
  it('flags a transfer to the zero address', () => {
    const input: RiskInput = {
      method: 'eth_sendTransaction',
      chainId: WALLET_CHAIN_ID,
      decode: {
        kind: 'transfer',
        to: '0x0000000000000000000000000000000000000000',
        amount: 1n,
      },
    };

    const row = rowOf(evaluateSigningRisk(input).rows, 'zero_address');
    expect(row.label).toBe('Zero address');
    expect(row.severity).toBe('high');
  });
});

describe('undecoded', () => {
  it('flags undecoded calldata as Could not decode', () => {
    const input: RiskInput = {
      method: 'eth_sendTransaction',
      chainId: WALLET_CHAIN_ID,
      decode: { kind: 'undecoded' },
    };

    const row = rowOf(evaluateSigningRisk(input).rows, 'undecoded');
    expect(row.label).toBe('Could not decode');
    expect(row.severity).toBe('high');
  });
});

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
