import { privateKeyToAccount } from 'viem/accounts';
import { verifyMessage, verifyTypedData } from 'viem';
import { signDemoRequest } from './demoSigner';

const USDT = '0x7169D38820dfd117C3FA1f22a697dBA58d90BA06';
const TEST_KEY = '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';

describe('signDemoRequest', () => {
  const key = TEST_KEY;
  const account = privateKeyToAccount(key);

  beforeAll(() => {
    process.env.DEMO_SIGNER_KEY = key;
  });

  afterAll(() => {
    delete process.env.DEMO_SIGNER_KEY;
  });

  it('returns a real personal_sign signature', async () => {
    const message = '0x68656c6c6f';
    const signature = await signDemoRequest('personal_sign', [message, account.address]);
    expect(signature).toMatch(/^0x[0-9a-fA-F]{130}$/);
    await expect(
      verifyMessage({
        address: account.address,
        message: { raw: message },
        signature,
      }),
    ).resolves.toBe(true);
  });

  it('returns a real Permit signature', async () => {
    const payload = {
      types: {
        Permit: [
          { name: 'owner', type: 'address' },
          { name: 'spender', type: 'address' },
          { name: 'value', type: 'uint256' },
          { name: 'nonce', type: 'uint256' },
          { name: 'deadline', type: 'uint256' },
        ],
      },
      primaryType: 'Permit',
      domain: {
        name: 'USDT',
        version: '1',
        chainId: 11155111,
        verifyingContract: USDT,
      },
      message: {
        owner: account.address,
        spender: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
        value: 1n,
        nonce: 0n,
        deadline: 1735689600n,
      },
    };
    const signature = await signDemoRequest('eth_signTypedData_v4', [
      account.address,
      JSON.stringify({
        ...payload,
        message: {
          owner: account.address,
          spender: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
          value: '1',
          nonce: '0',
          deadline: '1735689600',
        },
      }),
    ]);
    expect(signature).toMatch(/^0x[0-9a-fA-F]{130}$/);
    await expect(
      verifyTypedData({
        ...payload,
        address: account.address,
        signature,
      }),
    ).resolves.toBe(true);
  });
});
