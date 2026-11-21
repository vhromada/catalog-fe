---
name: views-layer
description: >-
  Use when adding or changing resource views in catalog-fe — `views/<plural>/<Name>ListView.vue`, `Add<Name>View.vue`, `Edit<Name>View.vue` (plus an optional DetailView). Covers the shared
  menu/container/ResultError shell, the list view's search/table/pagination/statistics sections, and the add/edit submit-then-navigate flow.
---

# Views layer

## Scope

`src/views/<plural>/<Name>ListView.vue`, `Add<Name>View.vue`, `Edit<Name>View.vue` — the route-level pages for a resource, wired up in `router/<plural>Routes.ts`. An optional
`<Name>DetailView.vue` follows the same shell when the resource spec calls for one.

Inline convention summary (full detail below): every view renders `<Name>Menu/>` first, then a `.container-fluid` with an `<h2>` title, then `<ResultError/>` **outside** the container; the store
is instantiated and `load()`-ed at `<script setup>` top level, never inside `onMounted`. See `.claude/skills/new-resource/conventions.md` for the cross-layer picture.

## Files (Genre reference)

| File                             | Purpose                                  |
|----------------------------------|------------------------------------------|
| `views/genres/GenreListView.vue` | search + table + pagination + statistics |
| `views/genres/AddGenreView.vue`  | create form                              |
| `views/genres/EditGenreView.vue` | edit form                                |

The real files win over the snippets below if they ever disagree.

## `GenreListView.vue` template (embedded in full)

```vue
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import GenreMenu from '../../components/genres/GenreMenu.vue';
import NameSearchForm from '../../components/NameSearchForm.vue';
import ResultError from '../../components/ResultError.vue';
import { GenreStore } from '../../store/GenreStore.ts';

const {t} = useI18n();
const store = new GenreStore();

store.load();

async function duplicate(uuid: string) {
  await store.duplicate(uuid);
}

async function remove(uuid: string) {
  await store.remove(uuid);
}

async function search(name: string) {
  await store.search(name);
}

async function first() {
  await store.first();
}

async function previous() {
  await store.previous();
}

async function next() {
  await store.next();
}

async function last() {
  await store.last();
}
</script>

<template>
  <GenreMenu/>
  <div class="container-fluid">
    <h2>{{ t('genres.title') }}</h2>
    <NameSearchForm @search="search"/>
    <div class="table-responsive" v-if="store.exists()">
      <table id="genres" class="table table-hover" aria-describedby="List of genres">
        <thead>
          <tr>
            <th data-nav="name">{{ t('genres.header') }}</th>
            <th data-nav="duplicate"></th>
            <th data-nav="edit"></th>
            <th data-nav="remove"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="genre in store.genres.value" :key="genre.uuid">
            <td data-nav="name">{{ genre.name }}</td>
            <td data-nav="duplicate">
              <a href="#" @click.prevent="duplicate(genre.uuid)">{{ t('links.duplicate') }}</a>
            </td>
            <td data-nav="edit">
              <router-link :to="{name: 'editGenre', params: {uuid: genre.uuid}}">{{ t('links.edit') }}</router-link>
            </td>
            <td data-nav="remove">
              <a href="#" @click.prevent="remove(genre.uuid)">{{ t('links.remove') }}</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <nav aria-label="Genres pagination" v-if="store.isPagingAllowed()">
      <ul class="pagination justify-content-center">
        <li class="page-item" v-if="store.canPrevious()">
          <a id="first" href="#" class="page-link" aria-label="First" @click="first()">&laquo;&laquo;</a>
        </li>
        <li class="page-item" v-if="store.canPrevious()">
          <a id="previous" href="#" class="page-link" aria-label="Previous" @click="previous()">&laquo;</a>
        </li>
        <li class="page-item">
          <a id="pageInfo" href="#" class="page-link disabled">{{ store.getPage() }}</a>
        </li>
        <li class="page-item" v-if="store.canNext()">
          <a id="next" href="#" class="page-link" aria-label="Next" @click="next()">&raquo;</a>
        </li>
        <li class="page-item" v-if="store.canNext()">
          <a id="last" href="#" class="page-link" aria-label="Last" @click="last()">&raquo;&raquo;</a>
        </li>
      </ul>
    </nav>
    <div class="table-responsive">
      <table id="statistics" class="table" aria-describedby="Statistics for genres">
        <thead>
          <tr>
            <th data-nav="count">{{ t('genres.statistics.count') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td data-nav="count">{{ store.statistics.value.count }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <ResultError/>
</template>
```

## `AddGenreView.vue` template (embedded in full)

```vue
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import GenreForm from '../../components/genres/GenreForm.vue';
import GenreMenu from '../../components/genres/GenreMenu.vue';
import ResultError from '../../components/ResultError.vue';
import { type IResult } from '../../model/common/Result.ts';
import { Genre } from '../../model/Genre.ts';
import { GenreStore } from '../../store/GenreStore.ts';

const router = useRouter();
const {t} = useI18n();
const store = new GenreStore();
const genre = new Genre();

async function onSubmit(genre: Genre) {
  await store.add(genre).then((result: IResult) => {
    if (result.isOk()) {
      router.push({name: 'genres'});
    }
  });
}

function onCancel() {
  router.push({name: 'genres'});
}
</script>

<template>
  <GenreMenu/>
  <div class="container-fluid">
    <h2>{{ t('genres.form.add') }}</h2>
    <GenreForm :genre="genre" @submit="onSubmit" @cancel="onCancel"/>
  </div>
  <ResultError/>
</template>
```

## `EditGenreView.vue` template (embedded in full)

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import GenreForm from '../../components/genres/GenreForm.vue';
import GenreMenu from '../../components/genres/GenreMenu.vue';
import ResultError from '../../components/ResultError.vue';
import { type IResult, Result } from '../../model/common/Result.ts';
import { Genre, type IGenre } from '../../model/Genre.ts';
import { GenreStore } from '../../store/GenreStore.ts';

const props = defineProps({
  uuid: {type: String, required: true}
});
const router = useRouter();
const {t} = useI18n();
const store = new GenreStore();
const genre = ref({} as Genre);
const loaded = ref(false);

loadGenre();

async function loadGenre() {
  await store.get(props.uuid).then((result: Result<IGenre>) => {
    if (result.isOk()) {
      genre.value = new Genre(result.data!);
      loaded.value = true;
    }
  });
}

async function onSubmit(genre: Genre) {
  await store.update(props.uuid, genre).then((result: IResult) => {
    if (result.isOk()) {
      router.push({name: 'genres'});
    }
  });
}

function onCancel() {
  router.push({name: 'genres'});
}
</script>

<template>
  <GenreMenu/>
  <div class="container-fluid">
    <h2>{{ t('genres.form.edit') }}</h2>
    <GenreForm :genre="genre" :uuid="props.uuid" @submit="onSubmit" @cancel="onCancel" v-if="loaded"/>
  </div>
  <ResultError/>
</template>
```

## Conventions

- Shared shell across every view: `<Name>Menu/>` first, `.container-fluid` with `<h2>{{ t('<plural>.<title-key>') }}</h2>`, then the view-specific content, then `<ResultError/>` **as a sibling
  after the container**, not inside it.
- `const store = new <Name>Store();` and the initial `store.load()` (or `store.get(...)`) call happen at the top level of `<script setup>`, immediately after construction — never inside
  `onMounted`. Every other store call lives in a small `async function` triggered from a template event handler.

### List view

- `NameSearchForm`/`MultipleNameSearchForm`/a local search form first (only if the resource has one), then `<div class="table-responsive" v-if="store.exists()">` wrapping a
  `<table id="<plural>" class="table table-hover" aria-describedby="List of <plural>">`. Every `<th>`/`<td>` carries a `data-nav="<field>"` attribute (used by whatever drives UI tests/tooling
  against these ids) — including the empty duplicate/edit/remove header cells.
- Row actions, in this column order: duplicate (`<a href="#" @click.prevent="duplicate(uuid)">`), edit (`<router-link :to="{name: 'edit<Name>', params: {uuid}}">`), remove
  (`<a href="#" @click.prevent="remove(uuid)">`) — drop whichever of the three the resource doesn't support (e.g. a child resource may still have all three; a single-object child has none of
  these, see Variations).
- Pagination block: `<nav aria-label="<Plural> pagination" v-if="store.isPagingAllowed()">` wrapping a 5-item `<ul class="pagination justify-content-center">` —
  first/previous/pageInfo/next/last, ids exactly `first`/`previous`/`pageInfo`/`next`/`last`, `v-if="store.canPrevious()"` guarding first/previous and `v-if="store.canNext()"` guarding next/last.
- Statistics table last: `<table id="statistics" class="table" aria-describedby="Statistics for <plural>">`, one `<th>`/`<td>` pair per statistic, each with a matching `data-nav`. Omit this
  whole block for a child/single-object-child resource (no statistics).

### Add view

- `const <name> = new <Name>();` — a fresh blank model instance passed to the form as `initialValues`.
- `onSubmit(<name>: <Name>)` (or the `Change<Name>Request` type, if the form emits that) calls `store.add(...)`, and on `result.isOk()` does `router.push({name: '<plural>'})`.
- `onCancel()` pushes the same route as a successful submit.

### Edit view

- `uuid` prop, `{type: String, required: true}` — the route is registered with `props: true` so vue-router supplies it from the URL.
- A `loaded = ref(false)` gates `v-if="loaded"` on the `<Name>Form/>` itself, so the form doesn't mount with an empty/undefined model before the fetch resolves.
- `const <name> = ref({} as <Name>);` then an immediately-invoked `load<Name>()` function that calls `store.get(uuid)`, and on success does `<name>.value = new <Name>(result.data!);` followed by
  `loaded.value = true;` — always rebuild through the model class constructor, don't assign the raw DTO.
- `onSubmit` calls `store.update(uuid, ...)`, same `isOk()` → `router.push` pattern as the add view.

## Variations

- **Child resource list view** (Song-like): takes the parent uuid as a required prop, passes it through to every store call and to the menu component; drops the search form (bare
  `IPagingFilter`, no search box) and the statistics table; adds a `<span id="noData" v-if="!store.exists()">{{ t('<plural>.noData') }}</span>` empty state instead. The name cell is a
  `router-link` to a detail route when one exists (see `SongListView.vue`), a plain `<td>` otherwise.
- **Child resource add/edit view** (Song-like): also takes the parent uuid prop, forwards it to the form/menu, and to every store call. An add view for a child under a resource that itself needs
  loading first (e.g. confirming the parent exists) may also instantiate the **parent's** store and call `parentStore.get(parentUuid)` at top level purely to trigger that fetch, even without
  using the result directly (see `AddSongView.vue`'s unused `musicStore.get(props.music)`).
- **Single-object child view** (Cheat-like): no separate list view in the usual sense — one view (e.g. `CheatListView.vue`) shows the single object's data read-only
  (`v-if="store.cheat.value.uuid"`) plus edit/remove links, with no pagination/statistics at all. Its `remove()` pushes to the **parent's** list route (`{name: 'games'}`), not its own, since
  there's no "own list" to return to. The add view's `onCancel()` likewise pushes to the parent's route, not a same-resource one — compare `AddCheatView.vue` (pushes `{name: 'games'}` on
  cancel, `{name: 'cheats'}` on submit) against `EditCheatView.vue` (pushes `{name: 'cheats'}` on both).
- **Detail view**: when the resource spec calls for one (optional on any shape), it's a read-only page following the same menu/container/ResultError shell, fetching via `store.get(uuid)` at top
  level and rendering fields directly (no form). Route name `<name>Detail`, registered with `props: true`.

## Pitfalls

- Don't move the initial `store.load()`/`store.get(...)` call into `onMounted` — it belongs at `<script setup>` top level.
- Don't put `<ResultError/>` inside the `.container-fluid` div — it's a sibling after it.
- Don't assign the raw fetched DTO straight into the ref in an edit view — always rebuild through `new <Name>(result.data!)`.
- Don't add a statistics table or search form to a child/single-object-child view.

## Checklist

- [ ] Every view: menu component first, `.container-fluid` + `<h2>`, `<ResultError/>` as a trailing sibling; store constructed and loaded at script top level.
- [ ] List view: search form (if applicable) → table with `data-nav` on every cell → 5-item pagination guarded by `isPagingAllowed()`/`canPrevious()`/`canNext()` → statistics table (if
      applicable).
- [ ] Add view: blank model instance, submit → `store.add` → push on `isOk()`, cancel → same push.
- [ ] Edit view: `uuid` prop, `loaded` ref gating the form, entity rebuilt via `new <Name>(result.data!)`, submit → `store.update` → push on `isOk()`.
- [ ] Child/single-object-child variations applied where the resource shape calls for them (parent uuid prop threaded through, no statistics/search, correct push targets on cancel/remove).
