---
name: local-dev
description: Start the ElectroServe backend and frontend together for local development. Use when the user wants to run, start, or test the app locally (not deploy it).
---

# Local dev setup

ElectroServe is two separate apps that must run side by side: the Spring Boot API (port 8080) and the Vite React SPA (port 5173).

## Steps

1. **Point the frontend at localhost.** `frontend/src/services/api.js` hardcodes the production API URL. Before running locally, edit it so the localhost baseURL is active:
   ```js
   baseURL: "http://localhost:8080",
   // baseURL: "https://electroserve-bzyd.onrender.com",
   ```
   Revert this before committing/deploying — do not commit the localhost URL as the active one.

2. **Start the backend** (from `backend/`):
   ```
   mvn spring-boot:run
   ```
   Uses the datasource/JWT config in `backend/src/main/resources/application.properties` (points at the shared Neon Postgres instance — there is no separate local DB config). Runs on `http://localhost:8080`. Swagger UI is at `http://localhost:8080/swagger-ui.html`.

3. **Start the frontend** (from `frontend/`), in a separate terminal:
   ```
   npm install   # first time only
   npm run dev
   ```
   Runs on `http://localhost:5173`.

4. **CORS**: `http://localhost:5173` is already whitelisted in `backend/src/main/java/com/electroserve/config/SecurityConfig.java`, so no backend changes are needed for local frontend dev.

## Notes

- Both apps hit the same remote Neon Postgres database used in production — there's no local/seed database. Be careful with destructive actions (deleting products, orders, etc.) while testing.
- `frontend/src/services/api.js` logs every request/response (URL, token, status) to the browser console — useful for debugging auth issues locally.
- To log in as an existing user, use `/api/auth/login`; to create one, `/api/auth/register` (both public endpoints). Admin-only pages (`pages/admin/`) require a user with the admin role in the database.
