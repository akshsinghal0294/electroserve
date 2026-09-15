# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

ElectroServe is an e-commerce application for electronics that also supports service/repair bookings. It's a decoupled two-app repo:

- `backend/` — Spring Boot 3.2.5 (Java 17) REST API
- `frontend/` — React 19 SPA built with Vite

There is no root-level tooling tying the two together; each is built and run independently.

## Commands

### Backend (`backend/`)

```
mvn spring-boot:run       # run the API locally on port 8080
mvn clean install         # build (Dockerfile uses -DskipTests)
mvn test                  # run all tests
mvn test -Dtest=ClassName # run a single test class
```

### Frontend (`frontend/`)

```
npm run dev       # start Vite dev server
npm run build     # production build
npm run lint      # eslint
npm run preview   # preview production build
```

## Repository Structure

```text
electroserve/
├── backend/
├── frontend/
├── .claude/
│   └── skills/
├── .gitignore
└── CLAUDE.md
```

Backend source:

`backend/src/main/java/com/electroserve`

Frontend source:

`frontend/src`

## Architecture

**Backend** (`backend/src/main/java/com/electroserve/`) is a standard layered Spring Boot app:
- `controller/` → `service/` → `repository/` (JPA), with `model/` entities and `dto/` request/response shapes.
- `security/` (`JwtFilter`, `JwtUtil`) + `config/SecurityConfig` implement stateless JWT auth. `SecurityConfig.corsConfigurationSource()` is where allowed frontend origins are whitelisted — update this (not just the frontend) whenever a new frontend origin needs API access.
- Public (no-auth) endpoints: `/api/auth/register`, `/api/auth/login`, and GET on `/api/products/**`, `/api/services/**`, `/api/orders/**`, `/api/categories`, plus Swagger paths (`/v3/api-docs/**`, `/swagger-ui/**`). Everything else requires a valid JWT.
- Domain areas: products/categories (catalog), cart, orders (with `OrderStatus`/`PaymentStatus`), reviews, users/roles, and service bookings (`ServiceBooking`/`BookingStatus`) — the repair/service side of the app, separate from the product-order flow.

**Frontend** (`frontend/src/`):
- `services/api.js` is the single Axios instance all API calls go through. It attaches the JWT from `localStorage` on every request and force-logs-out (clears storage, redirects to `/login`) on any 401 response. It currently has verbose `console.log` request/response logging and a hardcoded production `baseURL` (the localhost line is commented out) — swap `baseURL` when working against a local backend.
- `context/AuthContext.jsx` and `context/CartContext.jsx` hold global auth and cart state.
- `components/ProtectedRoute.jsx` gates authenticated routes.
- `pages/admin/` is a separate admin section (dashboard, product/order/booking management) distinct from the customer-facing pages.
- Service booking UI uses `@mui/x-date-pickers` + `dayjs`.

## Deployment

- Backend: multi-stage `backend/Dockerfile` (Maven build → `eclipse-temurin` JRE runtime), exposes port 8080. Deployed to Render (frontend's `api.js` points at an `onrender.com` URL).
- Frontend: deployed to Vercel; its origin must be present in the backend's `SecurityConfig` CORS allow-list.
- No CI/CD pipeline or docker-compose is currently checked in.

## Known issue

`backend/src/main/resources/application.properties` currently contains plaintext production database credentials and the JWT signing secret committed to source control (not gitignored — only `.env` files are). Treat these as compromised; when touching this file, prefer externalizing secrets to environment variables.
