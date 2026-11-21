---
name: store-layer
description: >-
  Use when adding or changing the store layer in catalog-fe — a new `store/<Name>Store.ts` plain class (not Pinia/Vuex) wrapping a connector with paging/filter/reload logic. Covers the method
  order, the `load()` list-then-statistics chain, child-resource parent-uuid params, and the single-object child variant.
---

# Store layer

## Scope

`src/store/<Name>Store.ts` — one plain class per resource, instantiated per view (`const store = new GenreStore()`), holding Vue `Ref`s for state and wrapping `connector` calls with
paging/filter/reload logic. Views call store methods directly and read `store.x.value` in the template.

Inline convention summary (full detail below): public `Ref`s only for the list and `statistics`; non-reactive `private pagingInfo`/`private readonly filter`; a fixed method order; `load()`
chains list search → statistics; `add`/`update` don't reload, `remove`/`duplicate` do. See `.claude/skills/new-resource/conventions.md` for the cross-layer picture.

## Files (Genre reference)

| File                  | Purpose                                                  |
|-----------------------|----------------------------------------------------------|
| `store/GenreStore.ts` | list + paging + statistics wrapper over `GenreConnector` |

The real `src/store/GenreStore.ts` wins over the snippet below if they ever disagree.

## Genre template (embedded in full)

```typescript
import { ref, type Ref } from 'vue';
import genreConnector from '../connector/GenreConnector.ts';
import { type INameFilter, NameFilter } from '../model/common/Filter.ts';
import { type IPagingInfo } from '../model/common/Paging.ts';
import { type IResult, Result } from '../model/common/Result.ts';
import { Genre, type IGenre, type IGenreStatistics } from '../model/Genre.ts';
import config from '../utils/Config.ts';

export class GenreStore {

  genres: Ref<IGenre[]>;
  statistics: Ref<IGenreStatistics>;
  private pagingInfo: IPagingInfo;
  private readonly filter: NameFilter;

  constructor() {
    this.genres = ref([]);
    this.statistics = ref({} as IGenreStatistics);
    this.pagingInfo = {} as IPagingInfo;
    this.filter = new NameFilter();
  }

  async load(): Promise<IResult> {
    const genresResponse = await this.searchByFilter(this.filter);
    if (genresResponse.isOk()) {
      const statisticsResponse = await genreConnector.getStatistics();
      if (statisticsResponse.isOk()) {
        this.statistics.value = statisticsResponse.data!;
      }
      return statisticsResponse;
    } else {
      return genresResponse;
    }
  }

  async getAll(): Promise<IResult> {
    const filter = new NameFilter();
    filter.page = 1;
    filter.limit = config.allDataCount;
    return await this.searchByFilter(filter);
  }

  async search(name: string): Promise<IResult> {
    this.filter.updateName(name);
    this.filter.page = 1;
    return await this.searchByFilter(this.filter);
  }

  async first(): Promise<IResult> {
    this.filter.page = 1;
    return await this.searchByFilter(this.filter);
  }

  async previous(): Promise<IResult> {
    this.filter.page = this.pagingInfo.pageNumber - 1;
    return await this.searchByFilter(this.filter);
  }

  async next(): Promise<IResult> {
    this.filter.page = this.pagingInfo.pageNumber + 1;
    return await this.searchByFilter(this.filter);
  }

  async last(): Promise<IResult> {
    this.filter.page = this.pagingInfo.pagesCount;
    return await this.searchByFilter(this.filter);
  }

  async get(uuid: string): Promise<Result<IGenre>> {
    return await genreConnector.get(uuid);
  }

  async add(request: Genre): Promise<IResult> {
    return await genreConnector.add(request);
  }

  async update(uuid: string, request: Genre): Promise<IResult> {
    return await genreConnector.update(uuid, request);
  }

  async remove(uuid: string): Promise<IResult> {
    const response = await genreConnector.remove(uuid);
    if (response.isOk()) {
      return await this.load();
    } else {
      return response;
    }
  }

  async duplicate(uuid: string): Promise<IResult> {
    const response = await genreConnector.duplicate(uuid);
    if (response.isOk()) {
      return await this.load();
    } else {
      return response;
    }
  }

  exists(): boolean {
    return this.genres.value.length > 0;
  }

  isPagingAllowed(): boolean {
    return this.pagingInfo.pagesCount > 1;
  }

  canPrevious(): boolean {
    return this.pagingInfo.pageNumber > 1;
  }

  canNext(): boolean {
    return this.pagingInfo.pageNumber < this.pagingInfo.pagesCount;
  }

  getPage(): string {
    return `${this.pagingInfo.pageNumber} / ${this.pagingInfo.pagesCount}`;
  }

  private async searchByFilter(filter: INameFilter): Promise<IResult> {
    const response = await genreConnector.search(filter);
    if (response.isOk()) {
      this.genres.value = response.data!.data!;
      this.pagingInfo = response.data!.pagingInfo!;
    }
    return response;
  }

}
```

## Conventions

- Export the class only — no default singleton (views do `new <Name>Store()`, a fresh instance per view/component instance).
- Public `Ref`s only for the list (`ref([])`) and `statistics` (`ref({} as I<Name>Statistics)`) — anything else (`pagingInfo`, `filter`) stays `private` and non-reactive (plain fields, not
  `ref(...)`), since the template never reads them directly (it goes through `isPagingAllowed()`/`getPage()`/etc. instead).
- `private pagingInfo: IPagingInfo` and `private readonly filter: <X>Filter` — the filter instance is created once in the constructor and mutated in place by `search`/paging methods, never
  replaced.
- Method order: `load, getAll, search, first, previous, next, last, get, add, update, remove, duplicate, exists, isPagingAllowed, canPrevious, canNext, getPage, private searchByFilter`. Drop
  methods that don't apply (no `getAll` unless this resource is pick-listed elsewhere; no `search`/named filter fields if the filter is bare `IPagingFilter`), but keep the relative order of
  whatever remains.
- Every method returns `Promise<IResult>` except the typed `get(uuid): Promise<Result<I<Name>>>`, which callers need the concrete `data` from.
- `load()` chains list → statistics: call the private filtered search first, and only fetch statistics if that succeeded; return the **statistics** response on success (so a caller checking
  `isOk()` on `load()`'s result reflects the whole chain) and the **list** response on failure.
- `add`/`update` return the connector call directly — they do **not** reload the list (the view decides what to do next, usually navigating away).
- `remove`/`duplicate` call the connector, and `return await this.load()` only when `response.isOk()`; otherwise return the failed `response` as-is.
- `getAll()` exists only on resources that get pick-listed from another resource's form (Genre is pick-listed from `MovieForm.vue`): `page = 1`, `limit = config.allDataCount`, otherwise identical
  to a one-off filtered search.
- House-style non-null assertions: `response.data!.data!` and `response.data!.pagingInfo!` in `searchByFilter`, `statisticsResponse.data!` in `load()` — the backend contract guarantees these are
  present on a `200`, so don't add defensive `if` checks instead of the assertions.

## Variations

- **Child resource** (Song-like): `load(parent: string)` inlines what would otherwise be the private `searchByFilter` (no statistics step, so there's nothing to chain); every paging method
  (`first`/`previous`/`next`/`last`) and every passthrough method (`get`/`add`/`update`/`remove`/`duplicate`) takes the parent uuid as its first parameter and forwards it to the connector. No
  `statistics` `Ref`, no `getAll`, no named `search` (the filter is a bare `PagingFilter`, not a named filter — there's no search box on a child list view). See `store/SongStore.ts`.
- **Single-object child** (Cheat-like): one `Ref<I<Name>>` (not an array) and no paging at all. `load(parent: string)` calls the connector's `find(parent)` and sets the ref directly.
  `remove(parent: string)` reads the uuid off `this.cheat.value.uuid` itself (the view never has a separate uuid to pass) and does **not** reload afterwards (there's nothing to reload into — the
  view navigates back to the parent list instead). See `store/CheatStore.ts`.

## Pitfalls

- Don't make `pagingInfo`/`filter` public `Ref`s — they're intentionally plain private fields; only the list and `statistics` are reactive public state.
- Don't have `add`/`update` reload the list — only `remove`/`duplicate` do, and only after confirming `isOk()`.
- Don't add `getAll()` to a resource that nothing ever pick-lists — it's not a default part of every store.
- Don't give a child or single-object-child store a `statistics` `Ref` or `getStatistics` call.

## Checklist

- [ ] Class export only, no default singleton.
- [ ] Public `Ref`s limited to the list and `statistics`; `pagingInfo`/`filter` are private, non-reactive.
- [ ] Method order matches the canonical list (minus whatever doesn't apply).
- [ ] `load()` chains list → statistics correctly, returning the right response on each branch.
- [ ] `add`/`update` don't reload; `remove`/`duplicate` reload only on `isOk()`.
- [ ] Child resource: every method takes the parent uuid first, no statistics/`getAll`/named search. Single-object child: one `Ref`, no paging, `remove(parent)` reads uuid from state.
