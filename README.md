# MotoHub Monorepo

This repository is now split into:
- `frontend/` - React + Vite web app
- `backend/` - Express API + JSON-based CMS data

## Local development

Install dependencies:

```bash
npm install
npm run install:all
```

Run frontend + backend together:

```bash
npm run dev
```

Frontend: `http://localhost:5173`  
Backend: `http://localhost:5000`

## Environment files

- Frontend: copy `frontend/.env.example` and set `VITE_API_BASE_URL`
- Backend: copy `backend/.env.example` and set `CORS_ORIGINS`, `DATA_DIR`, and other values

## Deployment

- Vercel frontend guide: `DEPLOY_VERCEL.md`
- Render full-stack guide: `DEPLOY_RENDER.md`
