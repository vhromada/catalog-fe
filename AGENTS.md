# AI Agent Guidelines – Catalog FE

This document provides essential information for AI agents (Claude, Copilot, Cursor, etc.) working on the Catalog FE project.

## 🛠 Tech Stack
- **Language:** TypeScript (strict)
- **Framework:** Vue 3 (Composition API, `<script setup>`)
- **Build Tool:** Vite
- **Routing:** vue-router
- **i18n:** vue-i18n
- **Forms/Validation:** vee-validate + yup
- **HTTP:** axios
- **CSS Framework:** Bootstrap 5
- **Misc:** mitt (event bus), vue-logger-plugin
- **Prerequisites:** Node.js (latest LTS), npm

## 🚀 Key Commands
- **Install:** `npm install`
- **Dev server:** `npm run dev`
- **Build (type-check + bundle):** `npm run build`
- **Type check only:** `npm run type-check`
- **Lint (auto-fix):** `npm run lint`

There is currently no automated test suite (no unit/e2e test files or runner configured) — verify changes via `npm run build`/`npm run type-check` and manual checks in the dev server.

## 🧩 Architectural Patterns

### Data flow
```
Connector → Store → View / Component
```
- **`connector`** — one class per REST resource (e.g. `GenreConnector`), thin wrapper around the shared `catalogConnector` (`connector/common/CatalogConnector.ts`). Each method maps 1:1 to a backend endpoint and returns `Promise<Result<T>>`. Exports both the class and a default singleton instance. `connector/common/Support.ts` builds the axios client, request IDs and logging.
- **`store`** — one class per resource (e.g. `GenreStore`), **not** Pinia/Vuex. Plain class instantiated per view (`const store = new GenreStore()`), holding Vue `Ref`s for state (list data, statistics, paging) and wrapping connector calls with paging/filter/reload logic, exposing imperative methods (`load`, `search`, `first`/`previous`/`next`/`last`, `add`, `update`, `remove`, `duplicate`, `exists`, `isPagingAllowed`, ...). Views call store methods directly and read `store.x.value` in the template.
- **`views/<resource>`** — route-level pages (typically `List`, `Add`, `Edit`), wired up in `router/<resource>Routes.ts`.
- **`components/<resource>`** — reusable pieces used by views of that resource (e.g. `GenreForm.vue` for create/edit, `GenreMenu.vue` for resource navigation). Cross-resource reusable components live directly in `components` (e.g. `NameSearchForm.vue`, `ResultError.vue`).

### Result pattern
All connector/store calls return `Result<T>` (`model/common/Result.ts`), never throw for expected HTTP failures:
- `status`: `OK`, `CLIENT_ERROR`, `SERVER_ERROR`, `FAILURE`, `TIMEOUT`
- `isOk()`: convenience check used throughout stores/views
- On failure, `ClientConnector` (`connector/common/CatalogConnector.ts`) emits a `result-error` event on the shared `emitter` (`utils/Event.ts`, built with `mitt`) carrying a modal-ready payload (`modalOpen(result)` from `model/common/View.ts`), which opens the global error modal (`ResultError.vue`) — callers don't need to handle the error UI themselves, just check `isOk()` to decide whether to proceed (e.g. reload a list after a mutation).

### Model pattern
Each domain model file (`model/<Name>.ts`) exports three things:
- `I<Name>` — interface matching the API DTO shape.
- `<Name>` — a class with sane defaults, used as the vee-validate `initialValues` for add/edit forms.
- `get<Name>Schema()` — a function returning a `yup` schema, built inside a function (not a module-level constant) because it calls `useI18n()` for localized validation messages.

### Auth
`store/UserStore.ts` holds the logged-in user/session state and is consulted by the router guard and by `ClientConnector` (sends `X-User` header). Login/registration flows live in `views/login` and `views/registration`, backed by `RegisterConnector`/`RegisterStore` and the shared `catalogConnector`.

### Configuration
Build-time/runtime config comes from `VITE_APP_*` env vars (see `.env.development.local` for local dev values) merged with an optional runtime `/config.json`, resolved once through `utils/Config.ts` and exported as a singleton (`config`). Includes API base URL/credentials, logging flags, and paging sizes (`itemsPerPage`, `allDataCount`).

## 🧪 Testing Strategy
No test framework is currently configured. Validate changes with:
- `npm run type-check` — TypeScript correctness.
- `npm run lint` — ESLint (flat config: `plugin:vue/flat/essential` + `@vue/eslint-config-typescript`, Prettier formatting rules skipped).
- Manual verification via `npm run dev` for anything touching UI/UX.

## 📝 Coding Standards
- **Components:** `<script setup lang="ts">` + Composition API only.
- **i18n:** Never hardcode user-facing strings — add keys to `src/i18n/locales` and use `t('...')`.
- **Validation:** Build form schemas with `yup` via a `get<Name>Schema()` function (see a Model pattern above); render field errors with `<ErrorMessage :errors="errorBag.<field>"/>`. **Exception:** `PictureForm.vue` doesn't use vee-validate/yup at all — plain `ref`s for the file and a hand-rolled `error` message, since the validation (file-size check) doesn't map to a schema field. Keep this in mind before "fixing" it into the yup pattern.
- **Naming:** `.vue` components in PascalCase; one connector/store/model class per resource, named `<Name>Connector`/`<Name>Store`/`<Name>`.
- **Imports:** Use explicit `.ts`/`.vue` extensions in relative imports (matches existing code).
- **Style:** Follow existing formatting; don't fight the ESLint/Prettier config — run `npm run lint` before finishing.

## 📂 Project Structure
- `src/connector`: REST clients, one per resource; `connector/common` holds the shared axios wrapper (`CatalogConnector.ts`) and request/error helpers (`Support.ts`).
- `src/store`: per-resource state classes consumed by views.
- `src/model`: domain models/interfaces/validation schemas; `model/common` holds shared types (`Result`, `Paging`, `Filter`, `Link`, `Time`, `View`, `Exchange`).
- `src/views/<resource>`: route-level pages.
- `src/components/<resource>`: resource-specific reusable components; `src/components` root holds cross-resource shared components.
- `src/router`: one `<resource>Routes.ts` per resource (array of `RouteRecordRaw`), aggregated in `router/index.ts`, which also defines the global `beforeEach` auth guard (`meta.requiresAuth`, `meta.requiresAdmin` against `userStore`).
- `src/i18n/locales`: translation JSON files.
- `src/formatters`: shared value formatters.
- `src/utils`: cross-cutting helpers (`Config.ts` env/config loader, `Event.ts` mitt emitter, `Logger.ts`, `Modal.ts`, `Timer.ts`, `SearchParams.ts`).

## 🤖 Agent Instructions
When working on this project, always:
1. **Commands:** Use `npm` scripts (`npm run dev`, `npm run build`, `npm run type-check`, `npm run lint`) — never invoke `vite`/`vue-tsc`/`eslint` directly unless a script doesn't cover the need.
2. **New resource pages:** Follow the existing pattern for an existing resource (e.g. `genres`): add a `model/<Name>.ts`, `connector/<Name>Connector.ts`, `store/<Name>Store.ts`, `views/<resource>/*.vue`, `components/<resource>/*.vue`, and `router/<resource>Routes.ts` registered in `router/index.ts`.
3. **Result handling:** Always check `Result.isOk()` before using `.data` or proceeding to a follow-up action; don't add manual error-toast/alert handling — the global `result-error` flow already covers it. See `connector/GenreConnector.ts` + `store/GenreStore.ts` for a reference implementation.
4. **i18n:** Add new user-facing strings to `src/i18n/locales` rather than inlining text.
5. **Verification:** Run `npm run type-check` and `npm run lint` after changes; for UI-affecting changes, check the page in `npm run dev`.
6. **Code Style:** Match the Composition API `<script setup>` style and existing naming conventions; don't introduce Pinia/Vuex or a different state pattern.
