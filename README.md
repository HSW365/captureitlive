# Yogo

A community platform connecting yoga instructors and students worldwide — built to network positive energy through shared practice.

## Stack
- React 18 + TypeScript + Vite (static build, hash-based routing for GitHub Pages)
- Tailwind CSS with a custom "sunrise energy" design system (coral, amber, teal, violet)
- Supabase (Postgres + Auth) — tables prefixed `yogo_`, row-level security on everything
- TanStack Query for data fetching/caching

## Local development
```bash
npm install
npm run dev
```

## Deploy
Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds and publishes to GitHub Pages automatically. Enable Pages in repo settings → Pages → Source: GitHub Actions.

## Database
Supabase project `friendy` (ref `ucgymjcenpddqshokybj`). Schema: profiles, posts, likes, comments, classes, RSVPs, follows — all `yogo_`-prefixed to coexist safely with other apps sharing this project.
