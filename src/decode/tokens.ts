// Static map on purpose. No prices, no "official Tether on Sepolia."
const symbolsByAddress: Record<string, string> = {
  '0xfff9976782d46cc05630d1f6ebab18b2324d6b14': 'WETH',
  '0x7b79995e5f793a07bc00c21412e50ecae098e7f9': 'WETH',
  // demo label only — not official Tether
  '0x7169d38820dfd117c3fa1f22a697dba58d90ba06': 'USDT',
};

export function tokenSymbol(address: string): string | undefined {
  return symbolsByAddress[address.toLowerCase()];
}
