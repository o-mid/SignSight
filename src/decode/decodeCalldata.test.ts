import { encodeFunctionData } from 'viem';
import { decodeErc20Calldata } from './decodeCalldata';
import { erc20Abi } from './erc20Abi';

const TRANSFER_1E6 =
  '0xa9059cbb000000000000000000000000111111111111111111111111111111111111111100000000000000000000000000000000000000000000000000000000000f4240';

const APPROVE_1E6 =
  '0x095ea7b3000000000000000000000000222222222222222222222222222222222222222200000000000000000000000000000000000000000000000000000000000f4240';

describe('decodeErc20Calldata transfer', () => {
  it('decodes transfer to and amount', () => {
    expect(decodeErc20Calldata(TRANSFER_1E6)).toEqual({
      kind: 'transfer',
      to: '0x1111111111111111111111111111111111111111',
      amount: 1_000_000n,
    });
  });
});

describe('decodeErc20Calldata empty data', () => {
  it('returns undecoded for empty string, 0x, null, and undefined', () => {
    expect(decodeErc20Calldata('')).toEqual({ kind: 'undecoded' });
    expect(decodeErc20Calldata('0x')).toEqual({ kind: 'undecoded' });
    expect(decodeErc20Calldata(null)).toEqual({ kind: 'undecoded' });
    expect(decodeErc20Calldata(undefined)).toEqual({ kind: 'undecoded' });
  });
});

describe('decodeErc20Calldata allowance', () => {
  it('decodes increaseAllowance and decreaseAllowance', () => {
    const spender = '0x2222222222222222222222222222222222222222';
    const increase = encodeFunctionData({
      abi: erc20Abi,
      functionName: 'increaseAllowance',
      args: [spender, 1_000_000n],
    });
    const decrease = encodeFunctionData({
      abi: erc20Abi,
      functionName: 'decreaseAllowance',
      args: [spender, 5n],
    });
    expect(decodeErc20Calldata(increase)).toEqual({
      kind: 'increase_allowance',
      spender,
      amount: 1_000_000n,
    });
    expect(decodeErc20Calldata(decrease)).toEqual({
      kind: 'decrease_allowance',
      spender,
      amount: 5n,
    });
  });
});

describe('decodeErc20Calldata approve', () => {
  it('decodes approve spender and amount', () => {
    expect(decodeErc20Calldata(APPROVE_1E6)).toEqual({
      kind: 'approve',
      spender: '0x2222222222222222222222222222222222222222',
      amount: 1_000_000n,
    });
  });
});
