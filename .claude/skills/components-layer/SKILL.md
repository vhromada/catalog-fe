---
name: components-layer
description: >-
  Use when adding or changing resource components in catalog-fe — `components/<plural>/<Name>Form.vue` and `<Name>Menu.vue` (plus an optional local search form). Covers the vee-validate form
  wiring, the inner-navbar menu pattern, child-menu chaining, shared search forms, pickers, and the PictureForm exception.
---

# Components layer

## Scope

`src/components/<plural>/<Name>Form.vue` (create/edit form) and `<Name>Menu.vue` (resource sub-navigation), plus an optional local `<Name>SearchForm.vue`. Cross-resource reusable components
(`NameSearchForm.vue`, `ResultError.vue`, `ErrorMessage.vue`, `TimeComponent.vue`) live directly under `src/components` and are reused, not reimplemented.

Inline convention summary (full detail below): the form uses `useForm({validationSchema: get<Name>Schema(), initialValues: props.<name>})` + `handleSubmit`, one `<div class="col my-2">` block
per field; the menu renders `<CatalogMenu/>` (or, for a child resource, the parent's menu) followed by an inner Bootstrap navbar with list/add links. See
`.claude/skills/new-resource/conventions.md` for the cross-layer picture.

## Files (Genre reference)

| File                              | Purpose                 |
|-----------------------------------|-------------------------|
| `components/genres/GenreForm.vue` | create/edit form        |
| `components/genres/GenreMenu.vue` | resource sub-navigation |

The real files win over the snippets below if they ever disagree.

## `GenreForm.vue` template (embedded in full)

```vue
<script setup lang="ts">
import { Field, useForm } from 'vee-validate';
import { useI18n } from 'vue-i18n';
import { Genre, getGenreSchema } from '../../model/Genre.ts';
import ErrorMessage from '../ErrorMessage.vue';

const props = defineProps({
  genre: {type: Genre, required: true},
  uuid: {type: String}
});
const emit = defineEmits(['submit', 'cancel']);
const {t} = useI18n();
const {handleSubmit, errorBag} = useForm({
  validationSchema: getGenreSchema(),
  initialValues: props.genre
});
const onSubmit = handleSubmit((values) => {
  emit('submit', values);
});

function onCancel() {
  emit('cancel');
}
</script>

<template>
  <form method="POST" @submit="onSubmit">
    <fieldset>
      <div class="col my-2">
        <label class="form-label" for="name">{{ t('items.name') }}</label>
        <Field type="text" id="name" name="name" class="form-control"/>
        <ErrorMessage :errors="errorBag.name"/>
      </div>
      <div class="col mt-4">
        <button type="submit" id="create" name="create" class="btn btn-primary" v-if="!props.uuid">{{ t('links.create') }}</button>
        <button type="submit" id="update" name="update" class="btn btn-primary" v-if="props.uuid">{{ t('links.update') }}</button>
        <button type="button" id="cancel" name="cancel" class="btn btn-danger" @click="onCancel">{{ t('links.cancel') }}</button>
      </div>
    </fieldset>
  </form>
</template>
```

## `GenreMenu.vue` template (embedded in full)

```vue
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import CatalogMenu from '../CatalogMenu.vue';

const {t} = useI18n();
</script>

<template>
  <CatalogMenu/>
  <div class="navbar navbar-expand-lg navbar-light bg-light innerMenu">
    <div class="container-fluid">
      <button type="button" class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#genreNavbarCollapse" aria-controls="genreNavbarCollapse" aria-expanded="false"
              aria-label="Toggle genre navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div id="genreNavbarCollapse" class="collapse navbar-collapse">
        <ul class="nav navbar-nav">
          <li class="nav-item">
            <router-link id="genreListNavigation" class="nav-link" :to="{name: 'genres'}">{{ t('genres.menu.list') }}</router-link>
          </li>
          <li class="nav-item">
            <router-link id="addGenreNavigation" class="nav-link" :to="{name: 'addGenre'}">{{ t('genres.form.add') }}</router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
```

## Conventions

### Form

- Props: `{<name>: {type: <Name>, required: true}, uuid: {type: String}}` — `<name>` is the lowercase resource name (`genre`, `song`, ...); `uuid` is optional and purely a UI switch (its
  presence decides whether the Create or Update button renders), **not** used to decide the HTTP verb — that's the view's job.
- Emits exactly `['submit', 'cancel']`.
- `useForm({validationSchema: get<Name>Schema(), initialValues: props.<name>})`, destructuring `handleSubmit` and `errorBag`. `onSubmit = handleSubmit((values) => { emit('submit', values); })` —
  or, when a `Change<Name>Request` exists, `handleSubmit((values: <Name>) => { const request = new Change<Name>Request(values); emit('submit', request); })` (see `SongForm.vue`).
- Template root is `<form method="POST" @submit="onSubmit">` — no `.prevent` (vee-validate's `handleSubmit` already prevents default submission).
- One `<div class="col my-2">` per field: `<label class="form-label" for="<field>">{{ t('...') }}</label>`, the `<Field .../>` itself (`class="form-control"`, matching `id`/`name`), then
  `<ErrorMessage :errors="errorBag.<field>"/>`.
- Buttons live in a trailing `<div class="col mt-4">`, always this exact triple: `id="create"`/`name="create"` shown `v-if="!props.uuid"`, `id="update"`/`name="update"` shown `v-if="props.uuid"`,
  and `id="cancel"`/`name="cancel"` with `@click="onCancel"` (a local function that just `emit('cancel')`).

### Menu

- `<CatalogMenu/>` first (top-level nav), then the inner navbar: `class="navbar navbar-expand-lg navbar-light bg-light innerMenu"`, a collapse toggler targeting `#<name>NavbarCollapse`, and the
  links inside `<ul class="nav navbar-nav">`.
- Link ids/route names: `<name>ListNavigation` → `{name: '<plural>'}`, `add<Name>Navigation` → `{name: 'add<Name>'}`. Add further links (e.g. a detail-list link) in the same pattern if the
  resource has them.
- A child resource's menu renders the **parent's** menu component instead of `<CatalogMenu/>`, and takes the parent uuid as a required prop to build its own links' route params — see Variations.

### Search forms

- Reuse the shared `components/NameSearchForm.vue` (single `name` field) or `MultipleNameSearchForm.vue` (czech/original name pair) whenever the resource's filter is `INameFilter` or
  `IMultipleNameFilter` — don't write a per-resource search form for a shape that's already covered.
- Write a local `<Name>SearchForm.vue` only when neither shared form fits. It does **not** use vee-validate/yup — plain `ref`s for each field and `@submit.prevent="onSubmit()"` emitting
  `'search'` with the raw value(s) (see `NameSearchForm.vue` itself for the exact plain-ref pattern to copy).
- A child or single-object-child resource typically has no search form at all (its list view has no search box) — don't add one unless the resource spec calls for it.

### Time fields and pickers

- A `Time`-typed field renders via the shared `TimeComponent.vue`: `<TimeComponent path="<field>" :errorBag="errorBag"/>` for a single field, or `:path="`<field>[${index}]`" :prefix="..."` inside
  a `FieldArray` loop for a repeatable one (see `MovieForm.vue`'s `media`).
- A field that picks from another resource's full list (e.g. Movie's `genres`) loads its options via that other resource's store `getAll()` method, called once at the top level of
  `<script setup>` (not `onMounted`), then renders a multiple `<Field as="select">` iterating `<otherStore>.<resource>.value` — see `MovieForm.vue`'s `genreStore.getAll()` +
  `<Field id="genres" name="genres" :multiple="true" as="select" ...>` block. Only add this if the resource spec says this new resource is pick-listed from, or itself picks from, another one.

## Variations

- **Child resource menu** (Song-like): props `{<parent>: {type: String, required: true}}`; renders the parent's menu component (`<MusicMenu/>`, no props) instead of `<CatalogMenu/>`; every
  `router-link` passes `params: {<parent>: props.<parent>}` alongside the route name. See `components/songs/SongMenu.vue`.
- **Child resource form** (Song-like): adds a `<parent>: {type: String, required: true}` prop purely so a view embedding the form can supply it uniformly, even if the form itself never reads it
  directly in the template. See `components/songs/SongForm.vue`.
- **Single-object child menu/form** (Cheat-like): the menu takes the parent uuid prop and renders the parent's menu, same as above, but has only one link (no separate "add" link — a
  single-object child is added/edited from the same place). The form may use `FieldArray` for a repeatable nested block (`data`) with its own per-item `Field`s named `` `data[${index}].<field>` ``
  and a typed `(errorBag as any)[`data[${index}].<field>`]` lookup (TypeScript can't type a dynamic key here) — see `components/cheats/CheatForm.vue`.
- **File upload** (Picture-like): `PictureForm.vue` intentionally does **not** use vee-validate/yup at all — plain `ref`s for the file and a hand-rolled `error` message, since the validation
  (a file-size check) doesn't map to a schema field. **Do not "fix" this into the yup pattern** — it's a deliberate exception, not an oversight.

## Pitfalls

- Don't use `.prevent` on the main form's `@submit` — only a hand-rolled search form (no vee-validate) uses `@submit.prevent`.
- Don't let the `uuid` prop influence anything except which button renders — the view decides create vs. update.
- Don't write a new search form when `NameSearchForm.vue`/`MultipleNameSearchForm.vue` already fits the filter shape.
- Don't "fix" `PictureForm.vue`'s lack of vee-validate — it's intentional, see Variations.

## Checklist

- [ ] Form: props/emits match the standard shape; `useForm` wired to `get<Name>Schema()`/`props.<name>`; one `<div class="col my-2">` block per field with label + `Field` + `ErrorMessage`; the
      fixed create/update/cancel button triple.
- [ ] Menu: parent nav component first (`CatalogMenu` or, for a child, the parent's menu), inner navbar with the standard collapse/link pattern and ids.
- [ ] Reused a shared search form if the filter shape allows it; wrote a local one only if genuinely needed, with no vee-validate.
- [ ] Time fields go through `TimeComponent.vue`; picker fields load via another store's `getAll()` called at `<script setup>` top level.
- [ ] Child/single-object-child variations applied where the resource shape calls for them; `PictureForm.vue`'s plain-ref pattern left untouched if touched at all.
