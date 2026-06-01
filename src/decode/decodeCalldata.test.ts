import { decodeErc20Calldata } from './decodeCalldata';

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

describe('decodeErc20Calldata approve', () => {
  it('decodes approve spender and amount', () => {
    expect(decodeErc20Calldata(APPROVE_1E6)).toEqual({
      kind: 'approve',
      spender: '0x2222222222222222222222222222222222222222',
      amount: 1_000_000n,
    });
  });
});
