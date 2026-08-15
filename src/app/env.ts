export function walletConnectProjectId(): string {
  return process.env.WALLETCONNECT_PROJECT_ID ?? '';
}

export function explainProvider(): string {
  return process.env.EXPLAIN_PROVIDER ?? 'mock';
}

export function demoSignerKey(): string {
  return process.env.DEMO_SIGNER_KEY ?? '';
}

export function demoSignerRpc(): string {
  return process.env.DEMO_SIGNER_RPC ?? 'http://127.0.0.1:8545';
}
