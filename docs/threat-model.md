# Threat model

SignSight is a portfolio demo wallet. It reviews WalletConnect requests on device. It is not a custodial product.

## Assets

- Inbound WalletConnect session proposals and requests
- Local history of reviews
- WalletConnect project id (public client id, still kept out of git)

## Trust

- Decode and risk rules run locally. They do not call a network.
- The explainer is copy only. It is not a gate. Buttons ignore its summary.
- Dry-run never broadcasts and never returns a fake transaction hash or SIWE signature.

## Threats

- A dApp can request an unlimited ERC-20 approve. The wallet flags `Unlimited approval`.
- A dApp can point at a different chain. The wallet flags `Different chain`.
- Calldata that is not transfer/approve is `Could not decode`.
- Any approve spender is `Unknown spender` (empty allowlist).
- Transfer/approve to `0x000…0` is `Zero address`.
- `personal_sign` that is not plain UTF-8 is `Not plain text`.
- Malformed SIWE (missing domain or nonce) is rejected.
- A language-model summary can downplay risk. High-severity rows drop summaries that match `safe`, `no risk`, `looks fine`, or `harmless`. Risk rows stay on screen.

## Out of scope

Mainnet funds, seed phrases, EIP-712, real broadcast, official Tether claims.
