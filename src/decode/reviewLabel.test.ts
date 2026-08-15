import { reviewTitle } from './reviewLabel';
import { tokenSymbol } from './tokens';

const wethA = '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14';
const wethB = '0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9';
const usdt = '0x7169D38820dfd117C3FA1f22a697dBA58d90BA06';
const unmapped = '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd';

describe('tokenSymbol', () => {
  it('maps both WETH addresses and USDT, case-insensitive', () => {
    expect(tokenSymbol(wethA)).toBe('WETH');
    expect(tokenSymbol(wethB)).toBe('WETH');
    expect(tokenSymbol(usdt)).toBe('USDT');
    expect(tokenSymbol(wethA.toLowerCase())).toBe('WETH');
    expect(tokenSymbol(usdt.toUpperCase())).toBe('USDT');
    expect(tokenSymbol(unmapped)).toBeUndefined();
  });
});

describe('reviewTitle', () => {
  it('uses Approve USDT and Transfer WETH for mapped tokens', () => {
    expect(reviewTitle({ kind: 'approve', tokenAddress: usdt })).toBe('Approve USDT');
    expect(reviewTitle({ kind: 'transfer', tokenAddress: wethA })).toBe('Transfer WETH');
    expect(reviewTitle({ kind: 'approve', tokenAddress: wethB })).toBe('Approve WETH');
    expect(reviewTitle({ kind: 'increase_allowance', tokenAddress: usdt })).toBe('Increase USDT');
    expect(reviewTitle({ kind: 'decrease_allowance', tokenAddress: usdt })).toBe('Decrease USDT');
  });

  it('shortens unmapped token addresses', () => {
    expect(reviewTitle({ kind: 'approve', tokenAddress: unmapped })).toBe(
      'ERC-20 0xabcd…abcd',
    );
  });
});
