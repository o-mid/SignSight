export function hexToUtf8(hex: string): string | null {
  const body = hex.startsWith('0x') || hex.startsWith('0X') ? hex.slice(2) : hex;
  if (body.length === 0 || body.length % 2 !== 0) {
    return null;
  }
  if (!/^[0-9a-fA-F]+$/.test(body)) {
    return null;
  }
  const bytes = new Uint8Array(body.length / 2);
  for (let i = 0; i < body.length; i += 2) {
    bytes[i / 2] = Number.parseInt(body.slice(i, i + 2), 16);
  }
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    return null;
  }
}
