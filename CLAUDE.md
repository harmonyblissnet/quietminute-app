# CLAUDE.md

Guidance for Claude Code when working on **The Quiet Minute**.

## What this is

A static, single-page React mindfulness app. No backend, no router, no state
library, no persistence. The user picks a "mode" on the home screen and is
guided through a short, gentle flow that ends in a moment called *The Return*.

## Commands

```bash
npm install        # install dependencies (the SessionStart hook does this on the web)
npm run dev        # dev server at http://localhost:5173
npm run build      # tsc -b (typecheck) + vite build → dist/
npm run preview    # serve the production build
```

**Validation:** there is no linter or test suite. After any change, run
`npm run build` — it runs the full TypeScript typecheck and then bundles, so a
clean build is the bar for "it works."

## Architecture

Almost everything lives in `src/App.tsx`, organized top to bottom:

1. **`palette`** — the single source of truth for color. Every color in the app
   references a `palette.*` token. Never hardcode a hex value; add or reuse a
   token.
2. **`css`** — one big template string of all styles, injected once via
   `<style>{css}</style>` in `App`. Class names are kebab-case. Interpolates
   `palette` tokens. Imports Google Fonts: **Cormorant Garamond** (serif, used
   for titles) and **Jost** (sans, used for body/UI).
3. **Shared components**
   - `BreathingCircle({ onComplete })` — the guided breath. 4-count
     inhale → hold → exhale, 5 cycles, then calls `onComplete`. Drives the
     animated circle size/glow off the current phase.
   - `FinalActions({ onHome })` — the closing footer (a "learn more" link +
     "back home" button) shown at the end of every flow.
4. **Flow components** — `NoSpaceFlow`, `HeadFullFlow`, `EndOfDayFlow`,
   `JustBreatheFlow`. Each takes `{ onBack }` and is a small `step` state
   machine (`const [step, setStep] = useState(0)`) that renders different
   content per step and reuses `BreathingCircle` / `FinalActions`.
5. **`modes`** — the array of home-screen cards: `{ id, icon, label, subtitle }`.
6. **`QuietMinuteTool`** — holds `selected` mode state; shows the home grid or
   the matching flow.
7. **`App`** — injects `css`, renders the page header, the tool, and the footer.

`src/main.tsx` mounts `<App />`; `src/index.css` is a minimal reset.

## Adding a new flow

1. Write `function NewFlow({ onBack }: { onBack: () => void })` as a `step`
   state machine; reuse `BreathingCircle` and end with `FinalActions`.
2. Add an entry to `modes` with a unique `id`, a unicode glyph `icon`
   (e.g. `✦ ◈ ◯ ◌`), a short `label`, and a `subtitle`.
3. Render it in `QuietMinuteTool`:
   `{selected === "new-id" && <NewFlow onBack={goHome} />}`.
4. Add any new styles as classes in the `css` string, using `palette` tokens.

## Voice & design

The copy is the product. Keep it: second person, calm, unhurried, lowercase
where it already is, no pressure or productivity framing, no exclamation. The
visual language is warm cream + muted gold, generous spacing, soft shadows,
serif headings. Match the existing tone closely when editing or adding copy.

## Privacy (do not break this)

Anything the user types in a flow is held only in React state and is **never**
persisted, logged, or sent anywhere. Do not add storage, analytics, or network
calls for user-entered text. The "never saved" promise is explicit in the UI.
