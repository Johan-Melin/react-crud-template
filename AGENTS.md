# Agents

This file records standing repository rules and working conventions for agent-assisted changes.

## Git Workflow

- Use conventional commits with `type(scope): summary`.
- Push commits automatically unless the user asks to review first.
- Make a single cohesive, runnable change per commit.
- Prefer vertical slices over horizontal refactors.
- Avoid unrelated edits and keep diffs small enough to review comfortably.

## Repository Hygiene

- Keep local-only agent artifacts out of version control.
- Update `.gitignore` when new machine-local or tool-local files appear.
- Avoid reverting user changes unless explicitly requested.
- Keep all secrets and database/auth/OAuth logic server-only in `/api` or `/server`.
- Browser code in `/src` may only call API endpoints and may only use non-sensitive `VITE_*` env vars.

## Planning

- Capture project-level goals, constraints, and open questions in `docs/plan.md`.
- Update the plan when implementation changes scope or direction.
