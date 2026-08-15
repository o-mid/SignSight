# Screens

Home is the root. Pair, History, and Settings push. Session and Review come up as sheets. Scan is a full-screen camera with Cancel.

I did it that way because a pairing request or a signing request is a decision, not another page in a stack. If something is waiting, Home opens the sheet. You can swipe it down. The banner is still there.

| Screen | How you get there | What it's for |
| --- | --- | --- |
| Home | launch | Sessions, pending banner, Pair / History / Settings |
| Pair | push | Paste a `wc:` URI |
| Scan | full-screen over Pair | QR that starts with `wc:` |
| Session | sheet | dApp URL, `mm:ss` countdown, Approve / Reject / Disconnect |
| Review | sheet | Summary, risk rows, Explain, raw hex or JSON, Reject first |
| History | push | Local rows. Nothing leaves the phone. |
| Settings | push | Dry-run locked on. Demo signer only if `.env` has a key. |

Approve on Session dies at `00:00`. Reject and Disconnect still work. Disconnect asks first.

Review does not use the explainer sentence to enable or hide a button. Reject is first. Dry-run is the default second action. Demo sign only shows if you turned that switch on.
