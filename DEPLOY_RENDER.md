# Render Deployment (Permanent URL)

This repo is configured to run frontend + backend on a single Render Web Service.

## What is already configured
- `render.yaml` blueprint at repo root
- Express serves API on `/api/*` and built frontend from `frontend/dist/`
- Frontend API base defaults to `/api`
- Service plan set to `free` in blueprint.

## Deploy steps (one-time in your Render account)
1. Push this repo to GitHub.
2. In Render dashboard, click **New +** -> **Blueprint**.
3. Select this repository and deploy using `render.yaml`.
4. Wait for first build to complete.
5. Open the generated `https://<service>.onrender.com` URL.
6. Add `CORS_ORIGINS` in service environment variables if frontend is on a different domain.

## Optional persistence for CMS data
- Current JSON CMS storage is file-based in `backend/data`.
- `DATA_DIR` is already set in `render.yaml`.
- Current default `DATA_DIR` is `/tmp/motohub-data` (writable but ephemeral on restart).
- For full persistence across redeploy/restart, attach a persistent disk and point `DATA_DIR` to disk mount path.

## Local check before deploy
```bash
npm --prefix frontend install --include=dev
npm --prefix backend install
npm --prefix frontend run build
npm --prefix backend start
```
Open `http://localhost:5000`.
