# wedin.ai — Infrastructure & Hosting Reference
## Updated May 20, 2026

Load this document when making any changes to hosting, DNS, email, or domain configuration. All decisions and current state recorded here.

---

## Overview — Two Separate Products, Two Separate Hosts

| Product | URL | Host | Purpose |
|---------|-----|------|---------|
| Landing page | wedin.ai | chimerical-melomakarona-962b6c.netlify.app | Marketing, CTAs, AEO guides |
| App | app.wedin.ai | wedin-ai-app.netlify.app | The product itself |

These are independent deployments. DNS for both routes through Netlify DNS (NS1 nameservers), even though the domain is registered at GoDaddy.

---

## ⚠️ Critical Architecture Warning — Two Repos, Two Sites

This project has two completely separate GitHub repos and two separate Netlify sites. This caused significant confusion during the May 10 2026 session. Read this before touching any file related to wedin.ai or app.wedin.ai.

| Site | GitHub Repo | Netlify Site | Serves |
|------|-------------|--------------|--------|
| Landing page | wedinai/wedin-landing | chimerical-melomakarona-962b6c | wedin.ai |
| React app | wedinai/wedin-ai | wedin-ai-app | app.wedin.ai |

**Rules that must never be broken:**

- Any file that needs to be accessible at `wedin.ai/filename` belongs in the **wedinai/wedin-landing** repo — not in wedinai/wedin-ai.
- Any file that needs to be accessible at `app.wedin.ai/filename` belongs in **wedinai/wedin-ai** in the `public/` folder (Vite copies it to `dist/` on build).
- The `wedin-landing/` folder inside wedinai/wedin-ai is gitignored and serves nothing. Do not put files there expecting them to appear anywhere.
- The Netlify CLI is linked to wedinai/wedin-ai (the React app). If you need to deploy the landing page, push to wedinai/wedin-landing on GitHub and Netlify picks it up automatically.
- Never trigger a local CLI deploy. Always deploy via git push to the correct repo.

**How to diagnose a 404 on wedin.ai:**
1. Check wedinai/wedin-landing repo — is the file there?
2. If yes, check Netlify site chimerical-melomakarona-962b6c — did it deploy?
3. If no, add the file to wedinai/wedin-landing and push to main.

**How to diagnose a 404 on app.wedin.ai:**
1. Check wedinai/wedin-ai repo — is the file in `public/`?
2. If yes, check Netlify site wedin-ai-app — did the build complete?
3. If no, add the file to `public/` in wedinai/wedin-ai and push to main.

---

## Domain Registration

**Registrar:** GoDaddy
**Domain:** wedin.ai
**Important:** DNS is NOT managed at GoDaddy. GoDaddy is the registrar only — the nameservers point to Netlify (NS1). Do not add DNS records in GoDaddy — they will have no effect.

---

## DNS Management

**Provider:** Netlify DNS (NS1)
**Managed at:** app.netlify.com → Teams → wedinai → DNS → wedin.ai

**Current DNS records (as of April 30, 2026):**

| Type | Name | Value | TTL | Purpose |
|------|------|-------|-----|---------|
| CNAME | app.wedin.ai | wedin-ai-app.netlify.app | 3600 | Routes app subdomain to Netlify app |
| NETLIFY | wedin.ai | chimerical-melomakarona-962b6c.netlify.app | 3600 | Landing page root domain |
| NETLIFY | www.wedin.ai | chimerical-melomakarona-962b6c.netlify.app | 3600 | Landing page www |
| TXT | resend._domainkey | p=MIGfMA0GCSqG… (full DKIM key in Resend) | Auto | Resend email DKIM verification |
| MX | send | feedback-smtp….amazonses.com | Auto | Resend email SPF — MX |
| TXT | send | v=spf1 include:…nses.com ~all | Auto | Resend email SPF — TXT |
| TXT | _dmarc | v=DMARC1; p=none; | Auto | DMARC (optional) |

**Note:** Full DKIM and SPF values are truncated above. View the complete values in Resend → Domains → wedin.ai → Records.

---

## App Hosting

**Platform:** Netlify
**Team:** wedinai
**Current app URL:** https://app.wedin.ai ✓ LIVE
**Build:** React + Vite, deployed via GitHub
**Functions:** Netlify serverless functions (netlify/functions/)

---

## Email — Resend

**Provider:** Resend
**Account:** rnerwich@gmail.com
**Sending domain:** wedin.ai
**From address used across all functions:** hello@wedin.ai
**Region:** Ireland (eu-west-1)
**Status as of April 30, 2026:** Verified ✓

**DNS verified:** April 30, 2026 — all three records (DKIM, SPF MX, SPF TXT) added to Netlify DNS and verified in Resend.

**Email functions:**

| Function | Trigger | Recipient |
|----------|---------|-----------|
| send-wedding-soundtrack.js | Email button on WeddingSoundtrackScreen | Couple |
| send-music-plan.js | Email button on BriefScreen — Music Plan tab | Couple |
| send-coordinator-brief.js | Send button on BriefScreen — Coordinator Brief tab | Coordinator (couple inputs address) |
| save-contact.js | Email capture on portrait screen | Internal — saves to Supabase |
| send-remarketing.js | Automated — 48hr and 7-day touches | Couple |

**If email stops working:** Go to Resend → Domains → wedin.ai. If status shows Failed, the DNS records need to be re-added or re-verified in Netlify DNS. The function logs will show a 403 error if Resend is rejecting sends.

---

## Payment — PayFast

**Provider:** PayFast (DPO Group)
**Status:** Live ✓ — May 20, 2026
**Account:** Wedin (Pty) Ltd merchant account
**Dashboard:** merchants.payfast.co.za
**Amount:** R699.00 one-time fee

**How payments work:**
1. Frontend calls `/.netlify/functions/create-checkout-session` with the Supabase `session_id`
2. Function returns signed form fields + PayFast URL
3. Frontend builds a hidden HTML form and POSTs directly to PayFast
4. After payment, PayFast redirects couple to `https://app.wedin.ai/payment-success`
5. App detects `/payment-success` path, enters polling state
6. PayFast fires ITN (server-to-server) to `/.netlify/functions/verify-payment`
7. `verify-payment.js` verifies signature, writes `is_paid: true` to Supabase
8. Frontend polling (`check-payment.js`) detects `isPaid: true`, shows confirmation, unlocks Moment Map

**Netlify functions:**

| Function | Role |
|----------|------|
| `create-checkout-session.js` | Generates MD5-signed PayFast form fields server-side |
| `verify-payment.js` | PayFast ITN handler — server-to-server only, never called by browser |
| `check-payment.js` | Frontend polling endpoint — returns `{ isPaid: boolean }` |

**Signature implementation — critical, do not change:**
Uses the exact official PayFast Node.js SDK method:
```js
encodeURIComponent(value.trim()).replace(/%20/g, '+')
```
Parameters must be in documented order (not alphabetical): `merchant_id`, `merchant_key`, `return_url`, `cancel_url`, `notify_url`, `m_payment_id`, `amount`, `item_name`. Passphrase appended as `&passphrase=encodedValue`. MD5 of full string.

**Return URL:** `https://app.wedin.ai/payment-success` — clean path, no query string. The Netlify catch-all redirect serves `index.html` for this path and App.jsx detects `window.location.pathname === '/payment-success'`.

**Sandbox vs live toggle:** `PAYFAST_SANDBOX=true` in Netlify env → routes to `sandbox.payfast.co.za`. Remove or set `false` for production. Currently set to `false` — live.

**If a payment is not unlocking:**
1. Check `verify-payment` function logs in Netlify — did the ITN arrive?
2. If no ITN: PayFast may be having trouble reaching the notify URL. Check PayFast dashboard → Transaction history → ITN log.
3. If ITN arrived but `is_paid` not updated: check Supabase sessions table for the `m_payment_id` (= `session_id`). Check function logs for Supabase errors.
4. If `is_paid` is true but Moment Map still locked: couple's `check-payment` polling may have timed out (max 10 attempts). Advise them to reload — the `isPaid` flag will be picked up from Supabase on restore.

---

## Database

**Provider:** Supabase
**Project ID:** kzqubbioodvlwfobrqdv (this is the live app project — always use this one)
**Used for:** Session persistence, email deduplication, remarketing sequence, rate limiting
**Environment variables:** `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (frontend read-only), `SUPABASE_SERVICE_ROLE_KEY` (all Netlify functions — bypasses RLS)

**⚠️ Supabase MCP warning:** The Supabase MCP was reconnected to project `kzqubbioodvlwfobrqdv` (the live app project) on May 24, 2026. Always verify the MCP is pointed at kzqubbioodvlwfobrqdv before running any SQL.

**Tables:**

| Table | Purpose | RLS |
|-------|---------|-----|
| sessions | All session data — answers, state, is_paid, email | Deny all anon ✓ |
| contacts | Email captures | Deny all anon ✓ |
| rate_limits | IP-based rate limiting for all Netlify functions | Deny all anon ✓ |
| gtm_data | GTM Command Centre state — singleton row pattern, id='singleton' | Deny all anon ✓ |

**RLS status (as of May 24, 2026):** Deny-all anon policies active on all four tables. Service role key (used in all Netlify functions) bypasses RLS — no function changes needed.

---

## GTM Dashboard

**URL:** app.wedin.ai/gtm
**Password:** music2026 (localStorage gate — key: `gtm_auth`)
**Component:** `src/components/GTMDashboard.jsx`
**Function:** `netlify/functions/gtm-data.js`
**Data store:** Supabase table `gtm_data` — singleton row pattern, id='singleton'
**Access:** Rus + Amanda (shared, same credentials)
**Purpose:** Daily GTM operations — metrics, planner pipeline, content calendar, action queue, weekly summaries
**Cowork:** Writes morning metrics to gtm_data via Supabase MCP each morning

**How it works:**
- On load, the React component fetches `/.netlify/functions/gtm-data` (GET) which reads the singleton row using the service role key
- All saves POST to the same function with a JSON body — the function merges the payload into the singleton row via Supabase update
- Pipeline and action changes auto-save on every change event
- Update tab saves in bulk on button press
- Toast notification confirms each save

**Password gate:**
- On mount, checks `localStorage.getItem('gtm_auth')`
- If value equals `music2026`, renders dashboard immediately (returning users skip the prompt)
- If not, shows full-screen cream password screen with wedin.ai wordmark
- Correct entry writes to localStorage; wrong entry shows inline error, clears input
- "Lock dashboard" link in header clears localStorage and returns to gate

---

## Landing Page Repo — wedinai/wedin-landing

**Repo:** wedinai/wedin-landing (separate from wedinai/wedin-ai)
**Host:** chimerical-melomakarona-962b6c.netlify.app
**Serves:** wedin.ai (root domain)
**Build:** Static HTML — no build step. Netlify serves files directly from repo root.

**Repo structure (as of May 10, 2026):**
- index.html — main landing page
- sitemap.xml — submitted to Google Search Console May 10, 2026
- googlee942d4d5320cdeb6.html — Google Search Console verification file
- guide/ — AEO guide pages
  - index.html — guides index
  - wedding-music-south-africa/index.html — SA wedding music guide
- .gitignore — excludes .DS_Store and *.pdf

**Important:** Files must be at repo root to be served correctly by Netlify. Do not put content inside a public/ subfolder — Netlify will not serve it at the correct URL path.

**Git note:** wedin-landing is a separate repo from the app. Changes must be committed and pushed to wedinai/wedin-landing, not wedinai/wedin-ai. Always run git fetch origin before pushing to avoid rejected pushes.

---

## Google Search Console

**Status:** Verified ✓ — May 10, 2026
**Property:** https://wedin.ai/
**Verification method:** HTML file at wedin.ai/googlee942d4d5320cdeb6.html
**Sitemap:** https://wedin.ai/sitemap.xml — submitted May 10, 2026, status Success, 3 pages discovered
**Guide pages indexed:** wedin.ai/guide and wedin.ai/guide/wedding-music-south-africa both live and crawlable

---

## Google Analytics 4

**Status:** Live ✓ — May 24, 2026
**Tracking ID:** G-4Q3Y1WQEM5
**Property name:** Wedin
**Property ID:** 538622529
**Account:** rnerwich@gmail.com — separate Google Analytics account, fully isolated from The Ear Academy
**Installed on:** wedin-landing/index.html (the wedin.ai marketing landing page)
**Dashboard:** analytics.google.com → property Wedin (538622529)
**Tracks:** Landing page traffic, source attribution, realtime visitor data, goal completions

**Note:** GA4 is on the landing page only. App behaviour is tracked via Supabase (sessions and contacts tables). Do not add GA4 to the app — session data is more valuable and already captured.

---

## Environment Variables

All environment variables are set in Netlify → wedin-ai-app → Site configuration → Environment variables.

| Variable | Purpose |
|----------|---------|
| ANTHROPIC_API_KEY | Claude API — all generate functions |
| RESEND_API_KEY | Resend email sending |
| VITE_SUPABASE_URL | Supabase URL — frontend + functions |
| VITE_SUPABASE_ANON_KEY | Supabase anon key — frontend read-only |
| SUPABASE_SERVICE_ROLE_KEY | Supabase service role — all Netlify functions, bypasses RLS |
| PAYFAST_MERCHANT_ID | PayFast merchant ID |
| PAYFAST_MERCHANT_KEY | PayFast merchant key |
| PAYFAST_PASSPHRASE | PayFast passphrase — must match exactly what is set in PayFast merchant settings |
| PAYFAST_SANDBOX | `true` = sandbox.payfast.co.za / `false` or absent = live. Currently `false`. |
| DELETE_SECRET | POPIA erasure secret — gates `delete-session.js`. Keep private. |
| SPOTIFY_CLIENT_ID | Spotify API |
| SPOTIFY_CLIENT_SECRET | Spotify API |
| SPOTIFY_REFRESH_TOKEN | Spotify API — re-issue if scopes change |
| SPOTIFY_USER_ID | Spotify account user ID for playlist creation |

**If any function stops working:** Check that the relevant environment variable is present and correctly set in Netlify. Environment variables do not carry over automatically between Netlify sites.

---

## Custom Domain Activation — COMPLETED May 10, 2026

All steps below were completed on May 10, 2026.

- app.wedin.ai activated in Netlify → wedin-ai-app → Domain management ✓
- All 6 restore URLs in email functions updated to app.wedin.ai ✓
  - send-remarketing.js (lines 35 and 76)
  - save-contact.js (line 45)
  - send-wedding-soundtrack.js (line 29)
  - send-complete-plan.js (line 29)
  - send-music-plan.js (line 29)
- All 6 landing page CTAs updated to app.wedin.ai in wedinai/wedin-landing repo ✓
  - index.html (lines 706, 842, 890, 914)
  - public/guide/index.html (line 227)
  - public/guide/wedding-music-south-africa/index.html (line 719)
- Smoke test confirmed: wedin.ai CTAs route to app.wedin.ai correctly ✓

---

## Troubleshooting Reference

**Email not arriving:**
1. Check Resend → Logs — is the send showing 403? Domain verification has lapsed. Re-add DNS records to Netlify DNS and re-verify in Resend.
2. Check Netlify function logs — is the function being called? If no log entry, the fetch call isn't reaching Netlify.
3. Check recipient spam folder.
4. Check the `from` address in the function — must be `hello@wedin.ai` or another verified address on the wedin.ai domain.

**App not loading on app.wedin.ai:**
1. Check Netlify → wedin-ai-app → Domain management — is app.wedin.ai listed as a custom domain?
2. Check Netlify DNS — is the CNAME record present?
3. Wait 5 minutes for SSL to provision if newly activated.

**Payment not unlocking after successful PayFast transaction:**
See the "If a payment is not unlocking" steps in the PayFast section above.

**PayFast signature mismatch:**
The signature implementation is critical and must not be changed. If PayFast returns a signature error: (1) confirm `PAYFAST_PASSPHRASE` in Netlify exactly matches the passphrase set in PayFast merchant settings, (2) confirm `PAYFAST_SANDBOX` is set correctly for the environment being tested.

**Function returning errors:**
1. Check Netlify → Functions → [function name] → invocation logs for error detail.
2. Check environment variables are all present in Netlify site configuration.
3. Check Anthropic API key is valid and has remaining credits.

**DNS changes not taking effect:**
Netlify DNS (NS1) propagates quickly — usually under 5 minutes. If changes aren't reflecting after 10 minutes, confirm the record was saved correctly in Netlify DNS and that the nameservers in GoDaddy still point to NS1 (dns1.p06.nsone.net through dns4.p06.nsone.net).

---

## Nameservers (for reference)

These are set in GoDaddy and must not be changed. They point wedin.ai DNS management to Netlify.

- dns1.p06.nsone.net
- dns2.p06.nsone.net
- dns3.p06.nsone.net
- dns4.p06.nsone.net
