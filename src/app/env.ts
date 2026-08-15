export function walletConnectProjectId(): string {
  return process.env.WALLETCONNECT_PROJECT_ID ?? '';
}

export function explainProvider(): string {
  return process.env.EXPLAIN_PROVIDER ?? 'mock';
}
