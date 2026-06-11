# The Quiet Minute

> One quiet minute. That's all this is.

A small, single-page web practice for coming back to yourself. Choose where
you are right now, and The Quiet Minute walks you through a brief, gentle
moment — a few breaths, a place to set something down, a way to close the day.
A practice by [Naomi Etnel](https://naomietnel.com).

## The four flows

From the home screen you pick whichever fits the moment:

| Mode | For when… | What happens |
| --- | --- | --- |
| **No space for me** | You keep coming last | A reminder the minute is yours → breathe → one small thing for you |
| **Mind racing** | You can't land anywhere | Write out whatever is heavy (never saved) → let it go → breathe |
| **End of day** | You're ready to let go | Name one good thing → choose what to carry → breathe the day out |
| **Just breathe** | One quiet minute, nothing more | A single guided breathing minute |

Each flow ends in a moment called **The Return** and a quiet link to learn more.

**Privacy:** anything you type in a flow lives only in the browser as React
state. It is never sent anywhere, saved, or stored — it disappears the moment
you let go.

## Tech stack

- [React 19](https://react.dev/) + TypeScript
- [Vite](https://vite.dev/) for dev server and build
- No backend, no database, no analytics — the whole app is static

## Getting started

```bash
npm install      # install dependencies
npm run dev      # start the dev server (http://localhost:5173)
```

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the Vite dev server with hot reload |
| `npm run build` | Typecheck (`tsc -b`) **and** build to `dist/` |
| `npm run preview` | Serve the production build locally |

There is currently no separate linter or test suite — `npm run build` is the
validation step, since it runs the full TypeScript typecheck before bundling.

## Project structure

```
index.html          Entry HTML, mounts #root
src/
  main.tsx          React root / StrictMode
  App.tsx           The entire app: palette, styles, components, all four flows
  index.css         Minimal CSS reset
```

`src/App.tsx` is intentionally self-contained. See [CLAUDE.md](./CLAUDE.md) for
a tour of its architecture and the pattern for adding a new flow.

## Claude Code on the web

This repo is set up to be updated by
[Claude Code on the web](https://code.claude.com/docs/en/claude-code-on-the-web).
A `SessionStart` hook (`.claude/hooks/session-start.sh`) installs dependencies
automatically at the start of each remote session, so Claude can build and
typecheck the project without manual setup. Project conventions live in
[CLAUDE.md](./CLAUDE.md).
