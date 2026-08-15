import { explainRequest } from './explainRequest';
import type { Explainer } from './port';
import type { ExplainInput } from './types';

const input: ExplainInput = {
  decode: { kind: 'approve' },
  risks: [
    {
      code: 'infinite_approve',
      label: 'Unlimited approval',
      severity: 'high',
    },
  ],
  method: 'eth_sendTransaction',
  dappUrl: 'https://example.invalid',
};

describe('explainRequest', () => {
  it('does not call infinite approve safe', async () => {
    const result = await explainRequest(input);
    expect(result.summary).not.toMatch(/safe|no risk|looks fine|harmless/i);
  });

  it('drops a summary that says looks fine when severity is high', async () => {
    const fake: Explainer = async () => ({ summary: 'This looks fine' });
    const result = await explainRequest(input, fake);
    expect(result.summary).toBe('Could not explain');
  });

  it('drops a safe line on unlimited permit', async () => {
    const permit: ExplainInput = {
      decode: { kind: 'undecoded' },
      risks: [{ code: 'permit_infinite', label: 'Unlimited permit', severity: 'high' }],
      method: 'eth_signTypedData_v4',
      dappUrl: 'https://example.invalid',
    };
    const fake: Explainer = async () => ({ summary: 'This is safe' });
    const result = await explainRequest(permit, fake);
    expect(result.summary).toBe('Could not explain');
  });
});
