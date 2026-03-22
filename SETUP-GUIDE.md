# RevBrain — Platform Setup Guide

> **Scope**: Complete setup for all RevBrain services across production and staging.
> Covers: DNS, Vercel, Supabase, Stripe, Resend, Sentry, PostHog, Cal.com.
>
> **Domain**: `revbrain.ai` (registered on Namecheap)
>
> **Last Updated**: March 2026

---

## Architecture Overview

```
revbrain.ai          → Vercel (marketing homepage)
app.revbrain.ai      → Vercel (production SPA)
stg.revbrain.ai      → Vercel (staging SPA)
api via Supabase     → Edge Functions (no custom subdomain needed)
```

| Service   | Purpose                                 | Needed By            |
| --------- | --------------------------------------- | -------------------- |
| Namecheap | DNS                                     | All                  |
| Vercel    | Frontend hosting                        | Homepage + App       |
| Supabase  | Database, Auth, Edge Functions, Storage | App                  |
| Stripe    | Billing & subscriptions                 | App                  |
| Resend    | Transactional email                     | App + Homepage       |
| Sentry    | Error monitoring                        | App + Homepage       |
| PostHog   | Product analytics                       | Homepage (later App) |
| Cal.com   | Demo scheduling                         | Homepage             |

---

## Setup Order

Follow this exact order — each step depends on the previous ones.

1. [Supabase](#1-supabase) — Database & Auth (everything depends on this)
2. [Vercel](#2-vercel) — Deploy frontend + configure domains
3. [Namecheap DNS](#3-namecheap-dns) — Point all subdomains
4. [Resend](#4-resend) — Email (needs DNS verification)
5. [Stripe](#5-stripe) — Billing (needs deployed webhook endpoint)
6. [Sentry](#6-sentry) — Error monitoring
7. [PostHog](#7-posthog) — Analytics
8. [Cal.com](#8-calcom) — Scheduling
9. [Environment Variables](#9-environment-variables) — Final wiring

---

## 1. Supabase

You already have two projects:

- **Production**: `kfalhnqyzoghalidubrs`
- **Staging**: `qutuivleheybnkbhpdbn`

### 1.1 Verify Auth Redirect URLs

In each Supabase project → **Authentication** → **URL Configuration**:

**Production** (`kfalhnqyzoghalidubrs`):

```
Site URL:         https://app.revbrain.ai
Redirect URLs:
  https://app.revbrain.ai/set-password
  https://app.revbrain.ai/reset-password
  https://app.revbrain.ai/login
```

**Staging** (`qutuivleheybnkbhpdbn`):

```
Site URL:         https://stg.revbrain.ai
Redirect URLs:
  https://stg.revbrain.ai/set-password
  https://stg.revbrain.ai/reset-password
  https://stg.revbrain.ai/login
```

> **Note**: Update from `.com` to `.ai` if these were previously set to `revbrain.com`.

### 1.2 Get Connection Strings

For each project, go to **Settings** → **Database** → **Connection string** (URI tab, use **Transaction pooler** mode):

```
DATABASE_URL=postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
```

### 1.3 Get API Keys

**Settings** → **API**:

- `SUPABASE_URL` — Project URL
- `SUPABASE_ANON_KEY` — `anon` / `public` key
- `SUPABASE_SERVICE_ROLE_KEY` — `service_role` key (keep secret!)
- `SUPABASE_JWT_SECRET` — **Settings** → **API** → **JWT Secret**

### 1.4 Deploy Edge Functions

```bash
# Staging
supabase functions deploy api --project-ref qutuivleheybnkbhpdbn

# Production
supabase functions deploy api --project-ref kfalhnqyzoghalidubrs
```

### 1.5 Run Migrations

```bash
# Set DATABASE_URL to the target environment, then:
pnpm db:migrate
pnpm db:seed  # Initial plans, system admin, etc.
```

---

## 2. Vercel

### 2.1 Create Three Projects

| Vercel Project      | Repo                               | Root Directory | Framework |
| ------------------- | ---------------------------------- | -------------- | --------- |
| `revbrain-homepage` | `danielbenzimri/revbrain-homepage` | `/`            | Next.js   |
| `revbrain-app`      | `danielbenzimri/revbrain`          | `apps/client`  | Vite      |
| `revbrain-app-stg`  | `danielbenzimri/revbrain`          | `apps/client`  | Vite      |

**For each project**:

1. Go to https://vercel.com/new
2. Import the repo
3. Set the root directory and framework
4. Deploy

**For `revbrain-app-stg`**: Set the git branch to `develop` (or your staging branch) so it auto-deploys staging separately.

### 2.2 Assign Domains

In each Vercel project → **Settings** → **Domains**:

| Project             | Domain                            |
| ------------------- | --------------------------------- |
| `revbrain-homepage` | `revbrain.ai` + `www.revbrain.ai` |
| `revbrain-app`      | `app.revbrain.ai`                 |
| `revbrain-app-stg`  | `stg.revbrain.ai`                 |

---

## 3. Namecheap DNS

Go to **Namecheap** → **Domain List** → `revbrain.ai` → **Advanced DNS**.

**Delete** any existing URL Redirect Records that conflict.

**Add these records**:

| Type    | Host  | Value                   | TTL       |
| ------- | ----- | ----------------------- | --------- |
| `A`     | `@`   | `76.76.21.21`           | Automatic |
| `CNAME` | `www` | `cname.vercel-dns.com.` | Automatic |
| `CNAME` | `app` | `cname.vercel-dns.com.` | Automatic |
| `CNAME` | `stg` | `cname.vercel-dns.com.` | Automatic |

**Email records** (added in Step 4 after Resend setup):
| Type | Host | Value | TTL |
|------|------|-------|-----|
| `TXT` | `@` | _(Resend SPF record — see Step 4)_ | Automatic |
| `CNAME` | `resend._domainkey` | _(Resend DKIM — see Step 4)_ | Automatic |
| `TXT` | `_dmarc` | `v=DMARC1; p=none;` | Automatic |

> **Wait** for DNS to propagate (5–30 min). Vercel will auto-provision SSL certificates once DNS resolves. Check status on each project's Domains page.

---

## 4. Resend

Resend handles transactional email for both the app (invites, password resets) and the homepage (contact form).

### 4.1 Create Account & Verify Domain

1. Sign up at https://resend.com
2. Go to **Domains** → **Add Domain** → `revbrain.ai`
3. Resend will give you DNS records to add. Add them in **Namecheap**:
   - **SPF**: TXT record on `@` — value like `v=spf1 include:amazonses.com ~all`
   - **DKIM**: CNAME record — `resend._domainkey` → value provided by Resend
   - **DMARC**: TXT record on `_dmarc` → `v=DMARC1; p=none;`

4. Click **Verify** in Resend dashboard (may take a few minutes)

### 4.2 Create API Keys

Create **two API keys** in Resend → **API Keys**:

| Key Name        | Permissions | Used By                     |
| --------------- | ----------- | --------------------------- |
| `revbrain-prod` | Full access | App (production) + Homepage |
| `revbrain-stg`  | Full access | App (staging)               |

### 4.3 Env Vars

```bash
# Homepage (Vercel - revbrain-homepage)
RESEND_API_KEY=re_xxxx_prod

# App Production (Vercel - revbrain-app)
RESEND_API_KEY=re_xxxx_prod
EMAIL_FROM="RevBrain <noreply@revbrain.ai>"
EMAIL_ADAPTER=resend

# App Staging (Vercel - revbrain-app-stg)
RESEND_API_KEY=re_xxxx_stg
EMAIL_FROM="RevBrain Staging <noreply@revbrain.ai>"
EMAIL_ADAPTER=resend
```

---

## 5. Stripe

### 5.1 Create Account & Products

1. Sign up at https://stripe.com
2. Create your subscription plans in **Products** (match what's in your DB seed)
3. Note the **Product IDs** (`prod_xxx`) and **Price IDs** (`price_xxx`)

### 5.2 Set Up Webhooks

Go to **Developers** → **Webhooks** → **Add endpoint**:

**Production**:

```
URL: https://kfalhnqyzoghalidubrs.supabase.co/functions/v1/api/v1/webhooks/stripe
Events: checkout.session.completed, customer.subscription.updated,
        customer.subscription.deleted, invoice.payment_failed,
        invoice.payment_succeeded
```

**Staging** (use Test mode):

```
URL: https://qutuivleheybnkbhpdbn.supabase.co/functions/v1/api/v1/webhooks/stripe
Events: (same as above)
```

Note the **Webhook Signing Secret** (`whsec_xxx`) for each.

### 5.3 Get API Keys

**Developers** → **API Keys**:

- `STRIPE_SECRET_KEY` — Secret key (`sk_live_xxx` or `sk_test_xxx`)
- `VITE_STRIPE_PUBLISHABLE_KEY` — Publishable key (`pk_live_xxx` or `pk_test_xxx`)

### 5.4 Env Vars

```bash
# App Production
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx_prod
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxx

# App Staging (use TEST mode keys)
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx_stg
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
```

---

## 6. Sentry

### 6.1 Create Projects

1. Sign up at https://sentry.io
2. Create **two projects**:
   - `revbrain-app` (JavaScript / React)
   - `revbrain-homepage` (JavaScript / Next.js)
3. Note the **DSN** for each

### 6.2 Env Vars

```bash
# Homepage
SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/homepage-id

# App Production
SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/app-id
SENTRY_ENVIRONMENT=production

# App Staging
SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/app-id
SENTRY_ENVIRONMENT=staging
```

---

## 7. PostHog

### 7.1 Create Project

1. Sign up at https://posthog.com (EU cloud recommended for GDPR)
2. Create a project for RevBrain
3. Note the **Project API Key** and **Host**

### 7.2 Env Vars

```bash
# Homepage
NEXT_PUBLIC_POSTHOG_KEY=phc_xxx
NEXT_PUBLIC_POSTHOG_HOST=https://eu.posthog.com
```

---

## 8. Cal.com

### 8.1 Create Account

1. Sign up at https://cal.com
2. Create a **team** or personal account with username `revbrain`
3. Set up a 30-min event type for demos

### 8.2 Env Vars

```bash
# Homepage
NEXT_PUBLIC_CALCOM_USERNAME=revbrain
```

---

## 9. Environment Variables

### 9.1 Homepage (Vercel → `revbrain-homepage` → Settings → Environment Variables)

| Variable                      | Value                       | Environments |
| ----------------------------- | --------------------------- | ------------ |
| `NEXT_PUBLIC_SITE_URL`        | `https://revbrain.ai`       | Production   |
| `NEXT_PUBLIC_CALCOM_USERNAME` | `revbrain`                  | All          |
| `RESEND_API_KEY`              | `re_xxxx`                   | Production   |
| `CONTACT_EMAIL`               | `hello@revbrain.ai`         | All          |
| `SENTRY_DSN`                  | `https://xxx@sentry.io/xxx` | Production   |
| `NEXT_PUBLIC_POSTHOG_KEY`     | `phc_xxx`                   | Production   |
| `NEXT_PUBLIC_POSTHOG_HOST`    | `https://eu.posthog.com`    | Production   |

### 9.2 App Production (Vercel → `revbrain-app` → Settings → Environment Variables)

| Variable                      | Value                                                       |
| ----------------------------- | ----------------------------------------------------------- |
| `VITE_SUPABASE_URL`           | `https://kfalhnqyzoghalidubrs.supabase.co`                  |
| `VITE_SUPABASE_ANON_KEY`      | _(from Supabase dashboard)_                                 |
| `VITE_API_URL`                | `https://kfalhnqyzoghalidubrs.supabase.co/functions/v1/api` |
| `VITE_STRIPE_PUBLISHABLE_KEY` | `pk_live_xxx`                                               |
| `VITE_AUTH_MODE`              | `jwt`                                                       |

### 9.3 App Staging (Vercel → `revbrain-app-stg` → Settings → Environment Variables)

| Variable                      | Value                                                       |
| ----------------------------- | ----------------------------------------------------------- |
| `VITE_SUPABASE_URL`           | `https://qutuivleheybnkbhpdbn.supabase.co`                  |
| `VITE_SUPABASE_ANON_KEY`      | _(from Supabase dashboard)_                                 |
| `VITE_API_URL`                | `https://qutuivleheybnkbhpdbn.supabase.co/functions/v1/api` |
| `VITE_STRIPE_PUBLISHABLE_KEY` | `pk_test_xxx`                                               |
| `VITE_AUTH_MODE`              | `jwt`                                                       |

### 9.4 Supabase Edge Function Secrets

Set these via CLI for each project:

```bash
# Production
supabase secrets set --project-ref kfalhnqyzoghalidubrs \
  DATABASE_URL="postgresql://..." \
  SUPABASE_URL="https://kfalhnqyzoghalidubrs.supabase.co" \
  SUPABASE_SERVICE_ROLE_KEY="..." \
  SUPABASE_JWT_SECRET="..." \
  STRIPE_SECRET_KEY="sk_live_xxx" \
  STRIPE_WEBHOOK_SECRET="whsec_xxx" \
  RESEND_API_KEY="re_xxx" \
  EMAIL_FROM="RevBrain <noreply@revbrain.ai>" \
  EMAIL_ADAPTER="resend" \
  FRONTEND_URL="https://app.revbrain.ai" \
  APP_URL="https://app.revbrain.ai" \
  APP_ENV="production" \
  SENTRY_DSN="https://xxx@sentry.io/xxx" \
  SENTRY_ENVIRONMENT="production" \
  CORS_ORIGINS="https://app.revbrain.ai,https://revbrain.ai"

# Staging
supabase secrets set --project-ref qutuivleheybnkbhpdbn \
  DATABASE_URL="postgresql://..." \
  SUPABASE_URL="https://qutuivleheybnkbhpdbn.supabase.co" \
  SUPABASE_SERVICE_ROLE_KEY="..." \
  SUPABASE_JWT_SECRET="..." \
  STRIPE_SECRET_KEY="sk_test_xxx" \
  STRIPE_WEBHOOK_SECRET="whsec_xxx" \
  RESEND_API_KEY="re_xxx" \
  EMAIL_FROM="RevBrain Staging <noreply@revbrain.ai>" \
  EMAIL_ADAPTER="resend" \
  FRONTEND_URL="https://stg.revbrain.ai" \
  APP_URL="https://stg.revbrain.ai" \
  APP_ENV="staging" \
  SENTRY_DSN="https://xxx@sentry.io/xxx" \
  SENTRY_ENVIRONMENT="staging" \
  CORS_ORIGINS="https://stg.revbrain.ai"
```

---

## Verification Checklist

After completing all steps, verify in order:

- [ ] `https://revbrain.ai` loads the marketing homepage
- [ ] `https://www.revbrain.ai` redirects to `https://revbrain.ai`
- [ ] `https://app.revbrain.ai` loads the production app
- [ ] `https://stg.revbrain.ai` loads the staging app
- [ ] SSL certificates are active on all domains (green padlock)
- [ ] Contact form on homepage sends email (check `hello@revbrain.ai`)
- [ ] Cal.com schedule link works
- [ ] Supabase Auth login/signup works on `app.revbrain.ai`
- [ ] Supabase Auth login/signup works on `stg.revbrain.ai`
- [ ] Stripe checkout flow works (test mode on staging)
- [ ] Sentry captures a test error
- [ ] PostHog records a page view on homepage

---

## Domain Migration Note

The existing app configs reference `revbrain.com` in several places. When deploying, update these to `revbrain.ai`:

- `supabase/config.toml` — Auth redirect URLs
- `.env.prod` / `.env.dev` — `FRONTEND_URL`, `APP_URL`
- Supabase dashboard — Auth redirect URLs
- Stripe dashboard — Webhook endpoints (if using custom domain)

Search the app repo for `.com` references:

```bash
grep -r "revbrain\.com" --include="*.ts" --include="*.toml" --include="*.env*"
```
