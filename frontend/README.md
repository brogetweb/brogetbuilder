# Frontend

React + Vite app for Broget Home Estate.

The full project guide — folder layout, architecture diagram, routes, API, and setup — is in the repository [README](../README.md).

## Scripts

```bash
npm install
npm run dev
npm run build
```

## Vercel

Root directory for this package is `frontend`.

- Build: `npm run build`
- Output: `dist`
- `vercel.json` sends all paths to `index.html`

Copy `.env.example` to `.env` for local work. On Vercel, set `VITE_API_URL`, `VITE_GOOGLE_MAPS_API_KEY`, `VITE_VAPI_PUBLIC_KEY`, and `VITE_VAPI_ASSISTANT_ID`, then redeploy.
