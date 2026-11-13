# Backend adapter

One switch decides what the UI talks to: `NEXT_PUBLIC_BACKEND=aws` (default, unchanged behaviour) or `standby`
(the `iqos-standby` service on Railway + Postgres + Backblaze B2). See `.env.example`.

| File | Role |
|---|---|
| `config.js` | Mode flag, endpoint list, API keys, which endpoints the standby serves |
| `index.js` | **Import `Auth`, `Storage`, `Amplify`, `s3Url` from here**, never from `aws-amplify` |
| `standby.js` | Cognito/S3-compatible `Auth` and `Storage` over the standby `/auth/*` and `/storage/*` routes |
| `files.js` | `s3Url(bucket, key, region?)` / `s3UrlFromPath("bucket/key")` for stored files |
| `links.aws.js` / `links.standby.js` | Apollo link chains; `Utilities/ApolloWrapper.js` picks one |

Rules for new code
- Need a file URL? `s3Url(file.bucket, file.key)`. Never hard-code `amazonaws.com`.
- Need auth or upload? Import from `Utilities/Backend`.
- Standby serves only `warehouse`, `managerAccess`, `order`, `deliveryTracking`. Other `clientName`s (retail, glife, store, crm, external, zyn) return a clear "not available in standby mode" error.
