import { decodeFunctionData } from 'viem';
import { erc20Abi } from './erc20Abi';

export type DecodeKind =
  | 'transfer'
  | 'approve'
  | 'increase_allowance'
  | 'decrease_allowance'
  | 'undecoded';

export type DecodeResult = {
  kind: DecodeKind;
  to?: `0x${string}`;
  spender?: `0x${string}`;
  amount?: bigint;
  token?: `0x${string}`;
};

export function decodeErc20Calldata(
  data: string | undefined | null,
): DecodeResult {
  if (data == null || data === '' || data === '0x') {
    return { kind: 'undecoded' };
  }

  if (!/^0x[0-9a-fA-F]+$/.test(data)) {
    return { kind: 'undecoded' };
  }

  try {
    const decoded = decodeFunctionData({
      abi: erc20Abi,
      data: data as `0x${string}`,
    });

    if (decoded.functionName === 'transfer') {
      return {
        kind: 'transfer',
        to: decoded.args[0],
        amount: decoded.args[1],
      };
    }

    if (decoded.functionName === 'approve') {
      return {
        kind: 'approve',
        spender: decoded.args[0],
        amount: decoded.args[1],
      };
    }

    if (decoded.functionName === 'increaseAllowance') {
      return {
        kind: 'increase_allowance',
        spender: decoded.args[0],
        amount: decoded.args[1],
      };
    }

    if (decoded.functionName === 'decreaseAllowance') {
      return {
        kind: 'decrease_allowance',
        spender: decoded.args[0],
        amount: decoded.args[1],
      };
    }

    // Anything we don't list is undecoded. That's a risk, not a guess.
    return { kind: 'undecoded' };
  } catch {
    return { kind: 'undecoded' };
  }
}
