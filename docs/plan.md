# Project Plan

## Goal

Build a forkable React CRUD template backed by Neon Postgres.

The template should be easy to adapt for new apps, with a clear server/client boundary:

- frontend as a pure Vite SPA
- serverless API on Vercel
- auth, database, and OAuth kept server-only
- minimal example domain so the template does not feel opinionated

## Product Decisions

- Frontend: Vite + React + TypeScript SPA
- Hosting: Vercel
- Rendering: client-rendered only, no SSR requirement
- Routing: TanStack Router
- Server API: Vercel Functions with REST endpoints
- Database: Neon Postgres
- ORM: Drizzle
- Migrations: included from the start
- Auth: Better Auth
- Auth providers:
  - email/password
  - GitHub OAuth
  - Discord OAuth
- Email verification: supported by architecture, disabled by default
- Password reset: deferred
- Client data fetching: TanStack Query
- Forms: React Hook Form
- Validation: Zod shared across server and client where appropriate
- Styling: Tailwind CSS + global CSS tokens
- Theme: light and dark mode, system by default with manual override
- UI library: none
- Example resource: per-user notes
- Notes fields:
  - `id`
  - `text`
  - `createdAt`
  - `updatedAt`
  - `userId` stored server-side and scoped to the authenticated user
- Delete behavior: hard delete
- Testing: Vitest recommended for initial test coverage
- Formatting: Prettier + ESLint

## Non-Negotiable Constraints

- Browser code in `/src` may only call API endpoints.
- Browser code may only use non-sensitive `VITE_*` env vars.
- All secrets and all database/auth/OAuth logic must stay server-only in `/api` or `/server`.
- Commits must use `type(scope): summary`.
- Each commit should be a single cohesive, runnable vertical slice.
- Diffs should stay small and avoid unrelated edits.

## Architecture

## Runtime Shape

- `/src` contains the SPA, routes, forms, and client-side data fetching.
- `/api` contains Vercel Functions for auth and CRUD endpoints.
- `/server` contains shared server-only modules:
  - env parsing
  - database connection
  - Drizzle schema
  - auth setup
  - server-side validation helpers

## Security Model

- `DATABASE_URL` is never available to browser code.
- Better Auth secrets and OAuth client secrets are never available to browser code.
- The SPA authenticates only through HTTP requests to server endpoints.
- The API derives the current user from the auth session and scopes note queries by `userId`.

## Auth Model

- Better Auth uses the same Postgres database in the `public` schema.
- CRUD routes require an authenticated session.
- Social login buttons should not depend on client-visible secrets or `VITE_*` flags.
- Available auth providers should be exposed safely from the server.

Recommended implementation:

- Keep provider secrets in server env only.
- Add a server-owned config layer that decides which providers are enabled.
- Expose a safe endpoint such as `GET /api/auth/providers` returning only non-sensitive booleans or names.
- The SPA uses that endpoint to decide whether to render GitHub and Discord buttons.

This allows forks to disable a provider without exposing secrets to the client.

## Database Model

Initial application table:

- `notes`
  - `id`
  - `user_id`
  - `text`
  - `created_at`
  - `updated_at`

Initial auth tables:

- Better Auth required tables in the same database and `public` schema

## API Shape

Auth endpoints:

- Better Auth handler under `/api/auth/*`
- Safe provider-config endpoint:
  - `GET /api/auth/providers`

Notes endpoints:

- `GET /api/notes`
- `POST /api/notes`
- `PATCH /api/notes/:id`
- `DELETE /api/notes/:id`

REST is preferred here because it is easier to understand, test, and fork than a custom RPC layer.

## Environment Model

Expected env vars:

- `DATABASE_URL`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`
- `GITHUB_CLIENT_ID` optional
- `GITHUB_CLIENT_SECRET` optional
- `DISCORD_CLIENT_ID` optional
- `DISCORD_CLIENT_SECRET` optional
- mail-provider vars only when email verification is enabled later

Frontend-exposed env vars:

- only non-sensitive `VITE_*` vars

Forking goal:

- a fork should work with email/password using only core auth/database env vars
- social login should become available when provider env vars are configured and enabled
- email verification should remain optional and disabled by default

## UX Scope

## Public UX

- simple landing page at `/`
- clear sign-in and sign-up actions
- responsive layout for mobile and desktop

## Auth UX

- sign in screen
- sign up screen
- social login buttons shown only for enabled providers
- authenticated session/profile view

Deferred:

- forgot password
- reset password
- email verification screens unless verification is enabled in a later slice

## Notes UX

- authenticated users only
- list notes
- create note
- edit note
- delete note
- no detail page in v1
- plain text note input via textarea

## Testing And DX

- Add Prettier for stable formatting and low-noise diffs.
- Add Vitest for targeted unit and component tests.
- Provide one top-level dev command that supports local frontend + Vercel API development.
- Include migrations and a small seed script so a fork can verify CRUD quickly.

## Seed Data

Seed data means a repeatable script that inserts minimal demo records for local verification.

Recommended seed behavior:

- create one demo user only when explicitly requested, or
- seed a few notes for the currently configured local test workflow

Because auth is required, seeding should stay minimal and predictable. The exact shape can be decided when implementing the database slice.

## Vertical Slices

## Slice 1: Foundation

Goal:

- install and configure the core stack without app features

Scope:

- Tailwind setup
- global theme tokens
- Prettier
- TanStack Router
- TanStack Query
- base app shell
- Vercel dev/runtime configuration
- `/server` and `/api` folder structure
- env parsing utilities

Exit criteria:

- app runs locally
- light/dark theme works
- routes are wired
- serverless endpoint wiring is verified

## Slice 2: Database And Auth Infrastructure

Goal:

- make the server capable of auth and database access

Scope:

- Drizzle setup
- schema and migrations
- Neon connection
- Better Auth setup
- auth tables
- auth handler route
- provider enablement config endpoint

Exit criteria:

- migrations run successfully
- auth endpoints respond
- provider availability is exposed safely from the server

## Slice 3: Auth UI Vertical Slice

Goal:

- complete real sign-up/sign-in/session flow

Scope:

- landing page
- sign in page
- sign up page
- session-aware route guards
- profile/session page
- social login buttons driven by safe server config

Exit criteria:

- user can sign up with email/password
- user can sign in and sign out
- protected routes redirect correctly
- social buttons appear only when configured

## Slice 4: Notes CRUD Vertical Slice

Goal:

- prove the template’s main CRUD story

Scope:

- notes table
- notes API handlers
- shared Zod schemas
- TanStack Query hooks
- notes list/create/edit/delete UI
- per-user data scoping

Exit criteria:

- authenticated user can create, edit, delete, and list only their own notes
- loading and error states are present
- layout works on mobile and desktop

## Slice 5: Developer Experience Finish

Goal:

- make the template easier to fork and validate

Scope:

- seed script
- `.env.example`
- README rewrite
- setup instructions for Vercel + Neon
- optional social-provider setup instructions
- initial Vitest coverage for critical pieces

Exit criteria:

- a new user can configure env vars and run the app locally
- a fork can verify auth + CRUD with minimal setup

## Open Implementation Questions

- Whether seed data should include a demo user, demo notes only, or stay fully manual
- Exact local dev command shape for Vercel Functions + Vite SPA
- Exact Better Auth schema and adapter wiring details during implementation

## Immediate Next Step

Implement Slice 1 only, as a small runnable vertical change, after reviewing this plan.
