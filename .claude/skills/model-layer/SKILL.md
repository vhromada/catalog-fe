---
name: model-layer
description: >-
  Use when adding or changing the model layer in catalog-fe — a new `model/<Name>.ts` file with its `I<Name>` DTO interface, `<Name>` class (vee-validate initial values), and `get<Name>Schema()`
  yup validator. Covers statistics interfaces, `Change<Name>Request`, numeric/array/time field validation, and where new filter shapes belong.
---

# Model layer

## Scope

The domain model file (`src/model/<Name>.ts`) for a catalog-fe resource: the API-facing DTO interface, the form-facing class, and its yup validation schema. Distinct from `model/common/`, the
shared types (`Result`, `Paging`, `Filter`, `Link`, `Time`, `View`) reused across every resource's model file.

Inline convention summary (full detail below): `I<Name>` has `uuid: string` first and matches the API DTO shape exactly; `I<Name>Statistics` sits in the same file (omitted for children); the
`<Name>` class has no `uuid`, fields in DTO order, a single constructor `(x?: I<Name>)` with if/else defaults; `get<Name>Schema()` is a function (not a module constant) because it calls
`useI18n()`. See `.claude/skills/new-resource/conventions.md` for the cross-layer picture (data flow, filter guide, coding standards).

## Files (Genre reference)

| File             | Purpose                                                         |
|------------------|-----------------------------------------------------------------|
| `model/Genre.ts` | `IGenre`, `IGenreStatistics`, `Genre` class, `getGenreSchema()` |

The real `src/model/Genre.ts` wins over the snippet below if they ever disagree.

## Genre template (embedded in full)

```typescript
import { useI18n } from 'vue-i18n';
import * as yup from 'yup';

export interface IGenre {
  uuid: string;
  name: string;
}

export interface IGenreStatistics {
  count: number;
}

export class Genre {

  name: string;

  constructor(genre?: IGenre) {
    if (genre) {
      this.name = genre.name;
    } else {
      this.name = '';
    }
  }

}

export function getGenreSchema() {
  const {t} = useI18n();
  return yup.object({
    name: yup.string()
      .required(t('errors.required', {field: t('items.name')}))
      .max(200, t('errors.max.string', {field: t('items.name').toLowerCase(), max: '${max}'}))
  });
}
```

## Conventions

- **`I<Name>` DTO**: `uuid: string` always first; optional API fields use `?:`. May extend `IWikiLink` and/or `IMediaLink` from `model/common/Link.ts` when the resource carries Wikipedia/IMDB/ČSFD
  links (see Movie, Music). Derived, read-only fields the backend computes (e.g. `formattedLength`) are part of the DTO but are **not** repeated on the `<Name>` class below.
- **`I<Name>Statistics`**: lives in the same file, right after the DTO; always has `count: number` plus any resource-specific aggregates (see `Movie.ts`'s `mediaCount`/`length`). Omit entirely for
  a child resource (Song, Cheat) — children have no statistics.
- **`<Name>` class**: no `uuid` property (uuid never changes after creation and the class is only ever used as form `initialValues`/request body). Fields appear in the same order as the DTO,
  minus `uuid` and minus any derived/read-only fields. A single constructor `(x?: I<Name>)` with `if (x) { ... } else { ... }` branches setting real defaults (`''`, `undefined`, `[]`, a fresh
  `new Time()`, `new Date().getFullYear()`, ...) — never a field initializer, never object spread, never a second constructor overload.
- **`get<Name>Schema()`**: a function, not a module-level `const` — it must call `useI18n()` internally to get a request-scoped `t`. Returns `yup.object({...})` with one key per form field:
  - string, required: `.required(t('errors.required', {field: t('items.x')}))` then `.max(N, t('errors.max.string', {field: t('items.x').toLowerCase(), max: '${max}'}))` — the `'${max}'` is a
    **literal** single-quoted template string, not interpolated by TS; yup substitutes it at validation time.
  - string, optional: same `.max(...)` call, no `.required(...)`.
  - number: add `.typeError(t('errors.required', {field: t('items.x')}))` after any `.min`/`.max`, since an empty numeric input parses to `NaN` rather than failing `.required`.
  - array: `.min(1, t('errors.min.list', {field: t('items.x').toLowerCase(), min: '${min}'}))` for "at least one" fields (languages, genres, media); plain `.of(yup.string().required(...))` with no
    `.min` for fields that may be empty (subtitles).
  - time: compose `getTimeSchema()` from `model/common/Time.ts` rather than writing hours/minutes/seconds fields by hand (see `Song.ts`, `Movie.ts`'s `media`).
  - a field whose i18n label lives under the resource's own namespace rather than the shared `items` block (e.g. `movies.items.year`) uses that key instead of `items.x` — match whatever
    `i18n-locales` actually placed the label under.

## Variations

- **`Change<Name>Request`**: add only when the request body shape differs from the form shape — typically because a `Time` field must be serialized to seconds (`length.getLength()`), a picker
  field needs ref-to-uuid-array mapping, or an empty-string field must become `undefined` on submit. See `Song.ts` (`length: song.length.getLength()`) and `Movie.ts` (full example with pickers).
  The request class takes a single constructor arg typed as the plain `<Name>` class and copies/transforms each field; `''` → `undefined` cleanup is inlined per field in the constructor.
- **`normalize()`**: for a simple resource with no `Change<Name>Request`, add a `normalize()` method on the `<Name>` class instead, doing the same `'' → undefined'` cleanup in place before the
  object is sent as the request body. See `Music.ts`.
- **New filter shapes**: never add a filter interface/class to the resource's own model file — extend `model/common/Filter.ts` instead (`extend PagingFilter`, add `update<Field>()` setters, and
  an overridden `toSearchParams()`). See the filter guide in `conventions.md`.

## Pitfalls

- Don't give the `<Name>` class a `uuid` field or a second constructor signature — one constructor, optional single argument, if/else defaults.
- Don't make `get<Name>Schema()` a module-level constant — it needs a fresh `useI18n()` call every time a form mounts.
- Don't write a bespoke filter class inline in the model file — see conventions.md's filter guide.
- Don't skip the `.typeError(...)` on numeric fields — without it, clearing a number input produces a confusing generic error instead of the proper "required" message.

## Checklist

- [ ] `I<Name>` has `uuid: string` first, matches the API DTO (including any `IWikiLink`/`IMediaLink` extension).
- [ ] `I<Name>Statistics` present unless this is a child resource.
- [ ] `<Name>` class has no `uuid`, single constructor with if/else defaults, fields in DTO order.
- [ ] `get<Name>Schema()` is a function calling `useI18n()`, one yup key per form field, using the exact `errors.required`/`errors.max.string`/`errors.min.list`/... keys and the literal
      `'${max}'`/`'${min}'` template strings.
- [ ] `Change<Name>Request` or `normalize()` added only if the request shape actually differs from the form shape.
- [ ] Any new filter shape was added to `model/common/Filter.ts`, not here.
