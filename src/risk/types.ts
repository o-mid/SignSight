export type RiskCode =
  | 'infinite_approve'
  | 'chain_mismatch'
  | 'undecoded'
  | 'unknown_spender'
  | 'zero_address'
  | 'personal_sign_opaque';

export type RiskSeverity = 'high' | 'medium';

export type RiskRow = {
  code: RiskCode;
  label: string;
  severity: RiskSeverity;
};

export type RiskInput = {
  method: string;
  chainId?: string;
  decode: {
    kind: 'transfer' | 'approve' | 'undecoded';
    to?: string;
    spender?: string;
    amount?: bigint;
  };
  personalSignHex?: string;
};

export type RiskResult = {
  rows: RiskRow[];
};
