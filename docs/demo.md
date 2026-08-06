# Demo path

Sepolia only (`eip155:11155111`). Use a test dApp that can pair over WalletConnect.

1. Set `WALLETCONNECT_PROJECT_ID` in local `.env`. Leave `EXPLAIN_PROVIDER=mock`.
2. Run the app. Open Pair. Paste a `wc:` URI or scan the QR.
3. On Session, read the dApp URL and the `mm:ss` countdown. Approve before `00:00`, or wait and confirm Approve is disabled. Reject and Disconnect still work.
4. From the dApp, send an infinite USDT approve to `0x7169D38820dfd117C3FA1f22a697dBA58d90BA06` (demo label only, not official Tether).
5. Review shows `Approve USDT` and `Unlimited approval`.
6. Tap Explain (mock). The summary must not hide the risk rows.
7. Tap Reject. Open History and confirm the rejected row.
