# wedin.ai — Infrastructure & Hosting Reference
## Created April 30, 2026

Load this document when making any changes to hosting, DNS, email, or domain configuration. All decisions and current state recorded here.

---

## Overview — Two Separate Products, Two Separate Hosts

| Product | URL | Host | Purpose |
|---------|-----|------|---------|
| Landing page | wedin.ai | To be confirmed | Marketing, waitlist, CTAs |
| App | wedin-ai-app.netlify.app | Netlify | The product itself |

These are independent deployments. DNS for both routes through Netlify DNS (NS1 nameservers), even though the domain is registered at GoDaddy.

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
**Current app URL:** https://wedin-ai-app.netlify.app
**Target app URL:** https://app.wedin.ai (to be activated — see Pre-Launch Checklist below)
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

## Database

**Provider:** Supabase
**Used for:** Session persistence, email deduplication, remarketing sequence
**Environment variable:** SUPABASE_URL and SUPABASE_ANON_KEY set in Netlify environment variables

---

## Environment Variables

All environment variables are set in Netlify → wedin-ai-app → Site configuration → Environment variables.

| Variable | Purpose |
|----------|---------|
| ANTHROPIC_API_KEY | Claude API — all generate functions |
| RESEND_API_KEY | Resend email sending |
| SUPABASE_URL | Supabase database connection |
| SUPABASE_ANON_KEY | Supabase authentication |
| PAYFAST_MERCHANT_ID | PayFast payments (Session 11) |
| PAYFAST_MERCHANT_KEY | PayFast payments (Session 11) |

**If any function stops working:** Check that the relevant environment variable is present and correctly set in Netlify. Environment variables do not carry over automatically between Netlify sites.

---

## Pre-Launch Checklist — Custom Domain Activation

**Do this as one of the last steps before go-live. Do not do earlier.**

The goal is to move the app from `wedin-ai-app.netlify.app` to `app.wedin.ai` and update the landing page CTAs to point to the correct URL.

### Step 1 — Activate app.wedin.ai in Netlify

The CNAME record `app.wedin.ai → wedin-ai-app.netlify.app` already exists in Netlify DNS. You just need to tell the Netlify app to accept traffic on that domain.

1. Go to app.netlify.com → wedin-ai-app project
2. Site configuration → Domain management
3. Click **Add custom domain**
4. Enter `app.wedin.ai`
5. Netlify will verify the CNAME exists and activate it
6. SSL certificate will provision automatically — takes 2–5 minutes
7. Test: open https://app.wedin.ai in browser — app should load

### Step 2 — Update landing page CTAs

Once `app.wedin.ai` is confirmed working, update every CTA on the wedin.ai landing page that links to the app.

Find and replace:
- **From:** `https://wedin-ai-app.netlify.app` (or any variation)
- **To:** `https://app.wedin.ai`

CTAs to check:
- Primary hero CTA button
- Any secondary CTA buttons
- Any pricing section CTAs
- Any email links that deep-link into the app
- Remarketing email restore links (check send-remarketing.js — the restore URL may be hardcoded)

### Step 3 — Update restore URL in remarketing function

Check `netlify/functions/send-remarketing.js` for any hardcoded app URL used in the restore link. Update to `https://app.wedin.ai` if present.

### Step 4 — Smoke test end to end

1. Click CTA on wedin.ai landing page — confirms it routes to app.wedin.ai correctly
2. Complete a discovery session — confirms app loads and functions correctly on the custom domain
3. Send a test email from each email button — confirms Resend still sends correctly (domain change does not affect email — email uses wedin.ai domain, not app.wedin.ai)
4. Test session restore via remarketing email link — confirms restore URL is correct

### Step 5 — Confirm old Netlify URL still works (optional)

wedin-ai-app.netlify.app will continue to work after app.wedin.ai is activated — Netlify serves both. You can leave it active as a fallback or ignore it. No action required.

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
