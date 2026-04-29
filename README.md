# React CRUD Template

Forkable React CRUD starter built for:

- Vite + React + TypeScript
- Vercel Functions under `api/`
- Neon Postgres
- Drizzle ORM
- Better Auth
- TanStack Router + TanStack Query
- Tailwind CSS

## Goal

This template is designed to make forking easy:

1. copy `.env.example` to `.env.local`
2. set your database and auth env vars
3. run the database migrations
4. start building your app

The app keeps all database, auth, and OAuth logic server-only in `api/` or
`server/`. Browser code in `src/` only talks to API routes.

## Included

- Email/password auth
- Optional GitHub and Discord social login
- Protected authenticated route at `/app`
- Notes CRUD example scoped to the signed-in user
- Light and dark theme
- Local API emulator for Vite development
- Drizzle migrations for app tables and Better Auth tables

## Environment

Copy the example file:

```bash
cp .env.example .env.local
```

Minimum env vars:

```env
VITE_APP_NAME=React CRUD Template
DATABASE_URL=postgresql://username:password@your-neon-host/neondb?sslmode=require
BETTER_AUTH_SECRET=replace-with-a-random-32-char-secret
BETTER_AUTH_URL=http://localhost:5173
```

Optional social auth env vars:

```env
AUTH_SOCIAL_PROVIDERS=github,discord
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=
```

How provider visibility works:

- If provider credentials are missing, the button does not show.
- If `AUTH_SOCIAL_PROVIDERS` is empty, any configured provider is enabled.
- If `AUTH_SOCIAL_PROVIDERS` is set, only listed providers are exposed.

## Install

```bash
npm install
```

## Database Workflow

Generate migrations after schema changes:

```bash
npm run db:generate
```

Apply migrations:

```bash
npm run db:migrate
```

Open Drizzle Studio:

```bash
npm run db:studio
```

Regenerate the Better Auth Drizzle schema after auth config changes:

```bash
npm run auth:generate
```

## Local Development

Start the frontend and local API runtime together:

```bash
npm run dev
```

This runs:

- Vite for the SPA
- a local Node-based API emulator for `/api/*`

The emulator serves:

- Better Auth routes under `/api/auth/*`
- provider availability under `/api/auth/providers`
- notes CRUD endpoints under `/api/notes`

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run format
npm run format:check
npm run db:generate
npm run db:migrate
npm run db:studio
npm run auth:generate
```

## Project Structure

```text
api/         Vercel function entrypoints
server/      server-only auth, db, and service code
src/         client app, routes, and query-based UI
drizzle/     generated SQL migrations
```

## Current Routes

- `/` landing page
- `/sign-in` sign-in page
- `/sign-up` sign-up page
- `/app` protected authenticated app shell with notes CRUD

## Deploying To Vercel

Set the same env vars in Vercel project settings:

- `DATABASE_URL`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`
- optional social provider vars

Set `BETTER_AUTH_URL` to your deployed app URL, for example:

```env
BETTER_AUTH_URL=https://your-app.vercel.app
```

For OAuth providers, configure callback URLs against:

```text
https://your-app.vercel.app/api/auth/callback/<provider>
```

Examples:

- `https://your-app.vercel.app/api/auth/callback/github`
- `https://your-app.vercel.app/api/auth/callback/discord`

## Notes

- Email verification is intentionally disabled by default.
- Password reset is not included yet.
- The template currently uses a notes resource to demonstrate minimal CRUD
  without forcing a heavier domain model.
