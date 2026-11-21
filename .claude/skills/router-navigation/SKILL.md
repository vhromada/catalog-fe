---
name: router-navigation
description: >-
  Use when adding or changing routes/navigation in catalog-fe — a new `router/<plural>Routes.ts` file, its registration in `router/index.ts`, and the `CatalogMenu.vue` nav entry. Covers the
  `meta.requiresAuth`/`requiresAdmin` guards, navbar ordering, and why a child resource extends its parent's route file instead of getting its own.
---

# Router and navigation

## Scope

`src/router/<plural>Routes.ts` (one per top-level resource), its registration in `src/router/index.ts`, and the resource's entry in `src/components/CatalogMenu.vue`.

Inline convention summary (full detail below): each route file is a default-exported plain array of three routes (`<plural>`, `add<Name>`, `edit<Name>`), every route carries
`meta.requiresAuth: true`; `index.ts` spreads the route arrays in navbar order; `CatalogMenu.vue` gets one `<li>` per top-level resource in the same order. A child resource gets neither its own
route file nor its own `CatalogMenu` entry — see Variations. See `.claude/skills/new-resource/conventions.md` for the cross-layer picture.

## Files (Genre reference)

| File                         | Purpose                        |
|------------------------------|--------------------------------|
| `router/genresRoutes.ts`     | the three genre routes         |
| `router/index.ts`            | registration (import + spread) |
| `components/CatalogMenu.vue` | the genres `<li>` nav entry    |

The real files win over the snippets below if they ever disagree.

## `genresRoutes.ts` template (embedded in full)

```typescript
import AddGenreView from '../views/genres/AddGenreView.vue';
import EditGenreView from '../views/genres/EditGenreView.vue';
import GenreListView from '../views/genres/GenreListView.vue';

export default [
  {
    path: '/genres',
    name: 'genres',
    component: GenreListView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/genres/add',
    name: 'addGenre',
    component: AddGenreView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/genres/:uuid',
    name: 'editGenre',
    props: true,
    component: EditGenreView,
    meta: {
      requiresAuth: true
    }
  }
];
```

## Registration snippet (`router/index.ts`, relevant excerpt)

```typescript
import genreRoutes from './genresRoutes.ts';
// ... every other <plural>Routes import, alphabetical among them

const routes: Array<RouteRecordRaw> = [
  {path: '/', name: 'catalog', component: CatalogView, meta: {requiresAuth: true}},
  ...moviesRoutes,
  ...showsRoutes,
  ...gamesRoutes,
  ...musicRoutes,
  ...programsRoutes,
  ...authorsRoutes,
  ...booksRoutes,
  ...jokesRoutes,
  ...genreRoutes,
  ...picturesRoutes,
  ...accountsRoutes,
  {path: '/login', name: 'login', component: LoginView},
  {path: '/registration', name: 'registration', component: RegistrationView},
  {path: '/:pathMatch(.*)*', component: PageNotFoundView}
];
```

## Navigation snippet (`CatalogMenu.vue`, relevant excerpt)

```vue
<li class="nav-item" v-if="userStore.isAdmin() || userStore.isUser()">
  <router-link id="genresNavigation" class="nav-link" :to="{name: 'genres'}">{{ t('genres.title') }}</router-link>
</li>
```

## Conventions

### Route file

- Default-exported plain array — **no** `Array<RouteRecordRaw>` type annotation on the export itself (that typing lives only in `router/index.ts`, where the combined `routes` constant is
  declared).
- Imports alphabetical by imported symbol name.
- Three routes in this order:
  - `/<plural>` → name `<plural>` → the list view.
  - `/<plural>/add` → name `add<Name>` → the add view.
  - `/<plural>/:uuid` → name `edit<Name>`, `props: true` → the edit view.
  - Add a fourth, `/<plural>/:uuid/detail` → name `<name>Detail`, `props: true` → a detail view, only when the resource has one.
- Every route carries `meta: {requiresAuth: true}`. Add `meta.requiresAdmin: true` as well, alongside `requiresAuth`, only for an admin-only resource (see `accountsRoutes.ts`) — most resources
  are user-accessible, not admin-only.

### Registration in `router/index.ts`

- Import alphabetically among the other `<plural>Routes`/`<resource>Routes` imports.
- Spread the new array into the `routes` constant in **navbar order** — the same order as the `CatalogMenu.vue` entries (currently: movies, shows, games, music, programs, authors, books, jokes,
  genres, pictures, accounts) — always before the `/login`/`/registration`/catch-all entries at the end.

### Navigation in `CatalogMenu.vue`

- One `<li class="nav-item" v-if="userStore.isAdmin() || userStore.isUser()">` per top-level resource (use `v-if="userStore.isAdmin()"` only, with no `|| isUser()`, for an admin-only resource),
  containing a single `<router-link id="<plural>Navigation" class="nav-link" :to="{name: '<plural>'}">{{ t('<plural>.title') }}</router-link>`.
- Position it in the same navbar order as the route spread above, immediately before/after the existing neighboring entries.

## Variations

- **Child resource** (Song-like, Episode/Cheat/BookItem-shaped): gets **no** own route file and **no** `CatalogMenu` entry. Instead, extend the parent's existing route file directly — add the
  child's routes (`/<parent-plural>/:<parent>/<child-plural>`, `.../add`, `.../:uuid`, optionally `.../:uuid/detail`) to that file's exported array, each with `props: true` so the parent uuid
  param reaches the view. See `musicRoutes.ts` (songs appended after the music routes) and `gamesRoutes.ts` (cheats appended after the game routes) for the exact pattern — including route names
  that don't necessarily prefix with the parent (`songs`/`addSong`/`editSong`, not `musicSongs`/...).
- **Single-object child** (Cheat-like): same "extend the parent's file" rule, but typically only three routes total (list/add/edit — no detail route, since the list view itself shows the data),
  and the "list" route often serves as the de facto detail view (see `cheats` in `gamesRoutes.ts`, pointing at `CheatListView.vue`).

## Pitfalls

- Don't give the route file's default export an explicit `Array<RouteRecordRaw>` type — that annotation belongs only on the combined `routes` constant in `index.ts`.
- Don't create a new route file or `CatalogMenu` entry for a child resource — extend the parent's file instead.
- Don't forget `props: true` on any route with a `:uuid` (or parent) path segment — without it the view's `defineProps` never receives the value.
- Don't insert the new route spread or `CatalogMenu` `<li>` at the end "to be safe" — match navbar order, which both files keep in sync with each other.

## Checklist

- [ ] Route file: plain untyped array export, alphabetical imports, the three (or four, with detail) standard routes, `meta.requiresAuth: true` on all, `requiresAdmin` only if admin-only.
- [ ] `router/index.ts`: import added alphabetically, array spread into `routes` in navbar order, before `/login`/`/registration`/catch-all.
- [ ] `CatalogMenu.vue`: one `<li>` added in navbar order, correct `userStore` guard, correct route name and i18n title key.
- [ ] Child/single-object-child resource: no new route file, no new `CatalogMenu` entry — the parent's route file was extended instead.
