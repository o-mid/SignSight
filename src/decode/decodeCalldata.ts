import { decodeFunctionData } from 'viem';
import { erc20Abi } from './erc20Abi';

export type DecodeResult = {
  kind: 'transfer' | 'approve' | 'undecoded';
  to?: `0x${string}`;
  spender?: `0x${string}`;
  amount?: bigint;
  token?: `0x${string}`;
};

export function decodeErc20Calldata(
  data: string | undefined | null,
): DecodeResult {
  if (data == null || !/^0x[0-9a-fA-F]+$/.test(data)) {
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

    return { kind: 'undecoded' };
  } catch {
    return { kind: 'undecoded' };
  }
}
