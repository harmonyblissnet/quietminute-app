#!/bin/bash
# SessionStart hook for Claude Code on the web.
# Installs dependencies so Claude can build and typecheck The Quiet Minute
# automatically at the start of every remote session.
set -euo pipefail

# Only run in Claude Code on the web / remote environments. Locally you
# already manage your own dependencies, so there is nothing to do.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "${CLAUDE_PROJECT_DIR:-.}"

# Install dependencies. `npm install` (not `npm ci`) so the cached container
# layer is reused on later sessions and is safe to re-run.
npm install
