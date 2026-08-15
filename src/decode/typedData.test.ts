import { maxUint256 } from 'viem';
import {
  isEip2612Permit,
  parseTypedData,
  typedReviewTitle,
} from './typedData';
import { evaluateSigningRisk } from '../risk/evaluateSigningRisk';

const USDT = '0x7169D38820dfd117C3FA1f22a697dBA58d90BA06';
const UNKNOWN = '0x1111111111111111111111111111111111111111';
const SPENDER = '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45';
const OWNER = '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B';

function permitTypes() {
  return {
    EIP712Domain: [
      { name: 'name', type: 'string' },
      { name: 'version', type: 'string' },
      { name: 'chainId', type: 'uint256' },
      { name: 'verifyingContract', type: 'address' },
    ],
    Permit: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'nonce', type: 'uint256' },
      { name: 'deadline', type: 'uint256' },
    ],
  };
}

function permitPayload(overrides: {
  chainId?: number | string;
  verifyingContract?: string;
  value?: string;
  types?: Record<string, unknown>;
  primaryType?: string;
}): Record<string, unknown> {
  return {
    types: overrides.types ?? permitTypes(),
    primaryType: overrides.primaryType ?? 'Permit',
    domain: {
      name: 'USDT',
      version: '1',
      chainId: overrides.chainId ?? 11155111,
      verifyingContract: overrides.verifyingContract ?? USDT,
    },
    message: {
      owner: OWNER,
      spender: SPENDER,
      value: overrides.value ?? '1',
      nonce: '0',
      deadline: '1735689600',
    },
  };
}

function paramsOf(payload: unknown): unknown[] {
  return [OWNER, JSON.stringify(payload)];
}

const fixtures: {
  name: string;
  params: unknown;
  title: string;
  codes: string[];
}[] = [
  {
    name: 'happy Permit',
    params: paramsOf(permitPayload({})),
    title: 'Permit USDT',
    codes: [],
  },
  {
    name: 'wrong chainId',
    params: paramsOf(permitPayload({ chainId: 1 })),
    title: 'Permit USDT',
    codes: ['typed_chain_mismatch'],
  },
  {
    name: 'unknown verifyingContract',
    params: paramsOf(permitPayload({ verifyingContract: UNKNOWN })),
    title: 'Permit',
    codes: ['typed_domain_untrusted'],
  },
  {
    name: 'malformed types',
    params: paramsOf({
      primaryType: 'Permit',
      domain: { name: 'USDT', chainId: 11155111, verifyingContract: USDT },
      message: { value: '1' },
    }),
    title: 'Could not decode',
    codes: ['undecoded'],
  },
];

describe('eth_signTypedData_v4 fixtures', () => {
  it.each(fixtures)('$name', ({ params, title, codes }) => {
    const typed = parseTypedData(params);
    expect(typedReviewTitle(typed)).toBe(title);
    const rows = evaluateSigningRisk({
      method: 'eth_signTypedData_v4',
      chainId: 'eip155:11155111',
      decode: { kind: 'undecoded' },
      typed,
    }).rows;
    expect(rows.map(row => row.code)).toEqual(codes);
  });
});

describe('parseTypedData', () => {
  it('reads an object payload and permit fields', () => {
    const typed = parseTypedData([OWNER, permitPayload({})]);
    expect(typed.malformed).toBe(false);
    expect(typed.name).toBe('USDT');
    expect(typed.verifyingContract).toBe(USDT);
    expect(typed.chainId).toBe('eip155:11155111');
    expect(typed.primaryType).toBe('Permit');
    expect(typed.value).toBe(1n);
    expect(typed.spender).toBe(SPENDER);
    expect(isEip2612Permit(typed)).toBe(true);
  });

  it('flags max uint value as unlimited permit', () => {
    const typed = parseTypedData(paramsOf(permitPayload({ value: maxUint256.toString() })));
    const rows = evaluateSigningRisk({
      method: 'eth_signTypedData_v4',
      chainId: 'eip155:11155111',
      decode: { kind: 'undecoded' },
      typed,
    }).rows;
    expect(rows.map(row => row.code)).toContain('permit_infinite');
    expect(rows.find(row => row.code === 'permit_infinite')?.label).toBe('Unlimited permit');
  });
});
