# wedin.ai — Cost Register
## Updated May 24, 2026

Single source of truth for all third-party service costs. Update this file whenever a service is added, removed, or changes pricing tier. Cross-reference with `wedin-finance-master-brief.md` for unit economics.

---

## Section A — Infrastructure

| # | Category | Service | Plan | Monthly Cost | Notes | Purpose | Upgrade path | URL / Login |
|---|----------|---------|------|-------------|-------|---------|-------------|-------------|
| 1 | Hosting | Netlify | Pro ($19/mo) | ~R342 | Covers app hosting + Netlify Functions. Free tier hits limits at ~125k function invocations/mo | Hosts React app, runs all serverless functions | Upgrade to Business ($99/mo) if functions exceed Pro limits post-scale | app.netlify.com — team: wedinai |
| 2 | Database | Supabase | Free tier → Pro ($25/mo) | R0 → ~R450 | Free tier adequate to ~500 active sessions. Monitor row count and bandwidth monthly | Session persistence, email deduplication, rate limiting, GTM data store | Upgrade to Pro at ~500 concurrent active sessions | supabase.com → project kzqubbioodvlwfobrqdv |
| 3 | Domain | GoDaddy (registrar) / Netlify DNS | Annual | ~R250/yr (~R21/mo) | DNS managed at Netlify, not GoDaddy. Renew annually at GoDaddy. Do not let this lapse. | wedin.ai domain registration and DNS routing | No upgrade needed | GoDaddy — wedin.ai |
| 4 | Email | Resend | Free tier (3,000 sends/mo) → Pro ($20/mo) | R0 → ~R360 | Free tier adequate to ~2,500 couples/mo. Monitor send volume monthly | Portrait emails, restore links, remarketing, brief emails | Upgrade to Pro when monthly sends approach 2,500 | resend.com — rnerwich@gmail.com |
| 5 | Analytics | Google Analytics 4 | Free | R0 | — | Landing page traffic, source attribution, realtime visitor data | Upgrade not required at current scale | analytics.google.com — property Wedin (538622529), account rnerwich@gmail.com |

---

## Section B — AI / Intelligence

| # | Category | Service | Pricing model | Estimated monthly cost | Purpose | Notes |
|---|----------|---------|--------------|----------------------|---------|-------|
| 1 | AI generation | Anthropic Claude API | Pay per token — Sonnet: $3/MTok input, $15/MTok output. Haiku: ~$0.25/$1.25 per MTok | Variable — see unit economics in wedin-finance-master-brief.md | All AI generation: portrait, MIL-A/B, brief-A/B, ceremony summary, budget, Spotify tracks | Largest variable cost per transaction (~R31 per couple at current depth). Monitor via Anthropic console monthly |
| 2 | Music | Spotify API | Free (rate-limited) | R0 | Playlist creation, song lookup | No cost at current scale. Rate limit applies — wedin.ai Spotify account hosts all playlists |

---

## Section C — Payments

| # | Category | Service | Fee structure | Impact per transaction | Notes |
|---|----------|---------|--------------|----------------------|-------|
| 1 | Payment gateway | PayFast | 2.9% + R1 per card transaction. EFT: 1.5% + R0. SnapScan/Zapper: 2% | ~R21.29 on R699 card payment | Live as of May 20, 2026. Dashboard: merchants.payfast.co.za |

---

## Section D — Communication & Operations

| # | Category | Service | Plan | Monthly Cost | Notes |
|---|----------|---------|------|-------------|-------|
| 1 | Internal comms | Google Workspace | Business Starter | ~R150–R300/mo | hello@wedin.ai, Drive, Docs |

---

## Total Fixed Monthly Cost (current)

| Item | Cost |
|------|------|
| Netlify Pro | ~R342 |
| Supabase (free tier) | R0 |
| Domain (amortised) | ~R21 |
| Resend (free tier) | R0 |
| GA4 | R0 |
| Google Workspace | ~R150–R300 |
| **Total fixed** | **~R513–R663/mo** |

Variable cost per paying couple: ~R31 (Claude API + payment fees). See `wedin-finance-master-brief.md` for full unit economics.

---

## Upgrade Triggers

| Service | Trigger | Action |
|---------|---------|--------|
| Supabase | ~500 active sessions | Upgrade to Pro (~R450/mo) |
| Resend | ~2,500 sends/month | Upgrade to Pro (~R360/mo) |
| Netlify | >125k function invocations/month | Upgrade to Business (~R1,800/mo) |
| GA4 | N/A | Free tier has no meaningful ceiling at current scale |
