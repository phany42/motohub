# Vercel + Backend Deployment Guide

## Recommended architecture
- `frontend/` on Vercel
- `backend/` on Render (or Railway/Fly) as a long-running Node service

This backend writes CMS data to JSON files in `backend/data`. That pattern is not reliable on Vercel Serverless Functions because storage is ephemeral.

## 1) Deploy frontend to Vercel
1. Push latest code to GitHub.
2. In Vercel, click **Add New -> Project**.
3. Import this repo.
4. Set **Root Directory** to `frontend`.
5. Build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - SPA rewrites are already included via `frontend/vercel.json`
6. Add env var:
   - `VITE_API_BASE_URL=https://<your-backend-domain>/api`
7. Deploy.

## 2) Deploy backend (Render recommended)
1. Create a Render Web Service from this repo, or use `render.yaml`.
2. Ensure these environment variables are set:
   - `PORT=5000` (or Render default)
   - `DATA_DIR=/opt/render/project/src/backend/data`
   - `CORS_ORIGINS=https://<your-vercel-domain>,https://<your-custom-domain>`
3. Deploy and verify `https://<backend-domain>/api/ping`.

## 3) Connect CORS
- Add every frontend domain to `CORS_ORIGINS`, comma-separated.
- Wildcards are supported, for example:
  - `https://motohub-git-main-*.vercel.app`
  - `https://*.vercel.app`

## 4) Redeploy flow
1. Commit and push to `main`.
2. Vercel redeploys frontend automatically.
3. Render redeploys backend automatically (if auto deploy enabled).
