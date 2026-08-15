export const WALLET_CHAIN_ID = 'eip155:11155111';

export const DEMO_ADDRESS = '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B';

export const SUPPORTED_METHODS: string[] = [
  'eth_sendTransaction',
  'personal_sign',
  'eth_signTypedData_v4',
  'session_authenticate',
];

export const SUPPORTED_EVENTS: string[] = ['accountsChanged', 'chainChanged'];
