# Architecture

```mermaid
flowchart LR
  dApp[Test dApp] -->|wc URI| Pair[Pair screen]
  Pair --> WalletKit
  WalletKit -->|session_proposal| Session[Session sheet]
  Session -->|countdown approve or reject| WalletKit
  WalletKit -->|session_request| Review[Review sheet]
  WalletKit -->|session_authenticate| Review
  Review --> Decode[src/decode]
  Review --> Tokens[src/decode/tokens.ts]
  Review --> Risk[src/risk]
  Review --> Explainer[src/explain]
  Review -->|reject or dry-run error| WalletKit
  Review --> History[Local history]
```

- Wallet side: `@reown/walletkit` + `@walletconnect/react-native-compat` (compat import is first in `index.js`).
- One chain: Sepolia. Methods: `eth_sendTransaction`, `personal_sign`, `session_authenticate`.
- Decode is viem `decodeFunctionData` on transfer/approve.
- Risk rules are local functions. The explainer is optional copy.
