# Sellit Backend

Node/Express API for Sellit with Better Auth and PostgreSQL.

## Setup

1. Start PostgreSQL:

```sh
docker compose up -d
```

2. Copy `.env.example` to `.env`.
3. Update `DATABASE_URL` and `BETTER_AUTH_SECRET`.
4. Install dependencies from this folder:

```sh
npm install
```

5. Generate the Prisma client:

```sh
npm run db:generate
```

6. Generate the Better Auth Prisma schema:

```sh
npm run auth:generate
```

7. Apply the Prisma migration:

```sh
npm run db:migrate -- --name better_auth_init
```

If you prefer Better Auth's migration command directly:

```sh
npm run auth:migrate
```

8. Start the API:

```sh
npm run dev
```

## Endpoints

- `GET /health`: backend and database health check
- `/api/auth/*`: Better Auth routes
