# Catalog FE shared conventions

Referenced by every layer skill in `.claude/skills/`. Each layer skill also carries a short inline summary of the parts that matter most for that layer, so it works standalone — read this file when
you need the full picture or a cross-layer rule. The real Genre files always win over any snippet here or in a layer skill if they ever disagree — re-read the file, don't rely on memory of it.

## Canonical reference resource: Genre

Genre is the simplest resource in the codebase (a single `name` field, no parent/child relationship, no composite fields) and is the template source for every layer skill.

| Layer          | File(s)                                                                                                         |
|----------------|-----------------------------------------------------------------------------------------------------------------|
| Model          | `src/model/Genre.ts`                                                                                            |
| Connector      | `src/connector/GenreConnector.ts`                                                                               |
| Store          | `src/store/GenreStore.ts`                                                                                       |
| Form component | `src/components/genres/GenreForm.vue`                                                                           |
| Menu component | `src/components/genres/GenreMenu.vue`                                                                           |
| Views          | `src/views/genres/GenreListView.vue`, `src/views/genres/AddGenreView.vue`, `src/views/genres/EditGenreView.vue` |
| Routes         | `src/router/genresRoutes.ts`, registered in `src/router/index.ts`                                               |
| Navigation     | `src/components/CatalogMenu.vue` (the genres `<li>` entry)                                                      |
| i18n           | `src/i18n/locales/en.json` (the `genres` block)                                                                 |

### Variant references

Reach for one of these instead of Genre when the new resource doesn't fit the simple shape:

| Variant | What it shows                                                                                      | Key files                                                                                                       |
|---------|----------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------|
| Movie   | Composite resource (multiple required name fields), `Change<Name>Request`, `Time`, pickers, upload | `model/Movie.ts`, `components/movies/MovieForm.vue`                                                             |
| Music   | `normalize()` cleanup, numeric field                                                               | `model/Music.ts`                                                                                                |
| Song    | Simple child under `Music` (paging, no statistics)                                                 | `model/Song.ts`, `connector/SongConnector.ts`, `store/SongStore.ts`, `components/songs/*`, `views/songs/*`      |
| Cheat   | Single-object child under `Game` (no paging/filter, one object per parent)                         | `model/Cheat.ts`, `connector/CheatConnector.ts`, `store/CheatStore.ts`, `components/cheats/*`, `views/cheats/*` |
| Picture | File upload, no model file, no statistics                                                          | `connector/PictureConnector.ts`, `store/PictureStore.ts`, `components/pictures/PictureForm.vue`                 |

## Data flow and the Result pattern

```
Connector → Store → View / Component
```

- **`connector`** — one class per REST resource, a thin wrapper around the shared `catalogConnector` (`src/connector/common/CatalogConnector.ts`). Each method maps 1:1 to a backend endpoint and
  returns `Promise<Result<T>>`. Exports both the class and a default singleton instance.
- **`store`** — one class per resource, **not** Pinia/Vuex. A plain class instantiated per view (`const store = new GenreStore()`), holding Vue `Ref`s for state and wrapping connector calls with
  paging/filter/reload logic.
- **`views/<resource>`** — route-level pages, wired up in `router/<resource>Routes.ts`.
- **`components/<resource>`** — reusable pieces used by views of that resource.

All connector/store calls return `Result<T>`/`IResult` (`model/common/Result.ts`) and never throw for expected HTTP failures — `status` is one of
`OK`/`CLIENT_ERROR`/`SERVER_ERROR`/`FAILURE`/`TIMEOUT`, and `isOk()` is the convenience check used throughout stores/views. On failure, `ClientConnector` (`src/connector/common/CatalogConnector.ts`)
emits a `result-error` event on the shared `emitter` (`src/utils/Event.ts`, built with `mitt`) carrying `modalOpen(result)` (`model/common/View.ts`), which opens the global error modal
(`src/components/ResultError.vue`). Callers don't implement any error UI themselves — they only check `isOk()` to decide whether to proceed (e.g. reload a list after a mutation, or push a route after
a successful add/update).

Stores are plain classes instantiated per view (`new <Name>Store()`), never Pinia/Vuex, never a singleton for list/paging state (the connector default export is the only singleton).

## Resource-shape decision table

Pin the shape down before invoking any layer skill — it changes the signature of every layer.

|                           | Simple (Genre-like)                      | Child (Song-like)                                                        | Single-object child (Cheat-like)                                       |
|---------------------------|------------------------------------------|--------------------------------------------------------------------------|------------------------------------------------------------------------|
| Own route file/menu entry | Yes                                      | No — parent's route file (e.g. `musicRoutes.ts`), no `CatalogMenu` entry | No — parent's route file, no `CatalogMenu` entry                       |
| Store paging/filter       | Full `NameFilter`/custom filter + paging | Bare `IPagingFilter`, no named search                                    | None — one `Ref<I<Name>>`, no list                                     |
| Store statistics          | Yes (`load()` chains list → statistics)  | No                                                                       | No                                                                     |
| Connector/store params    | None extra                               | Parent uuid as leading param on every method                             | Parent uuid as leading param; uuid itself read from state              |
| Menu component            | Renders `<CatalogMenu/>` first           | Renders the parent's menu component first, takes parent uuid as a prop   | Renders the parent's menu component first, takes parent uuid as a prop |
| Reference implementation  | Genre (every layer skill's template)     | Song (under Music)                                                       | Cheat (under Game)                                                     |

A composite resource (Movie/Show/Book-shaped: multiple name fields, extra validated fields like year/IMDB code) is still "simple" in the sense of having no parent — it only changes the model layer
(`Change<Name>Request` when the request shape differs from the form shape) and the filter shape (`IMultipleNameFilter` instead of `INameFilter`), not the overall sequence or the other layers' shape.

Optional parts, in the order they're usually dropped as a resource gets simpler: statistics → `getAll()` (picker resources only, e.g. Genre is pick-listed from `MovieForm.vue`) → named search →
`duplicate`.

## Filter guide

Filters live in `src/model/common/Filter.ts`, each pairing an `I<X>Filter extends IPagingFilter` interface with an `<X>Filter extends PagingFilter implements I<X>Filter` class:

- `INameFilter`/`NameFilter` — single `name` field. Used by Genre, Game, Music, Program.
- `IMultipleNameFilter`/`MultipleNameFilter` — `czechName` + `originalName`. Used by Movie, Show, Book.
- Bare `IPagingFilter` (from `model/common/Paging.ts`) — no search fields at all. Used by Joke, Picture, and children (Song, ...).
- A genuinely new shape (e.g. `IAuthorFilter`/`AuthorFilter`, `IAccountFilter`/`AccountFilter`) gets its own pair added to `model/common/Filter.ts` — never to the resource's own model file. Every
  filter class: fields are optional, each paired with an `update<Field>(value)` setter that sets `undefined` on falsy input, and an overridden `toSearchParams(): SearchParams` built with
  `new SearchParams().add(...)` chains, always ending with `.add('page', this.page).add('limit', this.limit)`.

## Shared coding standards

- `<script setup lang="ts">` + Composition API only — never Options API, never Pinia/Vuex.
- Explicit `.ts`/`.vue` extensions on relative imports; imports alphabetically ordered within their group (matches existing code — check the real file, don't assume).
- Every user-facing string goes through `t('...')` — never hardcode text in a template or model error message.
- Naming: `<Name>Connector`/`<Name>Store`/`<Name>` (model class) — one per resource; `.vue` components in PascalCase.
- Connectors export the class **and** a default singleton instance (`export default new <Name>Connector();`); stores export the class only (views instantiate it themselves).
- Match existing formatting exactly — blank line after `{`/before `}` in TS class bodies, no semicolon-free style, etc. Don't fight the ESLint/Prettier config.
- Markdown (for any `.md` file you write, including these skills): lines at most 200 characters, filled as close to 200 as possible instead of wrapped early; indent continuation lines of a list
  item; tables padded with spaces so `|` separators align and separator rows filled with `-` to the full column width.

## Verification commands

- `npm run type-check` — TypeScript correctness.
- `npm run lint` — ESLint (auto-fix).
- `npm run build` — type-check + bundle.
- There is no test suite — verify UI-affecting changes manually via `npm run dev`.
- Always use the `npm` scripts above — never invoke `vite`/`vue-tsc`/`eslint` directly.
- Never commit as part of running a skill — that's a separate, explicit step for the user.
