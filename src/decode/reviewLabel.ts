import { tokenSymbol } from './tokens';

export function reviewTitle({
  kind,
  tokenAddress,
}: {
  kind: 'transfer' | 'approve' | 'increase_allowance' | 'decrease_allowance' | 'undecoded';
  tokenAddress?: string;
}): string {
  if (kind === 'undecoded') {
    return 'Could not decode';
  }

  const symbol = tokenAddress ? tokenSymbol(tokenAddress) : undefined;
  if (symbol && kind === 'approve') {
    return `Approve ${symbol}`;
  }
  if (symbol && kind === 'increase_allowance') {
    return `Increase ${symbol}`;
  }
  if (symbol && kind === 'decrease_allowance') {
    return `Decrease ${symbol}`;
  }
  if (symbol && kind === 'transfer') {
    return `Transfer ${symbol}`;
  }

  if (tokenAddress && tokenAddress.length >= 10) {
    return `ERC-20 ${tokenAddress.slice(0, 6)}…${tokenAddress.slice(-4)}`;
  }

  return 'Could not decode';
}
