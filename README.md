# Catalog FE

Web frontend for the catalog of movies, shows, games, music, programs, books and jokes. It is a single-page application that consumes the REST API.

## Tech stack

- Vue 3 (Composition API, `<script setup>`), TypeScript, Vite
- vue-router, vue-i18n, vee-validate + yup, axios
- Bootstrap 5

## Prerequisites

- Node.js 26
- npm
- Running `catalog-be` instance (by default on `http://localhost:8100/rest/`)

## Getting started

```bash
npm install
npm run dev
```

## Scripts

| Command              | Description                                |
|----------------------|--------------------------------------------|
| `npm run dev`        | Start the Vite dev server                  |
| `npm run build`      | Type-check and build the production bundle |
| `npm run type-check` | Type-check only                            |
| `npm run lint`       | Lint with ESLint (auto-fix)                |
| `npm run preview`    | Preview the production build               |

## Configuration

Configuration comes from `VITE_APP_*` environment variables (for local development see `.env.development.local`), which can be overridden at runtime
by `public/config.json` (a `null` value means "not overridden").

| Variable                        | Description                              |
|---------------------------------|------------------------------------------|
| `VITE_APP_CATALOG_URL`          | Base URL of the catalog REST API         |
| `VITE_APP_CATALOG_USERNAME`     | Username for API authentication          |
| `VITE_APP_CATALOG_PASSWORD`     | Password for API authentication          |
| `VITE_APP_HASH_SALT`            | Salt used for password hashing           |
| `VITE_APP_LOG_ENABLED`          | Enable logging                           |
| `VITE_APP_LOG_CONSOLE_ENABLED`  | Enable logging to the console            |
| `VITE_APP_ITEMS_PER_PAGE`       | Number of items per page                 |
| `VITE_APP_ALL_DATA_COUNT`       | Page size used when loading all data     |

## Project structure

- `src/connector` – REST clients, one per resource
- `src/store` – per-resource state classes
- `src/model` – domain models and validation schemas
- `src/views` – route-level pages
- `src/components` – reusable components
- `src/router` – route definitions and auth guard
- `src/i18n/locales` – translations

## License

[MIT](LICENSE)
