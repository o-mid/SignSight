# Demo path

Sepolia only (`eip155:11155111`). Use a test dApp that can pair over WalletConnect.

1. Put `WALLETCONNECT_PROJECT_ID` in local `.env`. Leave `EXPLAIN_PROVIDER=mock`.
2. Run the app. Pair. Paste a `wc:` URI or scan the QR.
3. Session sheet: read the dApp URL and the `mm:ss` countdown. Approve before `00:00`, or wait and confirm Approve is disabled. Reject still works. Disconnect asks first.
4. From the dApp, send an infinite USDT approve to `0x7169D38820dfd117C3FA1f22a697dBA58d90BA06`. Demo label only. Not official Tether.
5. Review should say `Approve USDT` and `Unlimited approval`.
6. Tap Explain. The mock sentence must not cover the risk rows.
7. Reject. History should show the row.
8. Send `eth_signTypedData_v4` Permit for the same USDT address. You should see `Permit USDT`, plus name, verifying contract, chain, and primary type. Open Raw JSON. Reject. Dry-run must not hand the dApp a signature.
9. Optional: `DEMO_SIGNER_KEY` in `.env`, Demo signer on, local Anvil only. Don't put a mainnet key in there.
