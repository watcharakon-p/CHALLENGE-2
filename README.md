# CHALLENGE 2 — TREE & HIERARCHY RENDERING

This is a sample full‑stack project with two main parts:

- `server/` — REST API built with Express + Prisma (PostgreSQL)
- `web/` — Next.js (React) web app

You can run it with Docker Compose or run each service locally.

## Tech Stack
- Server: Node.js 20, Express 5, Prisma 6
- DB: PostgreSQL 16
- Web: Next.js 15, React 19
- Runtime: Docker/Docker Compose (optional)

## Directory Structure
```
.
├─ server/
│  ├─ src/
│  │  ├─ index.ts               # API server entry point
│  │  ├─ routes/                # API route files
│  │  │  ├─ search.route.ts     # GET /api/search
│  │  │  ├─ nodeRoot.route.ts   # GET /api/nodes/root
│  │  │  └─ nodeChild.route.ts  # GET /api/nodes/:id/children
│  │  ├─ seed/                  # Seed scripts
│  │  │  └─ seed-database.*
│  │  ├─ db.ts                  # Prisma client
│  │  └─ types.ts
│  ├─ prisma/
│  │  └─ schema.prisma          # Node model
│  ├─ Dockerfile
│  └─ .env.example
├─ web/
│  ├─ src/ ...                  # Next.js code
│  └─ Dockerfile
└─ docker-compose.yml
```

## Environment Variables
Sample file is at `server/.env.example`

```
DATABASE_URL="postgress://root:root@db:5432/challenge_2?schema=public"
CORS_ORIGIN="http://localhost:3000"
PORT=3001
```

Note: The example `DATABASE_URL` contains a typo. Change `postgress` to `postgres` (without the extra g).

- For Docker Compose, use:
  ```
  DATABASE_URL="postgres://root:root@db:5432/challenge_2?schema=public"
  ```
- For local runs (Postgres on your machine), use `localhost` instead of `db`:
  ```
  DATABASE_URL="postgres://<USER>:<PASS>@localhost:5432/challenge_2?schema=public"
  ```

Copy the `.env` file into the `server/` folder:
```
cp server/.env.example server/.env
# Then edit values as needed
```

## Quick Start (Docker Compose)
Make sure Docker and Docker Compose are installed.

1) Start all services
```
docker compose up --build
```

2) Once everything is up:
- API at `http://localhost:3001`
- Web at `http://localhost:3000`
- Postgres at port `5432`

Notes:
- The `server` container runs `prisma generate` and `prisma migrate dev --name init` automatically.
- You can seed data via `POST /dev/seed` (see API section below).

Stop services:
```
docker compose down
```

Remove database volume:
```
docker compose down -v
```

## Run Locally (without Docker)
Requires Node.js 20+ and PostgreSQL 16+

1) Create a Postgres database named `challenge_2` (or another name and update `DATABASE_URL`).
2) Prepare `server/.env` as above.
3) Install dependencies
```
# In server/
npm install
npx prisma generate
npx prisma migrate dev --name init

# In web/
npm install
```
4) Run both dev servers in separate terminals
```
# server/
npm run dev  # starts at http://localhost:3001

# web/
npm run dev  # starts at http://localhost:3000
```

## Prisma Model
The file `server/prisma/schema.prisma` defines the `Node` model:
- `id: String @id` (cuid)
- `parentId: String?` — self-referencing parent-child relation
- `name: String`
- `hasChildren: Boolean`
- `sort: Int` — ordering index

## API Endpoints (Server)
Base URL: `http://localhost:3001`

- GET `/health`
  - Health check
  - Example:
    ```bash
    curl http://localhost:3001/health
    ```

- POST `/dev/seed?breadth=20&depth=6`
  - Seed tree-shaped sample data (defaults: breadth=20, depth=6, cap=50000)
  - Example:
    ```bash
    curl -X POST "http://localhost:3001/dev/seed?breadth=10&depth=4"
    ```

- GET `/api/nodes/root`
  - Return all root nodes (ordered by `sort`)
  - Example:
    ```bash
    curl "http://localhost:3001/api/nodes/root"
    ```

- GET `/api/nodes/:id/children`
  - Return children of a node by `id` (ordered by `sort`)
  - Example:
    ```bash
    curl "http://localhost:3001/api/nodes/<NODE_ID>/children"
    ```

- GET `/api/search?q=<keyword>&limit=<n>`
  - Search by `name` keyword and return the path (`path`) of matching root nodes using a recursive CTE in Postgres.
  - Parameters:
    - `q`: query keyword (required)
    - `limit`: max results (1–100, default 100)
  - Example:
    ```bash
    curl "http://localhost:3001/api/search?q=foo&limit=20"
    ```

Note: CORS is enabled in `server/src/index.ts`, allowing origins from `CORS_ORIGIN` in `.env` (e.g., `http://localhost:3000`).

## Important Scripts
In `server/package.json`:
- `npm run dev` — run the server with tsx
- `npm run build` — compile TypeScript to `dist/`
- `npm start` — run from `dist/index.js`
- `npm run prisma:generate` — generate Prisma Client
- `npm run prisma:migrate` — run `prisma migrate dev --name init`

In `web/package.json`:
- `npm run dev` — run Next.js dev server (Turbopack)
- `npm run build` — production build
- `npm start` — start production server

## Troubleshooting
- If `DATABASE_URL` host is wrong (e.g., using `db` when running locally), the server cannot connect. Use `localhost` when not using Docker.
- If the first Docker run fails, try removing volumes and rebuild: `docker compose down -v && docker compose up --build`
- Check for port conflicts: 3000 (web), 3001 (api), 5432 (db)

## License
This code is provided for internal testing/demonstration or personal use. Adapt as needed.

