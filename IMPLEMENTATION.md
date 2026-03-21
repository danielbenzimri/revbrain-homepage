# Geometrix Marketing Site - Implementation Plan

> **Purpose**: Step-by-step engineering execution plan derived from [SPEC.md](./SPEC.md). Each task is testable, auditable, and follows strict quality gates. This plan is intended to implement the full current scope of SPEC.md. Any deviations discovered during implementation must be documented and approved.
>
> **Audience**: Engineers implementing the site, tech leads reviewing progress, external auditors verifying completeness.
>
> **Relationship to SPEC.md**: This document answers "how and in what order." SPEC.md answers "what and why." When in doubt, SPEC.md is the authority.
>
> **Last Updated**: March 2025

---

## Quality Gate: Pre-Push Workflow

**Every task must pass this workflow before committing:**

```bash
pnpm format          # Prettier - auto-fix formatting
pnpm lint            # ESLint - zero errors, zero warnings
pnpm typecheck       # tsc --noEmit - zero type errors
pnpm test            # Vitest - all tests pass
pnpm build           # Next.js build succeeds with no errors
# Only then:
git add <files>
git commit
git push
```

**This is non-negotiable.** If any step fails, fix the issue before committing. CI will enforce the same checks and block merge on failure.

### Coding Standards (All Tasks)

- **TypeScript strict mode** - no `any` except in third-party type bridges (document why)
- **Server components by default** - only add `'use client'` when the component needs browser APIs, state, or event handlers
- **Named exports** - no default exports except for Next.js page/layout conventions
- **Explicit return types** on all exported functions
- **No barrel files** (`index.ts` re-exports) - import directly from source
- **Comments only where logic isn't self-evident** - no JSDoc on obvious functions
- **Error handling** - never swallow errors silently; log to Sentry or console.warn
- **Security** - never expose server-side env vars to client; validate all inputs at system boundaries

### Accessibility Standard (WCAG 2.1 AA)

Required for every interactive component and page:

- Keyboard navigation (Tab, Shift+Tab, Enter, Escape, Arrow keys)
- Focus visible on all interactive elements, focus order matches visual order
- Color contrast >= 4.5:1 (normal text), >= 3:1 (large text)
- Touch targets >= 44x44px on mobile
- All images have appropriate `alt` text or `role="presentation"`
- Form inputs have associated labels; error messages announced to screen readers
- Skip navigation link: `<a href="#main-content" class="sr-only focus:not-sr-only">`

Accessibility is enforced at **component test level** (axe-core), not only at pre-launch QA.

### Commit Convention

Use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat(phase-2): add Contentful client with mock fallback`
- `fix(phase-4): handle Resend timeout in contact form`
- `test(phase-3): add FAQ section component tests`
- `chore(phase-0): configure ESLint rules`

Enforced via `@commitlint/cli` + `@commitlint/config-conventional` in husky commit-msg hook. PR titles follow the same convention. PRs reference the task number (e.g., "Implements Task 3.3").

### Test Coverage Thresholds

Enforced in CI via Vitest coverage config:

- **Statements**: 80%
- **Branches**: 70%
- **Functions**: 80%
- **Lines**: 80%

Critical modules have higher thresholds (enforced when the module exists):

- `lib/locale.ts`: 95%
- `lib/contentful/transforms.ts`: 90%
- `lib/contentful/queries.ts`: 90%
- `app/api/contact/route.ts`: 95%

**Ramp-up**: During Phases 0-1, if the codebase is too small for percentage thresholds to be meaningful (< 20 source files), CI should warn but not block on global thresholds. Critical module thresholds are enforced as soon as the module exists.

### Definition of Done (Per Phase)

A phase is complete when:

- [ ] All tasks within the phase meet their acceptance criteria
- [ ] All tests pass (`pnpm test`)
- [ ] Build succeeds (`pnpm build`)
- [ ] Lint + format + typecheck pass
- [ ] No critical or high Sentry errors from the phase's code
- [ ] Preview deployment reviewed (visual check in both locales, mobile + desktop)
- [ ] Accessibility: axe-core passes on all new/modified pages

### Progressive E2E Test Schedule

E2E tests are added incrementally as features land, not deferred to pre-launch. Each phase's Definition of Done includes passing its E2E tests in CI against the preview deployment.

| After Phase | E2E Tests Added                                                                                                                                         |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Phase 1     | Locale routing: `/` redirects, `/he` + `/en` render with correct `lang`/`dir`, language switcher works, invalid locale → 404                            |
| Phase 3     | Homepage: all sections visible with mock data, phase gating hides/shows sections, responsive mobile/tablet/desktop, RTL layout correct                  |
| Phase 4     | Integrations: contact form fill → submit → thank-you, validation errors displayed, cookie consent appears/accept/reject, PostHog blocked before consent |
| Phase 6     | Full smoke: all pages load in both locales, all links resolve, 404 for unknown routes, security headers present                                         |

**P0 scope** = smoke and critical-path E2E. **P1** = expanded E2E, visual regression baselines, Lighthouse CI automation.

---

## Table of Contents

### P0 - Launch Blockers

- [Phase 0: Foundation & Tooling](#phase-0-foundation--tooling)
- [Phase 1: Routing & Localization](#phase-1-routing--localization)
- [Phase 2: CMS Integration & Mock Data](#phase-2-cms-integration--mock-data)
- [Phase 3: Homepage Sections](#phase-3-homepage-sections)
- [Phase 4: Integrations (Forms, Scheduling, Analytics)](#phase-4-integrations)
- [Phase 5: SEO & Performance](#phase-5-seo--performance)
- [Phase 6: Legal, Error Pages & Deployment](#phase-6-legal-error-pages--deployment)
- [Phase 7: Content Migration & QA](#phase-7-content-migration--qa)

### P1 - Post-Launch (30 Days)

- [Phase 8: New Pages & Composable Sections](#phase-8-new-pages--composable-sections)
- [Phase 9: E2E Testing & Lighthouse CI](#phase-9-e2e-testing--lighthouse-ci)

### P2 - Growth

- [Phase 10: Blog & Case Studies](#phase-10-blog--case-studies)
- [Phase 11: CRM & Experimentation](#phase-11-crm--experimentation)

### P3 - Scale

- [Phase 12: Advanced Features](#phase-12-advanced-features)

---

## Phase 0: Foundation & Tooling

**Goal**: A working Next.js 15 project with Tailwind 4, TypeScript strict mode, testing infrastructure, and CI pipeline. The existing Vite components are migrated and rendering correctly in both locales.

**Context**: The current project is a Vite + React 18 SPA with Tailwind loaded via CDN and content hardcoded in `constants.tsx`. This phase replaces the foundation while preserving the existing UI.

**Estimated effort**: 5-7 days

---

### Task 0.1: Scaffold Next.js 15 Project

**Goal**: Initialize a Next.js 15 App Router project with TypeScript strict mode alongside the existing Vite code. The project must build and serve a blank page.

**Steps**:

1. Create a new Next.js 15 project in the repo root (replacing Vite config)
2. Configure `tsconfig.json` with `"strict": true`, path aliases (`@/`)
3. Configure `next.config.ts` with `reactStrictMode: true`
4. Add `pnpm` as package manager with `packageManager` field in `package.json`
5. Remove Vite-specific files: `vite.config.ts`, `index.html` entry point
6. Create minimal `app/layout.tsx` and `app/page.tsx` that render "Hello World"
7. Verify `pnpm dev` starts and `pnpm build` succeeds

**Acceptance Criteria**:

- `pnpm dev` serves the app on localhost
- `pnpm build` completes with zero errors
- TypeScript strict mode is enabled (no implicit any)
- The project structure matches SPEC.md section 23

**Tests**:

- Smoke test: `pnpm build` exits with code 0
- Type check: `pnpm typecheck` (tsc --noEmit) passes

---

### Task 0.2: Configure Tailwind CSS 4 (Build-Time)

**Goal**: Replace Tailwind CDN with build-time Tailwind CSS 4 using PostCSS. All existing component styles must render identically.

**Context**: The existing project loads Tailwind via CDN in `index.html`, which works but is suboptimal (no purging, no build-time optimization, larger CSS payload). Tailwind 4 uses `@tailwindcss/postcss` instead of the classic `tailwind.config.js`.

**Steps**:

1. Install `tailwindcss@4`, `@tailwindcss/postcss`
2. Create `postcss.config.mjs` with Tailwind plugin
3. Create `app/globals.css` with `@import "tailwindcss"`
4. Configure custom theme tokens from SPEC.md section 14 (Design System):
   - Colors: emerald-600 primary, slate-900 neutral, etc.
   - Font: Rubik via `next/font/google` with `latin` and `hebrew` subsets
5. Import `globals.css` in `app/layout.tsx`
6. Remove Tailwind CDN `<script>` tag from any HTML
7. Verify all design tokens render correctly

**Acceptance Criteria**:

- No CDN references to Tailwind remain
- `pnpm build` produces optimized, purged CSS < 30KB gzip
- Rubik font loads via `next/font` (no external Google Fonts request)
- Design tokens from SPEC.md section 14 are applied

**Tests**:

- Unit test: Verify `next/font` configuration exports correct CSS variable
- Build check: CSS output < 50KB (fail threshold from SPEC)

---

### Task 0.3: Configure Linting, Formatting & Git Hooks

**Goal**: Set up Prettier, ESLint, and pre-commit hooks so that every commit meets formatting and lint standards automatically.

**Steps**:

1. Install and configure Prettier with settings: `semi: true`, `singleQuote: true`, `trailingComma: 'all'`, `printWidth: 100`
2. Install and configure ESLint with `@next/eslint-plugin-next`, TypeScript rules, React hooks rules
3. Add `lint-staged` + `husky` for pre-commit hooks
4. Add npm scripts: `format`, `format:check`, `lint`, `typecheck`
5. Create `.prettierignore` and `.eslintignore` (exclude `node_modules`, `.next`, `content/mock/`)
6. Install `@commitlint/cli`, `@commitlint/config-conventional`; add commitlint to husky `commit-msg` hook
7. Run formatter and linter on entire codebase, fix all issues

**Acceptance Criteria**:

- `pnpm format:check` passes with no diffs
- `pnpm lint` passes with zero errors and zero warnings
- Pre-commit hook runs `lint-staged` on changed files
- CI will enforce the same checks

**Tests**:

- CI step: `pnpm format:check && pnpm lint && pnpm typecheck`

---

### Task 0.4: Set Up Vitest & Testing Library

**Goal**: Testing infrastructure is ready. A sample test passes. Mock Service Worker (MSW) is configured for API mocking.

**Steps**:

1. Install `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`, `msw`
2. Create `vitest.config.ts` with `environment: 'jsdom'`, path aliases, coverage config
3. Create `vitest.setup.ts` with Testing Library matchers import
4. Create `tests/` directory structure mirroring `lib/`, `components/`
5. Write a sample test that renders a React component and asserts text content
6. Add npm scripts: `test`, `test:watch`, `test:coverage`
7. Configure MSW handlers directory at `tests/mocks/handlers.ts`

**Acceptance Criteria**:

- `pnpm test` runs and passes
- Coverage report generates
- MSW server starts/stops cleanly in test lifecycle

**Tests**:

- Sample test: render a `<Button>` component, assert it renders children
- MSW test: mock a fetch call, verify the mock is used

---

### Task 0.5: Migrate Existing Components from Vite

**Goal**: All existing React components from the Vite SPA are migrated to the Next.js project and render correctly. No functionality is lost.

**Context**: The current Vite project has components in `components/`, content in `constants.tsx`, types in `types.ts`, and a content hook in `lib/content.ts`. These must be moved into the Next.js structure while classifying each as server or client component.

**Steps**:

1. Copy component files to `components/sections/` (Hero, UseCases, Modules, Pricing, Team, Testimonials, FAQ, Footer, Header, Button)
2. Copy `constants.tsx` to `constants/legacy-content.ts` (will be replaced by mock JSON in Phase 2)
3. Copy `types.ts` to `types/app.ts`
4. Copy `lib/content.ts` to `lib/locale.ts`
5. Classify each component: most are server components; those with `useState`, `useEffect`, or event handlers become `'use client'`
6. Update import paths to use `@/` aliases
7. Replace `VITE_` environment variable references (none should exist in components)
8. Create a temporary `app/[locale]/page.tsx` that renders all sections with hardcoded content from `constants/legacy-content.ts`
9. Verify visual parity in both HE and EN

**Acceptance Criteria**:

- All components render without console errors
- RTL/LTR switching works (Hebrew = RTL, English = LTR)
- Responsive design matches original at mobile, tablet, desktop breakpoints
- No `VITE_` references remain
- Client components are marked with `'use client'`, all others are server components

**Tests**:

- Component tests: Each section component renders with mock props without errors
- Snapshot test: Homepage renders consistent HTML for both locales
- Visual check: Manual verification at 375px, 768px, 1280px widths

**Migration Validation Checklist** (from SPEC.md):

- [ ] All pages render in both locales (he, en)
- [ ] RTL/LTR switching works correctly
- [ ] All interactive elements function (accordion, tabs, mobile menu)
- [ ] Responsive design matches original at all breakpoints
- [ ] No console errors in dev mode
- [ ] Build succeeds with no warnings
- [ ] Tailwind classes match original visual output

---

### Task 0.6: Sentry Error Monitoring (Infrastructure)

**Goal**: Sentry available from the first line of code. All subsequent phases can log errors immediately instead of retrofitting later.

**Context**: Both audits flagged that referencing Sentry in Phase 2 but installing it in Phase 4 creates a temporal dependency. Sentry is infrastructure, not an integration - it should exist from day one.

**Steps**:

1. Run `npx @sentry/wizard@latest -i nextjs` to configure SDK
2. Configure `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`
3. Create `instrumentation.ts` for server-side initialization
4. Create `app/[locale]/error.tsx` (client component, error boundary):
   - Capture error with `Sentry.captureException`
   - Render localized error message with "Try again" button
5. Add source map upload to build step
6. Verify errors appear in Sentry dashboard during development

**Acceptance Criteria**:

- Client-side errors captured in Sentry
- Server-side errors captured in Sentry
- Source maps uploaded (readable stack traces)
- `error.tsx` catches page-level errors with recovery UI

**Tests**:

- Unit test: Error boundary renders error message and reset button
- Integration test: Simulated error triggers Sentry capture (mock SDK)
- Build test: Source maps generated (`pnpm build` succeeds with Sentry plugin)

---

### Task 0.7: Environment Variable Validation

**Goal**: Fail fast on invalid or missing environment variables. Prevent misconfiguration from silently breaking production.

**Steps**:

1. Create `lib/env.ts` with Zod schemas for server and public env vars:

   ```typescript
   // Server env - validated at build/startup time
   const serverEnvSchema = z.object({
     CONTENTFUL_SPACE_ID: z.string().optional(),
     CONTENTFUL_ACCESS_TOKEN: z.string().optional(),
     CONTENTFUL_PREVIEW_TOKEN: z.string().optional(),
     CONTENTFUL_REVALIDATION_SECRET: z.string().min(16).optional(),
     RESEND_API_KEY: z.string().startsWith('re_').optional(),
     CONTACT_EMAIL: z.string().email().optional(),
     SENTRY_DSN: z.string().url().optional(),
     UPSTASH_REDIS_REST_URL: z.string().url().optional(),
     UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
   });

   // Public env - available client-side
   const publicEnvSchema = z.object({
     NEXT_PUBLIC_CALCOM_USERNAME: z.string().default('geometrix'),
     NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
     NEXT_PUBLIC_POSTHOG_HOST: z.string().url().optional(),
     NEXT_PUBLIC_APP_URL: z.string().url().optional(),
     NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
   });
   ```

2. Export validated `serverEnv` and `publicEnv` objects
3. In production: fail fast if required vars are missing (throw on import)
4. In development: allow graceful defaults (Contentful optional, etc.)
5. Import `lib/env.ts` in `instrumentation.ts` so it validates at startup

**Acceptance Criteria**:

- Missing required production env var causes build/startup failure with clear error message
- Development works without any env vars (mock data mode)
- Invalid format (e.g., malformed URL) is caught at validation time

**Tests**:

- Unit test: Valid env passes schema
- Unit test: Missing required production env fails with descriptive error
- Unit test: Invalid URL format fails
- Unit test: Development mode accepts empty optional vars

---

### Task 0.8: Node Version & Dependency Governance

**Goal**: Reproducible builds across local and CI environments.

**Steps**:

1. Create `.nvmrc` with pinned Node version (e.g., `20.11.0`)
2. Pin `pnpm` version in `package.json` `packageManager` field
3. Enable `corepack` in CI workflow
4. Commit `pnpm-lock.yaml`
5. Configure Renovate or Dependabot for automated dependency updates (monthly patch cadence)
6. Pin exact versions for critical dependencies in `package.json` (Next.js, React, Contentful SDK)

**Acceptance Criteria**:

- `node -v` matches `.nvmrc` in CI
- `pnpm install --frozen-lockfile` succeeds in CI
- No floating version ranges for critical packages

**Tests**:

- CI step: Verify Node version matches `.nvmrc`
- CI step: `pnpm install --frozen-lockfile` succeeds

---

## Phase 1: Routing & Localization

**Goal**: Route-based locale handling (`/he/...`, `/en/...`) with middleware, RTL/LTR support set server-side, and SPA-to-multi-page redirects.

**Context**: SPEC.md sections 9 (Localization Strategy) and 11 (Page & Routing Strategy) define route-based locales as critical for SEO. The current SPA uses a client-side UI toggle. This phase makes locale part of the URL.

**Estimated effort**: 2 days

---

### Task 1.1: Implement `[locale]` Dynamic Segment

**Goal**: All pages are nested under `app/[locale]/` and the locale determines HTML `lang` and `dir` attributes server-side.

**Steps**:

1. Create `app/[locale]/layout.tsx` that:
   - Validates locale param (only `he` and `en` allowed)
   - Sets `<html lang={locale} dir={locale === 'he' ? 'rtl' : 'ltr'}>`
   - Applies the Rubik font CSS variable
   - Returns 404 for invalid locales
2. Move page content into `app/[locale]/page.tsx`
3. Create `lib/locale.ts` with:
   - `LOCALES` constant array
   - `isValidLocale()` type guard
   - `getContentfulLocale(locale)` mapper (`'he'` -> `'he-IL'`)
   - `getDirection(locale)` helper
4. Create `generateStaticParams` to prerender both locales

**Acceptance Criteria**:

- `/he` renders with `dir="rtl" lang="he"`
- `/en` renders with `dir="ltr" lang="en"`
- `/fr` returns 404
- Both locale pages are prerendered at build time

**Tests**:

- Unit test: `isValidLocale('he')` returns true, `isValidLocale('fr')` returns false
- Unit test: `getContentfulLocale('he')` returns `'he-IL'`
- Unit test: `getDirection('he')` returns `'rtl'`
- Component test: Layout renders correct `dir` attribute for each locale
- Build test: `generateStaticParams` returns `[{ locale: 'he' }, { locale: 'en' }]`

---

### Task 1.2: Implement Locale Detection Middleware

**Goal**: Visiting the root URL (`/`) redirects to the correct locale based on cookie, then Accept-Language header, defaulting to Hebrew.

**Steps**:

1. Create `middleware.ts` at project root with the exact implementation from SPEC.md section 9
2. Add `matcher` config to skip API routes, static files, assets
3. Implement locale detection: cookie -> Accept-Language -> default `he`
4. Preserve query strings across redirects
5. Set locale cookie on redirect (1 year expiry)

**Acceptance Criteria**:

- `GET /` redirects to `/he` (default)
- `GET /` with `Accept-Language: en` redirects to `/en`
- `GET /` with cookie `locale=en` redirects to `/en` regardless of Accept-Language
- `GET /contact?utm_source=google` redirects to `/he/contact?utm_source=google` (query preserved)
- `GET /he/contact` passes through (no redirect)
- `GET /favicon.ico` passes through (no redirect)
- `GET /api/contact` passes through (no redirect)

**Tests**:

- Unit test: Middleware function with mocked `NextRequest` for each scenario above
- Integration test: Verify cookie is set after redirect

---

### Task 1.3: Implement SPA Legacy Hash Redirect Handler

**Goal**: Old SPA anchor bookmarks (`/#pricing`, `/#contact`) redirect or scroll to the correct location.

**Context**: URL fragments are not sent to the server, so this must be client-side.

**Steps**:

1. Create a `'use client'` component `LegacyHashHandler`
2. On mount, check `window.location.hash`
3. Map known hashes to new routes (`#pricing` -> `/he/pricing`, `#contact` -> `/he/contact`, `#team` -> `/he/about`)
4. For in-page anchors (`#faq`, `#modules`), scroll to the element
5. Include `LegacyHashHandler` in `app/[locale]/layout.tsx`

**Acceptance Criteria**:

- Navigating to `/#pricing` redirects to `/he/pricing`
- Navigating to `/he#faq` scrolls to the FAQ section
- No errors for unknown hashes

**Tests**:

- Unit test: Hash mapping function returns correct routes
- Component test: `LegacyHashHandler` calls `router.replace` for mapped hashes

---

### Task 1.4: Language Switcher Component

**Goal**: A component that links to the same page in the alternate locale, updating the URL path.

**Steps**:

1. Create `components/shared/LanguageSwitcher.tsx`
2. Read current locale from URL params
3. Render a link to the same path with the alternate locale prefix
4. Use Next.js `<Link>` for client-side navigation (prerendered pages = instant switch)

**Acceptance Criteria**:

- On `/he/contact`, the switcher links to `/en/contact`
- On `/en`, the switcher links to `/he`
- Switching feels instant (both pages are prerendered)

**Tests**:

- Component test: Renders correct `href` for each locale
- Component test: Renders the correct label ("EN" on Hebrew pages, "עב" on English pages)

---

## Phase 2: CMS Integration & Mock Data

**Goal**: Contentful client configured with typed queries, mock JSON fallback for local development, and all P0 content types represented as TypeScript interfaces.

**Context**: SPEC.md sections 8 (CMS Strategy) and the Local Development & Mock Data Strategy define a two-layer data system: mock JSON files that work offline and a Contentful client that takes priority when configured.

**Estimated effort**: 4-5 days

---

### Task 2.1: Create Mock Data JSON Files

**Goal**: Complete mock data for all P0 content types in `content/mock/`, matching the Contentful content model schema with inline locale fields.

**Steps**:

1. Create `content/mock/` directory
2. Create `site-settings.json` with Coming Soon phase defaults
3. Create `announcement-bar.json` with enabled announcement
4. Create `testimonials.json` with 6 mock testimonials (localized `role`, `quote`)
5. Create `team-members.json` with 4 team members (localized `role`, `bio`)
6. Create `faq-items.json` with 8 FAQ items (localized `question`, `answer`)
7. Create `pricing-plans.json` with 4 pricing tiers (localized `name`, `features`, `ctaLabel`)
8. Create `modules.json` with all 20 calculation modules (localized `name`, `summary`)
9. Create `personas.json` with 4 personas (localized fields)
10. Create `content/mock/images/` with placeholder images
11. Populate initial data from existing `constants.tsx` content

**Acceptance Criteria**:

- Every P0 content type has a corresponding JSON file
- All text fields that are localized contain both `he-IL` and `en-US` values
- Data is realistic and representative (not "lorem ipsum")
- JSON files are valid and parseable

**Tests**:

- Unit test: Each JSON file parses without error
- Unit test: Each JSON file conforms to its TypeScript interface (via Zod schema validation)
- Unit test: All localized fields contain both `he-IL` and `en-US` keys

---

### Task 2.2: Define TypeScript Types for Content Models

**Goal**: Type-safe interfaces for all P0 content types, both in app format and Contentful skeleton format.

**Steps**:

1. Create `lib/contentful/types.ts` with Contentful entry skeleton types (with `sys`, `fields` structure)
2. Create `types/app.ts` with app-facing interfaces:
   - `SiteSettings`, `AnnouncementBar`, `Testimonial`, `TeamMember`, `FaqItem`, `PricingPlan`, `Module`, `Persona`
3. Create Zod schemas for each type in `lib/contentful/schemas.ts` (used for mock data validation and runtime safety)
4. Ensure each interface matches the content model defined in SPEC.md section 8

**Acceptance Criteria**:

- Every P0 content model has a TypeScript interface and a Zod schema
- Zod schemas successfully validate the mock JSON data
- Types are exported and importable from `@/types/app` and `@/lib/contentful/types`

**Tests**:

- Unit test: Zod schema validates each mock JSON file
- Unit test: Zod schema rejects malformed data (missing required fields, wrong types)
- Type check: `pnpm typecheck` passes with all types
- **Contract tests** (critical for CMS schema drift prevention):
  - Test: missing localized values (only `en-US`, no `he-IL`) -> fallback works
  - Test: null image asset -> handled gracefully
  - Test: empty arrays -> section returns null
  - Test: missing optional fields -> defaults applied
  - Test: unexpected null in required field -> Zod rejects with clear error
  - Test: unknown enum value in `category` -> handled or rejected

---

### Task 2.3: Build Contentful Client with Mock Fallback

**Goal**: A Contentful client that fetches from the CMS when configured, falls back to mock JSON when not. The caller doesn't know which source is used.

**Steps**:

1. Create `lib/contentful/client.ts`:
   - Check `process.env.CONTENTFUL_SPACE_ID` and `CONTENTFUL_ACCESS_TOKEN`
   - If configured, create Contentful client
   - Export `isContentfulConfigured` boolean
2. Create `lib/contentful/transforms.ts`:
   - Transform functions: Contentful entry -> app type
   - Mock transform: locale extraction from inline locale fields
3. Create `lib/contentful/queries.ts` with a query function per content type:
   - `getSiteSettings()`, `getAnnouncementBar(locale)`, `getTestimonials(locale)`, etc.
   - Each function: try Contentful if configured -> catch and fallback to mock -> log failures to Sentry (available since Task 0.6)
4. Create `constants/defaults.ts` with hardcoded `SiteSettings` defaults (final fallback if both CMS and mock fail)

**Acceptance Criteria**:

- Without env vars: `pnpm dev` works using mock data, zero errors
- With env vars: Contentful data is fetched and transformed
- If Contentful fetch fails: mock data is returned, warning logged
- `getSiteSettings()` never throws - returns hardcoded defaults as last resort
- All query functions return typed data matching app interfaces

**Tests**:

- Unit test: Each query function returns correct data from mock JSON (no Contentful configured)
- Unit test: Transform functions correctly map Contentful skeleton -> app type
- Unit test: Mock locale extraction returns `he-IL` value when locale is `he`
- Unit test: Mock locale extraction falls back to `en-US` when `he-IL` is missing
- Integration test (MSW): Mock Contentful API responses, verify transform pipeline
- Integration test (MSW): Simulate Contentful 500 error, verify fallback to mock data
- Unit test: `getSiteSettings()` returns defaults when everything fails

---

### Task 2.4: Implement Phase Gating via `siteSettings`

**Goal**: A `useSiteSettings()` pattern (server-side) that controls which sections render based on the current phase.

**Steps**:

1. `getSiteSettings()` returns `SiteSettings` with all toggle booleans
2. Create helper functions:
   - `shouldShowSection(settings, sectionName)` - returns boolean based on settings + editorial constraints
   - `getCTAConfig(settings)` - returns CTA label and URL based on `ctaType` and `phase`
3. Wire into homepage server component (details in Phase 3)

**Acceptance Criteria**:

- In `coming-soon` phase: pricing hidden, signup hidden, blog hidden, testimonials hidden (unless >= 4)
- `ctaType: 'schedule-meeting'` returns "Schedule a Demo" CTA
- Changing `site-settings.json` mock data changes which sections render

**Tests**:

- Unit test: `shouldShowSection` returns correct boolean for each phase/section combination
- Unit test: `getCTAConfig` returns correct label/URL for each `ctaType`
- Unit test: Phase gating with `showTestimonials: true` but only 2 testimonials -> section hidden
- Unit test: Phase gating with `showTestimonials: true` and 5 testimonials -> section shown

---

## Phase 3: Homepage Sections

**Goal**: All homepage sections render with CMS data (or mock fallback), following the section order from SPEC.md section 13. Phase gating controls visibility.

**Context**: The homepage is a server component with explicit section composition. Each section fetches its own data via the query functions built in Phase 2. This is the P0 pattern - composable sections (SectionRenderer) ship in P1.

**Estimated effort**: 3-4 days

---

### Task 3.1: Homepage Server Component with Parallel Data Fetching

**Goal**: The homepage fetches all section data in parallel and renders sections based on `siteSettings` toggles. Matches the exact pattern from SPEC.md section 7.

**Steps**:

1. Implement `app/[locale]/page.tsx` as a server component
2. Set `export const revalidate = false` (on-demand revalidation only)
3. Fetch all data with `Promise.all` (no waterfall)
4. Apply phase gating: check `siteSettings` toggles and content thresholds
5. Pass data as props to each section component
6. Implement try/catch per section fetch - if one fails, skip that section
7. Wrap each section in a `SectionErrorBoundary` client component that catches render errors, logs to Sentry with section name tag, and returns `null` (section silently disappears rather than crashing the page)

> **Caching note**: Homepage content is statically rendered and refreshed via on-demand revalidation only (`revalidate = false`). No client-side fetching or per-request dynamic rendering.

**Acceptance Criteria**:

- Homepage renders all visible sections with mock data
- Changing `site-settings.json` toggles shows/hides sections
- A simulated fetch failure for one section doesn't crash the page
- No client-side data fetching on the homepage

**Tests**:

- Integration test: Homepage renders all expected sections with mock data
- Integration test: With `showPricing: false`, pricing section is not in rendered HTML
- Integration test: Testimonials section hidden when < 4 testimonials
- Unit test: Single section fetch failure returns partial page (other sections render)

---

### Task 3.2: Implement Layout Components (Header, Footer, Announcement Bar)

**Goal**: Shared layout components that appear on every page, respecting phase gating and locale.

**Steps**:

1. **Header** (`components/layout/Header.tsx`):
   - Logo + navigation links
   - Login/Signup links visible only when `siteSettings.showLogin`/`showSignup`
   - Phase-aware CTA button (Schedule Demo / Join Waitlist / Start Trial)
   - Mobile hamburger menu (client component for toggle state)
   - Language switcher
   - Sticky with backdrop blur on scroll
2. **Footer** (`components/layout/Footer.tsx`):
   - Organized link groups: Product, Company, Resources, Legal
   - Social media links (real URLs from constants, CMS later)
   - Language switcher
   - Copyright with dynamic year
3. **AnnouncementBar** (`components/layout/AnnouncementBar.tsx`):
   - Renders CMS `announcementBar` content
   - Dismissible (client component with localStorage persistence)
   - Color variant support (info/success/warning)
   - Hidden when `enabled: false`
4. **Skip navigation link** in `app/[locale]/layout.tsx`:
   - `<a href="#main-content">` as first focusable element
   - Visually hidden by default, visible on focus (`sr-only focus:not-sr-only`)
   - Localized text: "דלג לתוכן הראשי" / "Skip to main content"
   - Target: `<main id="main-content" tabIndex={-1}>` wraps page content
5. Wire all components into `app/[locale]/layout.tsx`

**Acceptance Criteria**:

- Header shows correct CTA for each phase
- Header hides Login/Signup in `coming-soon` phase
- Mobile menu opens/closes with smooth animation
- Footer renders with correct links in both locales
- Announcement bar dismisses and stays dismissed on refresh
- All components render correctly in RTL and LTR

**Tests**:

- Component test: Header renders "Schedule a Demo" when `ctaType: 'schedule-meeting'`
- Component test: Header hides login link when `showLogin: false`
- Component test: Footer renders copyright with current year
- Component test: AnnouncementBar renders message and dismisses
- Component test: AnnouncementBar not rendered when `enabled: false`
- Accessibility test: Mobile menu has `aria-expanded`, focus trap when open
- Accessibility test: Skip link is first focusable element, becomes visible on focus, navigates to `#main-content`

---

### Task 3.3: Implement Content Section Components

**Goal**: All homepage content sections render with typed props from CMS/mock data.

Implement each section as specified in SPEC.md section 13:

1. **Hero** - Product screenshot/video, headline, stats, phase-aware CTAs
2. **HowItWorks** - 4-step visual flow (Upload DXF -> Select modules -> Review -> Export BOQ)
3. **UseCases** - 4-persona tabbed section with CMS data
4. **ModulesGrid** - 20 modules grouped by category
5. **SecurityTrust** - Encryption, data residency, RBAC, audit trails
6. **Testimonials** - Carousel (only renders when >= 4 items AND `showTestimonials`)
7. **Pricing** - Tier cards with toggle (hidden/shown via phase gating)
8. **Team** - Grid of team members
9. **FAQ** - Accordion with category tabs, `aria-expanded` states
10. **Contact** - Heading + CTA (full form in Phase 4)
11. **CTA** - Final call-to-action section, phase-aware

**Per-section acceptance criteria**:

- Renders correctly with mock data in both locales
- Handles empty/missing data gracefully (returns `null`, doesn't crash)
- Matches design tokens from SPEC.md section 14
- Accessible: proper heading hierarchy, alt text, keyboard navigation
- Responsive at 375px, 768px, 1280px

**Tests (per section)**:

- Component test: Renders expected content with mock props
- Component test: Returns `null` when data is empty array
- Component test: Returns `null` when below minimum threshold
- Accessibility test: axe-core passes on rendered component
- Snapshot test: Stable HTML output for both locales

---

### Task 3.4: Implement Animation System

**Goal**: Section entrance animations with `motion` library, respecting `prefers-reduced-motion`.

**Steps**:

1. Create `components/shared/AnimateOnScroll.tsx` wrapper using `motion` + IntersectionObserver
2. Fade-up animation: 200ms ease-out, 8px translate
3. Staggered timing: header 0ms, hero 50ms, content 100ms, secondary 200ms
4. Wrap each homepage section with `AnimateOnScroll`
5. Check `prefers-reduced-motion` media query - disable all animations when true
6. Keep motion library imports minimal (tree-shake)

**Acceptance Criteria**:

- Sections fade in as user scrolls
- Animation disabled when `prefers-reduced-motion: reduce`
- No layout shift from animations (CLS = 0)
- `motion` adds < 15KB gzip to client bundle

**Tests**:

- Component test: `AnimateOnScroll` renders children immediately when `prefers-reduced-motion`
- Component test: `AnimateOnScroll` applies animation class when visible
- Bundle test: motion import adds < 20KB to client bundle

---

## Phase 4: Integrations

**Goal**: Working contact form with Resend, Cal.com scheduling link, PostHog analytics with consent, Sentry error monitoring, and cookie consent banner.

**Estimated effort**: 3-4 days

---

### Task 4.1: Contact Form with Resend API Route

**Goal**: A validated contact form that submits via a rate-limited API route to Resend.

**Steps**:

1. Create Zod schema for contact form: `name`, `email`, `company`, `phone?`, `message`, `consent`, `honeypot` (hidden)
2. Create `components/shared/ContactForm.tsx` (client component):
   - React Hook Form with Zod resolver
   - Honeypot hidden field
   - Timestamp hidden field (for time-to-submit check)
   - Inline validation with localized error messages
   - Loading state on submit
   - Success redirect to `/thank-you`
   - Failure: inline error + mailto fallback
3. Create `app/api/contact/route.ts`:
   - **Origin validation** (CSRF protection): reject if `Origin` header doesn't match `NEXT_PUBLIC_SITE_URL` or localhost; reject if `Content-Type` is not `application/json`
   - Server-side Zod validation
   - Reject if honeypot filled
   - Reject if submitted in < 2 seconds (bot detection)
   - **Rate limit** with fail-open policy: 5 requests/minute per IP via Upstash Redis. If Redis is unavailable (misconfigured, outage), allow the request through and log a warning to Sentry — never block legitimate users due to infrastructure failure
   - Send email via Resend API
   - Generic error responses (never expose Resend errors to client)
   - Log failures to Sentry
4. Create `app/[locale]/contact/page.tsx` with ContactForm + Cal.com button
5. Create `app/[locale]/thank-you/page.tsx` confirmation page

**Acceptance Criteria**:

- Form validates client-side and server-side
- Honeypot submissions are silently rejected
- Rate limiting blocks excessive submissions (429 response)
- Successful submission sends email and redirects to thank-you page
- Failed submission shows inline error and mailto fallback
- Form works in both locales with localized validation messages

**Tests**:

- Unit test: Zod schema validates correct data, rejects invalid
- Unit test: Honeypot detection rejects filled honeypot
- Unit test: Time-to-submit check rejects < 2s submissions
- Integration test: Request without Origin header returns 403
- Integration test: Request with wrong Origin returns 403
- Integration test: Request with Content-Type text/plain returns 415
- Integration test (MSW): API route sends to Resend, returns 200
- Integration test (MSW): API route handles Resend failure, returns error
- Integration test: Rate limiter blocks 6th request within 1 minute
- Unit test: Rate limiter returns `allowed: true` when Redis unavailable (fail-open)
- Unit test: Rate limiter logs Sentry warning when Redis unavailable
- Component test: Form shows validation errors for empty required fields
- Component test: Form shows success state after mock submission
- E2E smoke test: Full form submission flow in Playwright (with MSW)

---

### Task 4.2: Cal.com Scheduling Link

**Goal**: CTA buttons and contact sections link to Cal.com for meeting booking.

**Steps**:

1. Read `NEXT_PUBLIC_CALCOM_USERNAME` from env (fallback to hardcoded default)
2. Update CTA components to link to `https://cal.com/{username}` with `target="_blank"` and `rel="noopener noreferrer"`
3. Ensure the link is visible on the contact page alongside the form

**Acceptance Criteria**:

- CTA "Schedule a Demo" links to correct Cal.com URL
- Link opens in new tab
- Works without env var (uses default)

**Tests**:

- Component test: CTA renders correct `href` with env var
- Component test: CTA renders correct `href` with default
- Accessibility test: Link has descriptive text (not just "Click here")

---

### Task 4.3: PostHog Analytics (Consent-Aware)

**Goal**: PostHog loads only after analytics consent is granted. Events follow the taxonomy from SPEC.md section 16.

**Steps**:

1. Create `lib/analytics.ts`:
   - `initPostHog()` - only calls `posthog.init()` if consent is granted
   - `trackEvent(name, properties)` - wraps `posthog.capture()` with standard properties
   - `getStandardProperties()` - returns `page_type`, `page_slug`, `language`, `phase`
   - No raw email ever sent to PostHog (SPEC.md section 16 Identity Strategy)
2. Create analytics event constants matching SPEC taxonomy:
   - `page_viewed`, `cta_clicked`, `section_viewed`, `language_changed`, `faq_expanded`, `pricing_plan_selected`, `contact_form_started`, `contact_form_submitted`, `contact_form_failed`, `schedule_meeting_clicked`, `404_viewed`
3. Wire `initPostHog()` to consent state (from Task 4.4)
4. Add `trackEvent` calls to CTA buttons, form submission, FAQ expansion, etc.

**Acceptance Criteria**:

- PostHog does NOT initialize before consent
- After consent, events fire with correct properties
- No raw email or PII in PostHog events
- Events follow `snake_case` naming convention
- All CTA events include standard properties (type, location, page, language, phase)

**Tests**:

- Unit test: `initPostHog` does nothing when consent is not granted
- Unit test: `trackEvent` includes all standard properties
- Unit test: No PII fields (email, phone, name) in event properties
- Integration test: Consent granted -> PostHog initializes

---

### Task 4.4: Cookie Consent Banner

**Goal**: GDPR-compliant consent banner that blocks PostHog until analytics consent is granted.

**Steps**:

1. Install `vanilla-cookieconsent`
2. Create `components/layout/CookieConsent.tsx` (client component):
   - Three options: Accept All / Reject All / Customize
   - Categories: Necessary (always on), Analytics (PostHog)
   - Store consent in localStorage with timestamp
   - On accept analytics: call `initPostHog()`
   - On reject: call `posthog.opt_out_capturing()` if PostHog was previously initialized
3. Localize banner text (Hebrew and English)
4. Banner must not block content on mobile
5. Wire into `app/[locale]/layout.tsx`

**Acceptance Criteria**:

- Banner appears on first visit
- PostHog does NOT load before "Accept" or "Accept All"
- "Reject All" prevents PostHog from loading
- Consent persists across page loads (localStorage)
- Banner is dismissible and doesn't reappear after choice
- Usable on mobile (not blocking content)

**Tests**:

- Component test: Banner renders with correct locale text
- Component test: Accept All stores consent and calls `initPostHog`
- Component test: Reject All stores rejection and calls `opt_out_capturing`
- Component test: Banner doesn't render when consent already stored
- Accessibility test: Banner is focusable and keyboard-navigable

---

_Task 4.5 (Sentry) moved to Task 0.6 — Sentry is infrastructure available from Phase 0._

---

## Phase 5: SEO & Performance

**Goal**: Server-rendered metadata, OG tags, `hreflang`, structured data, sitemap, robots.txt, and performance optimizations.

**Estimated effort**: 3-4 days

---

### Task 5.1: Dynamic Metadata with `generateMetadata`

**Goal**: Every page has server-rendered meta tags, OG tags, and Twitter cards.

**Steps**:

1. Create `lib/seo.ts` with helpers:
   - `getBaseMetadata(locale)` - site name, default description, canonical base URL
   - `getPageMetadata(title, description, locale, path)` - full metadata object
   - `getOGImage(path?)` - returns OG image URL (static fallback for P0)
2. Implement `generateMetadata` in every page file:
   - `app/[locale]/page.tsx` - homepage
   - `app/[locale]/contact/page.tsx`, `schedule`, `thank-you`
   - Legal pages
3. Include `hreflang` alternate links for both locales
4. Include `x-default` pointing to `/he`
5. Self-referencing canonical on every page
6. `noindex` on `/thank-you`

**Acceptance Criteria**:

- View source shows correct `<title>`, `<meta name="description">`, OG tags
- `hreflang` links present for both locales on every page
- OG scrapers (Facebook Sharing Debugger, Twitter Card Validator) show correct preview
- Canonical URL is self-referencing
- `/thank-you` has `noindex`

**Tests**:

- Unit test: `getPageMetadata` returns correct title, description, OG for each locale
- Unit test: `hreflang` includes both locales + x-default
- Integration test: Rendered HTML contains correct meta tags
- Build test: All pages have metadata (check during build)

---

### Task 5.2: Structured Data (JSON-LD)

**Goal**: Schema.org structured data on relevant pages.

**Steps**:

1. Create `components/shared/JsonLd.tsx` - renders `<script type="application/ld+json">`
2. Implement schemas:
   - `SoftwareApplication` on every page (name, category, offers)
   - `FAQPage` on pages with FAQ section
   - `Organization` on homepage
3. Wire into page components

**Acceptance Criteria**:

- Google Rich Results Test validates structured data without errors
- JSON-LD is server-rendered (visible in view-source)

**Tests**:

- Unit test: JSON-LD output matches expected schema structure
- Unit test: FAQ schema includes all questions and answers
- Integration test: Rendered HTML contains valid JSON-LD

---

### Task 5.3: Dynamic Sitemap & Robots.txt

**Goal**: Auto-generated sitemap including all static pages for both locales. Robots.txt references the sitemap.

**Steps**:

1. Create `app/sitemap.ts`:
   - Include all P0 static routes for both locales
   - Exclude `noindex` pages (`/thank-you`)
   - Set `lastModified` to build date for static pages
   - (P1 will add CMS-driven dynamic routes)
2. Create `app/robots.ts`:
   - Allow all crawlers
   - Disallow `/api/`
   - Reference sitemap URL

**Acceptance Criteria**:

- `GET /sitemap.xml` returns valid XML with all P0 pages
- Both locale versions of each page are included
- `/thank-you` is NOT in sitemap
- `GET /robots.txt` references `/sitemap.xml`

**Tests**:

- Integration test: Sitemap XML contains expected URLs
- Integration test: Sitemap does NOT contain `/thank-you`
- Integration test: robots.txt contains `Sitemap:` directive
- Validation: Sitemap passes XML validation

---

### Task 5.4: ContentfulImage Component

**Goal**: Optimized image component using Next.js `<Image>` with Contentful Image API transforms.

**Steps**:

1. Create `components/shared/ContentfulImage.tsx` matching SPEC.md section 18
2. Features:
   - WebP format via Contentful `?fm=webp&q=80`
   - `srcSet` with multiple widths (640, 1024, 1920)
   - Blur-up placeholder via low-quality transform
   - Explicit `width`/`height` to prevent CLS
   - `priority` prop for LCP images
3. For mock data (local dev): fall back to `next/image` with local placeholder images

**Acceptance Criteria**:

- Images load as WebP
- LCP image has `priority` and `fetchpriority="high"`
- Below-fold images are lazy loaded
- No CLS from image loading (width/height always specified)
- Blur-up placeholder visible during load

**Tests**:

- Component test: Renders `<img>` with correct `src`, `srcSet`, `sizes`
- Component test: Priority image has `fetchpriority="high"`
- Component test: Alt text falls back to title when description is missing
- Component test: Renders empty string alt for missing description AND title (decorative)

---

### Task 5.5: Performance Validation

**Goal**: Verify the site meets performance budgets from SPEC.md section 18.

**Steps**:

1. Run `@next/bundle-analyzer` and verify client JS < 100KB initial
2. Verify no Contentful SDK in client bundle (server-side only)
3. Verify fonts load via `next/font` (no external font requests)
4. Verify hero image is preloaded
5. Run Lighthouse on built site (mobile, 3G throttled)
6. Create `lighthouse-budget.json` with fail thresholds from SPEC

**Acceptance Criteria**:

- Initial client JS < 100KB gzip (target from SPEC speed checklist)
- CSS < 30KB gzip
- Lighthouse Performance > 90 (P0 target), ideally > 95
- LCP < 2.5s, CLS < 0.1
- No external font requests (self-hosted via next/font)

**Tests**:

- Build test: Bundle analyzer output shows client JS < budget
- Build test: No `contentful` package in client chunks
- Lighthouse test: Run Lighthouse programmatically, assert scores above fail thresholds

---

## Phase 6: Legal, Error Pages & Deployment

**Goal**: Legal pages, 404 page, error handling, ISR revalidation webhook, and production deployment on Vercel.

**Estimated effort**: 3 days

---

### Task 6.1: Legal Pages

**Goal**: Privacy Policy, Terms of Service, and Cookie Policy pages in both locales.

**Steps**:

1. Create `app/[locale]/privacy/page.tsx`, `terms/page.tsx`, `cookie-policy/page.tsx`
2. Content: placeholder text clearly marked as "REQUIRES LEGAL REVIEW" (actual content from legal team)
3. Each page has proper metadata via `generateMetadata`
4. Pages are static (SSG, no ISR needed)

**Acceptance Criteria**:

- All three pages render in both locales
- Proper metadata and heading hierarchy
- Pages are in the sitemap

**Tests**:

- Smoke test: Each page renders without errors in both locales
- Metadata test: Each page has correct title and description

---

### Task 6.2: 404 Page

**Goal**: Custom 404 page with localized messaging, navigation links, and analytics event.

**Steps**:

1. Create `app/not-found.tsx`:
   - Localized "Page not found" message
   - Links to homepage and contact page
   - `404_viewed` analytics event with attempted URL
2. Create `app/[locale]/loading.tsx`:
   - Layout-matching skeleton for ISR-pending pages
   - Locale-aware direction

**Acceptance Criteria**:

- Unknown routes show custom 404 page
- 404 page includes navigation links back to known pages
- Analytics event fires with the attempted URL
- Loading skeleton matches page layout structure

**Tests**:

- Smoke test: `/he/nonexistent-page` renders 404 page
- Component test: 404 page renders localized text
- Component test: Loading skeleton renders in correct direction for each locale

---

### Task 6.3: ISR Revalidation Webhook

**Goal**: Contentful webhook triggers on-demand ISR revalidation for affected pages.

**Steps**:

1. Create `app/api/revalidate/route.ts` with the exact path mapping from SPEC.md section 7
2. Verify webhook secret via `x-contentful-webhook-secret` header
3. Map content type -> affected paths (homepage, about, blog, etc.)
4. Call `revalidatePath()` for each affected path
5. Return list of revalidated paths

**Acceptance Criteria**:

- Unauthorized requests (wrong/missing secret) return 401
- Valid webhook for `testimonial` change revalidates homepage for both locales
- Valid webhook for `teamMember` revalidates homepage + about for both locales
- Response includes list of revalidated paths

**Tests**:

- Integration test: Missing secret returns 401
- Integration test: Wrong secret returns 401
- Integration test: Valid `testimonial` webhook returns correct paths
- Integration test: Valid `teamMember` webhook returns homepage + about paths
- Integration test: Unknown content type returns empty paths array
- Integration test: Partial revalidation failure returns 207 with details (failed paths logged to Sentry, successful paths still revalidated)

---

### Task 6.4: Security Headers

**Goal**: Production security hardening via HTTP response headers.

**Steps**:

1. Add security headers in `next.config.ts` `headers()`, applied to all routes via `source: '/(.*)'`:
   - **CSP by directive** (refine during implementation as needed):
     - `default-src 'self'`
     - `script-src 'self' 'unsafe-inline'` + PostHog host
     - `style-src 'self' 'unsafe-inline'`
     - `img-src 'self' https://images.ctfassets.net data: blob:`
     - `font-src 'self'`
     - `connect-src 'self'` + PostHog host + `cdn.contentful.com` + Sentry ingest
     - `frame-src https://cal.com` (only if Cal.com embed is used; omit if link-only in P0)
     - `frame-ancestors 'none'` (stronger than X-Frame-Options alone)
     - `base-uri 'self'`
     - `form-action 'self'`
   - `X-Frame-Options: DENY`
   - `X-Content-Type-Options: nosniff`
   - `Referrer-Policy: strict-origin-when-cross-origin`
   - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
   - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
2. If Cal.com is only opened as external link (P0), do NOT include `frame-src cal.com` — add it in P1 when the embed ships
3. Verify site functions correctly with CSP (no console violations on any page)

**Acceptance Criteria**:

- All security headers present on every response
- CSP does not block legitimate resources (PostHog, Contentful images, Cal.com)
- No console CSP violations on any page

**Tests**:

- Integration test: Response headers include all security headers
- Smoke test: Site functions correctly with CSP enabled (navigate all pages, no console violations)

---

### Task 6.5: Health Check Endpoint

**Goal**: A lightweight health endpoint for uptime monitoring tools.

**Steps**:

1. Create `app/api/health/route.ts` (edge runtime for fast response):
   - Return `{ status: 'ok', timestamp }` when healthy
   - Optionally check Contentful connectivity (with 3s timeout) and return `'degraded'` if CMS is down
   - Return 503 if critical failure

**Acceptance Criteria**:

- `GET /api/health` returns 200 with status `ok`
- Response time < 200ms (edge runtime)
- When CMS is unreachable, returns 200 with status `degraded`

**Tests**:

- Integration test: Returns 200 with `status: 'ok'`
- Integration test: Returns 200 with `status: 'degraded'` when CMS unavailable (MSW)

---

### Task 6.6: Vercel Deployment & GitHub Actions CI

**Goal**: Automated deployment to Vercel with CI checks, branch protection, preview noindex guardrails, build validation, and documented rollback procedure.

**Steps**:

1. Connect repo to Vercel
2. Configure environment variables in Vercel dashboard (all from SPEC.md section 23)
3. Create `.github/workflows/ci.yml`:
   ```yaml
   jobs:
     quality:
       - pnpm format:check
       - pnpm lint
       - pnpm typecheck
     test:
       - pnpm test --coverage
     build:
       - pnpm build
       - node scripts/validate-build.ts # Verify all expected pages exist
   ```
4. Create `scripts/validate-build.ts`: checks `.next/server/app` for all expected P0 page outputs; fails CI if any are missing
5. Configure Vercel to deploy `main` branch to production
6. Configure Vercel PR preview deployments with `X-Robots-Tag: noindex` header (prevent staging SEO leaks)
7. Configure **branch protection rules** on `main`:
   - Require PR reviews (at least 1 approval)
   - Require all CI checks to pass
   - Disallow direct pushes to main
   - Require branch to be up-to-date before merge
   - Squash merge only (clean history)
8. Verify production build works on Vercel

**Rollback Procedure** (documented for the team):

1. **Instant rollback**: Vercel Dashboard -> Deployments -> click previous working deployment -> "Promote to Production" (< 5 seconds, no rebuild)
2. Alternative: `vercel rollback [deployment-url]` via CLI
3. After rollback, investigate on the reverted commit's preview deployment
4. **Rollback triggers** (any = immediate rollback):
   - Sentry error rate > 10 new errors/minute
   - Any P0 page returns 500
   - Contact form submissions not delivering
   - Lighthouse Performance drops below 70

**Post-Deploy Smoke Test**: After every production deployment, manually verify: Homepage (he + en), Contact form loads, Cal.com link works. (Automated E2E against production URL added in Phase 8.)

**Acceptance Criteria**:

- Push to `main` triggers production deployment
- PR creates preview deployment with `noindex` header
- CI blocks merge if format, lint, typecheck, tests, or build validation fail
- Branch protection prevents direct pushes to main
- Production site loads correctly on custom domain
- Rollback procedure is documented and tested

**Tests**:

- CI passes on a clean branch
- Build validation script catches missing pages (test with deliberately removed page)
- Preview deployment includes `X-Robots-Tag: noindex` header
- Production deployment serves pages with correct security headers

---

## Phase 7: Content Migration & QA

**Goal**: Migrate content from `constants.tsx` to Contentful, remove legacy code, and perform comprehensive QA.

**Estimated effort**: 2-3 days

### External Dependencies (Non-Engineering)

These must be ready before content migration. Track status actively.

| Dependency                    | Owner      | Needed By     | Status      |
| ----------------------------- | ---------- | ------------- | ----------- |
| Final Hebrew marketing copy   | Marketing  | Phase 7 start | Not started |
| Final English marketing copy  | Marketing  | Phase 7 start | Not started |
| Privacy Policy text           | Legal      | Phase 6.1     | Not started |
| Terms of Service text         | Legal      | Phase 6.1     | Not started |
| Cookie Policy text            | Legal      | Phase 6.1     | Not started |
| Real testimonials (>= 4)      | Marketing  | Phase 7 start | Not started |
| Team member photos & bios     | HR / Team  | Phase 7 start | Not started |
| Product screenshots           | Product    | Phase 7 start | Not started |
| Cal.com account & URL         | Operations | Phase 4.2     | Not started |
| Resend account & API key      | DevOps     | Phase 4.1     | Not started |
| PostHog account & project key | DevOps     | Phase 4.3     | Not started |
| Sentry DSN                    | DevOps     | Phase 0.6     | Not started |
| Upstash Redis instance        | DevOps     | Phase 4.1     | Not started |
| Domain DNS configuration      | DevOps     | Phase 6.6     | Not started |

**Content freeze**: 48 hours before launch. No content changes during freeze except critical fixes.

---

### Task 7.1: Contentful Space Setup & Content Migration

**Goal**: Create Contentful space, content models, and populate with data from mock JSON files.

**Steps**:

1. Create Contentful space with locales: `he-IL` (default), `en-US` (fallback)
2. Create all P0 content models matching SPEC.md section 8
3. Create `scripts/populate-contentful.ts` that reads `content/mock/*.json` and creates entries via Management API:
   - **Idempotent**: uses deterministic entry IDs based on slug or content hash. Checks if entry exists before creating; updates if it does, creates if it doesn't
   - **Dry-run mode**: `--dry-run` flag logs planned operations without writing to Contentful
   - **Summary output**: logs created/updated/skipped counts
   - **Safe to re-run** multiple times without creating duplicates
4. Run migration: `CONTENTFUL_CMA_TOKEN=xxx pnpm run populate-contentful`
5. Verify all entries in Contentful UI
6. Set Contentful env vars on Vercel
7. Configure Contentful webhook to call `/api/revalidate`
8. Verify ISR works: edit entry in Contentful -> webhook fires -> page updates

**Acceptance Criteria**:

- All P0 content models exist in Contentful
- All entries populated with correct data in both locales
- Webhook triggers ISR revalidation
- Site renders with Contentful data (not mock data)

**Tests**:

- Smoke test: Homepage renders with Contentful data
- Smoke test: Edit a testimonial in Contentful -> verify updated on site within 60 seconds
- Validation: All entries have both locale versions

---

### Task 7.2: Remove Legacy Code

**Goal**: Remove the Vite-era `constants.tsx` as the primary data source. Mock JSON files remain as dev fallback.

**Steps**:

1. Delete `constants/legacy-content.ts`
2. Verify the site still works (Contentful data or mock JSON fallback)
3. Clean up any unused imports or dead code
4. Run full test suite

**Acceptance Criteria**:

- No references to `legacy-content.ts` remain
- Site works with Contentful AND without Contentful (mock fallback)
- All tests pass

**Tests**:

- Full test suite passes
- Build succeeds
- Grep for `legacy-content` returns zero results

---

_Progressive E2E tests are defined in the standards section at the top of this document. By Phase 7, the E2E suite is already comprehensive from incremental additions after Phases 1, 3, 4, and 6._

---

### Task 7.3: Pre-Launch QA

**Goal**: Verify every item on the pre-launch checklist from SPEC.md section 21.

**Steps**:

1. Walk through every checklist item:
   - [ ] All forms tested in production
   - [ ] All analytics events validated in PostHog
   - [ ] All metadata validated (meta, OG, structured data)
   - [ ] All pages correctly indexed/noindexed
   - [ ] Cookie consent blocking PostHog until accepted
   - [ ] Accessibility: automated + manual keyboard test
   - [ ] Mobile QA: test on real iPhone + Android device
   - [ ] Hebrew RTL QA: all sections, all pages
   - [ ] Lighthouse scores above fail thresholds
   - [ ] Sentry: zero errors for 24 hours
   - [ ] Sitemap validates
   - [ ] Contact form delivers to correct email
   - [ ] Cal.com link works
   - [ ] Speed checklist (TTFB < 200ms, LCP < 1.5s target, bundle < 100KB)
2. Document any issues and fix before launch
3. Run broken link checker across all pages

**Acceptance Criteria**:

- Every checklist item passes
- Zero Sentry errors for 24 hours
- Lighthouse Performance > 90 on mobile

**Tests**:

- Playwright E2E: Navigate all P0 pages in both locales, assert no errors
- Playwright accessibility: axe-core on all P0 pages
- Lighthouse CI: All pages above fail thresholds
- Link checker: Zero broken links

---

### Task 7.4: Post-Launch Hypercare (24-48 Hours)

**Goal**: Controlled observation window after production launch to catch issues early.

**Checklist**:

- [ ] Monitor Sentry for new errors (target: zero critical/high; any recurring medium issue triaged within hypercare window)
- [ ] Verify contact form delivers email in production
- [ ] Verify analytics events appearing in PostHog
- [ ] Check Google Search Console for indexing/crawl errors
- [ ] Verify sitemap is accessible and valid
- [ ] Test on real mobile devices (iPhone + Android)
- [ ] Monitor Core Web Vitals in Vercel Analytics
- [ ] Verify ISR revalidation works: edit Contentful entry -> page updates within 60s

If any rollback trigger is hit during hypercare, rollback immediately per Task 6.6 procedure.

---

## Phase 8: New Pages & Composable Sections (P1)

**Goal**: About, Security, Solutions, Module directory, Pricing pages. Composable `SectionRenderer` + `landingPage` infrastructure.

**Estimated effort**: 8-10 days (30 days post-launch)

---

### Task 8.1: Static Pages (About, Security)

**Goal**: About page with team section, Security page with trust content.

- `app/[locale]/about/page.tsx` - team grid, company story
- `app/[locale]/security/page.tsx` - trust claims, data residency, compliance

**Tests**: Smoke tests, metadata tests, accessibility tests per page.

---

### Task 8.2: Dynamic Pages (Solutions, Modules, Pricing)

**Goal**: CMS-driven pages with `generateStaticParams`.

- `app/[locale]/solutions/[slug]/page.tsx` - persona-specific, fetches from `persona` content type
- `app/[locale]/modules/page.tsx` - full module directory
- `app/[locale]/pricing/page.tsx` - dedicated pricing with comparison

**Tests**: Per-page rendering tests, dynamic params generation tests, metadata tests.

---

### Task 8.3: Composable Section Architecture

**Goal**: `SectionRenderer` + all section block content types in Contentful.

- Create all `section*` content types in Contentful
- Create `landingPage` content type
- Implement `SectionRenderer` matching SPEC.md section 8
- Create `components/composable/Section*.tsx` for each block type
- Create `app/[locale]/lp/[slug]/page.tsx` that uses SectionRenderer
- Implement Draft Mode for preview (`app/api/draft/route.ts`)

**Tests**:

- Unit test: SectionRenderer maps content types to components
- Unit test: Unknown section type logs to Sentry, returns null
- Integration test: Landing page renders sections in CMS order
- Integration test: Draft mode shows unpublished content

---

### Task 8.4: Playwright E2E Suite & Lighthouse CI

**Goal**: Comprehensive E2E tests and automated performance budgets.

- E2E scenarios from SPEC.md section 21
- Lighthouse CI in GitHub Actions with `lighthouse-budget.json`
- Visual regression screenshots for both locales
- Accessibility audits via axe-core + Playwright

**Tests**: All E2E scenarios pass, Lighthouse scores above fail thresholds, visual regression baselines established.

---

## Phase 9: E2E Testing & Lighthouse CI (P1 continued)

### Task 9.1: Visual Regression Testing

**Goal**: Screenshot-based regression tests for RTL/LTR parity.

- Playwright screenshots at mobile (375px) and desktop (1280px) for both locales
- Stored as baseline, compared on each PR
- Flag visual diffs > 0.1% pixel difference

---

## Phase 10: Blog & Case Studies (P2)

### Task 10.1: Blog Infrastructure

- `blogPost` content type in Contentful
- `app/[locale]/blog/page.tsx` - listing with pagination
- `app/[locale]/blog/[slug]/page.tsx` - detail with `generateStaticParams`
- RSS feed at `app/[locale]/feed.xml/route.ts`
- Dynamic sitemap entries for blog posts
- Social share buttons (LinkedIn critical for B2B)

### Task 10.2: Case Studies

- `caseStudy` content type in Contentful
- Listing and detail pages
- Challenge -> Solution -> Results structure
- Dynamic sitemap entries

### Task 10.3: Newsletter Signup

- `app/api/newsletter/route.ts` with Resend
- Double opt-in flow (confirmation email -> verified subscriber)
- Rate limited (3/min per IP)

---

## Phase 11: CRM & Experimentation (P2)

### Task 11.1: CRM Integration

- HubSpot or Pipedrive integration
- Form submissions auto-create CRM contacts
- UTM attribution preserved in CRM fields

### Task 11.2: A/B Testing Framework

- PostHog feature flags
- Max 1-2 experiments simultaneously
- Hypothesis + primary metric + guardrail metrics per experiment

---

## Phase 12: Advanced Features (P3)

### Task 12.1: ROI Calculator

### Task 12.2: Site Search (Pagefind)

### Task 12.3: Resource Center

### Task 12.4: Changelog

### Task 12.5: Dynamic OG Image Generation

- `@vercel/og` for auto-generated OG images on blog posts and landing pages
- Falls back to Contentful `ogImage` if provided

---

## Appendix A: Task Dependency Graph

```
Phase 0 (Foundation)
  ├─ 0.1 Scaffold Next.js
  ├─ 0.2 Tailwind (depends on 0.1)
  ├─ 0.3 Linting + commitlint (depends on 0.1)
  ├─ 0.4 Testing infra (depends on 0.1)
  ├─ 0.5 Migrate components (depends on 0.1, 0.2)
  ├─ 0.6 Sentry (depends on 0.1)
  ├─ 0.7 Env validation (depends on 0.1)
  └─ 0.8 Version pinning (depends on 0.1)

Phase 1 (Routing) - depends on Phase 0
  ├─ 1.1 [locale] segment
  ├─ 1.2 Middleware (depends on 1.1)
  ├─ 1.3 Hash handler (depends on 1.1)
  └─ 1.4 Language switcher (depends on 1.1)
  → E2E: locale routing tests

Phase 2 (CMS) - depends on Phase 0
  ├─ 2.1 Mock data
  ├─ 2.2 TypeScript types + contract tests
  ├─ 2.3 Contentful client (depends on 2.1, 2.2, 0.6 for Sentry)
  └─ 2.4 Phase gating (depends on 2.3)

Phase 3 (Homepage) - depends on Phase 1, Phase 2
  ├─ 3.1 Homepage server component (depends on 2.3, 2.4)
  ├─ 3.2 Layout components (depends on 2.4)
  ├─ 3.3 Section components (depends on 3.1)
  └─ 3.4 Animations (depends on 3.3)
  → E2E: homepage rendering + phase gating tests

Phase 4 (Integrations) - depends on Phase 1
  ├─ 4.1 Contact form + Resend + CSRF + rate limiting (independent)
  ├─ 4.2 Cal.com link (independent)
  ├─ 4.3 PostHog (depends on 4.4)
  └─ 4.4 Cookie consent (independent)
  → E2E: form submission + consent tests

Phase 5 (SEO) - depends on Phase 3
  ├─ 5.1 Metadata (depends on 3.1)
  ├─ 5.2 Structured data (depends on 3.3)
  ├─ 5.3 Sitemap + robots (depends on 5.1)
  ├─ 5.4 ContentfulImage (depends on 2.3)
  └─ 5.5 Performance validation (depends on all above)

Phase 6 (Deploy) - depends on Phase 4, Phase 5
  ├─ 6.1 Legal pages (independent)
  ├─ 6.2 404 + loading (independent)
  ├─ 6.3 Revalidation webhook + ISR failure handling (depends on 2.3)
  ├─ 6.4 Security headers (independent)
  ├─ 6.5 Health check (independent)
  └─ 6.6 Vercel + CI + branch protection + rollback (depends on all above)
  → E2E: full smoke suite (all pages, both locales, security headers)

Phase 7 (Migration & QA) - depends on Phase 6
  ├─ 7.1 Contentful setup + migration (depends on external content)
  ├─ 7.2 Remove legacy code (depends on 7.1)
  ├─ 7.3 Pre-launch QA (depends on all)
  └─ 7.4 Post-launch hypercare (24-48h monitoring)
```

## Appendix B: Parallelization Opportunities

Phases 1 and 2 can run **in parallel** since they're independent (routing doesn't depend on CMS, and vice versa).

Within Phase 0, tasks 0.2-0.4 and 0.6-0.8 can run in parallel after 0.1 completes.

Within Phase 4, tasks 4.1-4.4 are largely independent and can be worked on in parallel.

Phase 5 tasks 5.1-5.4 can proceed in parallel once Phase 3 is complete.

Phase 6 tasks 6.1-6.5 are independent and can run in parallel before 6.6 (deployment).

## Appendix C: Test Coverage Summary

| Phase        | Unit Tests                  | Component Tests              | Integration Tests                  | E2E Tests             |
| ------------ | --------------------------- | ---------------------------- | ---------------------------------- | --------------------- |
| 0            | Build + env validation      | 1 sample + error boundary    | Sentry capture                     | -                     |
| 1            | 5+ locale utils             | 3+ routing                   | 2+ middleware                      | Locale routing        |
| 2            | 15+ types/schemas/contracts | -                            | 8+ CMS queries + drift             | -                     |
| 3            | 5+ phase gating             | 15+ sections (axe-core each) | 3+ homepage                        | Homepage rendering    |
| 4            | 12+ form/analytics/CSRF     | 8+ form/consent              | 7+ API routes (incl. rate limit)   | Form + consent flow   |
| 5            | 5+ SEO helpers              | 3+ image/jsonld              | 3+ sitemap                         | -                     |
| 6            | -                           | 3+ error/404                 | 7+ revalidation + health + headers | Full smoke suite      |
| 7            | -                           | -                            | -                                  | Full QA + hypercare   |
| **Total P0** | **~42+**                    | **~33+**                     | **~30+**                           | **Progressive suite** |

---

## Appendix D: Task Status Tracker

Updated as tasks are completed. Each task shows current status and any blockers.

| Task                                     | Status      | Notes                                                                       |
| ---------------------------------------- | ----------- | --------------------------------------------------------------------------- |
| **Phase 0: Foundation**                  |             |                                                                             |
| 0.1 Scaffold Next.js 15                  | Completed   | Next.js 16.1.7, React 19.1, TS strict, build passes                         |
| 0.2 Tailwind CSS 4                       | Completed   | Build-time via PostCSS, next/font Rubik (latin+hebrew), design tokens       |
| 0.3 Linting, Formatting, Git Hooks       | Completed   | ESLint 9 + typescript-eslint + Prettier + Husky + lint-staged + commitlint  |
| 0.4 Vitest & Testing Library             | Completed   | Vitest 3, Testing Library, jsdom 25, MSW 2, 8 tests passing                 |
| 0.5 Migrate Components from Vite         | Completed   | Components moved to sections/layout/ui, imports updated, 'use client' added |
| 0.6 Sentry Error Monitoring              | Blocked     | Needs SENTRY_DSN from manual setup                                          |
| 0.7 Environment Variable Validation      | Completed   | Zod 4 schemas, server+public, 7 unit tests passing                          |
| 0.8 Node Version & Dependency Governance | Completed   | .nvmrc (22.1.0), pnpm pinned, lockfile committed                            |
| **Phase 1: Routing**                     |             |                                                                             |
| 1.1 [locale] Dynamic Segment             | Completed   | generateStaticParams, lang/dir set server-side, /he + /en prerendered       |
| 1.2 Locale Detection Middleware          | Completed   | Cookie -> Accept-Language -> default he, query preserved                    |
| 1.3 SPA Legacy Hash Handler              | Completed   | LegacyHashHandler client component, route mapping + scroll                  |
| 1.4 Language Switcher                    | Completed   | Link-based in Header component (no callback needed)                         |
| **Phase 2: CMS**                         |             |                                                                             |
| 2.1 Mock Data JSON Files                 | Completed   | 8 JSON files with real content, Contentful locale format                    |
| 2.2 TypeScript Types & Schemas           | Completed   | App types + Zod schemas + 14 contract tests + 6 drift tests                 |
| 2.3 Contentful Client + Mock Fallback    | Completed   | Auto-detect CMS, fallback to mock, 10 query tests                           |
| 2.4 Phase Gating (siteSettings)          | Completed   | shouldShowSection + getCTAConfig, 10 tests                                  |
| **Phase 3: Homepage**                    |             |                                                                             |
| 3.1 Homepage Server Component            | Completed   | Parallel CMS data fetching, phase gating, all sections                      |
| 3.2 Layout Components                    | Completed   | Header (link-based locale), Footer, AnnouncementBar (CMS)                   |
| 3.3 Content Section Components           | Completed   | Hero, HowItWorks, Personas, Modules, Team, Testimonials, Pricing, FAQ, CTA  |
| 3.4 Animation System                     | Completed   | AnimateOnScroll component with motion library, respects reduced-motion      |
| **Phase 4: Integrations**                |             |                                                                             |
| 4.1 Contact Form + Resend                | Completed   | RHF + Zod, API route with CSRF + honeypot + time check. Email needs key.    |
| 4.2 Cal.com Link                         | Completed   | Schedule page + CTA links to cal.com/{username}                             |
| 4.3 PostHog Analytics                    | Blocked     | Needs NEXT_PUBLIC_POSTHOG_KEY from manual setup                             |
| 4.4 Cookie Consent Banner                | Deferred    | Needed only when PostHog is configured. Moving to when key is provided.     |
| **Phase 5: SEO**                         |             |                                                                             |
| 5.1 Dynamic Metadata                     | Completed   | generateMetadata, hreflang, canonical, OG tags, Twitter cards               |
| 5.2 Structured Data (JSON-LD)            | Completed   | Organization, SoftwareApplication, FAQPage schemas on homepage              |
| 5.3 Sitemap & Robots.txt                 | Completed   | Dynamic sitemap with all P0 routes, robots.txt                              |
| 5.4 ContentfulImage Component            | Completed   | WebP via Contentful Image API, priority, blur-up, responsive                |
| 5.5 Performance Validation               | Deferred    | After Vercel deploy (needs production environment)                          |
| **Phase 6: Deploy**                      |             |                                                                             |
| 6.1 Legal Pages                          | Completed   | Privacy, Terms, Cookie Policy (draft, needs legal review)                   |
| 6.2 404 Page                             | Completed   | Bilingual with links to /he and /en                                         |
| 6.3 ISR Revalidation Webhook             | Completed   | Path mapping, secret auth, partial failure handling (207)                   |
| 6.4 Security Headers                     | Completed   | CSP (by directive), HSTS, X-Frame-Options, Referrer-Policy, Permissions     |
| 6.5 Health Check Endpoint                | Completed   | Edge runtime, /api/health                                                   |
| 6.6 Vercel + CI + Rollback               | Partial     | CI pipeline created (.github/workflows/ci.yml). Vercel deploy needs account |
| **Phase 8: P1 Pages**                    |             |                                                                             |
| 8.1 About + Security pages               | Completed   | Company story, values, team grid, 6 security trust items                    |
| 8.2 Solutions + Modules + Pricing pages  | Completed   | Dynamic /solutions/[slug], modules directory, pricing page                  |
| 8.3 Composable SectionRenderer           | Not started | Needs landing page content in Contentful                                    |
| **Phase 7: Migration & QA**              |             |                                                                             |
| 7.1 Contentful Setup + Migration         | Not started | Needs Contentful credentials                                                |
| 7.2 Remove Legacy Code                   | Not started |                                                                             |
| 7.3 Pre-Launch QA                        | Not started |                                                                             |
| 7.4 Post-Launch Hypercare                | Not started |                                                                             |
