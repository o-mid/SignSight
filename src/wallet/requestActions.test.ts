import { completeDryRun, dryRunError } from './requestActions';
import { getWalletKit } from './walletKit';

jest.mock('@walletconnect/react-native-compat', () => ({}));
jest.mock('@walletconnect/core', () => ({
  Core: function Core() {
    return {};
  },
}));
jest.mock('@reown/walletkit', () => ({
  WalletKit: { init: jest.fn() },
}));
jest.mock('./walletKit', () => ({
  getWalletKit: jest.fn(),
}));

const TX_HASH_PATTERN = /0x[0-9a-fA-F]{64}/;

describe('completeDryRun', () => {
  it('responds with an error object and no transaction hash', async () => {
    const payload = dryRunError(7);
    expect(payload).toEqual({
      id: 7,
      jsonrpc: '2.0',
      error: {
        code: 5000,
        message: 'Dry-run only. No transaction was sent.',
      },
    });
    expect(payload).not.toHaveProperty('result');
    expect(JSON.stringify(payload)).not.toMatch(TX_HASH_PATTERN);

    const respondSessionRequest = jest.fn().mockResolvedValue(undefined);
    (getWalletKit as jest.Mock).mockReturnValue({ respondSessionRequest });

    await completeDryRun({ topic: 'topic-1', id: 7 });

    expect(respondSessionRequest).toHaveBeenCalledTimes(1);
    const arg = respondSessionRequest.mock.calls[0][0] as {
      topic: string;
      response: typeof payload;
    };
    expect(arg.topic).toBe('topic-1');
    expect(arg.response).toEqual(payload);
    expect(arg.response).not.toHaveProperty('result');
    expect(JSON.stringify(arg.response)).not.toMatch(TX_HASH_PATTERN);
  });
});
