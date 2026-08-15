# Schema

`signsight.schema.json` is the JSON shape of the things we persist or hand to the explainer.

TypeScript is still the source of truth. If this file and a type disagree, believe the type and fix the schema.

`$defs` in that file:

- `historyRow` / `sessionSnapshot` — AsyncStorage
- `riskRow` / `decodeResult` / `typedDataView` / `siweFields` — what Review builds
- `explainInput` / `explainOutput` — explainer port. Summary max 240 chars.
- `dryRunError` — WalletConnect response. No `result` key. That's the whole point.
- `envFile` — keys from `.env.example`. Don't commit values.

Amounts are strings in JSON. In the app they're `bigint`.
