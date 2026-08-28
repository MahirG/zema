# Zema

**Your music, everywhere. Royalties, home.**

Zema is the music distribution and royalty monetization rail for Ethiopian and African artists. It is built by Hisab Technologies in Addis Ababa and covers the complete demo journey from release creation to DSP delivery, royalty matching, contributor allocation, and ETB payout.

This repository contains a production-structured Next.js 15 rebuild of the original single-file demo. The original `zema-app-1.html` and all four product/domain PDFs remain in the repository as source-of-truth artifacts.

## What is included

- English-first launch interface with the complete bilingual English/Amharic copy preserved in source
- Responsive artist app with desktop navigation and a mobile bottom tab bar/FAB
- Demo login and signup
- Live dashboard statistics and earnings-by-platform visualization
- Music catalog and release detail, including ISRC/UPC, splits, and DSP status
- Four-step release wizard: Details → Tracks → Splits → Review & validation
- Statement import matched by ISRC and exact royalty allocation
- USD wallet, live ETB FX preview, and Telebirr/Chapa/CBE Birr/bank payouts
- Profile, payout-method, language, and demo-reset settings
- SEO metadata, Open Graph image, manifest, sitemap, loading/error states, and security headers

## Domain guarantees

The client-side engine in `lib/domain` is deliberately independent of React and Zustand so it can move behind a future NestJS API without rewriting product rules.

- Money is stored as integer minor units only—USD cents and ETB santim.
- Track splits support four decimal places and must equal exactly 100.0000% at submission.
- Largest-remainder allocation is deterministic and never loses a cent, including negative clawbacks.
- Report replay is idempotent by external report key.
- Ledger sources are unique and append-only.
- Royalties accrue in USD; FX is applied and recorded only when a payout is created.
- A payout reserves its USD balance on creation. Failed payouts receive one explicit refund credit.
- Defaults from the source schema are preserved: $10 minimum payout, 45-day hold, 1,500 ETB release fee, and 158.5 Br/USD demo FX.

## Local setup

Requirements: Node.js 22 LTS and npm.

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Open the local address printed by Next.js. The pre-filled demo account is:

```text
Email: abel@demo.et
Password: any value with 6+ characters
```

The application persists demo state in browser `localStorage` under `zema-domain-v1`. Use **Settings → Reset demo** to restore Abel Bekele, the live “Tizita” release, 60/25/15 splits, seeded earnings, and the May 2026 statement.

### Interface language launch flag

The temporary launch hides the Amharic language switch and resolves old persisted language preferences to English. All Amharic product copy remains preserved. Set `INTERFACE_LANGUAGE_SWITCH_ENABLED` in `lib/config/interface.ts` to `true` when the bilingual interface is ready to return.

## Quality checks

```bash
npm run typecheck
npm run lint
npm test
npm run build
npm run smoke
```

Or run the full gate:

```bash
npm run check
```

The Vitest suite covers exact-cent allocation, deterministic ties, negative clawbacks, report idempotency, ledger reservation/refund behavior, payout minimums, and release validation.

## Routes

| Route | Screen |
| --- | --- |
| `/` | Marketing landing page |
| `/pricing` | Early-access pricing |
| `/login`, `/signup` | Demo authentication |
| `/app` | Dashboard |
| `/app/music` | My Music catalog |
| `/app/release/new` | New Release wizard |
| `/app/release/[id]` | Release detail |
| `/app/royalties` | Statements and matched royalty lines |
| `/app/wallet` | Balance, withdrawal, and payout history |
| `/app/settings` | Profile, payout, language, and demo controls |

Legacy hashes such as `#/app/music` are translated to their path-based equivalents on first load.

## Project structure

```text
app/                 Next.js App Router routes, metadata, and route states
components/          Marketing, app-shell, screen, and reusable UI components
lib/content/         Preserved bilingual product copy
lib/domain/          Framework-independent models, rules, engine, seed, and tests
lib/store/           Versioned Zustand persistence adapter
public/              Zema mark and visual texture
scripts/             Local preview compatibility wrapper
```

## Deploy

### Vercel

1. Import the GitHub repository into Vercel.
2. Keep the detected framework preset as **Next.js**.
3. Optionally set `NEXT_PUBLIC_SITE_URL` to the production origin. Blank,
   missing, or malformed values are ignored safely; Zema then uses Vercel's
   production/deployment URL and finally `https://zema.hisab.et` as a fallback.
4. Deploy. No database or secrets are required for the current browser-demo build.

### Other Node hosts

```bash
npm ci
npm run build
npm start
```

Set `NEXT_PUBLIC_SITE_URL` before building so canonical, Open Graph, sitemap,
and robots URLs use the preferred origin. The variable is optional and is
validated before use.

## Future backend boundary

The current Zustand store is an adapter around pure domain functions. A NestJS migration can expose the same commands—submit release, advance delivery, import report, and request/fail payout—while retaining the model and invariant tests. Production work should add authenticated server sessions, object storage, transactional PostgreSQL writes, provider webhooks, reconciliation, KYC/compliance, real DSP delivery, and audited FX sources.

## Source-of-truth documents

- `distribution-royalty-mvp-PRD (1).pdf`
- `distribution-royalty-schema.pdf`
- `royalty-money-engine.pdf`
- `validation-rules.pdf`
- `zema-app-1.html` (legacy single-file implementation)
