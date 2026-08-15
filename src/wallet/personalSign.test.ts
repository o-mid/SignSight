import { hexToUtf8 } from './personalSign';

describe('hexToUtf8', () => {
  it('decodes plain UTF-8 hex', () => {
    expect(hexToUtf8('0x68656c6c6f')).toBe('hello');
  });

  it('returns null for invalid UTF-8', () => {
    expect(hexToUtf8('0xff')).toBeNull();
  });
});
