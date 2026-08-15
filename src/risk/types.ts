export type RiskCode =
  | 'infinite_approve'
  | 'chain_mismatch'
  | 'undecoded'
  | 'unknown_spender'
  | 'zero_address'
  | 'personal_sign_opaque'
  | 'typed_chain_mismatch'
  | 'typed_domain_untrusted'
  | 'permit_infinite';

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
    kind: 'transfer' | 'approve' | 'increase_allowance' | 'decrease_allowance' | 'undecoded';
    to?: string;
    spender?: string;
    amount?: bigint;
  };
  personalSignHex?: string;
  typed?: {
    name?: string;
    verifyingContract?: string;
    chainId?: string;
    primaryType?: string;
    malformed: boolean;
    value?: bigint;
    spender?: string;
  };
};

export type RiskResult = {
  rows: RiskRow[];
};
