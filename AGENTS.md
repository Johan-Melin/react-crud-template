# Agents

This file records standing repository rules and working conventions for agent-assisted changes.

## Git Workflow

- Use conventional commits with `type(scope): summary`.
- The user reviews commits before pushing.
- Do not push changes automatically.

## Repository Hygiene

- Keep local-only agent artifacts out of version control.
- Update `.gitignore` when new machine-local or tool-local files appear.
- Avoid reverting user changes unless explicitly requested.

## Planning

- Capture project-level goals, constraints, and open questions in `docs/plan.md`.
- Update the plan when implementation changes scope or direction.
