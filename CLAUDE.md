# CLAUDE.md

Guidance for Claude Code when working on **The Quiet Minute**.

## What this is

A gentle React mindfulness app. The user picks a "mode" on the home screen and
is guided through a short flow that ends in a moment called *The Return*.

It is evolving into a **freemium** product: the core practice stays free and
open to everyone with **no account**, while an optional **members area** (daily
exercises, audio, texts) sits behind sign-in. Accounts use **Supabase**
(Phase 1, done). Paid subscriptions via **Stripe** are planned (Phase 2, not
built yet).

## Commands

```bash
npm install        # install dependencies (the SessionStart hook does this on the web)
npm run dev        # dev server at http://localhost:5173
npm run build      # tsc -b (typecheck) + vite build → dist/
npm run preview    # serve the production build
```

**Environment:** copy `.env.example` to `.env.local` and fill in
`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to enable accounts. Without
them the app runs fine as the free, account-less experience (the members entry
point simply stays hidden). The build never needs them.

**Validation:** there is no linter or test suite. After any change, run
`npm run build` — it runs the full TypeScript typecheck and then bundles, so a
clean build is the bar for "it works."

## Architecture

The free experience still lives almost entirely in `src/App.tsx`, top to bottom:

1. **`css`** — one big template string of all global styles, injected once via
   `<style>{css}</style>` in `App`. Class names are kebab-case. Interpolates
   `palette` tokens. Imports Google Fonts: **Cormorant Garamond** (serif,
   titles) and **Jost** (sans, body/UI).
2. **Shared components** — `BreathingCircle({ onComplete })` (4-count
   inhale → hold → exhale, 5 cycles, then `onComplete`) and
   `FinalActions({ onHome })` (the closing footer on every flow).
3. **Flow components** — `NoSpaceFlow`, `HeadFullFlow`, `EndOfDayFlow`,
   `JustBreatheFlow`. Each takes `{ onBack }` and is a small `step` state
   machine reusing `BreathingCircle` / `FinalActions`.
4. **`modes`** — the home-screen cards: `{ id, icon, label, subtitle }`.
5. **`QuietMinuteTool`** — holds `selected` mode state; shows the home grid (the
   free flows) plus, when accounts are configured, the link into the members
   area.
6. **`App`** — wraps everything in `<AuthProvider>`, injects `css`, renders the
   header, switches between the free tool and `PremiumArea`, and the footer.

Other modules (added as the app grows beyond a single file):

- **`src/theme.ts`** — `palette`, the single source of truth for color. Every
  color references a `palette.*` token; never hardcode a hex value.
- **`src/lib/supabase.ts`** — the Supabase client, created from env vars.
  Exports `supabase` (or `null` if unconfigured) and `isSupabaseConfigured`.
- **`src/auth/AuthContext.tsx`** — `AuthProvider` + `useAuth()`. Manages the
  session and exposes `signInWithMagicLink`, `signInWithPassword`,
  `signUpWithPassword`, `signOut`, plus `configured` / `loading` / `user`.
- **`src/auth/AuthScreen.tsx`** — the sign-in / create-account UI (magic link
  **and** email + password), styled with co-located CSS that reuses global
  classes like `.btn-primary`.
- **`src/premium/PremiumArea.tsx`** — the gated members space: shows
  `AuthScreen` when signed out, a placeholder daily-practice view when signed
  in. New paid content goes here.

`src/main.tsx` mounts `<App />`; `src/index.css` is a minimal reset.

## Adding a new flow

1. Write `function NewFlow({ onBack }: { onBack: () => void })` as a `step`
   state machine; reuse `BreathingCircle` and end with `FinalActions`.
2. Add an entry to `modes` with a unique `id`, a unicode glyph `icon`
   (e.g. `✦ ◈ ◯ ◌`), a short `label`, and a `subtitle`.
3. Render it in `QuietMinuteTool`:
   `{selected === "new-id" && <NewFlow onBack={goHome} />}`.
4. Add any new styles as classes in the `css` string, using `palette` tokens
   (imported from `./theme`).

## Auth & accounts

- Auth is **optional and additive** — the free practice must always work with no
  account and no network. Gate only members content behind `useAuth()`.
- Read state via `useAuth()`; never touch the Supabase client directly from UI.
- The anon key is public by design; keep it in `VITE_*` env vars, never commit
  `.env.local`. Anything secret (Stripe keys, webhooks) belongs server-side in a
  later phase, never in the client bundle.

## Voice & design

The copy is the product. Keep it: second person, calm, unhurried, lowercase
where it already is, no pressure or productivity framing, no exclamation. The
visual language is warm cream + muted gold, generous spacing, soft shadows,
serif headings. Match the existing tone closely — including in the auth and
members copy.

## Privacy (do not break this)

Two strictly separate worlds:

- **Flow content** — anything the user types in a *flow* (the exercises) is held
  only in React state and is **never** persisted, logged, or sent anywhere,
  **including never sent to Supabase or any database**. The "never saved"
  promise in the flow UI is absolute. Do not add storage, analytics, or network
  calls for user-entered flow text.
- **Account data** — Supabase stores only what auth needs (email, and later
  subscription status). That is the *only* thing that may leave the browser.

Never let these cross: flow text must never reach the network, an account, or
the database.
