# Threat model

SignSight reviews WalletConnect requests on the phone. It is a portfolio demo, not a custodian. I'm not holding anyone's keys and I'm not shipping mainnet.

## What we're protecting

Inbound session proposals and requests. Local review history. The WalletConnect project id — it's a public client id, but it still stays out of git.

## What I trust

Decode and risk run locally. They don't call out.

The explainer is copy. It is not a gate. If it fails or says something sloppy, the buttons still do what they did before.

Dry-run answers with a JSON-RPC error. No `result`. No fake tx hash, no fake SIWE signature, no fake typed-data signature. I'd rather the dApp show an error than I invent a success.

Demo signer is a separate, explicit switch. The key lives in `.env`. Broadcast, if it happens, goes to `DEMO_SIGNER_RPC` (local Anvil). Not Sepolia. Not mainnet.

## What a dApp can try

Unlimited ERC-20 approve → `Unlimited approval`.

A chain that isn't Sepolia → `Different chain`.

Calldata we can't read → `Could not decode`.

Any approve spender → `Unknown spender`. The allowlist is empty on purpose.

Transfer or approve to `0x000…0` → `Zero address`.

`personal_sign` that isn't plain UTF-8 → `Not plain text`.

Typed data on the wrong chain → `Typed chain mismatch`.

A verifying contract that isn't in the static token map → `Unknown verifying contract`.

Permit `value` / `allowed` at max uint → `Unlimited permit`.

SIWE missing domain or nonce → we reject it. No prompt to "fix it up."

A language-model summary that talks down risk while a high-severity row is sitting there. We drop sentences that match `safe`, `no risk`, `looks fine`, or `harmless`. The rows stay.

## Out of scope

Mainnet funds. Seed phrases. Claiming that Sepolia USDT is official Tether.
