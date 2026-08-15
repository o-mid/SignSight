export type ExplainInput = {
  decode: { kind: string };
  risks: { code: string; label: string; severity: 'high' | 'medium' }[];
  method: string;
  dappUrl: string;
};

export type ExplainOutput = {
  summary: string;
};
